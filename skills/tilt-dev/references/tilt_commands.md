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

- 10102 (genimg project)
- 10301 (ai-usage-analyzer project)
- 10350 (gemimg-nodejs-version project, default)

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
   curl http://localhost:4111/swagger-ui # Mastra
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

Most projects use `local_resource` in Tiltfiles (no Docker/Kubernetes yet):

```python
local_resource(
    'backend',
    serve_cmd='npm run dev',
    serve_dir='.'
)
```

## Troubleshooting

### Service Not Responding

1. Check Tilt UI for resource status
2. View resource logs: `tilt logs --port <PORT> <resource>`
3. Check health endpoints with curl
4. Look for errors in Tilt UI or logs

### Port Conflicts

Different projects use different ports. Common patterns:

- Tilt UI: 10102, 10301, 10350
- Backend: 3000, 8000
- Frontend: 3001
- Mastra: 4111, 14111, 10305
- Postgres: 10302
- Metabase: 10303

### Hot Reload Not Working

Tilt automatically watches files and reloads. If changes aren't applying:

1. Check Tilt UI for build errors
2. Verify file is in watched directory
3. Check resource logs for errors
4. Restart specific resource if needed (via Tilt UI)

## Project-Specific Examples

### genimg (Python + React)

```bash
tilt up --port 10102
tilt get uiresources --port 10102
tilt logs --port 10102 backend
tilt logs --port 10102 frontend
```

### gemimg-nodejs-version

```bash
tilt up --port 10350
curl http://localhost:3000/health
curl http://localhost:3001/
curl http://localhost:14111/swagger-ui
```

### ai-usage-analyzer

```bash
tilt up --port 10301
# Services: postgres, metabase, fake-data-api, mastra
tilt logs --port 10301 mastra
```
