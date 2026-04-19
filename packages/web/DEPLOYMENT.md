# SyncPulse Dashboard Deployment Guide

## Quick Start: Deploy to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with Vercel integration
- Node.js 20.x or later

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFused-Gaming%2FFused-Gaming-Skill-MCP&project-name=syncpulse-dashboard&repository-name=fused-gaming-skill-mcp)

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

Add these to your GitHub repository settings:

```
VERCEL_TOKEN       - Vercel API token
VERCEL_ORG_ID      - Vercel organization ID (optional)
VERCEL_PROJECT_ID  - Vercel project ID (optional)
```

**Getting Your Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Add it to GitHub Secrets as `VERCEL_TOKEN`

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

## Monitoring & Logging

### Vercel Dashboard
Monitor deployments, errors, and performance at https://vercel.com/dashboard

### Real-time Logs
```bash
vercel logs --follow
```

### Performance Monitoring
- Core Web Vitals automatically tracked
- Analytics available in Vercel dashboard
- Custom analytics can be configured

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

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [SyncPulse Skill Documentation](../../docs/SYNCPULSE_IMPLEMENTATION.md)

## Deployment Status Badge

Add to your README:
```markdown
[![Vercel Status](https://img-shields.io/website?url=https%3A%2F%2Fyour-domain.vercel.app&label=deployment)](https://your-domain.vercel.app)
```
