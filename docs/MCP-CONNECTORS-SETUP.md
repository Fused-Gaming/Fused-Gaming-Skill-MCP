# MCP Connectors Setup Guide

This guide explains how to set up and configure the Claude MCP connectors for sync.vln.gg/mcp and skill.vln.gg/mcp.

## Overview

The Fused Gaming Skill MCP project provides two remote MCP (Model Context Protocol) servers:

1. **Sync Coordinator** (`sync.vln.gg/mcp`) - For synchronization and task coordination
2. **Skill Repository** (`skill.vln.gg/mcp`) - For skill management and tooling

Both servers expose HTTP/SSE endpoints that can be consumed by Claude and other MCP clients.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude/MCP Client                         │
└─────────────────────────────────────────────────────────────┘
           ↓                                    ↓
   ┌───────────────────┐           ┌───────────────────┐
   │  Sync Coordinator │           │  Skill Repository │
   │  sync.vln.gg/mcp  │           │  skill.vln.gg/mcp │
   ├───────────────────┤           ├───────────────────┤
   │ • Task Sync       │           │ • List Skills     │
   │ • Coordination    │           │ • Get Tool Info   │
   │ • Workflow State  │           │ • Execute Skill   │
   │ • Event Bus       │           │ • Register Skills │
   └───────────────────┘           └───────────────────┘
```

## Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Docker (for containerized deployment)
- Domain access to `sync.vln.gg` and `skill.vln.gg`

## Local Development

### 1. Build the Project

```bash
npm install
npm run build
```

### 2. Start Both Servers Locally

```bash
# Terminal 1: Start Sync Coordinator on port 3002
npm run server:sync

# Terminal 2: Start Skill Repository on port 3003
npm run server:skills
```

### 3. Verify Servers are Running

```bash
# Check Sync Coordinator
curl http://localhost:3002/mcp/health

# Check Skill Repository
curl http://localhost:3003/mcp/health
```

## Environment Configuration

Both servers require the following environment variables:

### Sync Coordinator
```bash
SYNC_MCP_API_KEY=your-secure-api-key
MCP_TIMEOUT=30000
NODE_ENV=production
```

### Skill Repository
```bash
SKILL_MCP_API_KEY=your-secure-api-key
MCP_TIMEOUT=30000
NODE_ENV=production
```

Create a `.env.local` file or use environment-specific configurations:

```bash
# .env.local
SYNC_MCP_API_KEY=sk-sync-dev-key-12345
SKILL_MCP_API_KEY=sk-skill-dev-key-12345
```

## Docker Deployment

### Build Docker Images

```bash
# Build Sync Coordinator
docker build -f Dockerfile.sync -t fused-gaming/sync-coordinator:latest .

# Build Skill Repository
docker build -f Dockerfile.skills -t fused-gaming/skill-repository:latest .
```

### Run with Docker Compose

```bash
docker-compose -f docker-compose.mcp.yml up -d
```

See `docker-compose.mcp.yml` for configuration details.

## Production Deployment

### 1. Deploy to Cloud Provider

#### Option A: AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-ecr-uri>
docker tag fused-gaming/sync-coordinator:latest <ecr-uri>/sync-coordinator:latest
docker push <ecr-uri>/sync-coordinator:latest
```

#### Option B: Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/your-project/sync-coordinator
gcloud run deploy sync-coordinator --image gcr.io/your-project/sync-coordinator
```

### 2. Configure DNS/Load Balancing

Route your domain to the deployed servers:
- `sync.vln.gg` → Sync Coordinator service
- `skill.vln.gg` → Skill Repository service

### 3. Set Up SSL/TLS

Use a reverse proxy (nginx, Caddy) or cloud-provided SSL:

```nginx
# nginx.conf example
server {
    listen 443 ssl http2;
    server_name sync.vln.gg;

    ssl_certificate /etc/letsencrypt/live/sync.vln.gg/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sync.vln.gg/privkey.pem;

    location /mcp {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SSE settings
        proxy_buffering off;
        proxy_cache off;
    }
}
```

## MCP Configuration in Claude

Add the following to your `.mcp.json` to use these remote connectors:

```json
{
  "mcpServers": {
    "sync-coordinator": {
      "type": "sse",
      "url": "https://sync.vln.gg/mcp",
      "auth": {
        "type": "bearer",
        "headerName": "Authorization"
      },
      "env": {
        "MCP_API_KEY": "${SYNC_MCP_API_KEY}"
      }
    },
    "skill-repository": {
      "type": "sse",
      "url": "https://skill.vln.gg/mcp",
      "auth": {
        "type": "bearer",
        "headerName": "Authorization"
      },
      "env": {
        "MCP_API_KEY": "${SKILL_MCP_API_KEY}"
      }
    }
  }
}
```

## API Endpoints Reference

### Sync Coordinator (`sync.vln.gg/mcp`)

#### Health Check
```http
GET /mcp/health
Authorization: Bearer ${SYNC_MCP_API_KEY}
```

#### Sync Tasks
```http
POST /mcp/tasks/sync
Authorization: Bearer ${SYNC_MCP_API_KEY}
Content-Type: application/json

{
  "taskId": "task-123",
  "type": "sync|coordinate|workflow-state",
  "payload": {},
  "agentId": "agent-1",
  "priority": "normal"
}
```

#### Get Sync Status
```http
GET /mcp/sync/status
Authorization: Bearer ${SYNC_MCP_API_KEY}
```

#### Publish Coordination Event
```http
POST /mcp/events/publish
Authorization: Bearer ${SYNC_MCP_API_KEY}
Content-Type: application/json

{
  "type": "coordination-event",
  "agentId": "agent-1",
  "data": {}
}
```

#### Get Events
```http
GET /mcp/events?agentId=agent-1&limit=100
Authorization: Bearer ${SYNC_MCP_API_KEY}
```

### Skill Repository (`skill.vln.gg/mcp`)

#### List Skills
```http
GET /mcp/skills
Authorization: Bearer ${SKILL_MCP_API_KEY}
```

#### Get Skill Details
```http
GET /mcp/skills/{skillName}
Authorization: Bearer ${SKILL_MCP_API_KEY}
```

#### Search Skills
```http
GET /mcp/skills/search?q=design&tag=ui
Authorization: Bearer ${SKILL_MCP_API_KEY}
```

#### Register Skill
```http
POST /mcp/skills/register
Authorization: Bearer ${SKILL_MCP_API_KEY}
Content-Type: application/json

{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "My skill description",
  "tags": ["design", "ui"]
}
```

#### List Tools
```http
GET /mcp/tools?skill=my-skill
Authorization: Bearer ${SKILL_MCP_API_KEY}
```

#### Execute Skill
```http
POST /mcp/skills/{skillName}/execute
Authorization: Bearer ${SKILL_MCP_API_KEY}
Content-Type: application/json

{
  "tool": "tool-name",
  "input": {}
}
```

## Monitoring and Logging

### Check Server Logs

For Docker deployments:
```bash
docker logs sync-coordinator-1
docker logs skill-repository-1
```

### Health Monitoring

Set up monitoring for the health endpoints:

```bash
# Monitor Sync Coordinator
watch -n 5 'curl -s -H "Authorization: Bearer $SYNC_MCP_API_KEY" https://sync.vln.gg/mcp/health | jq'

# Monitor Skill Repository
watch -n 5 'curl -s -H "Authorization: Bearer $SKILL_MCP_API_KEY" https://skill.vln.gg/mcp/health | jq'
```

### Metrics and Tracing

Both servers support OpenTelemetry for metrics and tracing:

```bash
# Set tracing environment variables
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
export OTEL_SERVICE_NAME=sync-coordinator
```

## Troubleshooting

### 401 Unauthorized Error

Ensure the API key is correctly set:

```bash
# Check API key is set in environment
echo $SYNC_MCP_API_KEY
echo $SKILL_MCP_API_KEY

# Include authorization header in requests
curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" https://sync.vln.gg/mcp/health
```

### 503 Service Unavailable

Check if servers are running:

```bash
# For local development
lsof -i :3002  # Sync Coordinator
lsof -i :3003  # Skill Repository
```

### Connection Timeout

If using over HTTP/2, ensure:
- SSL certificates are valid
- Proxy buffering is disabled (for SSE streams)
- Connection timeout is adequate (default 30s)

## Security Considerations

1. **API Key Management**
   - Use strong, randomly generated API keys
   - Rotate keys periodically
   - Store keys in secure vaults (AWS Secrets Manager, Vault, etc.)

2. **HTTPS/TLS**
   - Always use HTTPS in production
   - Ensure valid SSL certificates
   - Use modern TLS versions (1.2+)

3. **Authentication**
   - Bearer token authentication required for all endpoints
   - Implement rate limiting
   - Log authentication failures

4. **Network Security**
   - Restrict access to trusted sources
   - Use VPC/firewall rules
   - Implement DDoS protection

## Integration with Claude

Once deployed, configure Claude Code to use these connectors:

```bash
# Update .mcp.json
claude-code config set mcpServers sync-coordinator --type sse --url https://sync.vln.gg/mcp

# Test connection
claude-code mcp test sync-coordinator
```

## Performance Optimization

1. **Connection Pooling**: Use HTTP/2 keep-alive
2. **Caching**: Cache skill metadata and tool definitions
3. **Load Balancing**: Deploy multiple instances behind a load balancer
4. **Compression**: Enable gzip compression for responses

## Scaling

For production scale, consider:

- **Horizontal Scaling**: Deploy multiple server instances
- **Database Backend**: Migrate from in-memory storage to persistent database
- **Message Queue**: Use Redis/RabbitMQ for event coordination
- **Service Mesh**: Implement with Istio or Linkerd for advanced routing

## Additional Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Claude API Documentation](https://anthropic.com/docs)
- [Docker Deployment Guide](./DOCKER-DEPLOYMENT.md)
- [API Reference](./API-REFERENCE.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs
3. Contact the development team
4. Open an issue on GitHub

---

**Last Updated**: August 2026  
**Version**: 1.0.0
