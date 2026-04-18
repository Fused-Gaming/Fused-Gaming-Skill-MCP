#!/bin/bash

##############################################################################
# Fused Gaming MCP - Claude Flow v3alpha Orchestration Installer
#
# This script:
# 1. Detects system resources (CPU, memory, disk)
# 2. Validates Node.js/npm prerequisites
# 3. Initializes .claude-flow directory structure
# 4. Auto-configures agent topology based on system capacity
# 5. Launches the web UI dashboard for swarm orchestration
#
# Usage: bash scripts/install-orchestration.sh [--topology simple|balanced|advanced]
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLAUDE_FLOW_DIR="$PROJECT_ROOT/.claude-flow"
WEB_UI_PORT="${WEB_UI_PORT:-3333}"
API_PORT="${API_PORT:-3334}"
TOPOLOGY_MODE="${1:-auto}"

##############################################################################
# Utility Functions
##############################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

spinner() {
  local pid=$!
  local delay=0.1
  local spinner=( '⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏' )

  while kill -0 $pid 2>/dev/null; do
    for i in "${spinner[@]}"; do
      echo -ne "\r$i"
      sleep $delay
    done
  done
  echo -ne "\r"
}

##############################################################################
# System Detection
##############################################################################

detect_system_resources() {
  log_info "Detecting system resources..."

  # Detect CPU count
  if [[ "$OSTYPE" == "darwin"* ]]; then
    CPU_COUNT=$(sysctl -n hw.ncpu)
    TOTAL_MEMORY=$(sysctl -n hw.memsize)
  else
    CPU_COUNT=$(nproc 2>/dev/null || echo "4")
    TOTAL_MEMORY=$(grep MemTotal /proc/meminfo | awk '{print $2 * 1024}' 2>/dev/null || echo "8589934592")
  fi

  TOTAL_MEMORY_GB=$((TOTAL_MEMORY / 1024 / 1024 / 1024))
  AVAILABLE_DISK=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4 * 1024}')

  log_success "CPU Cores: $CPU_COUNT"
  log_success "Memory: ${TOTAL_MEMORY_GB}GB"
  log_success "Available Disk: $((AVAILABLE_DISK / 1024 / 1024 / 1024))GB"
}

validate_prerequisites() {
  log_info "Validating prerequisites..."

  # Check Node.js
  if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js >= 20.0.0"
    exit 1
  fi

  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [[ $NODE_VERSION -lt 20 ]]; then
    log_error "Node.js version must be >= 20.0.0 (current: $(node -v))"
    exit 1
  fi
  log_success "Node.js $(node -v) ✓"

  # Check npm
  if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
  fi
  log_success "npm $(npm -v) ✓"

  # Check git
  if ! command -v git &> /dev/null; then
    log_error "git is not installed"
    exit 1
  fi
  log_success "git $(git --version | awk '{print $3}') ✓"
}

##############################################################################
# Topology Configuration
##############################################################################

auto_detect_topology() {
  log_info "Auto-detecting optimal agent topology..."

  if [[ $CPU_COUNT -le 2 ]] || [[ $TOTAL_MEMORY_GB -le 4 ]]; then
    DETECTED_TOPOLOGY="simple"
    AGENT_COUNT=8
    CONSENSUS_MODE="gossip"
  elif [[ $CPU_COUNT -le 8 ]] || [[ $TOTAL_MEMORY_GB -le 16 ]]; then
    DETECTED_TOPOLOGY="balanced"
    AGENT_COUNT=24
    CONSENSUS_MODE="raft"
  else
    DETECTED_TOPOLOGY="advanced"
    AGENT_COUNT=60
    CONSENSUS_MODE="byzantine"
  fi

  log_success "Detected topology: $DETECTED_TOPOLOGY ($AGENT_COUNT agents, $CONSENSUS_MODE consensus)"
}

get_topology_from_arg() {
  case "$TOPOLOGY_MODE" in
    simple|balanced|advanced)
      DETECTED_TOPOLOGY="$TOPOLOGY_MODE"
      case "$TOPOLOGY_MODE" in
        simple)
          AGENT_COUNT=8
          CONSENSUS_MODE="gossip"
          ;;
        balanced)
          AGENT_COUNT=24
          CONSENSUS_MODE="raft"
          ;;
        advanced)
          AGENT_COUNT=60
          CONSENSUS_MODE="byzantine"
          ;;
      esac
      log_info "Using specified topology: $DETECTED_TOPOLOGY"
      ;;
    auto)
      auto_detect_topology
      ;;
    *)
      log_error "Unknown topology mode: $TOPOLOGY_MODE (valid: simple, balanced, advanced, auto)"
      exit 1
      ;;
  esac
}

##############################################################################
# Directory Setup
##############################################################################

setup_claude_flow_directories() {
  log_info "Setting up .claude-flow directory structure..."

  mkdir -p "$CLAUDE_FLOW_DIR"/{data,metrics,security,sessions,agents,cache}
  mkdir -p "$PROJECT_ROOT/src/orchestration-ui"
  mkdir -p "$PROJECT_ROOT/src/orchestration-api"

  log_success ".claude-flow directories initialized"
}

##############################################################################
# Configuration Generation
##############################################################################

generate_agent_config() {
  log_info "Generating agent topology configuration..."

  cat > "$CLAUDE_FLOW_DIR/agents.json" << EOF
{
  "topology": "$DETECTED_TOPOLOGY",
  "totalAgents": $AGENT_COUNT,
  "consensusMode": "$CONSENSUS_MODE",
  "systemResources": {
    "cpuCores": $CPU_COUNT,
    "memoryGB": $TOTAL_MEMORY_GB,
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  },
  "agentGroups": {
    "coreAgents": {
      "count": 3,
      "roles": ["coordinator", "memory-manager", "metrics-collector"]
    },
    "executionAgents": {
      "count": $((AGENT_COUNT / 3)),
      "roles": ["task-executor", "code-generator", "tester"]
    },
    "optimizationAgents": {
      "count": $((AGENT_COUNT / 5)),
      "roles": ["performance-optimizer", "topology-optimizer", "resource-allocator"]
    },
    "automationAgents": {
      "count": $((AGENT_COUNT / 4)),
      "roles": ["github-automation", "workflow-manager", "release-coordinator"]
    }
  },
  "consensusProtocol": {
    "mode": "$CONSENSUS_MODE",
    "heartbeatInterval": 5000,
    "electionTimeout": 15000,
    "snapshotInterval": 10000
  },
  "memorySync": {
    "vectorIndexing": "hnsw",
    "cacheSizeGB": $((TOTAL_MEMORY_GB / 4)),
    "ttlSeconds": 3600
  },
  "webUI": {
    "port": $WEB_UI_PORT,
    "enabled": true
  },
  "api": {
    "port": $API_PORT,
    "enabled": true
  }
}
EOF

  log_success "Agent configuration generated"
}

generate_init_config() {
  log_info "Generating .claude-flow initialization config..."

  cat > "$CLAUDE_FLOW_DIR/init-config.json" << 'EOF'
{
  "version": "1.0.0",
  "framework": "claude-flow-v3alpha",
  "initialized": true,
  "capabilities": {
    "multiAgentOrchestration": true,
    "distributedConsensus": true,
    "performanceOptimization": true,
    "gitHubAutomation": true,
    "sparc": true,
    "swarmCoordination": true
  },
  "integrations": {
    "github": {
      "enabled": true,
      "scope": "fused-gaming"
    },
    "npm": {
      "enabled": true,
      "scope": "@h4shed"
    },
    "vercel": {
      "enabled": false
    }
  },
  "monitoring": {
    "metricsCollection": true,
    "healthChecks": true,
    "alerting": true
  }
}
EOF

  log_success "Initialization config generated"
}

##############################################################################
# Package Installation
##############################################################################

install_ui_dependencies() {
  log_info "Installing web UI dependencies..."

  # Create package.json for web UI if it doesn't exist
  if [[ ! -f "$PROJECT_ROOT/src/orchestration-ui/package.json" ]]; then
    cat > "$PROJECT_ROOT/src/orchestration-ui/package.json" << 'EOF'
{
  "name": "@fused-gaming/orchestration-ui",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0"
  }
}
EOF
  fi

  log_success "UI package configuration ready"
}

##############################################################################
# Web UI & API Bootstrap
##############################################################################

create_web_ui_placeholder() {
  log_info "Creating web UI dashboard..."

  mkdir -p "$PROJECT_ROOT/src/orchestration-ui/components"

  cat > "$PROJECT_ROOT/src/orchestration-ui/Dashboard.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AgentMetric {
  name: string;
  taskCount: number;
  cpuUsage: number;
  memoryUsage: number;
  status: 'healthy' | 'warning' | 'error';
}

export const Dashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentMetric[]>([]);
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    // Connect to metrics API
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:3334/api/metrics`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <h1>🎮 Fused Gaming MCP - Swarm Orchestration Dashboard</h1>

      <section style={{ marginTop: '30px' }}>
        <h2>Agent Health Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {agents.map(agent => (
            <div key={agent.name} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{agent.name}</h3>
              <p>Status: <span style={{ color: agent.status === 'healthy' ? 'green' : 'red' }}>{agent.status}</span></p>
              <p>Tasks: {agent.taskCount}</p>
              <p>CPU: {agent.cpuUsage}% | Memory: {agent.memoryUsage}%</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>System Metrics</h2>
        {metrics.chartData && (
          <LineChart width={800} height={300} data={metrics.chartData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" />
            <Line type="monotone" dataKey="memoryUsage" stroke="#82ca9d" />
          </LineChart>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
EOF

  log_success "Web UI dashboard created"
}

create_metrics_api() {
  log_info "Creating metrics collection API..."

  mkdir -p "$PROJECT_ROOT/src/orchestration-api"

  cat > "$PROJECT_ROOT/src/orchestration-api/metrics.ts" << 'EOF'
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface SystemMetrics {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  tasksProcessed: number;
  averageTaskDuration: number;
}

export class MetricsCollector {
  private metricsFile: string;
  private metrics: SystemMetrics[] = [];

  constructor(dataDir: string) {
    this.metricsFile = path.join(dataDir, 'metrics.json');
    this.loadMetrics();
  }

  private loadMetrics(): void {
    try {
      if (fs.existsSync(this.metricsFile)) {
        const data = fs.readFileSync(this.metricsFile, 'utf-8');
        this.metrics = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  }

  public collectMetrics(agentCount: number, tasksProcessed: number, avgTaskDuration: number): SystemMetrics {
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const memUsagePercent = ((totalmem - freemem) / totalmem) * 100;

    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsagePercent = (1 - totalIdle / totalTick) * 100;

    const metric: SystemMetrics = {
      timestamp: new Date().toISOString(),
      cpuUsage: Math.round(cpuUsagePercent * 100) / 100,
      memoryUsage: Math.round(memUsagePercent * 100) / 100,
      activeAgents: agentCount,
      tasksProcessed,
      averageTaskDuration: avgTaskDuration
    };

    this.metrics.push(metric);
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    this.saveMetrics();
    return metric;
  }

  private saveMetrics(): void {
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  public getMetrics(limit: number = 100): SystemMetrics[] {
    return this.metrics.slice(-limit);
  }
}
EOF

  log_success "Metrics API created"
}

##############################################################################
# Health Checks
##############################################################################

create_health_check_service() {
  log_info "Creating health check service..."

  mkdir -p "$PROJECT_ROOT/src/orchestration-api"

  cat > "$PROJECT_ROOT/src/orchestration-api/health.ts" << 'EOF'
import fs from 'fs';
import path from 'path';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  agents: AgentHealth[];
  systemHealth: SystemHealth;
  timestamp: string;
}

export interface AgentHealth {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastHeartbeat: string;
}

export interface SystemHealth {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  uptime: number;
  avgLatency: number;
}

export class HealthCheckService {
  private healthFile: string;

  constructor(dataDir: string) {
    this.healthFile = path.join(dataDir, 'health.json');
  }

  public async checkHealth(agents: any[], systemMetrics: any): Promise<HealthStatus> {
    const agentHealth: AgentHealth[] = agents.map(agent => ({
      id: agent.id,
      status: agent.lastHeartbeat && Date.now() - agent.lastHeartbeat < 10000 ? 'healthy' : 'error',
      responseTime: agent.responseTime || 0,
      lastHeartbeat: new Date(agent.lastHeartbeat || 0).toISOString()
    }));

    const systemHealth: SystemHealth = {
      cpuUsagePercent: systemMetrics.cpuUsage || 0,
      memoryUsagePercent: systemMetrics.memoryUsage || 0,
      diskUsagePercent: systemMetrics.diskUsage || 0,
      uptime: process.uptime(),
      avgLatency: systemMetrics.avgLatency || 0
    };

    const overallStatus = this.determineOverallStatus(agentHealth, systemHealth);

    const health: HealthStatus = {
      status: overallStatus,
      agents: agentHealth,
      systemHealth,
      timestamp: new Date().toISOString()
    };

    this.saveHealth(health);
    return health;
  }

  private determineOverallStatus(agents: AgentHealth[], system: SystemHealth): 'healthy' | 'degraded' | 'critical' {
    const healthyAgents = agents.filter(a => a.status === 'healthy').length;
    const healthRatio = healthyAgents / agents.length;

    if (system.cpuUsagePercent > 90 || system.memoryUsagePercent > 85) {
      return 'critical';
    }

    if (healthRatio < 0.5 || system.cpuUsagePercent > 75 || system.memoryUsagePercent > 70) {
      return 'degraded';
    }

    return 'healthy';
  }

  private saveHealth(health: HealthStatus): void {
    try {
      fs.writeFileSync(this.healthFile, JSON.stringify(health, null, 2));
    } catch (error) {
      console.error('Failed to save health status:', error);
    }
  }
}
EOF

  log_success "Health check service created"
}

##############################################################################
# Final Steps
##############################################################################

print_summary() {
  log_info "Installation Summary"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${GREEN}✓ Fused Gaming MCP - Claude Flow v3alpha Initialized${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Configuration:"
  echo "  Topology: $DETECTED_TOPOLOGY"
  echo "  Agent Count: $AGENT_COUNT"
  echo "  Consensus Mode: $CONSENSUS_MODE"
  echo "  System CPU: $CPU_COUNT cores"
  echo "  System Memory: ${TOTAL_MEMORY_GB}GB"
  echo ""
  echo "Directories:"
  echo "  .claude-flow: $CLAUDE_FLOW_DIR"
  echo "  UI Dashboard: $PROJECT_ROOT/src/orchestration-ui"
  echo "  Metrics API: $PROJECT_ROOT/src/orchestration-api"
  echo ""
  echo "Web UI:"
  echo "  Dashboard: http://localhost:$WEB_UI_PORT"
  echo "  API: http://localhost:$API_PORT"
  echo ""
  echo "Next Steps:"
  echo "  1. Start the orchestration dashboard:"
  echo "     ${BLUE}npm run orchestration:ui${NC}"
  echo ""
  echo "  2. Start the metrics API:"
  echo "     ${BLUE}npm run orchestration:api${NC}"
  echo ""
  echo "  3. Initialize swarm agents:"
  echo "     ${BLUE}npx claude-flow agents init${NC}"
  echo ""
  echo "  4. View the dashboard:"
  echo "     Open http://localhost:$WEB_UI_PORT in your browser"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

##############################################################################
# Main Execution
##############################################################################

main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║   Fused Gaming MCP - Claude Flow v3alpha Installer          ║"
  echo "║   Multi-Agent Swarm Orchestration Platform                  ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""

  validate_prerequisites
  detect_system_resources
  get_topology_from_arg
  setup_claude_flow_directories

  log_info "Generating configuration files..."
  generate_agent_config
  generate_init_config

  log_info "Setting up web UI and APIs..."
  create_web_ui_placeholder
  create_metrics_api
  create_health_check_service

  print_summary
}

main "$@"
