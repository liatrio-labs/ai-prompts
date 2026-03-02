#!/usr/bin/env bash
set -euo pipefail

: "${BASE_BRANCH:=main}"
OUTDIR=$(mktemp -d -t create-pr.XXXXXX)

# Core repository context
git status >"$OUTDIR/status.txt"
git branch --show-current >"$OUTDIR/current_branch.txt"
git rev-parse --show-toplevel >"$OUTDIR/repo_root.txt"

# Validate base branch exists before collecting history artifacts.
if ! git rev-parse --verify "$BASE_BRANCH" >/dev/null 2>&1; then
  echo "ERROR: BASE_BRANCH '$BASE_BRANCH' does not exist in this repository." >&2
  echo "Set BASE_BRANCH to a valid branch name (for example: main, master, develop)." >&2
  exit 1
fi

# Branch commit history and patches relative to base
git log "$BASE_BRANCH"..HEAD --oneline >"$OUTDIR/commits_oneline.txt"
git log -p "$BASE_BRANCH"..HEAD >"$OUTDIR/commits_with_patches.txt"

cat >"$OUTDIR/MANIFEST.txt" <<EOF
Artifacts directory: $OUTDIR
Base branch: ${BASE_BRANCH}

Core context files:
- repo_root.txt
- current_branch.txt
- status.txt
- commits_oneline.txt
- commits_with_patches.txt
EOF

printf "PR artifacts saved to: %s\n" "$OUTDIR"
