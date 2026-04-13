/**
 * Project Status Tool Skill
 * Central dashboard for project metrics and status aggregation
 */

export * from './types.js';
export * from './tools/create-project.js';
export { generateDashboard, formatDashboard, getHealthIndicator } from './tools/dashboard.js';

export const skillTools = [
  {
    name: 'create-project',
    description: 'Create a new project for tracking',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        targetDate: { type: 'string', description: 'Target completion date (YYYY-MM-DD)' },
        owner: { type: 'string', description: 'Project owner' },
        teamMembers: { type: 'array', items: { type: 'string' }, description: 'Team member names' },
      },
      required: ['name', 'owner'],
    },
  },
  {
    name: 'update-status',
    description: 'Update project status and progress',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        status: {
          type: 'string',
          enum: ['planning', 'in-progress', 'blocked', 'completed', 'on-hold'],
          description: 'New status',
        },
        progress: { type: 'number', description: 'Progress percentage (0-100)' },
        notes: { type: 'string', description: 'Status update notes' },
      },
      required: ['projectId', 'status'],
    },
  },
  {
    name: 'generate-dashboard',
    description: 'Generate project status dashboard from all projects',
    inputSchema: {
      type: 'object',
      properties: {
        projects: { type: 'array', description: 'Array of project objects' },
      },
      required: ['projects'],
    },
  },
  {
    name: 'add-blocker',
    description: 'Add a blocker to a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        title: { type: 'string', description: 'Blocker title' },
        description: { type: 'string', description: 'Blocker description' },
        impact: { type: 'string', enum: ['high', 'medium', 'low'] },
        reportedBy: { type: 'string', description: 'Reporter name' },
      },
      required: ['projectId', 'title', 'description', 'impact', 'reportedBy'],
    },
  },
  {
    name: 'add-risk',
    description: 'Add a project risk',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        title: { type: 'string', description: 'Risk title' },
        description: { type: 'string', description: 'Risk description' },
        probability: { type: 'string', enum: ['high', 'medium', 'low'] },
        impact: { type: 'string', enum: ['high', 'medium', 'low'] },
        mitigation: { type: 'string', description: 'Mitigation strategy' },
      },
      required: ['projectId', 'title', 'description', 'probability', 'impact'],
    },
  },
];
