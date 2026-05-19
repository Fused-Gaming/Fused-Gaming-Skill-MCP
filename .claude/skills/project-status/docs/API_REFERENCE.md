# Project Status API Reference

Complete API documentation for the Project Status Framework.

## REST Endpoints

### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-05-22T10:30:00Z"
}
```

---

### GET /status
Returns complete project status including gates, agents, metrics, and RFP progress.

**Response Schema:**
```json
{
  "project": {
    "name": "string",
    "description": "string",
    "status": "pending|in-progress|complete|failed",
    "completion": "0-100",
    "started": "ISO8601",
    "lastUpdated": "ISO8601"
  },
  "rfp": {
    "number": "string",
    "deadline": "ISO8601",
    "daysRemaining": "number",
    "hoursRemaining": "number",
    "status": "on-track|at-risk|overdue"
  },
  "gates": [
    {
      "id": "number",
      "name": "string",
      "owner": "string",
      "status": "pending|in-progress|passed|failed",
      "completion": "0-100",
      "criteria": [
        {
          "id": "string",
          "description": "string",
          "met": "boolean"
        }
      ],
      "completedAt": "ISO8601|null",
      "blockers": ["string"]
    }
  ],
  "agents": {
    "total": "number",
    "healthy": "number",
    "busy": "number",
    "idle": "number",
    "error": "number",
    "details": [
      {
        "id": "string",
        "role": "string",
        "status": "healthy|busy|idle|error",
        "tasksCompleted": "number",
        "lastUpdate": "ISO8601"
      }
    ]
  },
  "metrics": {
    "uptime": "number (seconds)",
    "tasksExecuted": "number",
    "successRate": "0-100",
    "averageExecutionTime": "number (ms)",
    "memoryUsage": "number (bytes)",
    "cpuUsage": "0-100"
  }
}
```

---

### GET /status/agents
Returns detailed agent swarm metrics.

**Response:**
```json
{
  "total": 8,
  "healthy": 7,
  "busy": 2,
  "idle": 5,
  "error": 0,
  "agents": [
    {
      "id": "agent-docs-platform",
      "role": "Documentation Lead",
      "status": "healthy",
      "priority": 1,
      "tasksCompleted": 12,
      "tasksRunning": 1,
      "lastUpdate": "2026-05-22T10:29:55Z",
      "uptime": 3600000,
      "memoryUsage": 45.2
    }
  ]
}
```

---

### GET /status/gates
Returns quality gate progression and blockers.

**Response:**
```json
{
  "gates": [
    {
      "id": 0,
      "name": "Repository Observability",
      "owner": "agent-docs-platform",
      "status": "passed",
      "completion": 100,
      "criteria": [
        {
          "id": "git-remotes",
          "description": "Git remotes configured",
          "met": true
        }
      ],
      "completedAt": "2026-05-19T15:30:00Z",
      "blockers": [],
      "verifiedBy": "system",
      "verifiedAt": "2026-05-19T15:30:00Z"
    }
  ],
  "sequenceStatus": "Gate 0 complete → Gate 1 in-progress",
  "nextBlocker": null
}
```

---

### GET /status/compliance
Returns RFP compliance and traceability matrix status.

**Response:**
```json
{
  "rfpNumber": "25-26-09",
  "deadline": "2026-05-22T15:00:00-07:00",
  "daysRemaining": 3,
  "compliance": {
    "coveragePercentage": 95,
    "requirementsMapped": 47,
    "requirementsTotal": 50,
    "gaps": [
      {
        "requirementId": "REQ-12",
        "description": "Training documentation",
        "status": "pending"
      }
    ]
  },
  "traceabilityMatrix": {
    "complete": true,
    "lastUpdated": "2026-05-22T10:00:00Z",
    "mappedSections": [
      { "gate": 0, "requirement": "REQ-01", "section": "01-Overview" },
      { "gate": 1, "requirement": "REQ-02", "section": "02-Planning" }
    ]
  }
}
```

---

### GET /status/metrics
Returns system metrics and performance data.

**Response:**
```json
{
  "system": {
    "uptime": 360000,
    "startTime": "2026-05-22T09:00:00Z",
    "memoryUsage": {
      "heapUsed": 52428800,
      "heapTotal": 157286400,
      "percentage": 33.3
    },
    "cpuUsage": 15.2
  },
  "execution": {
    "tasksExecuted": 156,
    "tasksSucceeded": 148,
    "tasksFailed": 2,
    "tasksPending": 6,
    "successRate": 94.9,
    "averageExecutionTime": 2345
  },
  "api": {
    "requestsTotal": 1024,
    "responseTimes": {
      "p50": 45,
      "p95": 240,
      "p99": 890
    }
  }
}
```

---

### GET /status/history
Returns historical status data for trend analysis.

**Query Parameters:**
- `startTime` (ISO8601) - Start of time range
- `endTime` (ISO8601) - End of time range
- `interval` (string) - "1m", "5m", "1h" aggregation interval
- `metrics` (array) - Specific metrics to include

**Response:**
```json
{
  "startTime": "2026-05-22T09:00:00Z",
  "endTime": "2026-05-22T10:00:00Z",
  "interval": "5m",
  "dataPoints": [
    {
      "timestamp": "2026-05-22T09:00:00Z",
      "completion": 45,
      "agentsHealthy": 8,
      "successRate": 96.2,
      "averageExecutionTime": 2100
    }
  ],
  "statistics": {
    "completionTrend": "increasing",
    "healthAverage": 99.1,
    "successRateAverage": 95.4
  }
}
```

---

## JavaScript API

### ProjectStatusAPI Constructor

```javascript
const api = new ProjectStatusAPI({
  // Required
  project: 'ProjectName',
  gates: [{ id: 0, name: 'Gate', owner: 'team' }],

  // Optional
  description: 'Project description',
  rfpNumber: '25-26-09',
  deadline: new Date('2026-05-22T15:00:00Z'),
  agents: [{ id: 'agent-1', role: 'role', priority: 1 }],
  metricsInterval: 5000,
  cacheDuration: 30000,
  enableMetrics: true,
  storageType: 'memory'
});
```

### Methods

#### getStatus()
Returns complete project status.
```javascript
const status = await api.getStatus();
```

#### getSwarmStatus()
Returns agent swarm metrics.
```javascript
const agents = await api.getSwarmStatus();
```

#### getGateStatus()
Returns quality gate progression.
```javascript
const gates = await api.getGateStatus();
```

#### getComplianceStatus()
Returns RFP compliance status.
```javascript
const compliance = await api.getComplianceStatus();
```

#### getMetrics()
Returns system and execution metrics.
```javascript
const metrics = await api.getMetrics();
```

#### registerMetricsSource(name, config)
Register custom metrics source.
```javascript
api.registerMetricsSource('custom', {
  fetch: async () => ({ data: 'value' }),
  interval: 5000
});
```

#### updateGateStatus(gateId, status, completedAt)
Update quality gate status.
```javascript
api.updateGateStatus(0, 'passed', new Date());
```

---

## Status Values

**Project Status**: `pending` | `in-progress` | `complete` | `failed`

**Agent Status**: `healthy` | `busy` | `idle` | `error`

**Gate Status**: `pending` | `in-progress` | `passed` | `failed`

**RFP Status**: `on-track` | `at-risk` | `overdue`

---

## Error Responses

All endpoints return HTTP 200 on success or appropriate error codes on failure:

- **400** - Invalid request parameters
- **404** - Resource not found
- **500** - Server error
- **503** - Service unavailable (metrics source offline)

Error response format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-05-22T10:30:00Z"
}
```
