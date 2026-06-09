# Task 04 Proofs - Local adherence checker and representative evals

## Task Summary

Task 4.0 adds a local v1 Liatrio design-system adherence checker plus representative eval artifacts for dark HTML generation, brand/design-system audits, deck asset selection, and static/offline helper restyling. The checker is intentionally Python standard library only and operates on local files, returning structured JSON for deterministic review.

## What This Task Proves

- The checker adapts deterministic ideas from `_adherence.oxlintrc.json` and `colors_and_type.css` into local token, typography, copy, source, and structure checks.
- The checker emits structured JSON with `status`, `checked_file`, `findings`, `warnings`, and `summary`.
- Representative eval artifacts exist for the required workflows and document objective assertions.
- A representative HTML artifact passes the checker without network access.
- The skill still passes repository quick validation after scripts and examples were added.

## Evidence Summary

- `check-liatrio-design-adherence.py` was added under the skill's `scripts/` directory and rejects URL inputs, reads only local files, and imports no network/subprocess helpers.
- `representative-dark-html-artifact.html` demonstrates dark-first Space Grotesk HTML using local token CSS and approved green/surface tokens.
- `liatrio-design-system-representative-evals.md` documents required eval prompts and objective assertions for dark HTML, audits, deck selection, and offline restyling.
- `uv run scripts/quick_validate.py skills/liatrio-brand-guidelines` returned `Skill is valid!`.

## Artifact: Source inspection inputs

**What it proves:** Task 4.1 inspected the local design-system enforcement inputs before implementing the checker.

**Why it matters:** The checker behavior is grounded in local bundle material rather than a new external dependency or subjective-only rules.

**Source files inspected:**

- `temp/Liatrio Design System/_adherence.oxlintrc.json`
- `skills/liatrio-brand-guidelines/assets/colors_and_type.css`

**Result summary:** `_adherence.oxlintrc.json` provided deterministic patterns for raw hex, raw px, and non-Space Grotesk font usage. `colors_and_type.css` provided the canonical Space Grotesk font, dark surfaces (`--bg`, `--surface`, `--dark-bg`, `--dark-bg-2`), approved green tokens (`--primary-green`, `--bright-green`, `--accent`, `--accent-bright`), and local token names used by the checker.

## Artifact: Local-only checker implementation

**What it proves:** The checker is implemented as a local Python standard-library script with structured JSON output and no external service calls.

**Why it matters:** The spec requires a v1 deterministic checker that can run offline against local artifacts and produce review-ready output.

**Artifact path:** `skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py`

**Local/network dependency scan command:**

~~~bash
python - <<'PY'
from pathlib import Path
p=Path('skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py')
text=p.read_text()
for term in ['requests','urllib.request','http.client','socket','subprocess','http://','https://']:
    print(f'{term}:', term in text)
PY
~~~

**Result summary:** No network, subprocess, or HTTP helper strings are present in the script.

~~~text
requests: False
urllib.request: False
http.client: False
socket: False
subprocess: False
http://: False
https://: False
~~~

## Artifact: Representative eval/review artifacts

**What it proves:** The required representative eval prompts and objective assertions are committed under the skill examples directory.

**Why it matters:** These artifacts make skill behavior reviewable across the required use cases, not just one checker demo.

**Command:**

~~~bash
find skills/liatrio-brand-guidelines/examples/evals -maxdepth 1 -type f | sort
~~~

**Result summary:** The eval assertion document and representative HTML artifact are present.

~~~text
skills/liatrio-brand-guidelines/examples/evals/liatrio-design-system-representative-evals.md
skills/liatrio-brand-guidelines/examples/evals/representative-dark-html-artifact.html
~~~

## Artifact: Adherence checker run against representative artifact

**What it proves:** The checker runs locally against a committed representative artifact and returns the required structured JSON fields.

**Why it matters:** This is the task's primary executable proof that deterministic adherence checks are available for validation.

**Command:**

~~~bash
python skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py \
  skills/liatrio-brand-guidelines/examples/evals/representative-dark-html-artifact.html --pretty
~~~

**Result summary:** The checker returned `status: pass`, zero findings, zero warnings, the checked file path, and a summary of checks/tokens detected.

~~~json
{
  "checked_file": "/home/damien/Liatrio/repos/ai-prompts/skills/liatrio-brand-guidelines/examples/evals/representative-dark-html-artifact.html",
  "findings": [],
  "status": "pass",
  "summary": {
    "checks": [
      "local_file_only",
      "space_grotesk_required",
      "dm_sans_stale",
      "dark_first_surfaces",
      "approved_green_tokens",
      "liatrio_ai_source_reference",
      "copy_no_emoji_or_exclamation",
      "audit_or_html_structure_when_applicable",
      "offline_external_reference_warning"
    ],
    "finding_count": 0,
    "raw_hex_count": 0,
    "tokens_detected": [
      "--accent",
      "--accent-bright",
      "--accent-fg",
      "--bg",
      "--border-accent",
      "--fg",
      "--font",
      "--glow-accent",
      "--r-2",
      "--r-4",
      "--s-3",
      "--s-5",
      "--s-7",
      "--s-8",
      "--surface"
    ],
    "warning_count": 0
  },
  "warnings": []
}
~~~

## Artifact: Python syntax check

**What it proves:** The checker script compiles successfully with the local Python interpreter.

**Why it matters:** This catches syntax/runtime import errors before relying on the checker in validation.

**Command:**

~~~bash
python -m py_compile skills/liatrio-brand-guidelines/scripts/check-liatrio-design-adherence.py
~~~

**Result summary:** The command returned exit code 0 with no output.

## Artifact: Skill quick validation

**What it proves:** Adding scripts and examples did not break skill package structure or metadata validation.

**Why it matters:** The repository's standard skill validation gate must remain green before final quality gates in parent task 5.0.

**Command:**

~~~bash
uv run scripts/quick_validate.py skills/liatrio-brand-guidelines
~~~

**Result summary:** Quick validation passed.

~~~text
Skill is valid!
~~~

## Reviewer Conclusion

Task 4.0 is implemented: a local/offline structured JSON adherence checker exists, representative eval artifacts cover the requested workflows with objective assertions, a committed representative HTML artifact demonstrates the checker, and the skill quick-validation gate passes. Final repository-wide gates remain intentionally reserved for parent task 5.0.
