/**
 * Multi-Account Session Tracking Types
 * Based on the provided multi-account tracking framework
 */

export interface Account {
  account_id: string;
  email: string;
  purpose: string;
  focus_areas: string[];
  active: boolean;
  session_color?: string;
}

export interface AccountConfig {
  accounts: Account[];
  account_summary: {
    total_accounts: number;
    primary_account: string;
    secondary_account?: string;
    tracking_method: string;
    sync_frequency: string;
  };
}

export interface WebChatSession {
  session_number: number;
  session_id: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  artifacts_created: number;
  key_outputs: string[];
  tool_usage: string[];
  context_tokens_used?: number;
  focus_score: number;
  category?: string;
}

export interface CodeSession {
  session_number: number;
  session_id: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  project: string;
  repository: string;
  branch: string;
  status: string;
  commits: number;
  files_modified: number;
  total_lines_added: number;
  total_lines_deleted: number;
  languages: string[];
  focus_score: number;
  quality_score: number;
}

export interface GitHubActivity {
  activity_id: string;
  activity_type: string;
  timestamp: string;
  repository: string;
  branch_created?: string;
  commit_hash?: string;
  files_modified?: number;
  lines_added?: number;
  pr_number?: number;
  status?: string;
}

export interface AccountSessions {
  account_id: string;
  email: string;
  date: string;
  web_chat_sessions: WebChatSession[];
  code_sessions: CodeSession[];
  github_activities: GitHubActivity[];
}

export interface AccountDailySummary {
  total_sessions: number;
  total_duration_minutes: number;
  total_artifacts: number;
  total_commits: number;
  total_github_activities: number;
  average_focus_score: number;
  context_tokens_total: number;
  productivity_score: string;
  energy_level: number;
  stress_level: number;
  interruptions: number;
}

export interface MultiAccountMetrics {
  combined: {
    total_sessions: number;
    total_duration_minutes: number;
    total_duration_hours: number;
    total_artifacts: number;
    total_commits: number;
    total_github_activities: number;
    average_focus_score: number;
    combined_productivity_score: string;
    average_energy: number;
    average_stress: number;
    total_interruptions: number;
    context_tokens_total: number;
  };
  account_distribution: {
    [accountId: string]: {
      session_count: number;
      duration_minutes: number;
      artifacts: number;
      percentage: number;
    };
  };
  focus_comparison: Record<string, number>;
  productivity_per_hour: {
    [accountId: string]: number;
  };
}

export interface UnifiedDailyReview {
  date: string;
  review_type: string;
  review_period: string;
  accounts_tracked: number;
  total_combined_duration_minutes: number;
  accounts: Record<string, AccountSessions>;
  unified_metrics: MultiAccountMetrics;
  accomplishments_by_account: Record<string, string[]>;
  blockers_by_account: Record<string, string[]>;
  next_day_priorities: {
    primary?: string[];
    secondary?: string[];
    combined?: string[];
  };
  cross_account_analysis: {
    specialization_effectiveness: string;
    session_distribution: Record<string, number>;
    productivity_correlation: Record<string, number>;
    optimization_recommendations: string[];
  };
}

export interface WeeklyProjection {
  if_maintaining_current_pace: {
    primary_week?: Record<string, number | string>;
    secondary_week?: Record<string, number | string>;
    combined_week?: Record<string, number | string>;
  };
}

export interface SessionLog {
  timestamp: string;
  account: string;
  type: string;
  title: string;
  duration_minutes: number;
  focus_score: number;
  artifacts?: number;
  output: string;
}
