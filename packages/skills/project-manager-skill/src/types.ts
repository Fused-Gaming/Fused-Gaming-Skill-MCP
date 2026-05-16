/**
 * Project Manager Skill Types
 */

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done' | 'blocked';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  labels?: string[];
  dependencies?: string[];
  blockedBy?: string[];
  projectId?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface TaskList {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
}

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  completionPercentage: number;
  averagePriority: string;
  overdueTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  goals: string[];
  tasks: Task[];
  status: 'planning' | 'active' | 'completed';
  metrics?: TaskMetrics;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  assignedTasks: string[];
}

export interface WorkloadSummary {
  memberId: string;
  memberName: string;
  assignedCount: number;
  completedCount: number;
  inProgressCount: number;
  estimatedHours: number;
  actualHours: number;
  utilization: number;
}
