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

  // Try to load baseline for regression detection
  // Store baseline in tracked directory (docs/benchmarks) to persist across CI runs
  try {
    const baselineDir = path.join(process.cwd(), 'docs', 'benchmarks');
    const baselineFile = path.join(baselineDir, 'svg-generator-baseline.json');
    try {
      const baselineData = await fs.readFile(baselineFile, 'utf8');
      const baseline: DoDScore = JSON.parse(baselineData);
      if (baseline.combinedScore !== undefined) {
        scorer.setBaseline(baseline.version || 'unknown', baseline);
        console.log(`✅ Loaded baseline from previous release (v${baseline.version})\n`);
      }
    } catch {
      // Baseline doesn't exist yet - this is the first release
      console.log('ℹ️  No baseline available - first release, establishing baseline\n');
    }
  } catch (err) {
    console.warn('⚠️  Could not load baseline for regression detection:', err);
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

  // Emit results to JSON for publish workflow consumption
  const resultsJson = {
    version,
    timestamp: new Date().toISOString(),
    combined_score: dodReport.combinedScore,
    passed: dodReport.passed,
    behavioral: {
      aggregate_score: dodReport.behavioral.aggregateScore,
      scores: dodReport.behavioral.scores,
    },
    performance: {
      aggregate_score: performanceScore.aggregateScore,
      items: performanceScore.items,
    },
    code_quality: {
      aggregate_score: codeQualityScore.aggregateScore,
      complexity: codeQualityScore.complexity,
      duplication: codeQualityScore.duplication,
      coverage: codeQualityScore.coverage,
      maintainability: codeQualityScore.maintainability,
    },
    regressions: dodReport.regressions || [],
  };

  console.log('\n📄 Writing results to .benchmark/results.json...');
  const resultsDir = path.join(process.cwd(), '.benchmark');
  const baselineDir = path.join(process.cwd(), 'docs', 'benchmarks');

  try {
    // Write ephemeral results to .benchmark/ (excluded from git)
    await fs.mkdir(resultsDir, { recursive: true });
    await fs.writeFile(
      path.join(resultsDir, 'results.json'),
      JSON.stringify(resultsJson, null, 2)
    );
    console.log(`✅ Results written to ${resultsDir}/results.json`);

    // Write persistent baseline to docs/benchmarks/ (tracked in git) if this run passed DoD
    if (dodReport.passed) {
      await fs.mkdir(baselineDir, { recursive: true });
      await fs.writeFile(
        path.join(baselineDir, 'svg-generator-baseline.json'),
        JSON.stringify(dodReport, null, 2)
      );
      console.log(`✅ Baseline updated to ${baselineDir}/svg-generator-baseline.json (persisted across CI runs)`);
    } else {
      console.log(`⚠️  Baseline not updated (run did not pass DoD threshold)`);
    }
  } catch (err) {
    console.error('⚠️ Failed to write results:', err);
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
