/**
 * Project Manager Skill
 * Task and project management for team collaboration
 */

export * from './types.js';
export * from './tools/task-management.js';
export * from './handlers.js';
export { runCli, USAGE } from './cli-core.js';
export type { CliResult } from './cli-core.js';

const taskSchema = {
  type: 'object',
  description: 'Task object as returned by create-task',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    status: { type: 'string', enum: ['todo', 'in-progress', 'in-review', 'done', 'blocked'] },
    priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
    assignee: { type: 'string' },
    dueDate: { type: 'string' },
    estimatedHours: { type: 'number' },
    actualHours: { type: 'number' },
    labels: { type: 'array', items: { type: 'string' } },
    dependencies: { type: 'array', items: { type: 'string' } },
    projectId: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
    completedAt: { type: 'number' },
  },
  required: ['id', 'title', 'status', 'priority', 'createdAt', 'updatedAt'],
};

export const skillTools = [
  {
    name: 'create-task',
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        projectId: { type: 'string', description: 'Project ID' },
        priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
        assignee: { type: 'string', description: 'Assigned team member' },
        dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
        estimatedHours: { type: 'number', description: 'Estimated hours' },
        labels: { type: 'array', items: { type: 'string' } },
      },
      required: ['title'],
    },
  },
  {
    name: 'update-task-status',
    description: 'Update the status of a task',
    inputSchema: {
      type: 'object',
      properties: {
        task: taskSchema,
        status: { type: 'string', enum: ['todo', 'in-progress', 'in-review', 'done', 'blocked'] },
      },
      required: ['task', 'status'],
    },
  },
  {
    name: 'assign-task',
    description: 'Assign a task to a team member',
    inputSchema: {
      type: 'object',
      properties: {
        task: taskSchema,
        assignee: { type: 'string', description: 'Assignee name' },
      },
      required: ['task', 'assignee'],
    },
  },
  {
    name: 'log-task-time',
    description: 'Log hours worked on a task',
    inputSchema: {
      type: 'object',
      properties: {
        task: taskSchema,
        hours: { type: 'number', description: 'Hours worked (positive)' },
      },
      required: ['task', 'hours'],
    },
  },
  {
    name: 'add-task-label',
    description: 'Add a label to a task (no-op if already present)',
    inputSchema: {
      type: 'object',
      properties: {
        task: taskSchema,
        label: { type: 'string', description: 'Label to add' },
      },
      required: ['task', 'label'],
    },
  },
  {
    name: 'add-task-dependency',
    description: 'Record that a task depends on another task',
    inputSchema: {
      type: 'object',
      properties: {
        task: taskSchema,
        dependsOn: { type: 'string', description: 'ID of the task this one depends on' },
      },
      required: ['task', 'dependsOn'],
    },
  },
  {
    name: 'get-metrics',
    description: 'Get task metrics and statistics, optionally scoped to one project',
    inputSchema: {
      type: 'object',
      properties: {
        tasks: { type: 'array', items: taskSchema, description: 'Array of task objects' },
        projectId: { type: 'string', description: 'Only count tasks in this project' },
      },
      required: ['tasks'],
    },
  },
];
