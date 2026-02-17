#!/bin/bash
# List all available workflows in Mastra
# Usage: ./list_workflows.sh [port]

PORT=${1:-4111}
BASE_URL="http://localhost:$PORT/api"

echo "⚙️  Listing Mastra Workflows"
echo "   API: $BASE_URL"
echo ""

RESPONSE=$(curl -sS "$BASE_URL/workflows" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to Mastra API"
    echo "   Check that Mastra is running at $BASE_URL"
    exit 1
fi

# Check if empty
if [ -z "$RESPONSE" ] || [ "$RESPONSE" = "{}" ]; then
    echo "⚠️  No workflows registered"
    exit 0
fi

echo "$RESPONSE" | jq -r 'to_entries[] | "\n📊 \(.key)\n   Name: \(.value.name)\n   Steps: \(.value.steps | keys | join(" → "))\n   Input Schema: \(.value.inputSchema | fromjson.json.properties // {} | keys | join(", ") // "none")"'

if [ $? -ne 0 ]; then
    echo "⚠️  Could not parse workflow data. Raw response:"
    echo "$RESPONSE"
fi
