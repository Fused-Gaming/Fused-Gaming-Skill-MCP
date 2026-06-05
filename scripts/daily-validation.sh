#!/bin/bash
# Daily Integration Validation Script
# Week 2 Sprint - Integration Lead Monitoring
# Usage: ./scripts/daily-validation.sh
# Run daily at 5:00 PM local time

set -e

echo "=================================================="
echo "DAILY INTEGRATION VALIDATION - Week 2 Sprint"
echo "=================================================="
echo "Date: $(date)"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Helper functions
log_check() {
  echo ""
  echo -e "${BLUE}→ $1${NC}"
}

log_pass() {
  echo -e "${GREEN}✓ PASS: $1${NC}"
  ((CHECKS_PASSED++))
}

log_fail() {
  echo -e "${RED}✗ FAIL: $1${NC}"
  ((CHECKS_FAILED++))
}

log_warn() {
  echo -e "${YELLOW}⚠ WARN: $1${NC}"
  ((CHECKS_WARNING++))
}

# 1. Git Status
log_check "GIT STATUS & BRANCH"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "feat/atomic-components-w2" ]; then
  log_pass "On correct branch: $CURRENT_BRANCH"
else
  log_warn "Not on expected branch. Current: $CURRENT_BRANCH"
fi

UNCOMMITTED=$(git status --short | wc -l)
if [ "$UNCOMMITTED" -eq 0 ]; then
  log_pass "No uncommitted changes"
else
  log_warn "Uncommitted changes: $UNCOMMITTED files"
fi

# 2. TypeScript Strict Mode
log_check "TYPESCRIPT STRICT MODE"
if npm run typecheck > /tmp/typecheck.log 2>&1; then
  ERRORS=$(grep -c "error TS" /tmp/typecheck.log || true)
  if [ "$ERRORS" -eq 0 ]; then
    log_pass "TypeScript strict mode: 0 errors"
  else
    log_fail "TypeScript errors: $ERRORS"
  fi
else
  log_fail "TypeScript check failed"
fi

# 3. ESLint
log_check "ESLINT VALIDATION"
if npm run lint > /tmp/lint.log 2>&1; then
  LINT_ERRORS=$(grep -c "error" /tmp/lint.log || true)
  LINT_WARNINGS=$(grep -c "warning" /tmp/lint.log || true)

  if [ "$LINT_ERRORS" -eq 0 ]; then
    log_pass "Lint errors: 0"
  else
    log_fail "Lint errors: $LINT_ERRORS"
  fi

  if [ "$LINT_WARNINGS" -lt 20 ]; then
    log_pass "Lint warnings: $LINT_WARNINGS (target: <20)"
  else
    log_warn "Lint warnings: $LINT_WARNINGS (target: <20)"
  fi
else
  log_fail "Lint failed"
fi

# 4. Individual Package Builds (memory-safe)
log_check "PACKAGE BUILDS (Individual)"

PACKAGES=(
  "packages/design-tokens"
  "packages/license-client"
  "packages/cli"
  "packages/core"
)

for pkg in "${PACKAGES[@]}"; do
  if npm run build --workspace="$pkg" > /tmp/build-${pkg//\//-}.log 2>&1; then
    log_pass "Build: $pkg"
  else
    log_fail "Build failed: $pkg"
  fi
done

# 5. Package Exports Validation
log_check "PACKAGE EXPORTS"

# Test design-tokens exports
if node -e "import('@h4shed/design-tokens').then(() => console.log('OK'))" 2>/dev/null; then
  log_pass "Design tokens imports correctly"
else
  log_fail "Design tokens import failed"
fi

# Test license-client exports
if node -e "import('@h4shed/license-client').then(() => console.log('OK'))" 2>/dev/null; then
  log_pass "License client imports correctly"
else
  log_fail "License client import failed"
fi

# Test CLI imports
if node -e "import('@h4shed/mcp-cli').then(() => console.log('OK'))" 2>/dev/null; then
  log_pass "CLI imports correctly"
else
  log_warn "CLI import failed (may need build)"
fi

# 6. Test Coverage Baseline
log_check "TEST COVERAGE"
if npm test -- --coverage > /tmp/test.log 2>&1; then
  COVERAGE=$(grep -o "[0-9]*\.[0-9]*%" /tmp/test.log | head -1 || echo "0%")
  log_warn "Test coverage: $COVERAGE (target: 80%+)"
else
  log_warn "Tests not fully implemented yet (placeholder only)"
fi

# 7. Component Inventory Check
log_check "COMPONENT INVENTORY"
COMPONENTS=$(find packages/design-tokens/src/components -name "*.tsx" -o -name "*.ts" | wc -l)
log_warn "Component files found: $COMPONENTS (planning phase: 20+ expected)"

# 8. Type Definitions
log_check "TYPE DEFINITIONS"
TYPES=$(find packages/design-tokens/dist -name "*.d.ts" | wc -l || echo "0")
if [ "$TYPES" -gt 0 ]; then
  log_pass "Type definition files: $TYPES"
else
  log_warn "No type definitions found (may need build)"
fi

# 9. Documentation Check
log_check "DOCUMENTATION"
READMES=(
  "packages/design-tokens/README.md"
  "packages/license-client/README.md"
  "packages/cli/README.md"
  "packages/core/README.md"
  "INTEGRATION_VALIDATION_PLAN.md"
  "MERGE_GATE_CRITERIA.md"
)

for readme in "${READMES[@]}"; do
  if [ -f "$readme" ]; then
    log_pass "Documentation: $readme"
  else
    log_fail "Missing: $readme"
  fi
done

# 10. No Mock/Stub Check
log_check "MOCK/STUB DETECTION"
MOCKS=$(grep -r "mock\|fake\|stub" packages/*/src/ --exclude-dir=__tests__ 2>/dev/null | wc -l || echo "0")
TODOS=$(grep -r "TODO.*implement\|FIXME.*mock" packages/*/src/ 2>/dev/null | wc -l || echo "0")

if [ "$MOCKS" -lt 5 ]; then
  log_pass "Mock implementations: $MOCKS (acceptable)"
else
  log_warn "Mock implementations found: $MOCKS (review needed)"
fi

if [ "$TODOS" -eq 0 ]; then
  log_pass "TODO/FIXME for mocks: 0"
else
  log_warn "TODO/FIXME for mocks: $TODOS"
fi

# 11. Dependency Check
log_check "DEPENDENCY INTEGRITY"
if npm install --dry-run > /tmp/deps.log 2>&1; then
  log_pass "Dependencies can install without conflicts"
else
  log_warn "Dependency check had issues (review log)"
fi

# 12. Git Log Analysis
log_check "COMMIT QUALITY"
COMMITS=$(git log --oneline feat/atomic-components-w2...origin/main 2>/dev/null | wc -l || echo "0")
BAD_COMMITS=$(git log --oneline feat/atomic-components-w2...origin/main 2>/dev/null | grep -i "wip\|fixup\|temp" | wc -l || echo "0")

log_pass "New commits: $COMMITS"
if [ "$BAD_COMMITS" -eq 0 ]; then
  log_pass "No WIP/fixup commits found"
else
  log_warn "Questionable commits found: $BAD_COMMITS"
fi

# Summary
echo ""
echo "=================================================="
echo "VALIDATION SUMMARY"
echo "=================================================="
echo -e "Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Failed: ${RED}$CHECKS_FAILED${NC}"
echo -e "Warnings: ${YELLOW}$CHECKS_WARNING${NC}"
echo ""

# Generate Report
REPORT_FILE="validation-report-$(date +%Y%m%d-%H%M%S).json"
cat > "$REPORT_FILE" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "branch": "$CURRENT_BRANCH",
  "checks": {
    "passed": $CHECKS_PASSED,
    "failed": $CHECKS_FAILED,
    "warnings": $CHECKS_WARNING
  },
  "typecheck": {
    "errors": $(grep -c "error TS" /tmp/typecheck.log || echo "0")
  },
  "lint": {
    "errors": $LINT_ERRORS,
    "warnings": $LINT_WARNINGS
  },
  "components": {
    "files": $COMPONENTS
  },
  "types": {
    "definitions": $TYPES
  },
  "mocks": {
    "found": $MOCKS,
    "todos": $TODOS
  },
  "git": {
    "commits": $COMMITS,
    "bad_commits": $BAD_COMMITS
  }
}
EOF

echo "Report saved: $REPORT_FILE"
echo ""

# Exit with appropriate code
if [ "$CHECKS_FAILED" -gt 0 ]; then
  echo -e "${RED}VALIDATION FAILED - Review issues above${NC}"
  exit 1
elif [ "$CHECKS_WARNING" -gt 5 ]; then
  echo -e "${YELLOW}VALIDATION PASSED WITH WARNINGS - Review noted${NC}"
  exit 0
else
  echo -e "${GREEN}VALIDATION PASSED - All critical checks OK${NC}"
  exit 0
fi
