import { CacheService } from "../services/CacheService.js";
import { MemorySystem } from "../services/MemorySystem.js";
import { SwarmOrchestrator } from "../services/SwarmOrchestrator.js";
import { TaskOrchestrator } from "../services/TaskOrchestrator.js";
export {
  sendEmail,
  sendBulkEmail,
  sendMarketingCampaign,
  verifyEmailConfiguration,
} from "./email-tools.js";

export function synchronizeProjectState(
  cache: CacheService,
  memory: MemorySystem
) {
  return async (input: { projectId: string; includeGit?: boolean; cacheTTL?: number }) => {
    const state = {
      projectId: input.projectId,
      synchronized: true,
      timestamp: Date.now(),
      gitIncluded: input.includeGit ?? false,
    };

    cache.set(`project-${input.projectId}`, state, input.cacheTTL || 300000);
    memory.set(`project-state-${input.projectId}`, state, {
      type: "project-state",
      synchronized: true,
    });

    return {
      success: true,
      projectId: input.projectId,
      message: "Project state synchronized and cached",
      state,
    };
  };
}

export function queryProjectCache(
  cache: CacheService,
  memory: MemorySystem
) {
  return async (input: { query: string; limit?: number }) => {
    const results = memory.vectorSearch(input.query, input.limit || 10);

    return {
      success: true,
      query: input.query,
      resultCount: results.length,
      results: results.map((r) => ({
        key: r.entry.key,
        value: r.entry.value,
        similarity: r.similarity.toFixed(3),
      })),
    };
  };
}

export function coordinateAgents(
  swarm: SwarmOrchestrator,
  tasks: TaskOrchestrator
) {
  return async (input: {
    workflowId: string;
    topology: "hierarchical" | "mesh" | "adaptive";
    tasks: Array<{ id: string; name: string; priority: number }>;
  }) => {
    // Initialize swarm if needed
    let swarmId = input.workflowId;
    const existingSwarm = swarm.getSwarm(swarmId);

    if (!existingSwarm) {
      const agentCount = input.topology === "hierarchical" ? 3 : 5;
      swarm.initializeSwarm(swarmId, `Swarm-${input.workflowId}`, input.topology, agentCount);
    }

    // Create Task objects
    const taskObjects = input.tasks.map((t) => ({
      id: t.id,
      name: t.name,
      priority: t.priority,
      status: "pending" as const,
      createdAt: Date.now(),
    }));

    // Run tasks through orchestrator
    tasks.setSwarm(swarm);
    const results = tasks.run(taskObjects, swarmId);

    const swarmMetrics = swarm.getSwarmMetrics(swarmId);

    return {
      success: true,
      workflowId: input.workflowId,
      topology: input.topology,
      tasksCompleted: results.filter((r) => r.success).length,
      tasksFailed: results.filter((r) => !r.success).length,
      metrics: swarmMetrics,
      results: results.map((r) => ({
        taskId: r.task.id,
        success: r.success,
        status: r.task.status,
      })),
    };
  };
}

export function analyzePerformance(
  swarm: SwarmOrchestrator,
  memory: MemorySystem
) {
  return async (input: { timeRange: string; metrics?: string[] }) => {
    const memoryStats = memory.getStats();
    const swarms = swarm.listSwarms();

    const analysis = {
      memoryMetrics: {
        totalEntries: memoryStats.totalEntries,
        cacheHitRate: (memoryStats.hitRate * 100).toFixed(2) + "%",
        avgRetrievalTime: memoryStats.avgRetrievalTime.toFixed(2) + "ms",
      },
      swarmMetrics: swarms.map((s) => ({
        swarmId: s.id,
        agentCount: s.agents.length,
        topology: s.config.topology,
        healthScore: s.metrics.healthScore.toFixed(3),
        completedTasks: s.metrics.completedTasks,
        failedTasks: s.metrics.failedTasks,
        throughput: s.metrics.throughput.toFixed(2),
      })),
    };

    return {
      success: true,
      timeRange: input.timeRange,
      analysis,
    };
  };
}
