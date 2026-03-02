# Contributing

Thank you for contributing to this project! This guide will help you understand our development workflow and quality standards.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Conventional Commits](#conventional-commits)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Quality Gates](#quality-gates)

## Development Workflow

### Setup

1. Fork and clone the repository
2. Install Python 3.12 tooling (`pre-commit`) and `uv` for skill helper scripts
3. Install pre-commit hooks: `pre-commit install`
4. Create a feature branch following our [naming conventions](#branch-naming-conventions)

### Making Changes

1. Make your changes in a feature branch
2. Add or update content in the correct location:
   - Prompts: `prompts/<category>/`
   - Skills: `skills/<skill-name>/` with `SKILL.md`
3. Write clear, descriptive commit messages using [Conventional Commits](#conventional-commits)
4. Ensure all tests pass and pre-commit hooks succeed
5. Push your branch and create a pull request
6. Address review feedback and update your branch

### Contributing Skills

When contributing or updating a skill, use the local helper scripts and validation flow documented in [docs/development.md](docs/development.md):

```bash
uv run scripts/init_skill.py my-skill --path skills --resources scripts,references --examples
uv run scripts/generate_openai_yaml.py skills/my-skill
uv run scripts/quick_validate.py skills/my-skill
```

Keep `name` and `description` in `SKILL.md` frontmatter valid and non-empty so the skill remains compatible with `skills.sh` discovery.

### Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Link any related issues
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address feedback promptly

## Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages. This enables automated versioning and changelog generation.

### Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement (triggers patch version bump)
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# Feature with description
git commit -m "feat: add user authentication"

# Bug fix with scope
git commit -m "fix(api): handle null response from external service"

# Breaking change (triggers major version bump)
git commit -m "feat!: redesign API authentication" -m "BREAKING CHANGE: old API keys no longer supported"

# Multiple commit message lines
git commit -m "feat: add data export functionality" -m "- Export to CSV format" -m "- Export to JSON format"
```

### Scope (Optional)

Scope provides additional context about what part of the codebase changed:

- `feat(auth): add OAuth2 support`
- `fix(database): resolve connection pool leak`
- `docs(readme): update installation instructions`

### Breaking Changes

For breaking changes, add `!` after the type/scope or include `BREAKING CHANGE:` in the footer:

```bash
git commit -m "feat!: remove deprecated API endpoints"

# OR

git commit -m "feat: redesign authentication system" -m "BREAKING CHANGE: all existing tokens are invalidated"
```

## Branch Naming Conventions

Use descriptive branch names that indicate the type of work:

### Format

```text
<type>/<short-description>
```

### Examples

- `feat/user-authentication`
- `fix/database-connection-leak`
- `docs/update-readme`
- `refactor/simplify-api-handlers`
- `test/add-integration-tests`
- `chore/update-dependencies`

### Guidelines

- Use lowercase with hyphens (kebab-case)
- Keep names concise but descriptive
- Use the same type prefixes as commits (feat, fix, docs, etc.)

## Quality Gates

Run these checks before opening or updating a PR:

```bash
pre-commit run --all-files
python scripts/check_docs_drift.py
```

Current pre-commit hooks in this repository cover:

- YAML/TOML/basic file hygiene checks
- Markdown lint and auto-fix
- Conventional Commit message linting
- Secret scanning with gitleaks

Do not bypass hooks. Fix failures and rerun checks until clean.

If your PR adds or removes skills, ensure docs stay in sync:

- Update `README.md` skill inventory/catalog sections.
- Re-run `python scripts/check_docs_drift.py` and confirm it passes.

## Questions?

If you have questions about contributing, please:

- Check existing issues and pull requests
- Review the [development documentation](docs/development.md)
- Open a new issue with your question
