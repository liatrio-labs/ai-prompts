# Commit Hygiene Thresholds

Use these thresholds to decide when to nudge commit splitting before message drafting.

## Inputs

- Active diff context:
  - Use staged diff when staged files exist.
  - Otherwise use unstaged working tree diff.
- Metrics:
  - Changed files count.
  - Changed lines (insertions + deletions) from `git diff --shortstat` or equivalent.

## Balanced Threshold Profile

- `green`: `<=5` files and `<=150` changed lines.
- `yellow`: `6-12` files or `151-400` changed lines.
- `red`: `>12` files or `>400` changed lines.

## Zone Actions

- `green`:
  - Continue with normal commit boundary evaluation.
- `yellow`:
  - Recommend splitting into multiple commits.
  - If user keeps single commit, continue and record risk in the final summary.
- `red`:
  - Require a split plan before proceeding.
  - Allow single-commit only with explicit user override.

## Required Reporting

Include `threshold_zone_encountered` in the run summary and record any override:

```text
threshold_zone_encountered: yellow
threshold_override: single-commit accepted by explicit user choice
```

## Examples

```text
green: 3 files, 92 changed lines
yellow: 8 files, 120 changed lines
yellow: 4 files, 210 changed lines
red: 14 files, 260 changed lines
red: 6 files, 430 changed lines
```
