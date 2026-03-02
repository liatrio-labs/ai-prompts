# Audit Gates

## Purpose

Use this checklist to verify split integrity against the original branch net state.
Do not mark branch surgery complete before these gates pass.

## Mandatory Gates

1. File coverage parity: no missing files from original branch net diff.
2. No unexpected extras introduced by split conversion.
3. Per-file parity: resulting content matches expected final state.
4. Deletion semantics parity for removed files.
5. Branch scope boundaries align with PR intent.

## Suggested Verification Commands

Adjust base/head names to current repository context.

```bash
git diff --name-only <base>...<original-branch>
git diff --name-only <base>...<split-branch>
git diff --name-status <base>...<original-branch>
git diff --name-status <base>...<split-branch>
git diff --name-only <base>...<original-branch> | sort -u
git diff --name-only <base>...<split-branch> | sort -u
```

Interpretation checklist:

- Files present in original but absent in split: fail for missing coverage.
- Files present in split but absent in original: fail for unexpected extras.
- Identical file lists: proceed to per-file content and deletion-semantics parity checks.

Acceptance criteria:

- Pass only if there are no missing files, no unexpected extras, and all per-file parity checks pass.
- Fail if any missing, extra, content mismatch, or deletion mismatch remains unresolved.

## Ownership Ledger Method

1. Build a ledger of files changed in the original branch.
2. Assign each file to one or more split branches by ownership intent.
3. Verify each file is represented exactly as expected in split outputs.
4. Investigate all unowned or multiply owned files.
5. Record pass/fail verdict with evidence links for each gate.

## Remediation Loop

If any gate fails:

1. Identify failure type: missing, extra, content mismatch, deletion mismatch, scope leak.
2. Apply targeted branch fixes.
3. Re-run all gates, not only the failed gate.
4. Record deviations if intentional and approved.

## Completion Standard

Declare completion only when:

- All mandatory gates pass, or
- Any intentional divergence is documented with rationale and user approval.
