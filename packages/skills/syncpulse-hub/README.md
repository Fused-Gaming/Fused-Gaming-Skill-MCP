# 🎮 SyncPulse Hub

**Centralized installation and orchestration system for all @h4shed packages**

## Features

- **Unified Installation**: Single command to install all 63 packages
- **Orchestrated Setup**: Parallel execution with dependency management
- **Pre-Deployment Validation**: Comprehensive testing before merge
- **Auto-Update Checking**: Automatic update detection in each chat session
- **Registry Management**: Centralized package registry and discovery

## Quick Start

```bash
# Orchestrated setup (entire ecosystem)
npm run setup

# Check for updates
npm run check-updates

# Build the hub
npm run build
```

## Architecture

```
SyncPulse Hub
├── PackageRegistry (63 packages)
├── OrchestrationEngine (parallel execution)
├── SetupOrchestrator (coordinated setup)
├── DeploymentValidator (pre-merge testing)
└── UpdateChecker (auto-update detection)
```

## 63-Package Ecosystem

- **31 Skills**: Design, generative art, productivity, content creation
- **28 Tools**: Development tools, testing, styling, bundling
- **3 Core**: mcp-core, mcp-cli, docs
- **1 Session**: multi-account-session-tracking

See registry for complete list.

## Integration

### In Claude Chats
Auto-checks for updates on each session:
```typescript
import { SyncPulseHub } from '@h4shed/syncpulse-hub';

// Called automatically
const hub = new SyncPulseHub('full');
await hub.checkUpdates();
```

### In CI/CD
Validates before merge:
```bash
npm run build
npm run typecheck
npm run test

# Then validate deployment
node scripts/validate-deployment.sh
```

## Documentation

- **Architecture**: See SYNCPULSE_INTEGRATION_STRATEGY.md
- **Status**: See REVISED_ASSESSMENT_POST_INSTALL.md
- **Setup**: See scripts/setup-syncpulse-hub.sh

## License

Apache 2.0
