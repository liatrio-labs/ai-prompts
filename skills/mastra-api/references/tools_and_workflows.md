# Tools and Workflows Reference

## Tools API

### List All Tools

```bash
GET /api/tools
```

Returns all registered tools with their schemas and configurations.

**Response Structure:**

```json
{
  "toolKey": {
    "id": "tool-id",
    "description": "Tool description",
    "inputSchema": "{ stringified JSON schema }",
    "outputSchema": "{ stringified JSON schema }",
    "requireApproval": false
  }
}
```

### Common Use Cases

**List available tools:**

```bash
scripts/list_tools.sh [port]
```

**Parse tool schemas:**
Tools have JSON schemas embedded as strings. Parse them to see input/output requirements:

```bash
curl -sS http://localhost:4111/api/tools | \
  jq '.toolKey.inputSchema | fromjson.json.properties'
```

### Understanding Tool Schemas

Each tool has:

- **inputSchema**: What parameters the tool accepts
- **outputSchema**: What data the tool returns
- **requireApproval**: Whether tool execution needs user approval

Schemas are stored as JSON strings, so they need to be parsed:

```bash
# Extract input parameters for a specific tool
curl -sS http://localhost:4111/api/tools | \
  jq '.weatherTool.inputSchema | fromjson.json.properties | keys'
```

## Workflows API

### List All Workflows

```bash
GET /api/workflows
```

Returns all registered workflows with their steps and schemas.

**Response Structure:**

```json
{
  "workflowKey": {
    "name": "workflow-name",
    "steps": {
      "step-id": {
        "id": "step-id",
        "description": "Step description",
        "inputSchema": "{ stringified JSON schema }",
        "outputSchema": "{ stringified JSON schema }"
      }
    },
    "stepGraph": [...],
    "inputSchema": "{ stringified JSON schema }",
    "outputSchema": "{ stringified JSON schema }"
  }
}
```

### Get Workflow Details

```bash
GET /api/workflows/{workflowName}
```

Returns detailed information about a specific workflow including all steps, their relationships, and schemas.

```bash
scripts/get_workflow_details.sh <workflow-name> [port]
```

### Get Workflow Runs

```bash
GET /api/workflows/{workflowName}/runs?page=0&perPage=10
```

Returns execution history for a workflow.

```bash
scripts/get_workflow_runs.sh <workflow-name> [port] [page] [perPage]
```

**Response Structure:**

```json
{
  "runs": [
    {
      "id": "run-id",
      "status": "completed|failed|running",
      "startTime": "timestamp",
      "endTime": "timestamp",
      "input": {...},
      "output": {...}
    }
  ],
  "total": 10
}
```

## Debugging Workflows

### Understanding Workflow Structure

Workflows consist of:

1. **Steps**: Individual operations in sequence
2. **Step Graph**: Visual representation of step flow
3. **All Steps**: Complete list including sub-workflows
4. **Schemas**: Input/output definitions for the workflow

### Common Debugging Patterns

**Check if workflow exists:**

```bash
curl -sS http://localhost:4111/api/workflows | jq 'keys'
```

**Get workflow step sequence:**

```bash
curl -sS http://localhost:4111/api/workflows/my-workflow | \
  jq -r '.steps | keys | join(" → ")'
```

**Check for recent failures:**

```bash
scripts/get_workflow_runs.sh my-workflow 4111 0 5 | \
  jq '.runs[] | select(.status == "failed")'
```

**See input requirements:**

```bash
curl -sS http://localhost:4111/api/workflows/my-workflow | \
  jq '.inputSchema | fromjson.json.properties | keys'
```

## Integration with Agents

Agents can use both tools and workflows:

1. **Tools in Agents**: Check what tools an agent has access to:

   ```bash
   curl -sS http://localhost:4111/api/agents | \
     jq '.["agent-name"].tools | keys'
   ```

2. **Workflows in Agents**: Check what workflows an agent can invoke:

   ```bash
   curl -sS http://localhost:4111/api/agents | \
     jq '.["agent-name"].workflows | keys'
   ```

## Quick Reference Commands

```bash
# List all tools
scripts/list_tools.sh

# List all workflows
scripts/list_workflows.sh

# Get workflow details
scripts/get_workflow_details.sh weather-workflow

# Get workflow runs
scripts/get_workflow_runs.sh weather-workflow

# Check agent tools
curl -sS http://localhost:4111/api/agents | \
  jq '.["my-agent"].tools'

# Check agent workflows
curl -sS http://localhost:4111/api/agents | \
  jq '.["my-agent"].workflows'
```

## Common Issues

### Empty Tool/Workflow Lists

If `/api/tools` or `/api/workflows` returns `{}`:

- Tools/workflows may not be registered yet
- Check that Mastra instance has been initialized
- Verify tool/workflow imports in `src/mastra/index.ts`

### Schema Parsing Errors

Schemas are JSON strings within JSON, requiring double parsing:

```bash
# Wrong - treats as string
jq '.tool.inputSchema'

# Correct - parses the string as JSON
jq '.tool.inputSchema | fromjson.json'
```

### Workflow Runs Not Showing

If workflow runs are empty:

- Workflow may not have been executed yet
- Check workflow status first: `GET /api/workflows/{name}`
- Verify workflow is registered and accessible
