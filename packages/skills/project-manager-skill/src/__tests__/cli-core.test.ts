import { runCli, USAGE } from '../cli-core.js';

const task = { id: 'task_1', title: 'Write docs', status: 'todo', priority: 'medium', createdAt: 1, updatedAt: 1 };

describe('runCli', () => {
  it('prints usage for --help with exit code 0', () => {
    expect(runCli(['--help'])).toEqual({ exitCode: 0, output: USAGE });
  });

  it('fails with exit code 1 when no tool is given', () => {
    const result = runCli([]);
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.output)).toMatchObject({ ok: false, error: 'Missing tool name' });
  });

  it('runs a tool from the argument and returns exit code 0 on success', () => {
    const result = runCli(['create-task', '{"title":"Ship"}']);
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.output)).toMatchObject({ ok: true, data: { task: { title: 'Ship' } } });
  });

  it('reads JSON from stdin when no argument is given', () => {
    const result = runCli(['assign-task'], JSON.stringify({ task, assignee: 'Ana' }));
    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.output).data.task.assignee).toBe('Ana');
  });

  it('fails when no JSON is supplied at all', () => {
    const result = runCli(['create-task'], '   ');
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.output).error).toBe('Missing JSON input');
  });

  it('reports invalid JSON with exit code 1', () => {
    const result = runCli(['create-task', '{not json']);
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.output)).toMatchObject({ ok: false, error: 'Invalid JSON input' });
  });

  it('propagates handler validation failures as exit code 1', () => {
    const result = runCli(['create-task', '{"title":""}']);
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.output).ok).toBe(false);
  });

  it('rejects extra arguments instead of ignoring them', () => {
    const result = runCli(['create-task', '{"title":"x"}', 'unexpected']);
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.output)).toMatchObject({ ok: false, error: 'Too many arguments' });
  });
});
