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
export declare function createTask(input: CreateTaskInput): Task;
export declare function updateTaskStatus(task: Task, newStatus: TaskStatus): Task;
export declare function assignTask(task: Task, assignee: string): Task;
export declare function addTaskLabel(task: Task, label: string): Task;
export declare function setTaskDueDate(task: Task, dueDate: string): Task;
export declare function addTaskDependency(task: Task, dependsOn: string): Task;
export declare function logTaskTime(task: Task, hours: number): Task;
export declare function calculateMetrics(tasks: Task[]): TaskMetrics;
export declare function validateTask(task: Task): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=task-management.d.ts.map