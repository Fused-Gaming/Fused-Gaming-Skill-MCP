# Testing Infrastructure Guide

**Version**: 1.0.0  
**Last Updated**: May 21, 2026  
**Status**: Preparation Phase Complete

## Executive Summary

This document establishes the comprehensive testing infrastructure for the Fused Gaming MCP monorepo. It defines strategies, tools, configuration, and best practices for achieving and maintaining 80%+ test coverage across all packages.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Testing Stack](#testing-stack)
3. [Coverage Requirements](#coverage-requirements)
4. [Test Organization](#test-organization)
5. [Configuration](#configuration)
6. [Testing Patterns](#testing-patterns)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)

---

## Architecture Overview

### Test Pyramid Strategy

```
         /\
        /E2E\           <- Few (5-10%)
       /------\         Comprehensive user flows
      /Integration\     <- Moderate (15-25%)
     /----------\       Component combinations
    /Unit Tests\ <- Many (65-80%)
   /--------------\     Fast, focused tests
```

### Testing Scope by Package Type

| Package Type | Unit | Integration | E2E | Coverage Target |
|---|---|---|---|---|
| **Design Tokens** | 80% | 40% | 0% | 80% |
| **Components** | 85% | 70% | 20% | 85% |
| **Utilities** | 90% | 40% | 0% | 90% |
| **CLI Commands** | 80% | 60% | 15% | 80% |
| **Skills** | 75% | 50% | 10% | 75% |
| **Core/Server** | 85% | 70% | 0% | 85% |

---

## Testing Stack

### Core Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@types/jest": "^29.5.11",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jest-axe": "^8.0.0",
    "jest-mock-extended": "^3.0.5",
    "@storybook/react": "^7.0.0",
    "@storybook/addon-testing-library": "^7.0.0"
  }
}
```

### Tool Purposes

| Tool | Purpose | Scope |
|---|---|---|
| **Jest** | Test runner & assertion library | All packages |
| **ts-jest** | TypeScript support in Jest | All packages |
| **React Testing Library** | Component testing (user-centric) | Web, components |
| **jest-axe** | Accessibility testing (WCAG AA) | Components |
| **jest-mock-extended** | Advanced mocking utilities | All packages |
| **Storybook** | Interactive component docs & testing | Design system |

---

## Coverage Requirements

### Global Thresholds (Enforced)

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### Non-Coverable Patterns

The following patterns are excluded from coverage requirements:

```typescript
// 1. Guard clauses in CLI commands
if (!cliEnvironment) {
  // ✅ OK to skip: Only runs in CLI context
  process.exit(1);
}

// 2. Error boundaries (browser-only)
if (typeof window === 'undefined') {
  // ✅ OK to skip: Only runs in server context
  return null;
}

// 3. Feature flags (tested via integration)
if (process.env.FEATURE_FLAG_X) {
  // ✅ OK to skip: Covered via integration tests
}

// 4. Fallback values (exhaustive type coverage)
const defaults = {
  color: 'blue' // ✅ OK to skip: Type ensures coverage
} as const;

// 5. Storybook stories (tested via visual)
if (process.env.STORYBOOK) {
  // ✅ OK to skip: Tested via Storybook interactions
}
```

### Coverage Calculation

```bash
# Generate coverage report
npm run test -- --coverage

# Display coverage summary
npm run test -- --coverage --coverageReporters=text-summary

# Generate HTML report (viewable in browser)
npm run test -- --coverage --coverageReporters=html
# Open coverage/index.html to explore detailed coverage
```

---

## Test Organization

### Directory Structure

```
packages/
├── core/
│   ├── src/
│   │   ├── index.ts
│   │   ├── skill-registry.ts
│   │   └── server.ts
│   ├── tests/                    # All test files
│   │   ├── unit/
│   │   │   ├── skill-registry.test.ts
│   │   │   └── server.test.ts
│   │   └── integration/
│   │       └── skill-registry-integration.test.ts
│   ├── jest.config.js            # Package-level config
│   └── tsconfig.json
│
├── web/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx       # Colocated tests
│   │   └── Button.stories.tsx    # Storybook stories
│   ├── __tests__/
│   │   ├── unit/
│   │   │   └── lib/
│   │   ├── integration/
│   │   │   └── auth-flow.test.tsx
│   │   └── e2e/
│   │       └── landing-page.test.ts
│   ├── jest.config.js
│   └── tsconfig.json
│
└── skills/*/
    ├── src/
    │   ├── tools/
    │   │   ├── my-tool.ts
    │   │   └── my-tool.test.ts
    │   └── index.ts
    ├── tests/
    │   ├── unit/
    │   └── integration/
    ├── jest.config.js
    └── tsconfig.json
```

### File Naming Conventions

```
// Unit tests (with source)
components/Button.test.tsx          ✅ Colocated
Button.tsx                          (same directory)

// Unit tests (separate folder)
src/utils/validate.ts
tests/unit/utils/validate.test.ts   ✅ Mirrored structure

// Integration tests
tests/integration/auth-flow.test.tsx ✅ Descriptive name

// Stories (Storybook)
components/Button.stories.tsx        ✅ Next to component

// Test utilities
tests/__helpers__/
├── mock-factories.ts               ✅ Test data builders
├── test-utils.tsx                  (React setup)
└── matchers.ts                     (Custom Jest matchers)
```

---

## Configuration

### Root Jest Configuration

Create `/jest.config.js`:

```javascript
export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/index.tsx',
    '!**/*.stories.tsx',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
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
  projects: [
    '<rootDir>/packages/core/jest.config.js',
    '<rootDir>/packages/cli/jest.config.js',
    '<rootDir>/packages/design-tokens/jest.config.js',
    '<rootDir>/packages/license-client/jest.config.js',
    '<rootDir>/packages/web/jest.config.js',
    // Skills added dynamically
  ],
};
```

### Package-Level Jest Configuration (Template)

Create `packages/{name}/jest.config.js`:

```javascript
export default {
  displayName: '@h4shed/package-name',
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' for React/DOM
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
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/*.stories.tsx',
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

### Web Package (React) Jest Configuration

Create `packages/web/jest.config.js`:

```javascript
export default {
  displayName: '@fused-gaming/swarm-controller',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/components/**/*.test.tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/index.tsx',
    '!**/*.stories.tsx',
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

### Jest Setup Files

Create `packages/web/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock environment
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
```

---

## Testing Patterns

### Unit Tests: Simple Component

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should apply size variant classes', () => {
      const { rerender } = render(<Button size="sm">Text</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('text-sm');

      rerender(<Button size="lg">Text</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('text-lg');
    });

    it('should apply color variant classes', () => {
      const { rerender } = render(<Button variant="primary">Text</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-r');

      rerender(<Button variant="danger">Text</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('from-red-600');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should submit form when type="submit"', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );

      userEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have no axe violations', async () => {
      const { container } = render(<Button>Click Me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be keyboard accessible', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });

    it('should have visible focus indicator', () => {
      render(<Button>Click</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-2', 'focus:outline-none');
    });
  });

  describe('Edge Cases', () => {
    it('should render without optional props', () => {
      render(<Button>Text</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(100);
      render(<Button>{longText}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle rapid clicks', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      const button = screen.getByRole('button');
      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
```

### Unit Tests: Utility Function

```typescript
// src/utils/validateEmail.test.ts
import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  describe('Valid Emails', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user123@sub.example.com',
    ];

    validEmails.forEach((email) => {
      it(`should validate "${email}"`, () => {
        expect(validateEmail(email)).toBe(true);
      });
    });
  });

  describe('Invalid Emails', () => {
    const invalidEmails = [
      'invalid',
      '@example.com',
      'user@',
      'user name@example.com',
      'user@example',
    ];

    invalidEmails.forEach((email) => {
      it(`should reject "${email}"`, () => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should handle null', () => {
      expect(validateEmail(null as any)).toBe(false);
    });

    it('should handle very long email', () => {
      const longEmail = `${'a'.repeat(255)}@example.com`;
      expect(validateEmail(longEmail)).toBe(false);
    });
  });
});
```

### Integration Tests: Component Composition

```typescript
// __tests__/integration/UserLoginFlow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';
import { mockAuthService } from '../__helpers__/mock-factories';

describe('User Login Flow (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete successful login flow', async () => {
    const { push } = require('next/router');
    mockAuthService.login.mockResolvedValue({ token: 'valid-token' });

    render(<LoginForm />);

    // Fill form
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'user@example.com'
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      'password123'
    );

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify redirect
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display error on failed login', async () => {
    mockAuthService.login.mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      'user@example.com'
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      'wrong-password'
    );

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    mockAuthService.login.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ token: 'token' }), 100))
    );

    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/email/i),
      'user@example.com'
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      'password123'
    );

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});
```

### Mock Factory Pattern

```typescript
// tests/__helpers__/mock-factories.ts
import { jest } from '@jest/globals';

export const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  validateToken: jest.fn(),
  refreshToken: jest.fn(),
};

export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Factory for creating test users
export function createMockUser(overrides = {}) {
  return {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    ...overrides,
  };
}

// Factory for creating test licenses
export function createMockLicense(overrides = {}) {
  return {
    id: 'license-123',
    type: 'trial',
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isValid: true,
    ...overrides,
  };
}
```

### Storybook Story Template

```typescript
// components/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Click Me',
  },
  render: (args) => <Button {...args} />,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button (default)
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

// All sizes
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

// Interactive testing
export const Interactive: Story = {
  args: {
    onClick: () => alert('Button clicked!'),
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    expect(button).toBeTruthy();
  },
};
```

---

## CI/CD Integration

### GitHub Actions: Test Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install --package-lock-only --ignore-scripts && npm ci
      
      - name: Typecheck
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm run test -- --coverage --passWithNoTests
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: false
```

### Coverage Reports

Configure coverage output:

```bash
# scripts/report-coverage.sh
#!/bin/bash

echo "=== Test Coverage Summary ==="
npm run test -- --coverage --coverageReporters=text-summary

echo ""
echo "=== Package Coverage Details ==="
find packages -name coverage -type d | while read dir; do
  if [ -f "$dir/coverage-summary.json" ]; then
    package=$(dirname $dir)
    echo "📦 $package"
    cat "$dir/coverage-summary.json" | jq '.total | to_entries | .[] | "\(.key): \(.value.pct)%"'
  fi
done

echo ""
echo "✅ Full HTML report: coverage/index.html"
```

---

## Best Practices

### 1. Test-Driven Development (TDD)

```typescript
// ❌ Don't: Write code first
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Do: Write test first
describe('validateEmail', () => {
  it('should validate valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
// Then implement to pass tests
```

### 2. One Assertion Per Test

```typescript
// ❌ Don't: Multiple assertions
it('should validate and format email', () => {
  const result = processEmail('USER@EXAMPLE.COM');
  expect(result.valid).toBe(true);
  expect(result.formatted).toBe('user@example.com');
  expect(result.domain).toBe('example.com');
});

// ✅ Do: Separate tests
describe('processEmail', () => {
  it('should validate valid emails', () => {
    expect(processEmail('USER@EXAMPLE.COM').valid).toBe(true);
  });

  it('should lowercase the email', () => {
    expect(processEmail('USER@EXAMPLE.COM').formatted).toBe('user@example.com');
  });

  it('should extract domain', () => {
    expect(processEmail('USER@EXAMPLE.COM').domain).toBe('example.com');
  });
});
```

### 3. Descriptive Test Names

```typescript
// ❌ Don't: Vague names
it('should work', () => { });
it('test validation', () => { });
it('handles edge cases', () => { });

// ✅ Do: Specific behavior descriptions
it('should validate email with subdomain and plus addressing', () => { });
it('should reject email without domain extension', () => { });
it('should trim whitespace from email input', () => { });
```

### 4. Arrange-Act-Assert Pattern

```typescript
it('should save license to storage', () => {
  // Arrange: Set up test data and mocks
  const mockLicense = createMockLicense();
  const mockStorage = {
    save: jest.fn(),
  };

  // Act: Execute the function
  saveLicense(mockLicense, mockStorage);

  // Assert: Verify the results
  expect(mockStorage.save).toHaveBeenCalledWith(mockLicense);
});
```

### 5. Test Isolation

```typescript
// ❌ Don't: Shared state
let user: User;

describe('UserService', () => {
  it('test 1', () => {
    user = createUser();
  });

  it('test 2', () => {
    // Depends on test 1 running first!
    expect(user).toBeDefined();
  });
});

// ✅ Do: Independent tests
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create user', () => {
    const user = service.createUser({ name: 'Test' });
    expect(user).toBeDefined();
  });

  it('should find created user', () => {
    // Independent setup
    service.createUser({ name: 'Test' });
    const found = service.findByName('Test');
    expect(found).toBeDefined();
  });
});
```

### 6. Mock External Dependencies

```typescript
// ❌ Don't: Real API calls in tests
it('should fetch user', async () => {
  const user = await fetchUserFromRealAPI(123);
  expect(user.id).toBe(123);
});

// ✅ Do: Mock external services
it('should fetch user', async () => {
  const mockApi = {
    fetchUser: jest.fn().mockResolvedValue({ id: 123, name: 'Test' }),
  };

  const user = await userService.getUser(123, mockApi);
  expect(user.id).toBe(123);
  expect(mockApi.fetchUser).toHaveBeenCalledWith(123);
});
```

### 7. Skip Implementation Details

```typescript
// ❌ Don't: Test internals
it('should call parseJSON and validateSchema', () => {
  const parseSpy = jest.spyOn(JSON, 'parse');
  parseDataFile('data.json');
  expect(parseSpy).toHaveBeenCalled();
});

// ✅ Do: Test behavior/output
it('should load and validate JSON file', () => {
  const data = parseDataFile('data.json');
  expect(data).toEqual(expectedValidData);
});
```

### 8. Document Complex Test Scenarios

```typescript
/**
 * @test License Expiration Flow
 * @description Validates that expired licenses are properly rejected
 * @setup Create a license expiring in -1 day
 * @expected License should be marked as invalid and error returned
 */
it('should reject expired license', () => {
  const expiredLicense = createMockLicense({
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });

  const result = validateLicense(expiredLicense);
  expect(result.valid).toBe(false);
  expect(result.error).toContain('expired');
});
```

### 9. Accessibility Testing Checklist

```typescript
describe('Accessibility Requirements', () => {
  it('should have no axe violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have semantic HTML', () => {
    render(<Component />);
    // Use role queries (preferred)
    expect(screen.getByRole('button')).toBeInTheDocument();
    // Avoid using getByTestId for accessibility testing
  });

  it('should be keyboard navigable', async () => {
    render(<Component />);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    // Verify action completed
  });

  it('should have proper color contrast', () => {
    const { container } = render(<Component />);
    // Visual regression testing tools verify contrast
  });

  it('should support screen readers', () => {
    render(<Component />);
    // Verify aria-labels, aria-describedby, etc.
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
```

### 10. Performance Testing

```typescript
it('should render 100 items under 100ms', () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));

  const start = performance.now();
  render(<ItemList items={items} />);
  const duration = performance.now() - start;

  expect(duration).toBeLessThan(100);
});

it('should not leak memory on mount/unmount cycles', () => {
  const initialMemory = process.memoryUsage().heapUsed;

  for (let i = 0; i < 100; i++) {
    const { unmount } = render(<Component />);
    unmount();
  }

  global.gc?.();
  const finalMemory = process.memoryUsage().heapUsed;
  const increase = finalMemory - initialMemory;

  expect(increase).toBeLessThan(10 * 1024 * 1024); // < 10MB
});
```

---

## Running Tests

### Common Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests for specific package
npm test --workspace=packages/web

# Generate coverage report
npm run test -- --coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should validate"

# Update snapshots
npm test -- --updateSnapshot

# Run with specific Node environment
NODE_ENV=test npm test
```

### Coverage Targets by Phase

| Phase | Target | Command |
|---|---|---|
| Development | 70%+ | `npm test -- --coverage` |
| Pre-merge | 80%+ | `npm test -- --coverage --bail` |
| Release | 85%+ | `npm test -- --coverage --verbose` |

---

## Troubleshooting

### Common Issues

#### ❌ "Cannot find module" in tests

```bash
# Solution: Update module name mapper
# jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',  // Add your path aliases
}
```

#### ❌ Tests timeout

```typescript
// Increase timeout for specific tests
it('should handle slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### ❌ Coverage threshold failing

```bash
# Check which files are not covered
npm test -- --coverage --coverageReporters=html
# Open coverage/index.html to see uncovered lines
```

#### ❌ Storybook stories not running

```bash
# Ensure play function has proper async handling
export const Interactive: Story = {
  play: async ({ canvasElement, step }) => {
    await step('Click button', async () => {
      const button = canvasElement.querySelector('button');
      await userEvent.click(button);
    });
  },
};
```

---

## Maintenance & Monitoring

### Monthly Review Checklist

- [ ] Review coverage trends (increasing, stable, or declining?)
- [ ] Update outdated test fixtures or mocks
- [ ] Refactor flaky tests
- [ ] Document new test patterns discovered
- [ ] Update CI configuration for new packages

### Quarterly Goals

- Q2: Baseline 80% coverage across all packages
- Q3: Implement visual regression testing
- Q4: Add E2E test suite with Playwright

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [jest-axe Accessibility Testing](https://github.com/nickcolley/jest-axe)
- [Storybook Component Testing](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [Testing Library Role Queries](https://testing-library.com/docs/queries/byrole)

---

**Last Updated**: May 21, 2026  
**Maintainer**: QA Specialist (Test Specialist)  
**Status**: ✅ Ready for Implementation
