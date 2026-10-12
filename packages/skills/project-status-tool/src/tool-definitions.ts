/**
 * Name, description and JSON Schema for each tool. Used by the CLI (--list) and
 * by the MCP skill registration in index.ts.
 */

import type { ToolName } from './contracts.js';
import { PROJECT_STATUSES } from './validation.js';

export interface ToolSpec {
  name: ToolName;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

const projectSchema = {
  type: 'object',
  description: 'Project object (as returned by create-project). Required: id, name, owner, status, health, startDate, progress, stats, updatedAt.',
};

export const TOOL_SPECS: readonly ToolSpec[] = [
  {
    name: 'create-project',
    description: 'Create a new project in the planning state.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        owner: { type: 'string' },
        description: { type: 'string' },
        targetDate: { type: 'string', description: 'YYYY-MM-DD or ISO 8601' },
        teamMembers: { type: 'array', items: { type: 'string' } },
      },
      required: ['name', 'owner'],
    },
  },
  {
    name: 'update-project-progress',
    description: 'Recalculate progress and health from completed and total task counts.',
    inputSchema: {
      type: 'object',
      properties: {
        project: projectSchema,
        tasksCompleted: { type: 'integer', minimum: 0 },
        tasksTotal: { type: 'integer', minimum: 0 },
      },
      required: ['project', 'tasksCompleted', 'tasksTotal'],
    },
  },
  {
    name: 'update-project-status',
    description: 'Set a project status. Completing a project stamps completionDate.',
    inputSchema: {
      type: 'object',
      properties: {
        project: projectSchema,
        status: { type: 'string', enum: [...PROJECT_STATUSES] },
        notes: { type: 'string' },
      },
      required: ['project', 'status'],
    },
  },
  {
    name: 'validate-project',
    description: 'Check a project for shape and semantic errors (name, owner, progress range).',
    inputSchema: {
      type: 'object',
      properties: { project: projectSchema },
      required: ['project'],
    },
  },
  {
    name: 'generate-dashboard',
    description: 'Aggregate a list of projects into a portfolio dashboard with a formatted text view.',
    inputSchema: {
      type: 'object',
      properties: { projects: { type: 'array', items: projectSchema } },
      required: ['projects'],
    },
  },
  {
    name: 'summarize-project-status',
    description: 'Summarize current project status, risks, and next actions.',
    inputSchema: {
      type: 'object',
      properties: {
        objective: { type: 'string', description: 'Primary objective for this tool invocation' },
        context: { type: 'string', description: 'Optional contextual details' },
        projects: { type: 'array', items: projectSchema },
      },
      required: ['objective'],
    },
  },
];
