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
    // Validate iterations is a finite positive number
    if (!Number.isFinite(iterations) || iterations <= 0) {
      throw new Error(`Iteration count must be a finite positive number, got ${iterations}`);
    }
    if (iterations < 30) {
      throw new Error(`Minimum 30 iterations required for statistical validity, got ${iterations}`);
    }

    const samples: number[] = [];

    if (unit === 'ms') {
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await fn();
        const sample = performance.now() - start;
        if (!Number.isFinite(sample)) {
          throw new Error(`Invalid latency sample: ${sample} (not a finite number)`);
        }
        samples.push(sample);
      }
    } else {
      for (let i = 0; i < iterations; i++) {
        const result = await fn();
        if (typeof result !== 'number' || result <= 0) {
          throw new Error(
            `benchmark callback for unit '${unit}' must return positive number, got ${result}`
          );
        }
        if (!Number.isFinite(result)) {
          throw new Error(`Invalid sample: ${result} (not a finite number)`);
        }
        samples.push(result);
      }
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance =
      samples.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (samples.length - 1 || 1);
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0; // Coefficient of variation

    let min = samples[0] ?? 0;
    let max = samples[0] ?? 0;
    for (let i = 1; i < samples.length; i++) {
      if (samples[i] < min) min = samples[i];
      if (samples[i] > max) max = samples[i];
    }

    const metric: PerformanceMetric = {
      name,
      unit,
      mean,
      stdDev,
      min,
      max,
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
    // Extract metrics by unit, not by name substring
    const latencyMetric = this.metrics.find((m) => m.unit === 'ms');
    const throughputMetric = this.metrics.find((m) => m.unit === 'ops/sec');
    const memoryMetric = this.metrics.find((m) => m.unit === 'MB');

    // Score latency (lower is better; CV: <10% = 100, 10-20% = 80, >20% = 60)
    let latencyScore = 0;
    if (!latencyMetric) {
      latencyScore = 0; // Missing metric gets 0
    } else {
      const cv = latencyMetric.coefficientOfVariation || 0;
      if (cv < 10) latencyScore = 100; // Excellent
      else if (cv <= 20) latencyScore = 80; // Acceptable
      else latencyScore = 60; // Marginal

      if (baseline) {
        const baselineLatency = baseline.find((m) => m.unit === 'ms');
        if (baselineLatency && baselineLatency.mean > 0) {
          const changePercent =
            ((latencyMetric.mean - baselineLatency.mean) / baselineLatency.mean) * 100;
          if (changePercent > 10) {
            latencyScore = 0; // Major regression: hard fail
          } else if (changePercent > 5) {
            latencyScore = Math.max(0, latencyScore - 10); // Moderate penalty
          }
        }
      }
    }

    // Score throughput (higher is better; same CV thresholds as latency)
    let throughputScore = 0;
    if (!throughputMetric) {
      throughputScore = 0; // Missing metric gets 0
    } else {
      const cv = throughputMetric.coefficientOfVariation || 0;
      if (cv < 10) throughputScore = 100; // Excellent
      else if (cv <= 20) throughputScore = 80; // Acceptable
      else throughputScore = 60; // Marginal

      if (baseline) {
        const baselineThroughput = baseline.find((m) => m.unit === 'ops/sec');
        if (baselineThroughput && baselineThroughput.mean > 0) {
          const changePercent =
            ((throughputMetric.mean - baselineThroughput.mean) / baselineThroughput.mean) * 100;
          if (changePercent < -10) {
            throughputScore = 0; // Major regression: hard fail
          } else if (changePercent < -5) {
            throughputScore = Math.max(0, throughputScore - 10); // Moderate penalty
          }
        }
      }
    }

    // Score memory (lower is better; penalize only increases, not improvements)
    let memoryScore = 0;
    let changePercent = 0;
    if (!memoryMetric) {
      memoryScore = 0; // Missing metric gets 0
    } else if (baseline) {
      const baselineMemory = baseline.find((m) => m.unit === 'MB');
      if (baselineMemory && baselineMemory.max > 0) {
        changePercent =
          ((memoryMetric.max - baselineMemory.max) / baselineMemory.max) * 100;
        // Only penalize increases, not improvements (negative changes are acceptable)
        if (changePercent > 10) {
          memoryScore = 0; // Major regression: hard fail
        } else if (changePercent > 5) {
          memoryScore = 80; // Moderate increase: penalize
        } else {
          memoryScore = 100; // Within tolerance or improvement
        }
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
        peakMB: memoryMetric?.max || 0,
        changePercent,
        score: memoryScore,
      },
      aggregateScore: Math.round(aggregateScore),
    };
  }
}
