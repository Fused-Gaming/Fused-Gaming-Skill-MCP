/**
 * Create Project Tool
 */

import { Project, ProjectStatus } from '../types.js';

export interface CreateProjectInput {
  name: string;
  description?: string;
  targetDate?: string;
  owner: string;
  teamMembers?: string[];
}

export function createProject(input: CreateProjectInput): Project {
  const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
 * Update project status
 */
export function updateProjectStatus(
  project: Project,
  newStatus: ProjectStatus,
  notes?: string
): Project {
  return {
    ...project,
    status: newStatus,
    updatedAt: Date.now(),
  };
}

/**
 * Update project progress
 */
export function updateProjectProgress(
  project: Project,
  tasksCompleted: number,
  tasksTotal: number
): Project {
  const completionPercentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  // Determine health based on progress and status
  let health = 'good';
  if (completionPercentage >= 90) health = 'excellent';
  else if (completionPercentage < 30 && project.targetDate) {
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
    health: health as any,
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
