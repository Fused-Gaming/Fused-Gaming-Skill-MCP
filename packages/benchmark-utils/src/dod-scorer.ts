/**
 * Definition of Done Scorer
 * Calculates combined DoD score from behavioral, performance, and code quality metrics
 */

import {
  BehavioralScore,
  CodeQualityMetrics,
  CodeQualityScore,
  DoDScore,
  PerformanceScore,
  RegressionDetection,
  TestCategory,
  TestSuiteResult,
} from './types.js';
import { wilsonInterval } from './statistics.js';

const CATEGORY_WEIGHTS: Record<TestCategory, number> = {
  CORE: 0.5,
  REGRESSION: 0.3,
  FUNCTIONALITY: 0.12,
  ERROR: 0.08,
};

const CATEGORY_THRESHOLDS: Record<TestCategory, number> = {
  CORE: 95,
  REGRESSION: 100,
  FUNCTIONALITY: 80,
  ERROR: 90,
};

// Confidence interval lower-bound requirements per DoD.
const CI_BOUNDS: Partial<Record<TestCategory, number>> = {
  CORE: 93,
  FUNCTIONALITY: 75,
  ERROR: 85,
};

const REQUIRED_CATEGORIES: TestCategory[] = ['CORE', 'REGRESSION', 'FUNCTIONALITY', 'ERROR'];

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
    const byCategory = new Map<TestCategory, TestSuiteResult[]>();

    for (const suite of suites) {
      // Trust boundary: only accept suite results that actually came from
      // BehavioralTester, and re-derive counts from the concrete result
      // records rather than trusting caller-supplied totals.
      if (suite.provenance?.source !== 'BehavioralTester') {
        throw new Error(`Untrusted behavioral provenance for ${suite.category}`);
      }
      if (suite.results.length !== suite.totalCount) {
        throw new Error(
          `Result count mismatch for ${suite.category}: totalCount=${suite.totalCount} but ` +
            `${suite.results.length} result records were provided.`
        );
      }
      const derivedPass = suite.results.filter((r) => r.passed).length;
      if (derivedPass !== suite.passCount) {
        throw new Error(
          `Pass count mismatch for ${suite.category}: passCount=${suite.passCount} but ` +
            `${derivedPass} result records are marked passed.`
        );
      }
      if (suite.totalCount <= 0) {
        throw new Error(`Empty ${suite.category} suite is not allowed`);
      }

      const list = byCategory.get(suite.category) ?? [];
      list.push(suite);
      byCategory.set(suite.category, list);
    }

    for (const category of REQUIRED_CATEGORIES) {
      if (!byCategory.has(category)) {
        throw new Error(`Missing required ${category} suite`);
      }
    }

    const scores: BehavioralScore[] = REQUIRED_CATEGORIES.map((category) => {
      const group = byCategory.get(category)!;
      const totalCount = group.reduce((sum, s) => sum + s.totalCount, 0);
      const totalPass = group.reduce((sum, s) => sum + s.passCount, 0);
      const passRate = (totalPass / totalCount) * 100;

      const threshold = CATEGORY_THRESHOLDS[category];
      const ci = wilsonInterval(totalPass, totalCount);
      const ciRequirement = CI_BOUNDS[category];
      const passed = passRate >= threshold && (ciRequirement === undefined || ci.lowerBound >= ciRequirement);

      return {
        category,
        passRate,
        weight: CATEGORY_WEIGHTS[category],
        score: Math.min(100, passRate),
        ciLowerBound: ci.lowerBound,
        passed,
      };
    });

    const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
    const weightSum = scores.reduce((sum, s) => sum + s.weight, 0);
    const aggregateScore = weightSum > 0 ? Math.round(weightedSum / weightSum) : 0;

    return { scores, aggregateScore };
  }

  calculateCodeQualityScore(metrics: CodeQualityMetrics): CodeQualityScore {
    // Reject unmeasured/placeholder quality data outright — this is the
    // single biggest source of misleading "release approved" reports:
    // synthetic quality numbers that were never actually collected.
    if (!metrics.provenance || metrics.provenance.measured !== true) {
      throw new Error(
        'Code quality metrics must declare measured provenance (provenance.measured === true); ' +
          'placeholder/synthetic values are not accepted for release scoring.'
      );
    }

    const { complexity, duplication, coverage, maintainability } = metrics;

    if (
      !Number.isFinite(complexity.mean) ||
      !Number.isFinite(complexity.max) ||
      !Number.isFinite(duplication) ||
      !Number.isFinite(coverage) ||
      !Number.isFinite(maintainability)
    ) {
      throw new Error('Code quality metrics must be finite numbers.');
    }
    if (complexity.mean < 0 || complexity.max < 0) {
      throw new Error('Complexity metrics must be non-negative.');
    }
    if (complexity.mean > complexity.max) {
      throw new Error(
        `Complexity metrics are invalid: mean (${complexity.mean}) cannot exceed max (${complexity.max}).`
      );
    }
    if (duplication < 0 || duplication > 100) {
      throw new Error('Duplication must be 0-100%.');
    }
    if (coverage < 0 || coverage > 100) {
      throw new Error('Coverage must be 0-100%.');
    }
    if (maintainability < 0 || maintainability > 200) {
      throw new Error('Maintainability index must be 0-200.');
    }

    const complexityScore = complexity.mean > 5 || complexity.max > 10 ? 50 : complexity.mean > 3 || complexity.max > 5 ? 75 : 100;
    const duplicationScore = duplication > 15 ? 50 : duplication > 10 ? 75 : 100;
    const coverageScore = coverage < 70 ? 50 : coverage < 80 ? 75 : 100;
    const maintainabilityScore = maintainability < 65 ? 50 : maintainability < 70 ? 75 : 100;

    const aggregateScore =
      complexityScore * 0.35 + duplicationScore * 0.2 + coverageScore * 0.25 + maintainabilityScore * 0.2;

    return {
      complexity: { mean: complexity.mean, max: complexity.max, score: complexityScore },
      duplication: { percentDuplicated: duplication, score: duplicationScore },
      coverage: { percent: coverage, score: coverageScore },
      maintainability: { index: maintainability, score: maintainabilityScore },
      aggregateScore: Math.round(aggregateScore),
    };
  }

  generateDoDReport(
    version: string,
    behavioralSuites: TestSuiteResult[],
    performance: PerformanceScore,
    codeQuality: CodeQualityMetrics
  ): DoDScore {
    // Performance scores must originate from PerformanceBenchmarker so a
    // caller cannot hand-construct a fabricated passing score.
    if (performance.provenance?.source !== 'PerformanceBenchmarker') {
      throw new Error('Untrusted performance provenance');
    }

    const behavioral = this.calculateBehavioralScores(behavioralSuites);
    const quality = this.calculateCodeQualityScore(codeQuality);

    const rawCombined =
      behavioral.aggregateScore * 0.4 + performance.aggregateScore * 0.35 + quality.aggregateScore * 0.25;
    const combinedScore = Math.round(rawCombined);

    let passed =
      rawCombined >= 90 &&
      behavioral.aggregateScore >= 90 &&
      behavioral.scores.every((s) => s.passed) &&
      performance.passed &&
      quality.coverage.percent >= 70 &&
      quality.complexity.max <= 8 &&
      quality.duplication.percentDuplicated <= 15 &&
      quality.maintainability.index >= 50;

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

    if (this.baselineVersion) {
      report.regressions = this.detectRegressions(report, this.baselineVersion.scores);
      const majorRegressions = report.regressions.filter((r) => r.isRegression && r.severity === 'high');
      if (majorRegressions.length > 0) {
        passed = false;
      }
    }

    report.passed = passed;
    return report;
  }

  detectRegressions(current: DoDScore, baseline?: DoDScore): RegressionDetection[] {
    const regressions: RegressionDetection[] = [];
    if (!baseline) return regressions;

    for (const currentItem of current.performance.items) {
      const baselineItem = baseline.performance.items.find(
        (b) => b.metricName === currentItem.metricName && b.unit === currentItem.unit
      );
      if (!baselineItem || baselineItem.mean <= 0) continue;

      const changePercent = ((currentItem.mean - baselineItem.mean) / baselineItem.mean) * 100;
      const isRegression = currentItem.unit === 'ops/sec' ? changePercent < -5 : changePercent > 5;
      if (!isRegression) continue;

      const severe = currentItem.unit === 'ops/sec' ? changePercent < -10 : changePercent > 10;
      regressions.push({
        metric: currentItem.metricName,
        baselineValue: baselineItem.mean,
        currentValue: currentItem.mean,
        changePercent,
        tolerance: 5,
        isRegression: true,
        severity: severe ? 'high' : 'medium',
      });
    }

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

    const duplicationChange =
      current.codeQuality.duplication.percentDuplicated - baseline.codeQuality.duplication.percentDuplicated;
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

    const currentRegression = current.behavioral.scores.find((s) => s.category === 'REGRESSION');
    const baselineRegression = baseline.behavioral.scores.find((s) => s.category === 'REGRESSION');
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
}
