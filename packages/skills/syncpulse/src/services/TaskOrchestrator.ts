import { Task } from "../types/Task.js";

export class TaskOrchestrator {
  run(tasks: Task[]): Task[] {
    const sorted = [...tasks].sort((a, b) => b.priority - a.priority);

    for (const task of sorted) {
      task.status = "running";
      task.startedAt = Date.now();

      try {
        task.result = {};
        task.status = "completed";
      } catch (e: any) {
        task.status = "failed";
        task.error = e.message;
      }

      task.completedAt = Date.now();
    }

    return sorted;
  }
}
