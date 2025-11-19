#!/usr/bin/env bash
#
# Apply recommended repository settings via GitHub CLI (gh)
#
# This script uses GitHub Rulesets API for branch protection (modern approach)
# rather than Classic Branch Protection API.
#
# Usage:
#   ./scripts/apply-repo-settings.sh [owner/repo] [--dry-run]
#
# Options:
#   --dry-run    Preview changes without applying them
#
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated
#   - Repository admin access
#   - jq installed (for JSON parsing in verification)
#
# Example:
#   ./scripts/apply-repo-settings.sh liatrio/my-new-project
#   ./scripts/apply-repo-settings.sh liatrio/my-new-project --dry-run
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Dry-run flag
DRY_RUN=false

# Function to print colored output
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Function to handle API errors
handle_api_error() {
    local operation=$1
    error "Failed to $operation"
    echo ""
    echo "Please verify:"
    echo "  1. You have admin access to the repository"
    echo "  2. The repository name is correct (format: owner/repo)"
    echo "  3. GitHub API is accessible and rate limits are not exceeded"
    echo "  4. Run 'gh auth status' to verify authentication"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    local missing_tools=()

    if ! command -v gh &> /dev/null; then
        missing_tools+=("GitHub CLI (gh)")
    fi

    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi

    if [ ${#missing_tools[@]} -ne 0 ]; then
        error "Missing required tools: ${missing_tools[*]}"
        echo ""
        if [[ " ${missing_tools[@]} " =~ " GitHub CLI (gh) " ]]; then
            echo "  Install GitHub CLI: https://cli.github.com/"
        fi
        if [[ " ${missing_tools[@]} " =~ " jq " ]]; then
            echo "  Install jq:"
            echo "    - macOS: brew install jq"
            echo "    - Ubuntu/Debian: sudo apt-get install jq"
            echo "    - Fedora: sudo dnf install jq"
            echo "    - Visit https://stedolan.github.io/jq/download/ for other platforms"
        fi
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        error "GitHub CLI is not authenticated. Run 'gh auth login' to authenticate."
        exit 1
    fi

    info "Prerequisites check passed"
}

# Parse repository from arguments or detect from git remote
get_repository() {
    if [ $# -eq 1 ]; then
        echo "$1"
    else
        # Try to detect from git remote
        if git remote get-url origin &> /dev/null; then
            local remote_url
            remote_url=$(git remote get-url origin)
            # Extract owner/repo from various URL formats
            if [[ $remote_url =~ github\.com[:/](.+/[^/]+)(\.git)?$ ]]; then
                echo "${BASH_REMATCH[1]}" | sed 's/\.git$//'
            else
                error "Could not parse repository from git remote"
                exit 1
            fi
        else
            error "No git remote found. Please specify repository as: owner/repo"
            exit 1
        fi
    fi
}

# Validate repository exists and user has access
validate_repository() {
    local repo=$1
    info "Validating repository access: $repo..."

    if ! gh api "repos/$repo" &> /dev/null; then
        handle_api_error "validate repository access"
        return 1
    fi

    # Check if user has admin access
    local user_permission
    user_permission=$(gh api "repos/$repo" --jq '.permissions.admin // false' 2>/dev/null || echo "false")

    if [ "$user_permission" != "true" ]; then
        warn "You may not have admin access to $repo"
        warn "Some operations may fail without admin permissions"
    else
        info "✓ Repository access validated (admin permissions confirmed)"
    fi
}

# Apply general repository settings
apply_general_settings() {
    local repo=$1
    info "Applying general repository settings to $repo..."

    if [ "$DRY_RUN" = true ]; then
        warn "[DRY RUN] Would apply the following settings:"
        echo "  - has_issues: true"
        echo "  - has_wiki: true"
        echo "  - has_discussions: false"
        echo "  - allow_squash_merge: true"
        echo "  - allow_merge_commit: false"
        echo "  - allow_rebase_merge: false"
        echo "  - delete_branch_on_merge: true"
        return 0
    fi

    if ! gh api -X PATCH "repos/$repo" \
        -F has_issues=true \
        -F has_wiki=true \
        -F has_discussions=false \
        -F allow_squash_merge=true \
        -F allow_merge_commit=false \
        -F allow_rebase_merge=false \
        -F delete_branch_on_merge=true \
        > /dev/null 2>&1; then
        handle_api_error "apply general repository settings"
    fi

    info "✓ General settings applied successfully"
}

# Apply branch protection rules using Rulesets API
apply_branch_protection() {
    local repo=$1
    info "Applying branch protection ruleset to $repo (main branch)..."

    # Check if ruleset already exists
    local ruleset_exists=false
    local existing_ruleset_id=""
    existing_ruleset_id=$(gh api "repos/$repo/rulesets" --jq '.[] | select(.target == "branch" and .enforcement == "active") | .id' 2>/dev/null | head -1 || echo "")

    if [ -n "$existing_ruleset_id" ]; then
        ruleset_exists=true
        warn "Branch protection ruleset already exists (ID: $existing_ruleset_id). Updating..."
    fi

    if [ "$DRY_RUN" = true ]; then
        warn "[DRY RUN] Would apply the following branch protection ruleset:"
        echo "  - Required status checks: Run Tests, Run Linting"
        echo "  - Require branches to be up to date: true (strict policy)"
        echo "  - Required approving review count: 1"
        echo "  - Dismiss stale reviews on push: false (recommended approach)"
        echo "  - Require last push approval: true"
        echo "  - Required review thread resolution: true"
        echo "  - Allowed merge methods: squash only"
        echo "  - Required linear history: true"
        echo "  - Prevent force pushes: true"
        echo "  - Prevent deletions: true"
        echo "  - Bypass actors: Admins, Maintainers"
        echo "  - Note: Chainguard Octo STS integration bypass must be added manually via GitHub UI"
        if [ "$ruleset_exists" = true ]; then
            warn "[DRY RUN] Existing ruleset would be updated"
        else
            warn "[DRY RUN] New ruleset would be created"
        fi
        return 0
    fi

    # Get script directory to locate ruleset config file
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local ruleset_config_file="${script_dir}/ruleset-config.json"

    # Verify ruleset config file exists
    if [ ! -f "$ruleset_config_file" ]; then
        error "Ruleset configuration file not found: $ruleset_config_file"
    fi

    # Apply ruleset (create or update)
    if [ "$ruleset_exists" = true ]; then
        # Update existing ruleset
        if ! gh api -X PUT "repos/$repo/rulesets/$existing_ruleset_id" \
            --input "$ruleset_config_file" > /dev/null 2>&1; then
            handle_api_error "update branch protection ruleset"
        fi
        info "✓ Branch protection ruleset updated successfully"
    else
        # Create new ruleset
        local ruleset_output
        ruleset_output=$(gh api -X POST "repos/$repo/rulesets" \
            --input "$ruleset_config_file") || handle_api_error "create branch protection ruleset"

        local ruleset_id
        ruleset_id=$(echo "$ruleset_output" | jq -r '.id')
        info "✓ Branch protection ruleset created successfully (ID: $ruleset_id)"
    fi

    warn "Note: If using semantic-release, add Chainguard Octo STS integration to bypass list via GitHub UI"
    warn "See docs/repository-settings.md for instructions"
}

# Verify settings
verify_settings() {
    local repo=$1
    info "Verifying applied settings..."

    echo ""
    echo "General Settings:"
    gh api "repos/$repo" | jq '{
        has_issues,
        has_wiki,
        has_discussions,
        allow_squash_merge,
        allow_merge_commit,
        allow_rebase_merge,
        delete_branch_on_merge
    }'

    echo ""
    echo "Branch Protection Ruleset:"
    local ruleset_id
    ruleset_id=$(gh api "repos/$repo/rulesets" --jq '.[] | select(.target == "branch" and .enforcement == "active") | .id' 2>/dev/null | head -1 || echo "")
    if [ -n "$ruleset_id" ]; then
        gh api "repos/$repo/rulesets/$ruleset_id" | jq '{
            id,
            name,
            enforcement,
            target,
            rules: [.rules[] | .type],
            bypass_actors: [.bypass_actors[] | {actor_type, actor_id}],
            status_checks: ([.rules[] | select(.type == "required_status_checks") | .parameters.required_status_checks[].context] // []),
            pr_rules: ([.rules[] | select(.type == "pull_request") | .parameters | {
                required_approvals: .required_approving_review_count,
                dismiss_stale: .dismiss_stale_reviews_on_push,
                require_last_push: .require_last_push_approval,
                merge_methods: .allowed_merge_methods
            }] // [])
        }'
    else
        warn "Branch protection ruleset not configured"
    fi
}

# Parse command line arguments
parse_args() {
    local args=()
    for arg in "$@"; do
        if [ "$arg" = "--dry-run" ]; then
            DRY_RUN=true
        else
            args+=("$arg")
        fi
    done
    echo "${args[@]}"
}

# Main execution
main() {
    echo "========================================="
    echo "  Repository Settings Application"
    echo "========================================="
    echo ""

    check_prerequisites

    # Parse arguments
    local parsed_args
    parsed_args=$(parse_args "$@")

    local repo
    repo=$(get_repository $parsed_args)

    if [ "$DRY_RUN" = true ]; then
        warn "DRY RUN MODE: No changes will be applied"
        echo ""
    fi

    info "Target repository: $repo"

    # Validate repository access
    validate_repository "$repo"

    if [ "$DRY_RUN" = false ]; then
        echo ""
        read -p "Apply settings to $repo? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            warn "Aborted by user"
            exit 0
        fi
    fi

    echo ""
    apply_general_settings "$repo"
    echo ""
    apply_branch_protection "$repo"

    if [ "$DRY_RUN" = false ]; then
        echo ""
        verify_settings "$repo"
        echo ""
        info "Settings applied successfully!"
        info "See docs/repository-settings.md for additional manual configuration steps."
    else
        echo ""
        warn "DRY RUN completed. No changes were made."
        info "Run without --dry-run to apply these settings."
    fi
}

main "$@"
