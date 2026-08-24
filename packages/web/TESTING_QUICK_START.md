# Component Testing Quick Start Guide

This guide provides everything needed to write comprehensive tests for atomic components in this project.

## Prerequisites

All testing dependencies are already installed. Verify with:
```bash
npm list jest @testing-library/react jest-axe
```

## Test File Structure

Each component should have two test files in a `__tests__` directory:

```
components/atomic/
├── buttons/
│   ├── Button.tsx
│   └── __tests__/
│       ├── Button.test.tsx          # Unit tests
│       └── Button.a11y.test.tsx     # Accessibility tests
├── inputs/
│   ├── Input.tsx
│   └── __tests__/
│       ├── Input.test.tsx
│       └── Input.a11y.test.tsx
```

## Writing Unit Tests

### Basic Template

Create `components/atomic/[component]/__tests__/[Component].test.tsx`:

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<YourComponent />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick on click', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<YourComponent onClick={handleClick} />);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Test Categories

#### 1. Rendering Tests (8-10 tests)
```typescript
describe('Rendering', () => {
  it('should render with default props', () => {
    render(<Component />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    render(<Component variant="primary" />);
    expect(screen.getByRole('...')).toHaveClass('bg-blue-600');
  });

  it('should apply custom className', () => {
    render(<Component className="custom" />);
    expect(screen.getByRole('...')).toHaveClass('custom');
  });
});
```

#### 2. State Tests (3-5 tests)
```typescript
describe('Disabled State', () => {
  it('should render with disabled attribute', () => {
    render(<Component disabled />);
    expect(screen.getByRole('...')).toBeDisabled();
  });

  it('should not trigger handler when disabled', async () => {
    const handler = jest.fn();
    const user = userEvent.setup();
    
    render(<Component onClick={handler} disabled />);
    await user.click(screen.getByRole('...'));
    
    expect(handler).not.toHaveBeenCalled();
  });
});
```

#### 3. Event Handling (3-5 tests)
```typescript
describe('User Interactions', () => {
  it('should call onClick on click', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Component onClick={handleClick} />);
    await user.click(screen.getByRole('...'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', async () => {
    const handler = jest.fn();
    const user = userEvent.setup();
    
    render(<Component onKeyDown={handler} />);
    const element = screen.getByRole('...');
    element.focus();
    
    await user.keyboard('{Enter}');
    expect(handler).toHaveBeenCalled();
  });
});
```

#### 4. Props Forwarding (2-3 tests)
```typescript
describe('Props Forwarding', () => {
  it('should forward standard HTML attributes', () => {
    render(<Component id="test-id" data-testid="custom" />);
    expect(screen.getByTestId('custom')).toHaveAttribute('id', 'test-id');
  });

  it('should forward aria attributes', () => {
    render(<Component aria-label="Test label" />);
    expect(screen.getByRole('...')).toHaveAttribute('aria-label', 'Test label');
  });
});
```

#### 5. Snapshot Tests (3-5 tests)
```typescript
describe('Snapshots', () => {
  it('should match primary variant snapshot', () => {
    const { container } = render(<Component variant="primary" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

#### 6. Edge Cases (2-3 tests)
```typescript
describe('Edge Cases', () => {
  it('should render with empty children', () => {
    render(<Component></Component>);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle rapid prop changes', () => {
    const { rerender } = render(<Component variant="primary" />);
    rerender(<Component variant="secondary" />);
    expect(screen.getByRole('...')).toHaveClass('bg-gray-200');
  });
});
```

## Writing Accessibility Tests

Create `components/atomic/[component]/__tests__/[Component].a11y.test.tsx`:

```typescript
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { YourComponent } from '../YourComponent';

expect.extend(toHaveNoViolations);

describe('YourComponent - Accessibility (WCAG 2.1 AAA)', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have violations when disabled', async () => {
    const { container } = render(<YourComponent disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper contrast ratio', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support ARIA labels', async () => {
    const { container } = render(<YourComponent aria-label="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Key A11y Test Patterns

```typescript
// Test semantic HTML
describe('Semantic HTML', () => {
  it('should use proper semantic element', () => {
    const { container } = render(<Component />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});

// Test keyboard navigation
describe('Keyboard Navigation', () => {
  it('should be keyboard accessible', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test color contrast
describe('Color Contrast', () => {
  it('should have sufficient contrast', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Test focus states
describe('Focus States', () => {
  it('should have visible focus indicator', () => {
    const { container } = render(<Component />);
    expect(container.querySelector(':focus-visible')).toBeDefined();
  });
});

// Test ARIA attributes
describe('ARIA Attributes', () => {
  it('should support aria-label', async () => {
    const { container } = render(<Component aria-label="Label" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Common Testing Patterns

### Testing Variants
```typescript
it('should apply all variants correctly', () => {
  const variants = ['primary', 'secondary', 'tertiary'] as const;

  variants.forEach(variant => {
    const { unmount } = render(<Component variant={variant} />);
    expect(screen.getByRole('...')).toHaveClass(`variant-${variant}`);
    unmount();
  });
});
```

### Testing with User Event
```typescript
import userEvent from '@testing-library/user-event';

it('should handle user interactions', async () => {
  const user = userEvent.setup(); // For proper async handling
  render(<Component />);
  
  await user.click(screen.getByRole('...'));
  await user.keyboard('{Enter}');
  await user.hover(screen.getByRole('...'));
});
```

### Testing Ref Forwarding
```typescript
it('should forward ref', () => {
  const ref = React.createRef<HTMLButtonElement>();
  render(<Component ref={ref} />);
  
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  ref.current?.focus();
  expect(ref.current).toHaveFocus();
});
```

### Testing Children
```typescript
it('should render children content', () => {
  render(
    <Component>
      <span data-testid="child">Child content</span>
    </Component>
  );
  expect(screen.getByTestId('child')).toBeInTheDocument();
});
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Component Tests
```bash
npm test -- components/atomic/buttons/__tests__
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Run Single Test File
```bash
npm test -- components/atomic/buttons/__tests__/Button.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should render"
```

## Coverage Report

After running tests with coverage, view the detailed report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Thresholds
Each component should achieve:
- **Statements:** 80%+
- **Branches:** 80%+
- **Functions:** 80%+
- **Lines:** 80%+

## Snapshot Testing

Snapshots are useful for catching unintended visual changes.

### Updating Snapshots
```bash
npm test -- -u  # Update all snapshots
npm test -- components/atomic/buttons/__tests__ -u  # Update specific component
```

### When to Use Snapshots
- ✓ Component structure changes
- ✓ Variant rendering
- ✓ State changes affecting UI
- ✗ Exact pixel dimensions (too fragile)
- ✗ Animated values (use static snapshots)

## Best Practices

### 1. Use semantic queries
```typescript
// Good
screen.getByRole('button', { name: /click me/i })

// Avoid
screen.getByClassName('btn-primary')
```

### 2. Test user behavior, not implementation
```typescript
// Good - tests what user sees
it('should show error message when invalid', () => {
  render(<Component value="invalid" />);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});

// Avoid - tests internal state
it('should set state.error to true', () => {
  // Don't test internal implementation
});
```

### 3. Keep tests independent
```typescript
// Good - each test is self-contained
describe('Component', () => {
  it('test 1', () => {
    render(<Component />);
    // test logic
  });

  it('test 2', () => {
    render(<Component />);
    // test logic
  });
});

// Avoid - shared state between tests
let component;
beforeAll(() => {
  component = render(<Component />);
});
```

### 4. Use descriptive test names
```typescript
// Good
it('should display error message when email is invalid')

// Avoid
it('works')
it('test 1')
```

### 5. Follow the AAA pattern (Arrange, Act, Assert)
```typescript
it('should call onClick handler', async () => {
  // Arrange
  const handleClick = jest.fn();
  const user = userEvent.setup();
  render(<Component onClick={handleClick} />);

  // Act
  await user.click(screen.getByRole('button'));

  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Troubleshooting

### Common Issues

**"Cannot find module" error**
- Ensure all dependencies are installed: `npm ci`
- Check import paths use correct relative paths

**"jest-axe is not defined"**
- Add `expect.extend(toHaveNoViolations)` after imports in a11y tests

**"React Testing Library not found"**
- Verify jest.setup.js is loaded: check jest.config.js setupFilesAfterEnv

**Tests timeout**
- Increase timeout in jest.config.js: `testTimeout: 10000`
- Check for unresolved promises

**Snapshot mismatch**
- Review the change: `npm test -- -u` to update if correct
- Press 'u' during watch mode to update interactively

## References

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest API Reference](https://jestjs.io/docs/api)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
