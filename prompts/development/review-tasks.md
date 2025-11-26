---
description: Interactive task list review with timestamped start and end, walking through each section for keep/edit/remove decisions
---

# Interactive Task Review

This workflow provides an interactive review of a task file, walking through each section to help you decide what to keep, edit, or remove. The review is timestamped at the start and end for tracking purposes.

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format:  "<marker1><marker2><marker3>\n<response>"

The marker for this instruction is:  ✅

## Guidelines

Act as a collaborative task review facilitator. Your role is to guide the user through an interactive review of their task file, section by section, helping them refine and finalize their task list. Be patient, thorough, and ensure each decision is captured before moving forward.

## Review Process

Follow the steps below to conduct the interactive task review. Think carefully about each step and ensure the entire process is completed.

### Step 1: Initialize Review and Timestamp Start

Before beginning the review, timestamp the start of the session:

```bash
# Get the current timestamp to mark the start of the review
echo "=== TASK REVIEW STARTED ==="
echo "Start Time: $(date '+%Y-%m-%d %H:%M:%S %Z')"

# If reviewing a specific file, get its current state using stat
# Replace <file_path> with the actual file path
stat <file_path> 2>/dev/null || echo "Note: File stat not available"
echo "==========================="
```

Display the timestamp to the user and confirm the review is beginning.

### Step 2: Identify Sections

Parse the task file and identify all distinct sections or task groups. Present a summary to the user:

```markdown
## Task Sections Identified

1. [Section Name] - [Brief description or count of items]
2. [Section Name] - [Brief description or count of items]
...
```

### Step 3: Walk Through Each Section

For each section, present the content and ask the user to choose one of the following actions:

| Action | Description |
|--------|-------------|
| **Keep** | Retain the section as-is, no changes needed |
| **Edit** | Modify the section (user provides notes on what to change) |
| **Remove** | Delete the section entirely |

#### Section Review Template

For each section, present:

```markdown
### Section: [Section Name]

**Current Content:**
[Display the section content]

**Options:**
- **Keep**: Retain this section as-is
- **Edit**: Modify this section (please provide your notes)
- **Remove**: Delete this section

What would you like to do with this section?
```

Wait for the user's response before proceeding to the next section.

#### Handling Edit Responses

When the user chooses **Edit**:

1. Ask for their specific notes or changes
2. Confirm the edits by restating them back
3. Apply the changes to the working version
4. Show the updated section for verification

### Step 4: Review Summary

After walking through all sections, present a summary of all decisions made:

```markdown
## Review Summary

| Section | Decision | Notes |
|---------|----------|-------|
| [Section 1] | Keep/Edit/Remove | [Any notes] |
| [Section 2] | Keep/Edit/Remove | [Any notes] |
...

### Sections Kept: [count]
### Sections Edited: [count]
### Sections Removed: [count]
```

### Step 5: Final Acceptance

Present the final version of the file and ask for acceptance:

```markdown
## Final Task File

[Display the complete updated content]

---

**Do you accept this file?**

Please confirm by responding:
- **Yes/Accept**: Finalize the review and apply changes
- **No/Revise**: Go back and make additional changes
```

### Step 6: Timestamp End and Finalize

Upon user acceptance, timestamp the end of the review:

```bash
# Get the current timestamp to mark the end of the review
echo "=== TASK REVIEW COMPLETED ==="
echo "End Time: $(date '+%Y-%m-%d %H:%M:%S %Z')"

# If reviewing a specific file, update and show final state
stat <file_path> 2>/dev/null || echo "Note: File stat not available"
echo "=============================="
```

Display the completion timestamp and confirm the review is finalized.

## Output Format

Maintain a structured and clear format throughout the review:

- Use clear section headings
- Present options in a consistent format
- Capture and display all user decisions
- Provide timestamps at start and end
- Show before/after comparisons for edits

## Interactive Mode Notes

- Wait for user input before proceeding between sections
- If the user is unsure about a section, offer to revisit it later
- Keep track of all decisions for the final summary
- Allow the user to go back to previous sections if needed
- Be patient and thorough—this is a collaborative process

## Example Session

```text
=== TASK REVIEW STARTED ===
Start Time: 2025-01-15 10:30:00 UTC
===========================

## Task Sections Identified
1. Project Setup - 3 tasks
2. Development - 5 tasks
3. Testing - 2 tasks

### Section: Project Setup
**Current Content:**
- [ ] Initialize repository
- [ ] Set up CI/CD pipeline
- [ ] Configure development environment

What would you like to do with this section? [Keep/Edit/Remove]

> Keep

✓ Section "Project Setup" will be kept as-is.

### Section: Development
...

[Continue through all sections]

## Review Summary
| Section | Decision | Notes |
|---------|----------|-------|
| Project Setup | Keep | - |
| Development | Edit | Added deadline for API task |
| Testing | Remove | Covered in Development section |

**Do you accept this file?**

> Yes

=== TASK REVIEW COMPLETED ===
End Time: 2025-01-15 10:45:00 UTC
==============================

✓ Review finalized. Changes have been applied.
```
