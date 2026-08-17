/**
 * Performance Benchmarker
 * Measures latency, throughput, and memory usage with statistical analysis
 */

import { PerformanceMetric, PerformanceScore, PerformanceTarget } from './types.js';

export class PerformanceBenchmarker {
  private metrics: PerformanceMetric[] = [];
  private sequence = 0;

  async benchmark(
    name: string,
    fn: () => Promise<void | number> | void | number,
    iterations = 100,
    unit: 'ms' | 'ops/sec' | 'MB' = 'ms'
  ): Promise<PerformanceMetric> {
    if (!Number.isInteger(iterations) || iterations < 30) {
      throw new Error(`Minimum 30 integer iterations required for statistical validity, got ${iterations}`);
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
        if (typeof result !== 'number' || !Number.isFinite(result) || result <= 0) {
          throw new Error(
            `benchmark callback for unit '${unit}' must return a positive finite measured value, got ${result}`
          );
        }
        samples.push(result);
      }
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance =
      samples.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (samples.length - 1 || 1);
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

    let min = samples[0] ?? 0;
    let max = samples[0] ?? 0;
    for (let i = 1; i < samples.length; i++) {
      if (samples[i] < min) min = samples[i];
      if (samples[i] > max) max = samples[i];
    }

    const metric: PerformanceMetric = {
      id: `metric-${++this.sequence}`,
      name,
      unit,
      mean,
      stdDev,
      min,
      max,
      samples: samples.length,
      coefficientOfVariation: cv,
      provenance: { source: 'PerformanceBenchmarker', schemaVersion: 1 },
    };

    this.metrics.push(metric);
    return metric;
  }

  getMetrics(): PerformanceMetric[] {
    return structuredClone(this.metrics);
  }

  /**
   * Score measured metrics against explicit, caller-supplied targets.
   *
   * Targets are mandatory: scoring purely on variance (coefficient of
   * variation) lets a metric that is stably bad — e.g. consistently slow,
   * or consistently near-zero throughput — pass simply because it is
   * *consistent*. Each target must include at least one of `maxMean` /
   * `minMean` so scoring reflects a real, domain-meaningful expectation.
   *
   * Metrics are matched by exact name + unit. If more than one recorded
   * metric matches a target, scoring fails loudly instead of silently
   * taking the first match.
   */
  calculatePerformanceScore(
    targets: PerformanceTarget[],
    baseline?: PerformanceMetric[]
  ): PerformanceScore {
    if (!targets || targets.length === 0) {
      throw new Error('At least one explicit performance target is required to score performance');
    }

    const items = targets.map((target) => {
      const matches = this.metrics.filter(
        (m) => m.name === target.metricName && m.unit === target.unit
      );
      if (matches.length !== 1) {
        throw new Error(
          `Expected exactly one measured metric for '${target.metricName}' (${target.unit}), found ${matches.length}. ` +
            `Ambiguous or missing metrics cannot be scored.`
        );
      }
      const metric = matches[0];

      if (target.maxMean === undefined && target.minMean === undefined) {
        throw new Error(
          `Absolute target required for '${target.metricName}': set maxMean and/or minMean`
        );
      }

      const maxCV = target.maxCV ?? 20;
      const passedVarianceTarget = metric.coefficientOfVariation <= maxCV;

      const passedMax = target.maxMean === undefined || metric.mean <= target.maxMean;
      const passedMin = target.minMean === undefined || metric.mean >= target.minMean;
      const passedAbsoluteTarget = passedMax && passedMin;

      let score = (passedVarianceTarget ? 50 : 0) + (passedAbsoluteTarget ? 50 : 0);
      let regressionPercent: number | undefined;

      if (baseline) {
        const base = baseline.find((b) => b.name === metric.name && b.unit === metric.unit);
        if (base && base.mean > 0) {
          regressionPercent = ((metric.mean - base.mean) / base.mean) * 100;
          // For ops/sec, lower is worse; for ms/MB, higher is worse.
          const isBad = metric.unit === 'ops/sec' ? regressionPercent < -5 : regressionPercent > 5;
          const isSevere = metric.unit === 'ops/sec' ? regressionPercent < -10 : regressionPercent > 10;
          if (isSevere) score = 0;
          else if (isBad) score = Math.max(0, score - 25);
        }
      }

      return {
        metricName: metric.name,
        unit: metric.unit,
        mean: metric.mean,
        stdDev: metric.stdDev,
        score,
        passedAbsoluteTarget,
        passedVarianceTarget,
        regressionPercent,
      };
    });

    const weightSum = targets.reduce((sum, t) => sum + (t.weight ?? 1), 0);
    const aggregateScore = Math.round(
      items.reduce((sum, item, i) => sum + item.score * (targets[i].weight ?? 1), 0) / weightSum
    );

    return {
      items,
      aggregateScore,
      passed: items.every((i) => i.score >= 75) && aggregateScore >= 90,
      provenance: { source: 'PerformanceBenchmarker', schemaVersion: 1 },
    };
  }
}
