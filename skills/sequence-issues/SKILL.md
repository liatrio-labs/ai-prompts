---
name: sequence-issues
description: "Analyzes a set of GitHub Issues for hard dependencies and shared-file conflicts, batches them into sequential waves, updates blocking issues with \"Blocked by\" notes, and (on confirmation) creates git worktrees for the current ready wave. Re-runnable after any wave completes to pick up the next."
---

# sequence-issues

You are analyzing a set of GitHub Issues to determine which can be worked in parallel and which must be sequenced. You update issues with blocking relationships, produce a wave plan, and offer to set up git worktrees for the first ready wave.

---

## Step 1 — Determine Scope

**If the operator provided a milestone URL or name:** fetch all open issues in that milestone.

```bash
gh issue list --milestone "<name>" --state open --repo <owner>/<repo> --json number,title,body
```

**If the operator provided a list of issue numbers:** fetch those issues individually.

**If neither was provided:** ask:

> "Which issues should I sequence? Provide a milestone URL/name, a list of issue numbers, or both."

Once scope is established, confirm with the operator:

> "I'll analyze issues: #N, #N, #N (Milestone: X). Is that the right set?"

Do not proceed until scope is confirmed.

---

## Step 2 — Analyze Each Issue

For each issue in scope, extract the files it will touch. Parse the issue body:

**Shell story format** (Goal / Tasks / Validation): scan the Tasks checklist for file names, commands, and config references. Infer files from patterns like:

- "Add `Dockerfile`" → `Dockerfile`
- "Add `eslint.config.mjs`" → `eslint.config.mjs`
- "Add a `test` job to `.github/workflows/ci.yml`" → `.github/workflows/ci.yml`
- "Add `vitest.config.ts`" → `vitest.config.ts`, `package.json`
- "Install [package]" or "Add [script] to `package.json`" → `package.json`
- "Add `.github/workflows/codeql.yml`" → `.github/workflows/codeql.yml`
- "Add `.github/dependabot.yml`" → `.github/dependabot.yml`

**Post-Shell story format** (Interaction / Layers / Already in Place): scan the Layers sections:

- Data layer → migration files, schema files
- API layer → route files at the stated path
- UI layer → component/page files at the stated path

Also scan the issue body for any explicit "Depends on #N", "Blocked by #N", or "Prerequisite" notes already present — treat these as confirmed hard blockers regardless of file analysis.

Build a table:

| Issue | Title | Files Touched |
|-------|-------|---------------|
| #N | ... | file1, file2 |

---

## Step 3 — Classify Dependencies

For each pair of issues (A, B) where B touches a file that A *creates* (not just modifies), check whether B's task requires A's output to be present before B can be validated.

**True hard blocker** — B cannot be validated without an artifact A creates:

- B's validation step runs a command (e.g., `docker build .`) that requires a file A is responsible for creating (e.g., `Dockerfile`)
- B's tasks explicitly reference an artifact from A (e.g., "uses the Dockerfile from #N")
- The dependency is already stated in the issue body

Mark as: **A must merge before B can be validated.**

**Shared-file conflict** — A and B both modify the same existing file, but neither requires the other's output to function:

- Both add jobs to `.github/workflows/ci.yml`
- Both add scripts or dependencies to `package.json`

Mark as: **Parallel-safe; requires merge coordination.** Do NOT treat as a blocking relationship.

**Independent** — no shared files, no artifact dependency. Mark as: **Fully parallel.**

---

## Step 4 — Build Waves

A **wave** is a set of issues that can all be worked simultaneously (no hard blockers between them). Issues in Wave N+1 are blocked by at least one issue in Wave N.

Construct waves using topological sort on the hard-blocker graph:

- **Wave 1**: issues with no hard blockers (can start immediately)
- **Wave 2**: issues whose only blockers are in Wave 1
- **Wave N**: issues whose blockers are all in earlier waves

If a cycle is detected (A blocks B, B blocks A), flag it to the operator as a planning error — do not assign waves until resolved.

---

## Step 5 — Update Issues (Hard Blockers Only)

For each confirmed hard blocker relationship (A blocks B):

1. Fetch the current body of issue B.
2. Check whether a `## Blocked by` section already exists and already references A. If yes, skip (idempotent).
3. If not present, append to the issue body:

```markdown

---

## Blocked by

- #N (Title of A) — [one-line reason: what artifact from A is required]
```

1. Update the issue:

```bash
gh issue edit <B-number> --body "<updated body>" --repo <owner>/<repo>
```

Do not add or update this section for shared-file conflicts. Only hard blockers.

---

## Step 6 — Output Summary

Present the full analysis to the operator:

```text
## Wave Plan — <Milestone or Issue Set>

### Wave 1 — Start immediately (N issues)
  #3  Health Endpoint and Containerization
  #4  Unit Test Capability
  #6  Security and Dependency Scan
  #7  Lint and Format Enforcement

### Wave 2 — After Wave 1 merges (N issues)
  #5  Build and Publish Artifact
      └─ Blocked by #3 (needs Dockerfile)

### Merge Coordination Notes (not blockers)
  ci.yml is touched by #4, #5, #6, #7 — merge sequentially to avoid conflicts
  package.json is touched by #4, #7 — additive changes; easy to resolve

### Blocking relationships written to issues
  #5 — "Blocked by" section added (or already present)
```

---

## Step 7 — Worktree Prompt

After presenting the summary, ask:

> "Should I proceed with creating git worktrees for Wave 1?"

**If the operator says no:** close with the wave plan. No further action.

**If the operator says yes:** proceed to [Worktree Creation](#worktree-creation).

---

## Worktree Creation

For each issue in the current ready wave:

1. Derive a branch name from the issue title following the repo's branch convention (`feat/`, `fix/`, `chore/` prefix + kebab-case short description + issue number suffix):
   - "Health Endpoint and Containerization" (#3) → `feat/health-endpoint-3`
   - "Unit Test Capability" (#4) → `feat/unit-test-4`
   - Use `chore/` for infrastructure stories, `feat/` for feature stories, `fix/` for bug fixes

2. Derive the worktree path as a sibling directory to the current repo root, suffixed with the branch name:
   - If repo is at `/path/to/my-repo`, worktree goes at `/path/to/my-repo--feat/health-endpoint-3`
   - Simplify: use the short branch suffix only — `/path/to/my-repo--health-endpoint-3`

3. Create each worktree:

```bash
git worktree add "../<repo-name>--<short-branch>" -b "<branch-name>"
```

1. After all worktrees are created, output the `cd` commands so the operator can navigate to each one:

```text
## Worktrees created — Wave 1

  #3  feat/health-endpoint-3
      cd ../where-in-the-world--health-endpoint-3

  #4  feat/unit-test-4
      cd ../where-in-the-world--unit-test-4

  #6  chore/security-scan-6
      cd ../where-in-the-world--security-scan-6

  #7  chore/lint-format-7
      cd ../where-in-the-world--lint-format-7

When this wave is complete, run /sequence-issues again to advance to the next wave.
```

---

## Re-run Behavior

When invoked again on the same scope:

1. Fetch all issues in scope (open and closed).
2. Check which issues from prior waves are now closed (merged).
3. Determine the **current ready wave** — issues whose blockers are all closed.
4. Check for existing worktrees via `git worktree list`; skip creation for branches that already exist.
5. Report status:

```text
## Re-run — <Milestone>

### Completed
  ✓ #1  Repo Scaffold
  ✓ #3  Health Endpoint and Containerization

### In Progress — Wave N remaining
  ○ #4  Unit Test Capability
  ○ #6  Security and Dependency Scan
  ○ #7  Lint and Format Enforcement

### Now unblocked — next wave
  #5  Build and Publish Artifact  ← #3 is closed; this is now ready

Should I proceed with creating a git worktree for the next wave (#5)?
```

---

## Edge Cases

**All issues are independent (no hard blockers):** all issues are Wave 1. State this clearly — "all issues can be worked in parallel."

**Operator provides issues from different milestones:** proceed with the provided set; note in the summary that the issues span multiple milestones.

**Issue body does not have enough detail to infer files:** flag the issue as "unable to analyze — insufficient task detail" and exclude it from the wave plan. List it separately and ask the operator how to classify it.

**Branch already exists** (re-run): skip `git worktree add` for that branch and note it in output.

**Worktree path already exists** (re-run): skip and note. Do not overwrite.
