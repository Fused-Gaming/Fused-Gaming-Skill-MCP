import { SwarmOrchestrator } from "./services/SwarmOrchestrator.js";
import { MemorySystem } from "./services/MemorySystem.js";
import { TaskOrchestrator } from "./services/TaskOrchestrator.js";
import { CacheService } from "./services/CacheService.js";
import {
  synchronizeProjectState,
  queryProjectCache,
  coordinateAgents,
  analyzePerformance,
} from "./tools/index.js";

export function createSyncPulseSkill() {
  const swarm = new SwarmOrchestrator();
  const memory = new MemorySystem();
  const tasks = new TaskOrchestrator();
  const cache = new CacheService();

  return {
    name: "syncpulse",
    description: "SyncPulse - Intelligent multi-agent coordination, caching, and project state synchronization",
    version: "1.0.0",
    organization: "Fused-Gaming",
    tools: [
      {
        name: "synchronize_project_state",
        description: "Synchronize and cache current project state across all agents",
        inputSchema: {
          type: "object",
          properties: {
            projectId: { type: "string", description: "Project identifier" },
            includeGit: { type: "boolean", description: "Include git state" },
            cacheTTL: { type: "number", description: "Cache TTL in ms" },
          },
          required: ["projectId"],
        },
        handler: synchronizeProjectState(cache, memory),
      },
      {
        name: "query_cache",
        description: "Query the distributed project cache with vector similarity",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Cache query" },
            limit: { type: "number", description: "Result limit" },
          },
          required: ["query"],
        },
        handler: queryProjectCache(cache, memory),
      },
      {
        name: "coordinate_agents",
        description: "Coordinate multi-agent execution with task routing",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: { type: "string" },
            topology: {
              type: "string",
              enum: ["hierarchical", "mesh", "adaptive"],
            },
            tasks: { type: "array", description: "Task definitions" },
          },
          required: ["workflowId", "topology", "tasks"],
        },
        handler: coordinateAgents(swarm, tasks),
      },
      {
        name: "analyze_performance",
        description: "Analyze swarm and cache performance metrics",
        inputSchema: {
          type: "object",
          properties: {
            timeRange: { type: "string", description: "Time range (e.g., '1h', '24h')" },
            metrics: {
              type: "array",
              items: { type: "string" },
              description: "Metrics to analyze",
            },
          },
          required: ["timeRange"],
        },
        handler: analyzePerformance(swarm, memory),
      },
    ],
    services: {
      swarm,
      memory,
      tasks,
      cache,
    },
  };
}

export { SwarmOrchestrator, MemorySystem, TaskOrchestrator, CacheService };
export * from "./types/index.js";
