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

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * Accepts only YYYY-MM-DD or a full ISO 8601 timestamp. Date.parse alone is too
 * lenient (it accepts impossible dates like 2026-02-30 and locale strings), so
 * date-only values must also round-trip through their calendar components.
 */
export function isValidDate(value: string): boolean {
  if (DATE_ONLY.test(value)) {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }
  return ISO_DATETIME.test(value) && !Number.isNaN(Date.parse(value));
}

export function checkDate(
  obj: Dict,
  key: string,
  issues: string[],
  opts: { optional?: boolean } = {},
): string | undefined {
  const value = checkString(obj, key, issues, opts);
  if (value !== undefined && !isValidDate(value)) {
    issues.push(`${key} must be a date (YYYY-MM-DD or ISO 8601)`);
    return undefined;
  }
  return value;
}

type EntryCheck = (entry: Dict, issues: string[]) => void;

/**
 * Validates each entry of an optional nested collection. A missing collection is
 * fine; a present one must be an array whose entries pass the entry check.
 */
function checkCollection(obj: Dict, key: string, check: EntryCheck, issues: string[]): void {
  const value = obj[key];
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    issues.push(`${key} must be an array when present`);
    return;
  }
  value.forEach((entry, index) => {
    const entryIssues: string[] = [];
    const record = requireRecord(entry, `${key}[${index}]`, entryIssues);
    if (record) check(record, entryIssues);
    issues.push(...entryIssues.map((message) => `${key}[${index}] ${message}`));
  });
}

const LEVELS = ['high', 'medium', 'low'] as const;

const checkTeamMember: EntryCheck = (entry, issues) => {
  checkString(entry, 'name', issues);
  checkString(entry, 'role', issues);
  checkNumber(entry, 'tasksAssigned', issues, { min: 0, integer: true });
  checkNumber(entry, 'tasksCompleted', issues, { min: 0, integer: true });
  checkString(entry, 'lastActivity', issues);
};

const checkMetric: EntryCheck = (entry, issues) => {
  checkString(entry, 'name', issues);
  checkNumber(entry, 'value', issues);
  checkNumber(entry, 'target', issues, { optional: true });
  checkString(entry, 'unit', issues, { optional: true });
  if (entry.trend !== undefined) checkEnum(entry, 'trend', ['up', 'down', 'stable'] as const, issues);
};

const checkRisk: EntryCheck = (entry, issues) => {
  checkString(entry, 'id', issues);
  checkString(entry, 'title', issues);
  checkString(entry, 'description', issues);
  checkEnum(entry, 'probability', LEVELS, issues);
  checkEnum(entry, 'impact', LEVELS, issues);
  checkEnum(entry, 'status', ['open', 'mitigated', 'realized'] as const, issues);
};

const checkBlocker: EntryCheck = (entry, issues) => {
  checkString(entry, 'id', issues);
  checkString(entry, 'title', issues);
  checkString(entry, 'description', issues);
  checkEnum(entry, 'impact', LEVELS, issues);
  checkString(entry, 'reportedBy', issues);
  checkDate(entry, 'reportedAt', issues);
  checkEnum(entry, 'status', ['open', 'in-progress', 'resolved'] as const, issues);
};

const checkDependency: EntryCheck = (entry, issues) => {
  checkString(entry, 'projectId', issues);
  checkString(entry, 'projectName', issues);
  checkEnum(entry, 'status', ['required', 'blocks', 'related'] as const, issues);
  checkEnum(entry, 'impact', LEVELS, issues);
};

/**
 * Checks the shape of a Project, including every entry of its nested collections
 * (team, metrics, risks, blockers, dependencies).
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

  checkCollection(obj, 'team', checkTeamMember, sub);
  checkCollection(obj, 'metrics', checkMetric, sub);
  checkCollection(obj, 'risks', checkRisk, sub);
  checkCollection(obj, 'blockers', checkBlocker, sub);
  checkCollection(obj, 'dependencies', checkDependency, sub);

  issues.push(...sub.map((s) => `${label}.${s}`));
  return issues.length === before ? (obj as unknown as Project) : undefined;
}
