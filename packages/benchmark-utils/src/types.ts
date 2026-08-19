/**
 * Benchmark types and interfaces
 */

export type TestCategory = 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR';

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface ConfidenceInterval {
  lowerBound: number;
  upperBound: number;
  standardError: number;
  confidence: number; // 0.95 for 95% CI
  method: 'wilson';
}

export interface TestSuiteResult {
  category: TestCategory;
  passCount: number;
  totalCount: number;
  passRate: number;
  confidenceInterval: ConfidenceInterval;
  results: TestResult[];
  /** Marks this result as having come from BehavioralTester.runTestSuite, not a hand-built object. */
  provenance: {
    source: 'BehavioralTester';
    schemaVersion: 1;
  };
}

export interface PerformanceMetric {
  id: string;
  name: string;
  unit: 'ms' | 'ops/sec' | 'MB';
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  samples: number;
  coefficientOfVariation: number;
  provenance: {
    source: 'PerformanceBenchmarker';
    schemaVersion: 1;
  };
}

/**
 * Explicit, domain-meaningful target for a measured performance metric.
 * At least one of maxMean/minMean is required — variance alone (CV) is not
 * sufficient to determine whether a measured value is actually acceptable.
 */
export interface PerformanceTarget {
  metricName: string;
  unit: PerformanceMetric['unit'];
  maxMean?: number;
  minMean?: number;
  maxCV?: number; // defaults to 20
  weight?: number; // defaults to 1
}

export interface PerformanceScoreItem {
  metricName: string;
  unit: PerformanceMetric['unit'];
  mean: number;
  stdDev: number;
  score: number;
  passedAbsoluteTarget: boolean;
  passedVarianceTarget: boolean;
  regressionPercent?: number;
}

export interface PerformanceScore {
  items: PerformanceScoreItem[];
  aggregateScore: number;
  passed: boolean;
  provenance: {
    source: 'PerformanceBenchmarker';
    schemaVersion: 1;
  };
}

export interface BehavioralScore {
  category: TestCategory;
  passRate: number;
  weight: number;
  score: number;
  ciLowerBound: number;
  passed: boolean;
}

export interface CodeQualityMetrics {
  complexity: { mean: number; max: number };
  duplication: number;
  coverage: number;
  maintainability: number;
  /**
   * Required. Callers must declare where these numbers came from and that
   * they were actually measured (eslint/jscpd/coverage tooling, etc.) rather
   * than synthesized as a placeholder. DoDScorer rejects metrics that don't
   * declare `measured: true`.
   */
  provenance: {
    source: string;
    measured: boolean;
  };
}

export interface CodeQualityScore {
  complexity: { mean: number; max: number; score: number };
  duplication: { percentDuplicated: number; score: number };
  coverage: { percent: number; score: number };
  maintainability: { index: number; score: number };
  aggregateScore: number;
}

export interface RegressionDetection {
  metric: string;
  baselineValue: number;
  currentValue: number;
  changePercent: number;
  tolerance: number;
  isRegression: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface DoDScore {
  version: string;
  timestamp: string;
  behavioral: {
    scores: BehavioralScore[];
    aggregateScore: number;
  };
  performance: PerformanceScore;
  codeQuality: CodeQualityScore;
  combinedScore: number; // (behavioral × 0.40) + (performance × 0.35) + (quality × 0.25)
  passed: boolean; // combinedScore >= 90 and all mandatory gates satisfied
  regressions: RegressionDetection[];
}

export interface BenchmarkConfig {
  packageName: string;
  version: string;
  testTimeout?: number; // ms
  performanceIterations?: number;
  thresholds?: {
    core?: number; // default 95
    regression?: number; // default 100
    functionality?: number; // default 80
    error?: number; // default 90
    combined?: number; // default 90
  };
}
