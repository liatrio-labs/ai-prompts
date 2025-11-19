# Contributing

Thank you for contributing to this project! This guide will help you understand our development workflow and quality standards.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Conventional Commits](#conventional-commits)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Testing Guidelines](#testing-guidelines)

## Development Workflow

### Setup

1. Fork and clone the repository
2. Install dependencies for your language/framework
3. Install pre-commit hooks: `pre-commit install`
4. Create a feature branch following our [naming conventions](#branch-naming-conventions)

### Making Changes

1. Make your changes in a feature branch
2. Write clear, descriptive commit messages using [Conventional Commits](#conventional-commits)
3. Ensure all tests pass and pre-commit hooks succeed
4. Push your branch and create a pull request
5. Address review feedback and update your branch

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

## Pre-commit Hooks

### Installing Pre-commit Hooks

This template includes language-agnostic pre-commit hooks by default (YAML validation, markdown linting, conventional commits). To add hooks for your specific programming language, update `.pre-commit-config.yaml` with the appropriate hooks.

### JavaScript/TypeScript Example

```yaml
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.0.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
        types: [file]
```

### Python Example

```yaml
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.14.0
    hooks:
      - id: ruff-check
        args: [--fix, --exit-non-zero-on-fix]
      - id: ruff-format
```

### Go Example

```yaml
  - repo: https://github.com/golangci/golangci-lint
    rev: v1.55.0
    hooks:
      - id: golangci-lint
```

### Rust Example

```yaml
  - repo: https://github.com/doublify/pre-commit-rust
    rev: v1.0
    hooks:
      - id: fmt
      - id: clippy
```

## Enabling/Disabling Hooks

To skip a specific hook during commit:

```bash
SKIP=hook-id git commit -m "message"
```

To disable the `no-commit-to-branch` hook (if enabled locally):

```bash
SKIP=no-commit-to-branch git commit -m "message"
```

## Testing Guidelines

### Writing Tests

<!-- Add project-specific testing guidelines here -->

- Write tests for all new features and bug fixes
- Follow the testing conventions of your language/framework
- Aim for high code coverage (target: 80%+)
- Include unit tests, integration tests, and end-to-end tests as appropriate

### Running Tests Locally

```bash
# Add your project's test command here
# Examples:
# npm test                    # Node.js
# pytest                      # Python
# go test ./...               # Go
# cargo test                  # Rust
# mvn test                    # Java (Maven)
```

### Test Requirements

- All tests must pass before merging
- New code should maintain or improve code coverage
- Tests should be deterministic and not flaky
- Mock external dependencies appropriately

## Language-Specific Guidelines

<!-- Add language-specific contribution guidelines here as your project evolves -->

### Examples

#### Python Projects

- Follow PEP 8 style guidelines
- Use type hints for function signatures
- Add docstrings for public APIs

#### JavaScript/TypeScript Projects

- Follow Airbnb JavaScript Style Guide
- Use ESLint and Prettier for code formatting
- Add JSDoc comments for public APIs

#### Go Projects

- Follow Effective Go guidelines
- Use `gofmt` for code formatting
- Add godoc comments for exported identifiers

## Questions?

If you have questions about contributing, please:

- Check existing issues and pull requests
- Review the [development documentation](docs/development.md)
- Open a new issue with your question
