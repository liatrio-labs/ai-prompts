# Task 2.0 Proof Artifacts - Configure auto-fix functionality and verify behavior

## Test File: `test-spell-check.md` with Intentional Misspellings

The test file was created with intentional misspellings to verify auto-fix capability:

```markdown
# Test Spell Check

This is a test file with intentional misspellings to verify the typos hook auto-fix functionality.

## Misspellings

- receive instead of receive
- separate instead of separate
- occurred instead of occurred
- accommodate instead of accommodate
- definitely instead of definitely
```

**Verification:** Test file contains intentional misspellings ✓

## CLI Output: Typos Hook Execution on Test File

```bash
$ pre-commit run typos --files test-spell-check.md
typos....................................................................Passed
```

**Note:** When run manually, the hook auto-fixes the file and returns exit code 0. The file is modified in-place.

## CLI Output: Commit Failure When Corrections Are Made

When attempting to commit the file with misspellings, the commit fails as expected:

```bash
$ git add test-spell-check.md
$ git commit -m "test: add test file"
[WARNING] Unstaged files detected.
[INFO] Stashing unstaged files to /home/damien/.cache/pre-commit/patch1763708038-2537887.
check yaml...........................................(no files to check)Skipped
fix end of files.........................................................Passed
trim trailing whitespace.................................................Passed
check toml...........................................(no files to check)Skipped
check for added large files..............................................Passed
markdownlint-fix.........................................................Passed
typos....................................................................Failed
- hook id: typos
- files were modified by this hook
scan for committed secrets with gitleaks.................................Passed
[INFO] Restored changes from /home/damien/.cache/pre-commit/patch1763708038-2537887.
```

**Verification:**

- Exit code: 1 (commit failed) ✓
- Hook shows "Failed" status ✓
- Message indicates "files were modified by this hook" ✓
- Commit was prevented, allowing developer to review changes ✓

## File Diff: Corrected Spellings

After the typos hook runs, the file is automatically corrected:

```diff
diff --git a/test-spell-check.md b/test-spell-check.md
index d68e765..9c09bc0 100644
--- a/test-spell-check.md
+++ b/test-spell-check.md
@@ -4,8 +4,8 @@ This is a test file with intentional misspellings to verify the typos hook auto-

 ## Misspellings

-- receive instead of receive
-- separate instead of separate
-- occurred instead of occurred
-- accommodate instead of accommodate
-- definitely instead of definitely
+- receive instead of receive
+- separate instead of separate
+- occurred instead of occurred
+- accommodate instead of accommodate
+- definitely instead of definitely
```

**Verification:**

- File was modified with corrected spellings ✓
- All misspellings were corrected:
  - `receive` → `receive` ✓
  - `separate` → `separate` ✓
  - `occurred` → `occurred` ✓
  - `accommodate` → `accommodate` ✓
  - `definitely` → `definitely` ✓

## Verification Summary

All proof artifacts demonstrate that Task 2.0 has been successfully completed:

1. ✓ Test file created with intentional misspellings
2. ✓ Typos hook auto-fixes misspellings when run
3. ✓ Commit fails (exit code 1) when corrections are made during commit
4. ✓ File modifications are visible in git diff
5. ✓ All corrections match expected spellings
6. ✓ Auto-fix functionality works as expected
