#!/bin/bash
# Check health endpoints for common services
# Usage: ./get_service_health.sh

echo "🏥 Checking Service Health..."
echo ""

# Backend
echo "Backend (port 3000):"
if curl -s --max-time 2 http://localhost:3000/health > /dev/null 2>&1; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unreachable or unhealthy"
fi

# Frontend
echo "Frontend (port 3001):"
if curl -s --max-time 2 http://localhost:3001/ > /dev/null 2>&1; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unreachable or unhealthy"
fi

# Mastra dev server
echo "Mastra (port 4111 or 14111):"
MASTRA_PORT=4111
if ! curl -s --max-time 2 http://localhost:$MASTRA_PORT/swagger-ui > /dev/null 2>&1; then
    MASTRA_PORT=14111
fi

if curl -s --max-time 2 http://localhost:$MASTRA_PORT/swagger-ui > /dev/null 2>&1; then
    echo "  ✅ Healthy (port $MASTRA_PORT)"
    echo "     Swagger: http://localhost:$MASTRA_PORT/swagger-ui"
else
    echo "  ❌ Unreachable or unhealthy"
fi

echo ""
echo "💡 Tip: Use 'tilt logs --port <PORT> <resource>' to view logs"
