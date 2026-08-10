# GitHub Issue Automation System

**Status:** Active  
**Last Updated:** 2026-08-10

## Overview

The GitHub Issue Automation System automatically creates and updates tracking issues for every package release in the Fused Gaming ecosystem. Each issue captures benchmark results, Definition of Done compliance, and release metrics.

## Workflow Triggers

Release issues are created automatically via GitHub Actions workflows:

### Trigger Points

1. **Push Event**: Direct tag push to repository
   - Format: `v*` (root releases) or `skill-*@*` (skill releases)
   - Workflow: `.github/workflows/create-release-issue.yml`
   - Status: `staged` (unverified publication)

2. **Workflow Run Event**: Completion of `Publish to npm` workflow
   - Triggered: After automated publish workflow completes
   - Verification: Checks workflow conclusion (`success`/`failed`)
   - Status: `published` (verified) or `failed` (on workflow failure)

## Issue Structure

### Release Tracking Issues

Each issue contains:

**1. Release Metadata**
```
Package: @h4shed/mcp-core
Version: v1.0.24
Release Date: 2026-08-10
Release Type: root (or skill)
```

**2. Benchmark Results**
- Behavioral test results (CORE, REGRESSION, FUNCTIONALITY, ERROR)
- Performance metrics (latency, throughput, memory)
- Code quality scores (complexity, coverage, duplication, maintainability)
- Combined precision score

**3. Definition of Done Checklist**
- Mandatory gates status
- Optional metrics review
- Release approval recommendation

**4. Registry Tracking**
- Linked to `benchmarks/packages-registry.json`
- Tracks publication status and dates
- Records issue number for cross-reference

## Automation Components

### Core Script: `scripts/create-release-issue.ts`

Responsible for:
- Parsing release metadata from tag
- Reading benchmark results from JSON
- Calculating precision scores
- Validating Definition of Done criteria
- Creating/updating GitHub issues
- Searching for existing issues to prevent duplicates

### Key Functions

```typescript
// Extract tag information
extractPackageInfo(tag: string): {
  package: string;
  version: string;
  releaseType: "root" | "skill";
}

// Calculate combined precision score
calculateCombinedScore(results: BenchmarkResults): {
  score: number;
  status: "pass" | "conditional" | "fail";
}

// Format release tracking issue
generateIssueBody(results: BenchmarkResults): string

// Search for existing issues
findExistingIssue(package: string, version: string): Issue | null

// Create or update GitHub issue
createOrUpdateIssue(owner: string, repo: string, body: string): Issue
```

## Workflow Execution

### Step 1: Extract Package Information
```bash
TAG="v1.0.24" → PACKAGE="@h4shed/mcp-core", VERSION="1.0.24", RELEASE_TYPE="root"
```

### Step 2: Run Benchmarks
- Execute `npm run benchmark --workspace=$PACKAGE`
- Collect latency, throughput, and quality metrics
- Generate results JSON with timestamp

### Step 3: Validate Results
- Parse benchmark output
- Calculate means and standard deviations
- Validate JSON structure
- Check for parser errors

### Step 4: Create Tracking Issue
- Generate formatted issue body with metrics
- Calculate precision scores
- Validate Definition of Done
- Create GitHub issue with results

### Step 5: Update Registry
- Update `benchmarks/packages-registry.json`
- Record version information
- Track publication status
- Upsert on reruns (prevent duplicates)

## Issue Lifecycle

1. **Created**: Issue generated when tag is pushed or publish completes
2. **Updated**: On rerun, updates existing issue with new metrics
3. **Commented**: Manual reviews can add comments
4. **Linked**: Issue is referenced in PR and release notes

## Registry Management

Release registry (`benchmarks/packages-registry.json`) tracks:

```json
{
  "packages": {
    "@h4shed/mcp-core": {
      "latest_version": "1.0.24",
      "updated": "2026-08-10T...",
      "versions": [...]
    }
  },
  "versions": [
    {
      "id": "@h4shed/mcp-core-1.0.24",
      "status": "published",
      "release_issue_number": 230,
      "release_issue_url": "https://github.com/.../issues/230",
      "benchmark_results": {...}
    }
  ]
}
```

## Error Handling

**Parser Failures**: Invalid JSON or missing metrics → `status: "fail"`

**Workflow Failures**: Publish workflow completion with `conclusion != success` → `status: "failed"`

**Duplicate Prevention**: Registry upsert logic prevents duplicate entries on reruns

## Related Documentation

- **Workflow Definition**: `.github/workflows/create-release-issue.yml`
- **Publish Workflow**: `.github/workflows/publish.yml`
- **Precision Scoring**: See `BENCHMARK_ROADMAP.md`
- **Validation Standards**: See `DEFINITION_OF_DONE.md`
- **Release Registry**: `/benchmarks/packages-registry.json`
