/**
 * SVG Generator Skill - Phase 2 Benchmark Suite
 * Measures behavioral, performance, and code quality metrics for DoD compliance
 */

import { BehavioralTester, PerformanceBenchmarker, DoDScorer, DoDScore } from '@h4shed/benchmark-utils';
import { GenerateSvgAssetTool } from './tools/generate-svg-asset.js';
import type { SvgAsset } from './tools/generate-svg-asset.js';

async function runBenchmarks() {
  console.log('🎯 SVG Generator Skill - Phase 2 Benchmarks\n');

  // Read version from package.json
  const fs = await import('fs/promises');
  const path = await import('path');
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  const version = packageJson.version;

  const tester = new BehavioralTester();
  const perfBench = new PerformanceBenchmarker();
  const scorer = new DoDScorer();

  // === BEHAVIORAL TESTS ===
  console.log('📋 Running Behavioral Tests...\n');

  // CORE Tests: Essential functionality that MUST work
  const coreTests = [
    {
      name: 'Generate simple circle SVG',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Blue circle icon',
        })) as SvgAsset;
        if (!result.success || !result.svgCode) throw new Error('Failed to generate SVG');
      },
    },
    {
      name: 'Generate star icon',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Yellow star icon',
        })) as SvgAsset;
        if (!result.success) throw new Error('Star generation failed');
      },
    },
    {
      name: 'Generate button component',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Green button component',
        })) as SvgAsset;
        if (!result.success) throw new Error('Button generation failed');
      },
    },
    {
      name: 'SVG output contains proper tags',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Test SVG',
        })) as SvgAsset;
        const svg = result.svgCode as string;
        if (!svg.includes('<svg') || !svg.includes('</svg>')) {
          throw new Error('SVG tags missing');
        }
      },
    },
  ];

  const coreResult = await tester.runTestSuite('CORE', coreTests);
  console.log(`✅ CORE: ${coreResult.passCount}/${coreResult.totalCount} (${coreResult.passRate.toFixed(1)}%)\n`);

  // REGRESSION Tests: Previous versions' functionality must still work
  const regressionTests = [
    {
      name: 'Circle generation backward compatible',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Circle',
        })) as SvgAsset;
        if (!result.success) throw new Error('Circle regression: generation failed');
        // Verify the SVG actually contains circle geometry, not just any valid SVG
        const svg = (result.svgCode || '').toLowerCase();
        if (!svg.includes('circle') && !svg.includes('cx') && !svg.includes('cy')) {
          throw new Error('Circle regression: generated SVG does not contain circle geometry');
        }
      },
    },
    {
      name: 'Description generation consistent',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Icon',
        })) as SvgAsset;
        if (!result.description || result.description.length === 0) {
          throw new Error('Description missing');
        }
      },
    },
  ];

  const regressionResult = await tester.runTestSuite('REGRESSION', regressionTests);
  console.log(`✅ REGRESSION: ${regressionResult.passCount}/${regressionResult.totalCount} (${regressionResult.passRate.toFixed(1)}%)\n`);

  // FUNCTIONALITY Tests: Nice-to-have features
  const functionalityTests = [
    {
      name: 'Generate complex shape',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Complex geometric pattern',
        })) as SvgAsset;
        if (!result.success) throw new Error('Complex shape failed');
      },
    },
    {
      name: 'Handle custom dimensions',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: 'Square icon with 256x256 dimensions',
        })) as SvgAsset;
        if (!result.success) throw new Error('Dimensions not handled');
        // Verify the SVG respects the requested 256x256 dimensions
        const svg = (result.svgCode || '').toLowerCase();
        const hasViewBox = svg.includes('viewbox="0 0 256 256"') || svg.includes('viewbox=\'0 0 256 256\'');
        const hasExplicitDim = (svg.includes('width="256"') || svg.includes('width=\'256\'')) &&
                               (svg.includes('height="256"') || svg.includes('height=\'256\''));
        if (!hasViewBox && !hasExplicitDim) {
          throw new Error('SVG does not reflect requested 256x256 dimensions');
        }
      },
    },
  ];

  const functionalityResult = await tester.runTestSuite('FUNCTIONALITY', functionalityTests);
  console.log(`✅ FUNCTIONALITY: ${functionalityResult.passCount}/${functionalityResult.totalCount} (${functionalityResult.passRate.toFixed(1)}%)\n`);

  // ERROR Tests: Edge cases and error handling
  const errorTests = [
    {
      name: 'Handle empty objective gracefully',
      fn: async () => {
        const result = (await GenerateSvgAssetTool.handler({
          objective: '',
        })) as SvgAsset;
        // Per handler contract, empty objectives must return success: false
        if (result.success !== false) {
          throw new Error('Empty objective must return success: false');
        }
      },
    },
    {
      name: 'Handle very long objective',
      fn: async () => {
        const longObjective = 'A'.repeat(1000);
        const result = (await GenerateSvgAssetTool.handler({
          objective: longObjective,
        })) as SvgAsset;
        // Should handle without crashing
        if (result.success && !result.svgCode) {
          throw new Error('Invalid success state: success:true but no SVG code');
        }
      },
    },
  ];

  const errorResult = await tester.runTestSuite('ERROR', errorTests);
  console.log(`✅ ERROR: ${errorResult.passCount}/${errorResult.totalCount} (${errorResult.passRate.toFixed(1)}%)\n`);

  // === PERFORMANCE BENCHMARKS ===
  console.log('⚡ Running Performance Benchmarks...\n');

  if (global.gc) global.gc();
  const latencyResult = await perfBench.benchmark(
    'SVG generation latency',
    async () => {
      const result = (await GenerateSvgAssetTool.handler({ objective: 'Performance test SVG' })) as SvgAsset;
      if (!result.success) throw new Error('SVG generation failed in latency benchmark');
    },
    100,
    'ms'
  );
  console.log(
    `  Latency: ${latencyResult.mean.toFixed(2)}ms ± ${latencyResult.stdDev.toFixed(2)}ms (CV: ${latencyResult.coefficientOfVariation.toFixed(1)}%)`
  );

  const throughputResult = await perfBench.benchmark(
    'SVG generation throughput',
    async () => {
      if (global.gc) global.gc();
      // Measure SVGs successfully generated per second (all 10 must succeed)
      const startTime = performance.now();
      let successCount = 0;
      for (let i = 0; i < 10; i++) {
        const result = (await GenerateSvgAssetTool.handler({ objective: `SVG ${i}` })) as SvgAsset;
        if (result.success) successCount++;
      }
      const elapsedMs = performance.now() - startTime;
      // Fail if any generation failed (exclude failed attempts from throughput measurement)
      if (successCount < 10) throw new Error(`Only ${successCount}/10 SVG generations succeeded in throughput test`);
      return (successCount / (elapsedMs / 1000)); // Successful SVGs per second
    },
    100,
    'ops/sec'
  );
  console.log(
    `  Throughput: ${throughputResult.mean.toFixed(2)} SVGs/sec ± ${throughputResult.stdDev.toFixed(2)}`
  );

  const memoryResult = await perfBench.benchmark(
    'SVG generation memory',
    async () => {
      // Measure peak heap usage during SVG generation (actual footprint in MB)
      // Run GC before to establish baseline
      if (global.gc) global.gc();
      const before = process.memoryUsage();
      const result = (await GenerateSvgAssetTool.handler({ objective: 'Memory test SVG' })) as SvgAsset;
      if (!result.success) throw new Error('SVG generation failed in memory benchmark');
      const after = process.memoryUsage();

      // Report actual peak heap usage (always positive, measured in MB)
      // Use max of before and after for peak memory footprint
      const peakHeapMB = Math.max(before.heapUsed, after.heapUsed) / 1024 / 1024;
      return peakHeapMB;
    },
    50,
    'MB'
  );
  console.log(
    `  Memory: ${memoryResult.mean.toFixed(2)} MB ± ${memoryResult.stdDev.toFixed(2)} MB`
  );

  // === CALCULATE SCORES ===
  console.log('\n📊 Computing Definition of Done Score...\n');

  // Explicit, domain-meaningful targets are required — scoring purely on
  // variance would let a metric that is stably bad (e.g. slow but
  // consistent) score as if it were fine.
  const performanceScore = perfBench.calculatePerformanceScore([
    { metricName: 'SVG generation latency', unit: 'ms', maxMean: 50 },
    { metricName: 'SVG generation throughput', unit: 'ops/sec', minMean: 5 },
    { metricName: 'SVG generation memory', unit: 'MB', maxMean: 64 },
  ]);

  // Code quality metrics must be measured, not fabricated. CI must fail
  // closed when this data is absent rather than substituting known-good
  // placeholder constants — a "conditional" un-measured result must never
  // be able to reach a passing DoD score.
  const metricsFile = path.join(process.cwd(), '.quality-metrics.json');
  let codeQualityMetrics: {
    complexity: { mean: number; max: number };
    duplication: number;
    coverage: number;
    maintainability: number;
    provenance: { source: string; measured: boolean };
  };
  try {
    const metricsData = await fs.readFile(metricsFile, 'utf8');
    const parsed = JSON.parse(metricsData);
    codeQualityMetrics = {
      ...parsed,
      provenance: parsed.provenance ?? { source: metricsFile, measured: true },
    };
    console.log('✅ Loaded code quality metrics from .quality-metrics.json');
  } catch {
    console.error('❌ FAILURE: Code quality metrics not measured');
    console.error('   Missing file: .quality-metrics.json');
    console.error('   Required metrics: complexity (mean, max), duplication (%),');
    console.error('   coverage (%), maintainability (index), provenance (source, measured: true)');
    console.error('   Generate with: eslint --format json, jscpd, jest --coverage, etc.');
    process.exit(1);
  }

  const codeQualityScore = scorer.calculateCodeQualityScore(codeQualityMetrics);

  // Baseline lives under the repo-root benchmarks/ tree, not this package's
  // own directory: create-release-issue.yml only stages and commits changes
  // beneath the repo-root benchmarks/ directory, so a baseline written
  // anywhere else is discarded with the runner and every release would look
  // like a first release (no regression detection).
  const repoRoot = path.join(process.cwd(), '..', '..', '..');
  const baselineDir = path.join(repoRoot, 'benchmarks', 'packages', packageJson.name);
  const baselineFile = path.join(baselineDir, 'baseline.json');

  // Try to load baseline for regression detection. Only a missing file
  // (ENOENT) legitimately means "first release" — a corrupt, truncated, or
  // unreadable baseline must not be silently treated the same way, or a
  // damaged file quietly resets regression history and then gets overwritten
  // by this run (permanently losing the last valid comparison point).
  let baselineLoaded = false;
  try {
    const baselineData = await fs.readFile(baselineFile, 'utf8');
    const baseline: DoDScore = JSON.parse(baselineData);
    if (baseline.combinedScore !== undefined) {
      scorer.setBaseline(baseline.version || 'unknown', baseline);
      baselineLoaded = true;
      console.log(`✅ Loaded baseline from previous release (v${baseline.version})\n`);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('ℹ️  No baseline available - first release, establishing baseline\n');
    } else {
      console.error('❌ FAILURE: Baseline file exists but could not be read/parsed:', err);
      process.exit(1);
    }
  }

  const dodReport = scorer.generateDoDReport(
    version,
    [coreResult, regressionResult, functionalityResult, errorResult],
    performanceScore,
    codeQualityMetrics
  );

  // Print results
  console.log('Behavioral Scores:');
  dodReport.behavioral.scores.forEach((s) => {
    console.log(
      `  ${s.category}: ${s.passRate.toFixed(1)}% (${s.passed ? '✅' : '❌'})`
    );
  });

  console.log(`\nPerformance Score: ${performanceScore.aggregateScore}/100`);
  console.log(`Code Quality Score: ${codeQualityScore.aggregateScore}/100`);
  console.log(`\n🎯 Combined DoD Score: ${dodReport.combinedScore}/100 ${dodReport.passed ? '✅ PASS' : '❌ FAIL'}`);

  // Emit results in the flat schema the publish/release-issue workflows and
  // scripts/create-release-issue.ts expect (matches the versioned
  // benchmarks/packages/<pkg>/v<version>/results.json files). The richer
  // DoDScore object above (with its scores[]/items[] arrays) is what
  // DoDScorer.setBaseline/detectRegressions consume internally — it is a
  // different, nested shape and must not be handed to the CI reporting path
  // directly, or field lookups like `behavioral.core_pass_rate` come back
  // undefined.
  // create-release-issue.yml's registry-update step reads `regression_detection`
  // (a summary object), not the raw `regressions` array DoDScorer produces —
  // translate one into the other so a completed comparison isn't silently
  // discarded in favor of the workflow's "Pending baseline comparison" fallback.
  const performanceMetricNames = new Set(
    performanceScore.items.map((item) => item.metricName)
  );
  const regressions = dodReport.regressions || [];
  const regressionDetection = {
    performance_regression: regressions.some((r) => performanceMetricNames.has(r.metric)),
    code_quality_regression: regressions.some((r) => r.metric === 'complexity' || r.metric === 'duplication'),
    behavioral_regression: regressions.some((r) => r.metric === 'behavioral_regression'),
    summary: !baselineLoaded
      ? 'No baseline available for comparison'
      : regressions.length > 0
        ? `${regressions.length} regression(s) detected vs baseline: ${regressions.map((r) => r.metric).join(', ')}`
        : 'No regressions detected vs baseline',
  };

  const resultsJson = {
    package: packageJson.name,
    version,
    timestamp: new Date().toISOString(),
    behavioral: {
      core_pass_rate: coreResult.passRate,
      core_total: coreResult.totalCount,
      regression_pass_rate: regressionResult.passRate,
      regression_total: regressionResult.totalCount,
      functionality_pass_rate: functionalityResult.passRate,
      functionality_total: functionalityResult.totalCount,
      error_pass_rate: errorResult.passRate,
      error_total: errorResult.totalCount,
      behavioral_score: dodReport.behavioral.aggregateScore,
    },
    performance: {
      latency_ms_mean: latencyResult.mean,
      latency_ms_std_dev: latencyResult.stdDev,
      latency_sample_count: latencyResult.samples,
      throughput_ops_sec_mean: throughputResult.mean,
      throughput_ops_sec_std_dev: throughputResult.stdDev,
      throughput_sample_count: throughputResult.samples,
      memory_mb_peak: memoryResult.max,
      performance_score: performanceScore.aggregateScore,
    },
    code_quality: {
      complexity_mean: codeQualityScore.complexity.mean,
      complexity_max: codeQualityScore.complexity.max,
      duplication_percent: codeQualityScore.duplication.percentDuplicated,
      coverage_percent: codeQualityScore.coverage.percent,
      maintainability_index: codeQualityScore.maintainability.index,
      quality_score: codeQualityScore.aggregateScore,
    },
    combined_score: dodReport.combinedScore,
    status: dodReport.passed ? 'pass' : 'fail',
    regressions,
    regression_detection: regressionDetection,
  };

  console.log('\n📄 Writing results to .benchmark/results.json...');
  const resultsDir = path.join(process.cwd(), '.benchmark');

  try {
    // Write ephemeral results to .benchmark/ (excluded from git)
    await fs.mkdir(resultsDir, { recursive: true });
    await fs.writeFile(
      path.join(resultsDir, 'results.json'),
      JSON.stringify(resultsJson, null, 2)
    );
    console.log(`✅ Results written to ${resultsDir}/results.json`);

    // Write persistent baseline (tracked in git) if this run passed DoD
    if (dodReport.passed) {
      await fs.mkdir(baselineDir, { recursive: true });
      await fs.writeFile(baselineFile, JSON.stringify(dodReport, null, 2));
      console.log(`✅ Baseline updated to ${baselineFile} (persisted across CI runs)`);
    } else {
      console.log(`⚠️  Baseline not updated (run did not pass DoD threshold)`);
    }
  } catch (err) {
    // A silent failure here would let the CI workflows fall back to a
    // fabricated "not_measured" result even though this run genuinely
    // measured something — exactly the fabrication this harness exists to
    // prevent. Fail loudly instead.
    console.error('❌ FAILURE: Could not persist benchmark results:', err);
    process.exit(1);
  }

  // Output results to stdout in JSON format for workflow consumption
  // Publish workflow parses this to populate benchmarks/packages/*/results.json
  console.log('\n' + JSON.stringify(resultsJson, null, 2));

  if (!dodReport.passed) {
    process.exit(1);
  }

  return dodReport;
}

runBenchmarks()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Benchmark failed:', error);
    process.exit(1);
  });
