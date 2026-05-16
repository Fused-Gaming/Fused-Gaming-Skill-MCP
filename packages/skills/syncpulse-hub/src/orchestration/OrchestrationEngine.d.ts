export interface Task {
    id: string;
    name: string;
    execute: () => Promise<void>;
    dependencies: string[];
    priority: number;
}
export declare class OrchestrationEngine {
    private tasks;
    private results;
    private maxConcurrent;
    addTask(task: Task): void;
    executeParallel(): Promise<Map<string, any>>;
    private buildExecutionQueue;
    private executeTask;
}
//# sourceMappingURL=OrchestrationEngine.d.ts.map