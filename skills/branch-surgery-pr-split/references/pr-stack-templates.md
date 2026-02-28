# PR Stack Templates

## Split Plan Template

```markdown
## Split Plan

- Original Branch: `<branch>`
- Base Branch: `<base>`
- Chosen Topology: `<topology>`
- Runner-Up Topology: `<topology>`
- Why Chosen: `<short rationale>`

### Branch Inventory

1. `<branch-a>` (base: `<base-a>`) - `<scope>`
2. `<branch-b>` (base: `<base-b>`) - `<scope>`

### Commit Disposition

- Keep: `<commit/intent>` -> `<branch>`
- Split: `<commit/intent>` -> `<branch parts>`
- Drop as superseded: `<commit/intent>` -> `<reason>`

### Merge Order

1. `<branch>`
2. `<branch>`

### Validation Gates

- [ ] No missing files
- [ ] No extra files
- [ ] Per-file parity
- [ ] Deletion semantics parity
- [ ] Scope boundaries valid
```

## Per-PR Description Template

```markdown
## Why?

<why this slice exists>


## What Changed?

- <scoped change 1>
- <scoped change 2>


## Notes

- Ordering: <where this PR fits in merge sequence>
- Process: <rebase/merge warning for this branch>
```

## Top-Two Options Summary Template

```markdown
## Topology Options

### Option 1 (Recommended): <name>

- Fit: <why it matches current signals>
- Pros: <review and merge benefits>
- Risks: <key failure modes>
- Cost: <low/medium/high>

### Option 2: <name>

- Fit: <why it is plausible>
- Pros: <benefits>
- Risks: <costs>
- Cost: <low/medium/high>

### What Changes If Option 2 Is Chosen

<one short paragraph>
```
