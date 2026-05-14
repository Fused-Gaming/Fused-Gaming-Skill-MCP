# SyncPulse Release Performance Benchmark Guide

## Overview

This guide explains how to run and interpret the SyncPulse performance benchmarks for validating immutable releases.

## Quick Start

### Run Default Benchmarks
```bash
npm run benchmark
```

### Run Release Validation Benchmarks
```bash
npm run benchmark:release
```

### Run with Bash Runner Script
```bash
npm run benchmark:runner -- 0.2.2
```

## Benchmark Suite Components

### 1. **performance.benchmark.ts** - Quick Validation
Runs quick performance checks on all major services:
- Cache Service (set/get operations)
- Memory System (vector search at 1K/10K entries)
- Vector Index (hierarchical search)
- Swarm Orchestrator (task assignment and release)

**Runtime:** ~30 seconds  
**When to Use:** Quick validation during development

### 2. **release-performance.benchmark.ts** - Comprehensive Release Testing
Detailed benchmark specifically designed for validating immutable releases:
- Full memory usage profiling
- Scaling from 1K → 10K → 100K entries
- Stress testing with 100K entry vector search
- Detailed performance metric recording
- Results saved to JSON for comparison

**Runtime:** ~2-3 minutes  
**When to Use:** Pre-release validation, version comparison

### 3. **release-targets.json** - Performance Specifications
Defines the performance SLA for each operation:
```json
{
  "cacheOps": {
    "target_ms": 1.0,
    "operations": ["cache.set()", "cache.get()"]
  },
  "vectorSearch1K": {
    "target_ms": 10.0,
    "improvement": "10x faster than v0.1.x"
  }
}
```

## Performance Targets for v0.2.2

| Operation | Target | Status | Notes |
|-----------|--------|--------|-------|
| **Cache ops** | < 1ms | ✓ | LRU-optimized |
| **Vector search (1K)** | < 10ms | ✓ | 10x faster |
| **Vector search (10K)** | < 50ms | ✓ | 50-100x faster |
| **Vector search (100K)** | < 100ms | ✓ | 100-500x faster |
| **Swarm throughput** | > 1000 ops/sec | ✓ | Work-stealing |
| **Memory (24h+)** | < 100MB | ✓ | LRU bounded |

## Running in Different Environments

### Local Development
```bash
# Quick check
npm run benchmark

# Detailed validation
npm run benchmark:release
```

### CI/CD Pipeline
```bash
# In GitHub Actions
- name: Run Release Benchmarks
  run: npm run benchmark:release --workspace=@h4shed/skill-syncpulse
```

### Docker Container
```dockerfile
RUN node --expose-gc --max-old-space-size=4096 \
  packages/skills/syncpulse/benchmarks/release-performance.benchmark.ts
```

### Against Installed Package
```bash
# Install specific version
npm install @h4shed/skill-syncpulse@0.2.2

# Create test script
cat > test-installed.js << 'EOF'
import { createSyncPulseSkill } from "@h4shed/skill-syncpulse";
const skill = createSyncPulseSkill();
// Run benchmarks using imported services
EOF

node test-installed.js
```

## Interpreting Results

### Success Criteria
All of the following must be true:
1. ✓ Cache ops < 1ms
2. ✓ Vector search (1K) < 10ms
3. ✓ Vector search (10K) < 50ms
4. ✓ Vector search (100K) < 100ms (stress test)
5. ✓ Swarm throughput > 1000 ops/sec
6. ✓ Memory usage < 100MB

### Output Example
```
✓ CacheService.set: 0.234ms/op (target: 1ms) - 4272 ops/sec
✓ VectorIndex.search (1K entries): 4.521ms/op (target: 10ms) - 221 ops/sec
✓ VectorIndex.search (10K entries): 18.234ms/op (target: 50ms) - 54 ops/sec
✓ SwarmOrchestrator.assignTask (5 agents): 0.987ms/op (target: 1ms) - 1013 ops/sec

✅ All performance targets achieved! SyncPulse v0.2.2 is production-ready.
```

### Common Issues & Solutions

#### Issue: "Vector search (10K) exceeds target"
**Possible Causes:**
- System under load
- Insufficient RAM
- Node.js GC pauses

**Solutions:**
1. Run with `--expose-gc` flag
2. Use `--max-old-space-size=4096` for 4GB heap
3. Warm up the cache before measuring
4. Run in isolation (close other apps)

#### Issue: "Memory exceeds 100MB"
**Possible Causes:**
- Cache entries not being evicted
- Memory leak in vector index
- Test data not being cleaned up

**Solutions:**
1. Verify LRU eviction is working: `cache.stats().evictionCount > 0`
2. Check memory after 5 minutes idle
3. Use `--expose-gc` for forced garbage collection

#### Issue: "Swarm throughput below 1000 ops/sec"
**Possible Causes:**
- Slow agents in swarm
- Load not being balanced
- Work-stealing not triggered

**Solutions:**
1. Verify work-stealing enabled: check rebalance logs
2. Check agent queue imbalance
3. Ensure heterogeneous agents in test setup

## Comparing Versions

### Manual Comparison
```bash
# Benchmark v0.2.2
npm run benchmark:release

# Results saved to: benchmarks/release-results-<timestamp>.json

# Compare two results
diff \
  benchmarks/release-results-<old-timestamp>.json \
  benchmarks/release-results-<new-timestamp>.json
```

### Automated Comparison Script
```bash
# Run for two versions
npm run benchmark:runner -- 0.2.1
npm run benchmark:runner -- 0.2.2

# Results are compared and reported
```

## Production Validation

### Checklist
- [ ] Run benchmarks on target Node.js version (20.x or 22.x)
- [ ] Run with `--expose-gc` flag for accurate memory measurement
- [ ] Verify no system load interference
- [ ] Check all performance targets pass
- [ ] Validate memory stays < 100MB over 5 minute run
- [ ] Compare with previous version
- [ ] Test with real-world data sizes (if available)

### Pre-Release Validation
```bash
# Full validation suite
NODE_OPTIONS="--expose-gc --max-old-space-size=4096" npm run benchmark:release

# Should produce:
# ✓ Cache ops < 1ms
# ✓ Vector search (1K) < 10ms
# ✓ Vector search (10K) < 50ms
# ✓ Vector search (100K) < 100ms
# ✓ Swarm throughput > 1000 ops/sec
# ✓ Memory usage < 100MB

# Then publish:
npm publish
```

## v0.2.2 Performance Improvements

### Phase 1: Stability
- **LRU Cache Eviction**: Bounded memory prevents OOM
- **Rate Limiting**: Token bucket at 1000 qps
- **Batch Persistence**: 100x faster recovery

### Phase 2: Scale
- **Hierarchical Indexing**: 100-500x vector search speedup
- **Work-Stealing**: 2-4x swarm throughput improvement

### Measured Impact
| Metric | v0.1.x | v0.2.2 | Improvement |
|--------|--------|--------|-------------|
| Vector Search (1K) | 50ms | <5ms | **10x** |
| Vector Search (10K) | 500ms | 5-20ms | **50-100x** |
| Vector Search (100K) | 2-5s | 10-50ms | **100-500x** |
| Cache Recovery | 100-500s | 1-5s | **100x** |
| Memory (24h+) | Unbounded | <100MB | **Bounded** |

## Continuous Monitoring

### In Production
```bash
# Monitor performance over time
npm run benchmark:release > perf-$(date +%s).log

# Compare recent results
diff perf-*.log | grep -E "^[<>]"
```

### CI/CD Integration
Add to GitHub Actions workflow:
```yaml
- name: Performance Regression Test
  run: |
    npm run benchmark:release --workspace=@h4shed/skill-syncpulse
    if [ $? -ne 0 ]; then
      echo "Performance regression detected!"
      exit 1
    fi
```

## Resources

- **Performance Analysis:** [RELEASE_NOTES_v0.2.2.md](../RELEASE_NOTES_v0.2.2.md)
- **Targets Specification:** [release-targets.json](./release-targets.json)
- **Benchmark Code:** [release-performance.benchmark.ts](./release-performance.benchmark.ts)
- **Runner Script:** [run-release-benchmarks.sh](../scripts/run-release-benchmarks.sh)

## Support

For benchmark-related issues:
1. Check the [Common Issues](#common-issues--solutions) section above
2. Review [release-targets.json](./release-targets.json) for current specifications
3. Compare results with known baseline from [RELEASE_NOTES_v0.2.2.md](../RELEASE_NOTES_v0.2.2.md)
4. Open an issue with benchmark logs and environment details
