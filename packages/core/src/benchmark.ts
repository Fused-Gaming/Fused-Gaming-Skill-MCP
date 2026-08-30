/**
 * @h4shed/mcp-core Benchmark Suite
 * Measures behavioral, performance, and code quality metrics for DoD compliance
 */

import { BehavioralTester, PerformanceBenchmarker, DoDScorer, DoDScore } from '@h4shed/benchmark-utils';
import { SkillRegistry } from './skill-registry.js';
import { loadConfig, saveConfig, getDefaultConfig } from './config.js';
import type { Skill } from './types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

function makeSkill(name: string, overrides: Partial<Skill> = {}): Skill {
  return {
    name,
    version: '1.0.0',
    description: 'benchmark fixture skill',
    tools: [],
    initialize: async () => {},
    ...overrides,
  };
}

async function runBenchmarks() {
  console.log('🎯 @h4shed/mcp-core Benchmarks\n');

  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  const version = packageJson.version;

  const tester = new BehavioralTester();
  const perfBench = new PerformanceBenchmarker();
  const scorer = new DoDScorer();

  // === BEHAVIORAL TESTS ===
  console.log('📋 Running Behavioral Tests...\n');

  const coreTests = [
    {
      name: 'registerSkill + getSkill round-trip',
      fn: () => {
        const registry = new SkillRegistry(() => {});
        const skill = makeSkill('core-a');
        registry.registerSkill(skill);
        if (registry.getSkill('core-a') !== skill) throw new Error('getSkill did not return the registered skill');
      },
    },
    {
      name: 'listSkills reflects registered skills',
      fn: () => {
        const registry = new SkillRegistry(() => {});
        registry.registerSkill(makeSkill('core-b'));
        registry.registerSkill(makeSkill('core-c'));
        const names = registry.listSkills().sort();
        if (names.join(',') !== 'core-b,core-c') throw new Error(`Unexpected skill list: ${names.join(',')}`);
      },
    },
    {
      name: 'getDefaultConfig returns a well-formed config',
      fn: () => {
        const config = getDefaultConfig();
        if (!config.server?.name || !Array.isArray(config.skills?.enabled)) {
          throw new Error('Default config is missing required fields');
        }
      },
    },
    {
      name: 'loadConfig falls back to defaults when no file exists',
      fn: () => {
        const config = loadConfig(path.join(os.tmpdir(), `mcp-core-benchmark-missing-${Date.now()}.json`));
        if (config.server.name !== getDefaultConfig().server.name) {
          throw new Error('loadConfig did not fall back to defaults');
        }
      },
    },
  ];
  const coreResult = await tester.runTestSuite('CORE', coreTests);
  console.log(`✅ CORE: ${coreResult.passCount}/${coreResult.totalCount} (${coreResult.passRate.toFixed(1)}%)\n`);

  const regressionTests = [
    {
      name: 'unloadSkill calls cleanup and removes the skill',
      fn: async () => {
        const registry = new SkillRegistry(() => {});
        let cleaned = false;
        registry.registerSkill(makeSkill('reg-a', { cleanup: async () => { cleaned = true; } }));
        await registry.unloadSkill('reg-a');
        if (!cleaned) throw new Error('cleanup was not called');
        if (registry.getSkill('reg-a') !== undefined) throw new Error('skill was not removed');
      },
    },
    {
      name: 'registerSkill still rejects a missing name',
      fn: () => {
        const registry = new SkillRegistry(() => {});
        let threw = false;
        try {
          registry.registerSkill(makeSkill(''));
        } catch {
          threw = true;
        }
        if (!threw) throw new Error('registerSkill accepted a skill without a name');
      },
    },
  ];
  const regressionResult = await tester.runTestSuite('REGRESSION', regressionTests);
  console.log(`✅ REGRESSION: ${regressionResult.passCount}/${regressionResult.totalCount} (${regressionResult.passRate.toFixed(1)}%)\n`);

  const functionalityTests = [
    {
      name: 'unloadAll clears every registered skill',
      fn: async () => {
        const registry = new SkillRegistry(() => {});
        registry.registerSkill(makeSkill('func-a'));
        registry.registerSkill(makeSkill('func-b'));
        await registry.unloadAll();
        if (registry.listSkills().length !== 0) throw new Error('unloadAll left skills registered');
      },
    },
    {
      name: 'saveConfig + loadConfig round-trip preserves overrides',
      fn: async () => {
        const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-core-benchmark-'));
        const configPath = path.join(dir, '.fused-gaming-mcp.json');
        const config = getDefaultConfig();
        config.logging.level = 'debug';
        saveConfig(config, configPath);
        const loaded = loadConfig(configPath);
        await fs.rm(dir, { recursive: true, force: true });
        if (loaded.logging.level !== 'debug') throw new Error('round-trip did not preserve override');
      },
    },
  ];
  const functionalityResult = await tester.runTestSuite('FUNCTIONALITY', functionalityTests);
  console.log(`✅ FUNCTIONALITY: ${functionalityResult.passCount}/${functionalityResult.totalCount} (${functionalityResult.passRate.toFixed(1)}%)\n`);

  const errorTests = [
    {
      name: 'loadConfig falls back to defaults on malformed JSON',
      fn: async () => {
        const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-core-benchmark-'));
        const configPath = path.join(dir, 'malformed.json');
        await fs.writeFile(configPath, '{ not valid json');
        const config = loadConfig(configPath);
        await fs.rm(dir, { recursive: true, force: true });
        if (config.server.name !== getDefaultConfig().server.name) {
          throw new Error('malformed config was not handled gracefully');
        }
      },
    },
    {
      name: 'loadSkill returns null for a package that does not exist',
      fn: async () => {
        const registry = new SkillRegistry(() => {});
        const result = await registry.loadSkill('does-not-exist-anywhere-benchmark');
        if (result !== null) throw new Error('loadSkill did not return null for a missing package');
      },
    },
  ];
  const errorResult = await tester.runTestSuite('ERROR', errorTests);
  console.log(`✅ ERROR: ${errorResult.passCount}/${errorResult.totalCount} (${errorResult.passRate.toFixed(1)}%)\n`);

  // === PERFORMANCE BENCHMARKS ===
  console.log('⚡ Running Performance Benchmarks...\n');

  const registrationResult = await perfBench.benchmark(
    'skill registration latency',
    () => {
      const registry = new SkillRegistry(() => {});
      registry.registerSkill(makeSkill('perf-skill'));
      registry.getSkill('perf-skill');
    },
    200,
    'ms'
  );
  console.log(
    `  Registration latency: ${registrationResult.mean.toFixed(3)}ms ± ${registrationResult.stdDev.toFixed(3)}ms (CV: ${registrationResult.coefficientOfVariation.toFixed(1)}%)`
  );

  const listThroughputResult = await perfBench.benchmark(
    'listSkills throughput',
    () => {
      const registry = new SkillRegistry(() => {});
      for (let i = 0; i < 10; i++) registry.registerSkill(makeSkill(`throughput-${i}`));
      const start = performance.now();
      for (let i = 0; i < 100; i++) registry.listSkills();
      const elapsedMs = performance.now() - start;
      return 100 / (elapsedMs / 1000);
    },
    50,
    'ops/sec'
  );
  console.log(
    `  listSkills throughput: ${listThroughputResult.mean.toFixed(0)} ops/sec ± ${listThroughputResult.stdDev.toFixed(0)}`
  );

  const memoryResult = await perfBench.benchmark(
    'registry lifecycle memory',
    async () => {
      if (global.gc) global.gc();
      const before = process.memoryUsage();
      const registry = new SkillRegistry(() => {});
      for (let i = 0; i < 50; i++) registry.registerSkill(makeSkill(`mem-${i}`));
      await registry.unloadAll();
      const after = process.memoryUsage();
      return Math.max(before.heapUsed, after.heapUsed) / 1024 / 1024;
    },
    50,
    'MB'
  );
  console.log(`  Registry lifecycle memory: ${memoryResult.mean.toFixed(2)} MB ± ${memoryResult.stdDev.toFixed(2)} MB`);

  // === CALCULATE SCORES ===
  console.log('\n📊 Computing Definition of Done Score...\n');

  const performanceScore = perfBench.calculatePerformanceScore([
    { metricName: 'skill registration latency', unit: 'ms', maxMean: 5 },
    { metricName: 'listSkills throughput', unit: 'ops/sec', minMean: 1000 },
    { metricName: 'registry lifecycle memory', unit: 'MB', maxMean: 128 },
  ]);

  // Code quality metrics must be measured, not fabricated. `npm run benchmark`
  // runs scripts/collect-quality-metrics.mjs before this script, which writes
  // .quality-metrics.json from a real jest coverage run plus a static
  // complexity/duplication scan of src/**/*.ts.
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
    codeQualityMetrics = JSON.parse(metricsData);
    console.log('✅ Loaded code quality metrics from .quality-metrics.json');
  } catch {
    console.error('❌ FAILURE: Code quality metrics not measured');
    console.error('   Missing file: .quality-metrics.json');
    console.error('   Run: node scripts/collect-quality-metrics.mjs');
    process.exit(1);
  }

  const codeQualityScore = scorer.calculateCodeQualityScore(codeQualityMetrics);

  // Try to load baseline for regression detection
  try {
    const baselineDir = path.join(process.cwd(), 'docs', 'benchmarks');
    const baselineFile = path.join(baselineDir, 'mcp-core-baseline.json');
    try {
      const baselineData = await fs.readFile(baselineFile, 'utf8');
      const baseline: DoDScore = JSON.parse(baselineData);
      if (baseline.combinedScore !== undefined) {
        scorer.setBaseline(baseline.version || 'unknown', baseline);
        console.log(`✅ Loaded baseline from previous release (v${baseline.version})\n`);
      }
    } catch {
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

  console.log('Behavioral Scores:');
  dodReport.behavioral.scores.forEach((s) => {
    console.log(`  ${s.category}: ${s.passRate.toFixed(1)}% (${s.passed ? '✅' : '❌'})`);
  });

  console.log(`\nPerformance Score: ${performanceScore.aggregateScore}/100`);
  console.log(`Code Quality Score: ${codeQualityScore.aggregateScore}/100`);
  console.log(`\n🎯 Combined DoD Score: ${dodReport.combinedScore}/100 ${dodReport.passed ? '✅ PASS' : '❌ FAIL'}`);

  // Flat schema expected by scripts/create-release-issue.ts and the
  // publish/create-release-issue workflows.
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
      latency_ms_mean: registrationResult.mean,
      latency_ms_std_dev: registrationResult.stdDev,
      latency_sample_count: registrationResult.samples,
      throughput_ops_sec_mean: listThroughputResult.mean,
      throughput_ops_sec_std_dev: listThroughputResult.stdDev,
      throughput_sample_count: listThroughputResult.samples,
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
    regressions: dodReport.regressions || [],
  };

  console.log('\n📄 Writing results to .benchmark/results.json...');
  const resultsDir = path.join(process.cwd(), '.benchmark');
  const baselineDir = path.join(process.cwd(), 'docs', 'benchmarks');

  try {
    await fs.mkdir(resultsDir, { recursive: true });
    await fs.writeFile(path.join(resultsDir, 'results.json'), JSON.stringify(resultsJson, null, 2));
    console.log(`✅ Results written to ${resultsDir}/results.json`);

    if (dodReport.passed) {
      await fs.mkdir(baselineDir, { recursive: true });
      await fs.writeFile(
        path.join(baselineDir, 'mcp-core-baseline.json'),
        JSON.stringify(dodReport, null, 2)
      );
      console.log(`✅ Baseline updated to ${baselineDir}/mcp-core-baseline.json (persisted across CI runs)`);
    } else {
      console.log('⚠️  Baseline not updated (run did not pass DoD threshold)');
    }
  } catch (err) {
    console.error('⚠️ Failed to write results:', err);
  }

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
