#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { requirePlaywright } from "./lib/playwright_helpers.mjs";

const { chromium } = requirePlaywright();

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function main() {
  const baseUrl = argValue("--base-url");
  const output = argValue("--output");
  const sessionOutput = argValue("--session-output");
  if (!baseUrl || !output) {
    throw new Error("Usage: capture_auth_state.mjs --base-url=http://localhost:5173 --output=tmp/storage-state.json [--session-output=tmp/session-state.json]");
  }

  await mkdir(path.dirname(path.resolve(output)), { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Complete authentication in the opened browser window.");
  await rl.question("Press Enter here when the app is authenticated and ready to record...");
  rl.close();

  await context.storageState({ path: output });

  if (sessionOutput) {
    await mkdir(path.dirname(path.resolve(sessionOutput)), { recursive: true });
    const sessionStorage = await page.evaluate(() =>
      Object.fromEntries(
        Array.from({ length: window.sessionStorage.length }, (_value, index) => {
          const key = window.sessionStorage.key(index) ?? "";
          return [key, window.sessionStorage.getItem(key) ?? ""];
        }),
      ),
    );
    await writeFile(
      sessionOutput,
      JSON.stringify({ origin: new URL(baseUrl).origin, sessionStorage }, null, 2),
    );
  }

  await browser.close();
  console.log(output);
  if (sessionOutput) console.log(sessionOutput);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
