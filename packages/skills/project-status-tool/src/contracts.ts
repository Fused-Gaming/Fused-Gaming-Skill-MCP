/**
 * Typed input/output contracts for every tool exposed by this package.
 */

import type {
  HealthStatus,
  Project,
  ProjectDashboard,
  ProjectStatus,
} from './types.js';

export const TOOL_NAMES = [
  'create-project',
  'update-project-progress',
  'update-project-status',
  'validate-project',
  'generate-dashboard',
  'summarize-project-status',
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

export interface CreateProjectInput {
  name: string;
  owner: string;
  description?: string;
  targetDate?: string;
  teamMembers?: string[];
}

export interface CreateProjectOutput {
  project: Project;
}

export interface UpdateProjectProgressInput {
  project: Project;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface UpdateProjectProgressOutput {
  project: Project;
}

export interface UpdateProjectStatusInput {
  project: Project;
  status: ProjectStatus;
  notes?: string;
}

export interface UpdateProjectStatusOutput {
  project: Project;
}

export interface ValidateProjectInput {
  project: Project;
}

export interface ValidateProjectOutput {
  valid: boolean;
  errors: string[];
}

export interface GenerateDashboardInput {
  projects: Project[];
}

export interface GenerateDashboardOutput {
  dashboard: ProjectDashboard;
  text: string;
}

export interface ProjectSummary {
  headline: string;
  totalProjects: number;
  averageProgress: number;
  overallHealth: HealthStatus;
  byStatus: Record<ProjectStatus, number>;
  criticalRiskTitles: string[];
  openBlockerTitles: string[];
  nextActions: string[];
}

export interface SummarizeProjectStatusInput {
  objective: string;
  context?: string;
  projects?: Project[];
}

export interface SummarizeProjectStatusOutput {
  success: true;
  tool: 'summarize-project-status';
  objective: string;
  context: string;
  summary: ProjectSummary;
}

/** Map of tool name to its input and output contract. */
export interface ToolContracts {
  'create-project': { input: CreateProjectInput; output: CreateProjectOutput };
  'update-project-progress': { input: UpdateProjectProgressInput; output: UpdateProjectProgressOutput };
  'update-project-status': { input: UpdateProjectStatusInput; output: UpdateProjectStatusOutput };
  'validate-project': { input: ValidateProjectInput; output: ValidateProjectOutput };
  'generate-dashboard': { input: GenerateDashboardInput; output: GenerateDashboardOutput };
  'summarize-project-status': { input: SummarizeProjectStatusInput; output: SummarizeProjectStatusOutput };
}

export type ToolOutput = ToolContracts[ToolName]['output'];

export type ToolErrorCode =
  | 'UNKNOWN_TOOL'
  | 'INVALID_INPUT'
  | 'INVALID_JSON'
  | 'INVALID_ARGUMENTS'
  | 'INTERNAL_ERROR';

export interface ToolError {
  code: ToolErrorCode;
  message: string;
  issues?: string[];
}

export type ToolResult<T> = { ok: true; data: T } | { ok: false; error: ToolError };
