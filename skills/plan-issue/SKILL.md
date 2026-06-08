---
name: plan-issue
description: Creates a single story (GitHub Issue) for an existing epic milestone. Stories for the Shell epic use an infrastructure format (Goal/Tasks/Validation). Stories for any other epic use an interaction-driven format (Interaction/Layers/After implementation). Checks the codebase for existing layer implementations before proposing work.
---

# plan-issue

You are creating one story (GitHub Issue) linked to an existing milestone. The epic and its milestone should already exist (created by `/plan-epic`). Your job is to write and create one well-formed story.

---

## Step 1 — Identify the Milestone and Story Format

Ask the operator (or infer from context):

1. **Which milestone does this story belong to?** Run `gh milestone list --state all` if not already known.
2. **Is this for the Shell epic?**
   - **Yes — Shell epic** → use the [Shell Story Format](#shell-story-format). Stories are infrastructure-focused and have a fixed set.
   - **No — any other epic** → use the [Story Format](#story-format). Stories are driven by an operator-stated interaction.

---

## Shell Story Format

Shell stories establish infrastructure capabilities end-to-end: from local setup through CI enforcement.

```text
Title: [Capability name]

## Goal
One sentence: what capability this story establishes.

## Tasks
- [ ] [Set up the tool or framework locally]
- [ ] [Implement the thing]
- [ ] [Add CI workflow job]

## Validation
- [ ] Local: [exact command and expected result]
- [ ] CI: [what the workflow job shows on a passing run]
```

### Standard Shell Stories

Use these as the basis for each Shell story. Adjust tool names to match the actual tech stack.

#### Repo Scaffold

> Goal: The repository has a documented folder structure with all base config files in place.
> Tasks:
>
> - [ ] Create folder skeleton matching the app's architecture (e.g., `/src`, `/test`, `/infra`)
> - [ ] Add `.gitignore`, editor config, and base config files (linter config, formatter config)
> - [ ] Add or update README with app description, local setup steps, and architecture overview
> Validation:
> - [ ] Local: `git status` shows no untracked noise; project opens and navigates cleanly
> - [ ] CI: N/A — no job for this story; subsequent stories depend on this structure

#### Health Endpoint and Containerization

> Goal: The app runs in a container and exposes `GET /health` returning a 200 response.
> Tasks:
>
> - [ ] Implement `GET /health` returning `{ "status": "ok" }` (or stack equivalent)
> - [ ] Add `Dockerfile` and `docker-compose.yml` for local dev
> - [ ] Verify app starts and `/health` responds inside the container
> Validation:
> - [ ] Local: `docker compose up` → `curl localhost:[PORT]/health` returns 200
> - [ ] CI: image builds successfully in the build story

#### Unit Test Capability

> Goal: Unit tests run locally and as a required CI job on every PR.
> Tasks:
>
> - [ ] Add unit testing framework (match the stack: JUnit, Jest, pytest, etc.)
> - [ ] Write a unit test asserting `GET /health` returns 200 with the expected body
> - [ ] Add a `test` job to the CI workflow that runs on every PR
> Validation:
> - [ ] Local: `[test command]` runs and passes
> - [ ] CI: `test` job passes on a test PR; a broken test fails the job

#### Build and Publish Artifact

> Goal: CI builds a Docker image and publishes it to a container registry on merge to the default branch.
> Tasks:
>
> - [ ] Add `build` job to CI that builds the Docker image
> - [ ] Add `publish` job that pushes the image to the target registry on merge to default branch
> - [ ] Tag the image with the git SHA and `latest`
> Validation:
> - [ ] Local: `docker build .` succeeds
> - [ ] CI: merge to default branch triggers publish; image appears in the registry with expected tags

#### Security and Dependency Scan

> Goal: CI runs a security scan on every PR to catch vulnerable dependencies and common code issues.
> Tasks:
>
> - [ ] Add a dependency vulnerability scanner (match the stack: `npm audit`, Trivy, Snyk, Dependabot, etc.)
> - [ ] Add a SAST tool (e.g., CodeQL, Semgrep)
> - [ ] Add a `scan` job to the CI workflow that runs on every PR
> Validation:
> - [ ] Local: scan tool runs and produces a report
> - [ ] CI: `scan` job passes on a clean PR; a known-vulnerable dependency fails it

#### Lint and Format Enforcement

> Goal: Linting and formatting rules are defined and enforced as a required CI job on every PR.
> Tasks:
>
> - [ ] Configure linter and formatter for the stack (ESLint + Prettier, Checkstyle, Black + Ruff, etc.)
> - [ ] Add a `lint` job to the CI workflow that runs on every PR
> - [ ] Commit formatter config so all contributors use the same rules
> Validation:
> - [ ] Local: lint command runs and reports violations correctly
> - [ ] CI: `lint` job fails on a PR with a formatting violation; passes on a clean one

---

## Story Format

Stories for any epic after Shell are interaction-driven. Each story is scoped as a thin vertical slice — only the layers needed to make one operator-stated interaction possible.

### Step 1 — Confirm the Interaction

Ask the operator (or use what was captured in `/plan-epic`):
> "What is the interaction this story delivers — something you could actually do to verify it's complete?"

A well-formed interaction:

- *"I want to call `GET /students` and get a list of student objects back."*
- *"I want to open the Students page and see a table of students."*
- *"I want to submit the enrollment form and have it saved."*

### Step 2 — Check for Existing Layers

Before proposing any tasks, scan the codebase for each layer required by the interaction.

- **Data**: search for migration files, schema definitions, or ORM models that include the entity.
- **API**: search for route or controller files that define the relevant method and path.
- **UI**: search for page or component files named after the entity or expected route.

Classify each layer as:

- **New** — does not exist; needs to be built. Generates tasks.
- **Partial** — exists but incomplete or inconsistent with the interaction (e.g., missing field, wrong response shape); describe the gap. Generates tasks.
- **Exists** — already fully implemented; note the file path. No tasks generated — listed under `Already in Place` instead.

### Step 3 — Write the Story

```text
Title: [Entity] — [Interaction summary]

## Interaction
[The operator's stated interaction, verbatim or lightly paraphrased.]

## After implementation, the operator should be able to
- [ ] [The exact interaction that confirms this story is complete]

## Layers
_(Only layers that are New or Partial)_

### Data  _(omit if Exists)_
- [ ] [Schema or migration: table name, key fields, types]

### API  _(include if the interaction involves an API call; omit if Exists)_
- [ ] [METHOD /path] — [request and response shape]

### UI  _(include only if the interaction requires a user interface; omit if Exists)_
- [ ] [Page or component name] — [what it shows and how the operator interacts with it]

## Already in Place  _(omit section if nothing pre-exists)_
- [Layer]: [file path] — [confirmation it satisfies this interaction, or description of gap if Partial]

## Out of Scope
- [Every adjacent operation excluded from this story]
```

### Story Rules

Stories are scoped as thin vertical slices — each one spans only the layers required to make one interaction possible.

- **Interaction drives layers.** Only include layers required by the stated interaction — no more.
- **One interaction per story.** Do not combine unrelated interactions into one story.
- **No orphan layers.** If the interaction requires a UI, Data and API must also be in the same story.
- **Check before proposing.** Never assume a layer is missing — scan first.
- **Scope out adjacents explicitly.** If the interaction is "list students," then create/update/delete must appear in Out of Scope.

---

## Examples

### Example 1 — Story with UI

**Interaction:** I want to open the Students page and see a table of all enrolled students.

---

#### Students — List View

## Interaction

I want to open the Students page and see a table of all enrolled students.

## After implementation, the operator should be able to

- [ ] Navigate to `/students` in a browser and see a table listing all enrolled students by name and email

## Layers

### Data

- [ ] `students` table: `id`, `name`, `email`, `enrolled_at`

### API

- [ ] `GET /students` — returns `[{ id, name, email, enrolledAt }]`; empty array when no students exist

### UI

- [ ] Students List page — displays name and email in a table with one row per student

## Out of Scope

- Create student
- Edit student
- Delete student
- Student detail view
- Pagination, filtering, search

---

### Example 2 — Story, API only

**Interaction:** I want to call `GET /students` and get a list of student objects back.

---

#### Students — List Endpoint

## Interaction

I want to call `GET /students` and get a list of student objects back.

## After implementation, the operator should be able to

- [ ] Call `GET /students` and receive a 200 response with an array of `{ id, name, email, enrolledAt }` objects

## Layers

### Data

- [ ] `students` table: `id`, `name`, `email`, `enrolled_at`

### API

- [ ] `GET /students` — returns `[{ id, name, email, enrolledAt }]`; empty array when no students exist

## Out of Scope

- Create student
- Edit student
- Delete student
- Student detail view
- Pagination, filtering, search
- UI (not part of this interaction)

---

### Example 3 — Story, Data layer already exists

**Interaction:** I want to call `GET /students` and get a list of student objects back.
**Existing layer found:** `students` table already defined in `db/migrations/001_create_students.sql`.

---

#### Students — List Endpoint

## Interaction

I want to call `GET /students` and get a list of student objects back.

## After implementation, the operator should be able to

- [ ] Call `GET /students` and receive a 200 response with an array of `{ id, name, email, enrolledAt }` objects

## Layers

### API

- [ ] `GET /students` — returns `[{ id, name, email, enrolledAt }]`; empty array when no students exist

## Already in Place

- Data: `db/migrations/001_create_students.sql` — `students` table with `id`, `name`, `email`, `enrolled_at` confirmed present

## Out of Scope

- Create student
- Edit student
- Delete student
- Student detail view
- Pagination, filtering, search
- UI (not part of this interaction)

---

## Creating the Story

Once the story body is agreed:

```bash
gh issue create \
  --title "Story title" \
  --body "$(cat <<'EOF'
Story body here
EOF
)" \
  --milestone "Milestone Title"
```

Confirm the created story URL back to the operator.
