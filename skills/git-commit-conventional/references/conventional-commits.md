# Conventional Commits Reference

## Subject Format

Use one of these forms:

```text
<type>(<scope>): <subject>
<type>: <subject>
```

- Use imperative mood in subject (`add`, `fix`, `update`).
- Keep subject under 72 characters, ideally under 50.
- Keep body lines at 72 characters maximum for readability in git tools.
- Add `!` after type when introducing a breaking change.

## Core Types

| Type | Use case |
| --- | --- |
| `feat` | Introduce new behavior or functionality |
| `fix` | Correct a defect |
| `docs` | Documentation-only change |
| `style` | Formatting/style only, no behavior change |
| `refactor` | Internal code change without feature or fix |
| `perf` | Performance improvement |
| `test` | Add or adjust tests |
| `build` | Build system or dependency tooling changes |
| `ci` | CI/CD configuration or pipeline changes |
| `chore` | Repository maintenance not covered above |

## Scope Guidance

Use scope when it increases precision. Common scopes:

- `ui`, `api`, `db`, `auth`, `config`, `docs`, `deps`

Omit scope when the change spans multiple unrelated areas.

## Body Guidance

Default to including a body that captures context and rationale.

Only omit the body when the change is very, very small and the subject alone is fully sufficient.

```text
refactor(api): simplify error handling in token refresh

Consolidate duplicate retry branches to reduce branching complexity and make failures easier to diagnose.
```

## Footer Guidance

Add footers after a blank line:

```text
Fixes #123
Refs #456
Reviewed-by: username
BREAKING CHANGE: describe incompatible behavior
```

## Multi-Commit Decision Heuristics

Split commits when any of the following are true:

- Changes represent different logical goals.
- Docs and code can be committed independently.
- A single commit would be too broad to review safely.

Keep as one commit when files are tightly coupled and splitting creates non-functional history.
