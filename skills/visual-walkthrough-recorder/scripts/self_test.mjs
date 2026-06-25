#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { validateRecordingConfigShape } from "./lib/config_validation.mjs";
import { classifyFile, inferRoutes } from "./lib/branch_analysis.mjs";
import { generateMrDescription } from "./lib/mr_description.mjs";
import { chooseStartCommand, detectPackageManager, parsePorts, DEFAULT_PORTS } from "./detect_runtime.mjs";

async function testBranchClassification() {
  assert.equal(classifyFile("src/features/snapshots/SnapshotReportPage.tsx"), "visual");
  assert.equal(classifyFile("src/features/snapshots/SnapshotReportPage.test.tsx"), "tests");
  assert.equal(classifyFile("src/__tests__/SnapshotReportPage.tsx"), "tests");
  assert.equal(classifyFile("docs/walkthrough.md"), "docs");
}

function testConfigValidation() {
  const base = {
    baseUrl: "http://localhost:5173",
    currentBranch: "fix/example",
    includeHtmlWalkthrough: true,
    htmlOnly: true,
    steps: [
      { action: "goto", url: "/" },
      { action: "screenshot", name: "001-home.png" },
    ],
  };
  assert.equal(validateRecordingConfigShape(base).ok, true);
  assert.equal(validateRecordingConfigShape({ ...base, includeHtmlWalkthrough: false }).ok, false);
}

async function testMrDescription() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "walkthrough-self-test-"));
  try {
    const outputPath = path.join(dir, "mr-description.md");
    await generateMrDescription({
      outputPath,
      config: {
        includeMrDescription: true,
        mrSummaryItems: ["Reviewer-facing impact."],
        mrChangeItems: ["Concrete UI behavior changed."],
        validationItems: ["Ran focused walkthrough validation."],
      },
    });
    const output = await readFile(outputPath, "utf8");
    assert.match(output, /## Summary/);
    assert.match(output, /## What Changed/);
    assert.match(output, /TODO: Upload walkthrough video/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function testHtmlOnlyConfigFixture() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "walkthrough-config-test-"));
  try {
    const configPath = path.join(dir, "config.json");
    await writeFile(configPath, JSON.stringify({
      baseUrl: "http://localhost:5173",
      currentBranch: "fix/example",
      includeHtmlWalkthrough: true,
      htmlOnly: true,
      steps: [{ action: "screenshot", name: "001.png" }],
    }));
    const parsed = JSON.parse(await readFile(configPath, "utf8"));
    assert.equal(validateRecordingConfigShape(parsed).ok, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function routeFor(files, route) {
  return inferRoutes(files).find((candidate) => candidate.route === route);
}

function testRouteInference() {
  const files = [
    { file: "app/dashboard/page.tsx" },
    { file: "src/pages/index.tsx" },
    { file: "src/pages/settings.tsx" },
    { file: "app/(marketing)/about/page.tsx" },
    { file: "app/blog/[slug]/page.tsx" },
    "src/routes/posts.$postId.tsx",
    { file: "src/components/Button.tsx" }, // not a routable page
    { file: "src/routes/+layout.svelte" }, // framework shell, not a page
  ];
  const routes = inferRoutes(files);
  const paths = routes.map((candidate) => candidate.route);

  assert.ok(paths.includes("/dashboard"), "directory page route");
  assert.ok(paths.includes("/"), "index route");
  assert.ok(paths.includes("/settings"), "named page route");
  assert.ok(paths.includes("/about"), "route group is stripped");
  assert.ok(paths.includes("/blog/:slug"), "dynamic route normalized");
  assert.ok(paths.includes("/posts/:postId"), "remix flat dynamic route");
  assert.ok(!paths.includes("/Button"), "non-page components are ignored");

  assert.equal(routeFor(files, "/blog/:slug").dynamic, true);
  assert.equal(routeFor(files, "/dashboard").dynamic, false);
  assert.equal(routeFor(files, "/dashboard").confidence, "high");
  assert.equal(routeFor(files, "/settings").confidence, "medium");
  // Layout/loading/error shells and SvelteKit non-page modules never produce routes.
  assert.equal(inferRoutes([{ file: "src/routes/loading.tsx" }]).length, 0);
  assert.equal(inferRoutes([{ file: "src/routes/api/posts/+server.ts" }]).length, 0);
  assert.equal(inferRoutes([{ file: "src/routes/dashboard/+layout.svelte" }]).length, 0);
  // Next.js App Router API handlers (route.ts) are not reviewer-facing pages.
  assert.equal(inferRoutes([{ file: "app/api/users/route.ts" }]).length, 0);
  // Next.js Pages Router API endpoints (pages/api/*) are not pages either.
  assert.equal(inferRoutes([{ file: "src/pages/api/users.ts" }]).length, 0);
  // A real SvelteKit page is still inferred.
  assert.equal(inferRoutes([{ file: "src/routes/dashboard/+page.svelte" }])[0].route, "/dashboard");
}

function testRuntimeHelpers() {
  assert.deepEqual(parsePorts("3000, 5173"), [3000, 5173]);
  assert.deepEqual(parsePorts(""), DEFAULT_PORTS);
  assert.deepEqual(parsePorts("not-a-port"), DEFAULT_PORTS);

  assert.equal(detectPackageManager(["pnpm-lock.yaml"]), "pnpm");
  assert.equal(detectPackageManager(["yarn.lock"]), "yarn");
  assert.equal(detectPackageManager(["package-lock.json"]), "npm");

  assert.equal(chooseStartCommand({ build: "x" }), null);
  assert.deepEqual(chooseStartCommand({ dev: "vite", start: "node" }), { script: "dev", command: "npm run dev" });
  assert.deepEqual(chooseStartCommand({ start: "node" }, "pnpm"), { script: "start", command: "pnpm run start" });
}

await testBranchClassification();
testConfigValidation();
await testMrDescription();
await testHtmlOnlyConfigFixture();
testRouteInference();
testRuntimeHelpers();
console.log(JSON.stringify({ ok: true }, null, 2));
