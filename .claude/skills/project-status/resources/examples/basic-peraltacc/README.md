# PeraltaCC Project Status Example

Basic implementation of Project Status API for PeraltaCC RFP proposal.

## Quick Start

This example includes configuration for PeraltaCC. To run a status server:

```bash
# Option 1: Use the basic template from this skill
cd ../..  # Navigate to skill root
node templates/basic-status.cjs

# Option 2: Create your own server using this config
# Copy config to your project and create a server.js (see template for example)
cp examples/basic-peraltacc/config.json ./
node your-server.js
```

For a complete working implementation, use the `basic-status.cjs` template in `resources/templates/` as a starting point.

## Configuration

The `config.json` includes:
- 8-agent swarm configuration
- 6 quality gates (0-5)
- RFP tracking (25-26-09)
- Deadline: May 22, 2026 @ 3:00 PM PT

## Accessing Status

```bash
# Complete status
curl http://localhost:3000/status | jq

# Agent metrics
curl http://localhost:3000/status/agents | jq

# Gate progression
curl http://localhost:3000/status/gates | jq

# Compliance status
curl http://localhost:3000/status/compliance | jq
```

## Gate Sequence

1. **Gate 0**: Repository Observability
2. **Gate 1**: Documentation Platform Deployment
3. **Gate 2**: Technical Architecture & Methodology
4. **Gate 3**: Proposal Content Completeness
5. **Gate 4**: Compliance & Traceability
6. **Gate 5**: Final Submission Readiness

## Agent Assignments

| Agent | Role | Gate |
|-------|------|------|
| agent-docs-platform | Documentation Lead | 0, 1 |
| agent-technical-architecture | Technical Designer | 2 |
| agent-proposal-content | Content Architect | 3 |
| agent-compliance-delivery | Compliance & Delivery | 4 |
| agent-quality-assurance | QA Gate Enforcer | 5 |
| agent-erp-integration | ERP Specialist | 2, 3 |
| agent-project-management | Project Coordinator | Overall timeline |
| agent-cost-financial | Financial Analyst | Cost analysis |

## Monitoring

Use the monitoring script to watch status updates in real-time:

```bash
./scripts/monitor-status.sh http://localhost:3000 2
```

Or export metrics to a timestamped file:

```bash
node scripts/export-metrics.cjs json
# Output: status-metrics-YYYY-MM-DD-HHmmss.json
```

## Integration

To integrate with existing PeraltaCC systems:

1. Connect orchestration controller:
   ```javascript
   const controller = require('../orchestration-controller');
   statusAPI.connectOrchestration(controller);
   ```

2. Register custom metrics sources:
   ```javascript
   statusAPI.registerMetricsSource('gates', {
     fetch: async () => require('../gate-tracker').getStatus(),
     interval: 5000
   });
   ```

3. Set up webhooks for status notifications (optional)

## Files in This Example

- `config.json` - PeraltaCC-specific configuration with 8-agent swarm, 6 gates, RFP tracking

## Server Implementation

For the server implementation, use the template:
- `../../../templates/basic-status.cjs` - Copy this and adapt for your project
