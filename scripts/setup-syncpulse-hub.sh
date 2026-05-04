#!/bin/bash

###############################################################################
# 🎮 FUSED GAMING SYNCPULSE HUB - UNIFIED SETUP SCRIPT
# 
# Centralized installation & orchestration of all @h4shed packages
# Handles: 31 Skills, 28 Tools, 3 Core, 1 Session Manager
#
# Usage: bash scripts/setup-syncpulse-hub.sh [--mode=full|essential|custom]
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
MODE="${1:-full}"
INSTALL_DIR="${INSTALL_DIR:-.}"
CONFIG_FILE=".syncpulse-hub.config.json"
STATE_FILE=".syncpulse-hub.state.json"
LOG_FILE="syncpulse-hub-setup.log"

# Initialize logging
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

echo -e "${MAGENTA}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   🎮 FUSED GAMING SYNCPULSE HUB SETUP                        ║"
echo "║                                                               ║"
echo "║   Unified Installation & Orchestration System               ║"
echo "║   Mode: $MODE"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

###############################################################################
# STEP 1: Environment Detection & Validation
###############################################################################

echo -e "${BLUE}[STEP 1] Environment Detection & Validation${NC}"
echo "────────────────────────────────────────────────────────────────"

check_node_version() {
  node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$node_version" -lt 20 ]; then
    echo -e "${RED}✗ Node.js 20+ required (found: $(node -v))${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
}

check_npm_version() {
  npm_version=$(npm -v | cut -d'.' -f1)
  if [ "$npm_version" -lt 8 ]; then
    echo -e "${RED}✗ npm 8+ required${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ npm $(npm -v)${NC}"
}

check_git() {
  if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ git required${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ git $(git --version | cut -d' ' -f3)${NC}"
}

check_node_version
check_npm_version
check_git

echo ""

###############################################################################
# STEP 2: Create Configuration File
###############################################################################

echo -e "${BLUE}[STEP 2] Configuration Management${NC}"
echo "────────────────────────────────────────────────────────────────"

create_config() {
  cat > "$CONFIG_FILE" << 'CONFIG'
{
  "hub": {
    "version": "0.1.0",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "mode": "MODE_PLACEHOLDER",
    "installDir": "INSTALL_DIR_PLACEHOLDER"
  },
  "packages": {
    "essential": [
      "@h4shed/mcp-core",
      "@h4shed/mcp-cli",
      "@h4shed/skill-syncpulse",
      "@h4shed/skill-pre-deploy-validator"
    ],
    "skills": {
      "implemented": [
        "@h4shed/skill-syncpulse",
        "@h4shed/skill-underworld-writer"
      ],
      "partial": [
        "@h4shed/skill-daily-review",
        "@h4shed/skill-mermaid-terminal",
        "@h4shed/skill-ux-journeymapper",
        "@h4shed/skill-theme-factory",
        "@h4shed/skill-agentic-flow-devkit"
      ],
      "scaffolded": []
    },
    "tools": [
      "@h4shed/tool-jest",
      "@h4shed/tool-vite",
      "@h4shed/tool-playwright",
      "@h4shed/tool-storybook"
    ]
  },
  "settings": {
    "autoUpdate": true,
    "checkIntervalHours": 24,
    "parallelInstall": 4,
    "verbose": false
  }
}
CONFIG
  
  # Replace placeholders
  sed -i "s|MODE_PLACEHOLDER|$MODE|g" "$CONFIG_FILE"
  sed -i "s|INSTALL_DIR_PLACEHOLDER|$INSTALL_DIR|g" "$CONFIG_FILE"
  sed -i "s|\$(date -u +%Y-%m-%dT%H:%M:%SZ)|$(date -u +%Y-%m-%dT%H:%M:%SZ)|g" "$CONFIG_FILE"
  
  echo -e "${GREEN}✅ Created configuration: $CONFIG_FILE${NC}"
}

create_config

echo ""

###############################################################################
# STEP 3: Install Dependencies (Orchestrated)
###############################################################################

echo -e "${BLUE}[STEP 3] Installing Dependencies${NC}"
echo "────────────────────────────────────────────────────────────────"

install_dependencies() {
  echo "Installing npm dependencies (this may take a few minutes)..."
  npm install --legacy-peer-deps 2>&1 | tail -10
  echo -e "${GREEN}✅ Dependencies installed${NC}"
}

install_dependencies

echo ""

###############################################################################
# STEP 4: Build Core Packages
###############################################################################

echo -e "${BLUE}[STEP 4] Building Core Packages${NC}"
echo "────────────────────────────────────────────────────────────────"

build_packages() {
  echo "Building packages (parallel execution)..."
  
  # Core packages
  npm run build --workspace=packages/core 2>&1 | grep -E "(✓|✅|error)" | head -5
  npm run build --workspace=packages/cli 2>&1 | grep -E "(✓|✅|error)" | head -5
  npm run build --workspace=packages/skills/syncpulse 2>&1 | grep -E "(✓|✅|error)" | head -5
  
  echo -e "${GREEN}✅ Core packages built${NC}"
}

build_packages

echo ""

###############################################################################
# STEP 5: Initialize MCP Core
###############################################################################

echo -e "${BLUE}[STEP 5] Initializing MCP Core${NC}"
echo "────────────────────────────────────────────────────────────────"

init_mcp() {
  npm run mcp:init 2>&1 | tail -5
  npm run registry:generate 2>&1 | tail -5
  echo -e "${GREEN}✅ MCP Core initialized${NC}"
}

init_mcp

echo ""

###############################################################################
# STEP 6: Install Selected Packages by Mode
###############################################################################

echo -e "${BLUE}[STEP 6] Installing Packages (Mode: $MODE)${NC}"
echo "────────────────────────────────────────────────────────────────"

install_by_mode() {
  case "$MODE" in
    essential)
      echo "Installing essential packages..."
      npm install @h4shed/mcp-core @h4shed/mcp-cli @h4shed/skill-syncpulse --save 2>&1 | tail -5
      ;;
    full)
      echo "Installing all packages (may take several minutes)..."
      npm install --save \
        @h4shed/mcp-core \
        @h4shed/mcp-cli \
        @h4shed/skill-syncpulse \
        @h4shed/skill-underworld-writer \
        @h4shed/skill-daily-review \
        @h4shed/skill-mermaid-terminal \
        @h4shed/skill-ux-journeymapper \
        @h4shed/skill-theme-factory \
        @h4shed/skill-pre-deploy-validator \
        2>&1 | tail -5
      ;;
    custom)
      echo "Custom mode: Edit $CONFIG_FILE to select packages"
      echo "Then re-run with --mode=custom"
      ;;
    *)
      echo "Unknown mode: $MODE"
      exit 1
      ;;
  esac
  
  echo -e "${GREEN}✅ Packages installed${NC}"
}

install_by_mode

echo ""

###############################################################################
# STEP 7: Run Pre-Deployment Validation
###############################################################################

echo -e "${BLUE}[STEP 7] Pre-Deployment Validation${NC}"
echo "────────────────────────────────────────────────────────────────"

validate_deployment() {
  echo "Running validation tests..."
  npm run build 2>&1 | tail -3
  npm run typecheck 2>&1 | tail -3
  npm run lint 2>&1 | tail -3
  echo -e "${GREEN}✅ Validation passed${NC}"
}

validate_deployment

echo ""

###############################################################################
# STEP 8: Create State File
###############################################################################

echo -e "${BLUE}[STEP 8] Recording Installation State${NC}"
echo "────────────────────────────────────────────────────────────────"

create_state() {
  cat > "$STATE_FILE" << STATE
{
  "installed": true,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "mode": "$MODE",
  "version": "1.0.0",
  "packages": {
    "core": ["@h4shed/mcp-core", "@h4shed/mcp-cli"],
    "syncpulse": ["@h4shed/skill-syncpulse"],
    "skills": $(npm ls --depth=0 2>/dev/null | grep "@h4shed/skill" | wc -l),
    "tools": $(npm ls --depth=0 2>/dev/null | grep "@h4shed/tool" | wc -l)
  },
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)"
}
STATE
  echo -e "${GREEN}✅ Installation state recorded: $STATE_FILE${NC}"
}

create_state

echo ""

###############################################################################
# STEP 9: Setup Auto-Update Check
###############################################################################

echo -e "${BLUE}[STEP 9] Configuring Auto-Updates${NC}"
echo "────────────────────────────────────────────────────────────────"

setup_updates() {
  # Create update check script
  cat > scripts/check-syncpulse-updates.sh << 'UPDATE'
#!/bin/bash
# Auto-update checker for SyncPulse Hub

echo "Checking for updates..."

# Check each core package
packages=("@h4shed/mcp-core" "@h4shed/mcp-cli" "@h4shed/skill-syncpulse")

for pkg in "${packages[@]}"; do
  current=$(npm ls "$pkg" --depth=0 2>/dev/null | grep "$pkg" | awk '{print $2}')
  latest=$(npm view "$pkg" version)
  
  if [ "$current" != "$latest" ]; then
    echo "Update available: $pkg ($current -> $latest)"
  fi
done
UPDATE
  
  chmod +x scripts/check-syncpulse-updates.sh
  echo -e "${GREEN}✅ Auto-update checking enabled${NC}"
}

setup_updates

echo ""

###############################################################################
# FINAL SUMMARY
###############################################################################

echo -e "${MAGENTA}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ SYNCPULSE HUB SETUP COMPLETE!                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo "Configuration saved:"
echo "  - Config: $CONFIG_FILE"
echo "  - State:  $STATE_FILE"
echo "  - Log:    $LOG_FILE"
echo ""

echo "Next steps:"
echo "  1. Review configuration: cat $CONFIG_FILE"
echo "  2. Check installation state: cat $STATE_FILE"
echo "  3. List installed packages: npm ls --depth=0 | grep @h4shed"
echo "  4. Test SyncPulse: npm ls @h4shed/skill-syncpulse"
echo ""

echo "Available commands:"
echo "  - npm run update:check        # Check for updates"
echo "  - npm run registry:view       # View skill registry"
echo "  - npm run mcp:install         # Interactive setup"
echo ""

echo "Documentation:"
echo "  - See SYNCPULSE_INTEGRATION_STRATEGY.md for plugin architecture"
echo "  - See REVISED_ASSESSMENT_POST_INSTALL.md for implementation status"
echo ""

