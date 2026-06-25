#!/usr/bin/env node
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function argValues(name) {
  const prefix = `${name}=`;
  return process.argv.slice(2)
    .filter((arg) => arg.startsWith(prefix))
    .map((arg) => arg.slice(prefix.length))
    .filter(Boolean);
}

function argFlag(name) {
  return process.argv.slice(2).includes(name);
}

function parseJsonLoose(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return { ok: false, parseError: true, raw: trimmed };
      }
    }
    return { ok: false, parseError: true, raw: trimmed };
  }
}

async function runScript(scriptName, args, cwd) {
  const scriptPath = path.join(scriptDir, scriptName);
  try {
    const { stdout } = await execFileAsync(process.execPath, [scriptPath, ...args], {
      cwd,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 20,
    });
    return { code: 0, json: parseJsonLoose(stdout) };
  } catch (error) {
    return {
      code: typeof error.code === "number" ? error.code : 1,
      json: parseJsonLoose(error.stdout || error.stderr || error.message),
    };
  }
}

function emit(payload, exitCode = 0) {
  console.log(JSON.stringify(payload, null, 2));
  process.exitCode = exitCode;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const cwd = path.resolve(argValue("--cwd", process.cwd()));
  const targetBranch = argValue("--target", "main");
  const phases = [];

  // Fast path: an existing config is handed straight to the orchestrator.
  let configPath = argValue("--config");
  if (configPath) {
    configPath = path.resolve(configPath);
    if (!(await fileExists(configPath))) {
      emit({ ok: false, status: "needs_input", reason: "missing_config", message: `Config not found: ${configPath}`, phases }, 2);
      return;
    }
  } else {
    // 1. Resolve the runtime: explicit --base-url, or discover a dev server.
    let baseUrl = argValue("--base-url");
    if (!baseUrl) {
      const runtime = await runScript("detect_runtime.mjs", [`--cwd=${cwd}`], cwd);
      phases.push({ name: "runtime-detection", result: runtime.json });
      if (runtime.json.ok && runtime.json.baseUrl) {
        baseUrl = runtime.json.baseUrl;
      } else {
        emit({
          ok: false,
          status: "needs_input",
          reason: "runtime_unavailable",
          message: "No --base-url was provided and no reachable dev server was discovered.",
          details: { suggestion: runtime.json.suggestion, probedPorts: runtime.json.probedPorts },
          phases,
        }, 2);
        return;
      }
    }

    // 2. Generate the recording config (optionally adopting inferred routes).
    const mode = argValue("--mode", "branch-change");
    const generateArgs = [
      `--base-url=${baseUrl}`,
      `--target=${targetBranch}`,
      `--mode=${mode}`,
      ...argValues("--route").map((route) => `--route=${route}`),
      ...(argFlag("--infer-routes") ? ["--infer-routes"] : []),
      ...(argFlag("--html") ? ["--html"] : []),
      ...(argFlag("--html-only") ? ["--html-only"] : []),
      ...(argFlag("--guided") ? ["--guided"] : []),
      ...(argFlag("--mr-description") ? ["--mr-description"] : []),
      ...argValues("--mr-summary").map((item) => `--mr-summary=${item}`),
      ...argValues("--mr-change").map((item) => `--mr-change=${item}`),
      ...argValues("--validation").map((item) => `--validation=${item}`),
    ];
    const generated = await runScript("generate_recording_config.mjs", generateArgs, cwd);
    phases.push({ name: "config-generation", result: generated.json });
    if (!generated.json.ok || !generated.json.configPath) {
      // Relay the structured stop (missing_routes with candidateRoutes, auth, etc.).
      emit({ ...generated.json, phases }, generated.code || 2);
      return;
    }
    configPath = generated.json.configPath;
  }

  // 3. Run the automated orchestrator end-to-end.
  const walkthrough = await runScript("run_walkthrough.mjs", [`--config=${configPath}`, `--target=${targetBranch}`, `--cwd=${cwd}`], cwd);
  phases.push({ name: "walkthrough", ok: walkthrough.json.ok === true });
  emit({ ...walkthrough.json, configPath, phases }, walkthrough.code);
}

main().catch((error) => {
  emit({ ok: false, status: "error", error: error.message }, 1);
});
