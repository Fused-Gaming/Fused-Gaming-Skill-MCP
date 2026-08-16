/**
 * Project Manager Skill Release Performance Benchmark Suite
 * Comprehensive performance testing with increased memory allocation
 * Run with: node --expose-gc --max-old-space-size=4096 --loader ts-node/esm benchmarks/release-performance.benchmark.ts
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
  memory?: {
    before: number;
    after: number;
    delta: number;
  };
}

const results: BenchmarkResult[] = [];

// Performance targets for release (stricter in some cases)
const PERFORMANCE_TARGETS: Record<string, number> = {
  'Task creation': 5,
  'Task assignment': 5,
  'State updates': 10,
  'Task queries': 15,
  'Roadmap generation': 50,
};

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function benchmark(
  name: string,
  iterations: number,
  fn: () => void,
  targetMs?: number,
  trackMemory = false
): BenchmarkResult {
  // Force garbage collection before benchmark
  if (global.gc) {
    global.gc();
  }

  let memoryBefore = 0;
  let memoryAfter = 0;

  if (trackMemory) {
    memoryBefore = process.memoryUsage().heapUsed;
  }

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;

  if (trackMemory && global.gc) {
    global.gc();
    memoryAfter = process.memoryUsage().heapUsed;
  }

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

  if (trackMemory && memoryAfter > 0) {
    result.memory = {
      before: memoryBefore,
      after: memoryAfter,
      delta: memoryAfter - memoryBefore,
    };
  }

  results.push(result);

  const statusIcon = passed ? '✓' : '✗';
  const targetStr = targetMs ? ` (target: <${targetMs}ms)` : '';
  const memoryStr = result.memory
    ? ` | Memory delta: ${formatBytes(result.memory.delta)}`
    : '';
  console.log(
    `${statusIcon} ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)${targetStr}${memoryStr}`
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

console.log('\n📊 Project Manager Skill Release Performance Benchmarks\n');
console.log('Configuration:');
console.log(`  • Node memory: ${formatBytes(process.memoryUsage().heapTotal)}`);
console.log(`  • Memory tracking: enabled`);
console.log(`  • GC tracking: ${global.gc ? 'enabled' : 'disabled'}`);
console.log('');

// Task Creation Benchmarks
console.log('⏱️  Task Operations Benchmarks');
console.log('─'.repeat(70));

benchmark(
  'Task creation (10K iterations)',
  10000,
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
  PERFORMANCE_TARGETS['Task creation'],
  true
);

// Task Assignment Benchmarks
let testTask = createTestTask();
benchmark(
  'Task assignment (10K iterations)',
  10000,
  () => {
    testTask = assignTask(testTask, `user-${Math.floor(Math.random() * 100)}`);
  },
  PERFORMANCE_TARGETS['Task assignment'],
  true
);

// State Update Benchmarks
console.log('\n🔄 State Update Benchmarks');
console.log('─'.repeat(70));

testTask = createTestTask();
const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done', 'blocked'];
let statusIndex = 0;

benchmark(
  'State updates (10K iterations)',
  10000,
  () => {
    testTask = updateTaskStatus(testTask, statuses[statusIndex % statuses.length]);
    statusIndex++;
  },
  PERFORMANCE_TARGETS['State updates'],
  true
);

benchmark(
  'Add task label (10K iterations)',
  10000,
  () => {
    testTask = addTaskLabel(testTask, `label-${Math.floor(Math.random() * 50)}`);
  },
  PERFORMANCE_TARGETS['State updates'],
  true
);

benchmark(
  'Set due date (10K iterations)',
  10000,
  () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
    testTask = setTaskDueDate(testTask, futureDate.toISOString().split('T')[0]);
  },
  PERFORMANCE_TARGETS['State updates'],
  true
);

// Task Query Benchmarks with Various Scales
console.log('\n🔍 Task Query Benchmarks');
console.log('─'.repeat(70));

// Create larger sample datasets for release testing
const taskDatasets = {
  small: Array.from({ length: 100 }, () => createTestTask()),
  medium: Array.from({ length: 1000 }, () => createTestTask()),
  large: Array.from({ length: 10000 }, () => createTestTask()),
};

benchmark(
  'Metrics (100 tasks, 1K iterations)',
  1000,
  () => {
    calculateMetrics(taskDatasets.small);
  },
  PERFORMANCE_TARGETS['Task queries'],
  true
);

benchmark(
  'Metrics (1K tasks, 500 iterations)',
  500,
  () => {
    calculateMetrics(taskDatasets.medium);
  },
  PERFORMANCE_TARGETS['Task queries'] * 5,
  true
);

benchmark(
  'Metrics (10K tasks, 100 iterations)',
  100,
  () => {
    calculateMetrics(taskDatasets.large);
  },
  PERFORMANCE_TARGETS['Task queries'] * 10,
  true
);

// Roadmap/Aggregation Benchmarks
console.log('\n🗺️  Roadmap & Aggregation Benchmarks');
console.log('─'.repeat(70));

benchmark(
  'Roadmap (100 tasks, 1K iterations)',
  1000,
  () => {
    const filtered = taskDatasets.small.filter((t) => t.status !== 'done');
    calculateMetrics(filtered);
  },
  PERFORMANCE_TARGETS['Roadmap generation'],
  true
);

benchmark(
  'Roadmap (1K tasks, 500 iterations)',
  500,
  () => {
    const filtered = taskDatasets.medium.filter((t) => t.status !== 'done');
    calculateMetrics(filtered);
  },
  PERFORMANCE_TARGETS['Roadmap generation'] * 2,
  true
);

benchmark(
  'Roadmap (10K tasks, 100 iterations)',
  100,
  () => {
    const filtered = taskDatasets.large.filter((t) => t.status !== 'done');
    calculateMetrics(filtered);
  },
  PERFORMANCE_TARGETS['Roadmap generation'] * 5,
  true
);

// Batch Operations Benchmarks
console.log('\n📦 Batch Operations Benchmarks');
console.log('─'.repeat(70));

benchmark(
  'Batch validation (100 tasks, 100 iterations)',
  100,
  () => {
    taskDatasets.small.forEach((task) => {
      validateTask(task);
    });
  },
  50,
  true
);

benchmark(
  'Batch update status (1K tasks, 50 iterations)',
  50,
  () => {
    taskDatasets.medium.forEach((task) => {
      updateTaskStatus(task, 'in-progress');
    });
  },
  100,
  true
);

// Stress Test
console.log('\n💪 Stress Test Benchmarks');
console.log('─'.repeat(70));

let stressTask = createTestTask();
benchmark(
  'Complex multi-operation (5K iterations)',
  5000,
  () => {
    stressTask = createTestTask();
    stressTask = assignTask(stressTask, `user-${Math.floor(Math.random() * 100)}`);
    stressTask = updateTaskStatus(stressTask, 'in-progress');
    stressTask = addTaskLabel(stressTask, `label-${Math.floor(Math.random() * 50)}`);
    stressTask = addTaskDependency(stressTask, `task-${Math.floor(Math.random() * 1000)}`);
    stressTask = logTaskTime(stressTask, Math.random() * 8);
  },
  30,
  true
);

// Summary
console.log('\n📋 Benchmark Summary');
console.log('='.repeat(70));

const passedCount = results.filter((r) => r.passed).length;
const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
const avgOpsPerSec = (totalOps / totalDuration) * 1000;
const totalMemoryUsed = results.reduce((sum, r) => sum + (r.memory?.delta || 0), 0);

console.log(`Total operations: ${totalOps.toLocaleString()}`);
console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);
console.log(`Tests passed: ${passedCount}/${results.length}`);
if (totalMemoryUsed !== 0) {
  console.log(`Total memory used: ${formatBytes(totalMemoryUsed)}`);
}

console.log('\n⚡ Performance Targets (v1.0.24 - Release Mode)');
console.log('─'.repeat(70));
console.log('✓ Task assignment: <5ms');
console.log('✓ State updates: <10ms');
console.log('✓ Task queries: <15ms');
console.log('✓ Roadmap generation: <50ms');

console.log('\n📊 Detailed Results');
console.log('─'.repeat(70));
results.forEach((result) => {
  const status = result.passed ? '✓' : '✗';
  const targetStr = result.target ? ` [${result.target}]` : '';
  const memoryStr = result.memory ? ` | Δ${formatBytes(result.memory.delta)}` : '';
  console.log(
    `${status} ${result.name.padEnd(45)} ${result.avg.toFixed(3)}ms${targetStr}${memoryStr}`
  );
});

// Performance Summary by Category
console.log('\n🎯 Performance Summary by Category');
console.log('─'.repeat(70));

const categories = {
  creation: results.filter((r) => r.name.includes('creation')),
  assignment: results.filter((r) => r.name.includes('assignment')),
  updates: results.filter((r) => r.name.includes('updates') || r.name.includes('label') || r.name.includes('due')),
  queries: results.filter((r) => r.name.includes('Metrics') || r.name.includes('queries')),
  roadmap: results.filter((r) => r.name.includes('Roadmap')),
};

Object.entries(categories).forEach(([category, categoryResults]) => {
  if (categoryResults.length > 0) {
    const avgTime = categoryResults.reduce((sum, r) => sum + r.avg, 0) / categoryResults.length;
    const allPassed = categoryResults.every((r) => r.passed);
    const status = allPassed ? '✓' : '✗';
    console.log(`${status} ${category.padEnd(20)} avg: ${avgTime.toFixed(3)}ms`);
  }
});

// Exit with appropriate code
const allPassed = results.every((r) => r.passed);
console.log('\n' + '='.repeat(70));
if (allPassed) {
  console.log('✅ All release performance targets met!');
  process.exit(0);
} else {
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`⚠️  ${failedCount} release performance target(s) not met`);
  console.log('\nFailed benchmarks:');
  results.filter((r) => !r.passed).forEach((r) => {
    console.log(`  • ${r.name}: ${r.avg.toFixed(3)}ms (target: ${r.target})`);
  });
  process.exit(1);
}
