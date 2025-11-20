---
description: Squash merge current branch into main with comprehensive commit message
---

# Squash Merge to Main

This workflow performs a squash merge of the current branch into main, creating a single commit with a comprehensive message that includes all individual commit messages from the branch.

## Guidelines

Act as a version control specialist focusing on creating clear, informative merge commits that preserve the full history and context of the work being merged. The goal is to create a single, well-documented commit that captures all the changes and their rationale.

## Merge Process

1. **Check current status and branch**:

   ```bash
   git status
   git branch --show-current
   ```

1. **Ensure working directory is clean**:
   - Verify no uncommitted changes exist
   - If changes exist, ask user to commit or stash them first

1. **Get all commits that will be merged**:

   ```bash
   git log main..HEAD --oneline
   ```

1. **Get detailed commit messages from the branch**:

   ```bash
   git log main..HEAD --format="format:%B%n----%n"
   ```

1. **Analyze the changes to create a summary**:

   ```bash
   git diff main...HEAD --stat
   ```

1. **AI pre-commit review (assistant-generated)**:

   Briefly review the pending changes and present a short summary to the user, then ask whether to proceed.

   Data to collect:
   - Files changed and diff stats
   - List of commit subjects on the branch (no merges)
   - Suspicious/risky signals (large deletions, config changes, lockfiles, secrets, migrations)
   - Conventional Commit compliance of branch commits

   Helpful commands:

   ```bash
   git diff --stat main...HEAD
   git diff --name-only --diff-filter=ACMRT main...HEAD
   git log --pretty=format:"%h %s" --no-merges main..HEAD
   ```

   Assistant output (keep under 200 words):
   - Summary of scope and key areas touched
   - Potential risks or follow-ups
   - Note on commit message consistency
   - Explicit prompt: "Proceed with squash merge? (y/n)"

   Only continue if the user answers yes.

1. **Switch to main branch**:

   ```bash
   git checkout main
   ```

1. **Perform the squash merge**:

   ```bash
   git merge --squash <branch-name>
   ```

1. **Create comprehensive commit message** with this format:

   ```markdown
   <High-level summary of all changes>

   This squash merge combines <N> commits from <branch-name>:

   Changes included:
   - <Key change 1>
   - <Key change 2>
   - <Key change 3>
   [etc.]

   Original commits:
   ========================================

   <Full text of all original commit messages>
   ```

1. **Commit with the comprehensive message**:

   ```bash
   git commit -m "<comprehensive-message>"
   ```

1. **Show the result**:

    ```bash
    git log -1 --stat
    ```

## Commit Message Template

The merge commit message should follow this structure:

```markdown
feat: <Overall feature/change description>

This squash merge combines <N> commits from <branch-name> that <high-level purpose>.

Key changes:
- <Most important change>
- <Second important change>
- <Other significant changes>

Files affected: <X> files changed, <Y> insertions(+), <Z> deletions(-)

Original commit history:
========================

<Commit 1 hash> <Commit 1 subject>
<Commit 1 body if exists>

----

<Commit 2 hash> <Commit 2 subject>
<Commit 2 body if exists>

----

[Continue for all commits...]
```

## Safety Checks

Before proceeding with the merge:

- ✓ Confirm the current branch is not main
- ✓ Verify there are no uncommitted changes
- ✓ Ensure main is up to date (offer to pull latest)
- ✓ Show summary of changes to be merged
- ✓ Ask for confirmation before proceeding
- ✓ AI review approved by user

## Post-Merge Options

After successful merge, offer to:

1. Delete the source branch locally
1. Push the changes to remote main (with warning)
1. Delete the remote branch if it exists

## Example Output

```markdown
Squash merging feature/user-auth into main...

Found 5 commits to merge:
- Add user authentication service
- Implement JWT token generation
- Add password hashing utilities
- Create auth middleware
- Add auth tests

Creating squash merge commit...

Successfully merged with commit: 3a4b5c6
"feat: Add complete user authentication system

This squash merge combines 5 commits from feature/user-auth that implement
a complete JWT-based authentication system.

Key changes:
- User authentication service with login/logout
- JWT token generation and validation
- Bcrypt password hashing
- Express middleware for protected routes
- Comprehensive test suite

Files affected: 12 files changed, 847 insertions(+), 23 deletions(-)

[Full commit history included in commit message]"

Would you like to:
1. Delete local branch 'feature/user-auth'? (y/n)
2. Push to remote main? (y/n)
```
