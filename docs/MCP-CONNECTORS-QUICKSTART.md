# MCP Connectors Quick Start

Get up and running with sync.vln.gg/mcp and skill.vln.gg/mcp in 5 minutes.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 8.0.0
- (Optional) Docker & Docker Compose

## 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp

# Install dependencies
npm install

# Build project
npm run build
```

## 2. Generate API Keys

```bash
# Generate secure keys (requires openssl)
SYNC_KEY=$(openssl rand -hex 32)
SKILL_KEY=$(openssl rand -hex 32)

echo "SYNC_MCP_API_KEY=$SYNC_KEY"
echo "SKILL_MCP_API_KEY=$SKILL_KEY"
```

## 3. Start Servers Locally

### Option A: Node.js (Recommended for Development)

```bash
# Terminal 1: Start Sync Coordinator
export SYNC_MCP_API_KEY=$(openssl rand -hex 32)
npm run server:sync

# Terminal 2: Start Skill Repository
export SKILL_MCP_API_KEY=$(openssl rand -hex 32)
npm run server:skills
```

### Option B: Docker Compose

```bash
# Create .env file with API keys
cat > .env.local << EOF
SYNC_MCP_API_KEY=$(openssl rand -hex 32)
SKILL_MCP_API_KEY=$(openssl rand -hex 32)
NODE_ENV=development
EOF

# Start both servers with Docker
npm run docker:up

# View logs
npm run docker:logs
```

## 4. Verify Servers are Running

```bash
# Check Sync Coordinator (replace KEY with your SYNC_MCP_API_KEY)
curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" \
  http://localhost:3002/mcp/health

# Check Skill Repository (replace KEY with your SKILL_MCP_API_KEY)
curl -H "Authorization: Bearer $SKILL_MCP_API_KEY" \
  http://localhost:3003/mcp/health

# Expected response:
# {"status":"healthy","service":"sync-coordinator-mcp","timestamp":"2026-08-16T..."}
```

## 5. Configure Claude

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "sync-coordinator": {
      "type": "sse",
      "url": "http://localhost:3002/mcp",
      "auth": {
        "type": "bearer",
        "headerName": "Authorization"
      },
      "env": {
        "MCP_API_KEY": "YOUR_SYNC_MCP_API_KEY"
      }
    },
    "skill-repository": {
      "type": "sse",
      "url": "http://localhost:3003/mcp",
      "auth": {
        "type": "bearer",
        "headerName": "Authorization"
      },
      "env": {
        "MCP_API_KEY": "YOUR_SKILL_MCP_API_KEY"
      }
    }
  }
}
```

## 6. Test with API Calls

```bash
# Sync Tasks
curl -X POST \
  -H "Authorization: Bearer $SYNC_MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"taskId":"test-1","type":"sync","payload":{}}' \
  http://localhost:3002/mcp/tasks/sync

# List Skills
curl -H "Authorization: Bearer $SKILL_MCP_API_KEY" \
  http://localhost:3003/mcp/skills

# Register a Skill
curl -X POST \
  -H "Authorization: Bearer $SKILL_MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"test-skill",
    "version":"1.0.0",
    "description":"Test skill"
  }' \
  http://localhost:3003/mcp/skills/register
```

## 7. Deploy to Production

### AWS ECS

```bash
# Set environment variables
export AWS_REGION=us-east-1
export ECR_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com

# Build and push images
docker buildx build -f Dockerfile.sync -t $ECR_REGISTRY/sync-coordinator:latest --push .
docker buildx build -f Dockerfile.skills -t $ECR_REGISTRY/skill-repository:latest --push .

# Deploy via CloudFormation or AWS CLI
aws ecs update-service --cluster mcp --service sync-coordinator --force-new-deployment
```

### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/sync-coordinator -f Dockerfile.sync
gcloud builds submit --tag gcr.io/YOUR_PROJECT/skill-repository -f Dockerfile.skills

# Deploy
gcloud run deploy sync-coordinator --image gcr.io/YOUR_PROJECT/sync-coordinator
gcloud run deploy skill-repository --image gcr.io/YOUR_PROJECT/skill-repository
```

## 8. Monitor & Debug

```bash
# View server logs (Docker)
docker logs sync-coordinator-1
docker logs skill-repository-1

# Check sync status
curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" \
  http://localhost:3002/mcp/sync/status

# Get events
curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" \
  http://localhost:3002/mcp/events?limit=10
```

## Common Issues

### 401 Unauthorized
**Problem**: `{"error":"Unauthorized"}`

**Solution**: Verify API key is set correctly
```bash
# Check API key
echo $SYNC_MCP_API_KEY

# Include in request
curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" http://localhost:3002/mcp/health
```

### Port Already in Use
**Problem**: `EADDRINUSE: address already in use :::3002`

**Solution**: 
```bash
# Find process using port
lsof -i :3002

# Kill process
kill -9 <PID>

# Or use different ports
export SYNC_MCP_PORT=3004
npm run server:sync
```

### Docker Connection Issues
**Problem**: `Error response from daemon`

**Solution**:
```bash
# Restart Docker
docker-compose -f docker-compose.mcp.yml down
docker system prune
docker-compose -f docker-compose.mcp.yml up -d
```

## Next Steps

1. **Read Full Documentation**: See `docs/MCP-CONNECTORS-SETUP.md`
2. **API Reference**: Check `docs/MCP-CONNECTORS-API-REFERENCE.md`
3. **Environment Setup**: Review `docs/MCP-CONNECTORS-ENV-TEMPLATE.md`
4. **Integration**: Integrate with Claude via `.mcp.json`

## Support

- 📖 Documentation: `docs/MCP-CONNECTORS-*`
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@vln.gg

## Useful Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build all packages
npm run lint                   # Run linter
npm run typecheck              # Check TypeScript

# MCP Servers
npm run server:sync           # Start Sync Coordinator
npm run server:skills         # Start Skill Repository
npm run server:both           # Start both (requires concurrently)

# Docker
npm run docker:build          # Build Docker images
npm run docker:up             # Start Docker containers
npm run docker:down           # Stop Docker containers
npm run docker:logs           # View Docker logs

# Setup & Configuration
npm run mcp:setup             # Initialize MCP configuration
```

---

**Happy coding! 🚀**
