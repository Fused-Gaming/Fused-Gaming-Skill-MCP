/**
 * Daily Review Skill Performance Benchmark Suite
 * Measures performance of all major operations:
 * - Review aggregation
 * - Metrics analysis
 * - Database queries
 * - Multi-account reporting
 */

import {
  generateDailyReview,
  formatDailyReview,
  assessProductivity,
} from "../src/tools/generate-daily-review.js";
import { logSession, validateSession } from "../src/tools/log-session.js";
import { analyzeWeekly, formatWeeklyMetrics } from "../src/tools/analyze-weekly.js";
import { Session, DailyReview, Blocker } from "../src/types.js";

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  avg: number;
  min: number;
  max: number;
  ops_per_sec: number;
  target?: number;
  passed?: boolean;
}

const results: BenchmarkResult[] = [];

function benchmark(
  name: string,
  iterations: number,
  fn: () => void,
  targetMs?: number
): BenchmarkResult {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;
  const avg = duration / iterations;
  const ops_per_sec = (iterations / duration) * 1000;
  const passed = targetMs ? avg < targetMs : true;

  const result: BenchmarkResult = {
    name,
    iterations,
    duration,
    avg,
    min: 0,
    max: 0,
    ops_per_sec,
    target: targetMs,
    passed,
  };

  results.push(result);
  const icon = passed ? "✓" : "✗";
  const targetStr = targetMs ? ` (target: <${targetMs}ms)` : "";
  console.log(
    `${icon} ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)${targetStr}`
  );

  return result;
}

// ============================================================================
// Session Logging Benchmarks
// ============================================================================
console.log("\n📝 Session Logging Benchmarks");
console.log("─".repeat(60));

let sessionCounter = 0;
benchmark(
  "logSession (simple)",
  10000,
  () => {
    logSession({
      title: `Session ${sessionCounter++}`,
      startTime: "2024-01-01T09:00:00Z",
      endTime: "2024-01-01T10:00:00Z",
      durationMinutes: 60,
      focusScore: 8,
    });
  },
  5
);

benchmark(
  "logSession (with metadata)",
  10000,
  () => {
    logSession({
      account: "user@example.com",
      title: `Complex Session ${sessionCounter++}`,
      startTime: "2024-01-01T09:00:00Z",
      endTime: "2024-01-01T10:00:00Z",
      durationMinutes: 60,
      artifacts: 5,
      focusScore: 7.5,
      category: "development",
      tools: ["VSCode", "Terminal", "Chrome"],
      output: "Implemented feature X",
    });
  },
  5
);

benchmark(
  "validateSession",
  10000,
  () => {
    const session = logSession({
      title: `Session ${sessionCounter++}`,
      startTime: "2024-01-01T09:00:00Z",
      endTime: "2024-01-01T10:00:00Z",
      durationMinutes: 60,
      focusScore: 8,
    });
    validateSession(session);
  },
  5
);

// ============================================================================
// Review Aggregation Benchmarks
// ============================================================================
console.log("\n📊 Review Aggregation Benchmarks");
console.log("─".repeat(60));

// Create sample sessions
const createSampleSessions = (count: number): Session[] => {
  const sessions: Session[] = [];
  for (let i = 0; i < count; i++) {
    sessions.push(
      logSession({
        account: i % 3 === 0 ? "account1" : i % 3 === 1 ? "account2" : undefined,
        title: `Session ${i}`,
        startTime: `2024-01-01T${String(9 + Math.floor(i / 3)).padStart(2, "0")}:00:00Z`,
        endTime: `2024-01-01T${String(10 + Math.floor(i / 3)).padStart(2, "0")}:00:00Z`,
        durationMinutes: 60,
        artifacts: Math.floor(Math.random() * 10),
        focusScore: 4 + Math.random() * 6,
        category: ["development", "planning", "review"][i % 3],
        tools: ["Tool1", "Tool2"],
      })
    );
  }
  return sessions;
};

const sessions5 = createSampleSessions(5);
const sessions10 = createSampleSessions(10);
const sessions20 = createSampleSessions(20);

benchmark(
  "generateDailyReview (5 sessions)",
  1000,
  () => {
    generateDailyReview({
      date: "2024-01-01",
      sessions: sessions5,
      accomplishments: ["Task A", "Task B"],
      blockers: [
        {
          issue: "Bug in module X",
          category: "technical",
          resolved: false,
        },
      ],
      nextDayPriorities: ["Fix bug", "Review PR"],
    });
  },
  10
);

benchmark(
  "generateDailyReview (10 sessions)",
  1000,
  () => {
    generateDailyReview({
      date: "2024-01-01",
      sessions: sessions10,
      accomplishments: ["Task A", "Task B", "Task C"],
      blockers: [
        {
          issue: "Bug in module X",
          category: "technical",
          resolved: false,
        },
        {
          issue: "Meeting overrun",
          category: "external",
          resolved: true,
          resolution: "Rescheduled",
        },
      ],
      nextDayPriorities: ["Fix bug", "Review PR", "Deploy"],
    });
  },
  10
);

benchmark(
  "generateDailyReview (20 sessions)",
  500,
  () => {
    generateDailyReview({
      date: "2024-01-01",
      sessions: sessions20,
      accomplishments: ["Task A", "Task B", "Task C", "Task D"],
      blockers: [
        {
          issue: "Bug in module X",
          category: "technical",
          resolved: false,
        },
        {
          issue: "Meeting overrun",
          category: "external",
          resolved: true,
          resolution: "Rescheduled",
        },
      ],
      nextDayPriorities: ["Fix bug", "Review PR", "Deploy", "Documentation"],
    });
  },
  10
);

// ============================================================================
// Metrics Analysis Benchmarks
// ============================================================================
console.log("\n📈 Metrics Analysis Benchmarks");
console.log("─".repeat(60));

// Create sample daily reviews
const createSampleDailyReviews = (days: number): DailyReview[] => {
  const reviews: DailyReview[] = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(2024, 0, 1 + d);
    const dateStr = date.toISOString().split("T")[0];
    const daySessions = createSampleSessions(5 + Math.floor(Math.random() * 10));

    const blockers: Blocker[] =
      d % 2 === 0
        ? [
            {
              issue: "Issue on day " + d,
              category: "technical",
              resolved: d % 3 === 0,
            },
          ]
        : [];

    reviews.push(
      generateDailyReview({
        date: dateStr,
        sessions: daySessions,
        accomplishments: ["Accomplished task 1", "Accomplished task 2"],
        blockers,
        nextDayPriorities: ["Priority 1", "Priority 2"],
      })
    );
  }
  return reviews;
};

const dailyReviews5 = createSampleDailyReviews(5);
const dailyReviews7 = createSampleDailyReviews(7);

benchmark(
  "analyzeWeekly (5 days)",
  500,
  () => {
    analyzeWeekly({
      weekStart: "2024-01-01",
      weekEnd: "2024-01-05",
      dailyReviews: dailyReviews5,
    });
  },
  50
);

benchmark(
  "analyzeWeekly (7 days)",
  500,
  () => {
    analyzeWeekly({
      weekStart: "2024-01-01",
      weekEnd: "2024-01-07",
      dailyReviews: dailyReviews7,
    });
  },
  50
);

// ============================================================================
// Formatting & Assessment Benchmarks
// ============================================================================
console.log("\n🎨 Formatting & Assessment Benchmarks");
console.log("─".repeat(60));

const sampleReview = generateDailyReview({
  date: "2024-01-01",
  sessions: sessions10,
  accomplishments: ["Task A", "Task B"],
  blockers: [
    {
      issue: "Bug found",
      category: "technical",
      resolved: false,
    },
  ],
  nextDayPriorities: ["Priority 1", "Priority 2"],
});

benchmark(
  "formatDailyReview",
  1000,
  () => {
    formatDailyReview(sampleReview);
  },
  10
);

benchmark(
  "assessProductivity",
  5000,
  () => {
    assessProductivity(sampleReview.metrics);
  },
  1
);

const sampleWeeklyMetrics = analyzeWeekly({
  weekStart: "2024-01-01",
  weekEnd: "2024-01-07",
  dailyReviews: dailyReviews7,
});

benchmark(
  "formatWeeklyMetrics",
  1000,
  () => {
    formatWeeklyMetrics(sampleWeeklyMetrics);
  },
  10
);

// ============================================================================
// Multi-Account Reporting Benchmarks
// ============================================================================
console.log("\n👥 Multi-Account Reporting Benchmarks");
console.log("─".repeat(60));

// Create multi-account data
const createMultiAccountReviews = (accountCount: number, daysPerAccount: number) => {
  const reviewsByAccount: Record<string, DailyReview[]> = {};
  for (let a = 0; a < accountCount; a++) {
    const accountId = `account_${a}`;
    reviewsByAccount[accountId] = [];
    for (let d = 0; d < daysPerAccount; d++) {
      const date = new Date(2024, 0, 1 + d);
      const dateStr = date.toISOString().split("T")[0];
      const accountSessions = createSampleSessions(3 + Math.floor(Math.random() * 7));
      accountSessions.forEach((s) => (s.account = accountId));

      reviewsByAccount[accountId].push(
        generateDailyReview({
          date: dateStr,
          sessions: accountSessions,
          accomplishments: ["Task 1", "Task 2"],
          nextDayPriorities: ["Priority 1"],
        })
      );
    }
  }
  return reviewsByAccount;
};

benchmark(
  "Multi-account aggregation (2 accounts, 5 days)",
  200,
  () => {
    const reviewsByAccount = createMultiAccountReviews(2, 5);
    // Simulate multi-account aggregation
    const accounts = Object.entries(reviewsByAccount);
    const combinedSessions: Session[] = [];
    for (const [_accountId, reviews] of accounts) {
      for (const review of reviews) {
        combinedSessions.push(...review.sessions);
      }
    }
    // Generate combined metrics
    generateDailyReview({
      date: "2024-01-01",
      sessions: combinedSessions,
      accomplishments: ["Task A", "Task B"],
      nextDayPriorities: ["Priority 1"],
    });
  },
  100
);

benchmark(
  "Multi-account aggregation (3 accounts, 7 days)",
  100,
  () => {
    const reviewsByAccount = createMultiAccountReviews(3, 7);
    const accounts = Object.entries(reviewsByAccount);
    const combinedSessions: Session[] = [];
    for (const [_accountId, reviews] of accounts) {
      for (const review of reviews) {
        combinedSessions.push(...review.sessions);
      }
    }
    generateDailyReview({
      date: "2024-01-01",
      sessions: combinedSessions,
      accomplishments: ["Task A", "Task B"],
      nextDayPriorities: ["Priority 1"],
    });
  },
  100
);

// ============================================================================
// Summary
// ============================================================================
console.log("\n📋 Benchmark Summary");
console.log("=".repeat(60));

const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
const avgOpsPerSec = (totalOps / totalDuration) * 1000;
const passedCount = results.filter((r) => r.passed !== false).length;

console.log(`Total operations: ${totalOps.toLocaleString()}`);
console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);
console.log(`Targets passed: ${passedCount}/${results.filter((r) => r.target).length}`);

// ============================================================================
// Performance Targets Verification
// ============================================================================
console.log("\n⚡ Performance Targets (v1.0.0)");
console.log("─".repeat(60));

const targetMap: Record<string, number> = {
  "logSession (simple)": 5,
  "logSession (with metadata)": 5,
  validateSession: 5,
  "generateDailyReview (5 sessions)": 10,
  "generateDailyReview (10 sessions)": 10,
  "generateDailyReview (20 sessions)": 10,
  "analyzeWeekly (5 days)": 50,
  "analyzeWeekly (7 days)": 50,
  formatDailyReview: 10,
  assessProductivity: 1,
  formatWeeklyMetrics: 10,
  "Multi-account aggregation (2 accounts, 5 days)": 100,
  "Multi-account aggregation (3 accounts, 7 days)": 100,
};

console.log("\n✅ Performance Goals");
let allTargetsPassed = true;
for (const [name, target] of Object.entries(targetMap)) {
  const result = results.find((r) => r.name === name);
  const passed = result && result.avg < target;
  if (!passed) allTargetsPassed = false;
  const icon = passed ? "✓" : "✗";
  const actualMs = result ? result.avg.toFixed(3) : "N/A";
  console.log(`${icon} ${name} < ${target}ms: ${actualMs}ms`);
}

// ============================================================================
// Final Status
// ============================================================================
console.log("\n" + "=".repeat(60));
if (allTargetsPassed) {
  console.log("✅ All performance targets passed!");
  process.exit(0);
} else {
  console.log("⚠️ Some performance targets not met");
  process.exit(1);
}
