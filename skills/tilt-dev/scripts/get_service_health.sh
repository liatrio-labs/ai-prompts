#!/bin/bash
# Check health endpoints for common services
# Usage: ./get_service_health.sh

echo "🏥 Checking Service Health..."
echo ""

# Backend
echo "Backend (port 3000):"
if curl -sSf --max-time 2 http://localhost:3000/health > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unreachable or unhealthy"
fi

# Frontend
echo "Frontend (port 3001):"
if curl -sSf --max-time 2 http://localhost:3001/ > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unreachable or unhealthy"
fi

# Mastra dev server
echo "Mastra (port 4111 or 14111):"
MASTRA_PORT=4111
MASTRA_HEALTHY=0
if curl -sSf --max-time 2 "http://localhost:$MASTRA_PORT/swagger-ui" > /dev/null; then
    MASTRA_HEALTHY=1
else
    MASTRA_PORT=14111
    if curl -sSf --max-time 2 "http://localhost:$MASTRA_PORT/swagger-ui" > /dev/null; then
        MASTRA_HEALTHY=1
    fi
fi

if [ "$MASTRA_HEALTHY" -eq 1 ]; then
    echo "  ✅ Healthy (port $MASTRA_PORT)"
    echo "     Swagger: http://localhost:$MASTRA_PORT/swagger-ui"
else
    echo "  ❌ Unreachable or unhealthy"
fi

echo ""
echo "💡 Tip: Use 'tilt logs --port <PORT> <resource>' to view logs"
