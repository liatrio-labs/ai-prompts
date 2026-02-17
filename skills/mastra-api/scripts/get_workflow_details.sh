#!/bin/bash
# Get detailed information about a specific workflow
# Usage: ./get_workflow_details.sh <workflow-name> [port]

WORKFLOW_NAME=${1}
PORT=${2:-4111}

if [ -z "$WORKFLOW_NAME" ]; then
    echo "Usage: $0 <workflow-name> [port]"
    echo ""
    echo "Example:"
    echo "  $0 weather-workflow"
    exit 1
fi

BASE_URL="http://localhost:$PORT/api"

echo "📊 Workflow Details: $WORKFLOW_NAME"
echo "   API: $BASE_URL"
echo ""

curl -sS "$BASE_URL/workflows/$WORKFLOW_NAME" 2>/dev/null | jq '.'

if [ $? -ne 0 ]; then
    echo "❌ Failed to get workflow details"
    echo "   Check that workflow exists and Mastra is running"
    exit 1
fi
