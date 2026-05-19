# Configuration Guide

Complete guide to configuring the Project Status Framework for your project.

## Quick Configuration

The minimal configuration requires only two fields:

```json
{
  "project": "MyProject",
  "gates": [
    { "id": 0, "name": "Gate 0", "owner": "team" }
  ]
}
```

## Full Configuration Reference

### Project Information

```json
{
  "project": "ProjectName",           // REQUIRED: Project name (1-100 chars)
  "description": "Project purpose",   // OPTIONAL: Project description
}
```

### RFP Tracking

```json
{
  "rfpNumber": "25-26-09",            // OPTIONAL: RFP identifier (format: XX-XX-XX)
  "deadline": "2026-05-22T15:00:00Z"  // OPTIONAL: ISO 8601 deadline
}
```

The framework automatically calculates:
- `daysRemaining` - Days until deadline
- `hoursRemaining` - Hours until deadline
- `status` - "on-track", "at-risk", or "overdue"

### Quality Gates

```json
{
  "gates": [
    {
      "id": 0,                        // REQUIRED: Gate ID (0-5)
      "name": "Repository Observability", // REQUIRED: Gate name
      "owner": "team-name",           // REQUIRED: Responsible team/agent
      "criteria": [                   // OPTIONAL: Completion criteria
        "Git remotes configured",
        "GitHub API accessible"
      ]
    }
  ]
}
```

**Gate Naming Convention** (Recommended):
- Gate 0: Repository Observability
- Gate 1: Build & Deployment Platform
- Gate 2: Technical Architecture & Design
- Gate 3: Content Completeness
- Gate 4: Compliance & Traceability
- Gate 5: Final Submission Readiness

### Agent Configuration

```json
{
  "agents": [
    {
      "id": "agent-docs-platform",        // REQUIRED: Unique identifier
      "role": "Documentation Lead",       // REQUIRED: Role description
      "priority": 1                       // OPTIONAL: 1=high, 3=low
    }
  ]
}
```

**Priority Levels**:
- `1` - High priority (blocking path)
- `2` - Medium priority (parallel execution)
- `3` - Low priority (verification only)

### Performance Settings

```json
{
  "metricsInterval": 5000,    // Metrics update interval (ms)
  "cacheDuration": 30000,     // Status cache duration (ms)
  "enableMetrics": true,      // Enable metrics collection
  "storageType": "memory"     // "memory", "redis", or "database"
}
```

**Recommendations**:
- `metricsInterval`: 5000-10000ms for most projects
- `cacheDuration`: 30000ms balances freshness and performance
- Increase both values for large deployments

### Webhook Configuration

```json
{
  "webhooks": [
    {
      "url": "https://example.com/webhook",
      "events": [
        "gate-passed",
        "gate-failed",
        "deadline-warning",
        "agent-down"
      ]
    }
  ]
}
```

**Available Events**:
- `gate-passed` - Quality gate completed
- `gate-failed` - Quality gate failed
- `deadline-warning` - 7 days until deadline
- `agent-down` - Agent became unhealthy
- `task-completed` - Task execution completed

## Configuration Examples

### Basic Project (Minimal)

```json
{
  "project": "SimpleProject",
  "gates": [
    { "id": 0, "name": "Requirements", "owner": "team" },
    { "id": 1, "name": "Design", "owner": "team" },
    { "id": 2, "name": "Implementation", "owner": "team" },
    { "id": 3, "name": "Testing", "owner": "team" },
    { "id": 4, "name": "Deployment", "owner": "team" },
    { "id": 5, "name": "Release Ready", "owner": "team" }
  ]
}
```

### RFP Proposal Project

```json
{
  "project": "ClientProposal",
  "description": "RFP response for client",
  "rfpNumber": "2026-001",
  "deadline": "2026-06-15T17:00:00Z",
  "gates": [
    { "id": 0, "name": "Repository Setup", "owner": "infra-team" },
    { "id": 1, "name": "Documentation Platform", "owner": "docs-team" },
    { "id": 2, "name": "Technical Solution", "owner": "arch-team" },
    { "id": 3, "name": "Proposal Content", "owner": "content-team" },
    { "id": 4, "name": "Compliance Verification", "owner": "legal-team" },
    { "id": 5, "name": "Final Submission", "owner": "pm-team" }
  ],
  "metricsInterval": 10000,
  "cacheDuration": 60000
}
```

### Multi-Agent Swarm Project

```json
{
  "project": "PeraltaCC",
  "description": "ERP Automation and Functional Alignment",
  "rfpNumber": "25-26-09",
  "deadline": "2026-05-22T15:00:00-07:00",
  "gates": [
    {
      "id": 0,
      "name": "Repository Observability",
      "owner": "agent-docs-platform",
      "criteria": [
        "Git remotes configured",
        "GitHub API accessible",
        "CI workflows defined"
      ]
    },
    {
      "id": 1,
      "name": "Documentation Platform",
      "owner": "agent-docs-platform",
      "criteria": [
        "GitBook deployed",
        "Navigation working",
        "PDF export functional"
      ]
    },
    {
      "id": 2,
      "name": "Technical Architecture",
      "owner": "agent-technical-architecture",
      "criteria": [
        "Methodology documented",
        "Architecture diagrams complete",
        "Security design reviewed"
      ]
    },
    {
      "id": 3,
      "name": "Content Completeness",
      "owner": "agent-proposal-content",
      "criteria": [
        "All sections written",
        "Cross-references verified",
        "Formatting consistent"
      ]
    },
    {
      "id": 4,
      "name": "Compliance Verification",
      "owner": "agent-compliance-delivery",
      "criteria": [
        "RTM complete",
        "100% requirements coverage",
        "Appendices organized"
      ]
    },
    {
      "id": 5,
      "name": "Submission Readiness",
      "owner": "agent-quality-assurance",
      "criteria": [
        "Gates 0-4 passed",
        "Professional formatting",
        "PDF generation successful",
        "Sign-off obtained"
      ]
    }
  ],
  "agents": [
    { "id": "agent-docs-platform", "role": "Documentation Lead", "priority": 1 },
    { "id": "agent-proposal-content", "role": "Content Architect", "priority": 1 },
    { "id": "agent-compliance-delivery", "role": "Compliance & Delivery", "priority": 1 },
    { "id": "agent-technical-architecture", "role": "Technical Designer", "priority": 2 },
    { "id": "agent-erp-integration", "role": "ERP Specialist", "priority": 2 },
    { "id": "agent-project-management", "role": "Project Coordinator", "priority": 3 },
    { "id": "agent-cost-financial", "role": "Financial Analyst", "priority": 2 },
    { "id": "agent-quality-assurance", "role": "QA Gate Enforcer", "priority": 3 }
  ],
  "metricsInterval": 5000,
  "cacheDuration": 30000,
  "enableMetrics": true,
  "storageType": "memory"
}
```

## Validation

Validate your configuration before deployment:

```bash
# Validate against schema
node scripts/validate-config.cjs config.json

# Output:
# ✓ Configuration config.json is valid
#   Project: MyProject
#   Gates: 6
#   RFP: 25-26-09
```

## Advanced Configuration

### Custom Metrics Sources

Register additional metrics sources programmatically:

```javascript
const api = new ProjectStatusAPI(config);

api.registerMetricsSource('git-stats', {
  fetch: async () => {
    const git = require('simple-git');
    const repo = git('/path/to/repo');
    const log = await repo.log(['--oneline']);
    return {
      commits: log.total,
      latestCommit: log.latest?.hash
    };
  },
  interval: 300000 // 5 minutes
});
```

### Environment Variable Override

```bash
# Override configuration with environment variables
export PROJECT_NAME="MyProject"
export RFP_NUMBER="2026-001"
export RFP_DEADLINE="2026-06-15T17:00:00Z"
export METRICS_INTERVAL="10000"

node app.js
```

### Dynamic Configuration Loading

```javascript
// Load configuration from remote source
const https = require('https');

async function loadConfig() {
  return new Promise((resolve, reject) => {
    https.get('https://config.example.com/project-status.json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

const config = await loadConfig();
const api = new ProjectStatusAPI(config);
```

## Configuration Best Practices

1. **Use Version Control**: Commit config.json to git (with sensitive data in .env)
2. **Validate on Startup**: Always validate configuration before running
3. **Document Changes**: Keep changelog of configuration updates
4. **Test Thresholds**: Adjust metricsInterval based on load testing
5. **Monitor Performance**: Track response times and adjust cacheDuration
6. **Plan Gate Sequencing**: Order gates to reflect actual project dependencies
7. **Clear Ownership**: Assign each gate to specific team or agent
8. **Define Success Criteria**: Make gate criteria measurable and specific

## Troubleshooting Configuration

**Issue**: Validation fails with "type mismatch"
- Verify field types match schema (strings, numbers, arrays, objects)
- Check for extra commas or missing brackets

**Issue**: Gates not in correct order
- Gate IDs must be 0-5 and sequential
- Update ID values if reordering gates

**Issue**: Deadline calculations wrong
- Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Include timezone: `YYYY-MM-DDTHH:MM:SS±HH:MM`

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more configuration issues.
