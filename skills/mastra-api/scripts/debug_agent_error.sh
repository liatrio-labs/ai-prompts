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
THREAD_RESPONSE=$(curl --globoff -f -sS \
  "$BASE_URL/memory/threads?page=0&perPage=1&agentId=$AGENT_ID&orderBy[field]=updatedAt&orderBy[direction]=DESC") || {
    echo "❌ Failed to connect to Mastra API at $BASE_URL"
    exit 1
}

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

echo "📝 Thread: $THREAD_ID"
echo ""

# Get messages
MESSAGES=$(curl --globoff -f -sS \
  "$BASE_URL/memory/threads/$THREAD_ID/messages?page=0&perPage=50&agentId=$AGENT_ID&orderBy[field]=createdAt&orderBy[direction]=DESC") || {
    echo "❌ Failed to fetch thread messages for: $THREAD_ID"
    exit 1
}

# Look for errors in messages
echo "🔎 Checking for errors..."
echo ""

ERROR_COUNT=$(echo "$MESSAGES" | jq -r '
    def msgs:
      if type == "array" then .
      elif (.messages? | type == "array") then .messages
      elif (.data? | type == "array") then .data
      else []
      end;
    [msgs[]? |
      (
        ((.level // .type // .severity // "" | ascii_downcase) == "error")
        or (.error? != null and .error != false)
      )
    ] | map(select(.)) | length
' 2>/dev/null)
FAILURE_COUNT=$(echo "$MESSAGES" | jq -r '
    def msgs:
      if type == "array" then .
      elif (.messages? | type == "array") then .messages
      elif (.data? | type == "array") then .data
      else []
      end;
    [msgs[]? | ((.status // .state // "" | ascii_downcase) == "failed")] | map(select(.)) | length
' 2>/dev/null)

ERROR_COUNT=${ERROR_COUNT:-0}
FAILURE_COUNT=${FAILURE_COUNT:-0}

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
