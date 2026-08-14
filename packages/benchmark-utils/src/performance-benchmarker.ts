/**
 * Performance Benchmarker
 * Measures latency, throughput, and memory usage with statistical analysis
 */

import { PerformanceMetric, PerformanceScore } from './types.js';

export class PerformanceBenchmarker {
  private metrics: PerformanceMetric[] = [];

  async benchmark(
    name: string,
    fn: () => Promise<void | number> | void | number,
    iterations = 100,
    unit: 'ms' | 'ops/sec' | 'MB' = 'ms'
  ): Promise<PerformanceMetric> {
    if (iterations <= 0) {
      throw new Error(`Iteration count must be positive, got ${iterations}`);
    }

    const samples: number[] = [];

    if (unit === 'ms') {
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await fn();
        samples.push(performance.now() - start);
      }
    } else {
      for (let i = 0; i < iterations; i++) {
        const result = await fn();
        if (typeof result !== 'number' || result <= 0) {
          throw new Error(
            `benchmark callback for unit '${unit}' must return positive number, got ${result}`
          );
        }
        samples.push(result);
      }
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance =
      samples.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (samples.length - 1 || 1);
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0; // Coefficient of variation

    const metric: PerformanceMetric = {
      name,
      unit,
      mean,
      stdDev,
      min: Math.min(...samples),
      max: Math.max(...samples),
      samples: samples.length,
      coefficientOfVariation: cv,
    };

    this.metrics.push(metric);
    return metric;
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  calculatePerformanceScore(baseline?: PerformanceMetric[]): PerformanceScore {
    // Extract latency and throughput metrics
    const latencyMetric = this.metrics.find(
      (m) => m.unit === 'ms' && m.name.includes('latency')
    );
    const throughputMetric = this.metrics.find(
      (m) => m.unit === 'ops/sec' && m.name.includes('throughput')
    );
    const memoryMetric = this.metrics.find(
      (m) => m.unit === 'MB' && m.name.includes('memory')
    );

    // Score latency (lower is better, target CV < 10%)
    let latencyScore = 0;
    if (!latencyMetric) {
      latencyScore = 0; // Missing metric gets 0, not perfect
    } else {
      const cv = latencyMetric.coefficientOfVariation || 0;
      if (cv > 20) latencyScore = 60; // Poor stability
      else if (cv > 10) latencyScore = 80; // Acceptable
      else latencyScore = 100; // Excellent

      if (baseline) {
        const baselineLatency = baseline.find((m) => m.name === latencyMetric.name);
        if (baselineLatency) {
          const changePercent =
            ((latencyMetric.mean - baselineLatency.mean) / baselineLatency.mean) * 100;
          if (changePercent > 5) latencyScore -= 10; // Regression penalty
        }
      }
    }

    // Score throughput (higher is better)
    let throughputScore = 0;
    if (!throughputMetric) {
      throughputScore = 0; // Missing metric gets 0, not perfect
    } else {
      const cv = throughputMetric.coefficientOfVariation || 0;
      if (cv > 20) throughputScore = 60;
      else if (cv > 10) throughputScore = 80;
      else throughputScore = 100;

      if (baseline) {
        const baselineThroughput = baseline.find((m) => m.name === throughputMetric.name);
        if (baselineThroughput) {
          const changePercent =
            ((throughputMetric.mean - baselineThroughput.mean) / baselineThroughput.mean) *
            100;
          if (changePercent < -5) throughputScore -= 10; // Regression penalty
        }
      }
    }

    // Score memory (lower is better, ±5% tolerance)
    let memoryScore = 0;
    let changePercent = 0;
    if (!memoryMetric) {
      memoryScore = 0; // Missing metric gets 0
    } else if (baseline) {
      const baselineMemory = baseline.find((m) => m.name === memoryMetric.name);
      if (baselineMemory) {
        changePercent =
          ((memoryMetric.mean - baselineMemory.mean) / baselineMemory.mean) * 100;
        // Penalize increases, reward improvements (don't penalize negative changes)
        if (changePercent > 5) memoryScore = 80;
        else memoryScore = 100;
      } else {
        memoryScore = 100; // No baseline, accept as is
      }
    } else {
      memoryScore = 100; // No baseline comparison
    }

    // Apply documented weights: latency 40%, throughput 40%, memory 20%
    const aggregateScore =
      latencyScore * 0.4 + throughputScore * 0.4 + memoryScore * 0.2;

    return {
      latency: {
        mean: latencyMetric?.mean || 0,
        stdDev: latencyMetric?.stdDev || 0,
        score: latencyScore,
      },
      throughput: {
        mean: throughputMetric?.mean || 0,
        stdDev: throughputMetric?.stdDev || 0,
        score: throughputScore,
      },
      memory: {
        peakMB: memoryMetric?.mean || 0,
        changePercent,
        score: memoryScore,
      },
      aggregateScore: Math.round(aggregateScore),
    };
  }
}
