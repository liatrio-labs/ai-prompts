---
name: visual-walkthrough-recorder
description: Use when a branch includes frontend or other visual UI changes and the user wants a reviewer-ready walkthrough video, optional HTML screenshot walkthrough, or an explicitly requested standardized MR/PR description markdown file. Compares the current branch to a target branch, plans a concise browser demo, records a Playwright video with captions and highlight boxes, supports WebM/MP4 output, and stores artifacts outside the application repo.
license: Apache-2.0
metadata:
  owner: liatrio
  compatibility: Agent-neutral. Requires Node.js and Playwright in the application repo; ffmpeg/ffprobe optional for MP4 output and artifact validation.
---

# Visual Walkthrough Recorder

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format: `"<marker1><marker2><marker3>\n<response>"`

The marker for this skill is: `🎬`

Use this skill for either branch-change walkthroughs or user-directed functionality recordings. For branch-change walkthroughs, use it only when the branch has visual user-facing changes. For user-directed recordings, use it when the user explicitly asks to record specified functionality, even if that functionality is broader than the current branch diff. User-directed scope does not imply guided interaction; stay automated unless the user explicitly asks for guided mode or plan approval.

For the full tool-agnostic workflow, read `AGENT_GUIDE.md`. For implementation details, load only the relevant reference:

- `references/playwright-recording.md` for the automated runner, recording scripts, overlays, selectors, auth, and smoke checks.
- `references/artifact-policy.md` for artifact paths, cleanup, validation, optional MR description output, and final reporting.

## Workflow

Run the workflow in fully automated mode by default. Keep updates terse: one short discovery/status line before meaningful phases is enough, then proceed through deterministic discovery, planning, inspection, preflight, config generation, recording, validation, cleanup, and final reporting when the next action is clear. Use guided mode only when the user explicitly asks for a guided recording experience or asks to approve the plan.

For the fastest automated path, prefer the one-shot runner `scripts/auto_walkthrough.mjs`: it discovers a running dev server when `baseUrl` is not provided, generates the recording config (optionally adopting routes inferred from the branch diff with `--infer-routes`), and runs the full pipeline through artifact validation in a single command. It emits one structured `needs_input` stop (exit code 2) only when human input is genuinely required (ambiguous routes, auth, or no reachable runtime). Drop down to the individual scripts below when you need finer control.

1. Determine the recording mode:
   - `branch-change`: default mode when the user asks for a walkthrough of the current branch or MR.
   - `user-directed`: only when the user explicitly asks to record specific functionality, pages, or flows; keep `interactionMode=automated` and `demoPlanMode=auto` unless guided mode was explicitly requested.
2. In `branch-change` mode, compare the current branch to `target_branch`, defaulting to `main`.
3. In `branch-change` mode, validate that the proposed route(s), actions, captions/callouts, and expected visual evidence cover only changed browser-visible behavior from the branch diff. Stop or revise if the proposal includes unrelated functionality.
4. In `user-directed` mode, build the plan from the user's requested functionality and label it as user-directed in the plan and run log; it may cover unchanged functionality, but it must not trigger extra narration or approval prompts.
5. Stop if the selected mode has no visual/browser surface to demonstrate.
6. Ask focused clarifying questions only when scope, target branch, route(s), user-directed flow, runtime, auth strategy, data setup, selectors, or expected visual evidence cannot be derived from the branch diff, local app, or explicit user request. Do not silently guess when there is not a clear path.
7. Build a concise demo plan. In automated mode, keep the plan internal and include it in `run-log.md`; in guided mode, present it to the user for approval before recording. The plan must list the mode, route(s), actions, captions/callouts, expected visual evidence, and for `branch-change` mode the diff evidence that justifies each item.
8. Confirm the app runtime only when it must be started, restarted, or changed and the execution environment requires user approval. If the app is already reachable, reuse it.
9. Prefer `scripts/generate_recording_config.mjs` when a recording config does not exist; provide known route(s), base URL, mode, and requested outputs. Pass `--infer-routes` to adopt static routes inferred from the branch diff when you do not pass explicit `--route` values. If it returns `needs_input`, it includes `candidateRoutes` (file-based-routing guesses, with dynamic routes flagged) so you can pick a route in one step instead of guessing.
10. Prefer `scripts/run_walkthrough.mjs --config=...` for the automated path once a recording config exists; it validates config shape, analyzes branch applicability, smoke-checks auth/runtime, inspects routes with configured auth state, preflights selectors, records or captures HTML-only screenshots, validates artifacts, and reports structured stop reasons.
11. Generate or refine a recording config with explicit `recordingMode`, `interactionMode`, `demoPlanMode`, `planItems`, route steps, selectors, highlights, `waitFor` checks for important state changes, and branch-change evidence where available.
12. If not using the automated runner, run `scripts/validate_recording_config_shape.mjs --config=...` and `scripts/validate_recording_config.mjs --config=...` before generating or running the final recording script. Revise the config until selectors are unique, targets are visible after padded scroll, and `waitFor` checks pass.
13. Generate a branch-specific Playwright recording script under `../walkthrough-artifacts/<branch-slug>/`.
14. Add bottom-right captions by default, highlight boxes, precise stable selectors, human-paced movement, and real Playwright video recording unless `htmlOnly` is requested.
15. Smoke check the app before recording, using `scripts/smoke_check.mjs` when useful. If auth is detected, ask the user whether to provide credentials for scripted headless login, authenticate once for partial-headless recording, or record fully headed.
16. Record WebM, optionally convert to MP4 with `ffmpeg`, optionally generate an HTML screenshot walkthrough, or capture screenshot-only HTML when the user requests HTML-only output.
17. If the user explicitly requested an MR/PR description, generate `mr-description.md` from the standardized template; otherwise do not create it.
18. Validate outputs with `scripts/validate_artifacts.mjs` when useful, write `run-log.md`, clean temporary files by default, and report final artifact paths.

## Required Defaults

- `target_branch`: `main`.
- `caption_position`: `bottom-right`.
- `video_mode`: `single`.
- `demo_plan_mode`: `auto`; use `guided` only when the user explicitly asks for a guided experience or plan approval.
- `recording_mode`: `branch-change`, unless the user explicitly requests `user-directed` functionality recording.
- `interaction_mode`: `automated`; do not switch to guided because the recording is user-directed.
- `browser_mode`: `headless`.
- `include_mr_description`: `false`; set true only when the user explicitly asks for an MR/PR description, MR doc, or MR body.
- `html_only`: `false`; set true only when the user asks for an HTML walkthrough without video.
- Artifact folder: `../walkthrough-artifacts/<branch-slug>/`.

## Hard Rules

- Do not stitch screenshots into video.
- Do not commit Playwright or recording-only dependencies to the application repo unless explicitly requested.
- Do not read credentials from local files.
- Do not silently choose an auth strategy when auth is detected.
- Do not include login screens or credential entry in videos, screenshots, or HTML walkthroughs. Use pre-record auth steps or headed auth capture before recording starts.
- Generate MR/PR description text only when the user explicitly asks for it as part of the recording request. Use the standardized `assets/mr-description-template.md` structure and write `mr-description.md` under the artifact folder.
- In generated MR/PR descriptions, keep Summary, What Changed, and Validation semantically distinct: Summary is reviewer-facing impact, What Changed is concrete behavior or implementation detail, and Validation is product/code validation of the change. Do not include local video artifact paths or recording-script validation as MR validation.
- In automated mode, do not stop for plan approval; build the plan internally, validate it, and record when preflight passes. In guided mode, present a concrete walkthrough plan and wait for explicit user approval before recording.
- User-directed recordings still use automated mode by default. Do not present a plan for approval, ask broad preference questions, or narrate each step just because the user named the target functionality.
- Do not interrupt for defaults or deterministic checks when there is a clear next step. Ask only for choices that materially affect recording scope, runtime startup or restart, auth, unavailable test data, unresolved selectors, preflight failure overrides, non-default artifacts, or expansion beyond branch scope.
- Ask clarifying questions instead of making assumptions when the recording scope, routes, app state, test data, auth, runtime, selectors, or expected evidence is unclear.
- In `branch-change` mode, do not plan, propose, or record unrelated functionality. Validate each scene against changed files, changed routes/components, or changed visible behavior before preflight or guided plan presentation.
- In `user-directed` mode, clearly label the plan and run log as user-directed so reviewers do not assume it is limited to branch changes.
- When generating the recording script, choose the most precise selector available for each target: exact role/name, label, test ID, or scoped CSS with `hasText`. Do not rely on broad text/CSS selectors or first-match behavior when a unique selector can be identified. If the right selector cannot be determined, ask a clarifying question or inspect the page before recording.
- Do not start final video capture until the recording config has passed preflight, unless the user explicitly chooses to skip preflight for the current run.
- Ensure each highlighted target is scrolled into the video viewport with comfortable padding before showing the highlight or moving the pointer. Avoid callouts sitting at the extreme edge of the frame when the page can scroll.
- Use the same callouts for the optional HTML walkthrough as the video.
- For HTML-only requests, skip video recording and MP4 conversion; produce `walkthrough.html` and referenced screenshots only.
- Keep shared behavior compatible with non-Codex agents through `AGENT_GUIDE.md` and the scripts in `scripts/`.
