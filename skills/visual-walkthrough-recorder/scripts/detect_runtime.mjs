#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// Common local dev-server ports, ordered by how often each framework's default
// is the one a reviewer is running. Override with --ports=5173,3000,...
export const DEFAULT_PORTS = [5173, 3000, 4200, 8080, 8000, 5000, 4321, 3001, 1313];

// Package.json script names that typically start a frontend dev server, in
// preference order. Used only to suggest a command when nothing is reachable.
const START_SCRIPT_PREFERENCE = ["dev", "start", "serve", "preview", "dev:web", "develop"];

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

export function parsePorts(value) {
  if (!value) return DEFAULT_PORTS;
  const ports = String(value)
    .split(",")
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((port) => Number.isInteger(port) && port > 0 && port < 65536);
  return ports.length ? [...new Set(ports)] : DEFAULT_PORTS;
}

// Pick the package manager from the lockfile present in the repo.
export function detectPackageManager(files = []) {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("bun.lockb")) return "bun";
  return "npm";
}

// Choose a start command from package.json scripts, returning the chosen
// script name and a runnable command string, or null when no script matches.
export function chooseStartCommand(scripts = {}, packageManager = "npm") {
  const available = Object.keys(scripts || {});
  const chosen = START_SCRIPT_PREFERENCE.find((name) => available.includes(name));
  if (!chosen) return null;
  const runner = packageManager === "npm" ? "npm run" : `${packageManager} run`;
  return { script: chosen, command: `${runner} ${chosen}` };
}

async function probe(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Any HTTP response (including 401/404) means a server is listening.
    const response = await fetch(url, { signal: controller.signal, redirect: "manual" });
    return { reachable: true, status: response.status };
  } catch {
    return { reachable: false };
  } finally {
    clearTimeout(timer);
  }
}

async function suggestStartCommand(cwd) {
  try {
    const pkgRaw = await readFile(path.join(cwd, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw);
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(cwd).catch(() => []);
    const packageManager = detectPackageManager(files);
    const start = chooseStartCommand(pkg.scripts, packageManager);
    if (!start) return null;
    return { ...start, cwd, packageManager };
  } catch {
    return null;
  }
}

async function main() {
  const host = argValue("--host", "localhost");
  const scheme = argValue("--scheme", "http");
  const timeoutMs = Number.parseInt(argValue("--timeout-ms", "1200"), 10);
  const cwd = path.resolve(argValue("--cwd", process.cwd()));
  const ports = parsePorts(argValue("--ports"));

  const probed = [];
  for (const port of ports) {
    const baseUrl = `${scheme}://${host}:${port}`;
    const result = await probe(baseUrl, timeoutMs);
    probed.push({ baseUrl, port, ...result });
    if (result.reachable) {
      console.log(JSON.stringify({
        ok: true,
        status: "reachable",
        baseUrl,
        port,
        httpStatus: result.status,
        probed,
      }, null, 2));
      return;
    }
  }

  const suggestion = await suggestStartCommand(cwd);
  console.log(JSON.stringify({
    ok: false,
    status: "runtime_unavailable",
    reason: "no_reachable_dev_server",
    message: "No reachable frontend dev server was found on the probed ports.",
    probedPorts: ports,
    probed,
    suggestion,
  }, null, 2));
  process.exitCode = 2;
}

// Only run the CLI when invoked directly, so the helpers stay importable.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(JSON.stringify({ ok: false, status: "error", error: error.message }, null, 2));
    process.exitCode = 1;
  });
}
