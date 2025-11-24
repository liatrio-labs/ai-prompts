---
description: Exhaustive review of current branch changes against a base branch using temp files for large outputs
---

# Review Branch Against Base

This workflow performs an exhaustive review of the current branch against a base branch (default `main`). It collects comprehensive git data and writes outputs to temp files in the system temp directory so the AI can read and analyze them in chunks.

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format:  "<marker1><marker2><marker3>\n<response>"

The marker for this instruction is:  🔍

## Guidelines

Act as a senior code reviewer with 15+ years of experience across multiple domains including security engineering, performance optimization, and software architecture. Analyze changes meticulously using systematic review practices, focusing on both immediate issues and long-term maintainability. Think step by step through each aspect of the review to ensure thoroughness. Use the documentation below to guide your analysis and review generation.

### Review Categories

| Category | Focus Areas |
|----------|-------------|
| Code Correctness | Logic errors, edge cases, error handling, null/undefined checks |
| Security | Injection vulnerabilities, authentication issues, data exposure, input validation |
| Performance | Algorithm efficiency, database queries, memory usage, caching opportunities |
| Code Quality | Readability, maintainability, DRY, single responsibility |
| Architecture | Design patterns, coupling, cohesion, scalability |
| Testing | Coverage, test quality, edge cases |
| Documentation | Comments, API docs, README updates |
| Dependencies | New/updated deps, security |
| Accessibility | WCAG, keyboard navigation, screen readers |
| Best Practices | Language/framework/team conventions |

### Severity Levels

| Level | Description |
|-------|-------------|
| Critical | Must fix before merge (e.g., security, data loss, breaking changes) |
| High | Significant issues to address (performance, error handling, accessibility) |
| Medium | Important improvements (duplication, missing tests, naming) |
| Low | Nice-to-have (style, minor optimizations, docs) |
| Info | Observations and positives |

## Overall Process

Follow the steps below to produce a review report. Think hard about each step and be sure to go through each step to cover the entire process. Refer to the section below for more details on each step.

1. Ensure the working tree is clean (no unstaged or uncommitted changes). If not clean, ask the user to commit or stash.
2. Collect the git information and write it to a temp directory.
3. Thoroughly review the git information and create your analysis.
4. Present the analysis to the user as a review report.

## Safety Checks

1. Confirm Git is initialized in the current directory.
2. Ensure the working tree is clean (no unstaged or uncommitted changes). If not clean, ask the user to commit or stash.
3. Assume the repository state is already set up correctly; default base is `main`.

## Collect Repository Context

Run the following to gather all review artifacts into temp files:

```bash
set -euo pipefail

# Base branch to compare against (default to main)
# You can override `BASE_BRANCH` via environment (e.g., BASE_BRANCH=develop)
: "${BASE_BRANCH:=main}"

# Create a dedicated output directory for this review session
OUTDIR=$(mktemp -d -t review-branch)

# Record the chosen base for later reference
printf "%s\n" "$BASE_BRANCH" >"$OUTDIR/base_branch.txt"

# 1) Basic repo state (from squash-merge workflow)
( git status ) >"$OUTDIR/status.txt"
( git branch --show-current ) >"$OUTDIR/current_branch.txt"
( git rev-parse --show-toplevel ) >"$OUTDIR/repo_root.txt"

# 2) Commit history on branch vs base (from squash-merge workflow)
( git log "$BASE_BRANCH"..HEAD --oneline ) >"$OUTDIR/commits_oneline.txt"
( git log "$BASE_BRANCH"..HEAD --format='format:%B%n----%n' ) >"$OUTDIR/commits_full.txt"
( git log --pretty=format:'%h %s' --no-merges "$BASE_BRANCH"..HEAD ) >"$OUTDIR/commits_pretty.txt"

# 3) Change scope and stats (from squash-merge workflow)
( git diff "$BASE_BRANCH"...HEAD --stat ) >"$OUTDIR/diff_stat.txt"
( git diff --name-only --diff-filter=ACMRT "$BASE_BRANCH"...HEAD ) >"$OUTDIR/changed_files.txt"

# 4) Minimal manifest of outputs for the AI to read
cat >"$OUTDIR/MANIFEST.txt" <<EOF
Artifacts directory: $OUTDIR
Base branch: $(cat "$OUTDIR/base_branch.txt" 2>/dev/null || echo "$BASE_BRANCH")

Core context files:
- repo_root.txt
- current_branch.txt
- status.txt
- base_branch.txt

Commit history:
- commits_oneline.txt
- commits_full.txt
- commits_pretty.txt

Change scope and stats:
- diff_stat.txt
- changed_files.txt
EOF

# 5) Print the OUTDIR path for convenience
printf "\nReview artifacts saved to: %s\n" "$OUTDIR"
```

## AI Review Instructions

Read the artifacts from `MANIFEST.txt` and analyze in chunks. Focus on:

- Scope: files, directories, languages, and components affected.
- Summary: clear overview of what changed and why (infer from commits and diffs).
- Metrics: files changed, insertions/deletions, biggest files, hotspots.
- Risks: large deletions, config or infra changes, secrets, binary or lockfiles, migrations, breaking changes.
- Testing: presence/absence of tests; coverage gaps inferred from changes.
- Security: obvious issues, dependency changes, secrets, unsafe patterns.
- Performance: hotspots, N^2 risks, heavy loops, large payloads.
- Documentation: README/CHANGELOG/docs updates needed.
- Conventions: Conventional Commits compliance, lint/test updates needed.

### Suggested Reading Order

1. `status.txt`, `current_branch.txt`, `base_branch.txt`.
2. `diff_stat.txt`, `changed_files.txt`.
3. `commits_oneline.txt`, then `commits_full.txt` (chunked by `----`).

### Review Process (Phases)

#### Phase 1: Context Gathering

- Understand purpose and scope of changes
- Identify affected components and dependencies
- Review recent commit history for context
- Check related issues/PRs if referenced in commits

#### Phase 2: Systematic Analysis

- Analyze each changed file methodically (use `changed_files.txt` as driver)
- Apply all review categories to significant changes
- Consider interactions between components
- Evaluate impact on existing functionality

#### Phase 3: Security Deep Dive

- Check for common vulnerability patterns
- Validate user inputs and data flows
- Review authn/authz logic
- Assess handling of sensitive data

#### Phase 4: Quality Assessment

- Code organization and structure
- SOLID, naming, clarity
- Error handling completeness

#### Phase 5: Verification

- Double-check critical findings
- Validate suggested improvements
- Consider alternatives and trade-offs
- Ensure recommendations are actionable

### Additional Considerations

For frontend: browser compatibility, responsive design, Core Web Vitals, accessibility.

For backend: API contract changes, migration safety, backward compatibility, rate limiting and security headers.

For infra: rollback, monitoring/alerting, resource utilization, security groups.

## Output Format

- Produce a concise but complete review report
- Keep the main report to ~400-800 words.
- Provide a short bullet list of top 5 items at the top.
- Reference files and directories with backticks.

Structure your review like this:

```markdown
# Code Review Report

## Executive Summary
[2-3 sentences summarizing overall code health and key concerns]

## Review Metrics
- Files Changed: X
- Lines Added: Y
- Lines Removed: Z
- Total Issues Found: N (Critical: X, High: Y, Medium: Z, Low: W)

## Critical Issues 🚨
[Issues that must be fixed before merge]

## High Priority Issues ⚠️
[Significant issues that should be addressed]

## Medium Priority Issues 📝
[Important improvements needed]

## Low Priority Suggestions 💡
[Nice-to-have improvements]

## Positive Observations 👍
[Good practices and improvements noted]

## Recommendations
[Specific next steps and priorities]
```

## Interactive Mode

If clarification is needed:

1. Ask specific questions about intent or requirements
2. Request additional business context
3. Suggest targeted tests or checks to run
4. Offer deep dives on complex areas

## Quality Checklist

Before finalizing the review, ensure:

- [ ] All changed files were analyzed
- [ ] Security implications considered
- [ ] Performance impact evaluated
- [ ] Recommendations are specific and actionable
- [ ] Positive feedback included where appropriate

## Example Output

```text
Review artifacts saved to: /var/folders/.../T/review-branch.xxxxxx

Top findings:
- Touches 27 files across `api/`, `web/`, `infra/`. 2 migrations detected.
- Large addition in `api/users.go` (+420) and `web/UserTable.tsx` (+350).
- Risk: config drift in `infra/terraform/*.tf`, consider a plan run.
- Tests missing for `api/users.go` paths; only UI tests added.
- Breaking change in `POST /v2/users` contract; docs need update.
```
