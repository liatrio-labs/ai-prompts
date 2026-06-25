#!/usr/bin/env node
import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function filesReferencedByHtml(outputDir) {
  const htmlPath = path.join(outputDir, "walkthrough.html");
  if (!(await exists(htmlPath))) return new Set();
  const html = await readFile(htmlPath, "utf8");
  const refs = new Set();
  for (const match of html.matchAll(/src="([^"]+)"/g)) {
    refs.add(path.resolve(outputDir, match[1]));
  }
  return refs;
}

async function collectFiles(dir) {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function main() {
  const outputDir = argValue("--output-dir");
  const preserve = argValue("--preserve", "final");
  if (!outputDir) {
    throw new Error("Usage: cleanup_artifacts.mjs --output-dir=../walkthrough-artifacts/<branch> [--preserve=final|diagnostics]");
  }

  const resolvedOutputDir = path.resolve(outputDir);
  const keepDiagnostics = preserve === "diagnostics";
  const referencedScreenshots = await filesReferencedByHtml(resolvedOutputDir);
  const keep = new Set([
    path.join(resolvedOutputDir, "run-log.md"),
    path.join(resolvedOutputDir, "walkthrough.html"),
    path.join(resolvedOutputDir, "mr-description.md"),
    ...referencedScreenshots,
  ]);

  if (keepDiagnostics) {
    keep.add(path.join(resolvedOutputDir, "automation-report.json"));
  }

  for (const file of await collectFiles(resolvedOutputDir)) {
    const relative = path.relative(resolvedOutputDir, file);
    const isVideo = relative.startsWith(`videos${path.sep}`) && /\.(mp4|webm|mov)$/i.test(file);
    if (keep.has(file) || isVideo) continue;
    await rm(file, { force: true });
  }

  for (const dir of ["tmp", "validation-frames", "screenshots", "videos"]) {
    const fullPath = path.join(resolvedOutputDir, dir);
    if (!(await exists(fullPath))) continue;
    const remaining = await collectFiles(fullPath);
    if (remaining.length === 0) await rm(fullPath, { recursive: true, force: true });
  }

  console.log(JSON.stringify({
    ok: true,
    outputDir: resolvedOutputDir,
    preserve,
    screenshotsReferenced: referencedScreenshots.size,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
