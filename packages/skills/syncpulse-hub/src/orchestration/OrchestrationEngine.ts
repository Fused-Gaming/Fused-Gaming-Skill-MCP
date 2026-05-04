/**
 * Orchestration Engine - Parallel execution of setup tasks
 */

export interface Task {
  id: string;
  name: string;
  execute: () => Promise<void>;
  dependencies: string[];
  priority: number;
}

export class OrchestrationEngine {
  private tasks: Map<string, Task> = new Map();
  private results: Map<string, any> = new Map();
  private maxConcurrent: number = 4;

  addTask(task: Task) {
    this.tasks.set(task.id, task);
  }

  async executeParallel(): Promise<Map<string, any>> {
    const queue = this.buildExecutionQueue();
    
    for (const batch of queue) {
      await Promise.all(
        batch.map(task => 
          this.executeTask(task).catch(err => ({
            error: true,
            message: err.message
          }))
        )
      );
    }

    return this.results;
  }

  private buildExecutionQueue(): Task[][] {
    const batches: Task[][] = [];
    const visited = new Set<string>();
    let remainingTasks = Array.from(this.tasks.values());
    
    while (remainingTasks.length > 0) {
      const batch: Task[] = [];
      const batchIds = new Set<string>();

      for (const task of remainingTasks) {
        if (task.dependencies.every(dep => visited.has(dep))) {
          batch.push(task);
          batchIds.add(task.id);
        }
      }

      if (batch.length === 0) break; // Circular dependency or error
      
      batch.forEach(t => visited.add(t.id));
      batches.push(batch);
      remainingTasks = remainingTasks.filter(t => !batchIds.has(t.id));
    }

    return batches;
  }

  private async executeTask(task: Task): Promise<void> {
    try {
      await task.execute();
      this.results.set(task.id, { success: true });
    } catch (error) {
      this.results.set(task.id, { success: false, error });
    }
  }
}
