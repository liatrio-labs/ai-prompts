# 01 Tasks - Spell Checker

## Relevant Files

- `.pre-commit-config.yaml` - Main pre-commit configuration file that needs the typos hook added. Contains existing hooks (check-yaml, markdownlint-fix, commitlint, gitleaks) and follows repository patterns.
- `test-spell-check.md` - Temporary test file that will be created to verify auto-fix functionality. Contains intentional misspellings for testing purposes. Should be removed after testing is complete.

### Notes

- The typos hook should be added after the markdownlint hook in `.pre-commit-config.yaml` to ensure formatting is correct before spell checking.
- Use the typos pre-commit repository: `https://github.com/crate-ci/typos` with version `v1.39.2`.
- Configure the hook to only process Markdown files using `files: \.md$` or `types: [markdown]`.
- Use `--write-changes` (or `-w`) argument to enable auto-fix functionality.
- Follow the repository's existing hook configuration patterns (version pinning with `rev` tag, consistent formatting).
- Test file should be created temporarily and removed after verification to keep the repository clean.

## Tasks

### [x] 1.0 Add typos hook to pre-commit configuration

#### 1.0 Proof Artifact(s)

- File: `.pre-commit-config.yaml` shows typos hook configuration with correct repository URL and version demonstrates hook is properly configured
- CLI: `pre-commit run typos --all-files` returns exit code 0 when no spelling errors exist demonstrates basic integration works
- Screenshot: `git commit` output showing typos hook running demonstrates hook executes during commit workflow

#### 1.0 Tasks

- [x] 1.1 Verify typos pre-commit repository URL (`https://github.com/crate-ci/typos`) and latest stable version (`v1.39.2`) from the spec
- [x] 1.2 Open `.pre-commit-config.yaml` and locate the markdownlint hook section (lines 25-29)
- [x] 1.3 Add new typos hook repository entry after the markdownlint hook section with repository URL `https://github.com/crate-ci/typos` and version `rev: v1.39.2`
- [x] 1.4 Configure the typos hook with `id: typos` and set `files: \.md$` to only process Markdown files
- [x] 1.5 Add `args: [--write-changes]` to enable auto-fix functionality
- [x] 1.6 Verify the hook is positioned after markdownlint and before commitlint/gitleaks hooks
- [x] 1.7 Run `pre-commit install` to ensure hooks are installed/updated
- [x] 1.8 Run `pre-commit run typos --all-files` to verify the hook executes successfully and returns exit code 0 on existing repository files

### [ ] 2.0 Configure auto-fix functionality and verify behavior

#### 2.0 Proof Artifact(s)

- Test file: `test-spell-check.md` contains intentional misspellings (e.g., "receive", "separate") demonstrates auto-fix capability
- CLI: `pre-commit run typos --files test-spell-check.md` shows corrections applied and exit code 1 demonstrates auto-fix and failure behavior
- File diff: `git diff test-spell-check.md` shows corrected spellings demonstrates files are modified correctly

#### 2.0 Tasks

- [ ] 2.1 Create temporary test file `test-spell-check.md` in the repository root directory
- [ ] 2.2 Add intentional misspellings to the test file (e.g., "receive" instead of "receive", "separate" instead of "separate", "occurred" instead of "occurred")
- [ ] 2.3 Run `pre-commit run typos --files test-spell-check.md` to test the hook on the test file
- [ ] 2.4 Verify the command output shows corrections being applied (typos should report the misspellings found)
- [ ] 2.5 Verify the command returns exit code 1 (indicating corrections were made and commit should fail)
- [ ] 2.6 Run `git diff test-spell-check.md` to verify the file was actually modified with corrected spellings
- [ ] 2.7 Verify the corrected spellings match expected corrections (e.g., "receive" → "receive")

### [ ] 3.0 Verify integration with existing pre-commit workflow

#### 3.0 Proof Artifact(s)

- CLI: `pre-commit run --all-files` output shows typos hook executing along with other hooks demonstrates integration works
- CLI: `git commit -m "test: add test file"` with intentional misspelling shows typos catching error demonstrates end-to-end workflow
- File: `.pre-commit-config.yaml` shows typos hook in correct position (after markdownlint) demonstrates proper configuration

note: undo the changes with the intentional misspellings after testing.

#### 3.0 Tasks

- [ ] 3.1 Run `pre-commit run --all-files` to execute all hooks including typos
- [ ] 3.2 Verify typos hook appears in the output and executes successfully alongside other hooks (check-yaml, markdownlint-fix, gitleaks)
- [ ] 3.3 Verify hook execution order: check-yaml → markdownlint-fix → typos → gitleaks (commitlint runs on commit-msg stage separately)
- [ ] 3.4 Stage the test file `test-spell-check.md` with `git add test-spell-check.md`
- [ ] 3.5 Attempt to commit with `git commit -m "test: add test file"` to test end-to-end workflow
- [ ] 3.6 Verify the commit fails with typos hook error message showing spelling corrections were made
- [ ] 3.7 Verify `fail_fast: false` configuration allows all hooks to run even if typos fails
- [ ] 3.8 Review the corrected test file and unstage it with `git restore --staged test-spell-check.md`
- [ ] 3.9 Delete the test file `test-spell-check.md` to clean up temporary testing artifacts
- [ ] 3.10 Run `pre-commit run --all-files` one final time to verify all hooks pass on clean repository state
