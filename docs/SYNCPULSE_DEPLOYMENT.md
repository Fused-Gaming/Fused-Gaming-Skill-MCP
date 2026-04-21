# SyncPulse Deployment Guide

## Overview

SyncPulse is an intelligent project state caching and multi-agent coordination system deployed to **skill.vln.gg** with a real-time web dashboard and comprehensive API.

## Deployment Details

### Domain
- **Primary**: `https://skill.vln.gg`
- **Service**: Fused Gaming Skill MCP
- **Version**: 1.0.3

### Deployment Platform
- **Host**: Vercel
- **Region**: SFO1 (San Francisco)
- **Environment**: Production

## Architecture

### Web Interface
**Dashboard URL**: `https://skill.vln.gg/dashboard`

The SyncPulse dashboard provides real-time visualization of:
- **Active Agents**: Current agents coordinating in the swarm
- **Cache Performance**: Hit rates, TTL tracking, memory usage
- **Task Queue**: Priority-based task status and execution
- **System Health**: CPU, memory, and disk utilization
- **Performance Metrics**: Throughput, latency, and error rates

### API Endpoints

#### Health Check
```
GET /health
GET /
```
Returns service status and version information.

#### Skills List
```
GET /skills
```
Returns available skills with descriptions and features.

#### Metrics Endpoint
```
GET /api/metrics
```
Returns real-time performance metrics:
- `activeAgents`: Number of active agents
- `cacheHits`: Total cache hit count
- `avgLatency`: Average request latency (ms)
- `tasksProcessed`: Total tasks executed
- `throughput`: Operations per second
- `cacheHitRate`: Cache hit rate percentage
- `errorRate`: Error rate percentage
- `cpuUsage`, `memUsage`, `diskUsage`: System resource usage

#### SyncPulse API
```
POST /api/syncpulse
```

Supported actions:

##### Synchronize Project State
```json
{
  "action": "synchronize_project_state",
  "payload": {
    "projectId": "my-project",
    "includeGit": true,
    "cacheTTL": 3600000
  }
}
```

##### Query Cache
```json
{
  "action": "query_cache",
  "payload": {
    "query": "project",
    "limit": 10
  }
}
```

##### Coordinate Agents
```json
{
  "action": "coordinate_agents",
  "payload": {
    "workflowId": "workflow-1",
    "topology": "hierarchical",
    "tasks": [
      { "id": "task-1", "name": "sync_state" },
      { "id": "task-2", "name": "analyze_metrics" }
    ]
  }
}
```

Supported topologies: `hierarchical`, `mesh`, `adaptive`, `ring`, `star`

##### Analyze Performance
```json
{
  "action": "analyze_performance",
  "payload": {
    "timeRange": "1h",
    "metrics": ["latency", "throughput", "errors"]
  }
}
```

##### Manage Session
```json
{
  "action": "manage_session",
  "payload": {
    "sessionId": "session-123",
    "agentId": "agent-1",
    "action": "create"
  }
}
```

Actions: `create`, `resume`, `save`, `close`

## SyncPulse Services

### SwarmOrchestrator
Manages multi-agent coordination with configurable topologies:
- **Hierarchical**: Master-worker topology with centralized control
- **Mesh**: Full peer-to-peer connectivity
- **Adaptive**: Dynamic topology based on load
- **Ring**: Sequential agent chain
- **Star**: Central hub with satellite agents

### MemorySystem
Distributed memory with:
- Pattern-based search and retrieval
- TTL support for automatic expiration
- Memory usage tracking
- Vector similarity capabilities

### CacheService
Intelligent caching with:
- Multi-level persistence (memory + disk)
- TTL and automatic cleanup
- Similarity-based queries
- JSON serialization support

### SessionManager
Session lifecycle management:
- Session creation and resumption
- State persistence
- Agent-specific session tracking
- Status monitoring (active, paused, completed)

### TaskOrchestrator
Task execution and coordination:
- Priority-based scheduling
- Status tracking (pending, running, completed, failed)
- Error handling and recovery
- Execution metrics collection

## Tools

### synchronize_project_state
Synchronize and cache current project state across all agents.

**Parameters**:
- `projectId` (required): Project identifier
- `includeGit` (optional): Include git state information
- `cacheTTL` (optional): Cache time-to-live in milliseconds

**Returns**: Success status and cache metadata

### query_cache
Query the distributed project cache with vector similarity.

**Parameters**:
- `query` (required): Search query string
- `limit` (optional): Maximum results to return

**Returns**: Matching cache entries with similarity scores

### coordinate_agents
Coordinate multi-agent execution with task routing.

**Parameters**:
- `workflowId` (required): Unique workflow identifier
- `topology` (required): Swarm topology type
- `tasks` (required): Array of task definitions

**Returns**: Coordination ID and agent assignments

### analyze_performance
Analyze swarm and cache performance metrics.

**Parameters**:
- `timeRange` (required): Time range (e.g., '1h', '24h', '7d')
- `metrics` (optional): Specific metrics to analyze

**Returns**: Performance analysis and statistics

### manage_session
Manage agent session state and persistence.

**Parameters**:
- `action` (required): Session action (create, resume, save, close)
- `sessionId` (optional): Session identifier
- `agentId` (optional): Agent identifier

**Returns**: Session object with status

## Configuration

### Vercel Setup
The deployment uses `vercel.json` with:
- Node.js runtime
- Static file serving for dashboard
- API routing for backend endpoints
- Build command: `npm run build`
- SFO1 region for optimal latency

### Environment
- `NODE_ENV=production`
- TypeScript with strict mode enabled
- ES2020 target with modern module resolution

## Monitoring

### Dashboard Metrics
The web dashboard auto-refreshes metrics every 5 seconds, showing:
- Real-time agent status
- Cache performance trends
- Task queue status
- System resource utilization
- Historical throughput data

### Logging
API errors and service events are logged to:
- Console output (Vercel logs)
- Application metrics (in-memory store)
- Session history (persisted)

## Performance Targets

- **Cache Hit Rate**: > 85%
- **Average Latency**: < 50ms
- **Throughput**: > 100 ops/sec
- **Error Rate**: < 0.5%
- **Uptime**: 99.9%

## Development

### Local Testing
```bash
# Install dependencies
npm install

# Build project
npm run build

# Run typecheck
npm run typecheck

# Run linter
npm run lint

# Test dashboard locally
# Open public/syncpulse-dashboard.html in browser
```

### SyncPulse Skill Development
```bash
# Build skill
npm run build --workspace=packages/skills/syncpulse

# Test skill integration
npm test --workspace=packages/skills/syncpulse
```

## Deployment Process

1. **Commit changes** to feature branch
2. **Push** to `origin/claude/setup-claude-flow-gitignore-cbgTm`
3. **Create PR** for code review
4. **Merge** to main branch after approval
5. **Tag release** with semantic version
6. **Vercel auto-deploys** to production

### CI/CD Workflow
- GitHub Actions runs `npm run build`
- TypeScript compilation and linting
- Test suite execution
- Deployment to Vercel on main branch

## Troubleshooting

### Dashboard not loading
- Verify Vercel deployment is active
- Check browser console for API errors
- Confirm `/api/metrics` endpoint responds

### Cache not persisting
- Check `.cache` directory permissions
- Verify disk space availability
- Monitor memory usage in dashboard

### High latency
- Check agent queue depth
- Analyze task priority distribution
- Monitor CPU and memory utilization
- Review swarm topology configuration

### Agent coordination failures
- Verify topology configuration
- Check task definitions for errors
- Review agent health status
- Inspect session state

## Support

For issues or questions:
1. Check dashboard for real-time status
2. Review API response errors
3. Inspect Vercel deployment logs
4. Contact: `support@fused-gaming.io`

## Version History

### v1.0.3
- Initial SyncPulse deployment
- Web dashboard implementation
- Complete API with 5 core tools
- Multi-topology swarm orchestration
- Real-time metrics and monitoring

## Related Documentation

- [SyncPulse Skill](../packages/skills/syncpulse/README.md)
- [Fused Gaming MCP](../README.md)
- [Development Guide](./getting-started/QUICKSTART.md)
