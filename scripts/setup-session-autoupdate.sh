#!/bin/bash

# SyncPulse Hub Session Auto-Update Setup
# Installs hooks to check for package updates on new Claude sessions
# Usage: bash scripts/setup-session-autoupdate.sh

set -e

SYNCPULSE_CONFIG="$HOME/.syncpulse-hub"
SESSION_HOOK="$SYNCPULSE_CONFIG/session-hook.sh"
STATE_FILE="$SYNCPULSE_CONFIG/.state.json"

# Create config directory
mkdir -p "$SYNCPULSE_CONFIG"

# Create session auto-update hook
cat > "$SESSION_HOOK" << 'HOOK_EOF'
#!/bin/bash

# SyncPulse Hub Session Auto-Update Check
# Automatically runs on session start if enabled

CONFIG_FILE="${HOME}/.syncpulse-hub/.autoupdate.json"

# Check if auto-update is enabled
if [ ! -f "$CONFIG_FILE" ]; then
  exit 0
fi

ENABLED=$(cat "$CONFIG_FILE" 2>/dev/null | grep -o '"enabled":"true"' || echo "")
if [ -z "$ENABLED" ]; then
  exit 0
fi

# Get installation state
STATE_FILE="${HOME}/.syncpulse-hub/.state.json"
if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

# Check for updates
SYNCPULSE_PKG=$(npm list @h4shed/syncpulse-hub 2>/dev/null | grep @h4shed/syncpulse-hub | head -1 || echo "")
if [ -z "$SYNCPULSE_PKG" ]; then
  exit 0
fi

# Compare versions using npm view
CURRENT_VERSION=$(echo "$SYNCPULSE_PKG" | grep -oP '\K[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "0.0.0")
LATEST_VERSION=$(npm view @h4shed/syncpulse-hub version 2>/dev/null || echo "")

# If no latest version found, skip
if [ -z "$LATEST_VERSION" ]; then
  exit 0
fi

# Compare versions (simple semantic version check)
if [ "$LATEST_VERSION" != "$CURRENT_VERSION" ]; then
  echo ""
  echo "═════════════════════════════════════════════════════════════════"
  echo "[UPDATE] SyncPulse Hub Updates Available"
  echo "═════════════════════════════════════════════════════════════════"
  echo ""
  echo "Current version: $CURRENT_VERSION"
  echo "Latest version: $LATEST_VERSION"
  echo ""
  echo "To update all packages:"
  echo "  npm install @h4shed/syncpulse-hub@latest"
  echo "  npm run syncpulse:hub:check-updates"
  echo ""
fi

HOOK_EOF

chmod +x "$SESSION_HOOK"

# Create auto-update configuration
cat > "$SYNCPULSE_CONFIG/.autoupdate.json" << 'CONFIG_EOF'
{
  "enabled": true,
  "checkOnSessionStart": true,
  "notifyOnUpdates": true,
  "autoUploadAvailable": false,
  "lastCheck": null,
  "checkInterval": 86400,
  "severityFilter": ["critical", "major"]
}
CONFIG_EOF

# Create state file if not exists
if [ ! -f "$STATE_FILE" ]; then
  cat > "$STATE_FILE" << 'STATE_EOF'
{
  "installed": false,
  "installedAt": null,
  "installMode": "full",
  "lastUpdatedAt": null,
  "updateCount": 0,
  "packages": []
}
STATE_EOF
fi

echo "✅ Session auto-update setup complete"
echo "   Location: $SYNCPULSE_CONFIG"
echo "   Hook: $SESSION_HOOK"
echo "   Config: $SYNCPULSE_CONFIG/.autoupdate.json"
echo ""
echo "Auto-update checking is now enabled for new Claude sessions."
echo "To disable: Edit $SYNCPULSE_CONFIG/.autoupdate.json and set enabled: false"
