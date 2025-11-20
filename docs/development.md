# Development Guide

This repository stores reusable AI prompts. Most automation revolves around Markdown quality gates and release workflows, so local setup is intentionally lightweight.

## Local Development Setup

### Prerequisites

- Git 2.43+
- Python 3.12 (used for `pre-commit` and semantic-release tooling)
- `pipx` or `pip` for installing Python CLIs
- (Optional) [`uv`](https://github.com/astral-sh/uv) for running Slash Command Manager

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/liatrio-labs/ai-prompts.git
cd ai-prompts

# Install pre-commit and hooks
pip install --user pre-commit
pre-commit install
```

### Running Quality Gates Locally

```bash
# Run every hook (YAML, Markdown lint, commitlint config, gitleaks)
pre-commit run --all-files

# Spot-check a single file while editing
pre-commit run markdownlint-fix --files prompts/example.md
```

### Adding or Editing Prompts

1. Create/update files inside `prompts/<category>/` using Markdown.
2. Follow existing structure: heading, context, instructions, tool guidance.
3. Run `pre-commit run --all-files` to ensure formatting/linting passes.
4. Open a PR using the template checklist (ensures docs + CI expectations are met).

## Slash Command Manager (Optional)

Quickly install prompts into an AI assistant with:

```bash
uvx --from git+https://github.com/liatrio-labs/slash-command-manager slash-man generate \
  --github-repo liatrio-labs/ai-prompts \
  --github-branch main \
  --github-path prompts \
  --agent claude-code
```

Swap `--agent` for `cursor`, `windsurf`, etc., depending on your tool.

## Release Workflow Notes

Semantic Release runs after the CI workflow succeeds on `main`. To publish successfully:

- Ensure `.github/workflows/ci.yml` passes on the PR
- Use conventional commit messages so release automation can derive version bumps

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `pre-commit` is missing | Re-run `pip install pre-commit && pre-commit install` |
| Markdown lint fails on tables/lists | Use `markdownlint --fix <file>` or let the hook auto-fix |
| Release workflow cannot mint a token | Verify the Chainguard STS subject matches `liatrio-labs/ai-prompts` and rerun the job |
| Branch protection blocks merge | Confirm the CI workflow completed; rerun `./scripts/apply-repo-settings.sh` if rules drift |
