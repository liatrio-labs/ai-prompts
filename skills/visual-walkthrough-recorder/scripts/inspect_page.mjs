#!/usr/bin/env node
import {
  argValue,
  inspectPageDom,
  requirePlaywright,
  restoreSessionStorage,
  targetUrlFor,
} from "./lib/playwright_helpers.mjs";

const { chromium } = requirePlaywright();

async function main() {
  const baseUrl = argValue("--base-url");
  const pathToCheck = argValue("--path", "/");
  const browserMode = argValue("--browser-mode", "headless");
  const storageStatePath = argValue("--storage-state");
  const sessionStatePath = argValue("--session-state");
  const timeoutMs = Number(argValue("--timeout-ms", "12000"));

  if (!baseUrl) {
    throw new Error("Usage: inspect_page.mjs --base-url=http://localhost:5173 [--path=/route]");
  }

  const browser = await chromium.launch({ headless: browserMode !== "headed" });
  const context = await browser.newContext({
    storageState: storageStatePath || undefined,
    viewport: { width: 1440, height: 1000 },
  });
  await restoreSessionStorage(context, sessionStatePath);
  const page = await context.newPage();
  const targetUrl = targetUrlFor(baseUrl, pathToCheck);

  try {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: timeoutMs }).catch(() => {});
    const info = await inspectPageDom(page);
    console.log(JSON.stringify({
      ok: true,
      baseUrl,
      checkedUrl: targetUrl,
      finalUrl: info.url,
      title: info.title,
      headings: info.headings,
      controls: info.controls,
      counts: {
        headings: info.headings.length,
        controls: info.controls.length,
        fields: info.fields.length,
        buttons: info.buttons.length,
        links: info.links.length,
      },
    }, null, 2));
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
