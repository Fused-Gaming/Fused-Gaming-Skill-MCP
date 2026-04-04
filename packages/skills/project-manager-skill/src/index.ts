/**
 * Project Manager Skill
 * Task and project management for team collaboration
 */

export * from './types.js';
export * from './tools/task-management.js';

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
    description: 'Update task status',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        status: { type: 'string', enum: ['todo', 'in-progress', 'in-review', 'done', 'blocked'] },
      },
      required: ['taskId', 'status'],
    },
  },
  {
    name: 'assign-task',
    description: 'Assign task to team member',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        assignee: { type: 'string', description: 'Assignee name' },
      },
      required: ['taskId', 'assignee'],
    },
  },
  {
    name: 'log-task-time',
    description: 'Log time spent on a task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        hours: { type: 'number', description: 'Hours worked' },
      },
      required: ['taskId', 'hours'],
    },
  },
  {
    name: 'get-metrics',
    description: 'Get task metrics and statistics',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        tasks: { type: 'array', description: 'Array of task objects' },
      },
      required: ['tasks'],
    },
  },
];
