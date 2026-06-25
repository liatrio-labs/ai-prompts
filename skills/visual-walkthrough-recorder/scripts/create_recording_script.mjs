#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { validateRecordingConfigShape } from "./lib/config_validation.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function slugify(value) {
  return String(value || "walkthrough")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "walkthrough";
}

async function loadConfig() {
  const configPath = argValue("--config");
  if (!configPath) {
    throw new Error("Usage: create_recording_script.mjs --config=recording-config.json");
  }

  const rawConfig = await readFile(path.resolve(configPath), "utf8");
  return JSON.parse(rawConfig);
}

function generatedScript(config) {
  const branchSlug = slugify(config.branchSlug);
  const outputDir = config.outputDir || `../walkthrough-artifacts/${branchSlug}`;
  const videoName = config.videoName || `${branchSlug}-walkthrough`;
  const captionPosition = config.captionPosition || "bottom-right";
  const browserMode = config.browserMode || "headless";
  const steps = Array.isArray(config.steps) ? config.steps : [];
  const preRecordSteps = Array.isArray(config.preRecordSteps) ? config.preRecordSteps : [];

  return `#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { access, copyFile, mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

function requirePlaywright() {
  const errors = [];
  const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
  try {
    return requireFromCwd("playwright");
  } catch (error) {
    errors.push(\`local: \${error.message}\`);
  }

  const globalRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8" });
  const globalNodeModules = globalRoot.status === 0 ? globalRoot.stdout.trim() : "";
  if (globalNodeModules) {
    try {
      return createRequire(path.join(globalNodeModules, "package.json"))("playwright");
    } catch (error) {
      errors.push(\`global: \${error.message}\`);
    }
  } else if (globalRoot.error || globalRoot.stderr) {
    errors.push(\`global: \${(globalRoot.error || globalRoot.stderr).toString().trim()}\`);
  }

  throw new Error(
    \`Cannot find playwright. Install it in the app repo or globally with npm install -g playwright. \${errors.join(" | ")}\`
  );
}

const { chromium } = requirePlaywright();

const config = ${JSON.stringify(
    {
      ...config,
      branchSlug,
      outputDir,
      videoName,
      captionPosition,
      browserMode,
      steps,
      preRecordSteps,
    },
    null,
    2,
  )};

const outputDir = path.resolve(config.outputDir);
const videoDir = path.join(outputDir, "videos");
const screenshotDir = path.join(outputDir, "screenshots");
const tmpDir = path.join(outputDir, "tmp");
const rawVideoDir = path.join(tmpDir, "raw-video");
const runLogPath = path.join(outputDir, "run-log.md");
const htmlPath = path.join(outputDir, "walkthrough.html");
const mrDescriptionPath = path.join(outputDir, "mr-description.md");
const scriptPath = fileURLToPath(import.meta.url);
const htmlScreenshots = [];
const htmlOnly = Boolean(config.htmlOnly || config.html_only);
const mrDescriptionTemplate = config.mrDescriptionTemplate;

function wantsMrDescription() {
  return Boolean(config.includeMrDescription || config.include_mr_description);
}

function missingMrDescriptionFields() {
  if (!wantsMrDescription()) return [];
  const missing = [];
  if (!Array.isArray(config.mrSummaryItems) || config.mrSummaryItems.filter(Boolean).length === 0) missing.push("mrSummaryItems");
  if (!Array.isArray(config.mrChangeItems) || config.mrChangeItems.filter(Boolean).length === 0) missing.push("mrChangeItems");
  if (!Array.isArray(config.validationItems) || config.validationItems.filter(Boolean).length === 0) missing.push("validationItems");
  return missing;
}

function bulletList(items) {
  const cleaned = (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return cleaned.map((item) => "- " + item).join("\\n");
}

function renderTemplate(template, values) {
  return template.replace(/{{(summary|whatChanged|validation)}}/g, (_match, key) => values[key] || "");
}

function mrValidationLines() {
  const userValidation = Array.isArray(config.validationItems)
    ? config.validationItems.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  return bulletList(userValidation);
}

async function writeMrDescription() {
  if (!wantsMrDescription()) return null;
  const missing = missingMrDescriptionFields();
  if (missing.length > 0) {
    throw new Error("MR description requires explicit " + missing.join(", ") + ".");
  }
  const output = renderTemplate(mrDescriptionTemplate, {
    summary: bulletList(config.mrSummaryItems),
    whatChanged: bulletList(config.mrChangeItems),
    validation: mrValidationLines(),
  });
  await writeFile(mrDescriptionPath, output.endsWith("\\n") ? output : output + "\\n");
  return mrDescriptionPath;
}

function absoluteUrl(url) {
  if (!url) return config.baseUrl;
  if (/^https?:\\/\\//.test(url)) return url;
  return new URL(url, config.baseUrl).href;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function captionCss(position) {
  const vertical = position.startsWith("top") ? "top: 24px;" : "bottom: 24px;";
  const horizontal = position.endsWith("left") ? "left: 24px;" : "right: 24px;";
  return vertical + horizontal;
}

async function locatorFor(page, selector) {
  if (!selector) return null;
  const base = selector.within ? await resolveLocator(page, selector.within, "within selector") : page;
  const exact = selector.exact !== false;
  if (selector.role) return base.getByRole(selector.role, { name: selector.name, exact });
  if (selector.label) return base.getByLabel(selector.label, { exact });
  if (selector.testId) return base.getByTestId(selector.testId);
  if (selector.text) return base.getByText(selector.text, { exact });
  if (selector.css) return base.locator(selector.css, selector.hasText ? { hasText: selector.hasText } : undefined);
  throw new Error("Unsupported selector: " + JSON.stringify(selector));
}

async function resolveLocator(page, selector, context = "selector", options = {}) {
  const baseLocator = await locatorFor(page, selector);
  if (!baseLocator) return null;
  const hasExplicitIndex = Number.isInteger(selector?.nth);
  const locator = hasExplicitIndex ? baseLocator.nth(selector.nth) : baseLocator;
  await locator.waitFor({ state: "visible", timeout: options.timeout ?? 8000 });
  const count = await baseLocator.count().catch(() => null);
  if (count > 1 && !hasExplicitIndex && selector?.allowMultiple !== true) {
    throw new Error(
      "Ambiguous " + context + " " + JSON.stringify(selector) + " matched " + count
      + " elements. Refine with an exact role/name, label, testId, css+hasText, or an explicit nth index."
    );
  }
  return locator;
}

async function scrollLocatorIntoPaddedView(page, locator) {
  await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await locator.evaluate((element, padding) => {
    element.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let deltaX = 0;
    let deltaY = 0;

    if (rect.left < padding) deltaX = rect.left - padding;
    else if (rect.right > viewportWidth - padding) deltaX = rect.right - (viewportWidth - padding);

    if (rect.top < padding) deltaY = rect.top - padding;
    else if (rect.bottom > viewportHeight - padding) deltaY = rect.bottom - (viewportHeight - padding);

    if (deltaX || deltaY) window.scrollBy({ left: deltaX, top: deltaY, behavior: "instant" });
  }, config.scrollPaddingPx ?? config.highlightViewportPadding ?? 96).catch(() => {});
  await page.waitForTimeout(config.scrollPauseMs || 250);
}

async function assertStepWaitFor(page, waitFor, context = "waitFor") {
  if (!waitFor) return;
  if (waitFor.url) {
    await page.waitForURL(waitFor.url, { timeout: waitFor.timeoutMs || 8000 });
    return;
  }
  if (waitFor.text || waitFor.role || waitFor.label || waitFor.testId || waitFor.css) {
    await resolveLocator(page, waitFor, context, { timeout: waitFor.timeoutMs || 8000 });
    return;
  }
  throw new Error("Unsupported waitFor in " + context + ": " + JSON.stringify(waitFor));
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: options.stdio || "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(\`\${command} exited with \${code}\`));
    });
  });
}

async function hasCommand(command) {
  try {
    await run(command, ["-version"]);
    return true;
  } catch {
    return false;
  }
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertToMp4(inputPath, outputPath) {
  await run("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath,
  ]);
}

async function removeIfExists(filePath) {
  if (await exists(filePath)) await unlink(filePath);
}

async function writeHtmlWalkthrough(outputPath) {
  const cards = htmlScreenshots.map((shot, index) => \`
    <article class="card">
      <div class="card-header">
        <span>\${String(index + 1).padStart(2, "0")}</span>
        <h2>\${escapeHtml(shot.title || \`Step \${index + 1}\`)}</h2>
      </div>
      \${shot.description ? \`<p>\${escapeHtml(shot.description)}</p>\` : ""}
      <img src="\${escapeHtml(shot.src)}" alt="\${escapeHtml(shot.title || \`Step \${index + 1}\`)}" />
    </article>\`).join("\\n");

  await writeFile(outputPath, \`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>\${escapeHtml(config.htmlTitle || "Visual Walkthrough")}</title>
  <style>
    :root { --bg: #f8fafc; --surface: #fff; --text: #0f172a; --muted: #475569; --border: #dbe3ef; --accent: #2563eb; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.5; }
    header { padding: 40px max(24px, calc((100vw - 1120px) / 2)) 24px; border-bottom: 1px solid var(--border); background: var(--surface); }
    h1 { margin: 0 0 12px; font-size: clamp(28px, 4vw, 42px); line-height: 1.1; }
    .summary { color: var(--muted); max-width: 760px; margin: 0 0 16px; }
    .meta { display: flex; flex-wrap: wrap; gap: 10px; color: var(--muted); font-size: 14px; }
    .meta span { padding: 6px 10px; border: 1px solid var(--border); border-radius: 999px; background: #f8fafc; }
    main { width: min(1120px, calc(100vw - 48px)); margin: 28px auto 56px; display: grid; gap: 24px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
    .card-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px 0; }
    .card-header span { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 999px; background: var(--accent); color: white; font-weight: 800; font-size: 13px; }
    h2 { margin: 0; font-size: 20px; }
    .card p { margin: 10px 20px 16px; color: var(--muted); }
    img { display: block; width: 100%; border-top: 1px solid var(--border); background: #e2e8f0; }
  </style>
</head>
<body>
  <header>
    <h1>\${escapeHtml(config.htmlTitle || "Visual Walkthrough")}</h1>
    \${config.htmlSummary ? \`<p class="summary">\${escapeHtml(config.htmlSummary)}</p>\` : ""}
    <div class="meta">
      <span>Branch: \${escapeHtml(config.currentBranch || "unknown")}</span>
      <span>Target: \${escapeHtml(config.targetBranch || "main")}</span>
      <span>Generated: \${escapeHtml(new Date().toISOString())}</span>
    </div>
  </header>
  <main>\${cards}</main>
</body>
</html>\`);
}

async function installOverlay(page) {
  await page.addStyleTag({
    content: \`
      [data-walkthrough-caption] {
        position: fixed;
        \${captionCss(config.captionPosition)}
        z-index: 2147483647;
        max-width: min(420px, calc(100vw - 48px));
        padding: 12px 14px;
        border-radius: 8px;
        background: \${config.captionColors?.background || "rgba(15, 23, 42, 0.92)"};
        color: \${config.captionColors?.foreground || "#ffffff"};
        border: 2px solid \${config.captionColors?.border || "rgba(255, 255, 255, 0.82)"};
        font: 600 14px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow:
          0 0 0 3px \${config.captionColors?.ring || "rgba(56, 189, 248, 0.32)"},
          0 18px 40px rgba(0, 0, 0, 0.32);
        pointer-events: none;
      }
      [data-walkthrough-highlight] {
        position: fixed;
        z-index: 2147483646;
        border: 3px solid \${config.highlightColors?.border || "#38bdf8"};
        box-shadow: 0 0 0 4px \${config.highlightColors?.shadow || "rgba(56, 189, 248, 0.24)"};
        border-radius: 8px;
        pointer-events: none;
        display: none;
      }
    \`,
  });

  await page.evaluate(() => {
    if (!document.querySelector("[data-walkthrough-caption]")) {
      const caption = document.createElement("div");
      caption.setAttribute("data-walkthrough-caption", "");
      document.body.appendChild(caption);
    }
    if (!document.querySelector("[data-walkthrough-highlight]")) {
      const highlight = document.createElement("div");
      highlight.setAttribute("data-walkthrough-highlight", "");
      document.body.appendChild(highlight);
    }
  });
}

async function setCaption(page, text) {
  if (!text) return;
  await page.evaluate((captionText) => {
    const caption = document.querySelector("[data-walkthrough-caption]");
    if (caption) caption.textContent = captionText;
  }, text);
  await page.waitForTimeout(config.captionPauseMs || 900);
}

async function clearHighlight(page) {
  await page.evaluate(() => {
    const existingTimer = window.__walkthroughHighlightTimer;
    if (existingTimer) {
      window.clearInterval(existingTimer);
      window.__walkthroughHighlightTimer = null;
    }
    const highlight = document.querySelector("[data-walkthrough-highlight]");
    if (!highlight) return;
    highlight.style.display = "none";
    highlight.style.left = "-9999px";
    highlight.style.top = "-9999px";
    highlight.style.width = "0";
    highlight.style.height = "0";
  }).catch(() => {});
}

async function updateHighlightBox(page, locator) {
  try {
    const box = await locator.boundingBox();
    const viewport = page.viewportSize();
    const offscreen = viewport
      ? box && (box.x + box.width < 0 || box.y + box.height < 0 || box.x > viewport.width || box.y > viewport.height)
      : false;
    if (!box || box.width <= 0 || box.height <= 0 || offscreen) {
      await clearHighlight(page);
      return false;
    }
    await page.evaluate((rect) => {
      const highlight = document.querySelector("[data-walkthrough-highlight]");
      if (!highlight) return;
      const pad = 6;
      highlight.style.display = "block";
      highlight.style.left = \`\${rect.x - pad}px\`;
      highlight.style.top = \`\${rect.y - pad}px\`;
      highlight.style.width = \`\${rect.width + pad * 2}px\`;
      highlight.style.height = \`\${rect.height + pad * 2}px\`;
    }, box);
    return true;
  } catch {
    await clearHighlight(page);
    return false;
  }
}

async function startHighlight(page, selector) {
  await clearHighlight(page);
  const locator = await resolveLocator(page, selector, "highlight");
  if (!locator) return async () => clearHighlight(page);
  await scrollLocatorIntoPaddedView(page, locator);
  const visible = await updateHighlightBox(page, locator);
  if (!visible) return async () => clearHighlight(page);

  await page.evaluate((pollMs) => {
    const previousTimer = window.__walkthroughHighlightTimer;
    if (previousTimer) window.clearInterval(previousTimer);
    window.__walkthroughHighlightTimer = window.setInterval(() => {
      const highlight = document.querySelector("[data-walkthrough-highlight]");
      if (!highlight) return;
      if (highlight.dataset.keepAlive !== "true") {
        window.clearInterval(window.__walkthroughHighlightTimer);
        window.__walkthroughHighlightTimer = null;
        highlight.style.display = "none";
      }
    }, pollMs);
  }, config.highlightPollMs || 100);

  let stopped = false;
  const tracking = (async () => {
    while (!stopped) {
      const stillVisible = await updateHighlightBox(page, locator);
      if (!stillVisible) break;
      await page.waitForTimeout(config.highlightPollMs || 100);
    }
  })();

  await page.evaluate(() => {
    const highlight = document.querySelector("[data-walkthrough-highlight]");
    if (!highlight) return;
    highlight.dataset.keepAlive = "true";
  });
  await page.waitForTimeout(config.highlightPauseMs || 900);
  return async () => {
    stopped = true;
    await tracking.catch(() => {});
    await page.evaluate(() => {
      const highlight = document.querySelector("[data-walkthrough-highlight]");
      if (highlight) delete highlight.dataset.keepAlive;
    }).catch(() => {});
    await clearHighlight(page).catch(() => {});
  };
}

async function clickWithPointer(page, selector) {
  const locator = await resolveLocator(page, selector, "click selector");
  await scrollLocatorIntoPaddedView(page, locator);
  const box = await locator.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: config.pointerSteps || 32 });
    await page.waitForTimeout(config.preClickPauseMs || 650);
  }
  await locator.click();
}

async function runPreRecordStep(page, step) {
  if (step.action === "goto") {
    await page.goto(absoluteUrl(step.url), { waitUntil: "networkidle" });
  } else if (step.action === "click") {
    const locator = await resolveLocator(page, step.selector, "pre-record click selector");
    await scrollLocatorIntoPaddedView(page, locator);
    await locator.click();
  } else if (step.action === "fill") {
    const locator = await resolveLocator(page, step.selector, "pre-record fill selector");
    await scrollLocatorIntoPaddedView(page, locator);
    await locator.click();
    await page.waitForTimeout(config.preTypePauseMs || 450);
    await locator.fill("");
    await locator.pressSequentially(step.value || "", { delay: step.typeDelayMs || config.typeDelayMs || 85 });
  } else if (step.action === "select") {
    const locator = await resolveLocator(page, step.selector, "pre-record select selector");
    await scrollLocatorIntoPaddedView(page, locator);
    await locator.selectOption(step.value);
  } else if (step.action === "press") {
    await page.keyboard.press(step.key);
  } else if (step.action === "wait") {
    await page.waitForTimeout(step.ms || 1000);
  } else {
    throw new Error(\`Unsupported pre-record action: \${step.action}\`);
  }
  await assertStepWaitFor(page, step.waitFor, \`preRecordStep waitFor: \${step.action}\`);
  await page.waitForTimeout(step.pauseAfterMs || config.preRecordStepPauseMs || 700);
}

async function captureSessionStorage(page, outputPath) {
  const sessionStorage = await page.evaluate(() => {
    try {
      return Object.fromEntries(
        Array.from({ length: window.sessionStorage.length }, (_value, index) => {
          const key = window.sessionStorage.key(index) ?? "";
          return [key, window.sessionStorage.getItem(key) ?? ""];
        }),
      );
    } catch {
      return {};
    }
  });
  await writeFile(
    outputPath,
    JSON.stringify({ origin: new URL(config.baseUrl).origin, sessionStorage }, null, 2),
  );
}

async function runStep(page, step, index) {
  await clearHighlight(page);
  await setCaption(page, step.caption || step.title);
  let stopHighlight = null;
  if (step.highlight) stopHighlight = await startHighlight(page, step.highlight);

  try {
    if (step.action === "goto") {
      if (stopHighlight) await stopHighlight();
      await page.goto(absoluteUrl(step.url), { waitUntil: "networkidle" });
      await installOverlay(page);
      await setCaption(page, step.caption || step.title);
      await assertStepWaitFor(page, step.waitFor, \`step \${index + 1} waitFor\`);
      await page.waitForTimeout(step.pauseAfterMs || config.navigationPauseMs || 1800);
      return;
    } else if (step.action === "click") {
      await clickWithPointer(page, step.selector);
    } else if (step.action === "fill") {
      const locator = await resolveLocator(page, step.selector, "fill selector");
      await scrollLocatorIntoPaddedView(page, locator);
      await locator.click();
      await page.waitForTimeout(config.preTypePauseMs || 450);
      await locator.fill("");
      await locator.pressSequentially(step.value || "", { delay: step.typeDelayMs || config.typeDelayMs || 85 });
    } else if (step.action === "select") {
      const locator = await resolveLocator(page, step.selector, "select selector");
      await scrollLocatorIntoPaddedView(page, locator);
      await locator.selectOption(step.value);
    } else if (step.action === "press") {
      await page.keyboard.press(step.key);
    } else if (step.action === "wait") {
      await page.waitForTimeout(step.ms || 1000);
    } else if (step.action === "screenshot") {
      const name = step.name || \`\${String(index + 1).padStart(3, "0")}-screenshot.png\`;
      const fullPage = step.fullPage === true || config.screenshotMode === "full-page";
      await page.screenshot({ path: path.join(screenshotDir, name), fullPage });
      htmlScreenshots.push({
        src: path.posix.join("screenshots", name),
        title: step.title || step.caption || name,
        description: step.description || step.caption || "",
      });
    } else if (step.action === "caption") {
      // Caption already set above.
    } else {
      throw new Error(\`Unsupported action: \${step.action}\`);
    }
  } finally {
    if (stopHighlight) await stopHighlight();
    else await clearHighlight(page);
  }

  await assertStepWaitFor(page, step.waitFor, \`step \${index + 1} waitFor\`);
  await page.waitForTimeout(step.pauseAfterMs || config.stepPauseMs || 1400);
}

async function main() {
  if (!htmlOnly) await mkdir(videoDir, { recursive: true });
  await mkdir(screenshotDir, { recursive: true });
  // tmp/ holds pre-record auth state and raw video; needed even for htmlOnly auth runs.
  await mkdir(tmpDir, { recursive: true });
  if (!htmlOnly) await mkdir(rawVideoDir, { recursive: true });

  const configuredFormat = config.artifactFormat || "auto";
  const ffmpegAvailable = await hasCommand("ffmpeg");
  const finalFormat = htmlOnly
    ? "html"
    : configuredFormat === "auto"
    ? (ffmpegAvailable ? "mp4" : "webm")
    : configuredFormat;
  if (!htmlOnly && (finalFormat === "mp4" || finalFormat === "both") && !ffmpegAvailable) {
    throw new Error("MP4 output was requested, but ffmpeg is not available. Install ffmpeg or use artifactFormat=webm.");
  }

  const browser = await chromium.launch({ headless: config.browserMode !== "headed" });
  const preRecordStorageStatePath = path.join(tmpDir, "pre-record-storage-state.json");
  const preRecordSessionStatePath = path.join(tmpDir, "pre-record-session-state.json");
  let recordingStorageStatePath = config.storageStatePath || undefined;
  let recordingSessionStatePath = config.sessionStoragePath || undefined;

  if (config.preRecordSteps.length > 0) {
    const preRecordContext = await browser.newContext({
      storageState: config.storageStatePath || undefined,
      viewport: config.viewport || { width: 1440, height: 1000 },
    });
    const preRecordPage = await preRecordContext.newPage();
    try {
      await preRecordPage.goto(config.baseUrl, { waitUntil: "domcontentloaded" });
      for (const step of config.preRecordSteps) {
        await runPreRecordStep(preRecordPage, step);
      }
      await preRecordContext.storageState({ path: preRecordStorageStatePath });
      await captureSessionStorage(preRecordPage, preRecordSessionStatePath);
      recordingStorageStatePath = preRecordStorageStatePath;
      recordingSessionStatePath = preRecordSessionStatePath;
    } finally {
      await preRecordContext.close();
    }
  }

  const context = await browser.newContext({
    ...(htmlOnly ? {} : { recordVideo: { dir: rawVideoDir, size: config.videoSize || { width: 1440, height: 1000 } } }),
    storageState: recordingStorageStatePath,
    viewport: config.viewport || { width: 1440, height: 1000 },
  });

  if (recordingSessionStatePath) {
    const sessionState = JSON.parse(await readFile(recordingSessionStatePath, "utf8"));
    await context.addInitScript((state) => {
      if (window.location.origin !== state.origin) return;
      for (const [key, value] of Object.entries(state.sessionStorage || {})) {
        window.sessionStorage.setItem(key, value);
      }
    }, sessionState);
  }

  const page = await context.newPage();
  const pageVideo = htmlOnly ? null : page.video();
  const tempWebmPath = path.join(tmpDir, \`\${config.videoName}.webm\`);
  const finalWebmPath = path.join(videoDir, \`\${config.videoName}.webm\`);
  const finalMp4Path = path.join(videoDir, \`\${config.videoName}.mp4\`);
  const outputPaths = [];

  try {
    await page.goto(config.baseUrl, { waitUntil: "domcontentloaded" });
    await installOverlay(page);
    for (const [index, step] of config.steps.entries()) {
      await runStep(page, step, index);
    }
    await clearHighlight(page);
    await page.waitForTimeout(config.finalPauseMs || 1200);
  } finally {
    await context.close();
  }

  try {
    if (!htmlOnly && pageVideo) {
      await pageVideo.saveAs(tempWebmPath);
      await pageVideo.delete().catch(() => {});
    }
  } finally {
    await browser.close();
  }

  if (!htmlOnly && (finalFormat === "webm" || finalFormat === "both")) {
    await rm(finalWebmPath, { force: true });
    await copyFile(tempWebmPath, finalWebmPath);
    outputPaths.push(finalWebmPath);
  }

  if (!htmlOnly && (finalFormat === "mp4" || finalFormat === "both")) {
    await convertToMp4(tempWebmPath, finalMp4Path);
    outputPaths.push(finalMp4Path);
  }

  const keepScreenshots = Boolean(config.includeHtmlWalkthrough || config.keepScreenshots);
  if (config.includeHtmlWalkthrough) {
    await writeHtmlWalkthrough(htmlPath);
  }
  const mrDescriptionOutputPath = await writeMrDescription();
  if (!keepScreenshots) {
    await rm(screenshotDir, { recursive: true, force: true });
  }

  if (config.cleanup !== false) {
    await rm(tmpDir, { recursive: true, force: true });
    await removeIfExists(scriptPath);
  }

  await writeFile(runLogPath, [
    "# Walkthrough Run Log",
    "",
    \`- Current branch: \${config.currentBranch || "unknown"}\`,
    \`- Target branch: \${config.targetBranch || "main"}\`,
    \`- Recording mode: \${config.recordingMode || config.recording_mode || "branch-change"}\`,
    \`- Interaction mode: \${config.interactionMode || config.interaction_mode || (config.demoPlanMode === "proposed" || config.demo_plan_mode === "proposed" ? "guided" : "automated")}\`,
    \`- Demo plan mode: \${config.demoPlanMode || config.demo_plan_mode || "auto"}\`,
    \`- Base URL: \${config.baseUrl}\`,
    \`- Browser mode: \${config.browserMode}\`,
    \`- Caption position: \${config.captionPosition}\`,
    \`- Artifact format: \${finalFormat}\`,
    \`- HTML-only: \${htmlOnly ? "yes" : "no"}\`,
    \`- ffmpeg available: \${ffmpegAvailable ? "yes" : "no"}\`,
    \`- Pre-record steps: \${config.preRecordSteps.length}\`,
    \`- Preflight status: \${config.preflightStatus || "not recorded in config"}\`,
    \`- Login/auth included in video: no\`,
    \`- Steps: \${config.steps.length}\`,
    \`- Plan items: \${Array.isArray(config.planItems) ? config.planItems.length : 0}\`,
    ...(Array.isArray(config.planItems) && config.planItems.length > 0 ? [
      "",
      "## Plan",
      "",
      ...config.planItems.map((item) => \`- \${item}\`),
      "",
      "## Artifacts",
      "",
    ] : []),
    ...outputPaths.map((outputPath) => \`- Video path: \${outputPath}\`),
    config.includeHtmlWalkthrough ? \`- HTML path: \${htmlPath}\` : "- HTML path: not requested",
    mrDescriptionOutputPath ? \`- MR description path: \${mrDescriptionOutputPath}\` : "- MR description path: not requested",
    \`- Screenshots kept: \${keepScreenshots ? "yes" : "no"}\`,
    \`- Cleanup enabled: \${config.cleanup === false ? "no" : "yes"}\`,
    ""
  ].join("\\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;
}

async function main() {
  const config = await loadConfig();
  const validation = validateRecordingConfigShape(config, { strictMrDescription: true });
  if (!validation.ok) {
    throw new Error(`Recording config is invalid: ${validation.errors.join(" ")}`);
  }
  const branchSlug = slugify(config.branchSlug || config.currentBranch);
  const outputDir = path.resolve(config.outputDir || `../walkthrough-artifacts/${branchSlug}`);
  const scriptPath = path.join(outputDir, `record-${branchSlug}.mjs`);
  const templatePath = path.resolve(scriptDir, "../assets/mr-description-template.md");
  const mrDescriptionTemplate = await readFile(templatePath, "utf8");

  await mkdir(outputDir, { recursive: true });
  await writeFile(scriptPath, generatedScript({ ...config, mrDescriptionTemplate }), { mode: 0o755 });
  console.log(scriptPath);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
