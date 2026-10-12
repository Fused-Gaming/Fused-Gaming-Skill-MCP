import {
  addTaskDependency,
  addTaskLabel,
  assignTask,
  calculateMetrics,
  createTask,
  logTaskTime,
  updateTaskStatus,
  validateTask,
} from '../tools/task-management.js';
import type { Task } from '../types.js';

const base = (overrides: Partial<Task> = {}): Task => ({
  id: 'task_1',
  title: 'Write docs',
  status: 'todo',
  priority: 'medium',
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe('createTask', () => {
  it('creates a todo task with defaults and a unique id', () => {
    const a = createTask({ title: 'A' });
    const b = createTask({ title: 'B' });
    expect(a.status).toBe('todo');
    expect(a.priority).toBe('medium');
    expect(a.id).not.toBe(b.id);
  });

  it('keeps supplied fields', () => {
    const task = createTask({ title: 'A', priority: 'high', assignee: 'Ana', labels: ['ui'] });
    expect(task).toMatchObject({ title: 'A', priority: 'high', assignee: 'Ana', labels: ['ui'] });
  });
});

describe('updateTaskStatus', () => {
  it('sets completedAt when moved to done', () => {
    const done = updateTaskStatus(base(), 'done');
    expect(done.status).toBe('done');
    expect(typeof done.completedAt).toBe('number');
  });

  it('clears completedAt when a finished task is reopened', () => {
    const done = updateTaskStatus(base(), 'done');
    const reopened = updateTaskStatus(done, 'in-progress');
    expect(reopened.status).toBe('in-progress');
    expect(reopened.completedAt).toBeUndefined();
    expect('completedAt' in reopened).toBe(false);
  });

  it('does not mutate the input task', () => {
    const task = base();
    updateTaskStatus(task, 'blocked');
    expect(task.status).toBe('todo');
  });
});

describe('labels and dependencies', () => {
  it('adds a label without mutating the original array', () => {
    const original = base({ labels: ['ui'] });
    const updated = addTaskLabel(original, 'api');
    expect(updated.labels).toEqual(['ui', 'api']);
    expect(original.labels).toEqual(['ui']);
  });

  it('does not duplicate an existing label', () => {
    expect(addTaskLabel(base({ labels: ['ui'] }), 'ui').labels).toEqual(['ui']);
  });

  it('adds dependencies immutably and without duplicates', () => {
    const original = base({ dependencies: ['task_2'] });
    const updated = addTaskDependency(original, 'task_3');
    expect(updated.dependencies).toEqual(['task_2', 'task_3']);
    expect(original.dependencies).toEqual(['task_2']);
    expect(addTaskDependency(updated, 'task_2').dependencies).toEqual(['task_2', 'task_3']);
  });
});

describe('assignTask and logTaskTime', () => {
  it('assigns a member', () => {
    expect(assignTask(base(), 'Ana').assignee).toBe('Ana');
  });

  it('accumulates logged hours', () => {
    const once = logTaskTime(base(), 2);
    expect(logTaskTime(once, 1.5).actualHours).toBe(3.5);
  });
});

describe('calculateMetrics', () => {
  it('counts statuses and completion percentage', () => {
    const metrics = calculateMetrics([
      base({ id: '1', status: 'done' }),
      base({ id: '2', status: 'in-progress' }),
      base({ id: '3', status: 'blocked' }),
      base({ id: '4', status: 'todo' }),
    ]);
    expect(metrics).toMatchObject({
      totalTasks: 4,
      completedTasks: 1,
      inProgressTasks: 1,
      blockedTasks: 1,
      completionPercentage: 25,
    });
  });

  it('sums estimated and actual hours', () => {
    const metrics = calculateMetrics([
      base({ estimatedHours: 3, actualHours: 1 }),
      base({ estimatedHours: 5, actualHours: 2 }),
    ]);
    expect(metrics.totalEstimatedHours).toBe(8);
    expect(metrics.totalActualHours).toBe(3);
  });

  it('reports overdue open tasks only', () => {
    const metrics = calculateMetrics([
      base({ id: 'late', dueDate: '2000-01-01' }),
      base({ id: 'late-done', dueDate: '2000-01-01', status: 'done' }),
      base({ id: 'future', dueDate: '2999-01-01' }),
    ]);
    expect(metrics.overdueTasks).toBe(1);
  });

  it.each([
    [['critical', 'critical', 'critical'], 'critical'],
    [['high', 'high', 'high'], 'high'],
    [['medium', 'medium'], 'medium'],
    [['low', 'low'], 'low'],
    [['high', 'low'], 'medium'],
  ] as const)('maps priorities %j to average %s', (priorities, expected) => {
    const metrics = calculateMetrics(priorities.map((priority, i) => base({ id: `t${i}`, priority })));
    expect(metrics.averagePriority).toBe(expected);
  });

  it('returns zeroed metrics and medium priority for an empty list', () => {
    expect(calculateMetrics([])).toMatchObject({
      totalTasks: 0,
      completionPercentage: 0,
      averagePriority: 'medium',
    });
  });
});

describe('validateTask', () => {
  it('accepts a valid task', () => {
    expect(validateTask(base())).toEqual({ valid: true, errors: [] });
  });

  it('reports a blank title and negative estimate', () => {
    const result = validateTask(base({ title: '   ', estimatedHours: -1 }));
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(['Task title is required', 'Estimated hours cannot be negative']);
  });
});
