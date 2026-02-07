---
name: git-commit-conventional
description: Create Conventional Commit messages and execute safe git commits from working tree changes. Use when users ask to create a commit, write a conventional commit message, split broad changes into multiple commits, stage only parts of files, run pre-commit before committing, or perform a quick commit-time quality review with severity guardrails.
---

# Git Commit Conventional

## Overview

Generate clear Conventional Commit messages, decide commit grouping, run commit-time checks, and create commit(s) safely.

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format: `"<marker1><marker2><marker3>\n<response>"`

The marker for this skill is: `🎯`

## Workflow

1. Inspect repository context:
   - Run `git log -p -n 5` for style context only.
   - Run `git status`.
2. Select the diff to analyze:
   - If staged changes exist, use `git diff --staged` and ignore unstaged changes.
   - If nothing is staged, run `git diff` and ask whether to stage all or specific files before committing.
3. Decide single versus multiple commits with an explicit framework:
   - Check logical separation: split when changes serve multiple distinct goals.
   - Check file-type mixing: split documentation changes from code changes when they can stand alone.
   - Check implementation versus tests: split when test updates are independent from implementation updates.
   - Check mixed-purpose hunks in the same file: split by hunk when one file contains unrelated intents (for example, rename plus refactor).
   - Check size and reviewability: consider splitting broad changes (for example, over roughly 150 changed lines) by module or feature.
   - Check issue/feature boundaries: split when multiple bugs or features are addressed in one diff.
   - Keep together when changes are small and focused on one purpose.
   - Keep together when changes are tightly coupled and splitting would create non-functional or misleading history.
   - Keep together when all changes are part of one coherent refactor.
4. Stage changes intentionally for the selected commit boundary:
   - Use `git add -p` to stage only relevant hunks when a file mixes logical changes.
   - Use `git add -e` only when hunk editing is required and apply minimal edits.
   - After staging, verify scope with `git diff --staged` and `git diff` before proceeding.
   - If partial staging would create a broken intermediate commit, keep dependent hunks together.
5. Run a concise quality review before committing:
   - Check correctness, maintainability, security, performance, and tests.
   - Classify findings by severity: Critical, High, Medium, Low.
   - Present findings using this structure: Executive Summary; Issues by severity with file/line references; Suggested fixes with brief examples; Positive observations; Actionable next steps.
   - If any Critical or High issue is found, stop and request explicit user confirmation before committing.
6. If `.pre-commit-config.yaml` exists, run `pre-commit run`:
   - Never bypass hooks.
   - For trivial fixes, apply changes, restage files, and rerun hooks until they pass.
   - For non-trivial fixes, present the proposed fix to the user and get approval before applying and proceeding.
   - Treat formatting-only or whitespace-only hook edits as trivial auto-fixes.
   - Track every auto-fixed file and the hook that changed it.
7. Generate commit message(s) in strict Conventional Commit format:
   - Subject must match `<type>(<scope>): <subject>` or `<type>: <subject>`.
   - If subject format is invalid, regenerate until format is valid.
   - Keep subject imperative and concise.
   - If the change is breaking, use `!` and add explicit breaking-change explanation in the body and/or footer (`BREAKING CHANGE: ...`).
   - Include body to document context and rationale.
   - Only exclude a body when the changes are very, very small
8. Validate message format and create commit(s):
   - Show generated message(s) in chat.
   - Run `git commit` with the generated message(s).
   - For multiple commits, stage the right files before each commit.
   - In the final commit summary to the user, include a `Pre-commit changes` note:
     - If auto-fixes were applied, list hook id(s) and file path(s).
     - If none were applied, explicitly say `Pre-commit changes: none`.

## Mandatory Rules

- Never use hook bypass flags such as `--no-verify` or `-n`.
- Never commit when Critical or High review issues are present unless the user explicitly confirms.
- Never include unrelated files in a commit.
- Never stage an entire file when only some hunks belong to the current commit boundary.
- Always report whether pre-commit auto-fixed files before finalizing the commit result message.

## References

- Conventional commit types, scopes, and templates: `references/conventional-commits.md`
- Review severity rubric and reporting format: `references/review-guardrails.md`
