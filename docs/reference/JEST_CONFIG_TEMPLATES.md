# Jest Configuration Templates

Complete Jest configuration templates for different package types.

## 1. Web/React Package Configuration

**File:** `packages/web/jest.config.js`

```javascript
/**
 * Jest Configuration: Web Package
 * 
 * Package: @fused-gaming/swarm-controller
 * Framework: Next.js 14 + React 18
 * Environment: jsdom (browser)
 * Target Coverage: 80%
 */

export default {
  displayName: '@fused-gaming/swarm-controller',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  rootDir: '.',
  
  testMatch: [
    '<rootDir>/__tests__/**/*.test.ts',
    '<rootDir>/__tests__/**/*.test.tsx',
    '<rootDir>/src/**/__tests__/*.test.ts',
    '<rootDir>/src/**/__tests__/*.test.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': '<rootDir>/jest/styleMock.js',
    
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': 
      '<rootDir>/jest/fileMock.js',
    
    // Handle path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    
    // Handle ESM imports
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/*.stories.tsx',
    '!src/app/**', // Next.js app directory
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  testTimeout: 10000,
  maxWorkers: '50%',
  bail: process.env.CI ? 1 : 0,
  verbose: process.env.CI === 'true',
};
```

---

## 2. Design Tokens Package Configuration

**File:** `packages/design-tokens/jest.config.js`

```javascript
/**
 * Jest Configuration: Design Tokens Package
 * 
 * Package: @h4shed/design-tokens
 * Type: React component library + tokens
 * Environment: jsdom
 * Target Coverage: 85%
 */

export default {
  displayName: '@h4shed/design-tokens',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  rootDir: '.',

  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
        },
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/jest/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/jest/fileMock.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/*.stories.tsx',
  ],

  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  testTimeout: 10000,
};
```

---

## 3. Node.js Library Configuration

**File:** `packages/core/jest.config.js` (Example - already exists)

```javascript
/**
 * Jest Configuration: Core Library
 * 
 * Package: @h4shed/mcp-core
 * Type: Node.js library
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

  testTimeout: 10000,
  bail: process.env.CI ? 1 : 0,
};
```

---

## 4. Minimal Configuration (Skills)

**File:** `packages/skills/<skill>/jest.config.js` (Example)

```javascript
/**
 * Jest Configuration: Skill Package
 * 
 * Minimal configuration for skill packages
 * Extend from root jest.config.js
 */

export default {
  displayName: '@h4shed/skill-<name>',
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
```

---

## 5. Mock Files

### CSS Mock

**File:** `jest/styleMock.js`

```javascript
module.exports = {};
```

### File Mock

**File:** `jest/fileMock.js`

```javascript
module.exports = 'test-file-stub';
```

### Setup File (jsdom)

**File:** `jest/setup.js`

```javascript
/**
 * Jest Setup File for jsdom Environment
 */

// Add React Testing Library matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

---

## Installation Checklist

For a new package, add Jest:

```bash
npm install --save-dev jest ts-jest @types/jest
```

For React components, also add:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe
```

---

## Configuration by Package Type

| Package Type | Test Env | Coverage | Template |
|---|---|---|---|
| Web (Next.js) | jsdom | 80% | Section 1 |
| Design System | jsdom | 85% | Section 2 |
| Core Library | node | 85% | Section 3 |
| Skills | node | 80% | Section 4 |

---

## Validation

After creating Jest config:

```bash
# Validate configuration
npm test -- --showConfig

# Run tests
npm test

# Generate coverage
npm test -- --coverage
```

---

## Common Issues

**Issue:** Module not found in tests
**Solution:** Add moduleNameMapper for path aliases

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

**Issue:** CSS/image imports fail
**Solution:** Add style/file mocks

```javascript
moduleNameMapper: {
  '\\.(css|scss)$': '<rootDir>/jest/styleMock.js',
  '\\.(png|jpg|svg)$': '<rootDir>/jest/fileMock.js',
}
```

**Issue:** ESM imports not working
**Solution:** Add ESM mapper

```javascript
moduleNameMapper: {
  '^(\\.{1,2}/.*)\\.js$': '$1',
}
```

