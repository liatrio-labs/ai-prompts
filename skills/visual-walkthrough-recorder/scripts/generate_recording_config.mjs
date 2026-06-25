#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { analyzeBranch } from "./lib/branch_analysis.mjs";

function argValue(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function argFlag(name) {
  return process.argv.slice(2).includes(name);
}

function argValues(name) {
  const prefix = `${name}=`;
  return process.argv.slice(2)
    .filter((arg) => arg.startsWith(prefix))
    .map((arg) => arg.slice(prefix.length))
    .filter(Boolean);
}

function slugify(value) {
  return String(value || "walkthrough")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "walkthrough";
}

function stop(reason, message, details = {}) {
  console.log(JSON.stringify({
    ok: false,
    status: "needs_input",
    reason,
    message,
    details,
  }, null, 2));
  process.exitCode = 2;
}

function routeStep(route, index, mode) {
  const label = route === "/" ? "the application home page" : route;
  return {
    action: "goto",
    url: route,
    caption: mode === "user-directed"
      ? `Review the requested flow on ${label}.`
      : `Review the branch-visible changes on ${label}.`,
    pauseAfterMs: 1400,
  };
}

function screenshotStep(route, index, mode) {
  const number = String(index + 1).padStart(3, "0");
  const label = route === "/" ? "Application home page" : route;
  return {
    action: "screenshot",
    name: `${number}-walkthrough.png`,
    title: mode === "user-directed" ? `Requested flow: ${label}` : `Changed UI: ${label}`,
    description: mode === "user-directed"
      ? "Screenshot captured from the requested walkthrough scope."
      : "Screenshot captured from a route associated with browser-visible branch changes.",
    caption: mode === "user-directed"
      ? "This screen is part of the requested walkthrough."
      : "This screen shows the branch change in context.",
  };
}

async function main() {
  const baseUrl = argValue("--base-url");
  const targetBranch = argValue("--target", "main");
  const mode = argValue("--mode", "branch-change");
  const output = argValue("--output");
  let routes = argValues("--route");
  const inferRoutesFlag = argFlag("--infer-routes");
  const includeHtmlWalkthrough = argFlag("--html") || argFlag("--html-only");
  const htmlOnly = argFlag("--html-only");
  const includeMrDescription = argFlag("--mr-description");
  const mrSummaryItems = argValues("--mr-summary");
  const mrChangeItems = argValues("--mr-change");
  const validationItems = argValues("--validation");
  const guided = argFlag("--guided");
  const artifactFormat = argValue("--artifact-format", "auto");

  if (!baseUrl) {
    stop("missing_base_url", "Config generation requires --base-url=<frontend URL>.");
    return;
  }

  if (!["branch-change", "user-directed"].includes(mode)) {
    stop("invalid_mode", "--mode must be branch-change or user-directed.", { mode });
    return;
  }

  const branch = await analyzeBranch({ targetBranch });
  if (mode === "branch-change" && !branch.visualApplicable) {
    stop("no_visual_changes", "No browser-visible branch changes were detected.", branch);
    return;
  }

  // Routes inferred from file-based routing. Dynamic routes (e.g. /post/:id) are
  // surfaced as suggestions but never auto-adopted, since they are not visitable URLs.
  const candidateRoutes = branch.candidateRoutes || [];
  const adoptableRoutes = candidateRoutes.filter((candidate) => !candidate.dynamic).map((candidate) => candidate.route);

  if (routes.length === 0 && inferRoutesFlag && adoptableRoutes.length > 0) {
    routes = [...new Set(adoptableRoutes)];
  }

  if (routes.length === 0) {
    stop(
      "missing_routes",
      inferRoutesFlag
        ? "No static routes could be inferred from the branch diff; provide at least one --route."
        : "Config generation needs at least one --route, or pass --infer-routes to adopt inferred static routes.",
      {
        candidateRoutes,
        visualSurfaces: branch.visualSurfaces,
        visualFiles: branch.visualFiles,
      },
    );
    return;
  }

  if (includeMrDescription && (mrSummaryItems.length === 0 || mrChangeItems.length === 0 || validationItems.length === 0)) {
    stop("missing_mr_description_fields", "MR description generation requires --mr-summary, --mr-change, and --validation values.", {
      missing: [
        ...(mrSummaryItems.length === 0 ? ["mrSummaryItems"] : []),
        ...(mrChangeItems.length === 0 ? ["mrChangeItems"] : []),
        ...(validationItems.length === 0 ? ["validationItems"] : []),
      ],
    });
    return;
  }

  const branchSlug = slugify(branch.currentBranch || "walkthrough");
  const outputDir = path.resolve(argValue("--output-dir", `../walkthrough-artifacts/${branchSlug}`));
  const config = {
    baseUrl,
    currentBranch: branch.currentBranch,
    targetBranch,
    branchSlug,
    recordingMode: mode,
    interactionMode: guided ? "guided" : "automated",
    demoPlanMode: guided ? "proposed" : "auto",
    outputDir,
    videoName: `${branchSlug}-walkthrough`,
    artifactFormat,
    browserMode: "headless",
    viewport: { width: 1440, height: 1000 },
    videoSize: { width: 1440, height: 1000 },
    captionPosition: "bottom-right",
    scrollPaddingPx: 96,
    includeHtmlWalkthrough,
    htmlOnly,
    keepScreenshots: includeHtmlWalkthrough,
    cleanup: true,
    includeMrDescription,
    ...(includeMrDescription ? { mrSummaryItems, mrChangeItems, validationItems } : {}),
    planItems: mode === "user-directed"
      ? routes.map((route) => `Record the user-requested flow on ${route}.`)
      : [
        `Show browser-visible changes from ${branch.visualFiles.map((item) => item.file).join(", ")}.`,
        ...routes.map((route) => `Capture changed UI evidence on ${route}.`),
      ],
    diffEvidence: mode === "branch-change" ? branch.visualFiles : [],
    supportingFiles: branch.supportingFiles,
    steps: routes.flatMap((route, index) => [
      routeStep(route, index, mode),
      screenshotStep(route, index, mode),
    ]),
  };

  const outputPath = path.resolve(output || path.join(outputDir, "recording-config.json"));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(JSON.stringify({
    ok: true,
    status: "complete",
    configPath: outputPath,
    branch,
    routes,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, status: "error", error: error.message }, null, 2));
  process.exitCode = 1;
});
