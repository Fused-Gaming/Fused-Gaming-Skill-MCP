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
export declare function logSession(input: LogSessionInput): Session;
export declare function validateSession(session: Session): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=log-session.d.ts.map