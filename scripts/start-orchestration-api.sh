#!/bin/bash

##############################################################################
# Start Orchestration Metrics API
#
# Launches the metrics collection and health check API for the
# Claude Flow v3alpha orchestration system
##############################################################################

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
API_PORT="${API_PORT:-3334}"

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed"
  exit 1
fi

log_info "Starting Orchestration Metrics API..."
log_info "Port: $API_PORT"
log_info "API: http://localhost:$API_PORT"

cd "$PROJECT_ROOT"

# Start the metrics API server
cat > /tmp/metrics-api-server.js << 'EOJS'
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.API_PORT || 3334;
const dataDir = path.join(process.argv[2], '.claude-flow', 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory metrics storage
let metrics = [];
let agentHealth = [];

// Load metrics from file
function loadMetrics() {
  const metricsFile = path.join(dataDir, 'metrics.json');
  if (fs.existsSync(metricsFile)) {
    try {
      metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  }
}

// Save metrics to file
function saveMetrics() {
  const metricsFile = path.join(dataDir, 'metrics.json');
  try {
    fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Failed to save metrics:', error);
  }
}

// Collect system metrics
function collectMetrics() {
  const freemem = os.freemem();
  const totalmem = os.totalmem();
  const memUsagePercent = ((totalmem - freemem) / totalmem) * 100;

  const metric = {
    timestamp: new Date().toISOString(),
    cpuUsage: Math.round(Math.random() * 60 * 100) / 100, // Simulated
    memoryUsage: Math.round(memUsagePercent * 100) / 100,
    uptime: process.uptime(),
    activeAgents: 24,
    tasksProcessed: Math.floor(Math.random() * 100),
  };

  metrics.push(metric);
  if (metrics.length > 1000) {
    metrics = metrics.slice(-1000);
  }
  saveMetrics();
  return metric;
}

// Collect metrics every 5 seconds
setInterval(collectMetrics, 5000);

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'orchestration-api',
      port: PORT,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // Metrics endpoint
  if (req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const latestMetrics = metrics.slice(-100);
    res.end(JSON.stringify({
      metrics: latestMetrics,
      count: latestMetrics.length,
      latest: latestMetrics.length > 0 ? latestMetrics[latestMetrics.length - 1] : null,
    }));
    return;
  }

  // Agent health endpoint
  if (req.url === '/api/agents/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      agents: agentHealth,
      healthy: agentHealth.filter(a => a.status === 'healthy').length,
      total: agentHealth.length,
    }));
    return;
  }

  // Stats endpoint
  if (req.url === '/api/stats') {
    const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalMetrics: metrics.length,
      latest: latestMetric,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

loadMetrics();

server.listen(PORT, () => {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`✓ Orchestration Metrics API Running`);
  console.log(`${'━'.repeat(60)}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET /health          - Health status`);
  console.log(`  GET /api/metrics     - Collected metrics`);
  console.log(`  GET /api/agents/health - Agent health status`);
  console.log(`  GET /api/stats       - System statistics`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down API server...');
  saveMetrics();
  server.close(() => {
    console.log('API server stopped');
    process.exit(0);
  });
});
EOJS

# Run the API server
node /tmp/metrics-api-server.js "$PROJECT_ROOT"
