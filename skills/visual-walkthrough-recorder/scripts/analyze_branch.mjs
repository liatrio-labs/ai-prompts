#!/usr/bin/env node
import process from "node:process";
import { analyzeBranch } from "./lib/branch_analysis.mjs";

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

async function main() {
  const targetBranch = argValue("--target", "main");
  const report = await analyzeBranch({ targetBranch });
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
