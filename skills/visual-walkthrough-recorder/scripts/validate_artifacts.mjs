#!/usr/bin/env node
import process from "node:process";
import { validateArtifactFiles } from "./lib/artifact_validation.mjs";

function valuesFor(name) {
  const prefix = `${name}=`;
  return process.argv.slice(2)
    .filter((arg) => arg.startsWith(prefix))
    .map((arg) => arg.slice(prefix.length));
}

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function main() {
  const files = valuesFor("--file");
  if (files.length === 0) {
    throw new Error("Usage: validate_artifacts.mjs --file=video.mp4 --file=walkthrough.html");
  }
  const result = await validateArtifactFiles(files, {
    frameOutputDir: argValue("--frame-output-dir"),
    minDurationSeconds: Number(argValue("--min-duration-seconds", "2")),
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
