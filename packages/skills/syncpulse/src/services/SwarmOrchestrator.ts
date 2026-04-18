import {
  Agent,
  Swarm,
  SwarmConfig,
  SwarmTopology,
  Task,
} from "../types/index.js";

export class SwarmOrchestrator {
  private swarms = new Map<string, Swarm>();
  private agents = new Map<string, Agent>();

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
    agents.forEach((a) => this.agents.set(a.id, a));
    return swarm;
  }

  private createAgents(count: number, topology: SwarmTopology): Agent[] {
    const roles = ["coordinator", "executor", "reviewer", "optimizer"];
    const agents: Agent[] = [];

    for (let i = 0; i < count; i++) {
      const role =
        topology === "hierarchical" && i === 0 ? "coordinator" : roles[i % roles.length];

      agents.push({
        id: `agent-${Date.now()}-${i}`,
        name: `Agent-${i}`,
        role: role as "coordinator" | "executor" | "reviewer" | "optimizer",
        status: "idle",
        capacity: 10,
        currentLoad: 0,
        successRate: 1.0,
        lastHeartbeat: Date.now(),
      });
    }

    return agents;
  }

  assignTask(swarmId: string, _task: Task): Agent | null {
    const swarm = this.swarms.get(swarmId);
    if (!swarm) return null;

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
      swarm.metrics.totalTasks += 1;
    }

    return best;
  }

  releaseTask(swarmId: string, agentId: string, success: boolean): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.currentLoad = Math.max(0, agent.currentLoad - 1);
    if (success) {
      agent.successRate =
        (agent.successRate * (agent.successRate === 0 ? 0 : 1) +
          1) /
        2;
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
    return swarm?.metrics || null;
  }
}
