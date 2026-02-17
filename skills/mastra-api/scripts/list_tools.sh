#!/bin/bash
# List all available tools in Mastra
# Usage: ./list_tools.sh [port]

PORT=${1:-4111}
BASE_URL="http://localhost:$PORT/api"

echo "🔧 Listing Mastra Tools"
echo "   API: $BASE_URL"
echo ""

RESPONSE=$(curl -sS "$BASE_URL/tools" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to Mastra API"
    echo "   Check that Mastra is running at $BASE_URL"
    exit 1
fi

# Check if empty
if [ -z "$RESPONSE" ] || [ "$RESPONSE" = "{}" ]; then
    echo "⚠️  No tools registered"
    exit 0
fi

echo "$RESPONSE" | jq -r 'to_entries[] | "\n📦 \(.key)\n   ID: \(.value.id)\n   Description: \(.value.description)\n   Input Schema: \(.value.inputSchema | fromjson.json.properties // {} | keys | join(", ") // "none")\n   Requires Approval: \(.value.requireApproval)"'

if [ $? -ne 0 ]; then
    echo "⚠️  Could not parse tool data. Raw response:"
    echo "$RESPONSE"
fi
