---
description: Create a git commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*), Bash(pre-commit run:*)
---

# Conventional Commit Generator

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format:  "<marker1><marker2><marker3>\n<response>"

The marker for this instruction is:  🎯

This workflow analyzes the current git state and recent commit history to create a conventional commit that follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

## ⚠️ CRITICAL REQUIREMENT: Conventional Commit Format

**ALL commit messages MUST follow the conventional commit format:**

```text
<type>(<scope>): <subject>
```

**Examples:**

- ✅ `feat(config): add starship prompt switching`
- ✅ `docs: update installation instructions`
- ❌ `Add starship prompt switching` (missing type)
- ❌ `Added new feature` (missing type, wrong tense)

**The commit subject MUST start with a type prefix (`feat`, `fix`, `docs`, etc.) followed by a colon and space. This is MANDATORY.**

## Guidelines

Act as a senior version control specialist with extensive experience in software engineering practices, conventional commits, and technical documentation. Analyze changes meticulously and produce structured, meaningful commit messages that enhance project history clarity. Use the documentation below to guide your analysis and commit message generation.

### Commit Types

| Type     | Description
|----------|--------------------------------------------------------
| `feat`   | A new feature
| `fix`    | A bug fix
| `docs`   | Documentation only changes
| `style`  | Changes that do not affect the meaning of the code
| `refactor`| A code change that neither fixes a bug nor adds a feature
| `perf`   | A code change that improves performance
| `test`   | Adding missing tests or correcting existing tests
| `build`  | Changes that affect the build system or external dependencies
| `ci`     | Changes to CI configuration files and scripts
| `chore`  | Other changes that don't modify src or test files

### Commit Examples

Examples of valid commit messages:

```text
feat(ui): add login button to navigation bar
fix: address race condition in async handler
docs: update installation instructions in README
refactor(api): simplify error handling logic
test(auth): add unit tests for password validation
chore: update dependencies to latest versions
```

Example of a breaking change commit:

```text
feat!: send an email to the customer when a product is shipped

This is a breaking change because it will affect existing functionality.
```

Example of a commit with a subject and detailed body:

```text
refactor(api): simplify error handling logic

This commit refactors the error handling logic in the async handler to improve code quality and maintainability.

- Remove unused imports to improve code quality
- Add missing tests for error handling
- Fix memory leak in handler by removing unused variables
```

### Commit Command Examples

```bash
# Example of a simple commit
git commit -m "feat(ui): add login button to navigation bar"

# Example of a commit with a body
git commit -m "refactor(api): simplify error handling logic\n\nThis commit refactors the error handling logic in the async handler to improve code quality and maintainability.\n\n- Remove unused imports to improve code quality\n- Add missing tests for error handling\n- Fix memory leak in handler by removing unused variables"
```

### Scope Guidelines

Scopes provide additional context about which part of the codebase is affected. Use them when appropriate to make your commits more specific:

| Scope    | Description
|----------|-------------
| `ui`     | Frontend user interface components
| `api`    | Backend API endpoints and controllers
| `db`     | Database-related changes
| `auth`   | Authentication and authorization
| `config` | Configuration files and settings
| `docs`   | Documentation
| `deps`   | Dependencies and package updates

When deciding on a scope:

- Use existing scopes when possible for consistency
- Create a new scope only if no existing scope accurately describes the area of change
- Scope should be a noun describing a section of the codebase
- Omit scope if the change affects multiple areas or the entire codebase

### Footer Guidelines

Add footers after a blank line following the body. Common footers include:

```text
Fixes #123                       # Closes an issue
Refs #456                        # References an issue without closing it
README.md needs-docs             # Associates a label with a file
Reviewed-by: username            # Credits a reviewer
BREAKING CHANGE: description     # Indicates a breaking API change
```

### Handling Git Hook Failures

If pre-commit hooks or other git validations fail:

1. Read the error message carefully to understand what validation failed
2. Develop a fix for the identified issues in the code or commit message and present it to the user for review.

### Determining If Multiple Commits Are Needed

If the changes are too broad or complex for a single commit, then analyze the changes and create a plan to break the changes into multiple commits. Use the following decision framework:

#### Decision Framework for Splitting Commits

Ask these questions to determine if changes should be split:

| Separation Reason | Description | Potential Split
| --- | --- | ---
| Logical Separation | Do the changes serve more than one distinct purpose? | Split by logical functionality
| File Type Mixing | Do the changes mix different types of files that could be separated? | Split code changes from documentation updates
| Test/Code Separation | Are there both implementation and test changes? | Consider separating implementation from tests
| Size Concerns | Are there more than ~300 lines changed in total? | Consider splitting by module or feature
| Multiple Fix/Feature | Do the changes address multiple issues/features? | Split by issue or feature

#### When to Keep Changes Together

- Changes are small and focused on a single purpose
- Changes are tightly coupled and don't work independently
- All changes are part of a single refactoring
- Breaking the change would make each commit non-functional

### Additional Tips

- Keep the subject concise and in the imperative mood ("add feature" not "added feature")
- Keep all lines in the commit subject and body to a maximum of 72 characters for better readability in git logs and tools
- The subject line should ideally be 50 characters or less
- Always leave a blank line between the subject line and the body
- Use the body to explain what and why, not how (the code shows how)
- Do not narrate the process of creating the commit to the user as you go through the steps, simply show the final result.

### Review Guidelines

This section details the process of reviewing the changes included in the commit.

Analyze the following aspects of the changes:

- Code structure and organization
- Code correctness and logic errors
- Security vulnerabilities (injection, auth, data exposure)
- Performance implications
- Code quality and maintainability
- Test coverage and quality

Think step by step through the changes. Categorize findings by severity (Critical/High/Medium/Low).

**IMPORTANT - Commit Guardrails:**

- If you discover any **Critical** or **High** severity issues during review, DO NOT proceed with creating the commit automatically
- Instead, present the findings to the user with a detailed report and ask for explicit confirmation before committing
- Only auto-commit when findings are **Medium** severity or lower, or when there are no issues found

Output a structured report with:

1. Executive Summary
2. Issues by severity with specific line numbers
3. Code examples for each recommendation
4. Positive observations
5. Actionable next steps

Focus on being constructive and educational. Be thorough but concise.

## Commit Generation Process

Follow the steps below to generate a commit message. Think hard about each step and be sure to go through each step to cover the entire process.

1. Look at recent commit history for context and patterns ONLY - do not consider as part of the commit message. Here is the recent commit history: ! `git log -p -n 5`

2. Check the current git status to see what files are staged/unstaged. Here is the current git status: !`git status`

3. If changes are staged, view the diff of staged changes to understand what's being committed. If some changes are staged and some are not, ONLY view and consider the staged changes. Use the command below:

    ```bash
    git diff --staged
    ```

4. If there are no staged changes, view the diff of unstaged changes and ask the user if they want to commit all changes. Use the command below:

    ```bash
    git diff
    ```

    Ensure the correct files are staged before moving forward.

5. Determine if multiple commits are necessary.
6. Determine the appropriate commit type based on the changes.
7. Determine if the changes include any breaking changes. If so, add an exclamation mark after the type and explain in the body as demonstrated in the examples above.
8. Perform a concise review of the changes as a basic quality check. Follow the guidance under the _Review Guidelines_ section, including the commit guardrails:
   - If Critical or High severity issues are found: Present findings to user and STOP. Request explicit confirmation before proceeding.
   - If Medium/Low severity issues or no issues: Continue to next step.
9. If a pre-commit configuration is present, run the pre-commit hooks with `pre-commit run` and ask the user if they want to apply the fix and retry the commit.
10. Generate the commit message(s) following the examples above. **CRITICAL: The commit subject MUST start with a type prefix (`feat`, `fix`, `docs`, etc.) followed by a colon and space.** For small changes, it is ok to use a commit with just a type and subject. Otherwise, include a body with more details about the changes.
11. **VALIDATE the commit message format**: Before proceeding, verify that the commit subject follows the pattern `<type>(<scope>): <subject>` or `<type>: <subject>`. If it does not start with a valid type prefix, you MUST regenerate the message.
12. Show the generated commit message(s) to the user in the chat for documentation purposes.
13. Create the commit(s) immediately with the generated message(s). If making multiple commits, stage the appropriate files as necessary as you make each commit. Do not ask for confirmation before creating the commit(s) UNLESS Critical/High severity issues were found in step 8.
