#!/bin/bash

# Test endpoint availability and response time

URL="${1:-http://localhost:3000/status}"
TIMEOUT="${2:-5}"

echo "🧪 Testing Status Endpoint"
echo "=============================="
echo "URL: $URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

if ! command -v curl &> /dev/null; then
  echo "❌ curl not found"
  exit 1
fi

# Test connectivity
echo "Testing connectivity..."
if curl -s --max-time "$TIMEOUT" "$URL" > /tmp/response.json 2>/dev/null; then
  echo "✓ Endpoint reachable"

  # Check response format
  if command -v jq &> /dev/null; then
    if jq empty /tmp/response.json 2>/dev/null; then
      echo "✓ Valid JSON response"

      # Basic structure validation
      PROJECT=$(jq -r '.project.name // .project' /tmp/response.json 2>/dev/null)
      if [ -n "$PROJECT" ]; then
        echo "✓ Project field: $PROJECT"
      fi

      GATES=$(jq '.gates // [] | length' /tmp/response.json 2>/dev/null)
      echo "✓ Gates: $GATES"

      echo ""
      echo "✅ Endpoint is healthy"
      exit 0
    else
      echo "❌ Invalid JSON in response"
      cat /tmp/response.json
      exit 1
    fi
  else
    echo "⚠ jq not installed, skipping JSON validation"
    echo "Response size: $(wc -c < /tmp/response.json) bytes"
  fi
else
  echo "❌ Could not reach endpoint"
  echo "Ensure the status API is running and accessible at $URL"
  exit 1
fi
