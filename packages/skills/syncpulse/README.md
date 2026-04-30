# SyncPulse - Multi-Agent Coordination, State Caching & Secure Email Automation

SyncPulse is an intelligent project state caching and multi-agent coordination system designed for the Fused-Gaming MCP ecosystem. It provides swarm orchestration, distributed memory, task routing, performance optimization, and **secure email automation for marketing teams**.

## Features

### 📧 Secure Email Automation (NEW!)
- **nodemailer Integration**: Production-ready SMTP configuration with test@mail.vln.gg
- **Environment-Based Secrets**: Secure credential management without hardcoding
- **Template Variables**: Mustache-style interpolation for dynamic content
- **Bulk Email Support**: Send to multiple recipients with per-recipient customization
- **Marketing Campaigns**: Campaign tracking with optional email open analytics
- **Multi-Agent Support**: Integrate email workflows into agent orchestration

### 🔄 Swarm Orchestration
- **Multiple Topologies**: Hierarchical, mesh, adaptive, ring, and star configurations
- **Dynamic Task Routing**: Intelligent agent assignment based on load and capacity
- **Fault Tolerance**: Automatic failover and health monitoring
- **Scaling**: Auto-scaling capabilities for adaptive topologies

### 💾 Memory & Caching
- **Hybrid Memory Backend**: Disk and in-memory caching support
- **Vector Search**: Fast similarity-based cache queries
- **TTL Support**: Automatic expiration and cleanup
- **Performance Tracking**: Hit rates, miss rates, and retrieval metrics

### 📊 Task Orchestration
- **Priority-Based Execution**: Tasks executed by priority level
- **Distributed Execution**: Run across multiple agents in a swarm
- **Result Tracking**: Complete execution history and metrics
- **Error Handling**: Graceful failure management

### 📈 Analytics & Monitoring
- **Real-Time Metrics**: Monitor swarm health and cache performance
- **Agent Analytics**: Per-agent success rates and efficiency
- **Performance Analysis**: Throughput and latency tracking

## Installation

```bash
npm install @fused-gaming/skill-syncpulse
```

## Usage

### Basic Setup

```typescript
import { createSyncPulseSkill } from "@fused-gaming/skill-syncpulse";

const skill = createSyncPulseSkill();
```

### Initialize a Swarm

```typescript
const { services } = skill;
const swarm = services.swarm;

// Create a hierarchical swarm with 5 agents
const mySwarm = swarm.initializeSwarm(
  "swarm-1",
  "Production Swarm",
  "hierarchical",
  5
);
```

### Cache Project State

```typescript
const cache = services.cache;

// Persist project state
await cache.set("my-project", { /* state */ }, 300000); // 5min TTL
```

### Run Coordinated Tasks

```typescript
const { tasks } = services;
const { swarm: swarmService } = services;

const results = tasks.run([
  { id: "task-1", name: "Build", priority: 10, status: "pending", createdAt: Date.now() },
  { id: "task-2", name: "Test", priority: 5, status: "pending", createdAt: Date.now() },
], "swarm-1");
```

### Send Marketing Emails

**Configuration:**
```bash
# .env.local - NEVER commit this file!
MAIL_HOST=smtp.vln.gg
MAIL_PORT=587
MAIL_USER=test@mail.vln.gg
MAIL_PASS=your-app-password
MAIL_FROM=noreply@vln.gg
```

**Usage:**
```typescript
import { createSyncPulseSkill } from "@fused-gaming/skill-syncpulse";

const skill = createSyncPulseSkill();

// Send single email
const result = await skill.tools.find(t => t.name === 'send_email')?.handler({
  recipients: [{ email: "user@example.com", name: "John" }],
  subject: "Welcome {{name}}!",
  htmlBody: "<h1>Hello {{name}}</h1>",
  variables: { name: "John" }
});

// Send bulk campaign
await skill.tools.find(t => t.name === 'send_bulk_email')?.handler({
  recipients: [
    { email: "user1@example.com", name: "User 1", variables: { tier: "Gold" } },
    { email: "user2@example.com", name: "User 2", variables: { tier: "Silver" } }
  ],
  subject: "{{tier}} Member Offer",
  htmlBody: "<p>Hello {{name}}, enjoy {{discount}}% off</p>",
  globalVariables: { discount: "20" }
});

// Send marketing campaign with tracking
await skill.tools.find(t => t.name === 'send_marketing_campaign')?.handler({
  campaignName: "Q2-Product-Launch",
  recipients: marketingList,
  subject: "New Product Launch",
  htmlBody: campaignTemplate,
  trackingPixel: true // Enable open tracking
});
```

## API Reference

### Tools

#### `synchronize_project_state`
Synchronize and cache current project state across all agents.

**Input:**
- `projectId` (string, required): Project identifier
- `includeGit` (boolean): Include git state
- `cacheTTL` (number): Cache TTL in milliseconds

#### `query_cache`
Query the distributed project cache with vector similarity.

**Input:**
- `query` (string, required): Cache query
- `limit` (number): Result limit (default: 10)

#### `coordinate_agents`
Coordinate multi-agent execution with task routing.

**Input:**
- `workflowId` (string, required): Workflow identifier
- `topology` (enum, required): "hierarchical" | "mesh" | "adaptive"
- `tasks` (array, required): Task definitions

#### `analyze_performance`
Analyze swarm and cache performance metrics.

**Input:**
- `timeRange` (string, required): Time range (e.g., "1h", "24h")
- `metrics` (array): Specific metrics to analyze

#### `send_email`
Send secure emails with template variable support.

**Input:**
- `recipients` (array, required): Email recipients with name (optional)
- `subject` (string, required): Email subject with {{variable}} placeholders
- `htmlBody` (string, required): HTML email body
- `textBody` (string): Plain text alternative
- `variables` (object): Variables for template interpolation

#### `send_bulk_email`
Send bulk emails to multiple recipients with per-recipient customization.

**Input:**
- `recipients` (array, required): Recipients with per-recipient variables
- `subject` (string, required): Email subject
- `htmlBody` (string, required): HTML body
- `textBody` (string): Plain text alternative
- `globalVariables` (object): Variables applied to all recipients

#### `send_marketing_campaign`
Send marketing campaigns with optional open tracking.

**Input:**
- `campaignName` (string, required): Campaign identifier
- `recipients` (array, required): Campaign recipients
- `subject` (string, required): Campaign subject
- `htmlBody` (string, required): Campaign HTML
- `textBody` (string): Plain text alternative
- `trackingPixel` (boolean): Enable open tracking (default: false)

#### `verify_email_configuration`
Check email service status and configuration.

**Input:** None (no parameters)

## Architecture

### Core Components

1. **SwarmOrchestrator**: Manages agent pools and task assignment
2. **MemorySystem**: Distributed caching with vector search
3. **TaskOrchestrator**: Coordinates task execution across agents
4. **CacheService**: Persistent state management
5. **SessionManager**: Session lifecycle and state persistence

### Topologies

| Topology | Best For | Agents |
|----------|----------|--------|
| hierarchical | Anti-drift, tight control | 3+ |
| mesh | Distributed tasks | 5+ |
| adaptive | Variable workloads | 5-15 |
| ring | Sequential workflows | Any |
| star | Simple coordination | Any |

## Performance Characteristics

- **Cache Hit Rate**: Configurable, typically 70-90%
- **Task Latency**: <100ms for simple tasks
- **Agent Utilization**: Dynamic based on load
- **Memory**: Hybrid disk/memory with auto-cleanup

## 🔐 Security & Best Practices

SyncPulse email features follow security best practices:

- **No Hardcoded Secrets**: All credentials managed via environment variables
- **SMTP TLS/SSL**: Encrypted connections to mail servers
- **Secure Defaults**: Passwords never logged or exposed in errors
- **Per-Recipient Tracking**: Anonymous campaign analytics
- **Rate Limiting**: Built-in support for bulk email throttling

See [SECURE_EMAIL_SETUP.md](./SECURE_EMAIL_SETUP.md) for detailed security guidance.

## 📚 Documentation

- **[SECURE_EMAIL_SETUP.md](./SECURE_EMAIL_SETUP.md)** - Complete email configuration and security guide
- **[AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md)** - Integrate email tools with Claude agents
- **[README.md](./README.md)** - SyncPulse features and API reference

## Development

```bash
npm run build
npm test
```

## License

Apache-2.0 - See LICENSE in the repository
