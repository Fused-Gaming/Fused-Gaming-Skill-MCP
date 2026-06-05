/**
 * Jest Configuration: CLI Package
 *
 * Package: @h4shed/mcp-cli
 * Scope: Command-line interface, CLI tools
 * Environment: Node.js
 * Target Coverage: 80%
 */

export default {
  displayName: '@h4shed/mcp-cli',
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts',
  ],

  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
