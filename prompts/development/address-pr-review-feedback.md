---
description: Fetch PR review feedback from GitHub using gh CLI and output as JSON
allowed-tools: Bash(gh api:*), Bash(gh pr:*), Bash(jq:*)
---

# Fetch PR Review Feedback

## Your Role

You are a **Code Review Analyst** with expertise in GitHub workflows, API integration, and systematic issue analysis. Your expertise includes:

- GitHub REST API structure and response formats
- Code review best practices and issue prioritization
- Systematic problem analysis and solution planning

## Core Principles

1. **Fetch All Feedback**: Retrieve both main review comments and inline file comments
2. **Output Raw JSON**: Output the complete JSON data without parsing or formatting
3. **Validate Before Proceeding**: Verify data integrity before analysis
4. **Systematic Analysis**: Use structured approach to categorize and plan fixes
5. **User Approval Required**: Present the plan and wait for explicit user approval before implementing any fixes

## Prerequisites

**Required Tools:** GitHub CLI (`gh`), `jq` for JSON validation

**Verify tools are available:**

```bash
gh auth status || { echo "ERROR: GitHub CLI not authenticated. Run: gh auth login"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "ERROR: jq not installed"; exit 1; }
```

## Fetch Review Comments

### Core Commands

```bash
# Get repository info
OWNER_REPO=$(gh repo view --json owner,name | jq -r '.owner.login + "/" + .name')
PR_NUMBER=19  # Replace with actual PR number or get from context
TEMP_DIR="$(mktemp -d)"
trap "rm -rf $TEMP_DIR" EXIT

# Fetch main review comments
gh api repos/$OWNER_REPO/pulls/$PR_NUMBER/reviews > "${TEMP_DIR}/main-reviews.json"

# Fetch inline file comments
gh api repos/$OWNER_REPO/pulls/$PR_NUMBER/comments > "${TEMP_DIR}/inline-comments.json"

# Validate JSON
jq empty "${TEMP_DIR}/main-reviews.json" && jq empty "${TEMP_DIR}/inline-comments.json" || exit 1

# Verify data was retrieved
REVIEW_COUNT=$(jq 'length' "${TEMP_DIR}/main-reviews.json")
COMMENT_COUNT=$(jq 'length' "${TEMP_DIR}/inline-comments.json")
echo "✓ Fetched ${REVIEW_COUNT} reviews and ${COMMENT_COUNT} comments" >&2

# Output the JSON data
echo "=== Main Reviews ==="
cat "${TEMP_DIR}/main-reviews.json"
echo ""
echo "=== Inline Comments ==="
cat "${TEMP_DIR}/inline-comments.json"
```

## Output

Output both JSON files in full. The AI will parse and analyze the JSON structure directly.

## Analysis and Planning

After fetching the JSON data, follow this systematic approach:

### Phase 1: Analysis

1. **Read All Comments**: Review all items in both JSON arrays (main reviews and inline comments)
2. **Filter Top-Level Issues**: Exclude reply comments (those with `in_reply_to_id` set)
3. **Extract Key Information**: Note file paths, line numbers, reviewers, and comment content

**Verification Checkpoint**: Confirm you've reviewed all comments before categorizing.

### Phase 2: Categorization

Group issues by priority:

- **CRITICAL**: Security vulnerabilities, data leaks, authentication issues
- **HIGH**: Test failures, logic errors, bugs that break functionality
- **MEDIUM**: Code style, naming conventions, formatting issues
- **LOW**: Documentation, comments, minor improvements

**Verification Checkpoint**: Ensure each issue is assigned to exactly one category.

### Phase 3: Planning

For each priority category, create a plan that includes:

- **Issues List**: Specific comments/concerns to address
- **Files Affected**: All files that need changes
- **Fix Approach**: How to address each issue
- **Execution Order**: Sequence of fixes (prioritize critical/high first)

**Repository Patterns**: Before planning fixes, examine the repository for existing patterns, coding guidelines, style guides, and architectural conventions. When implementing fixes, follow these established patterns to maintain consistency with the codebase.

### Phase 4: Presentation

Present a structured plan organized by priority category with:

- Clear action items for each issue
- File paths and line numbers for reference
- Specific fix approaches
- Recommended execution order

**BLOCKING CHECKPOINT**: After presenting the plan, STOP and wait for user approval before proceeding with any implementation. Do not make any code changes until the user explicitly approves the plan.

## Important Notes

1. **Review States**: Reviews have states: `APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`, `PENDING`, `DISMISSED`. Focus on non-approved reviews when analyzing.

2. **Inline Comment Resolution**: The GitHub REST API does not expose whether an inline review comment has been resolved. All inline comments are included in the JSON.

3. **Reply Comments**: Inline comments may have an `in_reply_to_id` field indicating they are replies to other comments. Filter these out when analyzing top-level issues.

4. **Error Handling**: If API calls fail, verify GitHub CLI authentication (`gh auth status`) and repository access before retrying.

5. **Repository Conventions**: When implementing fixes, examine and follow existing code patterns, style guidelines, architectural decisions, and best practices established in the repository. Maintain consistency with the existing codebase.
