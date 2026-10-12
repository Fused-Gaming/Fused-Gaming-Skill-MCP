/**
 * Summarize Project Status Tool
 * Produces a headline, roll-ups, and deterministic next actions for a portfolio.
 */

import type { ProjectSummary, SummarizeProjectStatusInput, SummarizeProjectStatusOutput } from '../contracts.js';
import { PROJECT_STATUSES } from '../validation.js';
import type { Project, ProjectStatus } from '../types.js';
import { generateDashboard } from './dashboard.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A project is overdue once the day after its targetDate has begun (a target
 * date is due for the whole of that day).
 */
function isOverdue(project: Project, now: number): boolean {
  if (!project.targetDate || project.status === 'completed') return false;
  const target = Date.parse(project.targetDate);
  return !Number.isNaN(target) && target + DAY_MS <= now;
}

export function summarizeProjectStatus(
  input: SummarizeProjectStatusInput,
  now: number = Date.now()
): SummarizeProjectStatusOutput {
  const projects = input.projects ?? [];
  const dashboard = generateDashboard({ projects });

  const byStatus = Object.fromEntries(PROJECT_STATUSES.map((s) => [s, 0])) as Record<ProjectStatus, number>;
  for (const p of projects) byStatus[p.status] += 1;

  const averageProgress =
    projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;

  const openBlockers = projects.flatMap((p) =>
    (p.blockers || [])
      .filter((b) => b.status === 'open' || b.status === 'in-progress')
      .map((b) => ({ project: p.name, title: b.title, impact: b.impact }))
  );

  const nextActions: string[] = [];
  for (const p of projects) {
    if (p.status === 'blocked') nextActions.push(`Unblock "${p.name}" (status is blocked)`);
    if (isOverdue(p, now)) nextActions.push(`Re-plan "${p.name}": target date ${p.targetDate} has passed`);
    if (p.status !== 'completed' && (p.health === 'poor' || p.health === 'critical')) {
      nextActions.push(`Review health of "${p.name}" (${p.health})`);
    }
  }
  for (const b of openBlockers.filter((x) => x.impact === 'high')) {
    nextActions.push(`Resolve high-impact blocker "${b.title}" in "${b.project}"`);
  }
  for (const r of dashboard.criticalRisks) {
    nextActions.push(`Mitigate critical risk "${r.title}"`);
  }
  if (nextActions.length === 0) nextActions.push('No immediate actions required.');

  const headline =
    projects.length === 0
      ? 'No projects in scope.'
      : `${projects.length} project(s): ${byStatus.completed} completed, ${byStatus['in-progress']} in progress, ` +
        `${byStatus.blocked} blocked; overall health ${dashboard.overallHealth}.`;

  const summary: ProjectSummary = {
    headline,
    totalProjects: projects.length,
    averageProgress,
    overallHealth: dashboard.overallHealth,
    byStatus,
    criticalRiskTitles: dashboard.criticalRisks.map((r) => r.title),
    openBlockerTitles: openBlockers.map((b) => b.title),
    nextActions,
  };

  return {
    success: true,
    tool: 'summarize-project-status',
    objective: input.objective,
    context: input.context ?? '',
    summary,
  };
}
