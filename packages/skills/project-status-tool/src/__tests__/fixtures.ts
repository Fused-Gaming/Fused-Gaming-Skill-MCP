import type { Project } from '../types.js';

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proj_test_1',
    name: 'Alpha',
    owner: 'ann',
    status: 'in-progress',
    health: 'good',
    startDate: '2026-01-01',
    progress: 50,
    stats: {
      completionPercentage: 50,
      tasksCompleted: 5,
      tasksTotal: 10,
      blockedTasks: 0,
      inProgressTasks: 2,
    },
    updatedAt: 1,
    ...overrides,
  };
}
