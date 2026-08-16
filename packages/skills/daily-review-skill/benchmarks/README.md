# Daily Review Skill Benchmarks

This directory contains comprehensive performance benchmarks for the daily-review-skill package.

## Overview

The benchmarks measure performance of all major operations:

- **Session Logging**: Creating and validating session records
- **Review Aggregation**: Generating daily reviews from sessions
- **Metrics Analysis**: Computing weekly and daily metrics
- **Formatting**: Converting reviews to display format
- **Multi-Account Reporting**: Aggregating data from multiple accounts

## Performance Targets

The skill maintains the following performance targets:

| Operation | Target | Category |
|-----------|--------|----------|
| Session logging | <5ms | Database query |
| Session validation | <5ms | Database query |
| Review aggregation (5 sessions) | <10ms | Review aggregation |
| Review aggregation (10 sessions) | <10ms | Review aggregation |
| Review aggregation (20 sessions) | <10ms | Review aggregation |
| Weekly metrics (5 days) | <50ms | Metrics analysis |
| Weekly metrics (7 days) | <50ms | Metrics analysis |
| Format daily review | <10ms | Formatting |
| Assess productivity | <1ms | Assessment |
| Format weekly metrics | <10ms | Formatting |
| Multi-account aggregation (2 accounts, 5 days) | <100ms | Multi-account reporting |
| Multi-account aggregation (3 accounts, 7 days) | <100ms | Multi-account reporting |

## Running Benchmarks

### Standard Benchmarks

Run the standard performance benchmarks:

```bash
npm run benchmark --workspace=@h4shed/skill-daily-review
```

This will:
- Execute 1,000-50,000 iterations per operation
- Display performance metrics in ms/op and ops/sec
- Verify all operations meet their targets
- Show a summary report with pass/fail status

### Release Benchmarks

Run comprehensive release-quality benchmarks with memory optimization:

```bash
npm run benchmark:release --workspace=@h4shed/skill-daily-review
```

This will:
- Execute 2,500-50,000 iterations per operation (higher scale)
- Include memory usage tracking
- Enable garbage collection between tests
- Allocate 4GB of heap space
- Perform stress testing with 5 accounts
- Provide detailed memory variance analysis

## Benchmark Output Example

```
✓ logSession (simple): 0.045ms/op (22222 ops/sec) (target: <5ms)
✓ logSession (with metadata): 0.062ms/op (16129 ops/sec) (target: <5ms)
✓ validateSession: 0.041ms/op (24390 ops/sec) (target: <5ms)
✓ generateDailyReview (5 sessions): 1.234ms/op (810 ops/sec) (target: <10ms)
✓ generateDailyReview (10 sessions): 2.156ms/op (464 ops/sec) (target: <10ms)
...

📋 Benchmark Summary
Total operations: 325,000
Total duration: 4,567.23ms
Average throughput: 71,154 ops/sec
Targets passed: 13/13

✅ All performance targets passed!
```

## Memory Profiling

The release benchmark includes memory profiling:

```
✓ logSession (simple): 0.045ms/op (22222 ops/sec) [0.05MB]
✓ analyzeWeekly (7 days): 18.234ms/op (55 ops/sec) [2.34MB]
```

Memory variance is the difference between heap usage before and after the operation, useful for detecting memory leaks.

## Performance Categories

### Database Queries (<5ms)
Operations that simulate database operations:
- Session logging
- Session validation

These should complete in <5ms to maintain responsive database interaction.

### Review Aggregation (<10ms)
Operations that aggregate sessions into reviews:
- Daily review generation
- Metrics calculation

These should complete in <10ms to support interactive dashboard updates.

### Metrics Analysis (<50ms)
Operations that analyze multiple days of data:
- Weekly metrics calculation
- Trend analysis

These should complete in <50ms to support report generation.

### Multi-Account Reporting (<100ms)
Operations that combine data from multiple accounts:
- Cross-account aggregation
- Combined metrics generation

These should complete in <100ms to support enterprise dashboards.

## Interpreting Results

### All Targets Passed ✅
```
✅ All performance targets passed!
process.exit(0)
```
The skill is performing at expected levels.

### Some Targets Failed ⚠️
```
⚠️ Some performance targets not met
✗ analyzeWeekly (7 days) < 50ms: 67.234ms
```

If targets fail:
1. Check system load - high CPU usage affects results
2. Profile the specific operation with detailed timing
3. Review the operation's algorithm for optimization opportunities
4. Check for memory pressure causing GC pauses

## Adding New Benchmarks

To add a new benchmark:

1. Add the operation to the appropriate section in both benchmark files
2. Define a reasonable target time based on the operation's complexity
3. Use 1,000-5,000 iterations for typical operations
4. Add the target to `targetMap` at the end of the file
5. Run both benchmarks to establish baseline
6. Document the operation in this README

Example:

```typescript
benchmark(
  "newOperation (100 items)",
  1000,
  () => {
    newOperation({ items: largeDataset });
  },
  25  // target: <25ms
);
```

## CI/CD Integration

These benchmarks should be:
1. **Run on every commit**: Use `npm run benchmark` in CI
2. **Tracked in releases**: Use `npm run benchmark:release` before tagging
3. **Compared against baselines**: Store results in a performance database
4. **Alerted on regressions**: Fail CI if targets are missed by >10%

Example GitHub Actions step:

```yaml
- name: Run performance benchmarks
  run: npm run benchmark --workspace=@h4shed/skill-daily-review
```

## Troubleshooting

### "Cannot find module" errors
```bash
npm run build --workspace=@h4shed/skill-daily-review
npm run benchmark --workspace=@h4shed/skill-daily-review
```

### "ENOENT: no such file or directory"
Ensure you're running from the monorepo root:
```bash
cd /path/to/Fused-Gaming-Skill-MCP
npm run benchmark --workspace=@h4shed/skill-daily-review
```

### High variance in results
- Close other applications
- Run benchmarks multiple times
- Use the release benchmark with memory optimization
- Check for system background processes

### Memory leak detection
If memory variance is consistently >5MB, investigate:
1. Check for growing data structures
2. Profile with `--inspect` flag
3. Review new feature code for retained references

## References

- [Node.js Performance API](https://nodejs.org/api/perf_hooks.html)
- [V8 Garbage Collection](https://v8.dev/blog/trash-talk)
- [Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
