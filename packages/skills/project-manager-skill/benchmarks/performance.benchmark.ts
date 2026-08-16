/**
 * Project Manager Skill Performance Benchmark Suite
 * Measures performance of all major project management operations
 */

import {
  createTask,
  updateTaskStatus,
  assignTask,
  addTaskLabel,
  setTaskDueDate,
  addTaskDependency,
  logTaskTime,
  calculateMetrics,
  validateTask,
} from '../dist/tools/task-management.js';
import { Task, TaskStatus } from '../dist/types.js';

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  avg: number;
  min: number;
  max: number;
  ops_per_sec: number;
  passed: boolean;
  target?: string;
}

const results: BenchmarkResult[] = [];

// Performance targets (in milliseconds)
const PERFORMANCE_TARGETS: Record<string, number> = {
  'Task creation': 5,
  'Task assignment': 5,
  'State updates': 10,
  'Task queries': 15,
  'Roadmap generation': 50,
};

function benchmark(
  name: string,
  iterations: number,
  fn: () => void,
  targetMs?: number
): BenchmarkResult {
  // Force garbage collection before benchmark
  if (global.gc) {
    global.gc();
  }

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;
  const avg = duration / iterations;
  const ops_per_sec = (iterations / duration) * 1000;
  const passed = !targetMs || avg < targetMs;

  const result: BenchmarkResult = {
    name,
    iterations,
    duration,
    avg,
    min: 0,
    max: 0,
    ops_per_sec,
    passed,
    target: targetMs ? `<${targetMs}ms` : undefined,
  };

  results.push(result);

  const statusIcon = passed ? '✓' : '✗';
  const targetStr = targetMs ? ` (target: <${targetMs}ms)` : '';
  console.log(
    `${statusIcon} ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)${targetStr}`
  );

  return result;
}

// Initialize test data
let taskCounter = 0;

function createTestTask(): Task {
  return createTask({
    title: `Test Task ${taskCounter++}`,
    description: 'A test task for benchmarking',
    priority: 'high',
    assignee: 'test-user',
    estimatedHours: 5,
    labels: ['benchmark', 'test'],
  });
}

console.log('\n📊 Project Manager Skill Performance Benchmarks\n');

// Task Creation Benchmarks
console.log('⏱️  Task Operations Benchmarks');
console.log('─'.repeat(60));

benchmark(
  'Task creation',
  5000,
  () => {
    createTask({
      title: `Task ${Date.now()}`,
      description: 'Test task',
      priority: 'medium',
      assignee: 'user@example.com',
      estimatedHours: 5,
      labels: ['test'],
    });
  },
  PERFORMANCE_TARGETS['Task creation']
);

// Task Assignment Benchmarks
let testTask = createTestTask();
benchmark(
  'Task assignment',
  5000,
  () => {
    testTask = assignTask(testTask, `user-${Math.floor(Math.random() * 100)}`);
  },
  PERFORMANCE_TARGETS['Task assignment']
);

// State Update Benchmarks
console.log('\n🔄 State Update Benchmarks');
console.log('─'.repeat(60));

testTask = createTestTask();
const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done', 'blocked'];
let statusIndex = 0;

benchmark(
  'State updates',
  5000,
  () => {
    testTask = updateTaskStatus(testTask, statuses[statusIndex % statuses.length]);
    statusIndex++;
  },
  PERFORMANCE_TARGETS['State updates']
);

benchmark(
  'Add task label',
  5000,
  () => {
    testTask = addTaskLabel(testTask, `label-${Math.floor(Math.random() * 50)}`);
  },
  PERFORMANCE_TARGETS['State updates']
);

benchmark(
  'Set due date',
  5000,
  () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
    testTask = setTaskDueDate(testTask, futureDate.toISOString().split('T')[0]);
  },
  PERFORMANCE_TARGETS['State updates']
);

benchmark(
  'Log task time',
  5000,
  () => {
    testTask = logTaskTime(testTask, Math.random() * 8);
  },
  PERFORMANCE_TARGETS['State updates']
);

// Task Query Benchmarks
console.log('\n🔍 Task Query Benchmarks');
console.log('─'.repeat(60));

// Create a sample dataset
const taskDatasets = {
  small: Array.from({ length: 100 }, () => createTestTask()),
  medium: Array.from({ length: 1000 }, () => createTestTask()),
  large: Array.from({ length: 5000 }, () => createTestTask()),
};

benchmark(
  'Task queries - Metric calculation (100 tasks)',
  1000,
  () => {
    calculateMetrics(taskDatasets.small);
  },
  PERFORMANCE_TARGETS['Task queries']
);

benchmark(
  'Task queries - Metric calculation (1K tasks)',
  100,
  () => {
    calculateMetrics(taskDatasets.medium);
  },
  PERFORMANCE_TARGETS['Task queries'] * 5
);

// Roadmap/Aggregation Benchmarks
console.log('\n🗺️  Roadmap & Aggregation Benchmarks');
console.log('─'.repeat(60));

benchmark(
  'Roadmap generation (100 tasks)',
  500,
  () => {
    const filtered = taskDatasets.small.filter((t) => t.status !== 'done');
    calculateMetrics(filtered);
  },
  PERFORMANCE_TARGETS['Roadmap generation']
);

benchmark(
  'Roadmap generation (1K tasks)',
  100,
  () => {
    const filtered = taskDatasets.medium.filter((t) => t.status !== 'done');
    calculateMetrics(filtered);
  },
  PERFORMANCE_TARGETS['Roadmap generation']
);

// Validation Benchmarks
console.log('\n✅ Validation Benchmarks');
console.log('─'.repeat(60));

benchmark(
  'Task validation',
  10000,
  () => {
    validateTask(createTestTask());
  },
  5
);

// Complex Operation Benchmarks
console.log('\n🔀 Complex Operation Benchmarks');
console.log('─'.repeat(60));

let complexTask = createTestTask();
benchmark(
  'Add task dependency',
  5000,
  () => {
    complexTask = addTaskDependency(complexTask, `task-${Math.floor(Math.random() * 1000)}`);
  },
  10
);

// Summary
console.log('\n📋 Benchmark Summary');
console.log('='.repeat(60));

const passedCount = results.filter((r) => r.passed).length;
const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
const avgOpsPerSec = (totalOps / totalDuration) * 1000;

console.log(`Total operations: ${totalOps.toLocaleString()}`);
console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);
console.log(`Tests passed: ${passedCount}/${results.length}`);

console.log('\n⚡ Performance Targets (v1.0.24)');
console.log('─'.repeat(60));
console.log('✓ Task assignment: <5ms');
console.log('✓ State updates: <10ms');
console.log('✓ Task queries: <15ms');
console.log('✓ Roadmap generation: <50ms');

console.log('\n📊 Detailed Results');
console.log('─'.repeat(60));
results.forEach((result) => {
  const status = result.passed ? '✓' : '✗';
  const targetStr = result.target ? ` [${result.target}]` : '';
  console.log(
    `${status} ${result.name.padEnd(40)} ${result.avg.toFixed(3)}ms${targetStr}`
  );
});

// Exit with appropriate code
const allPassed = results.every((r) => r.passed);
console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✅ All performance targets met!');
  process.exit(0);
} else {
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`⚠️  ${failedCount} performance target(s) not met`);
  process.exit(1);
}
