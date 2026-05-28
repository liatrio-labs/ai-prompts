---
name: browser-qa
description: "Use when you need lightweight browser QA for a web page, local HTML file, or app: inspect console errors, broken assets, keyboard/focus behavior, viewport readability, and publish evidence-backed findings JSON through a local HTML report viewer."
---

# Browser QA

## Overview

Use this skill for a focused, evidence-producing browser QA pass against a public URL, local page, or running web app. Browser automation drives the page; this skill defines which checks to run, what counts as evidence, how to classify results, where to store report data, and how to launch the local report viewer.

Keep the pass demo-sized. This is for quick confidence, reviewer proof, and actionable defect reports, not for full accessibility certification, cross-browser coverage, or CI replacement.

## When to Use

Use this skill when the user asks you to:

- verify a page, local HTML file, UI change, or critical browser path
- check console errors, failed requests, broken images, keyboard navigation, or obvious layout/readability issues
- capture evidence for a browser-visible defect
- produce structured findings JSON and a local HTML report link

Do not use this skill for:

- load testing or performance benchmarking
- broad cross-browser/device certification
- full WCAG compliance audits
- replacing unit, integration, or end-to-end tests in CI

## Composition Boundary

Load and use the `agent-browser` skill for browser mechanics before starting the QA pass. Confirm the browser automation path is available enough to navigate, inspect console/network state, and capture screenshots or snapshots.

This skill owns the QA judgment:

- which checks to run
- how each check is interpreted
- status classification: `pass`, `warn`, `fail`, or `unknown`
- findings JSON contract
- temp-folder report layout
- local report viewer startup and final link

## First Response Contract

Before opening the browser, identify the smallest useful QA target:

1. **Target**: URL, local file, route, or app/page name.
2. **Goal**: what the user wants verified.
3. **Critical path**: 1-3 actions that matter most.
4. **Evidence**: screenshot, console/network excerpts, keyboard notes, or report only.

If the target is missing and cannot be inferred, ask one question. Otherwise proceed with the obvious target and state any assumption in the final report.

## Report Storage Contract

All browser-qa runs live under one system temp folder:

```text
/tmp/browser-qa-reports/
  20260528-154216-example-com/
    findings.json
    screenshot-home.png
    screenshot-focus.png
```

Use the platform temp directory, not the repository, for run outputs:

```bash
python - <<'PY'
import tempfile
from pathlib import Path
print(Path(tempfile.gettempdir()) / 'browser-qa-reports')
PY
```

Create one subfolder per QA run. Use a stable, readable run id such as `YYYYMMDD-HHMMSS-slug`. Keep screenshots and supporting artifacts in the same run subfolder. In `findings.json`, artifact values should be filenames or relative paths inside that run folder, for example `"screenshot": "screenshot-home.png"`.

## Workflow

### 1. Prepare the target and browser tool

- Load `agent-browser` and follow its installed guidance for navigation, snapshots, console/network inspection, and screenshots.
- Start or verify the local app if the target is local.
- Navigate directly to the URL, file, or route.
- Use a webinar-friendly 16:9 viewport when tooling allows it, such as 1280x720 or 1366x768.
- Record target URL/file, viewport if known, and any seeded test data.

### 2. Run the critical path first

Exercise the main flow before broad checks. For each step:

- state the intended behavior
- perform the browser action
- observe visible result
- check browser console/network output when available
- capture screenshot evidence for failures, warnings, or important visual states

### 3. Run the compact check set

Use `references/checks.md` for check definitions. Keep the default pass to:

1. Console errors and failed resource requests.
2. Broken images/assets.
3. Keyboard/focus smoke test for primary nav or CTA.
4. 16:9 viewport readability: clipping, overflow, unreadable hero/main content.
5. Optional accessibility/content smoke checks: missing obvious heading, missing image alt text, or no main content.

Preserve `unknown` when automation cannot prove a result.

### 4. Write and validate findings JSON

Before rendering or summarizing, produce `findings.json` matching `references/evidence-contract.md` in the run subfolder under `/tmp/browser-qa-reports`.

Minimum rule: every non-`pass` check must include evidence. Evidence can be console text, network URL/status, screenshot path, DOM/snapshot detail, or a manual note.

Validate the JSON before reporting:

```bash
uv run skills/browser-qa/scripts/validate-findings.py /tmp/browser-qa-reports/<run-id>/findings.json
```

Fix the JSON until validation passes.

### 5. Start or reuse the report server

The report viewer is static HTML served by a tiny Python server in this skill. It lists every `findings.json` under `/tmp/browser-qa-reports` and lets the user switch runs from a dropdown.

Check whether the server is already running before starting another one:

```bash
python - <<'PY'
from urllib.request import urlopen
try:
    print(urlopen('http://127.0.0.1:10891/api/reports', timeout=1).status)
except Exception:
    raise SystemExit(1)
PY
```

If that check fails, start it in the background from the repository root or skill folder:

```bash
uv run skills/browser-qa/scripts/serve-report.py --port 10891
```

If the server is already running, do not restart it. Just use the existing server.

### 6. Provide the direct report link

Give the user a link that opens the latest run directly:

```text
http://127.0.0.1:10891/?report=<run-id>
```

Also include the run folder path so artifacts are easy to inspect locally.

## Output Rules

- Lead with `pass`, `warn`, `fail`, or `unknown`.
- Say exactly what was checked; do not claim full coverage.
- Include URL/route/file and the action sequence.
- Include the validated `findings.json` path.
- Include the local report URL with `?report=<run-id>`.
- Quote only relevant console/network lines.
- Do not include secrets, cookies, tokens, or private page data.
- Separate blocking defects from warnings, observations, and unchecked areas.

## Common Pitfalls

1. **Testing too much.** Keep the pass narrow; propose follow-up paths instead of expanding silently.
2. **Turning taste into defects.** Mark subjective visual notes as observations unless they violate a requirement.
3. **Writing JSON in the repo root.** The demo viewer only discovers runs under the system temp folder's `browser-qa-reports` directory.
4. **Restarting the report server unnecessarily.** Probe `/api/reports`; only start the server if the probe fails.
5. **Using absolute artifact paths in JSON.** Store screenshots in the run folder and reference them by filename or run-relative path.
6. **Losing unknowns.** Use `unknown` when browser tooling cannot inspect a surface.
7. **Overstating confidence.** A focused browser pass is evidence, not proof of complete quality.

## Verification Checklist

Before finishing, confirm:

- [ ] Target URL, file, or route loaded.
- [ ] `agent-browser` was loaded or a browser tooling fallback was explicitly noted.
- [ ] Critical path exercised.
- [ ] Compact check set completed or marked `unknown`.
- [ ] Console/network output checked when tooling allowed it.
- [ ] Findings JSON is saved at `/tmp/browser-qa-reports/<run-id>/findings.json`.
- [ ] Findings JSON validates with `validate-findings.py`.
- [ ] Report server is running or known to already be running on port 10891.
- [ ] Final response includes `http://127.0.0.1:10891/?report=<run-id>`.
- [ ] Final report distinguishes checked items, defects, warnings, and unchecked areas.
