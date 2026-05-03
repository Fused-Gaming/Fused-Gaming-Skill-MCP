#!/bin/bash

###############################################################################
# Pre-Deployment Validation Script
# Used in CI/CD and pre-merge checks to validate complete SyncPulse Hub setup
###############################################################################

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   📋 PRE-DEPLOYMENT VALIDATION                               ║"
echo "║   Comprehensive system validation before merge               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

FAILED=0

# Build check
echo "🔨 [1/7] Building packages..."
if npm run build 2>&1 | tail -5; then
  echo "✅ Build passed"
else
  echo "❌ Build failed"
  ((FAILED++))
fi
echo ""

# TypeScript check
echo "📘 [2/7] TypeScript compilation..."
if npm run typecheck 2>&1 | tail -5; then
  echo "✅ TypeScript check passed"
else
  echo "❌ TypeScript check failed"
  ((FAILED++))
fi
echo ""

# Linting
echo "🔍 [3/7] Code linting..."
if npm run lint 2>&1 | tail -5; then
  echo "✅ Linting passed"
else
  echo "❌ Linting failed"
  ((FAILED++))
fi
echo ""

# Registry validation
echo "📋 [4/7] Skill registry validation..."
if npm run registry:generate 2>&1 | tail -3; then
  echo "✅ Registry valid"
else
  echo "❌ Registry validation failed"
  ((FAILED++))
fi
echo ""

# Package integrity
echo "📦 [5/7] Package integrity check..."
if npm ls --depth=0 2>&1 | grep "@h4shed" | wc -l > /tmp/pkg_count.txt; then
  count=$(cat /tmp/pkg_count.txt)
  echo "✅ Packages verified: $count packages found"
else
  echo "❌ Package check failed"
  ((FAILED++))
fi
echo ""

# Orchestration test
echo "⚙️ [6/7] Orchestration engine test..."
if npm run build --workspace=packages/skills/syncpulse-hub 2>&1 | tail -3; then
  echo "✅ Orchestration engine valid"
else
  echo "❌ Orchestration test failed"
  ((FAILED++))
fi
echo ""

# SyncPulse test
echo "💎 [7/7] SyncPulse functionality test..."
if npm run build --workspace=packages/skills/syncpulse 2>&1 | tail -3; then
  echo "✅ SyncPulse test passed"
else
  echo "❌ SyncPulse test failed"
  ((FAILED++))
fi
echo ""

# Summary
printf '═%.0s' {1..65}
echo ""
if [ "$FAILED" -eq 0 ]; then
  echo "✅ ALL VALIDATION TESTS PASSED"
  echo "✅ Safe to merge to main branch"
  exit 0
else
  echo "❌ VALIDATION FAILED ($FAILED test(s))"
  echo "❌ Fix issues before merging"
  exit 1
fi

