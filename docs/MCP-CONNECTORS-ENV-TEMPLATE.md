# MCP Connectors Environment Configuration Template

Copy this template to `.env.local` and update the values for your environment.

## Environment Variables

```bash
# Environment
NODE_ENV=development
LOG_LEVEL=info

# Sync Coordinator Server
SYNC_MCP_API_KEY=dev-sync-mcp-api-key-change-in-production
SYNC_MCP_PORT=3002
SYNC_MCP_TIMEOUT=30000

# Skill Repository Server
SKILL_MCP_API_KEY=dev-skill-mcp-api-key-change-in-production
SKILL_MCP_PORT=3003
SKILL_MCP_TIMEOUT=30000

# Claude MCP Configuration
CLAUDE_FLOW_MODE=v3
CLAUDE_FLOW_HOOKS_ENABLED=true
CLAUDE_FLOW_TOPOLOGY=hierarchical-mesh
CLAUDE_FLOW_MAX_AGENTS=15
CLAUDE_FLOW_MEMORY_BACKEND=hybrid

# Remote Server URLs (for production)
SYNC_MCP_URL=https://sync.vln.gg/mcp
SKILL_MCP_URL=https://skill.vln.gg/mcp

# SSL/TLS Configuration (for HTTPS deployment)
# SSL_CERT_PATH=/etc/letsencrypt/live/sync.vln.gg/fullchain.pem
# SSL_KEY_PATH=/etc/letsencrypt/live/sync.vln.gg/privkey.pem

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_SECOND=30
RATE_LIMIT_WINDOW_MS=1000

# CORS Configuration
CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Authorization,Content-Type

# Skills Configuration
FUSED_GAMING_SKILLS_ENABLED=algorithmic-art,ascii-mockup,canvas-design,frontend-design,theme-factory,mcp-builder

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_INTERVAL=30000
```

## Variable Descriptions

### Core Environment
- **NODE_ENV**: Set to `production` for production deployments
- **LOG_LEVEL**: Log level (debug, info, warn, error)

### Sync Coordinator
- **SYNC_MCP_API_KEY**: Bearer token for authentication (generate with `openssl rand -hex 32`)
- **SYNC_MCP_PORT**: Port the sync coordinator runs on (default: 3002)
- **SYNC_MCP_TIMEOUT**: Request timeout in milliseconds

### Skill Repository
- **SKILL_MCP_API_KEY**: Bearer token for authentication (generate with `openssl rand -hex 32`)
- **SKILL_MCP_PORT**: Port the skill repository runs on (default: 3003)
- **SKILL_MCP_TIMEOUT**: Request timeout in milliseconds

### Security
Keep these secrets secure in production:
- Use strong random keys (minimum 32 characters)
- Store in AWS Secrets Manager, HashiCorp Vault, or similar
- Never commit `.env.local` to version control
- Rotate keys periodically

### Development vs Production

#### Development (.env.local)
```bash
NODE_ENV=development
SYNC_MCP_API_KEY=dev-key-only
SKILL_MCP_API_KEY=dev-key-only
```

#### Production (.env.production)
```bash
NODE_ENV=production
SYNC_MCP_API_KEY=<strong-random-key>
SKILL_MCP_API_KEY=<strong-random-key>
SYNC_MCP_URL=https://sync.vln.gg/mcp
SKILL_MCP_URL=https://skill.vln.gg/mcp
```

## Generate Secure API Keys

```bash
# Generate 32-character random keys
openssl rand -hex 32

# Example output
4f3a7b9c2e1d8a5f6c9e3a2b1f7d4e8c
```

## Docker Environment

Use in docker-compose with:

```yaml
environment:
  NODE_ENV: ${NODE_ENV}
  SYNC_MCP_API_KEY: ${SYNC_MCP_API_KEY}
  SKILL_MCP_API_KEY: ${SKILL_MCP_API_KEY}
```

## Kubernetes ConfigMap Example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mcp-config
data:
  NODE_ENV: production
  SYNC_MCP_PORT: "3002"
  SKILL_MCP_PORT: "3003"
---
apiVersion: v1
kind: Secret
metadata:
  name: mcp-secrets
type: Opaque
stringData:
  SYNC_MCP_API_KEY: <strong-random-key>
  SKILL_MCP_API_KEY: <strong-random-key>
```

## Next Steps

1. Copy this template to `.env.local` or create per-environment files
2. Generate secure API keys
3. Configure for your deployment environment
4. Test with local servers before production deployment
