# AI Agent Instructions

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format:  "<marker1><marker2><marker3>\n<response>"

The marker for this instruction is:  🤖

## Local Skill Scripts

Use these local scripts when creating or updating skills in this repository.

Prefer running commands from the repository root with `uv run`.

### Standard Workflow

1. Initialize a skill scaffold.
2. Update `SKILL.md` and any skill resources.
3. Generate or refresh `agents/openai.yaml` when needed.
4. Validate the skill folder.

```bash
# Initialize
uv run scripts/init_skill.py my-skill --path skills --resources scripts,references --examples

# Generate/refresh agents/openai.yaml
uv run scripts/generate_openai_yaml.py skills/my-skill

# Validate
uv run scripts/quick_validate.py skills/my-skill
```

If validation reports `Description must be a string, got list`, update the `description:` value in `SKILL.md` frontmatter to a quoted YAML string.
