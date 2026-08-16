/**
 * Daily Review Skill Release Performance Benchmark
 * Runs comprehensive benchmarks with memory optimization for release validation
 * Usage: node --expose-gc --max-old-space-size=4096 --loader ts-node/esm benchmarks/release-performance.benchmark.ts
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
  ops_per_sec: number;
  target?: number;
  passed?: boolean;
  memoryUsed?: number;
}

const results: BenchmarkResult[] = [];

function benchmark(
  name: string,
  iterations: number,
  fn: () => void,
  targetMs?: number
): BenchmarkResult {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  const memStart =
    process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;

  if (global.gc) {
    global.gc();
  }

  const memEnd =
    process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB

  const avg = duration / iterations;
  const ops_per_sec = (iterations / duration) * 1000;
  const memoryUsed = memEnd - memStart;
  const passed = targetMs ? avg < targetMs : true;

  const result: BenchmarkResult = {
    name,
    iterations,
    duration,
    avg,
    ops_per_sec,
    target: targetMs,
    passed,
    memoryUsed: Math.abs(memoryUsed),
  };

  results.push(result);
  const icon = passed ? "✓" : "✗";
  const targetStr = targetMs ? ` (target: <${targetMs}ms)` : "";
  const memStr = ` [${Math.abs(memoryUsed).toFixed(2)}MB]`;
  console.log(
    `${icon} ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)${targetStr}${memStr}`
  );

  return result;
}

console.log("🚀 Daily Review Skill Release Performance Benchmark");
console.log("=".repeat(70));

// ============================================================================
// Session Logging Benchmarks
// ============================================================================
console.log("\n📝 Session Logging Benchmarks");
console.log("─".repeat(70));

let sessionCounter = 0;
benchmark(
  "logSession (simple)",
  50000,
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
  50000,
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
  50000,
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
// Review Aggregation Benchmarks - Scaling Tests
// ============================================================================
console.log("\n📊 Review Aggregation Benchmarks (Scaling)");
console.log("─".repeat(70));

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
  5000,
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
  5000,
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
  2500,
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
console.log("─".repeat(70));

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
  2500,
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
  2500,
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
console.log("─".repeat(70));

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
  5000,
  () => {
    formatDailyReview(sampleReview);
  },
  10
);

benchmark(
  "assessProductivity",
  25000,
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
  5000,
  () => {
    formatWeeklyMetrics(sampleWeeklyMetrics);
  },
  10
);

// ============================================================================
// Multi-Account Reporting Benchmarks - Stress Testing
// ============================================================================
console.log("\n👥 Multi-Account Reporting Benchmarks (Stress Testing)");
console.log("─".repeat(70));

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
  1000,
  () => {
    const reviewsByAccount = createMultiAccountReviews(2, 5);
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

benchmark(
  "Multi-account aggregation (3 accounts, 7 days)",
  500,
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

benchmark(
  "Multi-account aggregation (5 accounts, 7 days)",
  250,
  () => {
    const reviewsByAccount = createMultiAccountReviews(5, 7);
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
// Summary Report
// ============================================================================
console.log("\n📋 Release Benchmark Summary");
console.log("=".repeat(70));

const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
const avgOpsPerSec = (totalOps / totalDuration) * 1000;
const passedCount = results.filter((r) => r.passed !== false).length;
const totalMemory = results.reduce((sum, r) => sum + (r.memoryUsed || 0), 0);

console.log(`\nTotal operations: ${totalOps.toLocaleString()}`);
console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);
console.log(`Total memory variance: ${totalMemory.toFixed(2)}MB`);
console.log(`Targets passed: ${passedCount}/${results.filter((r) => r.target).length}`);

// ============================================================================
// Performance Summary
// ============================================================================
console.log("\n⚡ Performance Targets Met");
console.log("─".repeat(70));

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
  "Multi-account aggregation (5 accounts, 7 days)": 100,
};

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
// Release Status
// ============================================================================
console.log("\n" + "=".repeat(70));
if (allTargetsPassed) {
  console.log("✅ Release benchmarks passed - Ready for production");
  process.exit(0);
} else {
  console.log("⚠️ Some performance targets not met - Review before release");
  process.exit(1);
}
