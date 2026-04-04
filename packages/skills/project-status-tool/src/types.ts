/**
 * Project Status Tool Types
 */

export type ProjectStatus = 'planning' | 'in-progress' | 'blocked' | 'completed' | 'on-hold';
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface ProjectMetric {
  name: string;
  value: number;
  target?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface ProjectStats {
  completionPercentage: number;
  tasksCompleted: number;
  tasksTotal: number;
  blockedTasks: number;
  inProgressTasks: number;
  velocityLastWeek?: number;
  velocityLastMonth?: number;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  tasksAssigned: number;
  tasksCompleted: number;
  lastActivity: string;
}

export interface ProjectDependency {
  projectId: string;
  projectName: string;
  status: 'required' | 'blocks' | 'related';
  impact: 'high' | 'medium' | 'low';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  health: HealthStatus;
  startDate: string;
  targetDate?: string;
  completionDate?: string;
  progress: number;
  stats: ProjectStats;
  team?: ProjectTeamMember[];
  metrics?: ProjectMetric[];
  risks?: Risk[];
  blockers?: Blocker[];
  dependencies?: ProjectDependency[];
  owner: string;
  updatedAt: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation?: string;
  status: 'open' | 'mitigated' | 'realized';
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  reportedBy: string;
  reportedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
  resolution?: string;
}

export interface ProjectSnapshot {
  timestamp: number;
  projectId: string;
  status: ProjectStatus;
  health: HealthStatus;
  progress: number;
  blockedCount: number;
  tasksCompleted: number;
}

export interface ProjectDashboard {
  timestamp: number;
  projects: Project[];
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  blockedProjects: number;
  overallHealth: HealthStatus;
  criticalRisks: Risk[];
  openBlockers: Blocker[];
  teamCapacity?: Record<string, number>;
}

export interface ProjectReport {
  projectId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: string;
  metrics: ProjectMetric[];
  milestones: Milestone[];
  teamContributions: Record<string, number>;
  risksRealized: Risk[];
  recommendations: string[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  deliverables: string[];
  status: 'completed' | 'on-track' | 'at-risk' | 'missed';
}

export interface StatusUpdate {
  projectId: string;
  timestamp: number;
  author: string;
  updates: {
    status?: ProjectStatus;
    progress?: number;
    health?: HealthStatus;
    notes?: string;
  };
}
