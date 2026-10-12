/**
 * Lightweight runtime validators for tool inputs. Each parser returns either a
 * typed value or a list of human-readable issues; they never throw.
 */

import type { HealthStatus, Project, ProjectStatus } from './types.js';

export type Parsed<T> = { ok: true; value: T } | { ok: false; issues: string[] };

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'planning',
  'in-progress',
  'blocked',
  'completed',
  'on-hold',
];

export const HEALTH_STATUSES: readonly HealthStatus[] = ['excellent', 'good', 'fair', 'poor', 'critical'];

export type Dict = Record<string, unknown>;

export function isRecord(value: unknown): value is Dict {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function finish<T>(issues: string[], value: T): Parsed<T> {
  return issues.length === 0 ? { ok: true, value } : { ok: false, issues };
}

export function requireRecord(value: unknown, label: string, issues: string[]): Dict | undefined {
  if (!isRecord(value)) {
    issues.push(`${label} must be an object`);
    return undefined;
  }
  return value;
}

export function checkString(
  obj: Dict,
  key: string,
  issues: string[],
  opts: { optional?: boolean } = {},
): string | undefined {
  const value = obj[key];
  if (value === undefined && opts.optional) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    issues.push(`${key} must be a non-empty string`);
    return undefined;
  }
  return value;
}

export function checkNumber(
  obj: Dict,
  key: string,
  issues: string[],
  opts: { optional?: boolean; min?: number; max?: number; integer?: boolean } = {},
): number | undefined {
  const value = obj[key];
  if (value === undefined && opts.optional) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push(`${key} must be a finite number`);
    return undefined;
  }
  if (opts.integer && !Number.isInteger(value)) {
    issues.push(`${key} must be an integer`);
    return undefined;
  }
  if (opts.min !== undefined && value < opts.min) {
    issues.push(`${key} must be >= ${opts.min}`);
    return undefined;
  }
  if (opts.max !== undefined && value > opts.max) {
    issues.push(`${key} must be <= ${opts.max}`);
    return undefined;
  }
  return value;
}

export function checkEnum<T extends string>(
  obj: Dict,
  key: string,
  allowed: readonly T[],
  issues: string[],
): T | undefined {
  const value = obj[key];
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    issues.push(`${key} must be one of: ${allowed.join(', ')}`);
    return undefined;
  }
  return value as T;
}

export function checkStringArray(
  obj: Dict,
  key: string,
  issues: string[],
  opts: { optional?: boolean } = {},
): string[] | undefined {
  const value = obj[key];
  if (value === undefined && opts.optional) return undefined;
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
    issues.push(`${key} must be an array of strings`);
    return undefined;
  }
  return value as string[];
}

export function checkDate(
  obj: Dict,
  key: string,
  issues: string[],
  opts: { optional?: boolean } = {},
): string | undefined {
  const value = checkString(obj, key, issues, opts);
  if (value !== undefined && Number.isNaN(Date.parse(value))) {
    issues.push(`${key} must be a date (YYYY-MM-DD or ISO 8601)`);
    return undefined;
  }
  return value;
}

/**
 * Checks the top-level shape of a Project. Nested collections (team, risks,
 * blockers, metrics, dependencies) are checked only to be arrays.
 */
export function parseProject(value: unknown, label: string, issues: string[]): Project | undefined {
  const obj = requireRecord(value, label, issues);
  if (!obj) return undefined;

  const before = issues.length;
  const sub: string[] = [];
  checkString(obj, 'id', sub);
  checkString(obj, 'name', sub);
  checkString(obj, 'owner', sub);
  checkEnum(obj, 'status', PROJECT_STATUSES, sub);
  checkEnum(obj, 'health', HEALTH_STATUSES, sub);
  checkDate(obj, 'startDate', sub);
  checkDate(obj, 'targetDate', sub, { optional: true });
  checkDate(obj, 'completionDate', sub, { optional: true });
  checkNumber(obj, 'progress', sub, { min: 0, max: 100 });
  checkNumber(obj, 'updatedAt', sub, { min: 0 });

  const stats = requireRecord(obj.stats, 'stats', sub);
  if (stats) {
    for (const key of ['tasksCompleted', 'tasksTotal', 'blockedTasks', 'inProgressTasks']) {
      checkNumber(stats, key, sub, { min: 0, integer: true });
    }
    checkNumber(stats, 'completionPercentage', sub, { min: 0, max: 100 });
  }

  for (const key of ['team', 'risks', 'blockers', 'metrics', 'dependencies']) {
    if (obj[key] !== undefined && !Array.isArray(obj[key])) sub.push(`${key} must be an array when present`);
  }

  issues.push(...sub.map((s) => `${label}.${s}`));
  return issues.length === before ? (obj as unknown as Project) : undefined;
}
