# Project Status Tool

Central dashboard for project metrics aggregation and team coordination in Fused Gaming MCP.

## Overview

The Project Status Tool provides a unified dashboard for tracking project status, risks, blockers, and team capacity across multiple concurrent projects.

## Features

- ✅ Project creation and management
- ✅ Real-time status aggregation
- ✅ Health scoring and risk assessment
- ✅ Blocker tracking and resolution
- ✅ Team capacity management
- ✅ Milestone tracking
- ✅ Dependency visualization
- ✅ Progress reporting

## Installation

```bash
npm install
npm run build
```

## Usage

### Create a Project

```typescript
import { createProject } from '@fused-gaming/skill-project-status-tool';

const project = createProject({
  name: 'Daily Review Skill Implementation',
  description: 'Implement comprehensive daily review tracking skill',
  targetDate: '2026-04-15',
  owner: 'John Doe',
  teamMembers: ['Alice', 'Bob', 'Charlie']
});
```

### Update Project Status

```typescript
import { updateProjectStatus, updateProjectProgress } from '@fused-gaming/skill-project-status-tool';

// Update status
const updated = updateProjectStatus(project, 'in-progress', 'Development underway');

// Update progress
const withProgress = updateProjectProgress(project, 25, 100);
```

### Generate Dashboard

```typescript
import { generateDashboard, formatDashboard } from '@fused-gaming/skill-project-status-tool';

const dashboard = generateDashboard({
  projects: [project1, project2, project3, ...]
});

console.log(formatDashboard(dashboard));
```

## API

### Types

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'blocked' | 'completed' | 'on-hold';
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  progress: number;
  stats: ProjectStats;
  team?: ProjectTeamMember[];
  risks?: Risk[];
  blockers?: Blocker[];
  owner: string;
  updatedAt: number;
}
```

#### ProjectDashboard
```typescript
interface ProjectDashboard {
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
```

### Functions

#### createProject(input): Project
Creates a new project with initial structure.

**Parameters:**
- `name` - Project name (required)
- `description` - Project description
- `targetDate` - Target completion date
- `owner` - Project owner (required)
- `teamMembers` - List of team member names

**Returns:** Project object with unique ID

#### updateProjectStatus(project, newStatus, notes): Project
Updates project status.

#### updateProjectProgress(project, tasksCompleted, tasksTotal): Project
Updates project progress percentage and health.

#### generateDashboard(input): ProjectDashboard
Aggregates all project data into a unified dashboard.

**Parameters:**
- `projects` - Array of Project objects

**Returns:** ProjectDashboard with aggregated metrics and alerts

#### formatDashboard(dashboard): string
Formats dashboard for display.

## Health Scoring

Health is automatically determined based on:
- Progress vs target date
- Number of open blockers
- Risk assessment
- Team capacity

| Health | Criteria |
|--------|----------|
| **Excellent** | ≥90% progress, no critical risks |
| **Good** | ≥70% progress, manageable risks |
| **Fair** | ≥50% progress, some concerns |
| **Poor** | <50% progress, multiple risks |
| **Critical** | Blocked or severely at-risk |

## Status Definitions

- **planning** - Project in planning phase
- **in-progress** - Active development
- **blocked** - Unable to proceed
- **completed** - Project finished
- **on-hold** - Temporarily paused

## Integration Points

### With Daily Review Skill
```typescript
// Link project progress to daily accomplishments
const dailyReview = generateDailyReview({
  projects: dashboard.projects,
  accomplishments: [...],
});
```

### With Project Manager Skill
```typescript
// Sync task completion to project progress
const updatedProject = updateProjectProgress(
  project,
  taskManager.getCompletedTasks(),
  taskManager.getTotalTasks()
);
```

## Dashboard Display

```
═══════════════════════════════════════════════════════════════
PROJECT STATUS DASHBOARD
═══════════════════════════════════════════════════════════════

📊 OVERVIEW:
  Total Projects: 5
  Completed: 1
  In Progress: 3
  Blocked: 1
  Overall Health: GOOD

🚧 OPEN BLOCKERS:
  • [HIGH] GitHub authentication issue
  • [MEDIUM] Database migration pending
  
⚠️ CRITICAL RISKS:
  • Key team member unavailable
  • External API dependency unstable

📋 PROJECT STATUS:
  ✓ Website Redesign (100%) [completed]
  ○ Mobile App (65%) [in-progress]
  ○ Backend Refactor (40%) [in-progress]
  ○ Documentation (25%) [in-progress]
  ○ DevOps Setup (0%) [blocked]

═══════════════════════════════════════════════════════════════
```

## Development Status

- [x] Project creation and management
- [x] Status and progress tracking
- [x] Dashboard generation
- [ ] Data persistence (SQLite)
- [ ] Real-time updates via WebSocket
- [ ] Team capacity analytics
- [ ] Risk prediction
- [ ] Dependency analysis

## License

Apache-2.0

## See Also

- `daily-review-skill` - Productivity tracking integration
- `project-manager-skill` - Task management
- `mermaid-terminal-skill` - Dependency visualization
