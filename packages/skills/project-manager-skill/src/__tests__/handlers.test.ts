import { isCalendarDate, parseTask, runTool, TOOL_NAMES } from '../handlers.js';
import type { Task } from '../types.js';

const task: Task = {
  id: 'task_1',
  title: 'Write docs',
  status: 'todo',
  priority: 'medium',
  createdAt: 1,
  updatedAt: 1,
};

describe('isCalendarDate', () => {
  it('accepts real dates', () => {
    expect(isCalendarDate('2026-10-12')).toBe(true);
    expect(isCalendarDate('2028-02-29')).toBe(true);
  });

  it('rejects malformed or impossible dates', () => {
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('12/10/2026')).toBe(false);
    expect(isCalendarDate('2026-1-5')).toBe(false);
  });
});

describe('parseTask', () => {
  it('returns the task when the shape is valid', () => {
    const issues: string[] = [];
    expect(parseTask(task, issues)).toEqual(task);
    expect(issues).toEqual([]);
  });

  it('reports each missing or invalid field', () => {
    const issues: string[] = [];
    expect(parseTask({ id: '', status: 'nope', priority: 'urgent' }, issues)).toBeUndefined();
    expect(issues).toEqual(
      expect.arrayContaining([
        'task.id must be a non-empty string',
        expect.stringContaining('task.status must be one of'),
        expect.stringContaining('task.priority must be one of'),
        'task.createdAt must be a number',
      ]),
    );
  });

  it('rejects non-object input', () => {
    const issues: string[] = [];
    expect(parseTask('task', issues)).toBeUndefined();
    expect(issues).toEqual(['task must be an object']);
  });
});

describe('create-task', () => {
  it('returns a todo task for a valid title', () => {
    const result = runTool('create-task', { title: 'Ship it', priority: 'high', dueDate: '2026-10-30' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.data as { task: Task }).task).toMatchObject({ title: 'Ship it', priority: 'high', status: 'todo' });
    }
  });

  it('fails when the title is missing', () => {
    const result = runTool('create-task', { title: '  ' });
    expect(result).toMatchObject({ ok: false, error: 'Invalid input', issues: ['title is required'] });
  });

  it('fails for an impossible due date and bad estimate', () => {
    const result = runTool('create-task', { title: 'X', dueDate: '2026-02-30', estimatedHours: -2 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual([
        'dueDate must be a valid calendar date in YYYY-MM-DD format',
        'estimatedHours must be a non-negative finite number',
      ]);
    }
  });

  it('fails when labels are not strings', () => {
    const result = runTool('create-task', { title: 'X', labels: ['ok', 3] });
    expect(result.ok).toBe(false);
  });
});

describe('update-task-status', () => {
  it('moves a task to done and stamps completedAt', () => {
    const result = runTool('update-task-status', { task, status: 'done' });
    expect(result.ok).toBe(true);
    if (result.ok) expect((result.data as { task: Task }).task.status).toBe('done');
  });

  it('rejects an unknown status', () => {
    const result = runTool('update-task-status', { task, status: 'archived' });
    expect(result).toMatchObject({ ok: false });
  });

  it('rejects a missing task', () => {
    const result = runTool('update-task-status', { status: 'done' });
    expect(result).toMatchObject({ ok: false, issues: ['task must be an object'] });
  });
});

describe('assign-task', () => {
  it('trims and sets the assignee', () => {
    const result = runTool('assign-task', { task, assignee: '  Ana ' });
    expect(result.ok && (result.data as { task: Task }).task.assignee).toBe('Ana');
  });

  it('requires a non-empty assignee', () => {
    expect(runTool('assign-task', { task, assignee: '' })).toMatchObject({ ok: false, issues: ['assignee is required'] });
  });
});

describe('log-task-time', () => {
  it('adds hours to the task', () => {
    const result = runTool('log-task-time', { task: { ...task, actualHours: 1 }, hours: 2 });
    expect(result.ok && (result.data as { task: Task }).task.actualHours).toBe(3);
  });

  it.each([0, -1, Number.NaN, '2'])('rejects hours value %p', (hours) => {
    expect(runTool('log-task-time', { task, hours })).toMatchObject({ ok: false });
  });
});

describe('add-task-label and add-task-dependency', () => {
  it('adds a trimmed label', () => {
    const result = runTool('add-task-label', { task, label: ' urgent ' });
    expect(result.ok && (result.data as { task: Task }).task.labels).toEqual(['urgent']);
  });

  it('refuses a self-dependency', () => {
    const result = runTool('add-task-dependency', { task, dependsOn: 'task_1' });
    expect(result).toMatchObject({ ok: false, issues: ['a task cannot depend on itself'] });
  });

  it('adds a dependency on another task', () => {
    const result = runTool('add-task-dependency', { task, dependsOn: 'task_9' });
    expect(result.ok && (result.data as { task: Task }).task.dependencies).toEqual(['task_9']);
  });
});

describe('get-metrics', () => {
  const tasks: Task[] = [
    { ...task, id: 'a', status: 'done', projectId: 'p1' },
    { ...task, id: 'b', status: 'in-progress', projectId: 'p2' },
    { ...task, id: 'c', status: 'todo', projectId: 'p1' },
  ];

  it('computes metrics over all tasks', () => {
    const result = runTool('get-metrics', { tasks });
    expect(result.ok && (result.data as { taskCount: number }).taskCount).toBe(3);
  });

  it('scopes to a project when projectId is given', () => {
    const result = runTool('get-metrics', { tasks, projectId: 'p1' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const data = result.data as { taskCount: number; metrics: { completedTasks: number } };
      expect(data.taskCount).toBe(2);
      expect(data.metrics.completedTasks).toBe(1);
    }
  });

  it('reports the index of an invalid task', () => {
    const result = runTool('get-metrics', { tasks: [task, { id: 'x' }] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]).toContain('tasks[1].');
  });

  it('requires tasks to be an array', () => {
    expect(runTool('get-metrics', { tasks: 'none' })).toMatchObject({ ok: false, issues: ['tasks must be an array'] });
  });
});

describe('runTool dispatch', () => {
  it('returns a structured failure for an unknown tool', () => {
    const result = runTool('delete-everything', {});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]).toBe('unknown tool "delete-everything"');
  });

  it('rejects non-object input for every tool', () => {
    for (const name of TOOL_NAMES) {
      const result = runTool(name, null);
      expect(result).toMatchObject({ ok: false, issues: ['input must be an object'] });
    }
  });
});
