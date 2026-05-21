# Testing Infrastructure Guide

## Overview

This document outlines the testing infrastructure for the Fused Gaming Skill MCP project, targeting **80%+ code coverage** across all packages with comprehensive unit, integration, accessibility, and E2E tests.

**Coverage Target:** 80% minimum (statements, branches, functions, lines)
**Test Framework:** Jest + ts-jest (Node.js) + React Testing Library (React components)  
**Accessibility Testing:** jest-axe for WCAG AA compliance
**Documentation:** Storybook 7+ for interactive component stories

---

## Test Architecture

### Test Pyramid

```
                    /\
                   /  \  
                  / E2E \ ← Browser-based integration tests (few)
                 /--------\
                /Integration\ ← Multiple components, real dependencies
               /              \ 
              /   Unit Tests    \ ← Single units, mocked deps (most)
             /____________________\
```

### Test Matrix by Package Type

| Package Type | Framework | Environment | Coverage Target | Test Location |
|---|---|---|---|---|
| Node.js Libraries (core, cli, skills) | Jest + ts-jest | Node.js | 80% | `tests/` or `src/**/*.test.ts` |
| Design System Components | Jest + RTL + jest-axe | jsdom | 85% | `src/**/__tests__/*.test.tsx` |
| React Web App | Jest + RTL | jsdom | 80% | `__tests__/` or `**/__tests__/*.test.tsx` |
| E2E / Integration | Playwright / Cypress | Browser | 70% | `e2e/` |

---

## Jest Configuration Status

### Root Configuration

**File:** `/jest.config.js` - **ALREADY EXISTS**

Covers all packages with 80% coverage threshold enforced globally.

### Package Jest Configs

Existing Jest configs verified:
- `packages/core/jest.config.js` (85% threshold)
- `packages/cli/jest.config.js` (80% threshold)
- `packages/design-tokens/jest.config.js` (80% threshold)
- `packages/license-client/jest.config.mjs` (90% threshold)
- `packages/skills/mermaid-terminal/jest.config.js` (70% threshold)
- `packages/skills/svg-generator/jest.config.js` (70% threshold)
- `packages/skills/ux-journeymapper/jest.config.js` (70% threshold)

**Missing for React packages:**
- `packages/web/jest.config.js` - NEEDS CREATION

---

## Test Templates

### Template 1: Unit Test (Node.js Library)

**File:** `tests/example.test.ts`

```typescript
/**
 * @test Example Service
 * @description Tests for the ExampleService class
 */

import { ExampleService } from '../src/example.js';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService();
  });

  describe('method: processData', () => {
    it('should process valid data successfully', () => {
      const input = { id: '123', value: 42 };
      const result = service.processData(input);

      expect(result).toHaveProperty('success', true);
    });

    it('should throw on invalid input', () => {
      expect(() => service.processData(null as any))
        .toThrow('Invalid input');
    });
  });
});
```

### Template 2: Integration Test

**File:** `src/services/__tests__/auth-service.test.ts`

```typescript
/**
 * @test Authentication Service Integration
 */

import { AuthService } from '../auth-service.js';
import { SessionStore } from '../../lib/session-store.js';

jest.mock('../../lib/api-client.js');
const mockApiClient = require('../../lib/api-client.js').apiClient;

describe('AuthService Integration', () => {
  let authService: AuthService;
  let sessionStore: SessionStore;

  beforeEach(() => {
    sessionStore = new SessionStore();
    authService = new AuthService(sessionStore);
    jest.clearAllMocks();
  });

  it('should authenticate user and store session', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'valid-token',
        user: { id: 'user-123', email: 'user@example.com' },
      },
    });

    const result = await authService.login({
      email: 'user@example.com',
      password: 'pass123',
    });

    expect(result).toHaveProperty('token');
    const session = sessionStore.getSession(result.token);
    expect(session?.email).toBe('user@example.com');
  });
});
```

### Template 3: React Component Unit Test

**File:** `src/components/atoms/buttons/__tests__/Button.test.tsx`

```typescript
/**
 * @test Button Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with label text', () => {
      render(<Button label="Click Me" />);
      expect(
        screen.getByRole('button', { name: /click me/i })
      ).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      render(<Button label="Test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick on click', async () => {
      const handleClick = jest.fn();
      render(<Button label="Test" onClick={handleClick} />);

      await userEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button label="Test" onClick={handleClick} disabled />
      );

      await userEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Template 4: Accessibility Test (jest-axe)

**File:** `src/components/atoms/buttons/__tests__/Button.a11y.test.tsx`

```typescript
/**
 * @test Button Component - Accessibility (WCAG AA)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button Component - Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Button label="Click Me" variant="primary" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have violations when disabled', async () => {
    const { container } = render(
      <Button label="Disabled" disabled />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Running Tests

### CLI Commands

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch

# Specific test file
npm test -- tests/example.test.ts

# Tests matching pattern
npm test -- --testNamePattern="Button"

# Specific package
npm test --workspace=packages/design-tokens

# With debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Coverage Reports

```bash
# Generate coverage
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

---

## Best Practices

### 1. Test Naming
```typescript
// ✅ Good: Descriptive, behavior-focused
it('should render with label text', () => {});
it('should call onClick when user clicks', () => {});
```

### 2. Arrange-Act-Assert
```typescript
// ✅ Good: Clear structure
it('should validate email format', () => {
  // Arrange
  const validator = new EmailValidator();
  const invalidEmail = 'not-an-email';

  // Act
  const result = validator.validate(invalidEmail);

  // Assert
  expect(result.valid).toBe(false);
});
```

### 3. Test Isolation
```typescript
// ✅ Good: Each test independent
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(); // Fresh instance
  });
});
```

### 4. Mock External Dependencies
```typescript
// ✅ Good: Mock only external services
jest.mock('@/lib/api');

// Use real implementation for internal services
import { UserValidator } from '@/services/user-validator';
```

---

## Storybook Setup

### Installation

```bash
npm install --save-dev storybook @storybook/react @storybook/addon-essentials
```

### Configuration

**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: [
    '../packages/design-tokens/src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### Component Story

**File:** `src/components/atoms/buttons/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: 'Button', variant: 'primary' },
};

export const Secondary: Story = {
  args: { label: 'Button', variant: 'secondary' },
};

export const Disabled: Story = {
  args: { label: 'Button', disabled: true },
};
```

---

## Testing Checklist

Before merging PR:

- [ ] All tests pass (`npm test`)
- [ ] Coverage ≥ 80% (`npm test -- --coverage`)
- [ ] No console errors/warnings
- [ ] Accessibility tests pass (jest-axe)
- [ ] Storybook stories added for components
- [ ] Edge cases covered
- [ ] Async operations properly handled
- [ ] Error handling tested
- [ ] Integration tests verify composition

---

## Coverage Thresholds

Global thresholds enforced in `/jest.config.js`:

- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

Tests will fail if coverage drops below these thresholds.

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Lint
        run: npm run lint

      - name: Test with coverage
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Troubleshooting

### Tests timeout
```javascript
jest.setTimeout(30000); // 30 seconds
```

### Module not found
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Async test hangs
```typescript
// ✅ Good: Await promises
it('should fetch', async () => {
  const data = await service.fetch();
  expect(data).toBeDefined();
});
```

---

## Summary

**Testing Infrastructure Prepared:**

1. ✅ Jest root configuration (80% threshold)
2. ✅ Jest templates for all package types
3. ✅ Test templates (unit, integration, a11y)
4. ✅ Storybook configuration template
5. ✅ CI/CD integration example
6. ✅ Best practices and troubleshooting

**Next Steps (Week 2):**

1. Create Jest config for `packages/web` (if needed)
2. Install test dependencies (@testing-library/react, jest-axe)
3. Write tests alongside component implementation
4. Validate 80%+ coverage before merging

See individual package test documentation for implementation details.
