export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface Task {
  id: string;
  name: string;
  priority: number;
  status: TaskStatus;
  result?: unknown;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface TaskExecutionResult {
  task: Task;
  success: boolean;
}
