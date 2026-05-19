# Advanced Project Status Configuration

Advanced usage patterns and integration strategies for enterprise deployments.

## Custom Metrics Integration

Register custom metrics sources to extend status reporting:

```javascript
statusAPI.registerMetricsSource('ci-pipeline', {
  fetch: async () => {
    const result = await fetch('https://github.com/api/workflows');
    return result.json();
  },
  interval: 30000,
  transform: (data) => ({
    totalRuns: data.workflow_runs.length,
    successRate: (data.successful / data.total) * 100
  })
});
```

## Multi-Project Dashboard

Aggregate status across multiple projects:

```javascript
const { StatusDashboard } = require('project-status-framework');

const dashboard = new StatusDashboard({
  projects: [
    { name: 'PeraltaCC', config: peraltaConfig },
    { name: 'SyncPulse', config: syncPulseConfig },
    { name: 'AlphaFlow', config: alphaFlowConfig }
  ]
});

app.get('/dashboard', async (req, res) => {
  const aggregated = await dashboard.getAggregatedStatus();
  res.json(aggregated);
});
```

## Historical Data Tracking

Enable time-series storage for trend analysis:

```javascript
statusAPI.enableHistory({
  storage: 'redis', // or 'database'
  retention: 7 * 24 * 60 * 60 * 1000, // 7 days
  interval: 60000, // Snapshot every minute
  redisUrl: 'redis://localhost:6379'
});

// Query historical data
const history = await statusAPI.getHistory({
  startTime: new Date(Date.now() - 24*60*60*1000),
  endTime: new Date(),
  metrics: ['completion', 'agents.healthy', 'successRate']
});
```

## Webhook Notifications

Trigger webhooks on status changes:

```javascript
statusAPI.registerWebhook({
  url: 'https://example.com/webhooks/status',
  events: ['gate-passed', 'gate-failed', 'deadline-warning'],
  filter: (event) => event.gateId < 5, // Only Gates 0-4
  retryPolicy: {
    maxAttempts: 3,
    backoffMs: 1000
  }
});
```

Webhook payload format:
```json
{
  "event": "gate-passed",
  "gateId": 2,
  "gateName": "Technical Architecture",
  "timestamp": "2026-05-22T10:30:00Z",
  "status": {
    "completion": 100,
    "duration": 86400000
  }
}
```

## Authentication & Security

Protect status endpoints with authentication:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');

app.use('/status', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// All /status endpoints now require valid JWT
```

## Performance Optimization

### Caching Strategy

```javascript
statusAPI.enableCaching({
  duration: 30000, // 30 seconds
  keys: ['project', 'gates', 'agents', 'metrics'],
  redisUrl: 'redis://localhost:6379'
});
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100 // 100 requests per minute
});

app.use('/status', limiter);
```

## Integration with CI/CD

### GitHub Actions Integration

```yaml
- name: Update Project Status
  env:
    STATUS_ENDPOINT: ${{ secrets.STATUS_ENDPOINT }}
    STATUS_TOKEN: ${{ secrets.STATUS_TOKEN }}
  run: |
    curl -X POST $STATUS_ENDPOINT \
      -H "Authorization: Bearer $STATUS_TOKEN" \
      -d '{"event": "ci-success", "workflowId": "${{ github.run_id }}"}'
```

### GitLab CI Integration

```yaml
update_status:
  stage: post-build
  script:
    - |
      curl -X POST $STATUS_ENDPOINT \
        -H "PRIVATE-TOKEN: $STATUS_TOKEN" \
        -d '{"pipeline_id": "'$CI_PIPELINE_ID'", "status": "success"}'
```

## Database Storage

Store metrics in PostgreSQL or MongoDB:

```javascript
statusAPI.enableHistory({
  storage: 'database',
  database: {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'status_metrics',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  retention: 30 * 24 * 60 * 60 * 1000 // 30 days
});
```

## Real-Time Updates with WebSocket

```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

statusAPI.on('gateUpdate', (gate) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'gate-update',
        gate: gate
      }));
    }
  });
});
```

Client-side:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'gate-update') {
    updateGateUI(data.gate);
  }
};
```

## Compliance Reporting

Export compliance reports for audit trails:

```javascript
const PDFDocument = require('pdfkit');

async function generateComplianceReport() {
  const compliance = await statusAPI.getComplianceStatus();
  const doc = new PDFDocument();

  doc.fontSize(25).text('Compliance Report', 100, 100);
  doc.fontSize(12).text(`RFP: ${compliance.rfpNumber}`);
  doc.text(`Coverage: ${compliance.coverage}%`);
  
  // Add RTM table
  compliance.requirements.forEach(req => {
    doc.text(`${req.id}: ${req.section} ✓`);
  });

  doc.pipe(fs.createWriteStream('compliance-report.pdf'));
  doc.end();
}
```

## Scaling Considerations

For large deployments with 50+ agents and 1000s of status updates/minute:

1. **Use Redis** for caching and session management
2. **Enable database storage** for historical data
3. **Implement rate limiting** to prevent API abuse
4. **Use load balancer** to distribute requests
5. **Enable compression** for large responses:

```javascript
app.use(compression({
  level: 6,
  threshold: 1024
}));
```

6. **Monitor performance** with APM tools (New Relic, DataDog)
