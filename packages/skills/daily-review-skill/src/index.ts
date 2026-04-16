/**
 * Daily Review Skill
 * Comprehensive session tracking and productivity metrics
 */

export * from './types.js';
export * from './tools/log-session.js';
export { generateDailyReview, formatDailyReview, assessProductivity } from './tools/generate-daily-review.js';
export { analyzeWeekly, formatWeeklyMetrics } from './tools/analyze-weekly.js';

// Define skill tools for MCP integration
export const skillTools = [
  {
    name: 'log-session',
    description: 'Log a session with metrics for daily review aggregation',
    inputSchema: {
      type: 'object',
      properties: {
        account: { type: 'string', description: 'Account identifier (primary/secondary)' },
        title: { type: 'string', description: 'Session title or description' },
        startTime: { type: 'string', description: 'Session start time (HH:MM format)' },
        endTime: { type: 'string', description: 'Session end time (HH:MM format)' },
        durationMinutes: { type: 'number', description: 'Session duration in minutes' },
        artifacts: { type: 'number', description: 'Number of artifacts created' },
        focusScore: { type: 'number', description: 'Focus quality score (0-10)' },
        category: { type: 'string', description: 'Session category (coding, documentation, etc)' },
        tools: { type: 'array', items: { type: 'string' }, description: 'Tools used in session' },
        output: { type: 'string', description: 'Summary of session output' },
      },
      required: ['title', 'startTime', 'endTime', 'durationMinutes', 'focusScore'],
    },
  },
  {
    name: 'generate-daily-review',
    description: 'Generate daily review from session data',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Review date (YYYY-MM-DD)' },
        sessions: { type: 'array', description: 'Array of session objects' },
        accomplishments: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of accomplishments',
        },
        blockers: { type: 'array', description: 'Array of blocker objects' },
        nextDayPriorities: { type: 'array', items: { type: 'string' } },
        notes: { type: 'string', description: 'Additional notes' },
      },
      required: ['date', 'sessions', 'accomplishments'],
    },
  },
  {
    name: 'analyze-weekly',
    description: 'Analyze weekly productivity trends and metrics',
    inputSchema: {
      type: 'object',
      properties: {
        weekStart: { type: 'string', description: 'Week start date (YYYY-MM-DD)' },
        weekEnd: { type: 'string', description: 'Week end date (YYYY-MM-DD)' },
        dailyReviews: { type: 'array', description: 'Array of daily review objects' },
      },
      required: ['weekStart', 'weekEnd', 'dailyReviews'],
    },
  },
];
