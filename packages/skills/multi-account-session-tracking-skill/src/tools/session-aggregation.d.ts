import { AccountSessions, UnifiedDailyReview } from '../types.js';
export interface AggregateSessionsInput {
    date: string;
    accountSessions: AccountSessions[];
}
export declare function aggregateSessions(input: AggregateSessionsInput): UnifiedDailyReview;
export declare function formatUnifiedReview(review: UnifiedDailyReview): string;
//# sourceMappingURL=session-aggregation.d.ts.map