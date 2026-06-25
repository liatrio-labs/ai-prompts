# Playwright Recording Reference

## Config Shape

The recording generator expects JSON similar to:

```json
{
  "baseUrl": "http://localhost:5173",
  "branchSlug": "feat-example",
  "outputDir": "../walkthrough-artifacts/feat-example",
  "captionPosition": "bottom-right",
  "browserMode": "headless",
  "recordingMode": "branch-change",
  "interactionMode": "automated",
  "demoPlanMode": "auto",
  "scrollPaddingPx": 96,
  "planItems": [
    "Show the updated filter affordance on the dashboard."
  ],
  "videoName": "feat-example-walkthrough",
  "storageStatePath": null,
  "steps": [
    {
      "title": "Open the dashboard",
      "caption": "The dashboard loads with the updated filters.",
      "action": "goto",
      "url": "/"
    },
    {
      "caption": "The filter keeps the same visual treatment.",
      "action": "click",
      "selector": { "role": "button", "name": "Filters" },
      "highlight": { "role": "button", "name": "Filters" },
      "waitFor": { "role": "dialog", "name": "Filters" }
    }
  ]
}
```

## Supported Step Actions

- `goto`: navigate to `url`, relative to `baseUrl` unless absolute.
- `click`: click `selector`.
- `fill`: fill `selector` with `value`.
- `select`: select `value` in `selector`.
- `press`: press keyboard key from `key`.
- `wait`: wait for `ms`.
- `screenshot`: capture screenshot using `name`.
- `caption`: update caption only.

Use `waitFor` on any step where the next visible state matters. Supported `waitFor` values use the same selector shape as actions, or `{ "url": "**/roadmaps/**" }`.

## One-Shot Runner

For the fastest path, `auto_walkthrough.mjs` chains runtime discovery, config generation, and the full automated runner in one command:

```bash
# Discover the dev server, infer routes from the branch diff, then record end-to-end
node visual-walkthrough-recorder/scripts/auto_walkthrough.mjs --infer-routes

# Or pin the runtime and routes explicitly
node visual-walkthrough-recorder/scripts/auto_walkthrough.mjs --base-url=http://localhost:5173 --route=/dashboard
```

It accepts the same output flags as the generator (`--mode`, `--route`, `--infer-routes`, `--html`, `--html-only`, `--mr-description` with `--mr-summary`/`--mr-change`/`--validation`, `--guided`). When `--base-url` is omitted it calls `detect_runtime.mjs` to probe common dev-server ports; when no server is reachable it stops with `runtime_unavailable` and a suggested start command. Pass an existing config with `--config=...` to skip generation. The command emits a single structured `needs_input` stop (exit code 2) for ambiguous routes, auth, or an unreachable runtime; otherwise it returns the full `run_walkthrough.mjs` report.

`detect_runtime.mjs` can also be run on its own to resolve a `baseUrl`:

```bash
node visual-walkthrough-recorder/scripts/detect_runtime.mjs        # probe default ports
node visual-walkthrough-recorder/scripts/detect_runtime.mjs --ports=5173,3000,8080
```

## Preflight

Prefer the automated runner once the recording config exists:

```bash
node visual-walkthrough-recorder/scripts/run_walkthrough.mjs --config=recording-config.json
```

The runner validates config shape, analyzes branch applicability, smoke-checks auth/runtime, inspects planned routes, executes selector preflight, records, validates artifacts, and writes `automation-report.json`. If it cannot continue safely, it exits with a structured `reason` such as `auth_required`, `runtime_unavailable`, `invalid_config`, `no_visual_changes`, or `preflight_unresolved`.

When a config does not exist, generate a starter config with explicit routes:

```bash
node visual-walkthrough-recorder/scripts/generate_recording_config.mjs --base-url=http://localhost:5173 --route=/dashboard --target=main
```

Use `--html` to include a screenshot walkthrough, `--html-only` to skip video recording and conversion, `--mr-description` with explicit `--mr-summary`, `--mr-change`, and `--validation` values to request the standardized MR description, `--mode=user-directed` for explicitly requested flows, and `--guided` only when the user asks for plan approval. User-directed configs must still default to `interactionMode=automated` and `demoPlanMode=auto`; do not add `--guided` just because the user named the flow. Pass `--infer-routes` to adopt static routes inferred from the branch diff when no explicit `--route` is given (dynamic routes such as `/post/:id` are surfaced but never auto-adopted). If the generator returns `needs_input`, its `candidateRoutes` list shows inferred routes with confidence and dynamic flags, so prefer picking from those over guessing.

Example user-directed automated HTML-only recording:

```bash
node visual-walkthrough-recorder/scripts/generate_recording_config.mjs \
  --mode=user-directed \
  --base-url=http://localhost:5173 \
  --route=/snapshots/123/report/456 \
  --html-only
```

For manual preflight before generating or running the final recording script:

```bash
node visual-walkthrough-recorder/scripts/validate_recording_config_shape.mjs --config=recording-config.json
node visual-walkthrough-recorder/scripts/inspect_page.mjs --base-url=http://localhost:5173 --path=/dashboard
node visual-walkthrough-recorder/scripts/validate_recording_config.mjs --config=recording-config.json
```

`inspect_page.mjs` returns visible headings, controls, bounding boxes, and candidate selectors. Use it to avoid guessing selectors from memory. Pass `--storage-state` and `--session-state` when protected routes require the same auth state as recording.

`validate_recording_config.mjs` dry-runs planned steps without video capture. It fails when selectors are missing, ambiguous, hidden, not scrollable into the viewport, or when a `waitFor` check does not pass. Fix these failures before recording.

If failure details include enough selector candidates to identify the intended target, update the config and rerun preflight without asking the user. If candidates do not clearly identify the intended target, ask a focused question with the failed step and candidate targets. Never record after failed preflight unless the user explicitly chooses to skip it for the current run.

## Selector Shape

Preferred selectors:

```json
{ "role": "button", "name": "Save", "exact": true }
{ "label": "Workstream", "exact": true }
{ "testId": "save-button" }
{ "text": "Program Wide", "exact": true }
{ "css": "[data-testid='save-button']" }
{ "css": "[data-row]", "hasText": "Roadmap" }
{ "css": "section", "hasText": "Roadmap", "within": { "role": "main" } }
{ "role": "button", "name": "Edit", "nth": 1 }
```

Use exact role/name, label, test ID, scoped CSS with `hasText`, and `within` scopes before broad visible text or CSS. Use `nth` only when the UI intentionally repeats equivalent controls and the index is documented in the recording plan. The generated script and preflight validator treat ambiguous selectors as errors instead of silently using the first match, so refine selectors before recording.

Generated scripts are stored outside the application repo, but should be executed with the application repo as the current working directory. This lets the script resolve the app's existing Playwright dependency without committing recording-only dependency changes. If the app repo does not provide Playwright, the scripts check for a global npm install before failing.

## Auth Smoke Check

Use `scripts/smoke_check.mjs` before recording when possible:

```bash
node visual-walkthrough-recorder/scripts/smoke_check.mjs --base-url=http://localhost:5173 --path=/
```

If the smoke check reports `authRequired: true`, stop and ask the user which auth mode to use. Do not guess credentials or read them from local files.

The script returns:

- whether auth appears required
- whether a standard login form was detected
- likely username/password/submit selectors
- recommended modes and whether scripted headless login appears available

Use scripted headless login only when the user provides credentials and the smoke check detected enough selectors to build typed login steps. Place those generated login steps in `preRecordSteps`, not `steps`, so the login flow runs before video recording and screenshots begin.

When using scripted headless login, generate typed login steps from saved smoke-check JSON:

```bash
printf '%s' '{"username":"<provided>","password":"<provided>"}' | node visual-walkthrough-recorder/scripts/create_login_steps.mjs --smoke=smoke-output.json
```

Treat the generated steps as transient config only. Do not commit or preserve configs containing credentials. Do not pass passwords as command-line arguments.

Videos and HTML screenshots must never show login screens or credential entry. If a screenshot step captures a login page, discard it and fix the recording plan before delivering artifacts.

For `headed-auth-headless-record`, launch a headed browser, let the user complete auth, save `storageState` under `tmp/`, close the headed session, then record headless with that state.

Use `scripts/capture_auth_state.mjs` for this mode:

```bash
node visual-walkthrough-recorder/scripts/capture_auth_state.mjs --base-url=http://localhost:5173 --output=../walkthrough-artifacts/<branch-slug>/tmp/storage-state.json
```

Then set `storageStatePath` in the recording config and run the generated script with `browserMode` set to `headless`.

For apps that store auth in `sessionStorage`, also pass `--session-output` when capturing auth state and set `sessionStoragePath` in the recording config. This is required because Playwright `storageState` preserves cookies and local storage, but not session storage. Smoke checks, route inspection, preflight, and recording should all use this same session state.

## Overlay Behavior

The generated script should inject:

- a caption overlay fixed to the requested corner
- a highlight overlay positioned from the target element bounding box

The caption overlay should include a clear border or ring so reviewers can distinguish narration from app UI.

The highlight must be hidden before unrelated interactions. Captions should be short and should not mention implementation internals.

Do not animate the highlight box between controls. It should disappear from the old location before being shown around the next element. While active, the highlight should track the target element's current bounding box and clear itself if the element detaches, hides, scrolls out of view, or moves offscreen. Clear highlights before navigation, after clicks, after waits, and before hover or route changes that may remove the target element.

Before drawing a highlight or moving the pointer to a target, the generated script should scroll the target into the recorded viewport and center it when possible. Leave enough top, bottom, left, and right padding that the highlighted region is not sitting at the edge of the video unless the page cannot scroll further.

For text entry, use typed input with per-character delay. Do not instantly paste or fill visible fields unless the user explicitly asks for speed over realism.
