# SyncPulse - Multi-Agent Coordination & State Caching

SyncPulse is an intelligent project state caching and multi-agent coordination system designed for the Fused-Gaming MCP ecosystem. It provides swarm orchestration, distributed memory, task routing, and performance optimization.

## Features

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

## Development

```bash
npm run build
npm test
```

## License

MIT - See LICENSE in the repository
