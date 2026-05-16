import { Session, DailyReview, DailyMetrics, Blocker } from '../types.js';
export interface GenerateDailyReviewInput {
    date: string;
    sessions: Session[];
    accomplishments: string[];
    blockers?: Blocker[];
    nextDayPriorities?: string[];
    notes?: string;
}
export declare function generateDailyReview(input: GenerateDailyReviewInput): DailyReview;
export declare function formatDailyReview(review: DailyReview): string;
export declare function assessProductivity(metrics: DailyMetrics): string;
//# sourceMappingURL=generate-daily-review.d.ts.map