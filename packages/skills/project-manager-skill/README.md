# Project Manager Skill

Task and project management skill for team collaboration in Fused Gaming MCP.

## Overview

The Project Manager Skill provides tools for creating tasks, managing team workload, tracking progress, and maintaining project organization.

## Features

- ✅ Task creation and management
- ✅ Status tracking (todo, in-progress, review, done, blocked)
- ✅ Priority-based task organization
- ✅ Team member assignment
- ✅ Time tracking and estimation
- ✅ Task dependencies and blocking
- ✅ Labels and categorization
- ✅ Metrics and reporting

## Installation

```bash
npm install
npm run build
```

## Usage

### Create a Task

```typescript
import { createTask } from '@fused-gaming/skill-project-manager';

const task = createTask({
  title: 'Implement Daily Review Skill',
  description: 'Create session tracking and metrics aggregation',
  projectId: 'proj_123',
  priority: 'high',
  assignee: 'Alice',
  dueDate: '2026-04-15',
  estimatedHours: 8,
  labels: ['feature', 'backend']
});
```

### Update Task Status

```typescript
import { updateTaskStatus } from '@fused-gaming/skill-project-manager';

const inProgress = updateTaskStatus(task, 'in-progress');
const completed = updateTaskStatus(inProgress, 'done');
```

### Assign and Track Time

```typescript
import { assignTask, logTaskTime } from '@fused-gaming/skill-project-manager';

const assigned = assignTask(task, 'Bob');
const timeLogged = logTaskTime(assigned, 3);  // 3 hours
```

### Get Metrics

```typescript
import { calculateMetrics } from '@fused-gaming/skill-project-manager';

const metrics = calculateMetrics(tasks);
console.log(`Completion: ${metrics.completionPercentage}%`);
console.log(`Overdue tasks: ${metrics.overdueTasks}`);
console.log(`Time spent: ${metrics.totalActualHours} hours`);
```

## API

### Types

#### Task
```typescript
interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  labels?: string[];
  dependencies?: string[];
  blockedBy?: string[];
}
```

#### TaskMetrics
```typescript
interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  overdueTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}
```

### Functions

#### createTask(input): Task
Creates a new task with specified properties.

#### updateTaskStatus(task, newStatus): Task
Updates task status and auto-sets completedAt if marked done.

#### assignTask(task, assignee): Task
Assigns task to a team member.

#### logTaskTime(task, hours): Task
Logs time spent on a task.

#### calculateMetrics(tasks): TaskMetrics
Calculates aggregate metrics for a task list.

#### validateTask(task): {valid, errors}
Validates task data structure and content.

## Task Statuses

- **todo** - New, unstarted task
- **in-progress** - Currently being worked on
- **in-review** - Completed but awaiting review
- **done** - Finished and approved
- **blocked** - Cannot proceed due to dependency or issue

## Priority Levels

- **critical** - Must be done immediately
- **high** - Important, address soon
- **medium** - Standard priority
- **low** - Can wait if necessary

## Workload Management

Track team capacity and utilization:

```typescript
const workload = calculateWorkload(tasks, team);
workload.forEach(member => {
  console.log(`${member.memberName}: ${member.completedCount}/${member.assignedCount}`);
  console.log(`Utilization: ${member.utilization}%`);
});
```

## Integration with Other Skills

### With Project Status Tool
```typescript
const dashboard = generateDashboard({
  projects: projects.map(p => ({
    ...p,
    tasks: tasks.filter(t => t.projectId === p.id),
    stats: calculateMetrics(tasks)
  }))
});
```

### With Daily Review Skill
```typescript
const review = generateDailyReview({
  accomplishments: completedTasks.map(t => `Completed: ${t.title}`),
  notes: `Completed ${metrics.completedTasks} tasks today`
});
```

## Development Status

- [x] Task creation and management
- [x] Status tracking
- [x] Assignee management
- [x] Time tracking
- [x] Metrics calculation
- [ ] Sprint management
- [ ] Burndown charts
- [ ] Team workload visualization
- [ ] Dependency resolution
- [ ] Automated notifications

## License

Apache-2.0
