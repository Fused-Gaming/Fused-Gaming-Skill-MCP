# Daily Review Skill - Performance Benchmarking Guide

## Overview

This document outlines performance benchmarking procedures for the Daily Review Skill, which aggregates session data, generates reviews, and analyzes productivity metrics.

## Benchmark Targets (v1.0.23)

| Metric | Target | Unit |
|--------|--------|------|
| Session logging | < 50ms | Per session |
| Daily review generation | < 500ms | Per day (10+ sessions) |
| Weekly analysis | < 1000ms | Per week (50+ sessions) |
| Memory usage | < 50MB | Peak usage |
| Session data throughput | > 1000 | Sessions/sec |

## Running Benchmarks

```bash
# Install dependencies
npm ci

# Run all benchmarks
npm run benchmark

# Run with profiling
npm run benchmark:profile

# Run specific benchmark
npm run benchmark -- --only daily-review
```

## Metrics Collected

### Session Logging Performance
- Input parsing time
- Metadata enrichment time
- Storage operation time
- Total latency (p50, p95, p99)

### Daily Review Generation
- Query time (fetch sessions)
- Analysis time (calculate metrics)
- Formatting time (render review)
- Total generation time

### Weekly Analysis
- Data aggregation time
- Trend calculation time
- Report formatting time
- Peak memory usage

## Benchmark Results

Results are stored in `BENCHMARK_RESULTS.md` and updated after each run.

## Implementation Checklist

- [ ] Create `benchmark.ts` with performance tests
- [ ] Implement metric collection utilities
- [ ] Document baseline performance
- [ ] Add CI/CD benchmark collection
- [ ] Set performance regression alerts
