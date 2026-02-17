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
THREAD_RESPONSE=$(curl --globoff -sS \
  "$BASE_URL/memory/threads?page=0&perPage=1&agentId=$AGENT_ID&orderBy[field]=updatedAt&orderBy[direction]=DESC" \
  2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to Mastra API"
    echo "   Check that Mastra is running at $BASE_URL"
    exit 1
fi

# Extract thread ID (using basic JSON parsing)
THREAD_ID=$(echo "$THREAD_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$THREAD_ID" ]; then
    echo "❌ No threads found for agent: $AGENT_ID"
    exit 1
fi

echo "✅ Latest thread: $THREAD_ID"
echo ""

if [ "$DETAILED" = "true" ]; then
    echo "📝 Fetching messages..."
    echo ""

    MESSAGES=$(curl --globoff -sS \
      "$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC")

    echo "$MESSAGES" | python3 -m json.tool 2>/dev/null || echo "$MESSAGES"
else
    echo "💡 To see messages, run:"
    echo "   curl --globoff -sS \"$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC\" | python3 -m json.tool"
fi
