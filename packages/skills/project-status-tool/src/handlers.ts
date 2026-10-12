/**
 * Tool dispatcher: maps tool names to validated handlers. Bad input produces a
 * typed ToolError instead of an exception.
 */

import type {
  CreateProjectInput,
  GenerateDashboardInput,
  SummarizeProjectStatusInput,
  ToolContracts,
  ToolError,
  ToolName,
  ToolOutput,
  ToolResult,
  UpdateProjectProgressInput,
  UpdateProjectStatusInput,
  ValidateProjectInput,
} from './contracts.js';
import { TOOL_NAMES } from './contracts.js';
import { createProject, updateProjectProgress, updateProjectStatus, validateProject } from './tools/create-project.js';
import { generateDashboard, formatDashboard } from './tools/dashboard.js';
import { summarizeProjectStatus } from './tools/summarize-project-status.js';
import {
  checkEnum,
  checkNumber,
  checkString,
  checkStringArray,
  checkDate,
  finish,
  parseProject,
  PROJECT_STATUSES,
  requireRecord,
  type Dict,
  type Parsed,
} from './validation.js';

type Handler<I, O> = {
  parse: (input: unknown) => Parsed<I>;
  run: (input: I) => O;
};

type HandlerMap = { [N in ToolName]: Handler<ToolContracts[N]['input'], ToolContracts[N]['output']> };

function parseCreateProject(input: unknown): Parsed<CreateProjectInput> {
  const issues: string[] = [];
  const obj = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as CreateProjectInput);
  const name = checkString(obj, 'name', issues);
  const owner = checkString(obj, 'owner', issues);
  const description = checkString(obj, 'description', issues, { optional: true });
  const targetDate = checkDate(obj, 'targetDate', issues, { optional: true });
  const teamMembers = checkStringArray(obj, 'teamMembers', issues, { optional: true });
  return finish(issues, { name: name!, owner: owner!, description, targetDate, teamMembers });
}

function parseProgressInput(input: unknown): Parsed<UpdateProjectProgressInput> {
  const issues: string[] = [];
  const obj = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as UpdateProjectProgressInput);
  const project = parseProject(obj.project, 'project', issues);
  const tasksTotal = checkNumber(obj, 'tasksTotal', issues, { min: 0, integer: true });
  const tasksCompleted = checkNumber(obj, 'tasksCompleted', issues, { min: 0, integer: true });
  if (tasksCompleted !== undefined && tasksTotal !== undefined && tasksCompleted > tasksTotal) {
    issues.push('tasksCompleted must be <= tasksTotal');
  }
  return finish(issues, { project: project!, tasksCompleted: tasksCompleted!, tasksTotal: tasksTotal! });
}

function parseStatusInput(input: unknown): Parsed<UpdateProjectStatusInput> {
  const issues: string[] = [];
  const obj = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as UpdateProjectStatusInput);
  const project = parseProject(obj.project, 'project', issues);
  const status = checkEnum(obj, 'status', PROJECT_STATUSES, issues);
  const notes = checkString(obj, 'notes', issues, { optional: true });
  return finish(issues, { project: project!, status: status!, notes });
}

function parseValidateInput(input: unknown): Parsed<ValidateProjectInput> {
  const issues: string[] = [];
  const obj = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as ValidateProjectInput);
  const project = parseProject(obj.project, 'project', issues);
  return finish(issues, { project: project! });
}

function parseDashboardInput(input: unknown): Parsed<GenerateDashboardInput> {
  const issues: string[] = [];
  const obj = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as GenerateDashboardInput);
  if (!Array.isArray(obj.projects)) {
    issues.push('projects must be an array');
    return finish(issues, {} as GenerateDashboardInput);
  }
  const projects = obj.projects.flatMap((p, i) => {
    const parsed = parseProject(p, `projects[${i}]`, issues);
    return parsed ? [parsed] : [];
  });
  return finish(issues, { projects });
}

function parseSummaryInput(input: unknown): Parsed<SummarizeProjectStatusInput> {
  const issues: string[] = [];
  const obj: Dict | undefined = requireRecord(input, 'input', issues);
  if (!obj) return finish(issues, {} as SummarizeProjectStatusInput);
  const objective = checkString(obj, 'objective', issues);
  const context = checkString(obj, 'context', issues, { optional: true });
  let projects: SummarizeProjectStatusInput['projects'];
  if (obj.projects !== undefined) {
    if (!Array.isArray(obj.projects)) {
      issues.push('projects must be an array when present');
    } else {
      projects = obj.projects.flatMap((p, i) => {
        const parsed = parseProject(p, `projects[${i}]`, issues);
        return parsed ? [parsed] : [];
      });
    }
  }
  return finish(issues, { objective: objective!, context, projects });
}

export const HANDLERS: HandlerMap = {
  'create-project': {
    parse: parseCreateProject,
    run: (input) => ({ project: createProject(input) }),
  },
  'update-project-progress': {
    parse: parseProgressInput,
    run: (input) => ({
      project: updateProjectProgress(input.project, input.tasksCompleted, input.tasksTotal),
    }),
  },
  'update-project-status': {
    parse: parseStatusInput,
    run: (input) => ({ project: updateProjectStatus(input.project, input.status, input.notes) }),
  },
  'validate-project': {
    parse: parseValidateInput,
    run: (input) => validateProject(input.project),
  },
  'generate-dashboard': {
    parse: parseDashboardInput,
    run: (input) => {
      const dashboard = generateDashboard(input);
      return { dashboard, text: formatDashboard(dashboard) };
    },
  },
  'summarize-project-status': {
    parse: parseSummaryInput,
    run: (input) => summarizeProjectStatus(input),
  },
};

export function isToolName(name: unknown): name is ToolName {
  return typeof name === 'string' && (TOOL_NAMES as readonly string[]).includes(name);
}

/**
 * Validate and run a tool by name. Never throws for bad input.
 */
export function runTool(name: string, input: unknown): ToolResult<ToolOutput> {
  if (!isToolName(name)) {
    return fail('UNKNOWN_TOOL', `Unknown tool "${name}". Available tools: ${TOOL_NAMES.join(', ')}`);
  }
  const handler = HANDLERS[name] as unknown as Handler<unknown, ToolOutput>;
  const parsed = handler.parse(input);
  if (!parsed.ok) {
    return fail('INVALID_INPUT', `Invalid input for tool "${name}"`, parsed.issues);
  }
  try {
    return { ok: true, data: handler.run(parsed.value) };
  } catch (err) {
    return fail('INTERNAL_ERROR', err instanceof Error ? err.message : String(err));
  }
}

function fail(code: ToolError['code'], message: string, issues?: string[]): { ok: false; error: ToolError } {
  return { ok: false, error: issues ? { code, message, issues } : { code, message } };
}
