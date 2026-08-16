# SyncPulse Remote MCP Connector

Production-ready Streamable HTTP MCP endpoint for discovering and resolving SyncPulse capabilities.

## Architecture

```
Claude Code
    ↓
HTTP Request (MCP protocol)
    ↓
sync.vln.gg/mcp
    ↓
├─ Capability Registry (npm, database, etc.)
├─ Queen Trust Plane (OAuth, entitlements)
├─ Resolver Engine (compatibility, risk, economics)
└─ Observability (logging, metrics, health)
```

## Features

- **Capability Discovery**: Search and filter across 1000+ capabilities
- **Resolution Engine**: Match requirements to compatible candidates
- **Quality Metrics**: Verification rates, coverage, maintainability
- **Risk Management**: Risk tiers, deprecations, upgrade paths
- **Provenance Tracking**: Integrity verification, release history
- **Economics**: Cost deltas, license requirements, resource usage
- **Compatibility Checking**: Multi-capability compatibility analysis

## Phase 1 Tools (Implemented)

| Tool | Purpose | Read-Only |
|------|---------|-----------|
| `search_capabilities` | Search registry by query, kind, provides, risk | ✅ |
| `get_capability` | Get full details for capability/version | ✅ |
| `resolve_capability` | Match requirements to candidates | ✅ |
| `compare_capabilities` | Compare candidates (coverage, risk, quality) | ✅ |
| `get_versions` | List versions and release history | ✅ |
| `get_registry_health` | Registry status and statistics | ✅ |

## Local Development

### Setup

```bash
cd services/syncpulse-mcp
npm install
npm run build
```

### Run

```bash
npm run dev
# or
npm start
```

Server runs at: `http://localhost:3000/mcp`

Health check: `curl http://localhost:3000/health`

### Test with Claude Code

```bash
claude mcp add --transport http syncpulse-hub http://localhost:3000/mcp
```

Then in Claude Code:
```
/mcp
```

To invoke a tool:
```
What capabilities provide browser.e2e?
```

## Environment Targets

| Environment | URL | Status |
|-------------|-----|--------|
| Local | `http://localhost:3000/mcp` | Development |
| Staging | `https://staging-sync.vln.gg/mcp` | In Progress |
| Production | `https://sync.vln.gg/mcp` | Phase 2+ |

## Security

- **Phase 1**: Development token bypass (dev-only)
- **Phase 2**: Signed development tokens
- **Phase 3**: Queen-backed OAuth
- **Phase 4**: Production OAuth + scopes

Read-only phase 1 prevents:
- Direct installation
- Filesystem mutations
- Git operations
- Package modifications

## API Schema

All tools accept JSON input and return JSON output.

### Example: Search Capabilities

Request:
```json
{
  "tool": "search_capabilities",
  "arguments": {
    "provides": ["browser.e2e"],
    "riskTier": ["P0", "P1"],
    "limit": 10
  }
}
```

Response:
```json
{
  "items": [
    {
      "id": "tool.playwright-e2e",
      "kind": "tool",
      "name": "Playwright E2E",
      "version": "1.40.0",
      "provides": ["browser.e2e", "testing.automation"],
      "riskTier": "P1",
      "status": "active"
    }
  ],
  "totalCount": 5,
  "hasMore": false
}
```

## Registry Data

Current implementation uses `MockCapabilityRegistry` for development.

### Switching Data Sources

In `server.ts`, replace:
```typescript
const registry = new MockCapabilityRegistry();
```

With:
```typescript
// Option 1: Database registry
const registry = new PostgresCapabilityRegistry();

// Option 2: npm registry
const registry = new NpmCapabilityRegistry();

// Option 3: HTTP registry
const registry = new RemoteCapabilityRegistry('https://registry.example.com');
```

## Tests

```bash
npm test                  # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:contract   # MCP contract tests
```

Test categories:
- **Unit tests**: Registry, resolver, versions, compatibility
- **Integration tests**: End-to-end with Claude Code
- **MCP contract tests**: Protocol compliance

## Deployment

### Staging

```bash
git push origin claude/mcp-connector-setup-a0wfu1
# CI builds and deploys to staging-sync.vln.gg/mcp
```

### Production

```bash
git merge claude/mcp-connector-setup-a0wfu1 main
git tag v0.2.0
git push origin v0.2.0
# CI builds and deploys to sync.vln.gg/mcp
```

## Observability

### Health Endpoints

```bash
# Basic health check
GET /health
→ { "status": "ok", "service": "syncpulse-mcp", "version": "0.1.0" }

# Readiness probe
GET /ready
→ { "ready": true, "registry": { ... } }
```

### Logging

```bash
LOG_LEVEL=debug npm start
```

Logs include:
- Request ID
- Tool name
- Actor (user/org)
- Latency
- Result count
- Error class

## Roadmap

### Phase 1: Core Discovery ✅
- [x] Capability schema
- [x] Registry abstraction
- [x] Mock implementation
- [x] MCP server (HTTP)
- [x] Phase 1 tools

### Phase 2: Local Testing 🔄
- [ ] Connect Claude Code
- [ ] Contract tests
- [ ] Pagination validation
- [ ] Rate limiting

### Phase 3: Staging Deployment
- [ ] TLS certificate
- [ ] Health checks
- [ ] Monitoring
- [ ] Rate limiting

### Phase 4: Queen Authentication
- [ ] OAuth integration
- [ ] Scope enforcement
- [ ] Entitlement checking
- [ ] Tenant isolation

### Phase 5: Hive Integration
- [ ] Update Capability Scout
- [ ] End-to-end testing
- [ ] Safe resolution gates

### Phase 6: Production
- [ ] Production deployment
- [ ] Security testing
- [ ] Documentation
- [ ] Anthropic submission

## Future Phases

### Phase 2 Mutation Tools (After Read-Only Stable)
- `request_install`
- `request_upgrade`
- `request_remove`

These create approval requests but do NOT install directly.

## Support

See: `https://sync.vln.gg/docs`

## License

Apache 2.0
