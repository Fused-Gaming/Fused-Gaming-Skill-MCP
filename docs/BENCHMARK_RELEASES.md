# Benchmark Releases & Quality Tracking

This document explains how benchmark results are tracked and reported for package releases in the Fused Gaming MCP project.

## Overview

Every skill, tool, package, and plugin in this project has automated benchmark tracking infrastructure. When packages are released or versions are bumped, benchmark metrics are collected and reported via GitHub issues that serve as quality checkpoints.

### Key Components

1. **Baseline Benchmark Infrastructure** — All 39 packages have baseline benchmark data stored
2. **Release Workflow** — GitHub Actions workflow automatically creates issues on version bumps
3. **GitHub Issues** — Each release gets a dedicated issue tracking behavioral, performance, and code quality metrics
4. **Benchmark Registry** — Central tracking of all benchmark results and version history

## Benchmark Metrics

Each release issue tracks three categories of metrics:

### 1. Behavioral Testing (40% weight)

Tests that verify the package functions correctly:

- **CORE Tests** (50% of behavioral score)
  - Target: ≥95% pass rate
  - Minimum: 30 test samples
  - 95% Confidence Interval must have lower bound ≥93%

- **REGRESSION Tests** (30% of behavioral score)
  - Target: 100% pass rate
  - Requirement: At least 1 regression test must exist
  - Detects code erosion from previous releases

- **FUNCTIONALITY Tests** (12% of behavioral score)
  - Target: ≥80% pass rate
  - Tests core feature implementations

- **ERROR Handling Tests** (8% of behavioral score)
  - Target: ≥90% pass rate
  - Tests error conditions and edge cases

**Behavioral Score Formula:**
```
(CORE × 0.50) + (REGRESSION × 0.30) + (FUNCTIONALITY × 0.12) + (ERROR × 0.08)
```

### 2. Performance Testing (35% weight)

Latency, throughput, and memory usage metrics:

- **Latency Metrics**
  - Mean latency in milliseconds
  - Standard deviation
  - Coefficient of Variation (target: <10%)

- **Throughput Metrics**
  - Operations per second
  - Standard deviation
  - Coefficient of Variation (target: <10%)

- **Memory Usage**
  - Peak memory in MB
  - Baseline comparison for regression detection

**Performance Score:** Based on coefficient of variation
- <10%: 100 points
- 10-20%: 80 points
- >20%: 60 points

### 3. Code Quality (25% weight)

Static analysis and maintainability metrics:

- **Cyclomatic Complexity**
  - Target: Mean ≤3.0, Max ≤8.0
  - Blocking: Max >8.0

- **Code Duplication**
  - Target: <5%
  - Warning: 5-15%
  - Blocking: ≥15%

- **Test Coverage**
  - Target: ≥80%
  - Blocking: <70%

- **Maintainability Index**
  - Target: >70
  - Warning: 65-69
  - Blocking: ≤65

**Code Quality Score:** Average of the four metrics above

## Combined Precision Score

The **Combined Precision Score** is the unified metric that gates releases:

```
(Behavioral × 0.40) + (Performance × 0.35) + (Code Quality × 0.25)
```

**Mandatory Gates:**
- Combined Score ≥90% (Definition of Done threshold)
- Behavioral Score ≥90%
- Performance Score ≥85%
- Code Quality Score ≥80%
- All blocking gates must pass (no tolerance)

**Release Decision:**
- ✅ **APPROVE** — All mandatory gates pass
- ⚠️ **CONDITIONAL** — Non-blocking metrics need review
- ❌ **REJECT** — One or more mandatory gates failed

## Creating Release Issues

Release issues are created automatically by the `.github/workflows/create-release-issue.yml` workflow when:

1. A git tag matching `v*` is pushed (e.g., `v1.4.0`)
2. Package-specific tags are pushed (e.g., `@h4shed/skill-creator@1.0.25`)

### Automated Issue Creation Flow

1. **Benchmark Execution** — `npm run benchmark --workspace={package}` runs
2. **Result Parsing** — Output is parsed to extract behavioral, performance, and code quality metrics
3. **Score Calculation** — Combined Precision Score is calculated and validated
4. **Issue Creation** — GitHub issue is created using the `.github/ISSUE_TEMPLATE/package-release.md` template
5. **Metadata Storage** — Issue metadata is saved to `benchmarks/release-issues/`
6. **Registry Update** — `benchmarks/packages-registry.json` is updated with version entry

### Manual Issue Creation

To manually create release issues for testing:

```bash
# Create issues for all packages (requires GITHUB_TOKEN)
export GITHUB_TOKEN=<your-github-token>
npm run create:baseline-issues

# Create issue for specific package
ts-node scripts/create-release-issue.ts @h4shed/skill-creator 1.0.25 benchmarks/packages/@h4shed/skill-creator/v1.0.25/results.json
```

## Benchmark Registry

The central benchmark registry at `benchmarks/packages-registry.json` tracks all versions and their metrics:

```json
{
  "@h4shed/skill-creator": {
    "latest": "1.0.25",
    "versions": {
      "1.0.24": {
        "timestamp": "2026-08-16T...",
        "combined_score": 95.2,
        "behavioral": 96,
        "performance": 94,
        "code_quality": 95,
        "status": "pass"
      },
      "1.0.25": {
        "timestamp": "2026-08-17T...",
        "combined_score": 96.1,
        "behavioral": 97,
        "performance": 95,
        "code_quality": 96,
        "status": "pass"
      }
    }
  }
}
```

## Performance Regression Detection

The system detects performance regressions by comparing metrics to the previous version:

- **Latency Regression**: ±5% tolerance (warning if exceeded)
- **Throughput Regression**: ±5% tolerance (warning if exceeded)
- **Memory Regression**: ±5% tolerance (warning if exceeded)

Regressions are reported in the GitHub issue but are not release blockers unless they exceed 10%.

## Code Quality Regression Detection

- **Complexity Growth**: <10% OK, 10-15% warning, >15% review required
- **Duplication Increase**: <2% OK, 2-5% warning, >5% review required
- **Coverage Decline**: Any decline is a warning

## Baseline Benchmarks

All 39 packages have baseline benchmarks created by `npm run create:baseline-issues`:

- **Location**: `benchmarks/packages/{package}/v{version}/baseline-results.json`
- **Metadata**: `benchmarks/release-issues/@{scope}/{package}-v{version}-issue.json`
- **Status**: Ready for Phase 2 workflow verification

Baseline benchmarks establish the initial quality checkpoint for each package version.

## Interpreting Release Issues

When you see a release issue, check:

1. **Combined Precision Score** — Is it ≥90%?
2. **Mandatory Gates** — Are all blocking conditions met?
3. **Regression Analysis** — Are there unexpected changes from the previous version?
4. **Individual Metrics** — Do behavioral, performance, and code quality scores look reasonable?

### Example: Passing Release

```
Behavioral Score: 97%
Performance Score: 95%
Code Quality Score: 96%
Combined Score: 96.1% ✅

All mandatory gates pass → APPROVE ✅
```

### Example: Conditional Release

```
Behavioral Score: 88% ⚠️ (below 90% threshold)
Performance Score: 92%
Code Quality Score: 89%
Combined Score: 89.5% ⚠️ (below 90% threshold)

One or more gates below threshold → CONDITIONAL ⚠️
Review required before merge.
```

### Example: Blocked Release

```
Behavioral Score: 92%
Performance Score: 78% ❌ (below 85% threshold)
Code Quality Score: 72% ❌ (below 80% threshold)
Combined Score: 81.3% ❌ (below 90% threshold)

Multiple gates failed → REJECT ❌
Must fix before retrying release.
```

## Running Benchmarks Locally

To run benchmarks for a specific package:

```bash
# Run benchmark for a single package
npm run benchmark --workspace=@h4shed/skill-creator

# Run benchmarks for all packages
npm run benchmark --workspaces

# Run release-quality benchmarks (higher iterations, memory profiling)
npm run benchmark:release --workspace=@h4shed/skill-creator
```

## Benchmark Output Formats

### Template Benchmarks (Simple packages)

Packages without detailed benchmarks use the template format:

```bash
npm run benchmark
# Output: Benchmarks: OK
```

This indicates the package supports benchmarking but may not have detailed metrics.

### Comprehensive Benchmarks (Complex packages)

Packages with detailed benchmark suites output:

```
✓ Daily review session logging (5.2ms avg)
✓ Review aggregation - 5 sessions (8.1ms avg)
✓ Metrics analysis (6.3ms avg)
...

Summary:
  Total Tests: 13
  Passed: 13
  Failed: 0
  Average Duration: 6.8ms
```

## Related Documentation

- **Definition of Done**: `/docs/DEFINITION_OF_DONE.md` — Quality requirements for all packages
- **Release Notes**: `/docs/releases/` — Version-specific release information
- **Contributing Guide**: `/CONTRIBUTING.md` — How to run tests and benchmarks locally
- **CI/CD Workflows**: `/.github/workflows/` — Automated release and testing pipelines

## Troubleshooting

### Issue: Benchmark timeout in CI

**Cause**: Benchmark iterations taking too long
**Solution**: Reduce iteration count in benchmark configuration or optimize slow operations

### Issue: Inconsistent benchmark results

**Cause**: System load variation, garbage collection, or network issues
**Solution**: Increase iteration count (≥30 samples) to improve statistical validity

### Issue: Release issue not created

**Cause**: GitHub token missing or benchmark parsing failed
**Solution**: Check GitHub Actions logs and ensure GITHUB_TOKEN is configured

## Best Practices

1. **Run Benchmarks Locally Before Commit**
   ```bash
   npm run benchmark --workspace=<your-package>
   ```

2. **Monitor Performance Trends**
   - Review historical metrics in `benchmarks/packages-registry.json`
   - Look for patterns in regression detection reports

3. **Address Warnings Early**
   - Don't wait for release blocks; fix conditional issues before release

4. **Document Performance Changes**
   - If scores change significantly, document why in PR description

5. **Keep Baseline Updated**
   - Run `npm run create:baseline-issues` when adding new packages

## See Also

- GitHub Actions: `.github/workflows/create-release-issue.yml`
- Release Script: `scripts/create-release-issue.ts`
- Baseline Script: `scripts/create-baseline-benchmark-issues.ts`
- Benchmark Utils: `packages/benchmark-utils/src/performance-benchmarker.ts`
