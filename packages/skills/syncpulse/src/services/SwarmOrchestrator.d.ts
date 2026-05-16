import { Agent, Swarm, SwarmTopology, Task } from "../types/index.js";
export interface AgentQueue {
    tasks: Task[];
    avgExecutionTime: number;
}
export declare class SwarmOrchestrator {
    private swarms;
    private agents;
    private agentQueues;
    private lastRebalance;
    private readonly rebalanceInterval;
    initializeSwarm(id: string, name: string, topology: SwarmTopology, agentCount: number): Swarm;
    private createAgents;
    assignTask(swarmId: string, task: Task): Agent | null;
    private rebalanceIfNeeded;
    private performWorkStealing;
    releaseTask(swarmId: string, agentId: string, success: boolean, taskId?: string): void;
    private calculateHealthScore;
    getSwarm(id: string): Swarm | undefined;
    getAgent(id: string): Agent | undefined;
    listSwarms(): Swarm[];
    getSwarmMetrics(id: string): {
        queueImbalance: number;
        predictedCompletion: number;
        totalTasks: number;
        completedTasks: number;
        failedTasks: number;
        avgLatency: number;
        throughput: number;
        healthScore: number;
    } | null;
    private calculateQueueImbalance;
    private predictCompletionTime;
}
//# sourceMappingURL=SwarmOrchestrator.d.ts.map