#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { validateRecordingConfigShape } from "./lib/config_validation.mjs";

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function main() {
  const configPath = argValue("--config");
  if (!configPath) {
    throw new Error("Usage: validate_recording_config_shape.mjs --config=recording-config.json [--strict-mr=true]");
  }
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  const result = validateRecordingConfigShape(config, {
    strictMrDescription: argValue("--strict-mr", "false") === "true",
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, errors: [error.message], warnings: [] }, null, 2));
  process.exitCode = 1;
});
