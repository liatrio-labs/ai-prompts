# Session Context

## User Prompts

### Prompt 1

check the description for the PR for the current branch (use gh cli). audit the description against the git history for this branch

### Prompt 2

# Review Branch Against Base

This workflow performs an exhaustive review of the current branch against a base branch (default `main`). It collects comprehensive git data and writes outputs to temp files in the system temp directory so the AI can read and analyze them in chunks.

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format:  "<marker1><marker2><marker3>\n<response>"

The marker for this instruction is:  🔍

## Guidelin...

### Prompt 3

/new

### Prompt 4

take a look at /home/damien/Liatrio/repos/ai-prompts/temp/template-target-state-handoff.md and tell me what you think.

### Prompt 5

# Skill Builder/Auditor

## Purpose

This skill supports two workflows:

1. `create_skill`: create a new skill package from a user request.
2. `audit_skill`: audit an existing skill package against current best practices.

Outputs must be vendor-neutral by default, grounded in the AGENTS.md ecosystem and portable across agent platforms.

## Mode Selection

Choose mode based on user intent:

- If user asks to build, draft, generate, or scaffold a skill: use `create_skill`.
- If user asks to re...

### Prompt 6

that makes sense. i need to be confident of your understand of what good looks like for an ai-native repo template. review the content of /home/damien/Liatrio/repos/base-repo-template, the original template. Then review the content of /home/damien/Liatrio/repos/forge-program-tracker, the target template. both of those were critical to the buildout of /home/damien/Liatrio/repos/ai-prompts/temp/template-target-state-handoff.md.

### Prompt 7

do it

### Prompt 8

do it

### Prompt 9

document everything you need to begin building this out, commit the plans, and then push it up so i can resume this work on another machine.

