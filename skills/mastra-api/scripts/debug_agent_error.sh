#!/bin/bash
# Debug errors in the most recent agent conversation
# Usage: ./debug_agent_error.sh <agent-id> [port]

AGENT_ID=${1}
PORT=${2:-4111}

if [ -z "$AGENT_ID" ]; then
    echo "Usage: $0 <agent-id> [port]"
    echo ""
    echo "Example:"
    echo "  $0 metabase-agent"
    exit 1
fi

BASE_URL="http://localhost:$PORT/api"

echo "🔍 Debugging latest conversation for: $AGENT_ID"
echo ""

# Get latest thread
THREAD_RESPONSE=$(curl --globoff -sS \
  "$BASE_URL/memory/threads?page=0&perPage=1&agentId=$AGENT_ID&orderBy[field]=updatedAt&orderBy[direction]=DESC" \
  2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to Mastra API at $BASE_URL"
    exit 1
fi

THREAD_ID=$(echo "$THREAD_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$THREAD_ID" ]; then
    echo "❌ No threads found for agent: $AGENT_ID"
    exit 1
fi

echo "📝 Thread: $THREAD_ID"
echo ""

# Get messages
MESSAGES=$(curl --globoff -sS \
  "$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC")

# Look for errors in messages
echo "🔎 Checking for errors..."
echo ""

ERROR_COUNT=$(echo "$MESSAGES" | grep -o '"error"' | wc -l)
FAILURE_COUNT=$(echo "$MESSAGES" | grep -o '"failed"' | wc -l)

if [ "$ERROR_COUNT" -gt 0 ] || [ "$FAILURE_COUNT" -gt 0 ]; then
    echo "⚠️  Found potential errors in conversation"
    echo "   Errors: $ERROR_COUNT"
    echo "   Failures: $FAILURE_COUNT"
    echo ""
    echo "💡 Full message data:"
    echo "$MESSAGES" | python3 -m json.tool 2>/dev/null || echo "$MESSAGES"
else
    echo "✅ No obvious errors found in recent messages"
    echo ""
    echo "💡 To see all messages:"
    echo "   curl --globoff -sS \"$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC\" | python3 -m json.tool"
fi
