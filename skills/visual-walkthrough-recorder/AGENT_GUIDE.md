# Visual Walkthrough Recorder Agent Guide

This guide is agent-neutral. Use it from Codex, Claude, Kiro CLI, or another coding agent when a user needs a reviewer-ready walkthrough for frontend changes.

## Applicability

Use this workflow in one of two modes:

- `branch-change`: records the current branch's browser-visible changes for reviewers.
- `user-directed`: records functionality, pages, or flows explicitly requested by the user.

In `branch-change` mode, use this workflow only when a branch changes visual browser behavior: pages, modals, forms, tables, reports, themes, filters, dialogs, charts, navigation, empty states, or user-visible workflow states. Stop and explain that the workflow does not apply when the branch is backend-only, API-only, migration-only, CI-only, test-only, or documentation-only.

In `user-directed` mode, the requested recording may cover unchanged functionality. Label the plan and run log as user-directed so it is not mistaken for a branch-diff walkthrough. User-directed is a scope choice, not an interaction style; it still uses automated interaction and auto demo planning unless the user explicitly asks for guided mode or plan approval.

## Inputs

Infer what is safe; ask for what is ambiguous.

- `target_branch`: default `main`.
- `base_url`: local frontend URL. Detect and reuse common dev ports when possible; ask only if no reachable app or clear startup command can be found.
- `artifact_format`: `webm`, `mp4`, or `both`. Default to `mp4` when `ffmpeg` exists, otherwise `webm`.
- `caption_position`: default `bottom-right`; valid values are `bottom-left`, `bottom-right`, `top-left`, `top-right`.
- `caption_colors` and `highlight_colors`: optional user overrides.
- `include_html_walkthrough`: default `false`; enable only when requested.
- `html_only`: default `false`; enable only when the user asks for an HTML walkthrough without video.
- `include_mr_description`: default `false`; enable only when the user explicitly asks for an MR/PR description, MR doc, or MR body.
- `video_mode`: `single` by default; allow `multiple`.
- `recording_mode`: `branch-change` by default; use `user-directed` only when the user explicitly asks to record specific functionality, pages, or flows.
- `interaction_mode`: `automated` by default; use `guided` only when the user explicitly asks for a guided experience or plan approval.
- `demo_plan_mode`: `auto` by default; treat `proposed` as guided-mode plan approval.
- `browser_mode`: `headless` by default; allow `headed-auth-headless-record` or `headed`.
- `scrollPaddingPx`: default `96`; use for preflight and recording target framing.

## Interaction Protocol

Run each recording in automated mode unless the user explicitly asks for guided mode. Keep updates short and sparse: report key checkpoints, not every internal step. Only ask when the next step needs user judgment, missing information, auth input, or execution approval.

1. **Discover**: determine mode, branch/target, changed visual surfaces or requested flow, likely routes, existing runtime, artifact format default, and whether auth appears likely.
2. **Decide**: ask only for unresolved choices that affect scope, auth, runtime startup or restart, unavailable test data, HTML output, multiple videos, or non-default artifacts.
3. **Plan**: build the walkthrough plan with route(s), actions, captions/callouts, expected visual evidence, prerequisites, and diff evidence for `branch-change` mode. When no config exists, prefer `scripts/generate_recording_config.mjs` with explicit route(s) and requested outputs. In automated mode, keep the plan internal and include it in `run-log.md`. In guided mode, present it for approval before recording.
4. **Preflight**: prefer `scripts/run_walkthrough.mjs --config=...` for the automated path; otherwise inspect routes, validate config shape, validate selectors, refine selectors automatically when evidence is clear, and report pass/fail status.
5. **Record**: announce the plan summary and output format, then record after preflight passes.
6. **Validate**: verify final artifacts and note warnings, duration, screenshots/HTML status, and cleanup status.
7. **Deliver**: provide final video, optional HTML, optional MR description, run log, target branch, and any caveats.

### Proceed Without Asking

Proceed automatically when the next step is deterministic and low risk:

- branch diff analysis, visual applicability classification, dev-server discovery (`detect_runtime.mjs`), route inference from the branch diff, route inspection, smoke checks, config generation, config shape validation, selector refinement from `inspect_page.mjs`, preflight reruns, generated-script creation, artifact validation, cleanup of temporary recorder files
- running the one-shot `auto_walkthrough.mjs` pipeline; it stops and asks only via the structured `needs_input` reasons it emits (ambiguous routes, auth, unreachable runtime)
- defaults: `target_branch=main`, `interaction_mode=automated`, `demo_plan_mode=auto`, `caption_position=bottom-right`, `video_mode=single`, `browser_mode=headless`, `include_mr_description=false`, `html_only=false`, MP4 when `ffmpeg` exists otherwise WebM, standard artifact folder
- terse progress updates at key checkpoints while running checks or recording

Still ask before:

- starting, restarting, or changing frontend/backend servers when not already reachable or when the execution environment requires approval
- choosing or changing auth mode
- using user credentials or manual headed auth
- approving the walkthrough plan in guided mode
- recording functionality outside branch scope in `branch-change` mode
- skipping failed preflight or recording despite unresolved selector, data, route, runtime, or auth issues
- keeping raw screenshots without HTML or changing artifact location when it is not already requested

## Clarifying Questions

Ask concise clarifying questions before finalizing the walkthrough plan when scope, target branch, route(s), requested user-directed flow, auth strategy, runtime, app state, test data, expected visual evidence, or reliable selectors are unclear.

Do not infer a route, data setup, selector, or expected UI state when it cannot be validated from the branch diff, local app, or explicit user request. In `branch-change` mode, ask when the diff-to-demo mapping is ambiguous. In `user-directed` mode, ask when the requested functionality is too broad or lacks the target path, starting state, or success condition.

## Recording Modes

### Branch-Change Mode

Use when the user asks for a walkthrough of the current branch, MR, PR, or "the changes." Before preflight or guided plan presentation:

1. Compare the current branch against `target_branch`.
2. Identify changed browser-visible files, routes, components, labels, workflows, and states.
3. Map each proposed scene to a specific changed file, route/component, or changed visual behavior.
4. Remove any scene that cannot be justified by the branch diff.
5. Record the diff evidence for each scene in the internal plan or guided plan.

### User-Directed Mode

Use only when the user explicitly asks to record specific functionality, pages, or flows, for example "record the login flow" or "make a video of creating a snapshot." In this mode:

1. Build the plan from the user's requested functionality instead of branch diff scope.
2. The recording may include unchanged functionality.
3. Label the plan as `user-directed`.
4. Include a brief note in `run-log.md` that scope was selected by explicit user request, not limited to branch changes.
5. Keep `interactionMode` as `automated` and `demoPlanMode` as `auto` unless the user explicitly asks for guided mode or plan approval.
6. Do not present the plan for approval, ask broad preference questions, or provide step-by-step narration solely because the user named the functionality to record.

## Branch Review

1. Determine the current branch.
2. Determine `recording_mode`.
3. In `branch-change` mode, compare against `target_branch`.
4. In `branch-change` mode, classify changed files as visual/frontend, backend/API, tests, docs, config, or mixed.
5. In `branch-change` mode, identify changed routes, components, labels, dialogs, and workflows.
6. Build the smallest demo that shows meaningful visual behavior. Do not call out tiny polish unless it is the purpose of the branch or the user explicitly asked for it in `user-directed` mode.

## Demo Plan Handling

Before any recording run, validate the plan scope and build a concise walkthrough plan. In automated mode, do not stop for plan approval; include the plan in `run-log.md` and proceed to preflight. In guided mode, present the plan and wait for explicit user approval.

In `branch-change` mode, scope validation must happen before preflight or guided plan presentation. Every route, action, caption/callout, and expected visual evidence item must be traceable to changed browser-visible behavior in the branch diff. If an item is not traceable, remove it or switch to `user-directed` mode only if the user explicitly requests that broader scope.

The plan must include:

- recording mode
- target branch/base branch and artifact format
- route(s) to visit
- actions to take, in order
- captions or callouts to show
- expected visual evidence the reviewer should see
- in `branch-change` mode, the changed file/route/component evidence for each scene
- known prerequisites such as running servers or auth state
- whether an MR description markdown file will be generated when explicitly requested

In automated mode, do not start recording, generate the final recording script, or capture screenshots/video until the internal plan is scope-valid and preflight passes. In guided mode, do not start those actions until the user approves the plan. Always include the plan in `run-log.md`.

## Preflight

After plan handling and before final recording:

1. Inspect each planned route with `scripts/inspect_page.mjs`.
2. Build or generate a recording config that includes `recordingMode`, `interactionMode`, `demoPlanMode`, `planItems`, selectors, highlights, `waitFor` checks for meaningful state changes, and branch-change evidence where available.
3. Run `scripts/validate_recording_config_shape.mjs --config=<config>` and `scripts/validate_recording_config.mjs --config=<config>`, or use `scripts/run_walkthrough.mjs --config=<config>` to run both plus recording and artifact validation.
4. Fix selector, route, auth, test-data, or wait-state failures before generating the final script.

Preflight must verify that every action selector and highlight selector is unique, visible, and scrollable into a padded viewport. Treat ambiguous selectors as config bugs. If preflight cannot infer the correct selector or app state, ask the user a clarifying question instead of recording and retrying blindly.

### Preflight Recovery

- If `inspect_page.mjs` provides a unique better selector, update the config and rerun preflight without asking.
- If a selector remains ambiguous, report the failing step, selector, match count, and best candidate selectors, then ask only if the correct target cannot be inferred.
- If route, auth, data setup, or intended state is missing, ask a targeted question before recording.
- Do not start final capture after failed preflight unless the user explicitly chooses to skip preflight for this run.

## Prompt Templates

Use these as patterns; adapt details to the repo and keep them concise.

### Discovery Summary

```text
I found this as a branch-change recording against main. The visible surface appears to be <routes/components>. I can use automated mode with the standard defaults: single MP4 if available, bottom-right captions, and artifacts under ../walkthrough-artifacts/<branch>. I will inspect the route(s), build the internal plan, preflight it, and record if validation passes.
```

### Runtime Startup

```text
I need the frontend running to inspect and record the planned route(s). I found `<command>` in `<path>` for port `<port>`. I will start it unless approval is required by the execution environment.
```

### Auth Choice

```text
The smoke check detected auth. Available modes are: scripted headless login, manual headed login then headless recording, or fully headed recording. I recommend `<mode>` because `<reason>`.
```

### Automated Plan Summary

```text
Automated recording plan built:
- Mode: <branch-change|user-directed>
- Routes: <routes>
- Actions: <ordered actions>
- Evidence: <what reviewer should see>

I will preflight this plan now and record only if preflight passes.
```

For user-directed automated requests, keep the update even shorter when the route and runtime are known:

```text
I found the requested route and will run this as a user-directed automated recording. I will only stop if preflight, auth, runtime, or test data needs input.
```

### Guided Plan Approval

```text
Recording plan:
- Mode: <branch-change|user-directed>
- Routes: <routes>
- Actions: <ordered actions>
- Callouts: <captions/highlights>
- Evidence: <what reviewer should see>
- Prerequisites: <runtime/auth/data>

I will preflight this plan after approval, then record only if preflight passes.
```

### Preflight Success

```text
Preflight passed: selectors are unique, targets scroll into frame with padding, and expected states were verified. I will generate the recording script and start capture.
```

### Preflight Failure

```text
Preflight failed on step <n>: <reason>. I can resolve it automatically with <candidate selector/change>, so I will update the config and rerun preflight.
```

If the fix is not clear:

```text
Preflight failed on step <n>: <reason>. I found these likely targets: <candidates>. Which target should this callout/action use?
```

### Recording Start

```text
Recording the <automated|approved guided> plan now: <n> scenes, <format>, <browser mode>. Auth screens and credential entry are excluded.
```

### Final Delivery

```text
Recording complete. Video: <path>. HTML: <path or not requested>. MR description: <path or not requested>. Run log: <path>. Format: <format>. Target branch: <branch>. Warnings: <none/list>.
```

## Runtime Startup

Reuse already reachable runtimes. If a required server is not reachable and the command is clear from the repo, start it in automated mode unless the execution environment requires approval. In guided mode, or when the command/path/port is uncertain, ask first. Any startup prompt must include:

- command
- repo/path
- expected port when known
- why it is required for the recording

Do not assume permission from previous sessions when the execution environment requires approval.

## Auth Handling

Do not load credentials from local files. Run `scripts/smoke_check.mjs` before recording when possible. If it reports `authRequired: true`, ask the user how to authenticate and show the available modes from the script output.

Supported modes:

- `headless`: use when routes are public or auth can be scripted safely with user-provided steps.
- `scripted-headless-login`: use only when a standard login form is detected and the user provides credentials in the conversation. Generate typed login steps from the detected selectors.
- `headed-auth-headless-record`: open a headed browser for the user to authenticate, save temporary Playwright `storageState`, then record headless.
- `headed`: use when auth or app behavior does not work headless.

Store temporary auth state under the artifact temp folder and clean it up by default. If the app uses `sessionStorage` for auth, capture and restore a separate session storage file as well because Playwright `storageState` does not include it.

When auth is detected, ask a concise question similar to:

```text
I detected a login form. Do you want to provide credentials for scripted headless login, log in manually once and record headless, or record fully headed?
```

If scripted credentials are provided, do not pass passwords as command-line arguments. Do not write credentials to disk except inside the transient generated recording script/config needed for the current run, and rely on normal cleanup to remove those files. Prefer partial-headless for SSO, Entra ID, MFA, CAPTCHA, device prompts, or nonstandard login flows.

For security, login screens and credential entry must not appear in final videos or HTML screenshots. Put scripted login steps in `preRecordSteps`, not `steps`, so auth happens before video capture starts. For manual auth, use `headed-auth-headless-record`, then begin recording only after the authenticated state is captured.

## Recording Standards

- Use Playwright browser video recording.
- Never use screenshot stitching as a video fallback.
- In automated mode, do not record until the internal plan is scope-valid and preflight has passed. In guided mode, do not record until the user has approved the proposed walkthrough plan.
- Prefer one continuous video unless the user chooses multiple clips.
- Navigate like a user would; avoid direct URL jumps unless demonstrating a deep link or no realistic navigation path exists.
- Move the pointer before clicking.
- Type text at human speed instead of pasting/filling instantly.
- Pause after navigation and important state changes.
- Keep captions short and reviewer-focused.
- Place captions bottom-right by default, unless that obscures the UI.
- Caption overlays should be visually distinct from the application with a clear border or ring treatment.
- Highlight only the active callout. The highlight should appear, disappear, and then appear at the next element; it must not animate or float between controls.
- Highlights must track the target element while active and clear themselves if the element detaches, hides, scrolls out of view, or moves offscreen.
- Clear the highlight before navigation, after clicks, after waits, and before moving to unrelated UI so it does not linger over stale positions.
- Use the most precise stable selector available: exact role/name, label, test ID, scoped CSS with `hasText`, or a deliberately documented `nth` index when the UI has repeated equivalent elements. Avoid broad visible text or CSS selectors when a unique role, label, or test ID exists.
- Do not rely on first-match behavior. If a selector matches multiple visible elements and no explicit index is intended, refine the selector before recording.
- Use `waitFor` on steps that open a modal, change route, save data, load a filtered view, or reveal important content so preflight can prove the expected state before video capture.
- Before highlighting, clicking, filling, or selecting an element, scroll it into the recorded viewport with enough padding that the callout is not pinned to the edge when scrolling can improve the framing.
- Retry alternate selectors lightly. If repeated failures occur, revise the script automatically before asking the user.

## Artifacts

Default folder:

```text
../walkthrough-artifacts/<branch-slug>/
```

Expected structure:

```text
record-<branch-slug>.mjs
run-log.md
videos/
screenshots/
walkthrough.html
mr-description.md
tmp/
```

Only create files needed for selected outputs. Clean temporary files by default.

## Scripts

The `scripts/` folder provides reusable helpers:

- `auto_walkthrough.mjs`: one-shot runner that chains runtime discovery, config generation (with optional `--infer-routes`), and `run_walkthrough.mjs` into a single command; emits one structured `needs_input` stop when human input is required.
- `detect_runtime.mjs`: probes common dev-server ports and returns the first reachable `baseUrl`; when none is reachable it suggests a start command from `package.json` scripts.
- `analyze_branch.mjs`: compares the current branch to a target branch, classifies whether visual changes exist, and infers candidate routes from file-based routing.
- `generate_recording_config.mjs`: creates a starter recording config from branch analysis, route(s), base URL, mode, and requested outputs; with `--infer-routes` it adopts inferred static routes, and its `needs_input` response includes `candidateRoutes` when routes are missing.
- `capture_auth_state.mjs`: opens a headed browser, waits for the user to authenticate, and saves temporary Playwright storage state.
- `create_login_steps.mjs`: converts smoke-check selectors plus user-provided credentials into typed login steps for a transient recording config.
- `run_walkthrough.mjs`: primary automated runner for config validation, branch analysis, smoke checks, route inspection, preflight, recording, artifact validation, and structured stop reasons.
- `create_recording_script.mjs`: writes a branch-specific Playwright script from a validated JSON config.
- `inspect_page.mjs`: inspects a route and reports visible headings, controls, bounding boxes, and candidate selectors.
- `validate_recording_config_shape.mjs`: validates config fields before browser preflight.
- `validate_recording_config.mjs`: dry-runs planned steps without video capture and validates selectors, padded scrolling, and `waitFor` checks.
- `convert_video.mjs`: converts WebM to MP4 when `ffmpeg` is available.
- `generate_html_walkthrough.mjs`: creates a static HTML walkthrough that references screenshot files.
- `generate_mr_description.mjs`: creates `mr-description.md` from the standardized MR template when explicitly requested.
- `smoke_check.mjs`: loads the target app, detects auth barriers, identifies likely login selectors, and returns recommended browser/auth modes as JSON.
- `validate_artifacts.mjs`: verifies generated artifact files exist, are nonzero, includes video duration and resolution when `ffprobe` is available, and can extract sample frames with `ffmpeg`.
- `cleanup_artifacts.mjs`: removes temporary and diagnostic files while preserving final video, HTML, referenced screenshots, run log, and optional MR description.
- `self_test.mjs`: runs lightweight deterministic checks for branch classification, config validation, and MR rendering.

Generated scripts should live in the artifact folder, not inside the application repo.

Run generated scripts from the application repo root so they can resolve project-local dependencies such as Playwright without adding recording-only dependencies to the repo. The recorder first checks the application repo for `playwright`, then falls back to a global npm install discovered with `npm root -g`.

After a normal run, the artifact folder should contain only:

- `run-log.md`
- the final video file, preferably MP4 when `ffmpeg` is available
- optional `walkthrough.html` and referenced screenshots when the user requested the HTML walkthrough
- optional `mr-description.md` when the user requested an MR/PR description
- optional `automation-report.json` when diagnostics are intentionally preserved

Clean generated scripts, raw Playwright video files, temporary auth/session state, scratch configs, and screenshots that are not needed by HTML.

Do not leave screenshot files as standalone review artifacts. If screenshots are kept, `walkthrough.html` must also exist and reference them, unless the user explicitly asked to keep raw screenshots.

Generate `mr-description.md` only when requested. It must follow `assets/mr-description-template.md` with `Summary`, `What Changed`, `Validation`, and `Video Walkthrough` sections in that order. The Summary section should briefly describe the reviewer-facing outcome and impact; it should not duplicate the detailed What Changed bullets. The What Changed section should list concrete implementation or UI behavior changes. The Validation section should list product/code checks performed for the change itself, such as tests, builds, manual verification, or walkthrough coverage of changed behavior; do not use recording preflight, artifact validation, or local video creation as MR validation. The video section must keep a TODO placeholder for the MR-hosted upload, but must not include local video paths. Do not include credentials, auth details, raw selectors, debug logs, local artifact paths, or generated-script internals.

Never keep screenshots of login screens or credential entry.

## Validation

Before final response:

- Confirm video files exist and are nonzero.
- Confirm duration is plausible when tooling allows.
- Extract sample frames when `ffmpeg` is available.
- Confirm optional HTML and screenshots exist.
- Write `run-log.md` with branch, target branch, visual applicability decision, selected modes, pages visited, retries, warnings, output paths, and whether an MR description was generated.
- Confirm config preflight passed or report that the user explicitly skipped it.
- Report artifact paths clearly.

## Final Response

Keep it concise. Include:

- video path
- optional HTML path
- run log path
- optional MR description path
- format produced
- target branch
- validation warnings, if any
