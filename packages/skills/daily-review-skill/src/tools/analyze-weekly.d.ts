import { DailyReview, WeeklyMetrics } from '../types.js';
export interface AnalyzeWeeklyInput {
    weekStart: string;
    weekEnd: string;
    dailyReviews: DailyReview[];
}
export declare function analyzeWeekly(input: AnalyzeWeeklyInput): WeeklyMetrics;
export declare function formatWeeklyMetrics(metrics: WeeklyMetrics): string;
//# sourceMappingURL=analyze-weekly.d.ts.map