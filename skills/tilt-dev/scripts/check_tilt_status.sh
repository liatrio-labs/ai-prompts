#!/bin/bash
# Check Tilt status and list all resources
# Usage: ./check_tilt_status.sh [port]

PORT=${1:-10350}

echo "🔍 Checking Tilt status on port $PORT..."
echo ""

# Check if Tilt is running
if ! pgrep -f "tilt.*--port.*$PORT" > /dev/null; then
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
