/**
 * Create Project Tool
 */

import type { HealthStatus, Project, ProjectStatus } from '../types.js';

export interface CreateProjectInput {
  name: string;
  description?: string;
  targetDate?: string;
  owner: string;
  teamMembers?: string[];
}

export function createProject(input: CreateProjectInput): Project {
  const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const project: Project = {
    id: projectId,
    name: input.name,
    description: input.description,
    status: 'planning' as ProjectStatus,
    health: 'good',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: input.targetDate,
    progress: 0,
    stats: {
      completionPercentage: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
      blockedTasks: 0,
      inProgressTasks: 0,
    },
    team: input.teamMembers
      ? input.teamMembers.map((member) => ({
          name: member,
          role: 'team-member',
          tasksAssigned: 0,
          tasksCompleted: 0,
          lastActivity: new Date().toISOString(),
        }))
      : [],
    owner: input.owner,
    updatedAt: Date.now(),
  };

  return project;
}

/**
 * Update project status. Moving to "completed" stamps completionDate (kept if
 * already set); any other status clears a stale completionDate.
 */
export function updateProjectStatus(
  project: Project,
  newStatus: ProjectStatus,
  _notes?: string
): Project {
  const { completionDate: previous, ...rest } = project;
  const next: Project = { ...rest, status: newStatus, updatedAt: Date.now() };
  if (newStatus === 'completed') {
    next.completionDate = previous ?? new Date().toISOString().split('T')[0];
  }
  return next;
}

/**
 * Update project progress. Throws RangeError when the counts are inconsistent
 * (negative, or more tasks completed than exist), since that would produce a
 * progress value outside 0-100.
 */
export function updateProjectProgress(
  project: Project,
  tasksCompleted: number,
  tasksTotal: number
): Project {
  if (tasksCompleted < 0 || tasksTotal < 0 || tasksCompleted > tasksTotal) {
    throw new RangeError('tasksCompleted must be between 0 and tasksTotal');
  }

  const completionPercentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  // Determine health based on progress and proximity of the target date.
  let health: HealthStatus = 'good';
  if (completionPercentage >= 90) {
    health = 'excellent';
  } else if (completionPercentage < 30 && project.targetDate) {
    const now = new Date();
    const target = new Date(project.targetDate);
    const daysLeft = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 7) health = 'poor';
  }

  return {
    ...project,
    progress: completionPercentage,
    stats: {
      ...project.stats,
      completionPercentage,
      tasksCompleted,
      tasksTotal,
    },
    health,
    updatedAt: Date.now(),
  };
}

/**
 * Validate project data
 */
export function validateProject(project: Project): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!project.name || project.name.trim().length === 0) {
    errors.push('Project name is required');
  }

  if (!project.owner || project.owner.trim().length === 0) {
    errors.push('Project owner is required');
  }

  if (project.progress < 0 || project.progress > 100) {
    errors.push('Progress must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
