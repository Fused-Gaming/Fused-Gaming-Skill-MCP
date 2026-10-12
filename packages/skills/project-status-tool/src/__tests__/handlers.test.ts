import { describe, expect, it } from '@jest/globals';
import { HANDLERS, isToolName, runTool } from '../handlers.js';
import { TOOL_NAMES } from '../contracts.js';
import { makeProject } from './fixtures.js';

describe('tool registry', () => {
  it('has a handler for every tool name', () => {
    for (const name of TOOL_NAMES) {
      expect(HANDLERS[name]).toBeDefined();
    }
  });

  it('isToolName recognises only declared names', () => {
    expect(isToolName('create-project')).toBe(true);
    expect(isToolName('nope')).toBe(false);
    expect(isToolName(42)).toBe(false);
  });
});

describe('create-project', () => {
  it('succeeds with required fields', () => {
    const result = runTool('create-project', { name: 'Beta', owner: 'bob', teamMembers: ['cy'] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const data = result.data as { project: { name: string; status: string; team: unknown[] } };
    expect(data.project.name).toBe('Beta');
    expect(data.project.status).toBe('planning');
    expect(data.project.team).toHaveLength(1);
  });

  it('rejects a missing owner with INVALID_INPUT and issue list', () => {
    const result = runTool('create-project', { name: 'Beta' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('INVALID_INPUT');
    expect(result.error.issues).toContain('owner must be a non-empty string');
  });

  it('rejects a malformed targetDate', () => {
    const result = runTool('create-project', { name: 'B', owner: 'o', targetDate: 'someday' });
    expect(result.ok).toBe(false);
  });
});

describe('update-project-progress', () => {
  it('computes percentage and health', () => {
    const result = runTool('update-project-progress', {
      project: makeProject(),
      tasksCompleted: 9,
      tasksTotal: 10,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { project } = result.data as { project: { progress: number; health: string } };
    expect(project.progress).toBe(90);
    expect(project.health).toBe('excellent');
  });

  it('rejects completed > total', () => {
    const result = runTool('update-project-progress', {
      project: makeProject(),
      tasksCompleted: 11,
      tasksTotal: 10,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues).toContain('tasksCompleted must be <= tasksTotal');
  });

  it('rejects a project missing required fields', () => {
    const result = runTool('update-project-progress', { project: { name: 'x' }, tasksCompleted: 1, tasksTotal: 2 });
    expect(result.ok).toBe(false);
  });
});

describe('update-project-status', () => {
  it('sets a new status', () => {
    const result = runTool('update-project-status', { project: makeProject(), status: 'blocked', notes: 'waiting' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect((result.data as { project: { status: string } }).project.status).toBe('blocked');
  });

  it('rejects an unknown status', () => {
    const result = runTool('update-project-status', { project: makeProject(), status: 'done' });
    expect(result.ok).toBe(false);
  });
});

describe('validate-project', () => {
  it('reports valid for a well-formed project', () => {
    const result = runTool('validate-project', { project: makeProject() });
    expect(result).toEqual({ ok: true, data: { valid: true, errors: [] } });
  });

  it('rejects an empty project name at input validation', () => {
    const result = runTool('validate-project', { project: makeProject({ name: '  ' }) });
    expect(result.ok).toBe(false);
  });

  it('rejects non-object input', () => {
    const result = runTool('validate-project', 'not an object');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('INVALID_INPUT');
  });
});

describe('generate-dashboard', () => {
  it('aggregates counts and returns formatted text', () => {
    const result = runTool('generate-dashboard', {
      projects: [makeProject({ status: 'completed' }), makeProject({ id: 'p2', status: 'blocked' })],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { dashboard, text } = result.data as {
      dashboard: { totalProjects: number; completedProjects: number; blockedProjects: number };
      text: string;
    };
    expect(dashboard.totalProjects).toBe(2);
    expect(dashboard.completedProjects).toBe(1);
    expect(dashboard.blockedProjects).toBe(1);
    expect(text).toContain('PROJECT STATUS DASHBOARD');
  });

  it('reports the index of an invalid project', () => {
    const result = runTool('generate-dashboard', { projects: [makeProject(), { id: 'x' }] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues?.some((i) => i.startsWith('projects[1].'))).toBe(true);
  });

  it('rejects a non-array projects field', () => {
    const result = runTool('generate-dashboard', { projects: 'nope' });
    expect(result.ok).toBe(false);
  });
});

describe('summarize-project-status', () => {
  it('succeeds with only an objective and returns a summary', () => {
    const result = runTool('summarize-project-status', { objective: 'Weekly review' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const data = result.data as { success: boolean; objective: string; summary: { nextActions: string[] } };
    expect(data.success).toBe(true);
    expect(data.objective).toBe('Weekly review');
    expect(data.summary.nextActions).toEqual(['No immediate actions required.']);
  });

  it('rejects input without an objective', () => {
    const result = runTool('summarize-project-status', { context: 'x' });
    expect(result.ok).toBe(false);
  });

  it('rejects a non-array projects field', () => {
    const result = runTool('summarize-project-status', { objective: 'x', projects: {} });
    expect(result.ok).toBe(false);
  });
});

describe('dispatcher errors', () => {
  it('returns UNKNOWN_TOOL for an unknown name', () => {
    const result = runTool('does-not-exist', {});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('UNKNOWN_TOOL');
    expect(result.error.message).toContain('create-project');
  });
});
