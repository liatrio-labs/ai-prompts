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

echo "🔍 Fetching latest thread for agent: $AGENT_ID"
echo "   API: $BASE_URL"
echo ""

# Get latest thread
THREAD_RESPONSE=$(curl --globoff -f -sS \
  "$BASE_URL/memory/threads?page=0&perPage=1&agentId=$AGENT_ID&orderBy[field]=updatedAt&orderBy[direction]=DESC") || {
    echo "❌ Failed to connect to Mastra API"
    echo "   Check that Mastra is running at $BASE_URL"
    exit 1
}

# Extract thread ID
THREAD_ID=$(echo "$THREAD_RESPONSE" | jq -r '
    if type == "array" then .[0].id // empty
    elif (.threads? | type == "array") then .threads[0].id // empty
    elif (.data? | type == "array") then .data[0].id // empty
    else .id // empty
    end
')

if [ -z "$THREAD_ID" ]; then
    echo "❌ No threads found for agent: $AGENT_ID"
    exit 1
fi

echo "✅ Latest thread: $THREAD_ID"
echo ""

if [ "$DETAILED" = "true" ]; then
    echo "📝 Fetching messages..."
    echo ""

    MESSAGES=$(curl --globoff -f -sS \
      "$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC") || {
        echo "❌ Failed to fetch messages for thread: $THREAD_ID"
        exit 1
    }

    echo "$MESSAGES" | python3 -m json.tool 2>/dev/null || echo "$MESSAGES"
else
    echo "💡 To see messages, run:"
    echo "   curl --globoff -sS \"$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC\" | python3 -m json.tool"
fi
