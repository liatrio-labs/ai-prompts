#!/usr/bin/env node
import process from "node:process";
import {
  argValue,
  inspectPageDom,
  requirePlaywright,
  restoreSessionStorage,
  selectorForField,
  targetUrlFor,
  textScore,
} from "./lib/playwright_helpers.mjs";

const { chromium } = requirePlaywright();

function classifyAuth(info, originalUrl) {
  const authWords = [
    "login",
    "log in",
    "sign in",
    "username",
    "password",
    "credentials",
    "authenticate",
    "auth",
    "call sign",
    "callsign",
    "transponder",
    "request clearance",
  ];
  const urlLooksAuth = /login|signin|sign-in|auth|sso/i.test(info.url);
  const redirected = originalUrl && info.url !== originalUrl;
  const bodyLooksAuth = textScore(info.bodyText, authWords) > 0;
  const hasPassword = info.fields.some((field) => field.type === "password");
  const hasMultipleFields = info.fields.length >= 2;
  const authRequired = urlLooksAuth || hasPassword || (bodyLooksAuth && hasMultipleFields);

  return {
    authRequired,
    loginFormDetected: hasPassword || hasMultipleFields,
    redirected,
  };
}

function findUsernameField(fields) {
  const usernameWords = ["user", "email", "login", "callsign", "call sign"];
  return fields.find((field) =>
    field.type === "email" ||
    textScore(field.autocomplete, ["username", "email"]) ||
    textScore(field.label, usernameWords) ||
    textScore(field.placeholder, usernameWords) ||
    textScore(field.nameAttribute || field.fieldName, usernameWords) ||
    textScore(field.id, usernameWords),
  ) || fields.find((field) => field.type !== "password") || null;
}

function findPasswordField(fields) {
  return fields.find((field) => field.type === "password") ||
    fields.find((field) =>
      textScore(field.autocomplete, ["current-password", "password"]) ||
      textScore(field.label, ["password", "transponder"]) ||
      textScore(field.placeholder, ["password", "transponder"]) ||
      textScore(field.nameAttribute || field.fieldName, ["password"]) ||
      textScore(field.id, ["password"]),
    ) ||
    null;
}

function findSubmitButton(buttons) {
  const submitWords = ["login", "log in", "sign in", "submit", "continue", "request clearance"];
  return buttons.find((button) => textScore(button.name, submitWords)) || buttons[0] || null;
}

async function main() {
  const baseUrl = argValue("--base-url");
  const pathToCheck = argValue("--path");
  const browserMode = argValue("--browser-mode", "headless");
  const storageStatePath = argValue("--storage-state");
  const sessionStatePath = argValue("--session-state");
  const timeoutMs = Number(argValue("--timeout-ms", "12000"));

  if (!baseUrl) {
    throw new Error("Usage: smoke_check.mjs --base-url=http://localhost:5173 [--path=/protected]");
  }

  const targetUrl = targetUrlFor(baseUrl, pathToCheck);
  const browser = await chromium.launch({ headless: browserMode !== "headed" });
  const context = await browser.newContext({
    storageState: storageStatePath || undefined,
  });
  await restoreSessionStorage(context, sessionStatePath);
  const page = await context.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: timeoutMs }).catch(() => {});
    const info = await inspectPageDom(page);
    const auth = classifyAuth(info, targetUrl);
    const username = findUsernameField(info.fields);
    const password = findPasswordField(info.fields);
    const submit = findSubmitButton(info.buttons);

    const recommendations = auth.authRequired
      ? [
        {
          mode: "scripted-headless-login",
          description: "User provides credentials in the conversation; agent injects typed login steps into the recording script.",
          available: Boolean(username && password && submit),
        },
        {
          mode: "headed-auth-headless-record",
          description: "User authenticates manually in a headed browser once; agent records headless with captured storage/session state.",
          available: true,
        },
        {
          mode: "headed",
          description: "Agent records in a visible browser when auth cannot be replayed headlessly.",
          available: true,
        },
      ]
      : [
        {
          mode: "headless",
          description: "No auth barrier detected; record headless.",
          available: true,
        },
      ];

    console.log(JSON.stringify({
      ok: true,
      baseUrl,
      checkedUrl: targetUrl,
      finalUrl: info.url,
      title: info.title,
      authRequired: auth.authRequired,
      loginFormDetected: auth.loginFormDetected,
      redirected: auth.redirected,
      detectedFields: {
        username: username ? selectorForField(username) : null,
        password: password ? selectorForField(password) : null,
        submit: submit ? { role: "button", name: submit.name } : null,
      },
      fieldCount: info.fields.length,
      buttonCount: info.buttons.length,
      recommendedModes: recommendations,
    }, null, 2));
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
});
