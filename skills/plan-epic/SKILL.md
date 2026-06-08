---
name: plan-epic
description: "Interactive GitHub Epic planner. Plans one milestone at a time. The first epic is always Shell (scaffold + CI with a fixed set of stories). Each subsequent epic is defined through operator dialogue. Use /plan-issue to create the individual stories once an epic is defined."
---

# plan-epic

You are running an interactive planning session to define a GitHub Milestone (epic) for an app. You define what the epic delivers and create the milestone — story creation is handled by `/plan-issue`.

## Core Principles

- **One epic per session.** Never plan all epics upfront. Plan one, get operator approval, then ask if they want to plan the next.
- **Shell is always first.** If no milestones exist, the first epic is always Shell.
- **Dialogue before milestone.** For any epic after Shell, talk with the operator to collect the interactions the epic should deliver before creating anything.
- **Epics build on each other.** Each epic after Shell should leave users with something new they can interact with and give feedback on.

---

## Step 1 — Read the Repo

Before asking anything, gather context:

1. Read `README.md`, `CLAUDE.md` (if present), `AGENTS.md` (if present), `package.json` or equivalent build file, and the top-level directory structure.
2. Check for a prototype folder — look for directories named `prototype`, `design`, `mockups`, `wireframes`, or similar. If found, list the files inside and read any that describe screens, flows, or features (HTML, markdown, or image files from Claude Design or similar tools).
3. Run `gh milestone list --state all` to see existing epics.
4. Summarize what you found: the app's apparent purpose, tech stack, any existing milestones, and — if a prototype exists — a brief inventory of what screens or capabilities it depicts.
5. Ask the operator to confirm or correct your understanding before proceeding.

### Using Prototype Content

If a prototype folder exists, it is a reference for what the finished app might look like — not a backlog to execute in order.

- **Do not plan stories for every screen in the prototype.** The prototype shows the destination; the epics are the journey.
- **Use prototype screens as prompts, not prescriptions.** Reference 2–3 specific screens to make the conversation concrete: *"The prototype shows a student list, a course catalog, and an enrollment flow — which of these is most important to get in front of users first?"*
- **Surface prototype scope without imposing it.** Name what you see, then let the operator choose.
- **Flag implementation complexity.** If a prototype screen implies significant work (auth, complex relationships, real-time updates), call it out so the operator can make an informed scoping decision.

---

## Step 2 — Determine the Next Epic

- **No milestones exist** → proceed to [Shell Epic](#shell-epic).
- **Shell milestone exists** → proceed to [Next Epic](#next-epic).

---

## Shell Epic

The first epic is always Shell. Its purpose: a deployable artifact exists and CI is fully wired, but there is no domain functionality yet. The stories are fixed — the operator does not define them.

### Stories in the Shell Epic

Present these to the operator and ask if any need adjusting for the tech stack (different test framework, artifact registry, monorepo, etc.). Full story detail is in `/plan-issue`.

| Story | Goal |
|-------|------|
| Repo Scaffold | Documented folder structure with all base config files in place |
| Health Endpoint and Containerization | App runs in a container and exposes `GET /health` returning 200 |
| Unit Test Capability | Unit tests run locally and as a required CI job on every PR |
| Build and Publish Artifact | CI builds and publishes a Docker image to a registry on merge to default branch |
| Security and Dependency Scan | CI runs dependency and SAST scans on every PR |
| Lint and Format Enforcement | Linting and formatting rules enforced as a required CI job on every PR |

### Creating the Shell Milestone

Once the operator confirms the story list:

1. Create the milestone:
   ```bash
   gh milestone create "Shell" --description "Deployable shell app with full CI pipeline. No domain functionality."
   ```
2. Tell the operator: "Milestone created. Use `/plan-issue` to create each story and link it to this milestone."

---

## Next Epic

Every epic after Shell is defined by the operator through dialogue. Each one should deliver something new that users can interact with and give feedback on.

### Dialogue First

Do NOT create a milestone until the operator has agreed on what the epic delivers.

Ask the operator:
> **"What do you want to be able to do or verify once this epic is complete? Describe it as an interaction — something you could actually perform to confirm it's working."**

Examples of well-formed interactions:
- *"I want to call `GET /students` and get a list of student objects back."*
- *"I want to open the Students page and see a table of students."*
- *"I want to submit the enrollment form and have it saved."*

If the answer is vague, probe:
- "How would you know this is done — what would you actually do to verify it?"
- "Is this something you'd check in a browser, in a terminal, or both?"
- "What data would need to exist first for that interaction to be meaningful?"

If a prototype was found in Step 1, use it to focus the question:
> *"The prototype shows [screen A], [screen B], and [screen C]. Which of these do you want to be able to interact with when this epic is done?"*

Collect all interactions for this epic. When the operator is done, reflect them back as a list and confirm before proceeding.

### Creating the Milestone

Once the operator agrees on the interaction list:

1. Agree on a short epic name that describes what the epic delivers (e.g., "Browse Core Entities", "Student Enrollment MVP").
2. Create the milestone:
   ```bash
   gh milestone create "[Epic Name]" --description "[One-sentence summary of what users can do when this epic is complete]"
   ```
3. Tell the operator: "Milestone created. Use `/plan-issue` for each interaction to create the individual stories and link them to this milestone."

---

## Step 3 — Continue?

After creating any epic, ask:

> "Want to plan the next epic? If so, tell me what you're thinking about delivering next — or say yes and I'll start by asking."

If yes, return to [Next Epic](#next-epic). If not, list all milestones created this session and close.

---

## gh CLI Reference

```bash
# List existing milestones
gh milestone list --state all

# Create a milestone
gh milestone create "Epic Name" --description "Description"
```

If the target repo is ambiguous (multiple remotes, or invoked outside a git repo), confirm with the operator before creating anything.
