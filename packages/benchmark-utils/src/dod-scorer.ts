/**
 * Definition of Done Scorer
 * Calculates combined DoD score from behavioral, performance, and code quality metrics
 */

import {
  BehavioralScore,
  DoDScore,
  TestSuiteResult,
  PerformanceScore,
  CodeQualityScore,
  RegressionDetection,
} from './types';

export class DoDScorer {
  private baselineVersion?: {
    version: string;
    scores: DoDScore;
  };

  setBaseline(version: string, scores: DoDScore) {
    this.baselineVersion = { version, scores };
  }

  calculateBehavioralScores(suites: TestSuiteResult[]): {
    scores: BehavioralScore[];
    aggregateScore: number;
  } {
    const categoryWeights: Record<string, number> = {
      CORE: 0.5,
      REGRESSION: 0.3,
      FUNCTIONALITY: 0.12,
      ERROR: 0.08,
    };

    const categoryThresholds: Record<string, number> = {
      CORE: 95,
      REGRESSION: 100,
      FUNCTIONALITY: 80,
      ERROR: 90,
    };

    const scores: BehavioralScore[] = [];
    let weightedSum = 0;
    let weightSum = 0;

    for (const suite of suites) {
      const weight = categoryWeights[suite.category] || 0;
      const threshold = categoryThresholds[suite.category] || 90;

      // Check if CI lower bound meets threshold (for CORE, must have ≥93% CI)
      let passed = suite.passRate >= threshold;
      if (
        suite.category === 'CORE' &&
        suite.confidenceInterval &&
        suite.confidenceInterval.lowerBound < 93
      ) {
        passed = false;
      }

      const score = Math.min(100, suite.passRate); // Cap at 100%

      scores.push({
        category: suite.category,
        passRate: suite.passRate,
        weight,
        score,
        ciLowerBound: suite.confidenceInterval?.lowerBound,
        passed,
      });

      weightedSum += score * weight;
      weightSum += weight;
    }

    const aggregateScore = weightSum > 0 ? weightedSum / weightSum : 0;

    return { scores, aggregateScore: Math.round(aggregateScore) };
  }

  calculateCodeQualityScore(metrics: {
    complexity?: { mean: number; max: number };
    duplication?: number;
    coverage?: number;
    maintainability?: number;
  }): CodeQualityScore {
    let complexityScore = 100;
    if (metrics.complexity) {
      const { mean, max } = metrics.complexity;
      if (mean > 5 || max > 10) complexityScore = 50;
      else if (mean > 3 || max > 5) complexityScore = 75;
    }

    let duplicationScore = 100;
    if (metrics.duplication !== undefined) {
      if (metrics.duplication > 5) duplicationScore = 50;
      // >= 5% is still passing per DoD, just lower score
      else if (metrics.duplication > 0) duplicationScore = 100;
    }

    let coverageScore = 100;
    if (metrics.coverage !== undefined) {
      if (metrics.coverage < 60) coverageScore = 50;
      else if (metrics.coverage < 80) coverageScore = 75;
      else coverageScore = Math.min(100, Math.round((metrics.coverage / 100) * 100));
    }

    let maintainabilityScore = 100;
    if (metrics.maintainability !== undefined) {
      if (metrics.maintainability < 50) maintainabilityScore = 50;
      else if (metrics.maintainability < 70) maintainabilityScore = 75;
      else maintainabilityScore = Math.min(100, Math.round((metrics.maintainability / 100) * 100));
    }

    // Apply documented weights: complexity 35%, duplication 20%, coverage 25%, maintainability 20%
    const aggregateScore =
      complexityScore * 0.35 +
      duplicationScore * 0.2 +
      coverageScore * 0.25 +
      maintainabilityScore * 0.2;

    return {
      complexity: {
        mean: metrics.complexity?.mean || 0,
        max: metrics.complexity?.max || 0,
        score: complexityScore,
      },
      duplication: {
        percentDuplicated: metrics.duplication || 0,
        score: duplicationScore,
      },
      coverage: {
        percent: metrics.coverage || 0,
        score: coverageScore,
      },
      maintainability: {
        index: metrics.maintainability || 0,
        score: maintainabilityScore,
      },
      aggregateScore: Math.round(aggregateScore),
    };
  }

  calculateCombinedScore(
    behavioral: { aggregateScore: number },
    performance: { aggregateScore: number },
    quality: { aggregateScore: number }
  ): {
    combinedScore: number;
    passed: boolean;
  } {
    const combinedScore =
      behavioral.aggregateScore * 0.4 +
      performance.aggregateScore * 0.35 +
      quality.aggregateScore * 0.25;

    return {
      combinedScore: Math.round(combinedScore),
      passed: combinedScore >= 90,
    };
  }

  detectRegressions(
    current: DoDScore,
    baseline?: DoDScore
  ): RegressionDetection[] {
    const regressions: RegressionDetection[] = [];

    if (!baseline) return regressions;

    // Latency regressions (±5% tolerance, exclude improvements)
    const latencyChange =
      ((current.performance.latency.mean - baseline.performance.latency.mean) /
        baseline.performance.latency.mean) *
      100;
    if (latencyChange > 5) {
      // Only report increases as regressions
      regressions.push({
        metric: 'latency',
        baselineValue: baseline.performance.latency.mean,
        currentValue: current.performance.latency.mean,
        changePercent: latencyChange,
        tolerance: 5,
        isRegression: true,
        severity: latencyChange > 10 ? 'high' : 'medium',
      });
    }

    // Throughput regressions (lower throughput is bad)
    if (baseline.performance.throughput.mean > 0) {
      const throughputChange =
        ((current.performance.throughput.mean - baseline.performance.throughput.mean) /
          baseline.performance.throughput.mean) *
        100;
      if (throughputChange < -5) {
        // Negative change means regression
        regressions.push({
          metric: 'throughput',
          baselineValue: baseline.performance.throughput.mean,
          currentValue: current.performance.throughput.mean,
          changePercent: throughputChange,
          tolerance: 5,
          isRegression: true,
          severity: throughputChange < -10 ? 'high' : 'medium',
        });
      }
    }

    // Memory regressions (±5% tolerance, only penalize increases)
    if (baseline.performance.memory.peakMB > 0) {
      const memoryChange =
        ((current.performance.memory.peakMB - baseline.performance.memory.peakMB) /
          baseline.performance.memory.peakMB) *
        100;
      if (memoryChange > 5) {
        // Only report increases as regressions
        regressions.push({
          metric: 'memory',
          baselineValue: baseline.performance.memory.peakMB,
          currentValue: current.performance.memory.peakMB,
          changePercent: memoryChange,
          tolerance: 5,
          isRegression: true,
          severity: memoryChange > 10 ? 'high' : 'medium',
        });
      }
    }

    // Complexity regressions (documented: ±10% tolerance)
    if (baseline.codeQuality.complexity.mean > 0) {
      const complexityChange =
        ((current.codeQuality.complexity.mean - baseline.codeQuality.complexity.mean) /
          baseline.codeQuality.complexity.mean) *
        100;
      if (complexityChange > 10) {
        regressions.push({
          metric: 'complexity',
          baselineValue: baseline.codeQuality.complexity.mean,
          currentValue: current.codeQuality.complexity.mean,
          changePercent: complexityChange,
          tolerance: 10,
          isRegression: true,
          severity: complexityChange > 20 ? 'high' : 'medium',
        });
      }
    }

    // Duplication regressions (documented: ±2% tolerance)
    const duplicationChange =
      current.codeQuality.duplication.percentDuplicated -
      baseline.codeQuality.duplication.percentDuplicated;
    if (duplicationChange > 2) {
      regressions.push({
        metric: 'duplication',
        baselineValue: baseline.codeQuality.duplication.percentDuplicated,
        currentValue: current.codeQuality.duplication.percentDuplicated,
        changePercent:
          baseline.codeQuality.duplication.percentDuplicated > 0
            ? (duplicationChange / baseline.codeQuality.duplication.percentDuplicated) * 100
            : 100,
        tolerance: 2,
        isRegression: true,
        severity: duplicationChange > 5 ? 'high' : 'medium',
      });
    }

    // Behavioral regressions (REGRESSION tests must stay 100%)
    const currentRegression = current.behavioral.scores.find(
      (s) => s.category === 'REGRESSION'
    );
    const baselineRegression = baseline.behavioral.scores.find(
      (s) => s.category === 'REGRESSION'
    );
    if (
      currentRegression &&
      baselineRegression &&
      currentRegression.passRate < 100 &&
      baselineRegression.passRate === 100
    ) {
      regressions.push({
        metric: 'behavioral_regression',
        baselineValue: baselineRegression.passRate,
        currentValue: currentRegression.passRate,
        changePercent: currentRegression.passRate - baselineRegression.passRate,
        tolerance: 0,
        isRegression: true,
        severity: 'high',
      });
    }

    return regressions;
  }

  generateDoDReport(
    version: string,
    behavioralSuites: TestSuiteResult[],
    performance: PerformanceScore,
    codeQuality?: {
      complexity?: { mean: number; max: number };
      duplication?: number;
      coverage?: number;
      maintainability?: number;
    }
  ): DoDScore {
    if (!codeQuality) {
      throw new Error(
        'Code quality metrics are required for DoD report. Measure and provide actual metrics instead of fabricating defaults.'
      );
    }

    const behavioral = this.calculateBehavioralScores(behavioralSuites);
    const quality = this.calculateCodeQualityScore(codeQuality);

    const { combinedScore, passed: scorePass } = this.calculateCombinedScore(
      behavioral,
      performance,
      quality
    );

    // Enforce mandatory component gates
    let passed = scorePass;

    // All required test suites must be present
    const requiredCategories: Array<'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR'> = [
      'CORE',
      'REGRESSION',
      'FUNCTIONALITY',
      'ERROR',
    ];
    const providedCategories = new Set(behavioral.scores.map((s) => s.category));
    if (!requiredCategories.every((c) => providedCategories.has(c))) {
      passed = false; // Missing required test suite
    }

    // REGRESSION tests must be 100%
    const regressionScore = behavioral.scores.find((s) => s.category === 'REGRESSION');
    if (regressionScore && regressionScore.passRate < 100) {
      passed = false;
    }

    // CORE tests must pass CI check
    const coreScore = behavioral.scores.find((s) => s.category === 'CORE');
    if (coreScore && !coreScore.passed) {
      passed = false;
    }

    // Code coverage must be >= 70%
    if (codeQuality.coverage !== undefined && codeQuality.coverage < 70) {
      passed = false;
    }

    const report: DoDScore = {
      version,
      timestamp: new Date().toISOString(),
      behavioral,
      performance,
      codeQuality: quality,
      combinedScore,
      passed,
      regressions: [],
    };

    // Detect regressions if baseline exists
    if (this.baselineVersion) {
      report.regressions = this.detectRegressions(report, this.baselineVersion.scores);

      // Major regressions fail the report
      const majorRegressions = report.regressions.filter(
        (r) => r.isRegression && r.severity === 'high'
      );
      if (majorRegressions.length > 0) {
        passed = false;
      }
    }

    report.passed = passed;
    return report;
  }
}
