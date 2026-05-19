---
name: "Project Status API Framework"
description: "Create real-time status endpoints for project health, agent swarms, gate progression, and compliance tracking. Use when building observable systems, exposing metrics, creating dashboards, or tracking RFP compliance and deployment readiness."
---

# Project Status API Framework

## What This Skill Does

Provides a production-ready framework for building `/status` endpoints that expose:

1. **Project Health**: Overall project state, completion percentage, deadline tracking
2. **Agent Swarm Metrics**: Agent health, task execution, dependency resolution status
3. **Quality Gate Progression**: Gate completion status, criteria verification, blockers
4. **RFP Compliance**: Requirement traceability, compliance verification, deadline tracking
5. **Real-Time Metrics**: Execution times, success rates, system uptime
6. **Multi-Project Aggregation**: Unified status across multiple projects/teams

Perfect for RFP submissions, proposal automation, multi-agent orchestration, and observable development.

## Prerequisites

- Node.js 18+
- Express.js or similar web framework
- Agent swarm/orchestration system (optional, for full features)
- Project configuration with gate definitions
- Access to project metrics and state

## Quick Start (5 minutes)

### 1. Install Framework
```bash
npm install project-status-framework
# or use included scripts
./scripts/setup.sh
```

### 2. Initialize Status Endpoint
```javascript
const { ProjectStatusAPI } = require('project-status-framework');

const api = new ProjectStatusAPI({
  project: 'PeraltaCC',
  rfpNumber: '25-26-09',
  deadline: '2026-05-22T15:00:00-07:00'
});

// Add to Express app
app.get('/status', (req, res) => api.getStatus(req, res));
```

### 3. Access Status
```bash
curl http://localhost:3000/status | jq
```

**Output**:
```json
{
  "project": "PeraltaCC",
  "status": "in-progress",
  "completion": 85,
  "deadline": "2026-05-22T15:00:00-07:00",
  "gates": [
    { "id": 0, "name": "Repository Observability", "status": "passed" },
    { "id": 1, "name": "Documentation Platform", "status": "in-progress" }
  ],
  "agents": { "total": 8, "healthy": 8, "busy": 3 }
}
```

## Core Features

### 1. Multi-Project Status Aggregation
```javascript
// Get status for multiple projects
const status = api.getMultiProjectStatus({
  projects: ['PeraltaCC', 'SyncPulse', 'AlphaFlow'],
  include: ['gates', 'agents', 'metrics']
});
```

### 2. Agent Swarm Metrics
```javascript
// Real-time agent health and execution metrics
const swarmStatus = api.getSwarmStatus();
// Returns: agents, tasks, dependencies, uptime
```

### 3. Quality Gate Progression
```javascript
// Track gate completion and blockers
const gateStatus = api.getGateStatus();
// Returns: gate id, name, owner, criteria, status, completion %
```

### 4. RFP Compliance Dashboard
```javascript
// Compliance tracking and requirement traceability
const compliance = api.getComplianceStatus();
// Returns: RTM, checklist, coverage %, deadline
```

### 5. Real-Time Execution Metrics
```javascript
// System metrics and performance data
const metrics = api.getMetrics();
// Returns: uptime, execution times, success rates, memory usage
```

---

## Step-by-Step Implementation Guide

### Step 1: Initialize Status Framework

```javascript
// status.js
const { ProjectStatusAPI } = require('./project-status-framework');

const statusAPI = new ProjectStatusAPI({
  // Project identification
  project: 'PeraltaCC',
  description: 'Peralta Community College ERP Automation Proposal',
  
  // RFP tracking
  rfpNumber: '25-26-09',
  deadline: new Date('2026-05-22T15:00:00-07:00'),
  
  // Gate definitions
  gates: [
    { id: 0, name: 'Repository Observability', owner: 'agent-docs-platform' },
    { id: 1, name: 'Documentation Platform Deployment', owner: 'agent-docs-platform' },
    { id: 2, name: 'Technical Architecture & Methodology', owner: 'agent-technical-architecture' },
    { id: 3, name: 'Proposal Content Completeness', owner: 'agent-proposal-content' },
    { id: 4, name: 'Compliance & Traceability', owner: 'agent-compliance-delivery' },
    { id: 5, name: 'Final Submission Readiness', owner: 'agent-quality-assurance' }
  ]
});

module.exports = statusAPI;
```

### Step 2: Configure Status Sources

```javascript
// Configure where status data comes from
statusAPI.registerMetricsSource('orchestration', {
  fetch: async () => {
    const controller = require('./orchestration-controller');
    return controller.getStatus();
  },
  interval: 5000 // Update every 5 seconds
});

statusAPI.registerMetricsSource('gates', {
  fetch: async () => {
    // Read gate status from files or database
    return require('./gate-status-tracker').getStatus();
  },
  interval: 10000
});
```

### Step 3: Mount Status Endpoint

```javascript
// app.js
const express = require('express');
const statusAPI = require('./status');

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main status endpoint
app.get('/status', async (req, res) => {
  const status = await statusAPI.getStatus();
  res.json(status);
});

// Detailed endpoints
app.get('/status/agents', async (req, res) => {
  const agents = await statusAPI.getSwarmStatus();
  res.json(agents);
});

app.get('/status/gates', async (req, res) => {
  const gates = await statusAPI.getGateStatus();
  res.json(gates);
});

app.get('/status/compliance', async (req, res) => {
  const compliance = await statusAPI.getComplianceStatus();
  res.json(compliance);
});

app.listen(3000, () => console.log('Status API ready on :3000'));
```

### Step 4: Monitor in Real-Time

```bash
# Terminal 1: Start application
npm start

# Terminal 2: Watch status updates
watch -n 1 'curl -s http://localhost:3000/status | jq'

# Or use provided monitoring script
./scripts/monitor-status.sh
```

---

## Configuration Reference

### ProjectStatusAPI Constructor Options

```javascript
{
  // Project identification (required)
  project: string,              // Project name
  description: string,          // Project description
  
  // RFP tracking
  rfpNumber: string,            // RFP identifier (e.g., "25-26-09")
  deadline: Date,               // RFP submission deadline
  
  // Gate definitions (required)
  gates: Array<{
    id: number,
    name: string,
    owner: string,
    criteria: string[]
  }>,
  
  // Agent configuration
  agents: Array<{
    id: string,
    role: string,
    priority: number
  }>,
  
  // Options
  metricsInterval: number,      // Default: 5000ms
  storageType: string,          // 'memory' | 'redis' | 'database'
  enableMetrics: boolean,       // Default: true
  cacheDuration: number         // Default: 30000ms
}
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Basic health check |
| `/status` | GET | Complete project status |
| `/status/agents` | GET | Agent swarm metrics |
| `/status/gates` | GET | Quality gate progression |
| `/status/compliance` | GET | RFP compliance status |
| `/status/metrics` | GET | Execution and system metrics |
| `/status/history` | GET | Historical status data |

### Status Response Schema

```json
{
  "project": {
    "name": string,
    "description": string,
    "status": "pending" | "in-progress" | "complete" | "failed",
    "completion": 0-100,
    "started": ISO8601,
    "lastUpdated": ISO8601
  },
  "rfp": {
    "number": string,
    "deadline": ISO8601,
    "daysRemaining": number,
    "hoursRemaining": number,
    "status": "on-track" | "at-risk" | "overdue"
  },
  "gates": [
    {
      "id": number,
      "name": string,
      "owner": string,
      "status": "pending" | "in-progress" | "passed" | "failed",
      "criteria": Array<{
        "id": string,
        "description": string,
        "met": boolean
      }>,
      "completedAt": ISO8601,
      "blockers": string[]
    }
  ],
  "agents": {
    "total": number,
    "healthy": number,
    "busy": number,
    "idle": number,
    "error": number,
    "details": Array<{
      "id": string,
      "role": string,
      "status": string,
      "tasksCompleted": number,
      "lastUpdate": ISO8601
    }>
  },
  "metrics": {
    "uptime": number,
    "tasksExecuted": number,
    "successRate": number,
    "averageExecutionTime": number,
    "memoryUsage": number,
    "cpuUsage": number
  }
}
```

---

## Advanced Usage

### Custom Metrics Integration

```javascript
// Register custom metrics source
statusAPI.registerMetricsSource('custom', {
  fetch: async () => ({
    customMetric1: await getCustomData(),
    customMetric2: await getOtherData()
  }),
  interval: 10000,
  transform: (data) => ({
    ...data,
    formatted: true
  })
});
```

### Historical Data Tracking

```javascript
// Enable historical tracking
statusAPI.enableHistory({
  storage: 'database',
  retention: 7 * 24 * 60 * 60 * 1000, // 7 days
  interval: 60000 // Snapshot every minute
});

// Query historical data
const history = await statusAPI.getHistory({
  startTime: new Date(Date.now() - 24*60*60*1000),
  endTime: new Date(),
  metrics: ['completion', 'agents.healthy']
});
```

### Webhook Notifications

```javascript
// Trigger webhooks on status changes
statusAPI.registerWebhook({
  url: 'https://example.com/webhooks/status',
  events: ['gate-passed', 'gate-failed', 'deadline-warning'],
  filter: (event) => event.critical === true
});
```

### Multi-Project Dashboard

```javascript
// Aggregate status across multiple projects
const dashboard = new StatusDashboard({
  projects: [
    { name: 'PeraltaCC', config: {...} },
    { name: 'SyncPulse', config: {...} },
    { name: 'AlphaFlow', config: {...} }
  ]
});

app.get('/dashboard', async (req, res) => {
  const aggregated = await dashboard.getAggregatedStatus();
  res.json(aggregated);
});
```

---

## Scripts Reference

### Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup.sh` | Initialize framework and dependencies | `./scripts/setup.sh` |
| `validate-config.cjs` | Validate status configuration | `node scripts/validate-config.cjs config.json` |
| `monitor-status.sh` | Real-time status monitoring dashboard | `./scripts/monitor-status.sh` |
| `export-metrics.cjs` | Export metrics to CSV/JSON | `node scripts/export-metrics.cjs [format]` |
| `test-endpoint.sh` | Test status endpoint connectivity | `./scripts/test-endpoint.sh http://localhost:3000` |

### Running Monitor

```bash
# Watch status with auto-refresh
./scripts/monitor-status.sh

# Export current status to timestamped file
node scripts/export-metrics.cjs json

# Test endpoint availability
./scripts/test-endpoint.sh http://localhost:3000/status
```

---

## Troubleshooting

### Issue: Status Endpoint Returns 503

**Symptoms**: `/status` returns Service Unavailable

**Cause**: Metrics sources not responding

**Solution**:
```bash
# Check metrics source health
curl http://localhost:3000/status/health

# Verify configuration
node scripts/validate-config.cjs config.json

# Review logs
tail -f logs/status.log
```

### Issue: Gates Not Updating

**Symptoms**: Gate status remains "pending" despite completion

**Cause**: Gate status tracker not connected

**Solution**:
```javascript
// Verify gate tracker is registered
console.log(statusAPI.getRegisteredSources());

// Re-register if needed
statusAPI.registerMetricsSource('gates', {
  fetch: async () => getGateStatus(),
  interval: 5000
});
```

### Issue: Agent Metrics Missing

**Symptoms**: `agents` field empty in response

**Cause**: Agent swarm not connected

**Solution**:
```javascript
// Connect orchestration controller
const controller = require('./orchestration-controller');
statusAPI.connectOrchestration(controller);

// Verify connection
statusAPI.testConnection('orchestration');
```

---

## Examples

### Example 1: Basic PeraltaCC Status

See `resources/examples/basic-peraltacc/` for complete implementation.

### Example 2: Multi-Project Dashboard

See `resources/examples/multi-project-dashboard/` for team status tracking.

### Example 3: RFP Submission Tracking

See `resources/examples/rfp-tracking/` for deadline monitoring.

---

## API Reference

Complete API documentation: [API_REFERENCE.md](docs/API_REFERENCE.md)

## Related Skills

- [Agent Orchestration Skill](#) - Manage agent swarms
- [Quality Gates Framework](#) - Define and track gates
- [RFP Compliance Tracking](#) - Manage RFP requirements
- [Metrics Collection](#) - Collect system metrics

---

## Resources

- **Templates**: `resources/templates/` - Status endpoint templates
- **Examples**: `resources/examples/` - Working implementations
- **Schemas**: `resources/schemas/` - Configuration schemas
- **Documentation**: `docs/` - Detailed guides

---

**Created**: 2026-05-19
**Version**: 1.0.0
**Category**: Infrastructure & Observability
**Difficulty**: Intermediate
**Estimated Time**: 15-30 minutes to integrate

**Author**: Fused Gaming / Agent Swarm Solutions
**License**: MIT
