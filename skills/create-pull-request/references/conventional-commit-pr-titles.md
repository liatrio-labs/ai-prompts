# Conventional Commit PR/MR Titles

Use Conventional Commit style for PR/MR titles:

- Format: `<type>[optional scope]: <description>`
- Keep description imperative and concise.
- Use lowercase unless proper nouns require capitalization.

## Allowed Types

| Type | Description | Example |
| --- | --- | --- |
| `feat` | New feature | `feat(auth): add OAuth2 integration` |
| `fix` | Bug fix | `fix(api): resolve race condition in payment processing` |
| `docs` | Documentation-only changes | `docs(readme): update installation instructions` |
| `style` | Non-functional formatting/style change | `style: format code with prettier` |
| `refactor` | Code restructuring without feature/bug change | `refactor(database): optimize query performance` |
| `perf` | Performance improvement | `perf(cache): reduce memory usage` |
| `test` | Test-only change | `test(auth): add integration tests for login flow` |
| `build` | Build/dependency/tooling change | `build(deps): update webpack` |
| `ci` | CI workflow/config change | `ci: add security scanning` |
| `chore` | Other maintenance change | `chore: update license` |

## Breaking Changes

Use one or both:

1. Add `!` before `:`
   - `feat(api)!: remove deprecated endpoints`
2. Add `BREAKING CHANGE:` in PR body notes
   - `BREAKING CHANGE: describe what breaks and migration path`

When in doubt, include both for clarity.
