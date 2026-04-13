# Multi-Account Session Tracking Skill

Extended framework for tracking Claude sessions across multiple accounts in Fused Gaming MCP.

## Overview

The Multi-Account Session Tracking Skill enables tracking Claude sessions across multiple accounts (personal, professional, research) with unified metrics, cross-account analysis, and aggregate productivity insights.

## Features

- ✅ Track sessions in multiple Claude accounts
- ✅ Aggregate metrics across accounts
- ✅ Analyze cross-account productivity patterns
- ✅ Generate unified daily reviews
- ✅ Compare account-specific focus and output
- ✅ Identify optimal work distribution
- ✅ Weekly and monthly trend analysis
- ✅ Specialization effectiveness assessment

## Installation

```bash
npm install
npm run build
```

## Account Setup

Define your accounts with purposes and focus areas:

```typescript
const accounts = [
  {
    account_id: 'primary',
    email: 'primary@email.com',
    purpose: 'Development and technical work',
    focus_areas: ['implementation', 'coding', 'research'],
    active: true,
    session_color: 'blue'
  },
  {
    account_id: 'secondary',
    email: 'secondary@email.com',
    purpose: 'Administrative and coordination',
    focus_areas: ['documentation', 'planning', 'admin'],
    active: true,
    session_color: 'green'
  }
];
```

## Usage

### Log Sessions Per Account

```typescript
// Primary account session
const primarySession = {
  session_id: 'session_1',
  account_id: 'primary',
  title: 'Feature Implementation',
  start_time: '09:00',
  end_time: '12:00',
  duration_minutes: 180,
  artifacts_created: 3,
  focus_score: 9,
  category: 'development'
};

// Secondary account session
const secondarySession = {
  session_id: 'session_2',
  account_id: 'secondary',
  title: 'Documentation Update',
  start_time: '14:00',
  end_time: '15:30',
  duration_minutes: 90,
  artifacts_created: 2,
  focus_score: 8,
  category: 'documentation'
};
```

### Aggregate Accounts into Unified Review

```typescript
import { aggregateSessions } from '@fused-gaming/skill-multi-account-session-tracking';

const review = aggregateSessions({
  date: '2026-04-04',
  accountSessions: [primarySessions, secondarySessions]
});

console.log(formatUnifiedReview(review));
```

## API

### Types

#### Account
```typescript
interface Account {
  account_id: string;
  email: string;
  purpose: string;
  focus_areas: string[];
  active: boolean;
  session_color?: string;
}
```

#### UnifiedDailyReview
```typescript
interface UnifiedDailyReview {
  date: string;
  review_type: 'multi-account-unified-daily-review';
  accounts_tracked: number;
  unified_metrics: MultiAccountMetrics;
  accomplishments_by_account: Record<string, string[]>;
  cross_account_analysis: {
    specialization_effectiveness: string;
    optimization_recommendations: string[];
  };
}
```

#### MultiAccountMetrics
```typescript
interface MultiAccountMetrics {
  combined: {
    total_sessions: number;
    total_duration_hours: number;
    total_artifacts: number;
    average_focus_score: number;
    combined_productivity_score: string;
  };
  account_distribution: Record<string, any>;
  focus_comparison: Record<string, number>;
}
```

### Functions

#### aggregateSessions(input): UnifiedDailyReview
Aggregates session data from multiple accounts into a unified daily review.

**Parameters:**
- `date` - Review date (YYYY-MM-DD)
- `accountSessions` - Array of AccountSessions objects

**Returns:** UnifiedDailyReview with aggregated metrics

#### formatUnifiedReview(review): string
Formats the unified review for display.

#### compareAccounts(review): ComparisonResult
Compares productivity metrics across accounts.

#### analyzeSpecialization(sessions): SpecializationAnalysis
Analyzes how effectively accounts are specialized.

## Workflow Example

### Morning (Primary Account)
- Code development (high focus, peak hours)
- Feature implementation
- Deep technical work
- Expected: High artifacts, high focus score

### Afternoon (Secondary Account)
- Documentation updates
- Administrative tasks
- PR reviews and coordination
- Expected: Moderate artifacts, moderate focus

## Integration Points

### With Daily Review Skill
```typescript
// Combine individual account reviews
const dailyReview = generateDailyReview({
  sessions: [...primarySessions, ...secondarySessions],
  accomplishments: accountAccomplishments,
  metrics: unifiedMetrics
});
```

### With Project Status Tool
```typescript
// Track project progress by account
const dashboard = generateDashboard({
  projects: projects.filter(p => p.owner === 'primary'),
  // separate dashboard for secondary account
});
```

### With Project Manager Skill
```typescript
// Assign tasks by account specialization
const primaryTasks = tasks.filter(t => t.category === 'development');
const secondaryTasks = tasks.filter(t => t.category === 'admin');
```

## Metrics Calculated

### Per Account
- Total sessions and duration
- Artifact production
- Focus scores
- Productivity trends
- GitHub activities and commits

### Combined
- Unified metrics across accounts
- Account distribution percentages
- Focus comparison
- Productivity per hour per account
- Overall productivity assessment

## Specialization Benefits

- **Improved Focus:** Each account optimized for its purpose
- **Better Metrics:** Clear attribution of work to account specialization
- **Flexible Scheduling:** Distribute load between accounts based on capacity
- **Productivity Insights:** Identify which account works best for different task types

## Best Practices

✅ Define clear purposes for each account  
✅ Assign consistent focus areas per account  
✅ Log sessions consistently from both accounts  
✅ Review cross-account patterns weekly  
✅ Adjust specialization based on performance  
✅ Use account separation strategically  
✅ Monitor total workload across accounts  

## Weekly Analysis

Track metrics across 7 days:
- Total sessions per account
- Duration distribution
- Artifact production
- Focus score trends
- Productivity correlation
- Work distribution balance

## Development Status

- [x] Session aggregation
- [x] Multi-account metrics
- [x] Unified daily reviews
- [x] Account distribution analysis
- [ ] Weekly summaries
- [ ] Monthly trend analysis
- [ ] Specialization optimization
- [ ] Predictive recommendations
- [ ] Data persistence (SQLite)
- [ ] CSV/JSON export

## License

Apache-2.0

## See Also

- `daily-review-skill` - Individual session tracking
- `project-status-tool` - Project-level metrics
- `project-manager-skill` - Task assignment by account

## Documentation

The full multi-account tracking framework documentation is available in:
- `MULTI_ACCOUNT_SESSION_TRACKING.md` - Conceptual framework
- `IMPLEMENTATION_GUIDE.md` - Practical implementation guide
