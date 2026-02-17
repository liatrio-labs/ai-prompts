#!/bin/bash
# Get runs for a specific workflow
# Usage: ./get_workflow_runs.sh <workflow-name> [port] [page] [perPage]

WORKFLOW_NAME=${1}
PORT=${2:-4111}
PAGE=${3:-0}
PER_PAGE=${4:-10}

if [ -z "$WORKFLOW_NAME" ]; then
    echo "Usage: $0 <workflow-name> [port] [page] [perPage]"
    echo ""
    echo "Examples:"
    echo "  $0 weather-workflow"
    echo "  $0 weather-workflow 4111 0 5"
    exit 1
fi

BASE_URL="http://localhost:$PORT/api"

echo "🏃 Workflow Runs: $WORKFLOW_NAME"
echo "   API: $BASE_URL"
echo "   Page: $PAGE, PerPage: $PER_PAGE"
echo ""

RESPONSE=$(curl -sS "$BASE_URL/workflows/$WORKFLOW_NAME/runs?page=$PAGE&perPage=$PER_PAGE" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Failed to get workflow runs"
    exit 1
fi

echo "$RESPONSE" | jq '.'

# Show summary
TOTAL=$(echo "$RESPONSE" | jq -r '.total // 0')
RUN_COUNT=$(echo "$RESPONSE" | jq -r '.runs | length')

echo ""
echo "📈 Summary: $RUN_COUNT run(s) shown, $TOTAL total"
