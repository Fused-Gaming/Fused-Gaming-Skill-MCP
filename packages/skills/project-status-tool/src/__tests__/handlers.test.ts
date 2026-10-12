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

  it('reports an empty project name as a validation error', () => {
    const result = runTool('validate-project', { project: makeProject({ name: '  ' }) });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toMatchObject({ valid: false });
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

describe('nested collection and date validation', () => {
  it('reports null entries in nested collections as validation errors', () => {
    const result = runTool('validate-project', { project: { ...makeProject(), risks: [null] } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toMatchObject({ valid: false });
    expect(JSON.stringify(result.data)).toContain('risks[0]');
  });

  it('rejects blank team member names at create time', () => {
    const result = runTool('create-project', { name: 'Beta', owner: 'bob', teamMembers: ['  '] });
    expect(result).toMatchObject({ ok: false });
  });

  it('treats a full timestamp as overdue at its exact deadline, but a date-only target as due all day', async () => {
    const { summarizeProjectStatus } = await import('../tools/summarize-project-status.js');
    const now = Date.parse('2026-10-11T18:00:00Z');
    const timed = summarizeProjectStatus(
      { objective: 'x', projects: [makeProject({ targetDate: '2026-10-11T18:00:00Z' })] } as never,
      now,
    );
    expect(JSON.stringify(timed)).toContain('has passed');
    const dateOnly = summarizeProjectStatus(
      { objective: 'x', projects: [makeProject({ targetDate: '2026-10-11' })] } as never,
      now,
    );
    expect(JSON.stringify(dateOnly)).not.toContain('has passed');
  });

  it('rejects malformed risk fields instead of letting them reach summaries', () => {
    const result = runTool('generate-dashboard', {
      projects: [{ ...makeProject(), risks: [{ id: 'r1', title: 'x', description: 'y', probability: 'extreme', impact: 'high', status: 'open' }] }],
    });
    expect(result.ok).toBe(false);
  });

  it('reports team entries without numeric task counts as invalid', () => {
    const result = runTool('validate-project', {
      project: { ...makeProject(), team: [{ name: 'Ana', role: 'dev', tasksAssigned: 'many', tasksCompleted: 0, lastActivity: '2026-10-01' }] },
    });
    expect(result).toMatchObject({ ok: true, data: { valid: false } });
  });

  it('accepts a metric without a trend', () => {
    const result = runTool('validate-project', {
      project: { ...makeProject(), metrics: [{ name: 'velocity', value: 4 }] },
    });
    expect(result).toEqual({ ok: true, data: { valid: true, errors: [] } });
  });

  it.each(['2026-02-30', '12/10/2026', '2026-1-5', 'Tuesday, 6 October 2026'])('reports date %p as invalid', (startDate) => {
    const result = runTool('validate-project', { project: makeProject({ startDate }) });
    expect(result).toMatchObject({ ok: true, data: { valid: false } });
  });

  it('accepts a full ISO 8601 timestamp for a date field', () => {
    const result = runTool('validate-project', { project: makeProject({ targetDate: '2026-10-30T12:00:00Z' }) });
    expect(result).toEqual({ ok: true, data: { valid: true, errors: [] } });
  });
});
