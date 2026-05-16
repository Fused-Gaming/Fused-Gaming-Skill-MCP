import { Task, TaskExecutionResult } from "../types/index.js";
import { SwarmOrchestrator } from "./SwarmOrchestrator.js";
export declare class TaskOrchestrator {
    private swarm?;
    private executedTasks;
    setSwarm(swarm: SwarmOrchestrator): void;
    run(tasks: Task[], swarmId?: string): TaskExecutionResult[];
    getTaskResult(taskId: string): TaskExecutionResult | undefined;
    listExecutedTasks(): TaskExecutionResult[];
}
//# sourceMappingURL=TaskOrchestrator.d.ts.map