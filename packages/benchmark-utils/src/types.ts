/**
 * Benchmark types and interfaces
 */

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface TestSuiteResult {
  category: 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR';
  passCount: number;
  totalCount: number;
  passRate: number;
  confidenceInterval?: ConfidenceInterval;
  results: TestResult[];
}

export interface ConfidenceInterval {
  lowerBound: number;
  upperBound: number;
  standardError: number;
  confidence: number; // 0.95 for 95% CI
}

export interface PerformanceMetric {
  name: string;
  unit: 'ms' | 'ops/sec' | 'MB';
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  samples: number;
  coefficientOfVariation?: number;
}

export interface BehavioralScore {
  category: 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR';
  passRate: number;
  weight: number;
  score: number;
  ciLowerBound?: number;
  passed: boolean;
}

export interface PerformanceScore {
  latency: {
    mean: number;
    stdDev: number;
    score: number;
  };
  throughput: {
    mean: number;
    stdDev: number;
    score: number;
  };
  memory: {
    peakMB: number;
    changePercent: number;
    score: number;
  };
  aggregateScore: number;
}

export interface CodeQualityScore {
  complexity: {
    mean: number;
    max: number;
    score: number;
  };
  duplication: {
    percentDuplicated: number;
    score: number;
  };
  coverage: {
    percent: number;
    score: number;
  };
  maintainability: {
    index: number;
    score: number;
  };
  aggregateScore: number;
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
  passed: boolean; // combinedScore >= 90
  regressions: RegressionDetection[];
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
