#!/usr/bin/env node
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { promisify } from "node:util";
import { validateArtifactFiles } from "./lib/artifact_validation.mjs";
import { validateRecordingConfigShape } from "./lib/config_validation.mjs";

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function slugify(value) {
  return String(value || "walkthrough")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "walkthrough";
}

async function runNode(scriptName, args, options = {}) {
  const scriptPath = path.join(scriptDir, scriptName);
  const { stdout, stderr } = await execFileAsync(process.execPath, [scriptPath, ...args], {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8",
    maxBuffer: options.maxBuffer || 1024 * 1024 * 20,
  });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

async function runNodeJson(scriptName, args, options = {}) {
  try {
    const result = await runNode(scriptName, args, options);
    return result.stdout ? JSON.parse(result.stdout) : {};
  } catch (error) {
    const output = String(error.stdout || error.stderr || "").trim();
    if (output) {
      try {
        return JSON.parse(output);
      } catch {
        return { ok: false, error: error.message, output };
      }
    }
    return { ok: false, error: error.message };
  }
}

// A recoverable stop that needs human input (exit code 2).
async function stop(reason, message, details = {}) {
  console.log(JSON.stringify({
    ok: false,
    status: "needs_input",
    reason,
    message,
    details,
  }, null, 2));
  process.exitCode = 2;
}

// A genuine failure that is not a human-input gate (exit code 1) so callers
// like auto_walkthrough.mjs can distinguish errors from needs_input stops.
async function fail(reason, message, details = {}) {
  console.log(JSON.stringify({
    ok: false,
    status: "error",
    reason,
    message,
    details,
  }, null, 2));
  process.exitCode = 1;
}

function outputDirFor(config) {
  const branchSlug = slugify(config.branchSlug || config.currentBranch);
  const outputDir = path.resolve(config.outputDir || `../walkthrough-artifacts/${branchSlug}`);
  return outputDir;
}

async function generatedFilesFromRunLog(outputDir) {
  const runLogPath = path.join(outputDir, "run-log.md");
  const files = [runLogPath];
  const runLog = await readFile(runLogPath, "utf8");
  for (const line of runLog.split("\n")) {
    const match = line.match(/^- (Video|HTML|MR description) path: (.+)$/);
    if (!match || match[2] === "not requested") continue;
    files.push(match[2]);
  }
  return files;
}

async function writeAutomationReport(outputDir, report) {
  try {
    await mkdir(outputDir, { recursive: true });
    await writeFile(
      path.join(outputDir, "automation-report.json"),
      `${JSON.stringify(report, null, 2)}\n`,
    );
  } catch {
    // Reporting must not mask the structured stop reason.
  }
}

async function main() {
  const configPath = argValue("--config");
  if (!configPath) {
    await stop("missing_config", "Automated walkthrough requires --config=recording-config.json.");
    return;
  }

  const cwd = argValue("--cwd", process.cwd());
  const targetBranch = argValue("--target", "main");
  const executeActions = argValue("--execute-actions", "true");
  const strictMrDescription = argValue("--strict-mr", "true") === "true";
  const keepDiagnostics = argValue("--keep-diagnostics", "false") === "true";
  const config = JSON.parse(await readFile(path.resolve(configPath), "utf8"));
  config.interactionMode = config.interactionMode || "automated";
  config.demoPlanMode = config.demoPlanMode || "auto";
  config.targetBranch = config.targetBranch || targetBranch;

  const outputDir = outputDirFor(config);
  const normalizedConfigPath = path.join(outputDir, "tmp", "automated-recording-config.json");
  const report = {
    ok: false,
    status: "running",
    interactionMode: config.interactionMode,
    targetBranch: config.targetBranch,
    configPath: path.resolve(configPath),
    outputDir,
    phases: [],
    warnings: [],
  };

  // Resolve a missing baseUrl before shape validation (which requires baseUrl),
  // so configs can rely on dev-server auto-discovery.
  if (!config.baseUrl) {
    const runtime = await runNodeJson("detect_runtime.mjs", [`--cwd=${cwd}`], { cwd });
    report.phases.push({ name: "runtime-detection", result: runtime });
    if (runtime.ok && runtime.baseUrl) {
      config.baseUrl = runtime.baseUrl;
      report.warnings.push(`Discovered runtime at ${runtime.baseUrl}; set baseUrl explicitly to pin it.`);
    } else {
      await writeAutomationReport(outputDir, report);
      await stop("runtime_unavailable", "Config is missing baseUrl and no reachable dev server was discovered.", {
        expected: "Set baseUrl to a reachable frontend URL, or start the dev server.",
        suggestion: runtime.suggestion,
        probedPorts: runtime.probedPorts,
      });
      return;
    }
  }

  const shape = validateRecordingConfigShape(config, { strictMrDescription });
  report.phases.push({ name: "config-shape", ...shape });
  report.warnings.push(...shape.warnings);
  if (!shape.ok) {
    await writeAutomationReport(outputDir, report);
    await stop("invalid_config", "Recording config failed shape validation.", shape);
    return;
  }
  await mkdir(path.dirname(normalizedConfigPath), { recursive: true });
  await writeFile(normalizedConfigPath, `${JSON.stringify(config, null, 2)}\n`);

  const branch = await runNodeJson("analyze_branch.mjs", [`--target=${config.targetBranch}`], { cwd }).catch((error) => ({
    ok: false,
    error: error.message,
  }));
  report.phases.push({ name: "branch-analysis", result: branch });
  if (config.recordingMode !== "user-directed") {
    // A usable analysis always reports a boolean visualApplicable; anything else
    // (non-zero exit, non-JSON stdout) means we cannot validate diff scope.
    if (typeof branch.visualApplicable !== "boolean") {
      await writeAutomationReport(outputDir, report);
      await stop("branch_analysis_failed", "Branch analysis did not return a usable result; cannot validate branch-change scope.", branch);
      return;
    }
    if (branch.visualApplicable === false) {
      await writeAutomationReport(outputDir, report);
      await stop("no_visual_changes", "Branch-change walkthrough is not applicable because no visual changes were detected.", branch);
      return;
    }
  }

  const firstRoute = config.steps.find((step) => step.url)?.url || "/";
  const smoke = await runNodeJson("smoke_check.mjs", [
    `--base-url=${config.baseUrl}`,
    `--path=${firstRoute}`,
    ...(config.storageStatePath ? [`--storage-state=${config.storageStatePath}`] : []),
    ...(config.sessionStoragePath ? [`--session-state=${config.sessionStoragePath}`] : []),
  ], { cwd }).catch((error) => ({ ok: false, error: error.message }));
  report.phases.push({ name: "smoke-check", result: smoke });
  if (!smoke.ok) {
    await writeAutomationReport(outputDir, report);
    await stop("runtime_unavailable", "Smoke check could not reach the app runtime.", smoke);
    return;
  }
  if (smoke.authRequired && !config.storageStatePath && !config.sessionStoragePath && !config.preRecordSteps?.length) {
    await writeAutomationReport(outputDir, report);
    await stop("auth_required", "Auth is required and no reusable auth state or pre-record login steps were configured.", smoke);
    return;
  }

  const inspectedRoutes = [];
  for (const route of [...new Set(config.steps.filter((step) => step.url).map((step) => step.url))]) {
    const inspected = await runNodeJson("inspect_page.mjs", [
      `--base-url=${config.baseUrl}`,
      `--path=${route}`,
      ...(config.storageStatePath ? [`--storage-state=${config.storageStatePath}`] : []),
      ...(config.sessionStoragePath ? [`--session-state=${config.sessionStoragePath}`] : []),
    ], { cwd }).catch((error) => ({ ok: false, error: error.message, route }));
    inspectedRoutes.push({ route, ok: inspected.ok !== false, counts: inspected.counts, error: inspected.error });
  }
  report.phases.push({ name: "route-inspection", routes: inspectedRoutes });
  const failedInspection = inspectedRoutes.find((route) => !route.ok);
  if (failedInspection) {
    await writeAutomationReport(outputDir, report);
    await stop("route_inspection_failed", "Route inspection failed and requires runtime, auth, or route correction.", failedInspection);
    return;
  }

  const preflight = await runNodeJson("validate_recording_config.mjs", [
    `--config=${normalizedConfigPath}`,
    `--execute-actions=${executeActions}`,
    "--timeout-ms=15000",
  ], { cwd }).catch((error) => ({
    ok: false,
    error: error.message,
  }));
  report.phases.push({ name: "preflight", result: preflight });
  if (!preflight.ok) {
    await writeAutomationReport(outputDir, report);
    await stop("preflight_unresolved", "Recording preflight failed and requires config, selector, data, or runtime correction.", preflight);
    return;
  }

  // Script generation and recording are hard execution steps, not human-input
  // gates: a failure here is a genuine error (exit 1), not a needs_input stop.
  try {
    const script = await runNode("create_recording_script.mjs", [`--config=${normalizedConfigPath}`], { cwd });
    const recordingScriptPath = script.stdout.split("\n").filter(Boolean).at(-1);
    report.phases.push({ name: "script-generation", scriptPath: recordingScriptPath });

    await execFileAsync(process.execPath, [recordingScriptPath], {
      cwd,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 20,
    });
    report.phases.push({ name: "recording", ok: true });
  } catch (error) {
    report.phases.push({ name: "recording", ok: false, error: error.message });
    report.status = "recording_failed";
    await writeAutomationReport(outputDir, report);
    await fail("recording_failed", "Recording or script generation failed.", { error: error.message });
    return;
  }

  const files = await generatedFilesFromRunLog(outputDir);
  const validation = await validateArtifactFiles(files, {
    frameOutputDir: keepDiagnostics || config.keepDiagnostics ? path.join(outputDir, "validation-frames") : undefined,
    minDurationSeconds: Number(argValue("--min-duration-seconds", "2")),
  });
  report.phases.push({ name: "artifact-validation", result: validation });
  report.ok = validation.ok;
  report.status = validation.ok ? "complete" : "artifact_validation_failed";
  report.files = validation.files;
  await writeAutomationReport(outputDir, report);
  console.log(JSON.stringify(report, null, 2));
  if (!validation.ok) process.exitCode = 1;
}

main().catch(async (error) => {
  // Unexpected crashes are errors (exit 1), not human-input stops.
  await fail("unexpected_error", error.message);
});
