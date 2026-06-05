#!/usr/bin/env node

/**
 * Test Infrastructure Validation Script
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function check(message, condition) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.log(`✗ ${message}`);
    failed++;
  }
}

console.log('\n=== Testing Infrastructure Validation ===\n');

// 1. Check documentation files
console.log('📋 Documentation Files:');
check('  /docs/TESTING_INFRASTRUCTURE.md', 
  fs.existsSync(path.join(ROOT, 'docs/TESTING_INFRASTRUCTURE.md')));
check('  /docs/TEST_TEMPLATES.md', 
  fs.existsSync(path.join(ROOT, 'docs/TEST_TEMPLATES.md')));
check('  /docs/COVERAGE_STRATEGY.md', 
  fs.existsSync(path.join(ROOT, 'docs/COVERAGE_STRATEGY.md')));
check('  /JEST_CONFIG_TEMPLATES.md', 
  fs.existsSync(path.join(ROOT, 'JEST_CONFIG_TEMPLATES.md')));
check('  /TESTING_READINESS_REPORT.md', 
  fs.existsSync(path.join(ROOT, 'TESTING_READINESS_REPORT.md')));

// 2. Check Jest configuration files
console.log('\n⚙️  Jest Configuration Files:');
check('  /jest.config.js', 
  fs.existsSync(path.join(ROOT, 'jest.config.js')));
check('  /packages/core/jest.config.js', 
  fs.existsSync(path.join(ROOT, 'packages/core/jest.config.js')));
check('  /packages/cli/jest.config.js', 
  fs.existsSync(path.join(ROOT, 'packages/cli/jest.config.js')));
check('  /packages/design-tokens/jest.config.js', 
  fs.existsSync(path.join(ROOT, 'packages/design-tokens/jest.config.js')));

// 3. Check existing test files
console.log('\n📝 Test Files in Repository:');
check('  /packages/web/__tests__/middleware.test.ts', 
  fs.existsSync(path.join(ROOT, 'packages/web/__tests__/middleware.test.ts')));
check('  /packages/license-client/tests/validator.test.ts', 
  fs.existsSync(path.join(ROOT, 'packages/license-client/tests/validator.test.ts')));

// 4. Check Jest installed
console.log('\n📦 Test Framework:');
check('  node_modules/jest exists (Jest installed)', 
  fs.existsSync(path.join(ROOT, 'node_modules/jest')));
check('  node_modules/ts-jest exists', 
  fs.existsSync(path.join(ROOT, 'node_modules/ts-jest')));

// Summary
console.log('\n=== SUMMARY ===\n');
const total = passed + failed;
const percentage = Math.round((passed / total) * 100);

console.log(`✓ Passed: ${passed}/${total}`);
console.log(`Score: ${percentage}%`);

if (failed === 0) {
  console.log('\n✅ Testing infrastructure READY for Week 2!\n');
} else {
  console.log(`\n⚠️  ${failed} items need attention\n`);
}
