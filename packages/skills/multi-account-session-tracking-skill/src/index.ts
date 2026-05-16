/**
 * Multi-Account Session Tracking Skill
 * Extended framework for tracking Claude sessions across multiple accounts
 */

export * from './types.js';
export { aggregateSessions, formatUnifiedReview } from './tools/session-aggregation.js';

export const skillTools = [
  {
    name: 'aggregate-sessions',
    description: 'Aggregate session data from multiple accounts into unified daily review',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Review date (YYYY-MM-DD)' },
        accountSessions: {
          type: 'array',
          description: 'Array of account session data',
          items: {
            type: 'object',
            properties: {
              account_id: { type: 'string' },
              email: { type: 'string' },
              web_chat_sessions: { type: 'array' },
              code_sessions: { type: 'array' },
              github_activities: { type: 'array' },
            },
          },
        },
      },
      required: ['date', 'accountSessions'],
    },
  },
  {
    name: 'compare-accounts',
    description: 'Compare productivity metrics across accounts',
    inputSchema: {
      type: 'object',
      properties: {
        review: { type: 'object', description: 'Unified daily review object' },
      },
      required: ['review'],
    },
  },
  {
    name: 'analyze-specialization',
    description: 'Analyze account specialization effectiveness',
    inputSchema: {
      type: 'object',
      properties: {
        accountSessions: { type: 'array', description: 'Account session data' },
      },
      required: ['accountSessions'],
    },
  },
  {
    name: 'generate-multi-account-report',
    description: 'Generate comprehensive multi-account productivity report',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', description: 'Report start date' },
        endDate: { type: 'string', description: 'Report end date' },
        reviews: { type: 'array', description: 'Array of daily reviews' },
      },
      required: ['startDate', 'endDate', 'reviews'],
    },
  },
  {
    name: 'get-account-metrics',
    description: 'Get metrics for a specific account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' },
        reviews: { type: 'array', description: 'Daily reviews' },
      },
      required: ['accountId', 'reviews'],
    },
  },
];
