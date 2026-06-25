#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { generateMrDescription, mrDescriptionMissingFields } from "./lib/mr_description.mjs";

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function main() {
  const configPath = argValue("--config");
  const outputPath = argValue("--output");
  const templatePath = argValue("--template");
  if (!configPath || !outputPath) {
    throw new Error("Usage: generate_mr_description.mjs --config=recording-config.json --output=mr-description.md");
  }
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  const missing = mrDescriptionMissingFields({ ...config, includeMrDescription: true });
  if (missing.length > 0) {
    throw new Error(`MR description requires explicit ${missing.join(", ")}.`);
  }
  const generatedPath = await generateMrDescription({
    config,
    outputPath: path.resolve(outputPath),
    templatePath: templatePath ? path.resolve(templatePath) : undefined,
  });
  console.log(generatedPath);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
