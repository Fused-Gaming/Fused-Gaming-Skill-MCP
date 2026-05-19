#!/bin/bash

# Project Status Monitoring Dashboard
# Real-time status endpoint monitoring with auto-refresh

BASE_URL="${1:-http://localhost:3000}"
INTERVAL="${2:-2}"

clear

while true; do
  clear
  echo "📊 Project Status Dashboard"
  echo "=========================================="
  echo "URL: $BASE_URL/status"
  echo "Interval: ${INTERVAL}s | Updated: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "=========================================="
  echo ""

  # Fetch status
  if command -v curl &> /dev/null; then
    if curl -s "$BASE_URL/status" > /tmp/status.json 2>/dev/null; then
      if command -v jq &> /dev/null; then
        # Pretty-print with jq
        cat /tmp/status.json | jq '.'
      else
        # Fallback to raw output
        cat /tmp/status.json
      fi
    else
      echo "❌ Failed to reach $BASE_URL"
      echo "Retrying in ${INTERVAL}s..."
    fi
  else
    echo "❌ curl not found. Install curl to use this monitor."
    exit 1
  fi

  echo ""
  echo "Press Ctrl+C to stop monitoring"
  sleep "$INTERVAL"
done
