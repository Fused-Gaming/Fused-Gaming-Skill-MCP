/**
 * Daily Review Skill Types
 * Comprehensive types for session tracking, metrics, and reporting
 */

export interface Session {
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

export interface DailyMetrics {
  date: string;
  totalSessions: number;
  totalDurationMinutes: number;
  totalArtifacts: number;
  averageFocusScore: number;
  categories?: Record<string, number>;
  blockers?: Blocker[];
  energyLevel?: number;
  stressLevel?: number;
  interruptions?: number;
}

export interface Blocker {
  issue: string;
  category: 'technical' | 'environmental' | 'external' | 'personal';
  impact?: string;
  resolved: boolean;
  resolution?: string;
}

export interface DailyReview {
  date: string;
  sessions: Session[];
  metrics: DailyMetrics;
  accomplishments: string[];
  blockers: Blocker[];
  nextDayPriorities: string[];
  notes?: string;
}

export interface WeeklyMetrics {
  weekStart: string;
  weekEnd: string;
  days: DailyReview[];
  totalSessions: number;
  totalDurationHours: number;
  totalArtifacts: number;
  averageFocusScore: number;
  averageEnergyLevel: number;
  averageStressLevel: number;
  productivityTrend: 'increasing' | 'stable' | 'decreasing';
  mostProductiveDay: string;
  leastProductiveDay: string;
}

export interface MonthlyMetrics {
  month: string;
  weeks: WeeklyMetrics[];
  totalSessions: number;
  totalDurationHours: number;
  totalArtifacts: number;
  averageFocusScore: number;
  productivityTrend: 'increasing' | 'stable' | 'decreasing';
  topFocusDays: string[];
  challenges: string[];
  recommendations: string[];
}

export interface MultiAccountData {
  date: string;
  accounts: Record<string, DailyReview>;
  combinedMetrics: DailyMetrics;
  accountDistribution: {
    [accountId: string]: {
      sessionCount: number;
      durationMinutes: number;
      artifacts: number;
      percentage: number;
    };
  };
  focusComparison: Record<string, number>;
}

export interface SessionLog {
  sessionId: string;
  timestamp: number;
  account?: string;
  type: 'web-chat' | 'code' | 'github' | 'other';
  title: string;
  duration: number;
  focusScore: number;
  output: string;
}
