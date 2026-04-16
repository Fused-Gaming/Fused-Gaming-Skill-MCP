/**
 * Analyze Weekly Tool
 * Generates weekly summaries and trends
 */

import { DailyReview, WeeklyMetrics } from '../types.js';

export interface AnalyzeWeeklyInput {
  weekStart: string;
  weekEnd: string;
  dailyReviews: DailyReview[];
}

export function analyzeWeekly(input: AnalyzeWeeklyInput): WeeklyMetrics {
  const reviews = input.dailyReviews;

  const totalSessions = reviews.reduce((sum, r) => sum + r.metrics.totalSessions, 0);
  const totalDurationHours = Math.round(
    (reviews.reduce((sum, r) => sum + r.metrics.totalDurationMinutes, 0) / 60) * 10
  ) / 10;
  const totalArtifacts = reviews.reduce((sum, r) => sum + r.metrics.totalArtifacts, 0);
  const averageFocusScore =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.metrics.averageFocusScore, 0) / reviews.length) * 10
        ) / 10
      : 0;

  const energyLevels = reviews.filter((r) => r.metrics.energyLevel !== undefined);
  const averageEnergyLevel =
    energyLevels.length > 0
      ? Math.round(
          (energyLevels.reduce((sum, r) => sum + (r.metrics.energyLevel || 0), 0) /
            energyLevels.length) *
            10
        ) / 10
      : 0;

  const stressLevels = reviews.filter((r) => r.metrics.stressLevel !== undefined);
  const averageStressLevel =
    stressLevels.length > 0
      ? Math.round(
          (stressLevels.reduce((sum, r) => sum + (r.metrics.stressLevel || 0), 0) /
            stressLevels.length) *
            10
        ) / 10
      : 0;

  // Find most and least productive days
  let mostProductiveDay = '';
  let mostProductiveScore = 0;
  let leastProductiveDay = '';
  let leastProductiveScore = 10;

  reviews.forEach((review) => {
    if (review.metrics.averageFocusScore > mostProductiveScore) {
      mostProductiveDay = review.date;
      mostProductiveScore = review.metrics.averageFocusScore;
    }
    if (review.metrics.averageFocusScore < leastProductiveScore) {
      leastProductiveDay = review.date;
      leastProductiveScore = review.metrics.averageFocusScore;
    }
  });

  // Determine trend
  const productivityTrend = determineTrend(reviews);

  return {
    weekStart: input.weekStart,
    weekEnd: input.weekEnd,
    days: reviews,
    totalSessions,
    totalDurationHours,
    totalArtifacts,
    averageFocusScore,
    averageEnergyLevel,
    averageStressLevel,
    productivityTrend,
    mostProductiveDay,
    leastProductiveDay,
  };
}

/**
 * Determine productivity trend from daily reviews
 */
function determineTrend(reviews: DailyReview[]): 'increasing' | 'stable' | 'decreasing' {
  if (reviews.length < 2) return 'stable';

  const firstHalf = reviews
    .slice(0, Math.ceil(reviews.length / 2))
    .reduce((sum, r) => sum + r.metrics.averageFocusScore, 0);
  const secondHalf = reviews
    .slice(Math.ceil(reviews.length / 2))
    .reduce((sum, r) => sum + r.metrics.averageFocusScore, 0);

  const firstAvg = firstHalf / Math.ceil(reviews.length / 2);
  const secondAvg = secondHalf / Math.floor(reviews.length / 2);

  const difference = secondAvg - firstAvg;

  if (difference > 0.5) return 'increasing';
  if (difference < -0.5) return 'decreasing';
  return 'stable';
}

/**
 * Format weekly metrics for display
 */
export function formatWeeklyMetrics(metrics: WeeklyMetrics): string {
  let output = '';
  output += `═══════════════════════════════════════════════════════════════\n`;
  output += `WEEKLY REVIEW — ${metrics.weekStart} to ${metrics.weekEnd}\n`;
  output += `═══════════════════════════════════════════════════════════════\n\n`;

  output += `📊 WEEKLY METRICS:\n`;
  output += `  Total Sessions: ${metrics.totalSessions}\n`;
  output += `  Total Duration: ${metrics.totalDurationHours} hours\n`;
  output += `  Total Artifacts: ${metrics.totalArtifacts}\n`;
  output += `  Average Focus: ${metrics.averageFocusScore}/10\n`;
  output += `  Average Energy: ${metrics.averageEnergyLevel}/5\n`;
  output += `  Average Stress: ${metrics.averageStressLevel}/5\n\n`;

  output += `📈 TRENDS:\n`;
  output += `  Productivity: ${metrics.productivityTrend.toUpperCase()}\n`;
  output += `  Best Day: ${metrics.mostProductiveDay} (${metrics.days.find((d) => d.date === metrics.mostProductiveDay)?.metrics.averageFocusScore}/10)\n`;
  output += `  Weakest Day: ${metrics.leastProductiveDay}\n\n`;

  output += `═══════════════════════════════════════════════════════════════\n`;

  return output;
}
