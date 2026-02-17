# Mastra Dev API Reference

## Base Configuration

**Base URLs:**

- Standard: `http://localhost:4111/api`
- Custom ports: `http://localhost:10305/api` (varies by project)

**Swagger UI:**

- `http://localhost:4111/swagger-ui`
- Complete interactive API documentation

**Health Check:**

- `http://localhost:4111/health`

## Core Endpoints

### Agent Management

```bash
# List all agents
GET /api/agents

# Get specific agent metadata
GET /api/agents/{agentId}
```

### Memory and Threads

```bash
# List conversation threads
GET /api/memory/threads
  ?page=0
  &perPage=10
  &agentId=<agent-id>
  &orderBy[field]=updatedAt
  &orderBy[direction]=DESC

# Get messages from a thread
GET /api/memory/threads/{threadId}/messages
  ?page=0
  &perPage=50
  &agentId=<agent-id>
  &orderBy[field]=createdAt
  &orderBy[direction]=DESC

# Get memory status
GET /api/memory/status
```

**Important:** Use `--globoff` with curl to prevent bracket interpretation:

```bash
curl --globoff -sS "http://localhost:4111/api/memory/threads?page=0&perPage=1&agentId=my-agent&orderBy[field]=updatedAt&orderBy[direction]=DESC"
```

### Workflows

```bash
# List workflows
GET /api/workflows

# Get workflow runs
GET /api/workflows/{workflowId}/runs
```

### Observability

```bash
# Get traces
GET /api/observability/traces

# Get logs
GET /api/logs
```

### Other Resources

```bash
# Processors
GET /api/processors

# Scores and Scorers
GET /api/scores
GET /api/scores/scorers

# Workspaces
GET /api/workspaces

# Workspace skills
GET /api/workspaces/{workspaceId}/skills
```

## Common Patterns

### Get Latest Thread for Agent

```bash
curl --globoff -sS \
  "http://localhost:4111/api/memory/threads?page=0&perPage=1&agentId=metabase-agent&orderBy[field]=updatedAt&orderBy[direction]=DESC"
```

### Get Thread Messages

```bash
# Replace THREAD_ID with actual ID
curl --globoff -sS \
  "http://localhost:4111/api/memory/threads/THREAD_ID/messages?page=0&perPage=50&agentId=metabase-agent&orderBy[field]=createdAt&orderBy[direction]=DESC"
```

### Format JSON Output

Pipe to Python's JSON tool for readable output:

```bash
curl ... | python3 -m json.tool
```

Or use jq if available:

```bash
curl ... | jq '.'
```

## Debugging Workflow

When the UI doesn't show errors clearly:

1. **Get the latest thread:**

   ```bash
   scripts/get_latest_thread.sh <agent-id> [port]
   ```

2. **Get thread messages:**

   ```bash
   # Extract thread ID from step 1
   curl --globoff -sS \
     "http://localhost:4111/api/memory/threads/THREAD_ID/messages?..." \
     | python3 -m json.tool
   ```

3. **Look for error fields:**
   - Search for `"error"` fields in message objects
   - Check `"failed"` status indicators
   - Review message content for error messages

## Query Parameter Notes

### Ordering

Most list endpoints support ordering:

```text
orderBy[field]=<fieldName>
orderBy[direction]=ASC|DESC
```

Common fields:

- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Pagination

Standard pagination parameters:

```text
page=0           # Zero-indexed page number
perPage=10       # Items per page
```

### Filtering

Some endpoints support filtering by:

- `agentId` - Filter by agent
- `workspaceId` - Filter by workspace
- Other endpoint-specific filters

## Project-Specific Port Configurations

| Project | Mastra Port |
|---------|-------------|
| Default | 4111 |
| gemimg-nodejs-version | 14111 |
| ai-usage-analyzer | 10305 |

Always check project documentation or Tiltfile for port configuration.

## Error Handling

### Connection Failures

If connection fails:

1. Check if Mastra is running (Tilt status)
2. Verify correct port
3. Check health endpoint: `curl http://localhost:4111/health`

### Empty Responses

If no data returned:

1. Verify agent ID is correct
2. Check agent has been used (threads exist)
3. Try listing agents first: `GET /api/agents`

### JSON Parsing

For manual inspection without JSON formatting:

```bash
# Raw output
curl --globoff -sS "..."

# With formatting
curl --globoff -sS "..." | python3 -m json.tool
```
