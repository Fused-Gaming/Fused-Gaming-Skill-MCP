/**
 * Typed tool handlers for the project manager skill.
 *
 * The skill is stateless: every handler receives the task (or tasks) it
 * operates on and returns the updated value. Inputs are validated before any
 * tool logic runs, so callers get a structured error instead of undefined behavior.
 */

import {
  addTaskDependency,
  addTaskLabel,
  assignTask,
  calculateMetrics,
  createTask,
  logTaskTime,
  updateTaskStatus,
  validateTask,
  type CreateTaskInput,
} from './tools/task-management.js';
import type { Task, TaskMetrics, TaskPriority, TaskStatus } from './types.js';

export const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done', 'blocked'];
export const TASK_PRIORITIES: readonly TaskPriority[] = ['critical', 'high', 'medium', 'low'];

export type ToolName =
  | 'create-task'
  | 'update-task-status'
  | 'assign-task'
  | 'log-task-time'
  | 'get-metrics'
  | 'add-task-label'
  | 'add-task-dependency';

export const TOOL_NAMES: readonly ToolName[] = [
  'create-task',
  'update-task-status',
  'assign-task',
  'log-task-time',
  'get-metrics',
  'add-task-label',
  'add-task-dependency',
];

export interface ToolSuccess<T> {
  ok: true;
  data: T;
}

export interface ToolFailure {
  ok: false;
  error: string;
  issues: string[];
}

export type ToolResult<T> = ToolSuccess<T> | ToolFailure;

export interface CreateTaskOutput {
  task: Task;
}

export interface UpdateTaskStatusInput {
  task: Task;
  status: TaskStatus;
}

export interface AssignTaskInput {
  task: Task;
  assignee: string;
}

export interface LogTaskTimeInput {
  task: Task;
  hours: number;
}

export interface AddTaskLabelInput {
  task: Task;
  label: string;
}

export interface AddTaskDependencyInput {
  task: Task;
  dependsOn: string;
}

export interface GetMetricsInput {
  tasks: Task[];
  projectId?: string;
}

export interface GetMetricsOutput {
  metrics: TaskMetrics;
  taskCount: number;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fail(issues: string[]): ToolFailure {
  return { ok: false, error: 'Invalid input', issues };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** True only for real calendar dates in YYYY-MM-DD form (rejects e.g. 2026-02-30). */
export function isCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function checkOptionalPositiveNumber(value: unknown, field: string, issues: string[]): void {
  if (value === undefined) return;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    issues.push(`${field} must be a non-negative finite number`);
  }
}

/** Validates the structural shape of a Task object supplied by the caller. */
export function parseTask(value: unknown, issues: string[], field = 'task'): Task | undefined {
  if (!isRecord(value)) {
    issues.push(`${field} must be an object`);
    return undefined;
  }

  const before = issues.length;
  if (!isNonEmptyString(value.id)) issues.push(`${field}.id must be a non-empty string`);
  if (!isNonEmptyString(value.title)) issues.push(`${field}.title must be a non-empty string`);
  if (!TASK_STATUSES.includes(value.status as TaskStatus)) {
    issues.push(`${field}.status must be one of: ${TASK_STATUSES.join(', ')}`);
  }
  if (!TASK_PRIORITIES.includes(value.priority as TaskPriority)) {
    issues.push(`${field}.priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
  }
  if (typeof value.createdAt !== 'number') issues.push(`${field}.createdAt must be a number`);
  if (typeof value.updatedAt !== 'number') issues.push(`${field}.updatedAt must be a number`);

  // Optional fields feed metrics and filters, so reject malformed values here
  // rather than letting them corrupt downstream results.
  for (const key of ['title', 'description', 'assignee', 'projectId'] as const) {
    if (value[key] !== undefined && typeof value[key] !== 'string') issues.push(`${field}.${key} must be a string`);
  }
  for (const key of ['estimatedHours', 'actualHours'] as const) {
    checkOptionalPositiveNumber(value[key], `${field}.${key}`, issues);
  }
  if (value.completedAt !== undefined && typeof value.completedAt !== 'number') {
    issues.push(`${field}.completedAt must be a number`);
  }
  if (value.dueDate !== undefined && (typeof value.dueDate !== 'string' || !isCalendarDate(value.dueDate))) {
    issues.push(`${field}.dueDate must be a valid calendar date in YYYY-MM-DD format`);
  }
  for (const key of ['labels', 'dependencies', 'blockedBy'] as const) {
    if (value[key] !== undefined && !isStringArray(value[key])) issues.push(`${field}.${key} must be an array of strings`);
  }
  if (issues.length > before) return undefined;

  return value as unknown as Task;
}

function checkTaskValid(task: Task, issues: string[]): void {
  const result = validateTask(task);
  issues.push(...result.errors);
}

export function handleCreateTask(input: unknown): ToolResult<CreateTaskOutput> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  if (!isNonEmptyString(input.title)) issues.push('title is required');
  if (input.priority !== undefined && !TASK_PRIORITIES.includes(input.priority as TaskPriority)) {
    issues.push(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
  }
  if (input.dueDate !== undefined && (typeof input.dueDate !== 'string' || !isCalendarDate(input.dueDate))) {
    issues.push('dueDate must be a valid calendar date in YYYY-MM-DD format');
  }
  if (input.labels !== undefined && !isStringArray(input.labels)) {
    issues.push('labels must be an array of strings');
  }
  for (const key of ['description', 'projectId', 'assignee'] as const) {
    if (input[key] !== undefined && typeof input[key] !== 'string') issues.push(`${key} must be a string`);
  }
  checkOptionalPositiveNumber(input.estimatedHours, 'estimatedHours', issues);
  if (issues.length > 0) return fail(issues);

  const task = createTask(input as unknown as CreateTaskInput);
  checkTaskValid(task, issues);
  if (issues.length > 0) return fail(issues);

  return { ok: true, data: { task } };
}

export function handleUpdateTaskStatus(input: unknown): ToolResult<{ task: Task }> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  const task = parseTask(input.task, issues);
  if (!TASK_STATUSES.includes(input.status as TaskStatus)) {
    issues.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
  }
  if (issues.length > 0 || !task) return fail(issues);

  return { ok: true, data: { task: updateTaskStatus(task, input.status as TaskStatus) } };
}

export function handleAssignTask(input: unknown): ToolResult<{ task: Task }> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  const task = parseTask(input.task, issues);
  if (!isNonEmptyString(input.assignee)) issues.push('assignee is required');
  if (issues.length > 0 || !task) return fail(issues);

  return { ok: true, data: { task: assignTask(task, (input.assignee as string).trim()) } };
}

export function handleLogTaskTime(input: unknown): ToolResult<{ task: Task }> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  const task = parseTask(input.task, issues);
  if (typeof input.hours !== 'number' || !Number.isFinite(input.hours) || input.hours <= 0) {
    issues.push('hours must be a positive finite number');
  }
  if (issues.length > 0 || !task) return fail(issues);

  return { ok: true, data: { task: logTaskTime(task, input.hours as number) } };
}

export function handleAddTaskLabel(input: unknown): ToolResult<{ task: Task }> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  const task = parseTask(input.task, issues);
  if (!isNonEmptyString(input.label)) issues.push('label is required');
  if (issues.length > 0 || !task) return fail(issues);

  return { ok: true, data: { task: addTaskLabel(task, (input.label as string).trim()) } };
}

export function handleAddTaskDependency(input: unknown): ToolResult<{ task: Task }> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  const task = parseTask(input.task, issues);
  if (!isNonEmptyString(input.dependsOn)) issues.push('dependsOn is required');
  // Trim once so the self-dependency check and the stored value agree.
  const dependsOn = isNonEmptyString(input.dependsOn) ? input.dependsOn.trim() : '';
  if (task && dependsOn === task.id) {
    issues.push('a task cannot depend on itself');
  }
  if (issues.length > 0 || !task) return fail(issues);

  return { ok: true, data: { task: addTaskDependency(task, dependsOn) } };
}

export function handleGetMetrics(input: unknown): ToolResult<GetMetricsOutput> {
  if (!isRecord(input)) return fail(['input must be an object']);

  const issues: string[] = [];
  if (!Array.isArray(input.tasks)) {
    issues.push('tasks must be an array');
  }
  if (input.projectId !== undefined && typeof input.projectId !== 'string') {
    issues.push('projectId must be a string when provided');
  }
  if (issues.length > 0) return fail(issues);

  const tasks: Task[] = [];
  (input.tasks as unknown[]).forEach((item, index) => {
    const task = parseTask(item, issues, `tasks[${index}]`);
    if (task) tasks.push(task);
  });
  if (issues.length > 0) return fail(issues);

  const scoped = input.projectId ? tasks.filter((t) => t.projectId === input.projectId) : tasks;
  return { ok: true, data: { metrics: calculateMetrics(scoped), taskCount: scoped.length } };
}

type Handler = (input: unknown) => ToolResult<unknown>;

const HANDLERS: Record<ToolName, Handler> = {
  'create-task': handleCreateTask,
  'update-task-status': handleUpdateTaskStatus,
  'assign-task': handleAssignTask,
  'log-task-time': handleLogTaskTime,
  'get-metrics': handleGetMetrics,
  'add-task-label': handleAddTaskLabel,
  'add-task-dependency': handleAddTaskDependency,
};

export function isToolName(name: string): name is ToolName {
  return (TOOL_NAMES as readonly string[]).includes(name);
}

/** Dispatches a tool call by name. Unknown names return a structured failure. */
export function runTool(name: string, input: unknown): ToolResult<unknown> {
  if (!isToolName(name)) {
    return { ok: false, error: 'Unknown tool', issues: [`unknown tool "${name}"`, `available: ${TOOL_NAMES.join(', ')}`] };
  }
  return HANDLERS[name](input);
}
