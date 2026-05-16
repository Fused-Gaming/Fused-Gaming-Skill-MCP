import { randomBytes } from 'crypto';
export function logSession(input) {
    const sessionId = `session_${Date.now()}_${randomBytes(9).toString('base64url')}`;
    const session = {
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
export function validateSession(session) {
    const errors = [];
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
//# sourceMappingURL=log-session.js.map