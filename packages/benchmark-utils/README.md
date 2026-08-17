# @h4shed/benchmark-utils

Shared, provenance-hardened benchmark utilities implementing the Definition of Done (DoD)
framework for all Fused Gaming skills and packages.

## Overview

This library provides four core utilities:

1. **BehavioralTester** — Categorized test runner (CORE, REGRESSION, FUNCTIONALITY, ERROR)
2. **PerformanceBenchmarker** — Performance metrics scored against explicit, caller-defined targets
3. **DoDScorer** — Combined score calculator for DoD compliance
4. **statistics** — Wilson score confidence intervals used throughout the above

## Why v2.0.0 is a breaking change

Earlier versions of this package could validate internally consistent numbers without
proving those numbers were produced by the corresponding measurement path — a caller
could hand-construct a "passing" score, or a CI step could substitute placeholder
zeros and still get a `status: "conditional"` result that read as a real (if low)
score. v2.0.0 moves the trust boundary so release decisions are based on measurement
artifacts rather than caller assertions:

- Wald confidence intervals were replaced with **Wilson intervals** (Wald claims a 1/1
  pass rate has a 100% lower bound, which is not defensible).
- Behavioral results must originate from `BehavioralTester`; `DoDScorer` re-derives
  pass/fail counts from the concrete per-test result records instead of trusting the
  supplied totals.
- Empty or undersized behavioral suites are rejected before any statistics run on them.
- Test callbacks must assert by throwing and resolve to `void` — a test that
  accidentally returns `false` (or any other value) instead of throwing can no longer
  silently register as a pass.
- Performance scoring requires **explicit targets** (`maxMean` and/or `minMean`), not
  just low variance — a metric that is consistently bad should not score well just
  because it's consistent.
- Performance metrics are matched by exact name + unit; if more than one recorded
  metric matches a target, scoring fails loudly instead of silently taking the first
  match.
- `DoDScorer.generateDoDReport` requires that the supplied `PerformanceScore` actually
  came from `PerformanceBenchmarker.calculatePerformanceScore`.
- Code-quality metrics must declare `provenance: { source, measured: true }`.
  Placeholder/synthetic values (`measured: false`, or the field missing) are rejected —
  CI must fail closed when real quality data hasn't been collected, not substitute
  known-good constants.
- `npm test` / `npm run benchmark` in this package execute a real Node test suite
  (`node --test`) instead of returning a hard-coded success string.

If your package's `npm run benchmark` script doesn't produce measured behavioral,
performance, and code-quality data, don't call `DoDScorer.generateDoDReport` at all —
let the script fail (or clearly report "not measured") instead of fabricating a
score. See [Consuming packages](#consuming-packages) below for how the pipeline
handles that case.

## Installation

```bash
npm install @h4shed/benchmark-utils
```

## Quick Start

### Behavioral Testing

```typescript
import { BehavioralTester } from '@h4shed/benchmark-utils';

const tester = new BehavioralTester();

// Run CORE tests (must pass at ≥95%, ≥93% Wilson CI lower bound)
const coreResult = await tester.runTestSuite('CORE', [
  {
    name: 'Core operation A',
    fn: async () => {
      // Assert by throwing. Must resolve to undefined.
    },
  },
  // ... more tests
]);

console.log(coreResult.passRate); // 95.0
console.log(coreResult.confidenceInterval.lowerBound); // Wilson lower bound
```

### Performance Benchmarking

```typescript
import { PerformanceBenchmarker } from '@h4shed/benchmark-utils';

const bench = new PerformanceBenchmarker();

await bench.benchmark(
  'operation-name',
  async () => {
    // Operation to benchmark
  },
  100, // iterations (minimum 30)
  'ms'
);

// Targets are mandatory and must have domain meaning.
const score = bench.calculatePerformanceScore([
  { metricName: 'operation-name', unit: 'ms', maxMean: 50 },
]);
```

### Definition of Done Scoring

```typescript
import { DoDScorer } from '@h4shed/benchmark-utils';

const scorer = new DoDScorer();

const dodReport = scorer.generateDoDReport(
  '1.0.0', // version
  [coreResult, regressionResult, functionalityResult, errorResult], // test suites
  performanceScore, // PerformanceScore from PerformanceBenchmarker
  {
    complexity: { mean: 2.5, max: 4 },
    duplication: 2.0,
    coverage: 85,
    maintainability: 80,
    provenance: { source: 'eslint+jscpd+vitest-coverage', measured: true },
  }
);

console.log(dodReport.combinedScore); // 92
console.log(dodReport.passed); // true (≥90% required, plus all mandatory gates)
```

### Regression detection

```typescript
const scorer = new DoDScorer();
scorer.setBaseline(previousVersion, previousDoDReport);
const report = scorer.generateDoDReport(version, suites, performanceScore, quality);
console.log(report.regressions); // RegressionDetection[]
```

## DoD Scoring Formula

```
Combined Score = (Behavioral × 0.40) + (Performance × 0.35) + (CodeQuality × 0.25)
Threshold: ≥90% required for publication, plus all mandatory gates below
```

### Behavioral Score Components

| Category | Threshold | CI lower bound | Weight | Purpose |
|----------|-----------|-----------------|--------|---------|
| CORE | ≥95% | ≥93% | 50% | Essential functionality |
| REGRESSION | 100% | — | 30% | Prior versions still work |
| FUNCTIONALITY | ≥80% | ≥75% | 12% | Advanced features |
| ERROR | ≥90% | ≥85% | 8% | Edge cases & error handling |

### Performance Score

Each target scores 0–100: 50 points for meeting the variance target (CV ≤ 20% by
default), 50 points for meeting the explicit absolute target (`maxMean`/`minMean`).
A metric with no absolute target throws instead of scoring.

### Code Quality Score

- **Complexity**: Mean ≤3, Max ≤8 (hard release gate above 8)
- **Duplication**: <15% (hard release gate at/above 15%)
- **Coverage**: ≥70% (hard release gate below 70%)
- **Maintainability**: ≥50 (hard release gate below 50)

## Consuming packages

See `packages/skills/svg-generator/src/benchmark.ts` for a complete, working example:
CORE/REGRESSION/FUNCTIONALITY/ERROR test suites, real performance benchmarks with
explicit targets, code-quality metrics loaded from `.quality-metrics.json` (never
fabricated), baseline-based regression detection, and a JSON report printed to
stdout for CI to pick up.

**CI contract:** the publish and release-issue workflows scan a package's
`npm run benchmark` output for a JSON object containing a `combined_score` field. If
found, that measured report is used verbatim. If a package's benchmark script is
still a placeholder (e.g. `echo 'Benchmarks: OK'`) and emits no such object, the
workflow records `status: "not_measured"` — an explicit, honest "no data collected"
state — instead of writing a fabricated `0%` score under a misleading
`status: "conditional"` label. Only real, measured results are held to the 90%
combined-score gate; `not_measured` results are informational and do not warn on
every publish.

## API Reference

### BehavioralTester

```typescript
class BehavioralTester {
  async runTestSuite(
    category: 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR',
    tests: Array<{ name: string; fn: () => Promise<void> | void }>,
    options?: { timeout?: number; minimumSamples?: number } // minimumSamples defaults to 1
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
    fn: () => Promise<void | number> | void | number,
    iterations?: number, // minimum 30
    unit?: 'ms' | 'ops/sec' | 'MB'
  ): Promise<PerformanceMetric>

  getMetrics(): PerformanceMetric[]

  calculatePerformanceScore(
    targets: PerformanceTarget[], // required, each needs maxMean and/or minMean
    baseline?: PerformanceMetric[]
  ): PerformanceScore
}
```

### DoDScorer

```typescript
class DoDScorer {
  setBaseline(version: string, scores: DoDScore): void

  calculateBehavioralScores(
    suites: TestSuiteResult[]
  ): { scores: BehavioralScore[]; aggregateScore: number }

  calculateCodeQualityScore(metrics: CodeQualityMetrics): CodeQualityScore // requires provenance.measured === true

  generateDoDReport(
    version: string,
    behavioralSuites: TestSuiteResult[],
    performance: PerformanceScore, // must come from PerformanceBenchmarker
    codeQuality: CodeQualityMetrics
  ): DoDScore

  detectRegressions(current: DoDScore, baseline?: DoDScore): RegressionDetection[]
}
```

### statistics

```typescript
function wilsonInterval(
  successes: number,
  trials: number,
  confidence?: 0.95 | 0.99
): ConfidenceInterval
```

## Types

See `src/types.ts` for complete type definitions including:
- `TestResult`, `TestSuiteResult`
- `PerformanceMetric`, `PerformanceTarget`, `PerformanceScoreItem`, `PerformanceScore`
- `BehavioralScore`, `CodeQualityMetrics`, `CodeQualityScore`
- `DoDScore`, `RegressionDetection`

## Development

```bash
# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Test (builds first, then runs node --test against dist/)
npm test
```

## License

MIT

## Related

- [Definition of Done](/docs/DEFINITION_OF_DONE.md)
- [Phase 2 Implementation](/docs/PHASE2_IMPLEMENTATION.md)
- [SVG Generator Example](/packages/skills/svg-generator/src/benchmark.ts)
