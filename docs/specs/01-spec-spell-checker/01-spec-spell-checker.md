# 01-spec-spell-checker.md

## Introduction/Overview

This feature adds automated spell checking to the pre-commit configuration using the `typos` spell checker tool. The spell checker will automatically scan all Markdown files in the repository during the pre-commit phase, auto-fix common misspellings when possible, and fail the commit if corrections were made to ensure developers review the changes. This improves documentation quality and consistency across the AI prompts repository.

## Goals

- Integrate `typos` spell checker into the existing pre-commit hook configuration
- Automatically check spelling in all Markdown files (`.md`) during commits
- Auto-fix common misspellings when possible
- Fail commits when corrections are made to ensure developer review of changes
- Maintain consistency with existing pre-commit hook patterns and repository standards
- Provide clear feedback to developers when spelling errors are detected or corrected

## User Stories

- **As a contributor**, I want spelling errors in Markdown files to be caught automatically so that documentation quality is maintained without manual review
- **As a maintainer**, I want common spelling mistakes to be auto-corrected so that I spend less time fixing typos in pull requests
- **As a developer**, I want the spell checker to fail my commit when it makes corrections so that I can review what was changed before committing
- **As a team member**, I want consistent spelling across all prompts so that the repository maintains professional quality standards

## Demoable Units of Work

### [Unit 1]: Basic Spell Checker Integration

**Purpose:** Integrate the `typos` spell checker into the pre-commit configuration to check all Markdown files

**Functional Requirements:**

- The system shall add a `typos` hook to `.pre-commit-config.yaml`
- The system shall configure the hook to check all Markdown files (`*.md`)
- The system shall run the spell checker during the pre-commit stage
- The hook shall use the latest stable version of the `typos` pre-commit repository
- The hook shall be positioned appropriately within the existing hook sequence

**Proof Artifacts:**

- `CLI: pre-commit run typos --all-files` returns exit code 0 when no spelling errors exist demonstrates basic integration works
- `Screenshot: git commit output showing typos hook running` demonstrates hook executes during commit workflow
- `File: .pre-commit-config.yaml` shows typos hook configuration demonstrates hook is properly configured

### [Unit 2]: Auto-Fix Functionality

**Purpose:** Enable automatic correction of common misspellings with commit failure when corrections are made

**Functional Requirements:**

- The system shall automatically fix common spelling errors when possible
- The system shall fail the commit when auto-fixes are applied
- The system shall provide clear output indicating what corrections were made
- The system shall allow developers to review corrected files before re-committing
- The hook shall use appropriate typos arguments to enable auto-fix behavior

**Proof Artifacts:**

- `Test file: test-spell-check.md` contains intentional misspellings (e.g., "receive", "separate") demonstrates auto-fix capability
- `CLI: pre-commit run typos --files test-spell-check.md` shows corrections applied and exit code 1 demonstrates auto-fix and failure behavior
- `File diff: git diff test-spell-check.md` shows corrected spellings demonstrates files are modified correctly

### [Unit 3]: Pre-commit Hook Validation

**Purpose:** Verify the spell checker integrates properly with the existing pre-commit workflow

**Functional Requirements:**

- The system shall run typos alongside existing hooks (markdownlint, commitlint, gitleaks) without conflicts
- The system shall respect the `fail_fast: false` configuration in `.pre-commit-config.yaml`
- The system shall execute in the correct order relative to other hooks
- The system shall work with `pre-commit run --all-files` command

**Proof Artifacts:**

- `CLI: pre-commit run --all-files` output shows typos hook executing along with other hooks demonstrates integration works
- `CLI: git commit -m "test: add test file"` with intentional misspelling shows typos catching error demonstrates end-to-end workflow
- `File: .pre-commit-config.yaml` shows typos hook in correct position demonstrates proper configuration

## Non-Goals (Out of Scope)

1. **Custom dictionary configuration**: No initial custom dictionary file or inline ignore comments will be implemented. The spell checker will use its default dictionary, and custom terms can be added later if needed.

2. **YAML or other file type checking**: Only Markdown files (`.md`) will be checked. YAML configuration files, JSON files, and other text formats are excluded from this initial implementation.

3. **File exclusions**: No specific files will be excluded from spell checking. All Markdown files in the repository will be checked, unlike markdownlint which excludes `CHANGELOG.md` and `LICENSE`.

4. **CI/CD integration**: This spec focuses on pre-commit hook integration only. Verifying spell checking in GitHub Actions workflows is out of scope for this feature.

5. **Performance optimization**: No specific performance tuning or caching strategies will be implemented initially, though typos is already optimized for speed.

## Design Considerations

No specific design requirements identified. This is a command-line tool integration with no user interface components.

## Repository Standards

- Follow existing `.pre-commit-config.yaml` structure and formatting patterns
- Use the same hook configuration style as existing hooks (markdownlint, commitlint, gitleaks)
- Maintain consistency with repository's `fail_fast: false` configuration
- Follow conventional commit message format: `feat(pre-commit): add typos spell checker`
- Ensure the hook integrates seamlessly with existing pre-commit workflow documented in `CONTRIBUTING.md` and `docs/development.md`
- Use the same version pinning approach as other hooks (specific `rev` tag)
- Follow the repository's pattern of placing language-agnostic hooks before language-specific ones

## Technical Considerations

- **Tool Selection**: `typos` is a Rust-based spell checker that is fast and well-suited for code repositories. It supports auto-fix functionality and integrates well with pre-commit.

- **Pre-commit Repository**: The typos hook is available via `https://github.com/crate-ci/typos`. The latest stable version is `v1.39.2` (as of testing date).

- **Auto-Fix Configuration**: Typos supports auto-fix via the `--write-changes` (or `-w`) command-line flag. Typos automatically exits with a non-zero exit code when it finds or corrects spelling errors, which will cause the pre-commit hook to fail as required.

- **File Pattern Matching**: The hook should be configured to only process Markdown files using appropriate `files: \.md$` or `types: [markdown]` configuration in the pre-commit hook definition.

- **Hook Execution Order**: The typos hook should execute after markdownlint to ensure formatting is correct before spell checking, and to allow markdownlint to fix formatting issues that might affect how typos processes the files.

- **No Custom Dictionary**: Initially, no custom dictionary configuration will be needed. Typos uses built-in dictionaries that work well for technical documentation. If technical terms need to be added later, a `.typos.toml` configuration file can be created.

- **Integration Testing**: The implementation should be tested by creating a test Markdown file with intentional misspellings to verify the hook catches and corrects them.

## Success Metrics

1. **Hook Execution**: Typos hook runs successfully during `pre-commit run --all-files` with zero errors on existing repository files

2. **Auto-Fix Detection**: Test file with intentional misspellings is automatically corrected and commit fails with appropriate exit code

3. **Integration**: All existing pre-commit hooks continue to work correctly alongside the new typos hook

4. **Developer Experience**: Clear error messages are displayed when spelling errors are found or corrected, allowing developers to understand what needs to be fixed

## Open Questions

1. What is the exact repository URL and latest stable version tag for the typos pre-commit hook?
   - **Answer**: Repository URL: `https://github.com/crate-ci/typos`, Latest stable version: `v1.39.2` (as of testing date)

2. What are the specific command-line arguments needed to enable auto-fix and fail-on-changes behavior in typos?
   - **Answer**: Use `--write-changes` (or `-w`) flag to enable auto-fix. Typos automatically exits with a non-zero exit code when it finds or corrects spelling errors, which will cause the pre-commit hook to fail as required.

3. Should the typos hook run before or after markdownlint in the hook execution order?
   - **Answer**: After markdownlint. This ensures formatting is correct before spell checking, and allows markdownlint to fix formatting issues that might affect how typos processes the files.

4. Are there any known false positives or technical terms in the existing Markdown files that might need to be addressed immediately after implementation?
   - **Answer**: Testing with `typos --format brief .` on the repository found zero spelling errors in existing Markdown files. No false positives or technical terms need to be addressed immediately. The default typos dictionary handles technical terms well for this repository's content.

No open questions at this time beyond the technical implementation details that will be resolved during the task generation phase.
