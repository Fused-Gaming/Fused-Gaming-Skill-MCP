# @h4shed/benchmark-utils

Shared benchmark utilities implementing the Definition of Done (DoD) framework for all Fused Gaming skills and packages.

## Overview

This library provides three core utilities:

1. **BehavioralTester** — Categorized test runner (CORE, REGRESSION, FUNCTIONALITY, ERROR)
2. **PerformanceBenchmarker** — Performance metrics with statistical analysis
3. **DoDScorer** — Combined score calculator for DoD compliance

## Installation

```bash
npm install @h4shed/benchmark-utils
```

## Quick Start

### Behavioral Testing

```typescript
import { BehavioralTester } from '@h4shed/benchmark-utils';

const tester = new BehavioralTester();

// Run CORE tests (must pass at ≥95%)
const coreResult = await tester.runTestSuite('CORE', [
  {
    name: 'Core operation A',
    fn: async () => {
      // Test implementation
    },
  },
  // ... more tests
]);

console.log(coreResult.passRate); // 95.0
console.log(coreResult.confidenceInterval?.lowerBound); // 93.2 (≥93% required)

// Determine pass/fail using scorer
const scorer = new DoDScorer();
const scores = scorer.calculateBehavioralScores([coreResult]);
console.log(scores.aggregateScore); // 95 (100 = pass, <95 = fail for CORE)
```

### Performance Benchmarking

```typescript
import { PerformanceBenchmarker } from '@h4shed/benchmark-utils';

const bench = new PerformanceBenchmarker();

const metric = await bench.benchmark(
  'operation-name',
  async () => {
    // Operation to benchmark
  },
  100, // iterations
  'ms'
);

console.log(metric.mean); // 5.2ms
console.log(metric.stdDev); // 0.8ms
console.log(metric.coefficientOfVariation); // 15.4%
```

### Definition of Done Scoring

```typescript
import { DoDScorer } from '@h4shed/benchmark-utils';

const scorer = new DoDScorer();

const dodReport = scorer.generateDoDReport(
  '1.0.0', // version
  [coreResult, regressionResult, functionalityResult, errorResult], // test suites
  performanceScore, // PerformanceScore object
  {
    complexity: { mean: 2.5, max: 4 },
    duplication: 2.0,
    coverage: 85,
    maintainability: 80,
  }
);

console.log(dodReport.combinedScore); // 92
console.log(dodReport.passed); // true (≥90% required)
```

## DoD Scoring Formula

```
Combined Score = (Behavioral × 0.40) + (Performance × 0.35) + (CodeQuality × 0.25)
Threshold: ≥90% required for publication
```

### Behavioral Score Components

| Category | Threshold | Weight | Purpose |
|----------|-----------|--------|---------|
| CORE | ≥95% (93% CI) | 50% | Essential functionality |
| REGRESSION | 100% | 30% | Prior versions still work |
| FUNCTIONALITY | ≥80% | 12% | Advanced features |
| ERROR | ≥90% | 8% | Edge cases & error handling |

### Performance Score

- **Latency**: Lower is better, target CV < 10%
- **Throughput**: Higher is better, target CV < 10%
- **Memory**: ±5% change tolerance from baseline

### Code Quality Score

- **Complexity**: Mean ≤3, Max ≤5
- **Duplication**: <5%
- **Coverage**: ≥80%
- **Maintainability**: ≥70/100

## Integration Example

See `/packages/skills/svg-generator/benchmark.ts` for a complete example including:
- CORE, REGRESSION, FUNCTIONALITY, ERROR test suites
- Performance benchmarking
- DoD score generation
- Report formatting

## API Reference

### BehavioralTester

```typescript
class BehavioralTester {
  async runTestSuite(
    category: 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR',
    tests: Array<{ name: string; fn: () => Promise<void> }>,
    options?: { timeout?: number }
  ): Promise<TestSuiteResult>

  getResults(): TestSuiteResult[]
  
  getSummary(): {
    totalTests: number;
    totalPassed: number;
    overallPassRate: number;
    byCategory: Record<string, { passCount, totalCount, passRate, passed }>;
  }
}
```

### PerformanceBenchmarker

```typescript
class PerformanceBenchmarker {
  async benchmark(
    name: string,
    fn: () => Promise<void> | void,
    iterations?: number,
    unit?: 'ms' | 'ops/sec' | 'MB'
  ): Promise<PerformanceMetric>

  getMetrics(): PerformanceMetric[]
  
  calculatePerformanceScore(
    baseline?: PerformanceMetric[]
  ): PerformanceScore
}
```

### DoDScorer

```typescript
class DoDScorer {
  calculateBehavioralScores(
    suites: TestSuiteResult[]
  ): { scores: BehavioralScore[]; aggregateScore: number }

  calculateCodeQualityScore(metrics: {
    complexity?: { mean: number; max: number };
    duplication?: number;
    coverage?: number;
    maintainability?: number;
  }): CodeQualityScore

  calculateCombinedScore(
    behavioral: { aggregateScore: number },
    performance: { aggregateScore: number },
    quality: { aggregateScore: number }
  ): { combinedScore: number; passed: boolean }

  detectRegressions(
    current: DoDScore,
    baseline?: DoDScore
  ): RegressionDetection[]

  generateDoDReport(
    version: string,
    behavioralSuites: TestSuiteResult[],
    performance: PerformanceScore,
    codeQuality: CodeQualityMetrics  // Required: must include complexity, duplication, coverage, maintainability
  ): DoDScore
}
```

## Types

See `src/types.ts` for complete type definitions including:
- `TestResult`, `TestSuiteResult`
- `PerformanceMetric`, `PerformanceScore`
- `BehavioralScore`, `CodeQualityScore`
- `DoDScore`, `RegressionDetection`

## Development

```bash
# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## License

MIT

## Related

- [Definition of Done](/docs/DEFINITION_OF_DONE.md)
- [Phase 2 Implementation](/docs/PHASE2_IMPLEMENTATION.md)
- [SVG Generator Example](/packages/skills/svg-generator/benchmark.ts)
