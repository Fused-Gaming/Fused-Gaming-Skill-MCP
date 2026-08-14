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
  ConfidenceInterval,
} from './types.js';

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

    // Aggregate suites by category (handle multiple suites per category)
    const categoryAggregates: Record<string, { totalPass: number; totalTests: number; passed: boolean }> = {};

    for (const suite of suites) {
      // Validate suite counts
      if (!Number.isFinite(suite.passCount) || !Number.isFinite(suite.totalCount) ||
          suite.passCount < 0 || suite.totalCount < 0 || suite.passCount > suite.totalCount) {
        throw new Error(
          `Invalid suite counts for ${suite.category}: passCount=${suite.passCount}, totalCount=${suite.totalCount}. ` +
          `Counts must be finite, non-negative integers with passCount <= totalCount.`
        );
      }

      if (!categoryAggregates[suite.category]) {
        categoryAggregates[suite.category] = { totalPass: 0, totalTests: 0, passed: true };
      }
      categoryAggregates[suite.category].totalPass += suite.passCount;
      categoryAggregates[suite.category].totalTests += suite.totalCount;
    }

    // Calculate score once per category, apply weight once
    let weightedSum = 0;
    let weightSum = 0;

    for (const [category, aggregate] of Object.entries(categoryAggregates)) {
      const weight = categoryWeights[category] || 0;
      const threshold = categoryThresholds[category] || 90;
      const totalTests = aggregate.totalTests;
      const totalPass = aggregate.totalPass;
      const passRate = totalTests > 0 ? (totalPass / totalTests) * 100 : 0;

      // Check all suites in this category against threshold
      let passed = passRate >= threshold;
      let ciLowerBound: number | undefined;

      // Apply confidence interval bounds per DoD: CORE (93%), FUNCTIONALITY (75%), ERROR (85%)
      const ciBounds: Record<string, number> = {
        CORE: 93,
        FUNCTIONALITY: 75,
        ERROR: 85,
      };

      if (category in ciBounds) {
        const confidenceInterval = this.calculateConfidenceInterval(passRate, totalTests);
        ciLowerBound = confidenceInterval.lowerBound;
        const requiredBound = ciBounds[category];
        if (ciLowerBound !== undefined && ciLowerBound < requiredBound) {
          passed = false;
        }
      }

      const score = Math.min(100, passRate); // Cap at 100%

      scores.push({
        category: category as any,
        passRate,
        weight,
        score,
        ciLowerBound,
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

    // Coverage: ≥80% acceptable (maps to 100), 70-79% marginal (75), <70% insufficient (50)
    let coverageScore = 100;
    if (metrics.coverage !== undefined) {
      if (metrics.coverage < 70) coverageScore = 50;
      else if (metrics.coverage < 80) coverageScore = 75;
      else coverageScore = 100; // ≥80% is acceptable, award full credit
    }

    // Maintainability: 70-84 acceptable (maps to 100), 65-69 moderate (75), <65 low (50)
    let maintainabilityScore = 100;
    if (metrics.maintainability !== undefined) {
      if (metrics.maintainability < 65) maintainabilityScore = 50;
      else if (metrics.maintainability < 70) maintainabilityScore = 75;
      else maintainabilityScore = 100; // ≥70 is acceptable, award full credit
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
      passed: combinedScore >= 90, // Check unrounded score, not rounded
    };
  }

  detectRegressions(
    current: DoDScore,
    baseline?: DoDScore
  ): RegressionDetection[] {
    const regressions: RegressionDetection[] = [];

    if (!baseline) return regressions;

    // Latency regressions (±5% tolerance, exclude improvements)
    if (baseline.performance.latency.mean > 0) {
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

    // Complexity regressions (documented: ±10% tolerance, high severity >15%)
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
          severity: complexityChange > 15 ? 'high' : 'medium',
        });
      }
    }

    // Duplication regressions (documented: ±2% tolerance, high severity >5 point increase)
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
    codeQuality: {
      complexity: { mean: number; max: number };
      duplication: number;
      coverage: number;
      maintainability: number;
    }
  ): DoDScore {
    if (!codeQuality) {
      throw new Error(
        'Code quality metrics are required for DoD report. Measure and provide actual metrics instead of fabricating defaults.'
      );
    }

    // Validate all required code quality fields are present and have non-undefined values
    if (
      codeQuality.complexity === undefined ||
      codeQuality.complexity.mean === undefined ||
      codeQuality.complexity.max === undefined ||
      codeQuality.duplication === undefined ||
      codeQuality.coverage === undefined ||
      codeQuality.maintainability === undefined
    ) {
      throw new Error(
        'All code quality metrics required: complexity (mean, max), duplication, coverage, maintainability. Do not omit fields.'
      );
    }

    // Validate all metrics are finite numbers (reject NaN, Infinity, -Infinity)
    if (
      !Number.isFinite(codeQuality.complexity.mean) ||
      !Number.isFinite(codeQuality.complexity.max) ||
      !Number.isFinite(codeQuality.duplication) ||
      !Number.isFinite(codeQuality.coverage) ||
      !Number.isFinite(codeQuality.maintainability)
    ) {
      throw new Error(
        'Code quality metrics must be finite numbers. Received NaN, Infinity, or -Infinity in one or more fields.'
      );
    }

    // Validate metric ranges: complexity ≥0, duplication/coverage 0-100, maintainability 0-100+
    if (codeQuality.complexity.mean < 0 || codeQuality.complexity.max < 0) {
      throw new Error(
        'Complexity metrics must be non-negative. Received negative mean or max complexity.'
      );
    }
    if (codeQuality.duplication < 0 || codeQuality.duplication > 100) {
      throw new Error(
        'Duplication must be 0-100%. Received out-of-range value.'
      );
    }
    if (codeQuality.coverage < 0 || codeQuality.coverage > 100) {
      throw new Error(
        'Coverage must be 0-100%. Received out-of-range value.'
      );
    }
    if (codeQuality.maintainability < 0 || codeQuality.maintainability > 200) {
      throw new Error(
        'Maintainability index must be 0-200. Received out-of-range value.'
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

    // ALL REGRESSION tests must be 100%
    const regressionScores = behavioral.scores.filter((s) => s.category === 'REGRESSION');
    if (regressionScores.length === 0) {
      passed = false; // Missing REGRESSION suite entirely
    } else if (regressionScores.some((s) => s.passRate < 100)) {
      passed = false; // Any REGRESSION suite below 100%
    }

    // CORE tests must pass CI check
    const coreScore = behavioral.scores.find((s) => s.category === 'CORE');
    if (coreScore && !coreScore.passed) {
      passed = false;
    }

    // Code complexity max must be <= 8 (per DoD: >8 is hard to test, block release)
    if (codeQuality.complexity && codeQuality.complexity.max > 8) {
      passed = false;
    }

    // Code duplication must be <= 15% (per DoD: >15% requires refactoring, block release)
    if (codeQuality.duplication && codeQuality.duplication > 15) {
      passed = false;
    }

    // Code coverage must be >= 70%
    if (codeQuality.coverage !== undefined && codeQuality.coverage < 70) {
      passed = false;
    }

    // Code maintainability must be >= 50 (per DoD: <50 blocks release)
    if (codeQuality.maintainability !== undefined && codeQuality.maintainability < 50) {
      passed = false;
    }

    // Behavioral aggregate score must be >= 90%
    if (behavioral.aggregateScore < 90) {
      passed = false;
    }

    // Validate performance aggregate score is finite and within 0-100
    if (!Number.isFinite(performance.aggregateScore) || performance.aggregateScore < 0 || performance.aggregateScore > 100) {
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

  private calculateConfidenceInterval(
    passRate: number,
    sampleSize: number,
    confidence = 0.95
  ): ConfidenceInterval {
    const p = passRate / 100;
    const z = confidence === 0.95 ? 1.96 : 2.576; // Z-score for 95% and 99% CI

    const standardError = Math.sqrt((p * (1 - p)) / sampleSize);
    const margin = z * standardError;

    return {
      lowerBound: Math.max(0, (p - margin) * 100),
      upperBound: Math.min(100, (p + margin) * 100),
      standardError: standardError * 100,
      confidence,
    };
  }
}
