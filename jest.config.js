/**
 * Root Jest Configuration
 * Configures test runner for monorepo with per-package Jest configs
 *
 * Coverage Target: 80%+ globally (enforced)
 * Environments: Both Node.js and jsdom (per package)
 *
 * Run tests:
 *   npm test                          # All tests
 *   npm test -- --coverage            # With coverage report
 *   npm test -- --watch               # Watch mode
 */

export default {
  // Projects enable isolated test runs per workspace
  projects: [
    '<rootDir>/packages/core/jest.config.js',
    '<rootDir>/packages/cli/jest.config.js',
    '<rootDir>/packages/design-tokens/jest.config.js',
    '<rootDir>/packages/license-client/jest.config.js',
    '<rootDir>/packages/web/jest.config.js',
    // Skills with Jest configs
    '<rootDir>/packages/skills/mermaid-terminal/jest.config.js',
    '<rootDir>/packages/skills/svg-generator/jest.config.js',
    '<rootDir>/packages/skills/ux-journeymapper/jest.config.js',
  ],

  // Coverage collection from all packages
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/index.ts',
    '!packages/**/src/**/index.tsx',
    '!packages/**/src/**/*.stories.tsx',
    '!**/node_modules/**',
  ],

  // Paths to ignore during testing
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
  ],

  // Coverage path ignoring
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
    '/api/',
  ],

  // Global coverage thresholds (80% minimum)
  // Individual packages may have higher thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Max workers for parallel test execution
  maxWorkers: '50%',

  // Test timeout (ms)
  testTimeout: 10000,

  // Bail on first test failure during CI
  bail: process.env.CI ? 1 : 0,

  // Verbose output in CI
  verbose: process.env.CI === 'true',
};
