import {
  Agent,
  Swarm,
  SwarmConfig,
  SwarmTopology,
  Task,
  AgentRole,
} from "../types/index.js";

export interface AgentQueue {
  tasks: Task[];
  avgExecutionTime: number;
}

export class SwarmOrchestrator {
  private swarms = new Map<string, Swarm>();
  private agents = new Map<string, Agent>();
  private agentQueues = new Map<string, AgentQueue>();
  private lastRebalance = new Map<string, number>();
  private readonly rebalanceInterval = 1000;

  initializeSwarm(
    id: string,
    name: string,
    topology: SwarmTopology,
    agentCount: number
  ): Swarm {
    const config: SwarmConfig = {
      topology,
      maxAgents: agentCount,
      strategy: topology === "hierarchical" ? "specialized" : "balanced",
      consensusThreshold: 0.67,
      autoScale: topology === "adaptive",
    };

    const agents = this.createAgents(agentCount, topology);
    const swarm: Swarm = {
      id,
      name,
      config,
      agents,
      createdAt: Date.now(),
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        avgLatency: 0,
        throughput: 0,
        healthScore: 1.0,
      },
    };

    this.swarms.set(id, swarm);
    agents.forEach((a) => {
      this.agents.set(a.id, a);
      this.agentQueues.set(a.id, { tasks: [], avgExecutionTime: 100 });
    });
    this.lastRebalance.set(id, Date.now());
    return swarm;
  }

  private createAgents(count: number, topology: SwarmTopology): Agent[] {
    const roles: AgentRole[] = ["coordinator", "executor", "reviewer", "optimizer"];
    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      const role: AgentRole =
        topology === "hierarchical" && i === 0 ? "coordinator" : (roles[i % roles.length]);

      agents.push({
        id: `agent-${Date.now()}-${i}`,
        name: `Agent-${i}`,
        role,
        status: "idle",
        capacity: 10,
        currentLoad: 0,
        successRate: 1.0,
        lastHeartbeat: Date.now(),
      });
    }

    return agents;
  }

  assignTask(swarmId: string, task: Task): Agent | null {
    const swarm = this.swarms.get(swarmId);
    if (!swarm) return null;

    // Perform rebalancing if needed
    this.rebalanceIfNeeded(swarmId, swarm);

    // Find least loaded agent with capacity
    let best: Agent | null = null;
    let minLoad = Infinity;

    for (const agent of swarm.agents) {
      if (
        agent.status !== "offline" &&
        agent.currentLoad < agent.capacity &&
        agent.currentLoad < minLoad
      ) {
        best = agent;
        minLoad = agent.currentLoad;
      }
    }

    if (best) {
      best.currentLoad += 1;
      const queue = this.agentQueues.get(best.id);
      if (queue) {
        queue.tasks.push(task);
      }
      swarm.metrics.totalTasks += 1;
    }

    return best;
  }

  private rebalanceIfNeeded(swarmId: string, swarm: Swarm): void {
    const now = Date.now();
    const lastRebalanceTime = this.lastRebalance.get(swarmId) || 0;

    if (now - lastRebalanceTime < this.rebalanceInterval) {
      return;
    }

    this.performWorkStealing(swarm);
    this.lastRebalance.set(swarmId, now);
  }

  private performWorkStealing(swarm: Swarm): void {
    if (swarm.agents.length < 2) return;

    const agents = swarm.agents.filter((a) => a.status !== "offline");
    if (agents.length < 2) return;

    // Calculate predicted completion times
    const predictions = agents.map((agent) => ({
      agent,
      queue: this.agentQueues.get(agent.id),
      predictedTime:
        agent.currentLoad *
        (this.agentQueues.get(agent.id)?.avgExecutionTime || 100),
    }));

    const maxPrediction = Math.max(...predictions.map((p) => p.predictedTime));
    const minPrediction = Math.min(...predictions.map((p) => p.predictedTime));

    // Only steal if imbalance > 50%
    if (maxPrediction - minPrediction < maxPrediction * 0.5) {
      return;
    }

    const slowest = predictions.reduce((prev, current) =>
      prev.predictedTime > current.predictedTime ? prev : current
    );
    const fastest = predictions.reduce((prev, current) =>
      prev.predictedTime < current.predictedTime ? prev : current
    );

    if (
      slowest.queue &&
      fastest.queue &&
      slowest.queue.tasks.length > 1 &&
      fastest.agent.currentLoad < fastest.agent.capacity
    ) {
      const stolenTask = slowest.queue.tasks.shift();
      if (stolenTask) {
        fastest.queue.tasks.push(stolenTask);
        slowest.agent.currentLoad = Math.max(0, slowest.agent.currentLoad - 1);
        fastest.agent.currentLoad += 1;
      }
    }
  }

  releaseTask(swarmId: string, agentId: string, success: boolean, taskId?: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.currentLoad = Math.max(0, agent.currentLoad - 1);
    if (success) {
      agent.successRate =
        (agent.successRate * (agent.successRate === 0 ? 0 : 1) +
          1) /
        2;
    }

    // Remove the completed task from the agent's task queue
    const queue = this.agentQueues.get(agentId);
    if (queue && queue.tasks.length > 0) {
      if (taskId) {
        const index = queue.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
          queue.tasks.splice(index, 1);
        }
      } else {
        queue.tasks.shift();
      }
    }

    const swarm = this.swarms.get(swarmId);
    if (swarm) {
      if (success) {
        swarm.metrics.completedTasks += 1;
      } else {
        swarm.metrics.failedTasks += 1;
      }
      swarm.metrics.healthScore = this.calculateHealthScore(swarm);
    }
  }

  private calculateHealthScore(swarm: Swarm): number {
    const total = swarm.metrics.totalTasks;
    if (total === 0) return 1.0;

    const successRate = swarm.metrics.completedTasks / total;
    const avgLoad =
      swarm.agents.reduce((sum, a) => sum + a.currentLoad, 0) / swarm.agents.length;
    const capacityUtilization = Math.min(avgLoad / 10, 1.0);

    return successRate * 0.7 + (1 - capacityUtilization) * 0.3;
  }

  getSwarm(id: string): Swarm | undefined {
    return this.swarms.get(id);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  listSwarms(): Swarm[] {
    return Array.from(this.swarms.values());
  }

  getSwarmMetrics(id: string) {
    const swarm = this.swarms.get(id);
    if (!swarm) return null;

    const queueImbalance = this.calculateQueueImbalance(swarm);
    return {
      ...swarm.metrics,
      queueImbalance,
      predictedCompletion: this.predictCompletionTime(swarm),
    };
  }

  private calculateQueueImbalance(swarm: Swarm): number {
    if (swarm.agents.length < 2) return 0;

    const loads = swarm.agents.map((a) => a.currentLoad);
    const maxLoad = Math.max(...loads);
    const minLoad = Math.min(...loads);

    return maxLoad - minLoad;
  }

  private predictCompletionTime(swarm: Swarm): number {
    const predictions = swarm.agents.map((agent) => {
      const queue = this.agentQueues.get(agent.id);
      const avgTime = queue?.avgExecutionTime || 100;
      return agent.currentLoad * avgTime;
    });

    return Math.max(...predictions);
  }
}
