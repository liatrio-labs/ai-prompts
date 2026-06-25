#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  argValue,
  assertWaitFor,
  inspectPageDom,
  locatorBox,
  requirePlaywright,
  restoreSessionStorage,
  resolveLocator,
  scrollLocatorIntoPaddedView,
  selectorLabel,
  targetUrlFor,
} from "./lib/playwright_helpers.mjs";

const { chromium } = requirePlaywright();

async function loadConfig() {
  const configPath = argValue("--config");
  if (!configPath) {
    throw new Error("Usage: validate_recording_config.mjs --config=recording-config.json");
  }
  return JSON.parse(await readFile(path.resolve(configPath), "utf8"));
}

function absoluteUrl(config, url) {
  if (!url) return config.baseUrl;
  return targetUrlFor(config.baseUrl, url);
}

async function validateSelector(page, selector, context, config) {
  if (!selector) return null;
  const locator = await resolveLocator(page, selector, context);
  const box = await locatorBox(page, locator, config.scrollPaddingPx ?? config.highlightViewportPadding ?? 96);
  if (!box.inViewport) {
    throw new Error(`${context} ${selectorLabel(selector)} is not fully visible after padded scroll.`);
  }
  return {
    selector,
    box: box.box,
    viewport: box.viewport,
    padded: box.padded,
    warning: box.padded ? null : "visible but close to viewport edge after scroll",
  };
}

async function runPreRecordStep(page, step, index, config) {
  const label = `preRecordSteps[${index}]`;
  if (step.action === "goto") {
    await page.goto(absoluteUrl(config, step.url), { waitUntil: "networkidle" });
  } else if (step.action === "click") {
    const locator = await resolveLocator(page, step.selector, `${label}.selector`);
    await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
    await locator.click();
  } else if (step.action === "fill") {
    const locator = await resolveLocator(page, step.selector, `${label}.selector`);
    await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
    await locator.fill("");
    await locator.pressSequentially(step.value || "", { delay: step.typeDelayMs || config.typeDelayMs || 20 });
  } else if (step.action === "select") {
    const locator = await resolveLocator(page, step.selector, `${label}.selector`);
    await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
    await locator.selectOption(step.value);
  } else if (step.action === "press") {
    await page.keyboard.press(step.key);
  } else if (step.action === "wait") {
    await page.waitForTimeout(step.ms || 1000);
  } else {
    throw new Error(`Unsupported pre-record action at ${label}: ${step.action}`);
  }
  await assertWaitFor(page, step.waitFor, `${label}.waitFor`);
}

async function runStep(page, step, index, config, executeActions) {
  const label = `steps[${index}]`;
  const selectors = [];

  if (step.highlight) selectors.push(await validateSelector(page, step.highlight, `${label}.highlight`, config));
  if (step.selector) selectors.push(await validateSelector(page, step.selector, `${label}.selector`, config));

  if (executeActions) {
    if (step.action === "goto") {
      await page.goto(absoluteUrl(config, step.url), { waitUntil: "networkidle" });
    } else if (step.action === "click") {
      const locator = await resolveLocator(page, step.selector, `${label}.selector`);
      await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
      await locator.click();
    } else if (step.action === "fill") {
      const locator = await resolveLocator(page, step.selector, `${label}.selector`);
      await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
      await locator.fill("");
      await locator.pressSequentially(step.value || "", { delay: step.typeDelayMs || config.typeDelayMs || 20 });
    } else if (step.action === "select") {
      const locator = await resolveLocator(page, step.selector, `${label}.selector`);
      await scrollLocatorIntoPaddedView(page, locator, config.scrollPaddingPx ?? 96);
      await locator.selectOption(step.value);
    } else if (step.action === "press") {
      await page.keyboard.press(step.key);
    } else if (step.action === "wait") {
      await page.waitForTimeout(step.ms || 1000);
    } else if (step.action === "screenshot" || step.action === "caption") {
      // No-op during preflight; selectors and waitFor checks carry the value.
    } else {
      throw new Error(`Unsupported action at ${label}: ${step.action}`);
    }
  } else if (step.action === "goto") {
    await page.goto(absoluteUrl(config, step.url), { waitUntil: "networkidle" });
  }

  const waitFor = await assertWaitFor(page, step.waitFor, `${label}.waitFor`);
  return {
    index,
    action: step.action,
    title: step.title || step.caption || "",
    selectors: selectors.filter(Boolean),
    waitFor,
    finalUrl: page.url(),
  };
}

async function main() {
  const config = await loadConfig();
  const executeActions = argValue("--execute-actions", "true") !== "false";
  const timeoutMs = Number(argValue("--timeout-ms", "12000"));
  const browser = await chromium.launch({ headless: (config.browserMode || "headless") !== "headed" });
  const context = await browser.newContext({
    storageState: config.storageStatePath || undefined,
    viewport: config.viewport || { width: 1440, height: 1000 },
  });
  await restoreSessionStorage(context, config.sessionStoragePath);

  const page = await context.newPage();
  const results = [];
  const warnings = [];

  try {
    await page.goto(config.baseUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: timeoutMs }).catch(() => {});

    for (const [index, step] of (config.preRecordSteps || []).entries()) {
      await runPreRecordStep(page, step, index, config);
    }

    for (const [index, step] of (config.steps || []).entries()) {
      const result = await runStep(page, step, index, config, executeActions);
      for (const selectorResult of result.selectors || []) {
        if (selectorResult.warning) {
          warnings.push(`steps[${index}] ${selectorLabel(selectorResult.selector)}: ${selectorResult.warning}`);
        }
      }
      results.push(result);
    }

    const finalDom = await inspectPageDom(page);
    console.log(JSON.stringify({
      ok: true,
      executeActions,
      baseUrl: config.baseUrl,
      finalUrl: page.url(),
      stepsChecked: results.length,
      warnings,
      results,
      finalDomSummary: {
        title: finalDom.title,
        headings: finalDom.headings.slice(0, 12),
        controls: finalDom.controls.slice(0, 24),
      },
    }, null, 2));
  } catch (error) {
    const dom = await inspectPageDom(page).catch(() => null);
    console.error(JSON.stringify({
      ok: false,
      error: error.message,
      currentUrl: page.url(),
      nearbyCandidates: dom ? [...dom.headings, ...dom.controls].slice(0, 40).map((item) => item.selector) : [],
    }, null, 2));
    process.exitCode = 1;
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
