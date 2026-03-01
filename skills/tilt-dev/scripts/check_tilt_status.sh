#!/bin/bash
# Check Tilt status and list all resources
# Usage: ./check_tilt_status.sh [port]

PORT=${1:-10350}

echo "🔍 Checking Tilt status on port $PORT..."
echo ""

# Check if Tilt API is reachable on the target port
if ! curl -s --max-time 2 "http://localhost:$PORT/api/view" > /dev/null 2>&1; then
    echo "❌ Tilt does not appear to be running on port $PORT"
    echo ""
    echo "To start Tilt:"
    echo "  tilt up --port $PORT"
    exit 1
fi

echo "✅ Tilt is running on port $PORT"
echo "   UI: http://localhost:$PORT"
echo ""

# Get resource status
echo "📊 Resource Status:"
echo ""
tilt get uiresources --port "$PORT" 2>/dev/null || {
    echo "⚠️  Could not retrieve resource status"
    exit 1
}
