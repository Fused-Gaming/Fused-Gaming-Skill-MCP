#!/bin/bash

##############################################################################
# Start All Orchestration Services
#
# Launches all services for the Fused Gaming MCP orchestration platform:
# - Web UI Dashboard (port 3333)
# - Metrics API (port 3334)
# - Optional: SyncPulse service integration
##############################################################################

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
UI_PORT="${WEB_UI_PORT:-3333}"
API_PORT="${API_PORT:-3334}"

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

cleanup() {
  log_info "Shutting down all services..."
  # Kill background processes
  if [[ -n "$UI_PID" ]]; then
    kill $UI_PID 2>/dev/null || true
  fi
  if [[ -n "$API_PID" ]]; then
    kill $API_PID 2>/dev/null || true
  fi
  log_success "All services stopped"
  exit 0
}

# Trap Ctrl+C to cleanup
trap cleanup SIGINT SIGTERM

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed"
  exit 1
fi

log_info "Starting Fused Gaming MCP Orchestration Services..."
echo ""

# Check if orchestration is initialized
if [[ ! -d "$PROJECT_ROOT/.claude-flow" ]]; then
  log_warning "Orchestration not initialized. Running initialization..."
  bash "$SCRIPT_DIR/install-orchestration.sh" balanced
  echo ""
fi

# Start the metrics API in background
log_info "Starting Metrics API (port $API_PORT)..."
bash "$SCRIPT_DIR/start-orchestration-api.sh" &
API_PID=$!
log_success "Metrics API started (PID: $API_PID)"

# Wait a moment for API to start
sleep 2

# Start the web UI in background
log_info "Starting Web UI Dashboard (port $UI_PORT)..."
bash "$SCRIPT_DIR/start-orchestration-ui.sh" &
UI_PID=$!
log_success "Web UI started (PID: $UI_PID)"

# Wait a moment for UI to start
sleep 2

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "All Services Running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Service Endpoints:"
echo "  📊 Orchestration Dashboard: ${BLUE}http://localhost:$UI_PORT${NC}"
echo "  📈 Metrics API:            ${BLUE}http://localhost:$API_PORT${NC}"
echo ""
echo "Key URLs:"
echo "  Health Check:              ${BLUE}http://localhost:$API_PORT/health${NC}"
echo "  System Metrics:            ${BLUE}http://localhost:$API_PORT/api/metrics${NC}"
echo "  Agent Health:              ${BLUE}http://localhost:$API_PORT/api/agents/health${NC}"
echo ""
echo "Configuration:"
echo "  Orchestration Dir:         $PROJECT_ROOT/.claude-flow"
echo "  UI Port:                   $UI_PORT"
echo "  API Port:                  $API_PORT"
echo ""
echo "Process IDs:"
echo "  Web UI PID:                $UI_PID"
echo "  Metrics API PID:           $API_PID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for background processes
wait
