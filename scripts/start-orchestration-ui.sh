#!/bin/bash

##############################################################################
# Start Orchestration Web UI
#
# Launches the Claude Flow v3alpha orchestration dashboard with
# integrated ethical hacking framework UI panel
##############################################################################

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
UI_PORT="${WEB_UI_PORT:-3333}"

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

log_info "Starting Orchestration Web UI..."
log_info "Port: $UI_PORT"
log_info "Dashboard: http://localhost:$UI_PORT"

# Check if .claude-flow exists
if [[ ! -d "$PROJECT_ROOT/.claude-flow" ]]; then
  echo -e "${YELLOW}[WARN]${NC} Orchestration not initialized. Running initialization..."
  bash "$SCRIPT_DIR/install-orchestration.sh" balanced
fi

# Start the web UI development server
log_info "Launching dashboard server..."

cd "$PROJECT_ROOT"

# Start a simple HTTP server to serve the UI
# This is a placeholder - in production, you'd use a proper build tool like Vite
cat > /tmp/orchestration-server.js << 'EOJS'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.WEB_UI_PORT || 3333;
const projectRoot = process.argv[2];

const mimeTypes = {
  '.js': 'text/javascript',
  '.ts': 'text/typescript',
  '.tsx': 'text/typescript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

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

  // API endpoints
  if (req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      chartData: [],
      agents: [],
      status: 'healthy',
    }));
    return;
  }

  if (req.url === '/api/engagements') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ engagements: [] }));
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'orchestration-ui',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(projectRoot, 'src/orchestration-ui', filePath);

  // Prevent directory traversal
  const realPath = path.resolve(filePath);
  const baseDir = path.resolve(path.join(projectRoot, 'src/orchestration-ui'));
  if (!realPath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`✓ Orchestration Web UI Server Running`);
  console.log(`${'━'.repeat(60)}`);
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`Metrics API: http://localhost:3334`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
EOJS

# Use node to run the server
node /tmp/orchestration-server.js "$PROJECT_ROOT"
