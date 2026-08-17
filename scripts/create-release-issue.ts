#!/usr/bin/env node

/**
 * Create Release Issue on GitHub
 *
 * Automatically creates a GitHub issue for every package release with:
 * - Pre-release DoD checklist
 * - Benchmark metrics (behavioral, performance, code quality)
 * - Combined precision score calculation
 * - Statistical validation
 *
 * Usage:
 *   npm run create:release-issue -- [package-name] [version] [results.json]
 */

import { Octokit } from "@octokit/rest";
import * as fs from "fs";
import * as path from "path";

interface BenchmarkResults {
  package: string;
  version: string;
  timestamp: string;
  behavioral: {
    core_pass_rate: number;
    core_total: number;
    regression_pass_rate: number;
    regression_total: number;
    functionality_pass_rate: number;
    functionality_total: number;
    error_pass_rate: number;
    error_total: number;
    behavioral_score: number;
  };
  performance: {
    latency_ms_mean: number;
    latency_ms_std_dev: number;
    latency_sample_count?: number;
    throughput_ops_sec_mean: number;
    throughput_ops_sec_std_dev: number;
    throughput_sample_count?: number;
    memory_mb_peak: number;
    performance_score: number;
  };
  code_quality: {
    complexity_mean: number;
    complexity_max: number;
    duplication_percent: number;
    coverage_percent: number;
    maintainability_index: number;
    quality_score: number;
  };
  combined_score: number;
  // "not_measured": the package's benchmark script did not emit a structured DoD
  // report (e.g. it's still a placeholder). This is informational, not a failing
  // score, and must not be treated as if a 0% result was actually measured.
  status: "pass" | "conditional" | "fail" | "not_measured";
}

async function createReleaseIssue() {
  // Parse command line arguments
  const packageName = process.argv[2];
  const version = process.argv[3];
  const resultsFile = process.argv[4];

  if (!packageName || !version || !resultsFile) {
    console.error("Usage: npm run create:release-issue -- [package] [version] [results.json]");
    process.exit(1);
  }

  // Load benchmark results
  if (!fs.existsSync(resultsFile)) {
    console.error(`Results file not found: ${resultsFile}`);
    process.exit(1);
  }

  const results: BenchmarkResults = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));

  // Initialize Octokit
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN environment variable not set");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  // Get release manager from environment
  const releaseManager = process.env.GITHUB_ASSIGNEE || "unknown";

  // Check for existing issue metadata to avoid duplicates on workflow rerun
  const metadataPath = path.join(
    process.cwd(),
    "benchmarks/release-issues",
    `${packageName}-v${version}-issue.json`
  );

  let existingIssueNumber: number | null = null;

  // First check local metadata (fast path)
  if (fs.existsSync(metadataPath)) {
    try {
      const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      existingIssueNumber = existingMetadata.issue_number;
      console.log(`ℹ️  Found existing issue metadata locally: #${existingIssueNumber}`);
    } catch (e) {
      console.warn(`⚠️  Could not parse existing metadata: ${e}`);
    }
  }

  // If no local metadata (e.g., on tag rerun), search GitHub for existing issues
  if (!existingIssueNumber) {
    try {
      const searchQuery = `repo:${process.env.GITHUB_REPOSITORY_OWNER || "fused-gaming"}/${process.env.GITHUB_REPOSITORY_NAME || "fused-gaming-skill-mcp"} is:issue "${packageName}" "v${version}" in:title`;
      const searchResults = await octokit.search.issuesAndPullRequests({ q: searchQuery });

      if (searchResults.data.items.length > 0) {
        existingIssueNumber = searchResults.data.items[0].number;
        console.log(`ℹ️  Found existing issue via GitHub search: #${existingIssueNumber}`);
      }
    } catch (e) {
      console.warn(`⚠️  GitHub search failed (will create new issue): ${e}`);
    }
  }

  // Create issue body from template
  const issueBody = generateIssueBody(results, releaseManager);

  try {
    let issueNumber: number;
    let issueUrl: string;

    if (existingIssueNumber) {
      // Reuse existing issue - update it with new benchmark results
      console.log(`📝 Updating existing issue #${existingIssueNumber}...`);
      await octokit.issues.update({
        owner: process.env.GITHUB_REPOSITORY_OWNER || "fused-gaming",
        repo: process.env.GITHUB_REPOSITORY_NAME || "fused-gaming-skill-mcp",
        issue_number: existingIssueNumber,
        body: issueBody,
      });

      issueNumber = existingIssueNumber;
      issueUrl = `https://github.com/${process.env.GITHUB_REPOSITORY_OWNER || "fused-gaming"}/${process.env.GITHUB_REPOSITORY_NAME || "fused-gaming-skill-mcp"}/issues/${existingIssueNumber}`;
      console.log(`✅ Release issue updated: #${issueNumber}`);
      console.log(`   URL: ${issueUrl}`);
    } else {
      // Create new issue
      const response = await octokit.issues.create({
        owner: process.env.GITHUB_REPOSITORY_OWNER || "fused-gaming",
        repo: process.env.GITHUB_REPOSITORY_NAME || "fused-gaming-skill-mcp",
        title: `📦 Package Release & Quality Checkpoint: ${packageName} v${version}`,
        body: issueBody,
        labels: ["release", "benchmarks", "quality-assurance"],
        assignees: process.env.GITHUB_ASSIGNEE ? [process.env.GITHUB_ASSIGNEE] : [],
      });

      issueNumber = response.data.number;
      issueUrl = response.data.html_url;
      console.log(`✅ Release issue created: #${issueNumber}`);
      console.log(`   URL: ${issueUrl}`);
    }

    // Save issue metadata
    const metadata = {
      issue_number: issueNumber,
      issue_url: issueUrl,
      package: packageName,
      version: version,
      timestamp: new Date().toISOString(),
      benchmark_file: resultsFile,
    };

    fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`   Metadata saved: ${metadataPath}`);
  } catch (error) {
    console.error("Failed to create/update GitHub issue:", error);
    process.exit(1);
  }
}

function generateIssueBody(results: BenchmarkResults, releaseManager: string = "unknown"): string {
  const {
    behavioral,
    performance,
    code_quality,
    combined_score,
    status,
    timestamp,
  } = results;

  // Use results timestamp (from benchmark run or tag metadata) instead of current date
  // to preserve original release date across reruns
  const releaseDate = timestamp ? timestamp.split("T")[0] : new Date().toISOString().split("T")[0];
  const dodThreshold = 90;

  // A "not_measured" result means the package's benchmark script never produced a
  // real DoD report (e.g. it's still a placeholder `echo` script). Report this as
  // its own state rather than running it through the pass/fail checklist below,
  // which would otherwise render a fabricated 0% as if it were a real, failing
  // measurement.
  if (status === "not_measured") {
    return `## 📋 Release Information

**Package:** \`${results.package}\`
**Version:** \`v${results.version}\`
**Release Date:** \`${releaseDate}\`
**Release Manager:** \`@${releaseManager}\`

---

## ⚠️ Benchmarks Not Measured

This package's \`npm run benchmark\` script did not emit a structured Definition of
Done report (behavioral / performance / code quality). No score was calculated, and
the fields below are placeholders — **not** a measured 0% failure.

To get real DoD scoring and regression detection for this package, wire up
\`@h4shed/benchmark-utils\` (\`BehavioralTester\`, \`PerformanceBenchmarker\`,
\`DoDScorer\`) in its benchmark script and have it print the resulting report as
JSON to stdout. See \`packages/skills/svg-generator/src/benchmark.ts\` for a
worked example, and \`/packages/benchmark-utils/README.md\` for the API.

**Release Decision:** This release was **not gated** on benchmark results. Manual
review is required before considering it approved.

---

## 📌 Implementation Details

**Checkpoint:** \`${results.package} v${results.version}\`

**Test Execution:** Automatic benchmark run on package publication (no structured report emitted)

---

## 📚 Related Documentation

- Benchmark Results: \`/benchmarks/packages/${results.package}/v${results.version}/\`
- Definition of Done: \`/docs/DEFINITION_OF_DONE.md\`
- Project Roadmap: \`/docs/ROADMAP.md\`

---

**This issue tracks the quality and benchmark metrics for this release. Close only after successful publication and post-release validation.**`;
  }

  // Recalculate behavioral score from raw components using canonical formula
  // behavioral_score = (CORE × 0.50) + (REGRESSION × 0.30) + (FUNCTIONALITY × 0.12) + (ERROR × 0.08)
  const calculatedBehavioral =
    (behavioral.core_pass_rate * 0.50) +
    (behavioral.regression_pass_rate * 0.30) +
    (behavioral.functionality_pass_rate * 0.12) +
    (behavioral.error_pass_rate * 0.08);

  // Always calculate combined score from components, never trust supplied value
  // Combined score = (Behavioral × 0.40) + (Performance × 0.35) + (Code Quality × 0.25)
  const calculatedCombined =
    (calculatedBehavioral * 0.40) +
    (performance.performance_score * 0.35) +
    (code_quality.quality_score * 0.25);

  // Validate that supplied score matches calculated (no tolerance - gate must be exact)
  const scoreDeviation = Math.abs(combined_score - calculatedCombined);
  const isScoreValid = scoreDeviation <= 0.01; // Only allow floating point precision differences

  if (!isScoreValid) {
    console.warn(
      `⚠️ Combined score mismatch: provided ${combined_score.toFixed(2)}% ` +
      `but formula calculates ${calculatedCombined.toFixed(2)}%. ` +
      `Using calculated value for gate enforcement.`
    );
  }

  // Always use calculated value for gate enforcement - no tolerance
  const validatedCombinedScore = calculatedCombined;

  // Enforce mandatory gates per Definition of Done
  const coreCI = calculateCI(behavioral.core_pass_rate, behavioral.core_total);
  const corePassesCI = !isNaN(coreCI[0]) && coreCI[0] >= 93;

  // Require minimum test sample size for statistical validity
  const hasMinimumCoreSamples = behavioral.core_total >= 30;

  // Require regression tests to exist (regression_total > 0) for approval
  const hasRegressionTests = behavioral.regression_total > 0;

  // Enforce release-blocking code quality metrics
  const coverageBlocks = code_quality.coverage_percent < 70;
  const complexityBlocks = code_quality.complexity_max > 8.0;
  const duplicationBlocks = code_quality.duplication_percent >= 15;
  // Maintainability 65-69 is conditional/warning; only <=65 blocks release
  const maintainabilityBlocks = code_quality.maintainability_index <= 65;

  // Enforce minimum performance and code quality thresholds
  const performanceThresholdMet = performance.performance_score >= 85;
  const codeQualityThresholdMet = code_quality.quality_score >= 80;

  const mandatoryGates =
    behavioral.core_pass_rate >= 95 && corePassesCI && hasMinimumCoreSamples &&
    behavioral.regression_pass_rate === 100 && hasRegressionTests &&
    calculatedBehavioral >= 90 &&
    performance.performance_score >= 85 &&
    codeQualityThresholdMet &&
    validatedCombinedScore >= dodThreshold &&
    !coverageBlocks && !complexityBlocks && !duplicationBlocks && !maintainabilityBlocks &&
    status === "pass";

  const isApproved = mandatoryGates;

  return `## 📋 Release Information

**Package:** \`${results.package}\`
**Version:** \`v${results.version}\`
**Release Date:** \`${releaseDate}\`
**Release Manager:** \`@${releaseManager}\`

---

## ✅ Pre-Release Definition of Done Checklist

### Behavioral Testing (Target: ≥95% CORE, 100% REGRESSION)

- [${corePassesCI && behavioral.core_pass_rate >= 95 && hasMinimumCoreSamples ? "x" : " "}] **CORE Tests Pass** (≥95% pass rate, ≥93% CI lower bound, min 30 samples)
  - Test Count: \`${behavioral.core_total}\` (Minimum Required: 30)
  - Pass Rate: \`${behavioral.core_pass_rate.toFixed(2)}%\`
  - Confidence Interval (95% CI): \`${behavioral.core_total > 0 ? `[${coreCI[0].toFixed(2)}%, ${coreCI[1].toFixed(2)}%]` : "N/A"}\`
  - Minimum Samples Met: ${hasMinimumCoreSamples ? "✅" : "❌"}
  - Status: ${corePassesCI && behavioral.core_pass_rate >= 95 && hasMinimumCoreSamples ? "✅" : "❌"}

- [${behavioral.regression_pass_rate === 100 && behavioral.regression_total > 0 ? "x" : " "}] **REGRESSION Tests Pass** (100% mandatory, must have tests)
  - Prior Checkpoint Tests: \`${behavioral.regression_total}\`
  - Pass Rate: \`${behavioral.regression_pass_rate.toFixed(2)}%\`
  - Code Erosion Detected: ${behavioral.regression_total > 0 && behavioral.regression_pass_rate === 100 ? "No ✅" : behavioral.regression_total === 0 ? "No tests ❌" : "Yes ⚠️"}
  - Status: ${behavioral.regression_total > 0 && behavioral.regression_pass_rate === 100 ? "✅" : behavioral.regression_total === 0 ? "❌ (no tests)" : "❌"}

- [${behavioral.functionality_pass_rate >= 80 && behavioral.functionality_total > 0 ? "x" : " "}] **FUNCTIONALITY Tests** (≥80% threshold)
  - Test Count: \`${behavioral.functionality_total}\`
  - Pass Rate: \`${behavioral.functionality_pass_rate.toFixed(2)}%\`
  - Confidence Interval (95% CI): \`${behavioral.functionality_total > 0 ? `[${calculateCI(behavioral.functionality_pass_rate, behavioral.functionality_total)[0].toFixed(2)}%, ${calculateCI(behavioral.functionality_pass_rate, behavioral.functionality_total)[1].toFixed(2)}%]` : "N/A"}\`
  - Status: ${behavioral.functionality_pass_rate >= 80 && behavioral.functionality_total > 0 && calculateCI(behavioral.functionality_pass_rate, behavioral.functionality_total)[0] >= 75 ? "✅" : "⚠️"}

- [${behavioral.error_pass_rate >= 90 && behavioral.error_total > 0 ? "x" : " "}] **ERROR Handling Tests** (≥90% threshold)
  - Test Count: \`${behavioral.error_total}\`
  - Pass Rate: \`${behavioral.error_pass_rate.toFixed(2)}%\`
  - Confidence Interval (95% CI): \`${behavioral.error_total > 0 ? `[${calculateCI(behavioral.error_pass_rate, behavioral.error_total)[0].toFixed(2)}%, ${calculateCI(behavioral.error_pass_rate, behavioral.error_total)[1].toFixed(2)}%]` : "N/A"}\`
  - Status: ${behavioral.error_pass_rate >= 90 && behavioral.error_total > 0 && calculateCI(behavioral.error_pass_rate, behavioral.error_total)[0] >= 85 ? "✅" : "⚠️"}

**Behavioral Score:** \`${behavioral.behavioral_score.toFixed(2)}%\`
**Behavioral Status:** ${behavioral.behavioral_score >= 90 ? "✅ Approved" : behavioral.behavioral_score >= 80 ? "⚠️ Review Required" : "❌ Blocked"}

---

### Performance Testing (Target: ±5% variance tolerance)

- [${performance.latency_ms_mean > 0 && (performance.latency_sample_count || 0) >= 30 && performance.latency_ms_std_dev <= performance.latency_ms_mean * 0.2 ? "x" : " "}] **Latency Metrics**
  - Mean: \`${performance.latency_ms_mean.toFixed(2)}ms\`
  - Std Dev: \`${performance.latency_ms_std_dev.toFixed(2)}ms\`
  - Sample Count: \`${performance.latency_sample_count || 0}\`
  - Coefficient of Variation: \`${performance.latency_ms_mean > 0 ? ((performance.latency_ms_std_dev / performance.latency_ms_mean) * 100).toFixed(2) : "N/A"}%\`
  - Status: ${performance.latency_ms_mean > 0 && (performance.latency_sample_count || 0) >= 30 ? calculatePerformanceStatus(performance.latency_ms_std_dev / performance.latency_ms_mean) : "⚠️"}

- [${performance.throughput_ops_sec_mean > 0 && (performance.throughput_sample_count || 0) >= 30 && performance.throughput_ops_sec_std_dev <= performance.throughput_ops_sec_mean * 0.2 ? "x" : " "}] **Throughput Metrics**
  - Mean: \`${performance.throughput_ops_sec_mean.toFixed(0)} ops/sec\`
  - Std Dev: \`${performance.throughput_ops_sec_std_dev.toFixed(0)} ops/sec\`
  - Sample Count: \`${performance.throughput_sample_count || 0}\`
  - Coefficient of Variation: \`${performance.throughput_ops_sec_mean > 0 ? ((performance.throughput_ops_sec_std_dev / performance.throughput_ops_sec_mean) * 100).toFixed(2) : "N/A"}%\`
  - Status: ${performance.throughput_ops_sec_mean > 0 && (performance.throughput_sample_count || 0) >= 30 ? calculatePerformanceStatus(performance.throughput_ops_sec_std_dev / performance.throughput_ops_sec_mean) : "⚠️"}

- [${performance.memory_mb_peak > 0 ? "x" : " "}] **Memory Usage**
  - Peak: \`${performance.memory_mb_peak.toFixed(1)}MB\`
  - Status: ${performance.memory_mb_peak > 0 ? "✅" : "⚠️ Not measured"}

**Performance Score:** \`${performance.performance_score.toFixed(2)}%\`
**Performance Threshold (≥85%):** ${performanceThresholdMet ? "✅ Met" : "❌ Not Met"}
**Performance Targets Met:** ${performance.performance_score >= 90 ? "✅ Yes" : performance.performance_score >= 85 ? "✅ Threshold" : performance.performance_score >= 80 ? "⚠️ Partial" : "❌ No"}

---

### Code Quality Metrics (Target: Complexity ≤3.0, Duplication <5%, Coverage ≥80%)

- [${code_quality.complexity_mean <= 3.0 && code_quality.complexity_max <= 8.0 ? "x" : " "}] **Cyclomatic Complexity**
  - Mean: \`${code_quality.complexity_mean.toFixed(2)}\`
  - Max: \`${code_quality.complexity_max.toFixed(2)}\`
  - Threshold: Mean ≤3.0, Max ≤8.0
  - Status: ${code_quality.complexity_mean <= 3.0 && code_quality.complexity_max <= 8.0 ? "✅" : code_quality.complexity_max > 8.0 ? "❌" : "⚠️"}

- [${code_quality.duplication_percent < 15 ? "x" : " "}] **Code Duplication**
  - Percentage: \`${code_quality.duplication_percent.toFixed(2)}%\`
  - Threshold: Acceptable <5%, Marginal 5-15%, Blocking ≥15%
  - Status: ${code_quality.duplication_percent < 5 ? "✅" : code_quality.duplication_percent < 15 ? "⚠️" : "❌"}

- [${code_quality.coverage_percent >= 80 ? "x" : " "}] **Test Coverage**
  - Percentage: \`${code_quality.coverage_percent.toFixed(2)}%\`
  - Threshold: ≥80%
  - Status: ${code_quality.coverage_percent >= 80 ? "✅" : "❌"}

- [${code_quality.maintainability_index > 70 ? "x" : " "}] **Maintainability Index**
  - Score: \`${code_quality.maintainability_index.toFixed(2)}/100\`
  - Threshold: >70 (Approved), 65-70 (Conditional), ≤65 (Blocked)
  - Status: ${code_quality.maintainability_index > 70 ? "✅" : code_quality.maintainability_index >= 65 ? "⚠️" : "❌"}

**Code Quality Score:** \`${code_quality.quality_score.toFixed(2)}%\`
**Code Quality Status:** ${code_quality.quality_score >= 90 ? "✅ Approved" : code_quality.quality_score >= 80 ? "⚠️ Review Required" : "❌ Blocked"}

---

## 📊 Combined Precision Score

**Formula:** \`(Behavioral × 0.40) + (Performance × 0.35) + (Code Quality × 0.25)\`

| Category | Weight | Score | Contribution |
|----------|--------|-------|--------------|
| Behavioral | 40% | \`${behavioral.behavioral_score.toFixed(2)}%\` | \`${(behavioral.behavioral_score * 0.40).toFixed(2)}\` |
| Performance | 35% | \`${performance.performance_score.toFixed(2)}%\` | \`${(performance.performance_score * 0.35).toFixed(2)}\` |
| Code Quality | 25% | \`${code_quality.quality_score.toFixed(2)}%\` | \`${(code_quality.quality_score * 0.25).toFixed(2)}\` |
| **COMBINED** | **100%** | **\`${validatedCombinedScore.toFixed(2)}%\`** | - |

**DoD Threshold:** ≥90%
**Release Approved:** ${isApproved ? "✅ Yes" : !isApproved && (status === "conditional" && behavioral.core_total === 0 && behavioral.regression_total === 0 && code_quality.coverage_percent === 0) ? "⚠️ Conditional (Benchmarks Not Collected)" : "❌ Blocked (Gate Failures)"}
${!isScoreValid ? `\n⚠️ **Note**: Score mismatch detected. Supplied: ${combined_score.toFixed(2)}%, Calculated: ${validatedCombinedScore.toFixed(2)}%. Using calculated value for enforcement.` : ""}

---

## 🎯 Release Decision

- [${isApproved ? "x" : " "}] **APPROVE** — All metrics meet DoD thresholds
- [${!isApproved && status === "conditional" && behavioral.core_total === 0 && behavioral.regression_total === 0 ? "x" : " "}] **CONDITIONAL** — Benchmark data not collected (collect and retry)
- [${!isApproved && !(status === "conditional" && behavioral.core_total === 0) ? "x" : " "}] **REJECT** — Critical gate failures detected

**Sign-Off:** \`@${releaseManager}\`
**Approval Date:** \`${releaseDate}\`

---

## 📌 Implementation Details

**Checkpoint:** \`${results.package} v${results.version}\`

**Test Execution:** Automatic benchmark run on package publication

---

## 📚 Related Documentation

- Benchmark Results: \`/benchmarks/packages/${results.package}/v${results.version}/\`
- Definition of Done: \`/docs/DEFINITION_OF_DONE.md\`
- Project Roadmap: \`/docs/ROADMAP.md\`

---

**This issue tracks the quality and benchmark metrics for this release. Close only after successful publication and post-release validation.**`;
}

function calculateCI(passRate: number, total: number): [number, number] {
  if (total === 0) {
    return [NaN, NaN];
  }
  const p = passRate / 100;
  const se = Math.sqrt((p * (1 - p)) / total);
  const margin = 1.96 * se * 100;
  return [Math.max(0, passRate - margin), Math.min(100, passRate + margin)];
}

function calculatePerformanceStatus(cv: number): string {
  const cvPercent = cv * 100;
  if (cvPercent < 10) return "✅";
  if (cvPercent < 20) return "✅";
  if (cvPercent < 30) return "⚠️";
  return "❌";
}

// Run the script
createReleaseIssue().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
