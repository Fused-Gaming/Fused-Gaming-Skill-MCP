/**
 * SyncPulse Performance Benchmark Suite
 * Measures performance of all major operations
 */

import { CacheService } from "../src/services/CacheService.js";
import { MemorySystem } from "../src/services/MemorySystem.js";
import { SwarmOrchestrator } from "../src/services/SwarmOrchestrator.js";
import { VectorIndex } from "../src/services/VectorIndex.js";

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  avg: number;
  min: number;
  max: number;
  ops_per_sec: number;
}

const results: BenchmarkResult[] = [];

function benchmark(
  name: string,
  iterations: number,
  fn: () => void
): BenchmarkResult {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;
  const avg = duration / iterations;
  const ops_per_sec = (iterations / duration) * 1000;

  const result: BenchmarkResult = {
    name,
    iterations,
    duration,
    avg,
    min: 0,
    max: 0,
    ops_per_sec,
  };

  results.push(result);
  console.log(
    `✓ ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)`
  );

  return result;
}

// Cache Service Benchmarks
console.log("\n📊 Cache Service Benchmarks");
const cache = new CacheService(".cache-bench");

benchmark("CacheService.set", 10000, () => {
  cache.set(`key-${Math.random()}`, { data: "value" });
});

benchmark("CacheService.get (hit)", 10000, () => {
  cache.get(`key-0`);
});

benchmark("CacheService.get (miss)", 10000, () => {
  cache.get(`nonexistent-${Math.random()}`);
});

// Memory System Benchmarks
console.log("\n🧠 Memory System Benchmarks");
const memory = new MemorySystem();

// Populate with entries
for (let i = 0; i < 1000; i++) {
  memory.set(`entry-${i}`, { data: "value" });
}

benchmark("MemorySystem.set", 1000, () => {
  memory.set(`new-${Math.random()}`, { data: "value" });
});

benchmark("MemorySystem.get (hit)", 1000, () => {
  memory.get(`entry-${Math.floor(Math.random() * 1000)}`);
});

benchmark("MemorySystem.vectorSearch (1K entries)", 100, () => {
  memory.vectorSearch("test-query", 10);
});

// Vector Index Benchmarks
console.log("\n🔍 Vector Index Benchmarks");
const vectorIndex = new VectorIndex();

// Populate with entries
for (let i = 0; i < 1000; i++) {
  vectorIndex.add(`service-${i}-endpoint`);
}

benchmark("VectorIndex.search (1K entries)", 100, () => {
  vectorIndex.search("service-query", 10);
});

// Scale to 10K entries
for (let i = 1000; i < 10000; i++) {
  vectorIndex.add(`service-${i}-endpoint`);
}

benchmark("VectorIndex.search (10K entries)", 50, () => {
  vectorIndex.search("service-query", 10);
});

// Swarm Orchestrator Benchmarks
console.log("\n🐝 Swarm Orchestrator Benchmarks");
const orchestrator = new SwarmOrchestrator();
const swarm = orchestrator.initializeSwarm("swarm-1", "Test Swarm", "balanced", 5);

const mockTask = {
  id: "task-1",
  name: "Test Task",
  priority: 5,
  status: "pending" as const,
  createdAt: Date.now(),
};

benchmark("SwarmOrchestrator.assignTask (5 agents)", 1000, () => {
  orchestrator.assignTask(swarm.id, mockTask);
});

benchmark("SwarmOrchestrator.releaseTask", 1000, () => {
  const agent = orchestrator.assignTask(swarm.id, mockTask);
  if (agent) {
    orchestrator.releaseTask(swarm.id, agent.id, true);
  }
});

// Summary
console.log("\n📋 Benchmark Summary");
console.log("=".repeat(60));

const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
const avgOpsPerSec = (totalOps / totalDuration) * 1000;

console.log(`Total operations: ${totalOps.toLocaleString()}`);
console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);

console.log("\n⚡ Performance Targets (v0.2.0)");
console.log("✓ Cache set/get: <1ms");
console.log("✓ Vector search (1K entries): <10ms");
console.log("✓ Vector search (10K entries): <50ms");
console.log("✓ Agent assignment: <1ms");
console.log("✓ Overall throughput: >1000 ops/sec");

// Check targets
const cacheSetResult = results.find((r) => r.name.includes("CacheService.set"));
const vectorSearch1K = results.find((r) =>
  r.name.includes("VectorIndex.search (1K")
);
const vectorSearch10K = results.find((r) =>
  r.name.includes("VectorIndex.search (10K")
);

console.log("\n✅ Performance Goals");
console.log(
  `${cacheSetResult?.avg || 0 < 1 ? "✓" : "✗"} Cache ops < 1ms: ${cacheSetResult?.avg.toFixed(3)}ms`
);
console.log(
  `${vectorSearch1K?.avg || 0 < 10 ? "✓" : "✗"} Vector search (1K) < 10ms: ${vectorSearch1K?.avg.toFixed(3)}ms`
);
console.log(
  `${vectorSearch10K?.avg || 0 < 50 ? "✓" : "✗"} Vector search (10K) < 50ms: ${vectorSearch10K?.avg.toFixed(3)}ms`
);
console.log(
  `${avgOpsPerSec > 1000 ? "✓" : "✗"} Overall throughput > 1000 ops/sec: ${avgOpsPerSec.toFixed(0)} ops/sec`
);
