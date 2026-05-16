#!/bin/bash

##
# SyncPulse Release Performance Benchmark Runner
# Runs performance benchmarks on immutable releases
# Usage: ./scripts/run-release-benchmarks.sh [version]
##

set -e

BENCHMARK_DIR="./benchmarks"
RESULTS_DIR="${BENCHMARK_DIR}/results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create results directory
mkdir -p "$RESULTS_DIR"

echo "🚀 SyncPulse Release Performance Benchmark Runner"
echo "=================================================="
echo ""

# Get version from argument or package.json
VERSION="${1:-$(node -pe "require('./package.json').version")}"
echo "Version: $VERSION"
echo "Timestamp: $TIMESTAMP"
echo ""

# Check if Node.js version is appropriate
NODE_VERSION=$(node -v)
echo "Node.js: $NODE_VERSION"
echo ""

# Run benchmark with garbage collection exposed
echo "Starting performance benchmarks..."
echo ""

# Create benchmark report
REPORT_FILE="${RESULTS_DIR}/release-${VERSION}-${TIMESTAMP}.json"
BENCHMARK_LOG="${RESULTS_DIR}/release-${VERSION}-${TIMESTAMP}.log"

# Run with --expose-gc flag for accurate memory measurements
node --expose-gc \
  --max-old-space-size=4096 \
  --loader ts-node/esm \
  "${BENCHMARK_DIR}/release-performance.benchmark.ts" \
  2>&1 | tee "$BENCHMARK_LOG"

RESULT_CODE=${PIPESTATUS[0]}

echo ""
echo "=================================================="
echo "Benchmark Results"
echo "=================================================="
echo ""
echo "Report: $REPORT_FILE"
echo "Log: $BENCHMARK_LOG"
echo ""

# Parse results for CI integration
if [ $RESULT_CODE -eq 0 ]; then
  echo "✅ Performance benchmark PASSED"
  echo ""
  echo "Benchmarks that passed:"
  grep "✓" "$BENCHMARK_LOG" || true

  # Generate comparison if previous results exist
  PREVIOUS_RESULT=$(ls -t "${RESULTS_DIR}"/release-${VERSION}-*.json 2>/dev/null | head -2 | tail -1)
  if [ -n "$PREVIOUS_RESULT" ] && [ "$PREVIOUS_RESULT" != "$REPORT_FILE" ]; then
    echo ""
    echo "Comparing with previous run..."
    echo "Previous: $PREVIOUS_RESULT"
    echo "Current:  $REPORT_FILE"
    # Note: comparison logic would go here with jq or similar
  fi

  exit 0
else
  echo "❌ Performance benchmark FAILED"
  echo ""
  echo "Failed benchmarks:"
  grep "✗" "$BENCHMARK_LOG" || true
  echo ""
  echo "Review the log file for details:"
  tail -50 "$BENCHMARK_LOG"
  exit 1
fi
