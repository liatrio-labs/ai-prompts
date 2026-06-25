#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(path.resolve(filePath), "utf8"));
}

async function readCredentialsFromStdin() {
  if (process.stdin.isTTY) return null;
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  if (!input.trim()) return null;
  return JSON.parse(input);
}

async function promptCredentials(defaultUsername) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const username = defaultUsername ?? await rl.question("Username: ");
  const password = await rl.question("Password: ");
  rl.close();
  return { username, password };
}

async function main() {
  const smokePath = argValue("--smoke");
  const username = argValue("--username");

  if (!smokePath) {
    throw new Error("Usage: create_login_steps.mjs --smoke=smoke-output.json [--username=value] < credentials.json");
  }

  const smoke = await loadJson(smokePath);
  const credentials = await readCredentialsFromStdin() ?? await promptCredentials(username);
  if (!credentials.username || !credentials.password) {
    throw new Error("Username and password are required to create scripted login steps.");
  }

  const fields = smoke.detectedFields || {};
  if (!fields.username || !fields.password || !fields.submit) {
    throw new Error("Smoke output does not include enough selectors for scripted login.");
  }

  const steps = [
    {
      action: "fill",
      selector: fields.username,
      value: credentials.username,
      caption: "Enter the provided username.",
    },
    {
      action: "fill",
      selector: fields.password,
      value: credentials.password,
      caption: "Enter the provided password.",
    },
    {
      action: "click",
      selector: fields.submit,
      highlight: fields.submit,
      caption: "Submit the login form.",
      pauseAfterMs: 1800,
    },
  ];

  console.log(JSON.stringify(steps, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
