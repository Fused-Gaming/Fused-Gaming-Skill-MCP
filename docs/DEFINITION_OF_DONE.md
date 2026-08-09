# Definition of Done (DoD) — Benchmark Validation Standards

**Status:** Active  
**Last Updated:** 2026-08-09  
**Version:** 1.0.0  

---

## Overview

This document defines the **Definition of Done (DoD)** for all packages published to the Fused Gaming / VLN ecosystem. Every versioned release **must pass** all DoD criteria with **statistical rigor** before publication.

DoD enforces:
- **Behavioral correctness** (CORE, REGRESSION, FUNCTIONALITY, ERROR tests)
- **Performance stability** (mean ± 1σ validation)
- **Code quality** (complexity, duplication, coverage trends)
- **Combined precision score** (weighted composite ≥90%)

---

## 1. Behavioral Testing Standards

### 1.1 CORE Tests (Threshold: ≥95% Pass Rate)

**Definition:** Tests covering essential, non-negotiable functionality that **must** work correctly in every version.

**Validation Criteria:**
```
Pass Rate ≥ 95%
Confidence Interval (95% CI):
  Lower Bound = Mean - (1.96 × SE)
  SE = √(p(1-p)/n)
  where p = pass rate, n = test count
  
Requirement: Lower Bound ≥ 93% (allows minimal margin)
```

**Example:**
```
CORE Tests: 95 passed / 100 total
Pass Rate = 95%
SE = √(0.95 × 0.05 / 100) = 0.0218
95% CI = 95% ± (1.96 × 2.18%) = [90.7%, 99.3%]
Lower Bound = 90.7% ✅ (≥93% fails, but 95% mean passes)

DoD Status: PASS ✅
```

**Action if Failed:**
- ❌ **BLOCKED** — Do not release
- Identify and fix failing tests
- Re-run benchmark with full test suite
- Update issue with new metrics

---

### 1.2 REGRESSION Tests (Threshold: 100% Pass Rate — MANDATORY)

**Definition:** Tests for code written in **prior checkpoints** that must continue to work when new features are added. **No code erosion allowed.**

**Validation Criteria:**
```
Pass Rate = 100% (NO EXCEPTIONS)

For each checkpoint:
  - Checkpoint 1 tests: 100% pass in v1.0, v1.1, v1.2, etc.
  - Checkpoint 2 tests: 100% pass in v1.1, v1.2, etc.
  - Checkpoint 3 tests: 100% pass in v1.2, etc.

Failure = Feature regression, immediate action required
```

**Example:**
```
v1.0 → v1.1 Upgrade:
  - CP1 tests (50 tests): 50/50 passed ✅ (100%)
  - CP2 tests (35 new): 35/35 passed ✅ (100%)
  Total: 85/85 passed ✅

Code Erosion: None detected ✅
DoD Status: PASS ✅
```

**Action if Failed:**
- ❌ **CRITICAL** — Release is BLOCKED immediately
- Escalate to team lead
- Revert changes or fix regression
- Document root cause in issue

---

### 1.3 FUNCTIONALITY Tests (Threshold: ≥80% Pass Rate)

**Definition:** Advanced features, optimizations, and nice-to-have functionality that enhance the package but aren't critical.

**Validation Criteria:**
```
Pass Rate ≥ 80%
Confidence Interval (95% CI): Lower Bound ≥ 75%

Example (75 tests):
  Pass Rate = 82.67% (62 passed / 75 total)
  SE = √(0.8267 × 0.1733 / 75) = 0.0455
  95% CI = 82.67% ± (1.96 × 4.55%) = [74.0%, 91.3%]
  Lower Bound = 74.0% ⚠️ (Marginally acceptable)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — Requires review
- Document which FUNCTIONALITY tests are missing/failing
- Decide: (a) Fix before release, or (b) Document as "Known Limitation"
- If (b), add issue for future version

---

### 1.4 ERROR Handling Tests (Threshold: ≥90% Pass Rate)

**Definition:** Edge cases, invalid inputs, exception handling. Measures robustness.

**Validation Criteria:**
```
Pass Rate ≥ 90%
Confidence Interval (95% CI): Lower Bound ≥ 85%

Example (50 tests):
  Pass Rate = 92% (46 passed / 50 total)
  SE = √(0.92 × 0.08 / 50) = 0.0383
  95% CI = 92% ± (1.96 × 3.83%) = [84.5%, 99.5%]
  Lower Bound = 84.5% ⚠️ (Just below 85% threshold)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — Requires review
- Identify critical error scenarios
- Either fix or document error handling limitations
- Add tests for next version

---

## 2. Performance Testing Standards

### 2.1 Latency Metrics (Threshold: Mean ± 1σ Stability)

**Definition:** Measure execution time. Accept normal variation (1 standard deviation).

**Validation Criteria:**
```
Collect N samples (minimum 30 for statistical validity)
Calculate:
  - Mean = Σ(latencies) / N
  - Std Dev (σ) = √(Σ(latency - mean)² / (N - 1))
  - Coefficient of Variation (CV) = (σ / mean) × 100%

Acceptance:
  - CV < 10%: Excellent stability ✅
  - CV 10-20%: Acceptable (typical for real systems) ✅
  - CV 20-30%: Marginal (requires investigation) ⚠️
  - CV > 30%: Poor stability (likely measurement noise) ❌

Example (Latency: p50):
  Samples: [10.2, 10.5, 9.8, 10.1, 10.3, 9.9, 10.4] ms
  Mean = 10.2 ms
  σ = 0.24 ms
  CV = 2.4% ✅ (Excellent)
  
  Acceptable Range: [10.2 - 0.24, 10.2 + 0.24] = [9.96, 10.44] ms
```

**Percentiles to Track:**
- p50 (Median): Most common latency
- p95 (95th percentile): "Almost always faster than..."
- p99 (99th percentile): Tail latency / worst case

**Action if Failed:**
- ⚠️ **CONDITIONAL** — Investigate variance source
- If CV > 30%, suspect environmental factors (GC, CPU throttling)
- Re-run in clean environment
- If still high, document as "High variance" and require next-version improvement

---

### 2.2 Throughput Metrics (Threshold: Mean ± 1σ Stability)

**Definition:** Measure operations per second. Accept 1σ variation.

**Validation Criteria:**
```
Collect N samples (minimum 30)
Calculate:
  - Mean = Σ(throughput values) / N
  - σ = √(Σ(tp - mean)² / (N - 1))
  - CV = (σ / mean) × 100%

Acceptance:
  - CV < 10%: Excellent ✅
  - CV 10-20%: Acceptable ✅
  - CV 20-30%: Marginal ⚠️
  - CV > 30%: Investigate ❌

Example (Throughput):
  Samples: [1045, 1052, 1038, 1048, 1055, 1041] ops/sec
  Mean = 1046.5 ops/sec
  σ = 6.2 ops/sec
  CV = 0.6% ✅ (Excellent)
  
  Acceptable Range: [1040.3, 1052.7] ops/sec
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — Same investigation as latency
- Check for CPU contention, I/O bottlenecks
- Validate measurement methodology

---

### 2.3 Memory Usage (Threshold: ±5% Change Tolerance)

**Definition:** Peak memory footprint should not grow unexpectedly.

**Validation Criteria:**
```
Baseline (from previous version): M_base
Current (this version): M_current

Percent Change = ((M_current - M_base) / M_base) × 100%

Acceptance:
  - Δ ≤ 5%: Acceptable (normal minor changes) ✅
  - 5% < Δ ≤ 10%: Marginal (investigate cause) ⚠️
  - Δ > 10%: Likely regression ❌

Example:
  v1.0 Baseline: 128 MB
  v1.1 Current: 131.5 MB
  Δ = ((131.5 - 128) / 128) × 100% = 2.73% ✅ (Acceptable)
  
  v1.0 Baseline: 128 MB
  v1.1 Current: 142 MB
  Δ = ((142 - 128) / 128) × 100% = 10.9% ⚠️ (Investigate)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — Requires review
- Identify memory leak or large new data structure
- Either optimize or accept with documentation
- If >10% and unexplained, block release

---

## 3. Code Quality Standards

### 3.1 Cyclomatic Complexity (Threshold: Mean ≤3.0, Max ≤5.0)

**Definition:** Measures decision points in code. Higher = harder to test/maintain.

**Validation Criteria:**
```
For each function:
  Complexity = 1 (baseline) + Σ(decision_points)
  
Example:
  function process(x) {      // +1 = 1
    if (x > 0) {             // +1 = 2
      if (x > 10) {          // +1 = 3
        return x * 2;
      }
    }
    return x;
  }
  
  Complexity = 3 ✅ (Acceptable)

Repository Statistics:
  - Mean complexity: Calculate for all functions
  - Max complexity: Worst offender
  
Acceptance:
  - Mean ≤ 3.0 ✅
  - Max ≤ 5.0 ✅
  - Max 6-8: Refactor recommended ⚠️
  - Max > 8: Hard to test, block release ❌
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — If mean ≤ 3.0 but max > 8
- Identify high-complexity functions
- Break into smaller functions
- Re-measure after refactoring

---

### 3.2 Code Duplication (Threshold: <5%)

**Definition:** Percentage of code that is duplicated elsewhere.

**Validation Criteria:**
```
Duplication = (Duplicated Lines / Total Lines) × 100%

Acceptance:
  - < 5%: Excellent ✅
  - 5-10%: Acceptable (minor duplication) ✅
  - 10-15%: Marginal (consider extracting common code) ⚠️
  - > 15%: Refactor required, block release ❌

Example:
  Total Lines: 1000
  Duplicated Lines: 45
  Duplication = 4.5% ✅ (Acceptable)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — If 5-10%, document patterns
- If >10%, identify and extract common functions
- Re-measure after refactoring

---

### 3.3 Test Coverage (Threshold: ≥80%)

**Definition:** Percentage of code paths covered by tests.

**Validation Criteria:**
```
Coverage = (Lines Executed in Tests / Total Lines) × 100%

Acceptance:
  - ≥ 90%: Excellent ✅
  - 80-89%: Acceptable ✅
  - 70-79%: Marginal (missing edge case tests) ⚠️
  - < 70%: Insufficient, block release ❌

Example:
  Total Lines: 500
  Covered Lines: 420
  Coverage = 84% ✅ (Acceptable)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — If 70-79%, add missing tests
- ❌ **BLOCKED** — If <70%, release cannot proceed
- Identify untested code paths
- Add tests before release

---

### 3.4 Maintainability Index (Threshold: ≥70/100)

**Definition:** Composite metric combining complexity, coverage, lines-of-code.

**Validation Criteria:**
```
Maintainability Index = 
  171 - (5.2 × ln(Halstead Volume)) 
      - (0.23 × Complexity) 
      - (16.2 × ln(LOC))

Interpretation:
  - ≥ 85: Highly maintainable ✅
  - 70-84: Maintainable ✅
  - 65-69: Moderate (review recommended) ⚠️
  - 50-64: Low (requires refactoring) ⚠️
  - < 50: Very low (block release) ❌

Example:
  MI Score: 76 ✅ (Acceptable)
```

**Action if Failed:**
- ⚠️ **CONDITIONAL** — If 65-69%, review for refactoring
- ❌ **BLOCKED** — If <65%, refactor before release

---

## 4. Combined Precision Score

### 4.1 Weighted Composite Calculation

**Formula:**
```
Combined Score = (B × 0.40) + (P × 0.35) + (Q × 0.25)

where:
  B = Behavioral Score (%)
  P = Performance Score (%)
  Q = Code Quality Score (%)
  
Weights:
  - Behavioral: 40% (most important: correctness)
  - Performance: 35% (stability and efficiency)
  - Code Quality: 25% (maintainability for future)
```

### 4.2 Component Score Calculation

**Behavioral Score:**
```
B = (CORE_pass% × 0.50) + (REGRESSION_pass% × 0.30) 
  + (FUNCTIONALITY_pass% × 0.12) + (ERROR_pass% × 0.08)

Example:
  CORE: 95%, REGRESSION: 100%, FUNCTIONALITY: 85%, ERROR: 92%
  B = (95 × 0.50) + (100 × 0.30) + (85 × 0.12) + (92 × 0.08)
    = 47.5 + 30 + 10.2 + 7.36
    = 95.06% ✅
```

**Performance Score:**
```
P = (Latency_score × 0.40) + (Throughput_score × 0.40) 
  + (Memory_score × 0.20)

where each score = 100% if within acceptable variance, 
                   scaled down if variance high

Example:
  Latency CV: 5% (excellent) = 100%
  Throughput CV: 8% (excellent) = 100%
  Memory Δ: +3% (acceptable) = 100%
  P = (100 × 0.40) + (100 × 0.40) + (100 × 0.20)
    = 40 + 40 + 20
    = 100% ✅
```

**Code Quality Score:**
```
Q = (Complexity_score × 0.35) + (Duplication_score × 0.20) 
  + (Coverage_score × 0.25) + (Maintainability_score × 0.20)

where each component is 100% if within threshold, 
      scaled proportionally if not

Example:
  Complexity: Mean 2.8 (threshold 3.0) = 100%
  Duplication: 4.2% (threshold 5%) = 100%
  Coverage: 85% (threshold 80%) = 100%
  Maintainability: 74 (threshold 70) = 100%
  Q = (100 × 0.35) + (100 × 0.20) + (100 × 0.25) + (100 × 0.20)
    = 35 + 20 + 25 + 20
    = 100% ✅
```

### 4.3 DoD Release Decision Matrix

| Combined Score | Behavioral | Performance | Decision |
|---|---|---|---|
| **≥90%** | Any | Any | ✅ **APPROVED** |
| 85-89% | ≥95% CORE + 100% REGR | ≥90% | ⚠️ **CONDITIONAL** |
| <85% | <95% CORE OR <100% REGR | <85% | ❌ **BLOCKED** |

**Release Criteria (ALL Must Pass):**
1. Combined Score ≥ 90%
2. CORE Tests ≥ 95%
3. REGRESSION Tests = 100%
4. Behavioral Score ≥ 90%

---

## 5. Regression Detection Thresholds

### 5.1 Performance Regression (Threshold: ±5% Tolerance)

**Definition:** Unexpected degradation compared to previous version.

**Validation Criteria:**
```
Regression Δ = ((Current - Baseline) / Baseline) × 100%

Thresholds:
  - Δ ≤ ±5%: No regression ✅
  - ±5% < Δ ≤ ±10%: Minor regression (acceptable with explanation) ⚠️
  - Δ > ±10%: Major regression (investigate or block) ❌

Example (Latency):
  v1.0 Baseline: 10.2 ms (mean)
  v1.1 Current: 10.6 ms (mean)
  Δ = ((10.6 - 10.2) / 10.2) × 100% = 3.9% ✅ (No regression)
  
  v1.0 Baseline: 10.2 ms
  v1.1 Current: 11.8 ms
  Δ = ((11.8 - 10.2) / 10.2) × 100% = 15.7% ❌ (Major regression)
```

**Action if Detected:**
- ⚠️ **CONDITIONAL** — If ±5-10%, investigate and document
- ❌ **BLOCKED** — If >10%, performance optimization required

---

### 5.2 Code Quality Regression (Threshold: ±10% Complexity, ±2% Duplication)

**Definition:** Code quality should not degrade.

**Validation Criteria:**
```
Complexity Regression:
  Δ_complexity = ((Mean_current - Mean_baseline) / Mean_baseline) × 100%
  
  Thresholds:
    - Δ ≤ 10%: Acceptable ✅
    - 10% < Δ ≤ 15%: Marginal (refactor recommended) ⚠️
    - Δ > 15%: Major regression (block release) ❌

Duplication Regression:
  Δ_duplication = Duplication_current% - Duplication_baseline%
  
  Thresholds:
    - Δ ≤ 2%: Acceptable ✅
    - 2% < Δ ≤ 5%: Marginal (extract common code) ⚠️
    - Δ > 5%: Major regression (block release) ❌

Example (Complexity):
  v1.0: Mean complexity = 2.8
  v1.1: Mean complexity = 2.95
  Δ = ((2.95 - 2.8) / 2.8) × 100% = 5.4% ✅ (Acceptable)
  
  v1.0: Mean complexity = 2.8
  v1.1: Mean complexity = 3.3
  Δ = ((3.3 - 2.8) / 2.8) × 100% = 17.9% ❌ (Major regression)
```

**Action if Detected:**
- ⚠️ **CONDITIONAL** — If marginal, document and track for next version
- ❌ **BLOCKED** — If major, refactoring required

---

## 6. Statistical Validation Methods

### 6.1 Confidence Intervals (95% CI)

**Purpose:** Establish reliable bounds around test pass rates.

**Calculation:**
```
For pass/fail tests (binomial proportion):
  p̂ = sample proportion (pass rate)
  n = sample size
  SE = √(p̂(1-p̂)/n)
  
  95% CI = p̂ ± (1.96 × SE)
  
  Lower Bound = p̂ - (1.96 × SE)
  Upper Bound = p̂ + (1.96 × SE)

Example (100 tests, 95 pass):
  p̂ = 0.95
  n = 100
  SE = √(0.95 × 0.05 / 100) = 0.0218
  95% CI = 0.95 ± (1.96 × 0.0218) = [0.907, 0.993]
  
  Interpretation: We are 95% confident the true pass rate is 
                   between 90.7% and 99.3%
```

**DoD Application:**
```
For CORE tests (threshold ≥ 95%):
  Require: Lower Bound ≥ 93% (conservative safety margin)
  
For REGRESSION tests (threshold = 100%):
  Require: Actual pass rate = 100% (no CI needed, hard requirement)
```

---

### 6.2 Standard Deviation & Coefficient of Variation

**Purpose:** Measure variability in performance metrics.

**Calculation:**
```
Standard Deviation (σ):
  σ = √(Σ(x - mean)² / (n - 1))
  
Coefficient of Variation (CV):
  CV = (σ / mean) × 100%

Interpretation:
  CV < 10%: Low variability (stable, repeatable)
  CV 10-20%: Moderate variability (typical for systems)
  CV 20-30%: High variability (investigate cause)
  CV > 30%: Very high variability (measurement error likely)

Example (Latency: 10 samples):
  Samples: [10.1, 10.3, 9.9, 10.2, 10.0, 10.4, 9.8, 10.1, 10.2, 10.1] ms
  Mean = 10.11 ms
  σ = 0.165 ms
  CV = (0.165 / 10.11) × 100% = 1.63% ✅ (Excellent)
```

---

### 6.3 Trend Analysis

**Purpose:** Detect code quality trends across versions.

**Calculation:**
```
Track metrics across versions:
  v1.0 → v1.1 → v1.2 → v1.3 → ...
  
Detect:
  - Monotonic increase (getting worse)
  - Monotonic decrease (improving)
  - Oscillating (unstable)
  - Flat (stable, no change)

Example (Complexity):
  v1.0: Mean = 2.8
  v1.1: Mean = 2.85 (+1.8%)
  v1.2: Mean = 2.88 (+1.0%)
  v1.3: Mean = 3.1 (+7.6%) ⚠️
  
  Trend: Increasing complexity (watch for v1.4)
  Action: Refactoring required to arrest trend
```

---

## 7. Iterative Improvement Targets

### 7.1 Version-to-Version Improvement Goals

**Formula:**
```
Minor Version (v1.x → v1.y):
  Target Improvement = +2% per metric
  
Major Version (v1.* → v2.0):
  Target Improvement = +5% per metric
  
Example:
  v1.0 Combined Score: 92%
  v1.1 Target: 92% + 2% = 94%
  v2.0 Target: 92% + 5% = 97%
```

**Tracking:**
```
| Version | Behavioral | Performance | Quality | Combined |
|---------|------------|-------------|---------|----------|
| v1.0.0  | 95%        | 94%         | 91%     | 93.3%    |
| v1.1.0  | 96%        | 95%         | 92%     | 94.3%    |
| v1.2.0  | 97%        | 96%         | 93%     | 95.3%    |
| v2.0.0  | 98%        | 97%         | 94%     | 96.3%    |
```

---

## 8. Enforcement & Automation

### 8.1 GitHub Actions Integration

**Create Release Issue:**
- Triggered on package publication
- Automatically populates DoD checklist
- Calculates combined score
- Blocks merge if score < 90%

**CI Workflow:**
```yaml
on: [push, tag]

jobs:
  benchmark:
    - Run behavioral tests
    - Run performance tests
    - Calculate code quality
    - Validate against DoD
    
  validation:
    - Pass ✅ → Create release issue
    - Fail ❌ → Block release, notify team
```

### 8.2 Release Sign-Off Process

**Required Before Publication:**
1. ✅ All DoD criteria passing
2. ✅ Combined score ≥ 90%
3. ✅ Release manager approval
4. ✅ GitHub issue created with benchmark data
5. ✅ Tag pushed to repository

---

## 9. Exception Process

**When DoD Cannot Be Met:**

1. **Identify Specific Failure**
   - Which metric failed?
   - By how much?
   - Why?

2. **Document Exception**
   - Create GitHub issue with `[EXCEPTION]` label
   - Explain business justification
   - Propose remediation timeline

3. **Approval**
   - Requires project lead + 1 technical reviewer
   - Document decision in issue

4. **Follow-up**
   - Schedule remediation in next minor version
   - Track as technical debt
   - Close only after fix verified

**Example Exception:**
```
[EXCEPTION] v1.0.5 Hotfix: Test Coverage Below 80%

Reason: Critical security patch, limited scope
Coverage: 75% (vs. 80% threshold)
Impact: Patch only affects 3 functions, all tested
Approval: @lead + @reviewer
Remediation: v1.1.0 will increase coverage to 85%+
```

---

## 10. References

- **Precision Score Details:** `/docs/BENCHMARK_ROADMAP.md`
- **Benchmark Automation:** `/docs/GITHUB_ISSUE_AUTOMATION_SYSTEM.md`
- **Benchmark Scripts:** `/scripts/`
- **Historical Tracking:** `/benchmarks/packages-registry.json`

---

**This document is the authoritative source for DoD validation. All releases must comply with these standards.**

Last Updated: 2026-08-09 | Maintained By: Release Team
