import test from 'node:test';
import assert from 'node:assert/strict';
import { BehavioralTester, PerformanceBenchmarker, DoDScorer, wilsonInterval } from '../dist/index.js';

const voidPass = () => undefined;
const makeTests = (n) => Array.from({ length: n }, (_, i) => ({ name: `test-${i}`, fn: voidPass }));

test('Wilson interval does not claim 1/1 has a 100% lower bound', () => {
  const ci = wilsonInterval(1, 1);
  assert.ok(ci.lowerBound < 50);
  assert.equal(ci.method, 'wilson');
});

test('empty behavioral suites are rejected before CI math', async () => {
  const runner = new BehavioralTester();
  await assert.rejects(() => runner.runTestSuite('CORE', [], { minimumSamples: 1 }), /at least 1 tests/);
});

test('non-void return cannot silently pass', async () => {
  const runner = new BehavioralTester();
  const tests = Array.from({ length: 5 }, (_, i) => ({ name: `false-${i}`, fn: async () => false }));
  const suite = await runner.runTestSuite('CORE', tests, { minimumSamples: 5 });
  assert.equal(suite.passCount, 0);
  assert.match(suite.results[0].error, /return void/);
});

test('DoD scorer rejects fabricated behavioral counts', () => {
  const scorer = new DoDScorer();
  const fake = [
    {
      category: 'CORE',
      passCount: 1,
      totalCount: 1,
      passRate: 100,
      confidenceInterval: wilsonInterval(1, 1),
      results: [],
      provenance: { source: 'BehavioralTester', schemaVersion: 1 },
    },
  ];
  assert.throws(() => scorer.calculateBehavioralScores(fake), /Result count mismatch/);
});

test('DoD scorer rejects untrusted behavioral provenance', () => {
  const scorer = new DoDScorer();
  const fake = [
    {
      category: 'CORE',
      passCount: 0,
      totalCount: 0,
      passRate: 0,
      confidenceInterval: wilsonInterval(0, 1),
      results: [],
      provenance: { source: 'Caller', schemaVersion: 1 },
    },
  ];
  assert.throws(() => scorer.calculateBehavioralScores(fake), /Untrusted behavioral provenance/);
});

test('performance scoring requires explicit absolute targets', async () => {
  const perf = new PerformanceBenchmarker();
  await perf.benchmark('fake throughput', () => 0.000001, 30, 'ops/sec');
  assert.throws(
    () => perf.calculatePerformanceScore([{ metricName: 'fake throughput', unit: 'ops/sec' }]),
    /Absolute target required/
  );
  const score = perf.calculatePerformanceScore([
    { metricName: 'fake throughput', unit: 'ops/sec', minMean: 10 },
  ]);
  assert.equal(score.aggregateScore, 50);
  assert.equal(score.passed, false);
});

test('multiple same-name/unit performance metrics are rejected instead of first-one-wins', async () => {
  const perf = new PerformanceBenchmarker();
  await perf.benchmark('throughput', () => 100, 30, 'ops/sec');
  await perf.benchmark('throughput', () => 200, 30, 'ops/sec');
  assert.throws(
    () => perf.calculatePerformanceScore([{ metricName: 'throughput', unit: 'ops/sec', minMean: 50 }]),
    /exactly one measured metric/
  );
});

test('DoD rejects caller-fabricated performance score', async () => {
  const scorer = new DoDScorer();
  const runner = new BehavioralTester();
  const suites = [];
  for (const category of ['CORE', 'REGRESSION', 'FUNCTIONALITY', 'ERROR']) {
    suites.push(await runner.runTestSuite(category, makeTests(60), { minimumSamples: 5 }));
  }
  assert.throws(
    () =>
      scorer.generateDoDReport(
        'x',
        suites,
        { items: [], aggregateScore: 100, passed: true, provenance: { source: 'Caller', schemaVersion: 1 } },
        {
          complexity: { mean: 2, max: 4 },
          duplication: 2,
          coverage: 90,
          maintainability: 80,
          provenance: { source: 'real-tools', measured: true },
        }
      ),
    /Untrusted performance provenance/
  );
});

test('DoD rejects unmeasured placeholder quality metrics', async () => {
  const runner = new BehavioralTester();
  const suites = [];
  for (const category of ['CORE', 'REGRESSION', 'FUNCTIONALITY', 'ERROR']) {
    suites.push(await runner.runTestSuite(category, makeTests(60)));
  }
  const perf = new PerformanceBenchmarker();
  await perf.benchmark(
    'latency',
    async () => {
      const until = performance.now() + 2;
      while (performance.now() < until) {
        // busy-wait a couple ms to produce a real, non-zero sample
      }
    },
    30,
    'ms'
  );
  await perf.benchmark('throughput', () => 100, 30, 'ops/sec');
  await perf.benchmark('memory', () => 10, 30, 'MB');
  const score = perf.calculatePerformanceScore([
    { metricName: 'latency', unit: 'ms', maxMean: 100 },
    { metricName: 'throughput', unit: 'ops/sec', minMean: 10 },
    { metricName: 'memory', unit: 'MB', maxMean: 100 },
  ]);
  const scorer = new DoDScorer();
  assert.throws(
    () =>
      scorer.generateDoDReport('x', suites, score, {
        complexity: { mean: 2.1, max: 4 },
        duplication: 2.5,
        coverage: 85,
        maintainability: 80,
        provenance: { source: 'ci-placeholder', measured: false },
      }),
    /measured provenance/
  );
});

test('measured end-to-end report can pass with sufficient behavioral evidence', async () => {
  const runner = new BehavioralTester();
  const suites = [];
  for (const category of ['CORE', 'REGRESSION', 'FUNCTIONALITY', 'ERROR']) {
    suites.push(await runner.runTestSuite(category, makeTests(60)));
  }
  const perf = new PerformanceBenchmarker();
  await perf.benchmark(
    'latency',
    async () => {
      const until = performance.now() + 2;
      while (performance.now() < until) {
        // busy-wait
      }
    },
    30,
    'ms'
  );
  await perf.benchmark('throughput', () => 100, 30, 'ops/sec');
  await perf.benchmark('memory', () => 10, 30, 'MB');
  const pscore = perf.calculatePerformanceScore([
    { metricName: 'latency', unit: 'ms', maxMean: 100 },
    { metricName: 'throughput', unit: 'ops/sec', minMean: 10 },
    { metricName: 'memory', unit: 'MB', maxMean: 100 },
  ]);
  const report = new DoDScorer().generateDoDReport('2.0.0', suites, pscore, {
    complexity: { mean: 2, max: 4 },
    duplication: 2,
    coverage: 90,
    maintainability: 80,
    provenance: { source: 'eslint+jscpd+coverage', measured: true },
  });
  assert.equal(report.passed, true);
  assert.ok(report.behavioral.scores.every((s) => s.ciLowerBound > 93));
});

test('regression detection flags a degraded performance metric against baseline', async () => {
  const runner = new BehavioralTester();
  const suites = [];
  for (const category of ['CORE', 'REGRESSION', 'FUNCTIONALITY', 'ERROR']) {
    suites.push(await runner.runTestSuite(category, makeTests(60)));
  }
  const baselinePerf = new PerformanceBenchmarker();
  await baselinePerf.benchmark('throughput', () => 100, 30, 'ops/sec');
  const baselineScore = baselinePerf.calculatePerformanceScore([
    { metricName: 'throughput', unit: 'ops/sec', minMean: 10 },
  ]);
  const baselineReport = new DoDScorer().generateDoDReport('1.0.0', suites, baselineScore, {
    complexity: { mean: 2, max: 4 },
    duplication: 2,
    coverage: 90,
    maintainability: 80,
    provenance: { source: 'eslint+jscpd+coverage', measured: true },
  });

  const currentPerf = new PerformanceBenchmarker();
  await currentPerf.benchmark('throughput', () => 80, 30, 'ops/sec');
  const currentScore = currentPerf.calculatePerformanceScore([
    { metricName: 'throughput', unit: 'ops/sec', minMean: 10 },
  ]);

  const scorer = new DoDScorer();
  scorer.setBaseline('1.0.0', baselineReport);
  const report = scorer.generateDoDReport('1.1.0', suites, currentScore, {
    complexity: { mean: 2, max: 4 },
    duplication: 2,
    coverage: 90,
    maintainability: 80,
    provenance: { source: 'eslint+jscpd+coverage', measured: true },
  });

  assert.ok(report.regressions.some((r) => r.metric === 'throughput' && r.severity === 'high'));
  assert.equal(report.passed, false);
});
