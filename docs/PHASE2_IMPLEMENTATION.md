# Phase 2: Benchmark Integration & DoD Compliance

**Status:** In Progress  
**Timeline:** 2 weeks (adaptive)  
**Parent Issue:** #289 (Benchmark Automation)

---

## Overview

Phase 2 implements the Definition of Done (DoD) framework across all skill packages. Every skill now measures and validates:
- **Behavioral Testing** (CORE, REGRESSION, FUNCTIONALITY, ERROR)
- **Performance Benchmarks** (latency, throughput, memory)
- **Code Quality Metrics** (complexity, duplication, coverage)

---

## What's New

### 1. Benchmark Utilities Library (`@h4shed/benchmark-utils`)

Shared library providing:

- **`BehavioralTester`** — Run categorized test suites
  ```typescript
  const tester = new BehavioralTester();
  const coreResult = await tester.runTestSuite('CORE', tests);
  // → passRate, confidenceInterval, CI bounds
  ```

- **`PerformanceBenchmarker`** — Measure latency/throughput with statistics
  ```typescript
  const bench = new PerformanceBenchmarker();
  const metric = await bench.benchmark('operation', fn, iterations);
  // → mean, stdDev, coefficientOfVariation, min/max
  ```

- **`DoDScorer`** — Calculate DoD compliance scores
  ```typescript
  const scorer = new DoDScorer();
  const report = scorer.generateDoDReport(version, suites, performance, quality);
  // → combinedScore (≥90% required), regressions, passed
  ```

### 2. Benchmark Structure for Each Skill

```
packages/skills/skill-name/
├── benchmark.ts           # Phase 2: Full suite runner
├── tests/                 # Unit tests (CORE category)
├── benchmarks/
│   ├── performance.ts     # Performance metrics
│   └── regression.ts      # REGRESSION test suite
└── package.json
```

### 3. Test Categories (DoD Framework)

| Category | Threshold | Purpose | Example |
|----------|-----------|---------|---------|
| **CORE** | ≥95% (with 93% CI) | Must-work functionality | "SVG generation", "Tool invocation" |
| **REGRESSION** | 100% (mandatory) | Prior versions still work | "v1.0 tests pass in v1.1" |
| **FUNCTIONALITY** | ≥80% | Advanced features | "Complex shapes", "Custom dimensions" |
| **ERROR** | ≥90% | Edge cases & error handling | "Invalid inputs", "Boundary conditions" |

---

## Phase 2 Tasks

### A. Adapt SyncPulse Benchmarks

**File:** `packages/skills/syncpulse-hub/benchmarks/`

Current benchmarks:
- `performance.benchmark.ts` — Cache, Memory, Vector operations
- `release-performance.benchmark.ts` — Release-specific metrics

**Adapt to:**
1. Add behavioral test categories (CORE, REGRESSION, FUNCTIONALITY, ERROR)
2. Measure REGRESSION test pass rate (backward compatibility)
3. Calculate combined DoD score
4. Generate regression detection report

**Timeline:** Day 1-2

---

### B. Add Behavioral Tests to Skills

**Target Skills (Priority Order):**
1. `svg-generator` (example impl complete)
2. `canvas-design`
3. `ascii-mockup`
4. `playwright-test-automation`
5. `underworld-writer-skill`

**For Each Skill:**
1. Create `benchmark.ts` in package root
2. Add test suite definitions:
   - CORE: 4-8 essential tests
   - REGRESSION: 2-3 backward compat tests
   - FUNCTIONALITY: 2-3 advanced feature tests
   - ERROR: 2-3 edge case tests
3. Wire up performance benchmarks
4. Run locally and validate scores

**Timeline:** Day 3-5

---

### C. Implement Checkpoint Structure

**File:** `docs/CHECKPOINT_STRUCTURE.md` (TBD)

Each release tracks:
```json
{
  "version": "1.0.0",
  "checkpoints": [
    {
      "checkpoint": 1,
      "features": ["SVG generation", "Tool definition"],
      "tests": ["core_svg_gen", "core_tool_def"],
      "regression_tests": [/* none for v1.0 */]
    },
    {
      "checkpoint": 2,
      "features": ["Custom dimensions"],
      "tests": ["functionality_dimensions"],
      "regression_tests": ["core_svg_gen", "core_tool_def"]
    }
  ]
}
```

**Timeline:** Day 6-7

---

### D. Code Quality Metrics Integration

**Add to Benchmarks:**
1. Cyclomatic complexity (via `typhonjs-escomplex`)
2. Code duplication (via `jscpd`)
3. Test coverage (via `c8`)
4. Maintainability index (via custom calculation)

**Implementation:**
- Create `code-quality-analyzer.ts` in benchmark-utils
- Wire into `DoDScorer.calculateCodeQualityScore()`
- Add metrics to benchmark reports

**Timeline:** Day 8-10

---

### E. Regression Monitoring Dashboard

**File:** `benchmarks/regression-reports/` (new)

For each version, track:
```json
{
  "version": "1.1.0",
  "previous": "1.0.0",
  "regressions": [
    {
      "metric": "latency",
      "baseline": 5.2,
      "current": 5.8,
      "changePercent": 11.5,
      "severity": "high"
    }
  ],
  "passed": true
}
```

**Timeline:** Day 11-12

---

### F. Automation & CI/CD Integration

**Updates to Workflows:**

1. **Publish Workflow** (`.github/workflows/publish.yml`)
   - Before publish, run benchmark suite
   - Verify combined_score ≥ 90%
   - Block publication if score < 90%
   - Already implemented in Phase 1 ✅

2. **Test Workflow** (`.github/workflows/test.yml`)
   - Run behavioral tests for each skill
   - Report DoD scores to PR
   - Flag regressions in PR comments

**Timeline:** Day 13-14

---

## Running Phase 2 Benchmarks

### Local Development

```bash
# Run benchmark suite for a skill
cd packages/skills/svg-generator
npm run benchmark

# Output:
# 📊 SVG Generator Skill - Phase 2 Benchmarks
# CORE: 4/4 (100%)
# REGRESSION: 2/2 (100%)
# FUNCTIONALITY: 2/2 (100%)
# ERROR: 2/2 (100%)
# Combined DoD Score: 95/100 ✅ PASS
```

### On Tag Push (CI/CD)

1. Publish workflow triggered
2. For each package, runs `npm run benchmark`
3. Reads `benchmarks/packages/{package}/v{version}/results.json`
4. Verifies combined_score ≥ 90%
5. If pass: publishes to npm
6. If fail: blocks publication, creates issue

---

## Validation Checklist

### For Phase 2 PR

- [ ] Benchmark-utils package builds and tests pass
- [ ] SyncPulse benchmarks adapted to DoD framework
- [ ] ≥3 skills have complete benchmark suites
- [ ] All benchmarks produce valid DoD reports
- [ ] Combined scores ≥85% for all measured skills
- [ ] No regressions detected vs Phase 1
- [ ] Documentation complete and examples runnable
- [ ] CI/CD integration tested with dry-run tag push

### For Phase 2 Completion

- [ ] All 10+ skills have behavioral test suites
- [ ] Code quality metrics integrated
- [ ] Checkpoint structure defined and tracked
- [ ] Regression dashboard live and monitoring
- [ ] DoD enforcement active on publish workflow
- [ ] Team trained on benchmark interpretation
- [ ] Baseline established for regression detection

---

## Next Steps (Phase 3)

Once Phase 2 is merged:

1. **SCBench Integration** — Adapt third-party benchmarks
2. **Dashboard** — Web UI for benchmark trends
3. **Alerting** — Slack notifications for regressions
4. **Historical Analysis** — Track improvements over time

---

## References

- `/docs/DEFINITION_OF_DONE.md` — DoD standards
- `/packages/benchmark-utils` — Utilities library
- `/packages/skills/svg-generator/benchmark.ts` — Example implementation
- `/.github/workflows/publish.yml` — Enforcement in publish workflow
