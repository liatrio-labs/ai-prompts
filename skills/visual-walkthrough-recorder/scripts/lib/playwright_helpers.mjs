import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

export function requirePlaywright() {
  const errors = [];
  const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
  try {
    return requireFromCwd("playwright");
  } catch (error) {
    errors.push(`local: ${error.message}`);
  }

  const globalRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8" });
  const globalNodeModules = globalRoot.status === 0 ? globalRoot.stdout.trim() : "";
  if (globalNodeModules) {
    try {
      return createRequire(path.join(globalNodeModules, "package.json"))("playwright");
    } catch (error) {
      errors.push(`global: ${error.message}`);
    }
  } else if (globalRoot.error || globalRoot.stderr) {
    errors.push(`global: ${(globalRoot.error || globalRoot.stderr).toString().trim()}`);
  }

  throw new Error(
    `Cannot find playwright. Install it in the app repo or globally with npm install -g playwright. ${errors.join(" | ")}`,
  );
}

export function targetUrlFor(baseUrl, pathToCheck) {
  if (!pathToCheck) return baseUrl;
  if (/^(https?|file|data):/i.test(pathToCheck)) return pathToCheck;

  const parsed = new URL(baseUrl);
  if (parsed.protocol === "http:" || parsed.protocol === "https:") {
    return new URL(pathToCheck, baseUrl).href;
  }

  return baseUrl;
}

export async function restoreSessionStorage(context, sessionStoragePath) {
  if (!sessionStoragePath) return;
  const sessionState = JSON.parse(await readFile(sessionStoragePath, "utf8"));
  await context.addInitScript((state) => {
    if (window.location.origin !== state.origin) return;
    for (const [key, value] of Object.entries(state.sessionStorage || {})) {
      window.sessionStorage.setItem(key, value);
    }
  }, sessionState);
}

export function selectorLabel(selector) {
  return JSON.stringify(selector ?? null);
}

export async function locatorFor(page, selector) {
  if (!selector) return null;
  const base = selector.within ? await resolveLocator(page, selector.within, "within selector") : page;
  const exact = selector.exact !== false;

  if (selector.role) return base.getByRole(selector.role, { name: selector.name, exact });
  if (selector.label) return base.getByLabel(selector.label, { exact });
  if (selector.testId) return base.getByTestId(selector.testId);
  if (selector.text) return base.getByText(selector.text, { exact });
  if (selector.css) return base.locator(selector.css, selector.hasText ? { hasText: selector.hasText } : undefined);

  throw new Error(`Unsupported selector: ${selectorLabel(selector)}`);
}

export async function resolveLocator(page, selector, context = "selector", options = {}) {
  const baseLocator = await locatorFor(page, selector);
  if (!baseLocator) return null;

  const hasExplicitIndex = Number.isInteger(selector?.nth);
  const locator = hasExplicitIndex ? baseLocator.nth(selector.nth) : baseLocator;
  const timeout = options.timeout ?? 8000;
  await locator.waitFor({ state: "visible", timeout });

  const count = await baseLocator.count().catch(() => null);
  if (count > 1 && !hasExplicitIndex && selector?.allowMultiple !== true) {
    const candidates = await candidateSelectors(page, selector).catch(() => []);
    const suggestion = candidates.length > 0 ? ` Candidate selectors: ${JSON.stringify(candidates.slice(0, 8))}` : "";
    throw new Error(
      `Ambiguous ${context} ${selectorLabel(selector)} matched ${count} elements. `
      + `Refine with an exact role/name, label, testId, css+hasText, within scope, or an explicit nth index.${suggestion}`,
    );
  }

  return locator;
}

export async function scrollLocatorIntoPaddedView(page, locator, padding = 96) {
  await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await locator.evaluate((element, scrollPadding) => {
    element.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let deltaX = 0;
    let deltaY = 0;

    if (rect.left < scrollPadding) deltaX = rect.left - scrollPadding;
    else if (rect.right > viewportWidth - scrollPadding) deltaX = rect.right - (viewportWidth - scrollPadding);

    if (rect.top < scrollPadding) deltaY = rect.top - scrollPadding;
    else if (rect.bottom > viewportHeight - scrollPadding) deltaY = rect.bottom - (viewportHeight - scrollPadding);

    if (deltaX || deltaY) window.scrollBy({ left: deltaX, top: deltaY, behavior: "instant" });
  }, padding).catch(() => {});
  await page.waitForTimeout(250);
}

export async function locatorBox(page, locator, padding = 96) {
  await scrollLocatorIntoPaddedView(page, locator, padding);
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  const inViewport = Boolean(
    box && viewport &&
    box.width > 0 &&
    box.height > 0 &&
    box.x >= 0 &&
    box.y >= 0 &&
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height,
  );
  const padded = Boolean(
    box && viewport &&
    box.x >= Math.min(padding, viewport.width / 4) &&
    box.y >= Math.min(padding, viewport.height / 4) &&
    box.x + box.width <= viewport.width - Math.min(padding, viewport.width / 4) &&
    box.y + box.height <= viewport.height - Math.min(padding, viewport.height / 4),
  );

  return { box, viewport, inViewport, padded };
}

export async function assertWaitFor(page, waitFor, context = "waitFor") {
  if (!waitFor) return null;

  if (waitFor.url) {
    await page.waitForURL(waitFor.url, { timeout: waitFor.timeoutMs || 8000 });
    return { ok: true, type: "url", value: waitFor.url };
  }

  if (waitFor.text || waitFor.role || waitFor.label || waitFor.testId || waitFor.css) {
    const locator = await resolveLocator(page, waitFor, context, { timeout: waitFor.timeoutMs || 8000 });
    return { ok: true, type: "selector", value: selectorLabel(waitFor), box: await locator.boundingBox() };
  }

  throw new Error(`Unsupported waitFor in ${context}: ${selectorLabel(waitFor)}`);
}

function cssEscape(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

export async function inspectPageDom(page) {
  return page.evaluate(() => {
    function visible(element) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return Boolean(rect.width && rect.height && style.visibility !== "hidden" && style.display !== "none");
    }

    function boxFor(element) {
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }

    function labelFor(input) {
      const ariaLabel = input.getAttribute("aria-label");
      if (ariaLabel) return ariaLabel.trim();

      const labelledBy = input.getAttribute("aria-labelledby");
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim())
          .filter(Boolean)
          .join(" ");
        if (text) return text;
      }

      if (input.id) {
        const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
        if (label?.textContent) return label.textContent.trim();
      }

      const wrappingLabel = input.closest("label");
      if (wrappingLabel?.textContent) return wrappingLabel.textContent.trim();

      return "";
    }

    function testIdFor(element) {
      return element.getAttribute("data-testid") ||
        element.getAttribute("data-test-id") ||
        element.getAttribute("data-test") ||
        "";
    }

    function roleFor(element) {
      const explicitRole = element.getAttribute("role");
      if (explicitRole) return explicitRole;
      const tag = element.tagName.toLowerCase();
      if (tag === "button" || element.getAttribute("type") === "button" || element.getAttribute("type") === "submit") {
        return "button";
      }
      if (tag === "a" && element.getAttribute("href")) return "link";
      if (/^h[1-6]$/.test(tag)) return "heading";
      return "";
    }

    function accessibleName(element) {
      return (
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.textContent ||
        element.getAttribute("value") ||
        ""
      ).trim().replace(/\s+/g, " ").slice(0, 160);
    }

    function selectorForElement(element) {
      const testId = testIdFor(element);
      if (testId) return { testId };

      const role = roleFor(element);
      const name = accessibleName(element);
      if (role && name) return { role, name, exact: true };

      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        const label = labelFor(element);
        if (label) return { label, exact: true };
        if (element.name) return { css: `[name="${CSS.escape(element.name)}"]` };
        if (element.id) return { css: `#${CSS.escape(element.id)}` };
      }

      if (element.id) return { css: `#${CSS.escape(element.id)}` };
      if (name) return { text: name, exact: true };
      return { css: element.tagName.toLowerCase() };
    }

    const controls = Array.from(document.querySelectorAll(
      "button, a[href], input, textarea, select, [role='button'], [role='link'], [data-testid], [data-test-id], [data-test]",
    ))
      .filter(visible)
      .slice(0, 250)
      .map((element) => ({
        tagName: element.tagName.toLowerCase(),
        role: roleFor(element),
        name: accessibleName(element),
        label: element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement
          ? labelFor(element)
          : "",
        testId: testIdFor(element),
        type: element.getAttribute("type") || "",
        placeholder: element.getAttribute("placeholder") || "",
        id: element.id || "",
        fieldName: element.getAttribute("name") || "",
        nameAttribute: element.getAttribute("name") || "",
        autocomplete: element.getAttribute("autocomplete") || "",
        required: element.hasAttribute("required") || element.getAttribute("aria-required") === "true",
        selector: selectorForElement(element),
        box: boxFor(element),
      }));

    const headings = Array.from(document.querySelectorAll("h1, h2, h3, [role='heading']"))
      .filter(visible)
      .slice(0, 80)
      .map((element) => ({
        level: Number(element.getAttribute("aria-level") || element.tagName.match(/\d/)?.[0] || 0),
        name: accessibleName(element),
        selector: selectorForElement(element),
        box: boxFor(element),
      }));

    return {
      title: document.title,
      url: window.location.href,
      bodyText: document.body.innerText.slice(0, 5000),
      headings,
      controls,
      fields: controls.filter((item) =>
        ["input", "textarea", "select"].includes(item.tagName) &&
        !["hidden", "submit", "button", "checkbox", "radio"].includes(item.type),
      ),
      buttons: controls.filter((item) => item.role === "button"),
      links: controls.filter((item) => item.role === "link"),
    };
  });
}

export async function candidateSelectors(page, selector = null) {
  const info = await inspectPageDom(page);
  const all = [...info.headings, ...info.controls]
    .map((item) => item.selector)
    .filter(Boolean);
  if (!selector) return all;

  const needle = JSON.stringify(selector).toLowerCase();
  return all.filter((candidate) => {
    const text = JSON.stringify(candidate).toLowerCase();
    return [...new Set(needle.match(/[a-z0-9_-]{3,}/g) || [])].some((part) => text.includes(part));
  });
}

export function textScore(value, patterns) {
  const text = String(value || "").toLowerCase();
  return patterns.some((pattern) => text.includes(pattern)) ? 1 : 0;
}

export function selectorForField(field) {
  if (field.label) return { label: field.label, exact: true };
  if (field.placeholder) return { css: `[placeholder="${cssEscape(field.placeholder)}"]` };
  if (field.nameAttribute || field.fieldName) return { css: `[name="${cssEscape(field.nameAttribute || field.fieldName)}"]` };
  if (field.id) return { css: `#${cssEscape(field.id)}` };
  return field.type ? { css: `input[type="${cssEscape(field.type)}"]` } : null;
}
