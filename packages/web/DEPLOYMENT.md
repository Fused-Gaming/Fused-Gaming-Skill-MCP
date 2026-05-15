# SyncPulse Dashboard Deployment Guide

## Quick Start: Deploy to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with Vercel integration
- Node.js 20.x or later

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFused-Gaming%2FFused-Gaming-Skill-MCP&project-name=syncpulse-dashboard&repository-name=fused-gaming-skill-mcp)

### What You Get After Deployment

✅ **Live SyncPulse Dashboard** at your deployment URL  
✅ **Real-time Agent Monitoring** with WebSocket updates  
✅ **REST API** for programmatic access to orchestration data  
✅ **Performance Analytics** built into Vercel dashboard  
✅ **Auto-scaling Infrastructure** managed by Vercel

### Dashboard Endpoints Reference

**Main Dashboard:**
```
GET https://your-deployment-url.vercel.app/
```
Displays the SyncPulse Agent Swarm Commander with real-time visualization

**Dashboard Pages:**
```
GET https://your-deployment-url.vercel.app/           # Main dashboard (Swarm Visualizer + Control Panel)
GET https://your-deployment-url.vercel.app/skills     # Available skills and agents
```

**API Endpoints (for programmatic access):**
```
GET  https://your-deployment-url.vercel.app/api/health      # System health check
GET  https://your-deployment-url.vercel.app/api/swarms      # List all agent swarms
POST https://your-deployment-url.vercel.app/api/swarms      # Create/execute swarm action
GET  https://your-deployment-url.vercel.app/api/tasks       # List all tasks
POST https://your-deployment-url.vercel.app/api/tasks       # Create a new task
GET  https://your-deployment-url.vercel.app/api/roadmap     # Get execution roadmap
POST https://your-deployment-url.vercel.app/api/roadmap     # Add roadmap phase
```

**Health Check (Quick Verification):**
```bash
curl https://your-deployment-url.vercel.app/api/health

# Expected response:
# {"status":"ok","service":"fused-gaming-skill-mcp","timestamp":"...","version":"..."}
```

### Manual Deployment Steps

#### 1. Prepare the Repository
```bash
# Clone and setup
git clone https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP.git
cd Fused-Gaming-Skill-MCP
npm install --package-lock-only --ignore-scripts
npm ci

# Build the project
npm run build
```

#### 2. Install Vercel CLI
```bash
npm install -g vercel
```

#### 3. Link to Vercel Project
```bash
cd packages/web
vercel link
```

#### 4. Configure Environment Variables
Create a `.env.local` file in `packages/web/`:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
NEXT_PUBLIC_WS_URL=wss://your-api-url.com
NEXT_PUBLIC_ENABLE_LIVE_MODE=true
```

#### 5. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend API endpoint (defaults to same origin) |
| `NEXT_PUBLIC_WS_URL` | No | WebSocket URL for real-time updates |
| `NEXT_PUBLIC_ENABLE_LIVE_MODE` | No | Enable live mode features (default: true) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | No | Enable analytics tracking (default: false) |

### Vercel Project Settings

1. **Framework**: Next.js
2. **Build Command**: `npm run build --if-present`
3. **Output Directory**: `.next`
4. **Node Version**: 22.x recommended

## GitHub Actions CI/CD

The `.github/workflows/deploy-vercel.yml` workflow automatically:
- Deploys preview builds on pull requests
- Deploys to production on `main` branch push
- Comments deployment URLs on PRs

### Required Secrets

Add these to your GitHub repository settings at `https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/settings/secrets/actions`:

| Secret | Required | Description |
|--------|----------|-------------|
| `VERCEL_TOKEN` | Yes | Vercel API token for authentication |
| `VERCEL_ORG_ID` | No | Vercel organization ID (speeds up deployment) |
| `VERCEL_PROJECT_ID` | No | Vercel project ID (speeds up deployment) |

**Getting Your Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create a new token with appropriate scopes
3. Copy the token
4. Go to GitHub repository Settings → Secrets and variables → Actions
5. Add new secret named `VERCEL_TOKEN` with the token value

**Getting Your Org and Project IDs (Optional):**
1. After linking to Vercel, go to your project's `.vercel/project.json`
2. Copy `orgId` → `VERCEL_ORG_ID`
3. Copy `projectId` → `VERCEL_PROJECT_ID`

**Note:** If `VERCEL_TOKEN` is not configured, the deployment workflow will skip gracefully with instructions in the CI logs.

## API Routes

### Health Check
```
GET /api/health
```
Returns system health status and uptime.

### Swarms
```
GET /api/swarms           - List all swarms
POST /api/swarms          - Create/execute swarm action
```

### Tasks
```
GET /api/tasks            - List all tasks
POST /api/tasks           - Create a new task
```

### Roadmap
```
GET /api/roadmap          - Get execution roadmap
POST /api/roadmap         - Add roadmap phase
```

## Dashboard Access & Monitoring

### Accessing the SyncPulse Dashboard

After deployment completes, you can access the orchestration dashboard at your deployed URL:

```
https://your-deployment-url.vercel.app
```

**Dashboard Features:**
- 🐝 **Agent Swarm Visualization** - Real-time view of all running agent swarms
- 📊 **Performance Metrics** - Task throughput, latency, and success rates
- 🔍 **Queue Management** - Monitor task queues and agent load distribution
- 💾 **Cache Analytics** - View cache hit rates, memory usage, and eviction patterns
- 🎯 **Task Monitoring** - Track individual task execution and completion status
- ⚡ **Live Updates** - Real-time metrics via WebSocket when live mode is enabled

### Dashboard Navigation

**Main Sections:**
1. **Overview** - System health and high-level metrics
2. **Swarms** - Detailed swarm topology and agent metrics
3. **Tasks** - Current and historical task execution
4. **Performance** - Benchmarks and performance analytics
5. **Settings** - Configuration and monitoring preferences

### Accessing Deployment Logs

**Via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your `syncpulse-dashboard` project
3. Click **Deployments** tab
4. Select the deployment to view logs

**Via Vercel CLI:**
```bash
# Real-time logs
vercel logs --follow

# Specific deployment
vercel logs <deployment-url>

# Filter by service
vercel logs --function name
```

### Monitoring & Observability

**Vercel Dashboard Features:**
- Monitor deployments, errors, and performance at https://vercel.com/dashboard
- View Web Vitals and performance metrics
- Real-time error tracking and alerting
- Edge Function execution analytics

**Built-in Monitoring:**
- Core Web Vitals automatically tracked
- Server response times and status codes
- Automatic error reporting to Vercel
- Custom analytics integration available

### Setting Up Alerts

**Email Notifications:**
1. In Vercel dashboard: Settings → Alerts
2. Choose alert triggers (deployment, error, performance)
3. Configure notification email addresses

**Slack Integration:**
1. Install Vercel Slack App
2. Link your Vercel account
3. Receive deployment and error notifications

### Health Checks

Monitor your deployment health:

```bash
# Check API health
curl https://your-deployment-url.vercel.app/api/health

# Expected response
{
  "status": "ok",
  "uptime": 3600,
  "timestamp": "2026-05-15T00:00:00Z",
  "services": {
    "database": "ok",
    "cache": "ok",
    "orchestration": "ok"
  }
}
```

### Performance Monitoring

**Vercel Analytics:**
- Real-time visitor analytics
- Core Web Vitals (LCP, FID, CLS)
- Regional performance distribution
- Cold start and response time metrics

**SyncPulse Metrics via API:**
- Query `/api/swarms` for agent utilization and swarm health
- Query `/api/tasks` for task completion rates and execution status
- Query `/api/health` for cache performance and service status
- Dashboard automatically aggregates these metrics for real-time visualization

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
vercel rebuild

# Check build logs
vercel logs --verbose
```

### API Not Responding
1. Check environment variables are set
2. Verify API endpoint is accessible
3. Check network tab in browser DevTools
4. Review Vercel function logs

### WebSocket Connection Issues
- Ensure `NEXT_PUBLIC_WS_URL` is set correctly
- Check WebSocket is supported by your hosting
- Verify CORS headers are configured

## Advanced Configuration

### Custom Domain
1. In Vercel dashboard: Settings → Domains
2. Add your custom domain
3. Update DNS records as shown

### Database Integration
To connect a database:
1. Set `DATABASE_URL` environment variable
2. Update API routes to use database client
3. Run migrations before deployment

### API Authentication
To protect API routes:
1. Add authentication middleware
2. Use `VERCEL_JWT_SECRET` for JWT signing
3. Validate tokens in route handlers

## Getting Started After Deployment

### Step 1: Verify Deployment
```bash
# Check deployment status
curl https://your-deployment-url.vercel.app/api/health

# Should return 200 OK with service status
```

### Step 2: Access the Dashboard
1. Open your browser to `https://your-deployment-url.vercel.app`
2. Explore the Overview page to see system metrics
3. Navigate to the Swarms section to visualize your agent network
4. Check the Performance tab for detailed analytics

### Step 3: Configure Monitoring (Optional)
1. Set up Vercel alerts in dashboard settings
2. Connect Slack for real-time notifications
3. Enable custom analytics if desired

### Step 4: Test API Endpoints
```bash
# List all swarms
curl https://your-deployment-url.vercel.app/api/swarms

# Create a test task
curl -X POST https://your-deployment-url.vercel.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Task",
    "priority": 5,
    "type": "test"
  }'
```

### Step 5: Monitor Performance
- Check Vercel dashboard for Core Web Vitals
- Review agent throughput in SyncPulse dashboard
- Monitor cache hit rates and memory usage

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [SyncPulse Skill Documentation](../../docs/SYNCPULSE_IMPLEMENTATION.md)
- **Dashboard Help**: Hover over metric cards for tooltips and detailed explanations

## Deployment Status Badge

Add to your README:
```markdown
[![Vercel Status](https://img-shields.io/website?url=https%3A%2F%2Fyour-domain.vercel.app&label=deployment)](https://your-domain.vercel.app)
```
