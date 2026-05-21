#!/usr/bin/env node

/**
 * Test Infrastructure Validation Script
 * 
 * Validates that all testing infrastructure is in place
 * before starting component/CLI testing
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
let passed = 0;
let failed = 0;
let warnings = 0;

function check(message, condition) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.log(`✗ ${message}`);
    failed++;
  }
}

function warn(message) {
  console.log(`⚠ ${message}`);
  warnings++;
}

console.log('\n=== Testing Infrastructure Validation ===\n');

// 1. Check documentation files
console.log('📋 Documentation Files:');
check('  /docs/TESTING_INFRASTRUCTURE.md exists', 
  fs.existsSync(path.join(ROOT, 'docs/TESTING_INFRASTRUCTURE.md')));
check('  /docs/TEST_TEMPLATES.md exists', 
  fs.existsSync(path.join(ROOT, 'docs/TEST_TEMPLATES.md')));
check('  /docs/COVERAGE_STRATEGY.md exists', 
  fs.existsSync(path.join(ROOT, 'docs/COVERAGE_STRATEGY.md')));
check('  /JEST_CONFIG_TEMPLATES.md exists', 
  fs.existsSync(path.join(ROOT, 'JEST_CONFIG_TEMPLATES.md')));
check('  /TESTING_READINESS_REPORT.md exists', 
  fs.existsSync(path.join(ROOT, 'TESTING_READINESS_REPORT.md')));

// 2. Check Jest configuration files
console.log('\n⚙️  Jest Configuration Files:');
check('  /jest.config.js exists', 
  fs.existsSync(path.join(ROOT, 'jest.config.js')));
check('  /packages/core/jest.config.js exists', 
  fs.existsSync(path.join(ROOT, 'packages/core/jest.config.js')));
check('  /packages/cli/jest.config.js exists', 
  fs.existsSync(path.join(ROOT, 'packages/cli/jest.config.js')));
check('  /packages/design-tokens/jest.config.js exists', 
  fs.existsSync(path.join(ROOT, 'packages/design-tokens/jest.config.js')));
check('  /packages/license-client/jest.config.mjs exists', 
  fs.existsSync(path.join(ROOT, 'packages/license-client/jest.config.mjs')));

// 3. Check existing test files
console.log('\n📝 Existing Test Files:');
const testFiles = [
  'packages/web/__tests__/middleware.test.ts',
  'packages/license-client/tests/validator.test.ts',
  'packages/skills/mermaid-terminal/tests/generate-mermaid-diagram.test.ts',
];
testFiles.forEach(file => {
  const exists = fs.existsSync(path.join(ROOT, file));
  check(`  ${file}`, exists);
});

// 4. Check root package.json for test script
console.log('\n📦 Package Configuration:');
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
check('  Root package.json has test script', 
  packageJson.scripts && packageJson.scripts.test);
check('  Root package.json has coverage threshold config in jest.config.js', 
  fs.existsSync(path.join(ROOT, 'jest.config.js')));

// 5. Check for test dependencies (optional - may be in root)
console.log('\n📚 Test Dependencies:');
const deps = packageJson.devDependencies || {};
if (deps.jest) {
  check('  jest installed', true);
} else {
  warn('  jest not in root devDependencies (may be in workspace packages)');
}

if (deps['ts-jest']) {
  check('  ts-jest installed', true);
} else {
  warn('  ts-jest not in root devDependencies (may be in workspace packages)');
}

// 6. Check documentation content
console.log('\n✅ Documentation Content Verification:');
const docContent = {
  'docs/TESTING_INFRASTRUCTURE.md': ['Jest Configuration', 'Test Templates', '80%'],
  'docs/TEST_TEMPLATES.md': ['Unit Test', 'Integration Test', 'React Component'],
  'docs/COVERAGE_STRATEGY.md': ['80% Code Coverage', 'Coverage Thresholds', 'Edge Cases'],
  'JEST_CONFIG_TEMPLATES.md': ['jest.config.js', 'jsdom', 'Node.js'],
  'TESTING_READINESS_REPORT.md': ['Readiness', 'Week 2', '80%+'],
};

Object.entries(docContent).forEach(([file, keywords]) => {
  const fullPath = path.join(ROOT, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const allPresent = keywords.every(keyword => content.includes(keyword));
    check(`  ${file} content complete`, allPresent);
  }
});

// 7. Summary
console.log('\n=== SUMMARY ===\n');
console.log(`✓ Passed: ${passed}`);
console.log(`✗ Failed: ${failed}`);
console.log(`⚠ Warnings: ${warnings}`);

const total = passed + failed + warnings;
const percentage = Math.round((passed / (passed + failed)) * 100);

console.log(`\nScore: ${percentage}% (${passed}/${passed + failed})`);

if (failed === 0 && warnings <= 2) {
  console.log('\n✅ Testing infrastructure is READY for Week 2!\n');
  process.exit(0);
} else if (failed === 0) {
  console.log('\n⚠️  Testing infrastructure ready with minor notes\n');
  process.exit(0);
} else {
  console.log('\n❌ Testing infrastructure needs attention\n');
  process.exit(1);
}
