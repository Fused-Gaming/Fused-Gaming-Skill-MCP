/**
 * Task Management Tools
 */

import { Task, TaskStatus, TaskPriority, TaskMetrics } from '../types.js';

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  labels?: string[];
}

export function createTask(input: CreateTaskInput): Task {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const task: Task = {
    id: taskId,
    title: input.title,
    description: input.description,
    status: 'todo',
    priority: input.priority || 'medium',
    assignee: input.assignee,
    dueDate: input.dueDate,
    estimatedHours: input.estimatedHours,
    labels: input.labels,
    projectId: input.projectId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return task;
}

export function updateTaskStatus(task: Task, newStatus: TaskStatus): Task {
  const updatedTask = { ...task, status: newStatus, updatedAt: Date.now() };

  if (newStatus === 'done') {
    updatedTask.completedAt = Date.now();
  }

  return updatedTask;
}

export function assignTask(task: Task, assignee: string): Task {
  return {
    ...task,
    assignee,
    updatedAt: Date.now(),
  };
}

export function addTaskLabel(task: Task, label: string): Task {
  const labels = task.labels || [];
  if (!labels.includes(label)) {
    labels.push(label);
  }

  return {
    ...task,
    labels,
    updatedAt: Date.now(),
  };
}

export function setTaskDueDate(task: Task, dueDate: string): Task {
  return {
    ...task,
    dueDate,
    updatedAt: Date.now(),
  };
}

export function addTaskDependency(task: Task, dependsOn: string): Task {
  const dependencies = task.dependencies || [];
  if (!dependencies.includes(dependsOn)) {
    dependencies.push(dependsOn);
  }

  return {
    ...task,
    dependencies,
    updatedAt: Date.now(),
  };
}

export function logTaskTime(task: Task, hours: number): Task {
  return {
    ...task,
    actualHours: (task.actualHours || 0) + hours,
    updatedAt: Date.now(),
  };
}

/**
 * Calculate task metrics from a list of tasks
 */
export function calculateMetrics(tasks: Task[]): TaskMetrics {
  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const blocked = tasks.filter((t) => t.status === 'blocked').length;

  const now = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < now && t.status !== 'done').length;

  const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalActual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

  const priorities: Record<string, number> = {};
  tasks.forEach((t) => {
    priorities[t.priority] = (priorities[t.priority] || 0) + 1;
  });

  const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const avgPriority =
    tasks.length > 0
      ? tasks.reduce((sum, t) => sum + (priorityOrder[t.priority] || 2), 0) / tasks.length
      : 0;

  let avgPriorityStr = 'medium';
  if (avgPriority >= 3.5) avgPriorityStr = 'critical';
  else if (avgPriority >= 2.5) avgPriorityStr = 'high';
  else if (avgPriority >= 1.5) avgPriorityStr = 'low';

  return {
    totalTasks: tasks.length,
    completedTasks: completed,
    inProgressTasks: inProgress,
    blockedTasks: blocked,
    completionPercentage: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    averagePriority: avgPriorityStr,
    overdueTasks: overdue,
    totalEstimatedHours: totalEstimated,
    totalActualHours: totalActual,
  };
}

export function validateTask(task: Task): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }

  if (!(['todo', 'in-progress', 'in-review', 'done', 'blocked'] as const).includes(task.status)) {
    errors.push('Invalid task status');
  }

  if (task.estimatedHours && task.estimatedHours < 0) {
    errors.push('Estimated hours cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
