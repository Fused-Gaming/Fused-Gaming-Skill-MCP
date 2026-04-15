/**
 * Log Session Tool
 * Records a session with metadata for later aggregation
 */

import { randomBytes } from 'crypto';
import { Session } from '../types.js';

export interface LogSessionInput {
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
}

export function logSession(input: LogSessionInput): Session {
  const sessionId = `session_${Date.now()}_${randomBytes(9).toString('base64url')}`;

  const session: Session = {
    sessionId,
    account: input.account,
    title: input.title,
    startTime: input.startTime,
    endTime: input.endTime,
    durationMinutes: input.durationMinutes,
    artifacts: input.artifacts || 0,
    focusScore: Math.max(0, Math.min(10, input.focusScore)),
    category: input.category,
    tools: input.tools,
    output: input.output,
    timestamp: Date.now(),
  };

  return session;
}

/**
 * Validates session data
 */
export function validateSession(session: Session): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!session.title || session.title.trim().length === 0) {
    errors.push('Session title is required');
  }

  if (session.focusScore < 0 || session.focusScore > 10) {
    errors.push('Focus score must be between 0 and 10');
  }

  if (session.durationMinutes < 0) {
    errors.push('Duration cannot be negative');
  }

  if (!session.startTime || !session.endTime) {
    errors.push('Start and end times are required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
