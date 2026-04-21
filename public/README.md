# SyncPulse Web Dashboard

## Quick Start

Access the SyncPulse dashboard at: **`https://skill.vln.gg/`** or **`https://skill.vln.gg/dashboard`**

## What is SyncPulse?

SyncPulse is an intelligent project state caching and multi-agent coordination system that provides:

- **Real-time monitoring** of agent swarms and task execution
- **Distributed caching** with vector similarity search
- **Multi-agent coordination** across different network topologies
- **Performance analytics** and system health monitoring

## Dashboard Features

### 📊 Real-Time Metrics

#### Header Stats
- **Active Agents**: Number of agents currently coordinating
- **Cache Hits**: Total successful cache retrievals
- **Avg Latency**: Average request response time
- **Tasks Processed**: Total tasks executed by the system

### 🤖 Agent Management
View and monitor active agents in the swarm:
- Agent names and status (active/busy)
- Real-time status indicators
- Agent-specific metrics

### 💾 Cache Status
Monitor the distributed cache system:
- Cached entries and their keys
- Time-to-live (TTL) for each entry
- Memory usage per cache entry
- Cache hit/miss statistics

### 📋 Task Queue
Track task execution and status:
- Task descriptions and priority levels
- Priority indicators (HIGH/MEDIUM/LOW)
- Queue depth and execution timeline

### 📈 Performance Metrics
Detailed performance analytics:
- **Throughput**: Operations per second
- **Cache Hit Rate**: Percentage of successful cache retrievals
- **Error Rate**: Percentage of failed operations
- **Memory Usage**: Current memory consumption

### 🔄 System Health
Monitor infrastructure resources:
- **CPU Usage**: Processor utilization percentage
- **Memory Usage**: RAM utilization
- **Disk Usage**: Storage utilization
- Visual progress bars for each metric

### 📊 Throughput Chart
Historical throughput data displayed as a bar chart:
- Weekly trend visualization
- Peak performance tracking
- Capacity planning insights

## API Integration

The dashboard pulls data from these endpoints:

- `GET /health` - Service health status
- `GET /api/metrics` - Real-time performance metrics
- `GET /skills` - Available skills and services
- `POST /api/syncpulse` - SyncPulse coordination API

## Auto-Refresh

The dashboard automatically refreshes metrics every **5 seconds** to provide real-time visibility into system performance.

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Color Coding

- **Blue/Purple**: Active operations and healthy status
- **Green**: Cache performance and available capacity
- **Yellow/Orange**: Warnings and cautions
- **Red**: Errors and critical issues

## Mobile Support

The dashboard is responsive and works on mobile devices:
- Touch-friendly controls
- Optimized layout for smaller screens
- Auto-scaling metrics display

## Customization

To customize the dashboard:

1. Edit `public/syncpulse-dashboard.html`
2. Modify colors, fonts, or layout as needed
3. Update API endpoints if deployment location changes
4. Rebuild and redeploy to Vercel

## Troubleshooting

### Metrics not updating
- Check browser console for errors
- Verify `/api/metrics` endpoint is accessible
- Ensure API is responding with valid JSON

### Dashboard styling broken
- Clear browser cache
- Check if CSS is loading (press F12)
- Verify public directory is deployed

### High latency on metrics load
- Check network conditions
- Verify Vercel deployment status
- Review API response times

## Performance Tips

- For real-time monitoring: Set auto-refresh to 1-2 seconds
- For historical analysis: Review 24h or 7d time ranges
- Monitor peak hours: Schedule analysis during business hours

## Related Resources

- [SyncPulse API Documentation](../docs/SYNCPULSE_DEPLOYMENT.md)
- [Fused Gaming MCP GitHub](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP)
- [API Health Check](https://skill.vln.gg/health)
- [Skills List](https://skill.vln.gg/skills)

## Support

For issues or questions:
- Email: `support@fused-gaming.io`
- GitHub Issues: [Fused Gaming Skill MCP Issues](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- Status Page: `https://skill.vln.gg/health`
