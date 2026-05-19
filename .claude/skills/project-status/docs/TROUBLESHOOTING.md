# Project Status API Troubleshooting Guide

Solutions for common issues and configuration problems.

## Installation & Setup

### Issue: Dependencies Not Installing
**Symptoms**: `npm install` fails with module not found errors

**Cause**: Missing or incompatible Node.js version

**Solution**:
```bash
# Verify Node.js version
node -v  # Should be v18+

# Clear npm cache and retry
npm cache clean --force
npm install --legacy-peer-deps
```

---

### Issue: Configuration Validation Fails
**Symptoms**: `validate-config.cjs` returns errors for valid config

**Cause**: Config schema not found or syntax error

**Solution**:
```bash
# Check schema file exists
ls -la resources/schemas/config.schema.json

# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('config.json')))"

# Re-run validation
node scripts/validate-config.cjs config.json
```

---

## Runtime Issues

### Issue: Status Endpoint Returns 503
**Symptoms**: `/status` returns Service Unavailable

**Cause**: Metrics sources not responding

**Solution**:
```bash
# Check endpoint health
curl http://localhost:3000/health

# View logs for error details
tail -f logs/status.log

# Restart API server
npm start
```

---

### Issue: Gates Not Updating
**Symptoms**: Gate status remains "pending" despite completion

**Cause**: Gate status tracker not connected or not reporting

**Solution**:
```javascript
// Verify gate source is registered
console.log(statusAPI.getRegisteredSources());

// Check if gate tracker is reporting
statusAPI.on('gateUpdate', (gate) => {
  console.log(`Gate ${gate.id} updated:`, gate.status);
});

// Re-register if needed
statusAPI.registerMetricsSource('gates', {
  fetch: async () => getGateStatus(),
  interval: 5000
});
```

---

### Issue: Agent Metrics Missing
**Symptoms**: `agents` field empty or incomplete in response

**Cause**: Agent swarm not connected or unhealthy

**Solution**:
```javascript
// Connect orchestration controller
const controller = require('./orchestration-controller');
statusAPI.connectOrchestration(controller);

// Test connection
await statusAPI.testConnection('orchestration');

// Check agent health
const swarm = await statusAPI.getSwarmStatus();
console.log(`Healthy agents: ${swarm.healthy}/${swarm.total}`);
```

---

### Issue: High Memory Usage
**Symptoms**: Process memory grows over time

**Cause**: Unbounded metrics history or cache

**Solution**:
```javascript
// Set appropriate cache duration
const api = new ProjectStatusAPI({
  cacheDuration: 30000, // 30 seconds
  metricsInterval: 5000 // 5 seconds
});

// Enable metrics retention limits
statusAPI.enableHistory({
  retention: 24 * 60 * 60 * 1000, // Keep 24 hours
  pruneInterval: 60000 // Cleanup every minute
});

// Monitor memory
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(`Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
}, 10000);
```

---

### Issue: Slow Response Times
**Symptoms**: `/status` endpoint takes > 1 second

**Cause**: Large number of metrics sources or slow database queries

**Solution**:
```javascript
// Enable response caching
statusAPI.enableCaching({
  duration: 30000,
  redisUrl: process.env.REDIS_URL
});

// Reduce metrics collection interval
statusAPI.updateMetricsInterval(10000); // 10 seconds

// Profile slow sources
statusAPI.on('sourceTime', (source, duration) => {
  if (duration > 500) {
    console.warn(`Slow source '${source}': ${duration}ms`);
  }
});
```

---

## Configuration Issues

### Issue: RFP Deadline Not Calculated Correctly
**Symptoms**: `daysRemaining` shows wrong value

**Cause**: Timezone mismatch in deadline

**Solution**:
```javascript
// Use ISO 8601 format with timezone
const config = {
  deadline: '2026-05-22T15:00:00-07:00' // Explicit timezone
  // OR
  deadline: new Date('2026-05-22T15:00:00Z') // UTC
};

// Verify deadline
console.log(new Date(config.deadline).toISOString());
```

---

### Issue: Gate Dependencies Not Resolving
**Symptoms**: Gates stuck in pending state despite dependencies met

**Cause**: Gate dependency configuration missing

**Solution**:
```json
{
  "gates": [
    {
      "id": 0,
      "name": "Gate 0",
      "dependencies": [],
      "dependents": [1, 2]
    },
    {
      "id": 1,
      "name": "Gate 1",
      "dependencies": [0]
    }
  ]
}
```

Then update gate transitions:
```javascript
statusAPI.updateGateStatus(0, 'passed').then(() => {
  // Automatically transitions dependent gates
});
```

---

## Integration Issues

### Issue: Webhook Not Triggering
**Symptoms**: Webhook URL not receiving notifications

**Cause**: Webhook not registered or URL unreachable

**Solution**:
```bash
# Test webhook URL manually
curl -X POST https://example.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check webhook registration
statusAPI.listWebhooks().forEach(w => {
  console.log(`Webhook: ${w.url} (enabled: ${w.enabled})`);
});

# Re-register webhook
statusAPI.registerWebhook({
  url: 'https://example.com/webhook',
  events: ['gate-passed'],
  retryPolicy: { maxAttempts: 3 }
});
```

---

### Issue: Database Connection Failed
**Symptoms**: History storage fails with connection error

**Cause**: Database not running or credentials invalid

**Solution**:
```bash
# Test database connection
psql -h localhost -U user -d status_metrics -c "SELECT 1;"

# Check connection string
echo $DATABASE_URL

# Fall back to memory storage
statusAPI.enableHistory({
  storage: 'memory',
  retention: 24 * 60 * 60 * 1000
});
```

---

## Monitoring & Debugging

### Enable Verbose Logging

```javascript
statusAPI.enableDebug({
  logLevel: 'debug',
  logFile: 'logs/status-debug.log',
  logMetrics: true,
  logTiming: true
});
```

### Monitor Source Performance

```javascript
statusAPI.on('sourceFetch', (source, duration) => {
  console.log(`${source}: ${duration}ms`);
});

statusAPI.on('sourceError', (source, error) => {
  console.error(`${source} failed:`, error.message);
});
```

### Trace API Requests

```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});
```

---

## Performance Optimization

### Reduce Polling Frequency
```javascript
new ProjectStatusAPI({
  metricsInterval: 10000, // 10 seconds (default 5s)
  cacheDuration: 60000    // 60 seconds (default 30s)
});
```

### Implement Selective Updates
```javascript
// Only fetch changed gates
statusAPI.registerMetricsSource('gates', {
  fetch: async () => {
    const gates = await getGates();
    // Filter out unchanged gates
    return gates.filter(g => g.lastUpdated > lastPollingTime);
  },
  interval: 5000
});
```

### Use CDN for Static Content
```javascript
app.use(express.static('public', {
  maxAge: '1h',
  etag: false
}));
```

---

## Getting Help

If issues persist:

1. Check logs: `tail -f logs/status.log`
2. Enable debug mode in configuration
3. Test with curl: `curl http://localhost:3000/status | jq`
4. Review configuration against schema: `node scripts/validate-config.cjs`
5. Check for known issues in documentation

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module 'project-status-framework'` | Package not installed | `npm install project-status-framework` |
| `EADDRINUSE: port 3000 already in use` | Port conflict | Kill process or use different port |
| `Configuration validation failed` | Invalid config.json | Run `validate-config.cjs` to see specific errors |
| `Metrics source timeout` | Source not responding | Increase timeout or check source availability |
| `RFP deadline in the past` | Invalid deadline date | Update deadline to future date |
