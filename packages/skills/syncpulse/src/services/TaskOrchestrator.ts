import { Task, TaskExecutionResult } from "../types/index.js";
import { SwarmOrchestrator } from "./SwarmOrchestrator.js";

export class TaskOrchestrator {
  private swarm?: SwarmOrchestrator;
  private executedTasks = new Map<string, TaskExecutionResult>();

  setSwarm(swarm: SwarmOrchestrator): void {
    this.swarm = swarm;
  }

  run(
    tasks: Task[],
    swarmId?: string
  ): TaskExecutionResult[] {
    const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
    const results: TaskExecutionResult[] = [];

    for (const task of sorted) {
      task.status = "running";
      task.startedAt = Date.now();

      let assignedAgent = null;
      if (this.swarm && swarmId) {
        assignedAgent = this.swarm.assignTask(swarmId, task);
      }

      try {
        // Simulate task execution
        task.result = {
          executedAt: Date.now(),
          agentId: assignedAgent?.id,
        };
        task.status = "completed";

        const success = true;
        if (this.swarm && swarmId && assignedAgent) {
          this.swarm.releaseTask(swarmId, assignedAgent.id, success);
        }

        results.push({ task, success });
      } catch (e: unknown) {
        task.status = "failed";
        task.error = e instanceof Error ? e.message : String(e);

        if (this.swarm && swarmId && assignedAgent) {
          this.swarm.releaseTask(swarmId, assignedAgent.id, false);
        }

        results.push({ task, success: false });
      }

      task.completedAt = Date.now();
      this.executedTasks.set(task.id, results[results.length - 1]);
    }

    return results;
  }

  getTaskResult(taskId: string): TaskExecutionResult | undefined {
    return this.executedTasks.get(taskId);
  }

  listExecutedTasks(): TaskExecutionResult[] {
    return Array.from(this.executedTasks.values());
  }
}
