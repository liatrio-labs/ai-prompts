---
name: browser-qa
description: "Use when you need lightweight browser QA for a web page, local HTML file, or app: inspect console errors, broken assets, keyboard/focus behavior, viewport readability, and return evidence-backed findings JSON plus a concise HTML-ready proof report."
---

# Browser QA

## Overview

Use this skill for a focused, evidence-producing browser QA pass against a public URL, local page, or running web app. Browser automation drives the page; this skill defines which checks to run, what counts as evidence, how to classify results, and how to report them consistently.

Keep the pass demo-sized. This is for quick confidence, reviewer proof, and actionable defect reports, not for full accessibility certification, cross-browser coverage, or CI replacement.

## When to Use

Use this skill when the user asks you to:

- verify a page, local HTML file, UI change, or critical browser path
- check console errors, failed requests, broken images, keyboard navigation, or obvious layout/readability issues
- capture evidence for a browser-visible defect
- produce structured findings JSON, a proof summary, or a small HTML report

Do not use this skill for:

- load testing or performance benchmarking
- broad cross-browser/device certification
- full WCAG compliance audits
- replacing unit, integration, or end-to-end tests in CI

## Composition Boundary

Use whatever browser automation tool is available for mechanics:

- opening URLs or local files
- snapshots and element references
- clicking, filling, and keyboard actions
- console/network inspection
- screenshots
- extracting page text and state

This skill owns the QA judgment:

- which checks to run
- how each check is interpreted
- status classification: `pass`, `warn`, `fail`, or `unknown`
- findings JSON contract
- report shape and proof summary

## First Response Contract

Before opening the browser, identify the smallest useful QA target:

1. **Target**: URL, local file, route, or app/page name.
2. **Goal**: what the user wants verified.
3. **Critical path**: 1-3 actions that matter most.
4. **Evidence**: screenshot, console/network excerpts, keyboard notes, or report only.

If the target is missing and cannot be inferred, ask one question. Otherwise proceed with the obvious target and state any assumption in the final report.

## Workflow

### 1. Prepare the target

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

### 4. Write findings JSON

Before rendering or summarizing, produce findings JSON matching `references/evidence-contract.md`. For demo use, save it as `browser-qa-findings.json` unless the user provides another path.

Minimum rule: every non-`pass` check must include evidence. Evidence can be console text, network URL/status, screenshot path, DOM/snapshot detail, or a manual note.

If the repository contains this skill's `scripts/validate-findings.py`, validate the JSON before reporting:

```bash
python skills/browser-qa/scripts/validate-findings.py browser-qa-findings.json
```

### 5. Produce the proof report

Use `references/report-template.md` for the user-facing summary. If the user asks for an artifact, create a small standalone HTML file with the same sections:

- target URL/file
- timestamp and viewport
- overall status and counts
- per-check statuses
- evidence bullets
- screenshot thumbnail or link when present
- recommended fixes or follow-ups

## Output Rules

- Lead with `pass`, `warn`, `fail`, or `unknown`.
- Say exactly what was checked; do not claim full coverage.
- Include URL/route/file and the action sequence.
- Quote only relevant console/network lines.
- Do not include secrets, cookies, tokens, or private page data.
- Separate blocking defects from warnings, observations, and unchecked areas.

## Common Pitfalls

1. **Testing too much.** Keep the pass narrow; propose follow-up paths instead of expanding silently.
2. **Turning taste into defects.** Mark subjective visual notes as observations unless they violate a requirement.
3. **Skipping JSON.** The findings JSON is the reusable contract that makes the report repeatable.
4. **Losing unknowns.** Use `unknown` when browser tooling cannot inspect a surface.
5. **Overstating confidence.** A focused browser pass is evidence, not proof of complete quality.

## Verification Checklist

Before finishing, confirm:

- [ ] Target URL, file, or route loaded.
- [ ] Critical path exercised.
- [ ] Compact check set completed or marked `unknown`.
- [ ] Console/network output checked when tooling allowed it.
- [ ] Findings JSON uses the expected contract.
- [ ] Non-pass checks include evidence.
- [ ] Final report distinguishes checked items, defects, warnings, and unchecked areas.
