# PR/MR Creation Commands

Run this flow only after explicit user approval of the generated title/body.

## Platform Detection

```bash
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if echo "$REMOTE_URL" | rg -q "github.com"; then
  PLATFORM="github"
elif echo "$REMOTE_URL" | rg -q "gitlab.com|gitlab\\."; then
  PLATFORM="gitlab"
else
  PLATFORM=""
fi
```

If `PLATFORM` is empty, ask the user to choose.

## GitHub (`gh`)

```bash
command -v gh >/dev/null 2>&1 || { echo "gh not installed"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "gh not authenticated"; exit 1; }
```

```bash
DESC_FILE=$(mktemp)
cat > "$DESC_FILE" <<'EOF'
[Paste approved PR body]
EOF

gh pr create \
  --title "[Approved PR Title]" \
  --body-file "$DESC_FILE" \
  --base "${BASE_BRANCH:-main}"
status=$?
if [ "$status" -ne 0 ]; then
  echo "gh pr create failed with exit code $status" >&2
  echo "See the CLI error output above for exact details." >&2
  echo "Fallback: create manually in the GitHub UI using the approved title/body." >&2
  rm "$DESC_FILE"
  exit "$status"
fi

rm "$DESC_FILE"
```

## GitLab (`glab`)

```bash
command -v glab >/dev/null 2>&1 || { echo "glab not installed"; exit 1; }
glab auth status >/dev/null 2>&1 || { echo "glab not authenticated"; exit 1; }
```

```bash
DESC_FILE=$(mktemp)
cat > "$DESC_FILE" <<'EOF'
[Paste approved MR body]
EOF

glab mr create \
  --title "[Approved MR Title]" \
  --description "$(cat "$DESC_FILE")" \
  --target-branch "${BASE_BRANCH:-main}"
status=$?
if [ "$status" -ne 0 ]; then
  echo "glab mr create failed with exit code $status" >&2
  echo "See the CLI error output above for exact details." >&2
  echo "Fallback: create manually in the GitLab UI using the approved title/body." >&2
  rm "$DESC_FILE"
  exit "$status"
fi

rm "$DESC_FILE"
```

## Error Handling

- If command fails, show the exact error and suggest manual creation fallback.
- Never change title/body content without user approval.
