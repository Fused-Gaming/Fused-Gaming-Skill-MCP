import { describe, expect, it } from '@jest/globals';
import { parseCliArgs } from '../cli-args.js';

const noStdin = (): string => {
  throw new Error('stdin should not be read');
};

describe('parseCliArgs', () => {
  it('parses a tool name and inline JSON without reading stdin', () => {
    const result = parseCliArgs(['validate-project', '{"project":{}}'], noStdin);
    expect(result).toEqual({ kind: 'run', tool: 'validate-project', input: { project: {} } });
  });

  it('reads JSON from stdin when no JSON argument is given', () => {
    const result = parseCliArgs(['generate-dashboard'], () => '{"projects":[]}\n');
    expect(result).toEqual({ kind: 'run', tool: 'generate-dashboard', input: { projects: [] } });
  });

  it('returns INVALID_JSON for malformed JSON', () => {
    const result = parseCliArgs(['create-project', '{bad'], noStdin);
    expect(result.kind).toBe('error');
    if (result.kind !== 'error') return;
    expect(result.error.code).toBe('INVALID_JSON');
  });

  it('returns INVALID_ARGUMENTS when stdin is empty and no JSON argument is given', () => {
    const result = parseCliArgs(['create-project'], () => '   ');
    expect(result.kind).toBe('error');
    if (result.kind !== 'error') return;
    expect(result.error.code).toBe('INVALID_ARGUMENTS');
  });

  it('returns INVALID_ARGUMENTS with no arguments at all', () => {
    const result = parseCliArgs([], noStdin);
    expect(result.kind === 'error' && result.error.code).toBe('INVALID_ARGUMENTS');
  });

  it('rejects unsplit JSON arguments', () => {
    const result = parseCliArgs(['create-project', '{"a":1}', 'extra'], noStdin);
    expect(result.kind === 'error' && result.error.message).toContain('Too many arguments');
  });

  it('recognises --help, -h and --list without reading stdin', () => {
    expect(parseCliArgs(['--help'], noStdin)).toEqual({ kind: 'help' });
    expect(parseCliArgs(['-h'], noStdin)).toEqual({ kind: 'help' });
    expect(parseCliArgs(['--list'], noStdin)).toEqual({ kind: 'list' });
  });

  it('rejects unknown options', () => {
    const result = parseCliArgs(['--frobnicate'], noStdin);
    expect(result.kind === 'error' && result.error.code).toBe('INVALID_ARGUMENTS');
  });
});
