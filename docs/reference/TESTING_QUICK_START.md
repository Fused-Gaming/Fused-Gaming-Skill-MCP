# Testing Quick Start Guide

Fast reference for Week 2 testing implementation.

## Before You Start

**Verify infrastructure is ready:**

```bash
node scripts/validate-test-infrastructure.cjs
# Should show: ✅ Testing infrastructure READY for Week 2!
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode (auto-rerun on changes)
npm test -- --watch

# Run specific test file
npm test -- tests/example.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run tests in specific package
npm test --workspace=packages/design-tokens
```

### View Coverage Report

```bash
# Generate coverage
npm test -- --coverage

# Open HTML report (macOS)
open coverage/lcov-report/index.html

# Open HTML report (Linux)
xdg-open coverage/lcov-report/index.html
```

---

## Writing Your First Test

### Step 1: Find the Test Template

For **React components** (e.g., Button):
→ See `/docs/TEST_TEMPLATES.md` Section 3 (page ~300)

For **Node.js services**:
→ See `/docs/TEST_TEMPLATES.md` Section 1 (page ~100)

For **Integration tests**:
→ See `/docs/TEST_TEMPLATES.md` Section 2 (page ~200)

### Step 2: Create Test File

Copy the template and customize:

```typescript
// File: src/components/Button/__tests__/Button.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i }))
      .toBeInTheDocument();
  });

  it('should call onClick on click', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button label="Test" onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Step 3: Run Tests

```bash
npm test -- Button.test.tsx
```

### Step 4: Check Coverage

```bash
npm test -- --coverage --testPathPattern="Button"
```

---

## Test File Locations

Create test files next to the code:

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx          ← Component
│   │   └── __tests__/
│   │       ├── Button.test.tsx  ← Unit test
│   │       └── Button.a11y.test.tsx  ← Accessibility test
│   └── Card/
│       ├── Card.tsx
│       └── __tests__/
│           └── Card.test.tsx
│
├── services/
│   ├── auth-service.ts         ← Service
│   └── __tests__/
│       └── auth-service.test.ts  ← Unit test
```

---

## Test Structure Template

Every test should follow Arrange-Act-Assert:

```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // ARRANGE: Setup test data
    const props = { label: 'Test' };

    // ACT: Execute code being tested
    const { getByRole } = render(<Component {...props} />);

    // ASSERT: Verify results
    expect(getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Common Test Patterns

### Testing Rendering

```typescript
it('should render with props', () => {
  render(<Button label="Click" />);
  expect(screen.getByText('Click')).toBeInTheDocument();
});
```

### Testing Events

```typescript
it('should call onClick', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick} />);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalled();
});
```

### Testing State Changes

```typescript
it('should update on prop change', () => {
  const { rerender } = render(<Button disabled={false} />);
  expect(screen.getByRole('button')).not.toBeDisabled();
  
  rerender(<Button disabled={true} />);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

### Testing Async Code

```typescript
it('should load data', async () => {
  render(<DataComponent />);
  
  // Wait for async data
  const element = await screen.findByText('Data loaded');
  expect(element).toBeInTheDocument();
});
```

---

## Coverage Targets

**Global threshold: 80% minimum**

Enforced metrics:
- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

If coverage drops below 80%, tests will fail.

---

## Troubleshooting

### Issue: Test timeout

**Solution:** Increase timeout

```typescript
jest.setTimeout(30000); // 30 seconds
```

### Issue: Module not found

**Solution:** Check moduleNameMapper in jest.config.js

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Issue: Async test hangs

**Solution:** Await promises

```typescript
// ❌ Wrong
it('should fetch', () => {
  service.fetch().then(data => {
    expect(data).toBeDefined();
  });
});

// ✅ Correct
it('should fetch', async () => {
  const data = await service.fetch();
  expect(data).toBeDefined();
});
```

### Issue: React Testing Library not found

**Solution:** Check package.json has dependency

```bash
npm list @testing-library/react
```

---

## Accessibility Testing

Add jest-axe tests for WCAG AA compliance:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button - Accessibility', () => {
  it('should not have a11y violations', async () => {
    const { container } = render(<Button label="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Storybook Stories

Create alongside test files:

```typescript
// File: Button.stories.tsx
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

export const Disabled: Story = {
  args: { label: 'Button', disabled: true },
};
```

---

## Documentation Reference

| Need | Document | Location |
|---|---|---|
| Full guide | Testing Infrastructure | `/docs/TESTING_INFRASTRUCTURE.md` |
| Test templates | Test Templates Reference | `/docs/TEST_TEMPLATES.md` |
| Jest configs | Jest Config Templates | `/JEST_CONFIG_TEMPLATES.md` |
| Coverage details | Coverage Strategy | `/docs/COVERAGE_STRATEGY.md` |
| Status & roadmap | Readiness Report | `/TESTING_READINESS_REPORT.md` |

---

## Daily Workflow

1. **Morning:** Review your component/feature
2. **Write test first** (TDD): Create test file from template
3. **Implement feature:** Write code to pass tests
4. **Run tests:** `npm test -- --watch`
5. **Check coverage:** `npm test -- --coverage`
6. **Before PR:**
   - All tests pass
   - Coverage ≥ 80%
   - Accessibility tests pass
   - No console errors

---

## Success Checklist

Before each commit:

- [ ] Tests written for code changes
- [ ] All tests pass (`npm test`)
- [ ] Coverage ≥ 80% (`npm test -- --coverage`)
- [ ] No console warnings/errors
- [ ] Accessibility tests pass (jest-axe)
- [ ] Storybook stories added (if component)
- [ ] Edge cases covered

---

## Need Help?

1. **Test patterns:** See `/docs/TEST_TEMPLATES.md`
2. **Configuration:** See `/JEST_CONFIG_TEMPLATES.md`
3. **Coverage strategy:** See `/docs/COVERAGE_STRATEGY.md`
4. **Full guide:** See `/docs/TESTING_INFRASTRUCTURE.md`
5. **Status:** See `/TESTING_READINESS_REPORT.md`

---

**Target:** 80%+ coverage by end of Week 2 ✅
