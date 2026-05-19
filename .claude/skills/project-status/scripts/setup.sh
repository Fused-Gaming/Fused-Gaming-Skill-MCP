#!/bin/bash

# Project Status API Framework - Setup Script
# Initializes dependencies and validates environment

set -e

echo "🚀 Project Status API Framework Setup"
echo "========================================"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required (current: $NODE_VERSION)"
  exit 1
fi
echo "✓ Node.js v$(node -v | cut -d'v' -f2) detected"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found"
  exit 1
fi
echo "✓ npm $(npm -v) detected"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✓ Dependencies installed"
else
  echo "✓ node_modules already exists"
fi

# Create configuration template if missing
if [ ! -f "config.json" ]; then
  echo "📝 Creating sample config.json..."
  cat > config.json << 'EOF'
{
  "project": "MyProject",
  "description": "Project description",
  "rfpNumber": "25-26-09",
  "deadline": "2026-05-22T15:00:00Z",
  "gates": [
    { "id": 0, "name": "Gate 0", "owner": "team", "criteria": [] },
    { "id": 1, "name": "Gate 1", "owner": "team", "criteria": [] },
    { "id": 2, "name": "Gate 2", "owner": "team", "criteria": [] },
    { "id": 3, "name": "Gate 3", "owner": "team", "criteria": [] },
    { "id": 4, "name": "Gate 4", "owner": "team", "criteria": [] },
    { "id": 5, "name": "Gate 5", "owner": "team", "criteria": [] }
  ],
  "metricsInterval": 5000,
  "cacheDuration": 30000,
  "enableMetrics": true,
  "storageType": "memory"
}
EOF
  echo "✓ config.json created"
fi

# Validate configuration
echo "🔍 Validating configuration..."
node scripts/validate-config.cjs config.json

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Review and edit config.json with your project settings"
echo "  2. Copy the template to your project:"
echo "     cp templates/basic-status.cjs your-project/status-server.cjs"
echo "  3. Install dependencies in your project and run:"
echo "     node your-project/status-server.cjs"
echo "  4. Access status endpoint at http://localhost:3000/status"
