# Tilt Command Reference

## Core Commands

### Starting and Stopping

```bash
# Start Tilt on default port (10350)
tilt up

# Start Tilt on custom port
tilt up --port 10102
tilt up --port 10301

# Stop Tilt
tilt down
```

### Status and Monitoring

```bash
# Check resource status
tilt get uiresources --port <PORT>

# View logs for a specific resource
tilt logs --port <PORT> <resource>

# Follow logs (like tail -f)
tilt logs --port <PORT> <resource> --follow

# Diagnose Tilt issues
tilt doctor
```

### Web UI

Access Tilt UI at: `http://localhost:<PORT>`

Common ports:

- 10350 (Tilt default)
- 10102 (example custom port)
- 10301 (example custom port)

## Important Concepts

### Always Check Before Starting

Services may already be running with hot reload enabled. Before running `tilt up`:

1. Check if Tilt is already running:

   ```bash
   tilt get uiresources --port <PORT>
   ```

2. Check service health endpoints:

   ```bash
   curl http://localhost:3000/health     # Backend
   curl http://localhost:3001/           # Frontend
   curl http://localhost:4111/swagger-ui # Mastra (primary)
   curl http://localhost:14111/swagger-ui # Mastra (fallback)
   ```

### Tiltfile Language (Starlark)

Tiltfiles use Starlark, a Python-like language with limitations:

**Avoid:**

- f-strings
- `import` statements
- `try/except` blocks
- `lambda` functions

**Use instead:**

- String concatenation: `"hello" + " world"`
- `%` formatting: `"port: %s" % port`
- Tilt built-ins and `load()` extensions

### Local Resources

`local_resource` is common for process-based local development loops, but Tilt is fully designed to orchestrate Docker and Kubernetes resources as well:

```python
local_resource(
    'backend',
    serve_cmd='npm run dev',
    serve_dir='.'
)
```

Kubernetes-oriented setups commonly use resources such as:

```python
docker_build('backend-image', '.')
k8s_yaml('k8s/deployment.yaml')
k8s_resource('backend')
```

## Troubleshooting

### Service Not Responding

1. Check Tilt UI for resource status
2. View resource logs: `tilt logs --port <PORT> <resource>`
3. Check health endpoints with curl
4. Look for errors in Tilt UI or logs

### Port Conflicts

Different projects use different ports. Common patterns:

- Tilt UI: 10350 by default (or custom `--port`)
- Backend APIs: often 3000 or 8000
- Frontend apps: often 3001 or 5173
- Mastra/API services: project-specific

### Hot Reload Not Working

Tilt automatically watches files and reloads. If changes aren't applying:

1. Check Tilt UI for build errors
2. Verify file is in watched directory
3. Check resource logs for errors
4. Restart specific resource if needed (via Tilt UI)

## Example Workflows

### Python + React Stack

```bash
tilt up --port 10102
tilt get uiresources --port 10102
tilt logs --port 10102 backend
tilt logs --port 10102 frontend
```

### Node.js + Frontend + API

```bash
tilt up --port 10350
curl http://localhost:3000/health
curl http://localhost:3001/
curl http://localhost:4111/swagger-ui
```

### Multi-Service Stack

```bash
tilt up --port 10301
# Services vary by project; inspect active resources first
tilt get uiresources --port 10301
tilt logs --port 10301 <resource>
```
