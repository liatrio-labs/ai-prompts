# AI Prompts and Skills

A collection of reusable prompts and skills for AI tools used in day-to-day software development.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/liatrio-labs/ai-prompts/blob/main/LICENSE)

## About This Collection

This collection contains curated prompts and skills for AI tools that support day-to-day software development activities. Prompts and skills are organized by use case and designed to be integrated into different assistant workflows.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/liatrio-labs/ai-prompts.git
cd ai-prompts
```

### 2. Browse Prompts and Skills

Prompts are organized in the `prompts/` directory by category:

- `development/` - Development workflow and coding prompts
- `documentation-and-research/` - Documentation, content generation, and research prompts

Skills are organized in the `skills/` directory by capability:

- `git-commit-conventional/` - Conventional commit message and commit hygiene guidance
- `create-pull-request/` - PR/MR drafting and optional creation workflow
- `create-mermaid-diagrams/` - Mermaid diagram creation and validation workflow

### 3. Use Prompts with AI Tools

**Option A: Direct Copy**
Copy prompts directly from the files into your preferred AI tool (Cursor, Claude Code, Windsurf, etc.) and customize the parameters as needed for your specific use case.

**Option B: Install with Slash Command Manager (Recommended)**
Use the [Slash Command Manager](https://github.com/liatrio-labs/slash-command-manager) to automatically install prompts for your AI coding assistant. The tool will detect your installed AI assistants and let you choose where to install:

```bash
# Install development prompts
uvx --from git+https://github.com/liatrio-labs/slash-command-manager slash-man generate \
  --github-repo liatrio-labs/ai-prompts \
  --github-branch main \
  --github-path prompts/development

# Install documentation and research prompts
uvx --from git+https://github.com/liatrio-labs/slash-command-manager slash-man generate \
  --github-repo liatrio-labs/ai-prompts \
  --github-branch main \
  --github-path prompts/documentation-and-research
```

See the [Slash Command Manager documentation](https://github.com/liatrio-labs/slash-command-manager) for more details.

### 4. Use Skills with `npx skills`

Install repository skills using the `skills.sh` CLI:

```bash
# List available skills in this repository without installing
npx skills add liatrio-labs/ai-prompts --list

# Install all skills from this repository
npx skills add liatrio-labs/ai-prompts --all

# Install specific skills
npx skills add liatrio-labs/ai-prompts --skill git-commit-conventional --skill create-pull-request

# Install to specific agents
npx skills add liatrio-labs/ai-prompts --skill create-mermaid-diagrams -a cursor -a codex

# Install globally instead of project scope
npx skills add liatrio-labs/ai-prompts --skill git-commit-conventional -g
```

Compatibility notes:

- `allowed-tools` support varies by agent, so keep frontmatter portable across assistants.
- Use `DISABLE_TELEMETRY=1` (or `DO_NOT_TRACK=1`) to opt out of telemetry when running the CLI.
- If internal skills are introduced later, set `INSTALL_INTERNAL_SKILLS=1` to include them in discovery.

## Skill Creation Scripts (Agent-Focused)

This repository includes local helper scripts for AI-agent-driven skill authoring workflows.
These scripts are derived from OpenAI's `skills/.system/skill-creator` in `openai/skills`: https://github.com/openai/skills/tree/main/skills/.system/skill-creator

```bash
# Validate an existing skill
uv run scripts/quick_validate.py skills/git-commit-conventional

# Initialize a new skill scaffold
uv run scripts/init_skill.py my-skill --path skills --resources scripts,references --examples

# Generate or refresh agents/openai.yaml
uv run scripts/generate_openai_yaml.py skills/my-skill
```

For a fuller workflow and troubleshooting notes, see [docs/development.md](docs/development.md).

## Context Markers Quick Reference

Context Markers are emoji-based verification techniques used to detect context rot and ensure critical instructions are being processed correctly by AI agents. This approach provides immediate visual feedback that instructions are being followed, addressing the systematic degradation of AI performance as context length increases. The technique involves requiring AI responses to begin with specific emoji markers, giving users a coarse check that may help detect when context instructions have been lost due to context window limitations or compaction inefficiencies.

| Emoji | Prompt/Skill File | Description |
| :---: | :--- | :--- |
| 🎯 | `skills/git-commit-conventional/SKILL.md` | Conventional Commit Skill |
| 🚀 | `skills/create-pull-request/SKILL.md` | Pull Request / Merge Request Description Skill |
| 📋 | `prompts/development/address-pr-review-feedback.md` | Fetch PR Review Feedback |
| 🔍 | `prompts/development/review-branch.md` | Review Branch Against Base |
| 🔄 | `prompts/development/squash-merge.md` | Squash Merge to Main |
| 📚 | `prompts/documentation-and-research/check-docs.md` | Check Documentation |
| 🧪 | `prompts/documentation-and-research/improve-prompt-with-research.md` | Improve Prompt with Research-Backed Best Practices |
| 📖 | `prompts/documentation-and-research/review-documentation.md` | Review and Improve Codebase Documentation |
| 🎨 | `skills/create-mermaid-diagrams/SKILL.md` | Create Mermaid Diagrams Skill |
| 🤖 | `AGENTS.md` | AI Agent Instructions and Configuration |

## Prompt-to-Skill Migration Map

The following prompts have been migrated to skills in this branch:

- `prompts/development/commit.md` -> `skills/git-commit-conventional/SKILL.md`
- `prompts/development/create-pull-request.md` -> `skills/create-pull-request/SKILL.md`
- `prompts/documentation-and-research/create-mermaid-diagrams.md` -> `skills/create-mermaid-diagrams/SKILL.md`

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute prompts, skills, and improvements
- [Development Guide](docs/development.md) - Prompt and skill authoring workflow and validation
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community expectations and reporting guidance

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Adding new prompts and skills
- Improving existing prompts and skills
- Submitting issues and feedback
- Following our commit conventions

## License

Copyright 2025 Liatrio

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
