# Daily Review Skill

Comprehensive session tracking and productivity metrics skill for Fused Gaming MCP.

## Overview

The Daily Review Skill enables tracking Claude sessions across multiple accounts with unified metrics, cross-account analysis, and aggregate productivity insights. Perfect for monitoring productivity over time and identifying patterns.

## Features

- ✅ Session logging with flexible metadata
- ✅ Daily review generation and aggregation
- ✅ Weekly trend analysis
- ✅ Multi-account support (primary/secondary)
- ✅ Productivity metrics and focus scoring
- ✅ Blocker tracking and resolution
- ✅ Daily accomplishment recording
- ✅ Priority planning for next day

## Installation

Install via npm workspace:
```bash
npm install
```

Build the skill:
```bash
npm run build
```

## Usage

### Log a Session

```typescript
import { logSession } from '@fused-gaming/skill-daily-review';

const session = logSession({
  account: 'primary',
  title: 'Feature Implementation',
  startTime: '09:00',
  endTime: '11:30',
  durationMinutes: 150,
  artifacts: 3,
  focusScore: 9,
  category: 'development',
  tools: ['claude', 'vscode', 'git'],
  output: 'Implemented daily review skill foundation'
});
```

### Generate Daily Review

```typescript
import { generateDailyReview, formatDailyReview } from '@fused-gaming/skill-daily-review';

const review = generateDailyReview({
  date: '2026-04-04',
  sessions: [session1, session2, session3],
  accomplishments: [
    'Implemented daily review skill',
    'Created feature branches for 24 skills',
    'Documented implementation plan'
  ],
  blockers: [
    {
      issue: 'GitHub rate limiting',
      category: 'external',
      resolved: true,
      resolution: 'Used cached responses'
    }
  ],
  nextDayPriorities: [
    'Implement Project Status Tool',
    'Set up Mermaid Terminal',
    'Begin Phase 2 development'
  ]
});

console.log(formatDailyReview(review));
```

### Analyze Weekly Trends

```typescript
import { analyzeWeekly, formatWeeklyMetrics } from '@fused-gaming/skill-daily-review';

const weekly = analyzeWeekly({
  weekStart: '2026-03-31',
  weekEnd: '2026-04-06',
  dailyReviews: [review1, review2, review3, review4, review5]
});

console.log(formatWeeklyMetrics(weekly));
```

## API

### Types

#### Session
```typescript
interface Session {
  sessionId: string;
  account?: string;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  artifacts?: number;
  focusScore: number;
  category?: string;
  tools?: string[];
  output?: string;
  timestamp: number;
}
```

#### DailyReview
```typescript
interface DailyReview {
  date: string;
  sessions: Session[];
  metrics: DailyMetrics;
  accomplishments: string[];
  blockers: Blocker[];
  nextDayPriorities: string[];
  notes?: string;
}
```

#### WeeklyMetrics
```typescript
interface WeeklyMetrics {
  weekStart: string;
  weekEnd: string;
  days: DailyReview[];
  totalSessions: number;
  totalDurationHours: number;
  totalArtifacts: number;
  averageFocusScore: number;
  productivityTrend: 'increasing' | 'stable' | 'decreasing';
  mostProductiveDay: string;
  leastProductiveDay: string;
}
```

### Functions

#### logSession(input: LogSessionInput): Session
Creates a new session record with metadata.

**Parameters:**
- `account` - Optional account identifier
- `title` - Session title (required)
- `startTime` - Start time in HH:MM format (required)
- `endTime` - End time in HH:MM format (required)
- `durationMinutes` - Duration in minutes (required)
- `artifacts` - Number of artifacts created
- `focusScore` - Focus quality score 0-10 (required)
- `category` - Session category
- `tools` - Array of tools used
- `output` - Summary of session output

**Returns:** Session object with unique sessionId and timestamp

#### generateDailyReview(input: GenerateDailyReviewInput): DailyReview
Aggregates sessions and generates daily metrics.

**Parameters:**
- `date` - Review date (YYYY-MM-DD) (required)
- `sessions` - Array of Session objects (required)
- `accomplishments` - List of accomplishments (required)
- `blockers` - Array of blockers
- `nextDayPriorities` - Priorities for next day
- `notes` - Additional notes

**Returns:** DailyReview object with calculated metrics

#### analyzeWeekly(input: AnalyzeWeeklyInput): WeeklyMetrics
Analyzes weekly trends and generates summary metrics.

**Parameters:**
- `weekStart` - Week start date (required)
- `weekEnd` - Week end date (required)
- `dailyReviews` - Array of DailyReview objects (required)

**Returns:** WeeklyMetrics object with trends and analysis

#### formatDailyReview(review: DailyReview): string
Formats a daily review for display.

#### formatWeeklyMetrics(metrics: WeeklyMetrics): string
Formats weekly metrics for display.

## Integration with Multi-Account Tracking

This skill integrates with the `multi-account-session-tracking-skill` to provide unified metrics across multiple Claude accounts.

```typescript
// Track sessions per account
const primarySession = logSession({
  account: 'primary',
  title: 'Development Work',
  // ...
});

const secondarySession = logSession({
  account: 'secondary',
  title: 'Documentation',
  // ...
});

// Generate combined review
const review = generateDailyReview({
  date: '2026-04-04',
  sessions: [primarySession, secondarySession],
  accomplishments: [/* ... */]
});

// Analyze productivity per account
const byAccount = {
  primary: [/* primary sessions */],
  secondary: [/* secondary sessions */]
};
```

## Focus Score Guidelines

- **9-10**: Deep, uninterrupted focus; high-quality output
- **7-8**: Good focus with minimal interruptions
- **5-6**: Moderate focus; some distractions
- **3-4**: Scattered focus; many interruptions
- **0-2**: Unable to focus; severe distractions

## Productivity Assessment

- **very-high**: Focus ≥ 8.5 AND sessions ≥ 4
- **high**: Focus ≥ 7.5 AND sessions ≥ 3
- **medium**: Focus ≥ 6.0 AND sessions ≥ 2
- **low**: Focus ≥ 4.0
- **very-low**: Focus < 4.0

## Development Status

- [x] Session logging
- [x] Daily review generation
- [x] Weekly analysis
- [ ] Monthly trend analysis
- [ ] Data persistence (SQLite)
- [ ] API endpoints
- [ ] Export to JSON/CSV
- [ ] Visualization dashboards

## License

Apache-2.0

## See Also

- `multi-account-session-tracking-skill` - Multi-account aggregation
- `project-status-tool` - Project metrics dashboard
- `project-manager-skill` - Task management integration
