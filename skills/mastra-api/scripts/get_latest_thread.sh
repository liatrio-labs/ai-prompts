#!/bin/bash
# Get the latest conversation thread for a Mastra agent
# Usage: ./get_latest_thread.sh <agent-id> [port] [detailed]

AGENT_ID=${1}
PORT=${2:-4111}
DETAILED=${3:-false}

if [ -z "$AGENT_ID" ]; then
    echo "Usage: $0 <agent-id> [port] [detailed]"
    echo ""
    echo "Examples:"
    echo "  $0 metabase-agent"
    echo "  $0 metabase-agent 10305"
    echo "  $0 metabase-agent 4111 true"
    exit 1
fi

BASE_URL="http://localhost:$PORT/api"

if ! command -v jq >/dev/null 2>&1; then
    echo "❌ jq is required but not installed."
    echo "   Install jq and retry."
    exit 1
fi

echo "🔍 Fetching latest thread for agent: $AGENT_ID"
echo "   API: $BASE_URL"
echo ""

# Get latest thread
THREAD_RESPONSE=$(curl --globoff -f -sS --get \
  --data-urlencode "page=0" \
  --data-urlencode "perPage=1" \
  --data-urlencode "agentId=$AGENT_ID" \
  --data-urlencode "orderBy[field]=updatedAt" \
  --data-urlencode "orderBy[direction]=DESC" \
  "$BASE_URL/memory/threads") || {
    echo "❌ Failed to connect to Mastra API"
    echo "   Check that Mastra is running at $BASE_URL"
    exit 1
}

if ! jq -e '.' >/dev/null 2>&1 <<<"$THREAD_RESPONSE"; then
    echo "❌ Unexpected non-JSON THREAD_RESPONSE from Mastra API"
    exit 1
fi

# Extract thread ID
THREAD_ID=$(jq -r '
    if type == "array" then .[0].id // empty
    elif (.threads? | type == "array") then .threads[0].id // empty
    elif (.data? | type == "array") then .data[0].id // empty
    else .id // empty
    end
' <<<"$THREAD_RESPONSE")

if [ -z "$THREAD_ID" ]; then
    echo "❌ No threads found for agent: $AGENT_ID"
    exit 1
fi

echo "✅ Latest thread: $THREAD_ID"
echo ""

if [ "$DETAILED" = "true" ]; then
    echo "📝 Fetching messages..."
    echo ""

    MESSAGES=$(curl --globoff -f -sS --get \
      --data-urlencode "page=0" \
      --data-urlencode "perPage=50" \
      --data-urlencode "agentId=$AGENT_ID" \
      --data-urlencode "orderBy[field]=createdAt" \
      --data-urlencode "orderBy[direction]=DESC" \
      "$BASE_URL/memory/threads/$THREAD_ID/messages") || {
        echo "❌ Failed to fetch messages for thread: $THREAD_ID"
        exit 1
    }

    echo "$MESSAGES" | python3 -m json.tool 2>/dev/null || echo "$MESSAGES"
else
    echo "💡 To see messages, run:"
    echo "   curl --globoff -sS --get \"$BASE_URL/memory/threads/$THREAD_ID/messages\" --data-urlencode \"page=0\" --data-urlencode \"perPage=50\" --data-urlencode \"agentId=$AGENT_ID\" --data-urlencode \"orderBy[field]=createdAt\" --data-urlencode \"orderBy[direction]=DESC\" | python3 -m json.tool"
fi
