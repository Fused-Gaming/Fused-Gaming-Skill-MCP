/**
 * Jest Configuration: Core MCP Package
 *
 * Package: @h4shed/mcp-core
 * Scope: MCP server, skill registry, types
 * Environment: Node.js
 * Target Coverage: 85%
 */

export default {
  displayName: '@h4shed/mcp-core',
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
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
