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
      else if (metrics.duplication > 3) duplicationScore = 75;
    }

    let coverageScore = 100;
    if (metrics.coverage !== undefined) {
      if (metrics.coverage < 60) coverageScore = 50;
      else if (metrics.coverage < 80) coverageScore = 75;
      else coverageScore = Math.round((metrics.coverage / 100) * 100);
    }

    let maintainabilityScore = 100;
    if (metrics.maintainability !== undefined) {
      if (metrics.maintainability < 50) maintainabilityScore = 50;
      else if (metrics.maintainability < 70) maintainabilityScore = 75;
      else maintainabilityScore = Math.round((metrics.maintainability / 100) * 100);
    }

    const aggregateScore =
      (complexityScore + duplicationScore + coverageScore + maintainabilityScore) / 4;

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

    // Performance regressions (±5% tolerance)
    const latencyChange =
      ((current.performance.latency.mean - baseline.performance.latency.mean) /
        baseline.performance.latency.mean) *
      100;
    if (Math.abs(latencyChange) > 5) {
      regressions.push({
        metric: 'latency',
        baselineValue: baseline.performance.latency.mean,
        currentValue: current.performance.latency.mean,
        changePercent: latencyChange,
        tolerance: 5,
        isRegression: latencyChange > 5,
        severity: Math.abs(latencyChange) > 10 ? 'high' : 'medium',
      });
    }

    // Code quality regressions
    const complexityChange =
      current.codeQuality.complexity.mean - baseline.codeQuality.complexity.mean;
    if (complexityChange > 0.5) {
      regressions.push({
        metric: 'complexity',
        baselineValue: baseline.codeQuality.complexity.mean,
        currentValue: current.codeQuality.complexity.mean,
        changePercent: (complexityChange / baseline.codeQuality.complexity.mean) * 100,
        tolerance: 10,
        isRegression: complexityChange > 0.5,
        severity: complexityChange > 1.0 ? 'high' : 'medium',
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
    const behavioral = this.calculateBehavioralScores(behavioralSuites);
    const quality = codeQuality
      ? this.calculateCodeQualityScore(codeQuality)
      : this.calculateCodeQualityScore({
          complexity: { mean: 2.5, max: 4 },
          duplication: 2,
          coverage: 85,
          maintainability: 80,
        });

    const { combinedScore, passed } = this.calculateCombinedScore(
      behavioral,
      performance,
      quality
    );

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
    }

    return report;
  }
}
