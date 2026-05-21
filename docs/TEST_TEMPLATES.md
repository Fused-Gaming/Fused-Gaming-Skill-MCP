# Test Templates Reference

Quick reference for common testing patterns across the monorepo.

## 1. Unit Test - Service Class

**Location:** `packages/<pkg>/tests/service-name.test.ts`

```typescript
/**
 * @test ServiceName
 * @description Unit tests for ServiceName class
 * @coverage Method logic, error handling, edge cases
 */

import { ServiceName } from '../src/service-name.js';
import { ValidationError } from '../src/errors.js';

describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    service = new ServiceName();
  });

  describe('constructor', () => {
    it('should initialize with default state', () => {
      expect(service).toBeDefined();
      expect(service.isReady()).toBe(true);
    });

    it('should accept configuration options', () => {
      const configured = new ServiceName({ timeout: 5000 });
      expect(configured.config.timeout).toBe(5000);
    });
  });

  describe('method: validateInput', () => {
    it('should pass valid input', () => {
      const valid = { id: 'abc-123', name: 'Test' };
      expect(() => service.validateInput(valid)).not.toThrow();
    });

    it('should throw ValidationError for invalid input', () => {
      expect(() => service.validateInput({})).toThrow(ValidationError);
    });

    it('should provide detailed error messages', () => {
      try {
        service.validateInput({ id: '' });
      } catch (error: any) {
        expect(error.message).toContain('id is required');
      }
    });
  });

  describe('method: processAsync', () => {
    it('should return promise', () => {
      const result = service.processAsync({});
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve with processed data', async () => {
      const data = await service.processAsync({ value: 42 });
      expect(data).toHaveProperty('processed', true);
    });

    it('should handle promise rejection', async () => {
      await expect(service.processAsync({ invalid: true }))
        .rejects.toThrow();
    });

    it('should respect timeout', async () => {
      jest.useFakeTimers();
      const promise = service.processAsync({});
      jest.advanceTimersByTime(6000);
      await expect(promise).rejects.toThrow('timeout');
      jest.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should gracefully handle null inputs', () => {
      expect(() => service.processData(null as any))
        .toThrow('Input cannot be null');
    });

    it('should provide error context', () => {
      try {
        service.validate({ age: 'not-a-number' });
      } catch (error: any) {
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('context');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty string input', () => {
      const result = service.process('');
      expect(result).toEqual({ processed: true, data: null });
    });

    it('should handle very large numbers', () => {
      const large = Number.MAX_SAFE_INTEGER;
      const result = service.calculate(large);
      expect(result).toBeDefined();
    });

    it('should handle special characters', () => {
      const special = '<script>alert("xss")</script>';
      const result = service.sanitize(special);
      expect(result).not.toContain('<script>');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

---

## 2. Integration Test - Service with Dependencies

**Location:** `packages/<pkg>/tests/integration/service.integration.test.ts`

```typescript
/**
 * @test ServiceName Integration
 * @description Tests with real dependencies, mocked only external APIs
 * @prerequisites Database, cache initialized
 */

import { ServiceName } from '../../src/service-name.js';
import { Repository } from '../../src/repository.js';
import { Cache } from '../../src/cache.js';

jest.mock('../../src/external-api.js');
const mockApi = require('../../src/external-api.js');

describe('ServiceName Integration', () => {
  let service: ServiceName;
  let repository: Repository;
  let cache: Cache;

  beforeAll(async () => {
    // Setup real dependencies
    cache = new Cache();
    repository = new Repository();
    await repository.connect();
  });

  beforeEach(() => {
    service = new ServiceName(repository, cache);
    jest.clearAllMocks();
  });

  describe('data flow', () => {
    it('should create and retrieve entity', async () => {
      // Arrange
      const input = { name: 'Test Entity', value: 100 };

      // Act
      const created = await service.create(input);
      const retrieved = await service.getById(created.id);

      // Assert
      expect(retrieved).toEqual(expect.objectContaining(input));
      expect(retrieved.id).toBe(created.id);
    });

    it('should update entity in repository and clear cache', async () => {
      // Setup
      const entity = await service.create({ name: 'Original' });
      const cachedVersion = await service.getById(entity.id);

      // Update
      await service.update(entity.id, { name: 'Updated' });

      // Verify
      const fresh = await repository.getById(entity.id);
      expect(fresh.name).toBe('Updated');

      // Verify cache invalidated
      const cached = await service.getById(entity.id);
      expect(cached.name).toBe('Updated');
    });
  });

  describe('error recovery', () => {
    it('should retry on transient API failure', async () => {
      mockApi.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { id: '123' } });

      const result = await service.fetchRemote('123');

      expect(result).toBeDefined();
      expect(mockApi.fetch).toHaveBeenCalledTimes(2);
    });

    it('should fail gracefully after max retries', async () => {
      mockApi.fetch.mockRejectedValue(new Error('API down'));

      await expect(service.fetchRemote('123')).rejects.toThrow(
        'Max retries exceeded'
      );
    });
  });

  describe('concurrency', () => {
    it('should handle concurrent requests', async () => {
      const ids = Array.from({ length: 10 }, (_, i) => String(i));

      const results = await Promise.all(
        ids.map(id => service.getById(id))
      );

      expect(results).toHaveLength(10);
      expect(results.every(r => r !== null)).toBe(true);
    });

    it('should not have race conditions on update', async () => {
      const entity = await service.create({ value: 0 });

      const updates = Array.from({ length: 5 }, (_, i) =>
        service.increment(entity.id)
      );

      await Promise.all(updates);

      const final = await service.getById(entity.id);
      expect(final.value).toBe(5);
    });
  });

  afterAll(async () => {
    await repository.disconnect();
  });
});
```

---

## 3. React Component - Unit Test

**Location:** `packages/<pkg>/src/components/Button/__tests__/Button.test.tsx`

```typescript
/**
 * @test Button Component
 * @description Unit tests for Button atomic component
 * @coverage Rendering, events, variants, accessibility states
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with label prop', () => {
      render(<Button label="Click me" />);
      expect(screen.getByRole('button', { name: /click me/i }))
        .toBeInTheDocument();
    });

    it('should apply variant prop as CSS class', () => {
      const { rerender } = render(
        <Button label="Test" variant="primary" />
      );
      expect(screen.getByRole('button'))
        .toHaveClass('btn--primary');

      rerender(<Button label="Test" variant="secondary" />);
      expect(screen.getByRole('button'))
        .toHaveClass('btn--secondary');
    });

    it('should render with size variants', () => {
      render(<Button label="Test" size="lg" />);
      expect(screen.getByRole('button'))
        .toHaveClass('btn--lg');
    });

    it('should render with icon slot', () => {
      render(
        <Button label="Test">
          <span data-testid="icon">Icon</span>
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled attribute', () => {
      render(<Button label="Test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show disabled styling', () => {
      render(<Button label="Test" disabled />);
      expect(screen.getByRole('button'))
        .toHaveClass('btn--disabled');
    });

    it('should not trigger click handler when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button label="Test" onClick={handleClick} disabled />
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      render(<Button label="Test" isLoading />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should disable button during loading', () => {
      render(<Button label="Test" isLoading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should hide label during loading', () => {
      render(<Button label="Test" isLoading />);
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick on click', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button label="Test" onClick={handleClick} />);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger click on Enter key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button label="Test" onClick={handleClick} />);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should trigger click on Space key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button label="Test" onClick={handleClick} />);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should handle rapid clicks with debounce', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup({ delay: null });

      render(
        <Button label="Test" onClick={handleClick} debounce={100} />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Link Button', () => {
    it('should render as link when href provided', () => {
      render(<Button label="Test" href="/path" />);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/path');
    });

    it('should open in new tab with target', () => {
      render(
        <Button
          label="External"
          href="https://example.com"
          target="_blank"
        />
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Snapshots', () => {
    it('should match primary variant snapshot', () => {
      const { container } = render(
        <Button label="Primary" variant="primary" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match disabled state snapshot', () => {
      const { container } = render(
        <Button label="Disabled" disabled />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
```

---

## 4. Accessibility Test

**Location:** `packages/<pkg>/src/components/Button/__tests__/Button.a11y.test.tsx`

```typescript
/**
 * @test Button - Accessibility (WCAG 2.1 AA)
 * @description Jest-axe automated accessibility testing
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button - Accessibility', () => {
  it('should not have accessibility violations in default state', async () => {
    const { container } = render(
      <Button label="Click me" variant="primary" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have violations when disabled', async () => {
    const { container } = render(
      <Button label="Disabled button" disabled />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper contrast ratios', async () => {
    const { container } = render(
      <Button label="Test" variant="secondary" />
    );
    const results = await axe(container);
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    expect(contrastViolations).toHaveLength(0);
  });

  it('should have proper ARIA labels', async () => {
    const { container } = render(
      <Button label="Save changes" aria-label="Save all changes" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard accessible', async () => {
    const { container } = render(
      <Button label="Keyboard navigation test" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## 5. Mock Utilities

**Location:** `jest/mocks.ts`

```typescript
/**
 * Jest Mock Utilities
 * Factories and helpers for common test mocks
 */

// localStorage mock
export const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

// Fetch mock
export const createFetchMock = (response: any, status = 200) => {
  return jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  );
};

// User factory
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date(),
  ...overrides,
});

// Session factory
export const createMockSession = (overrides = {}) => ({
  token: 'test-token',
  userId: 'user-123',
  email: 'test@example.com',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  ...overrides,
});
```

---

## 6. Test Setup File

**Location:** `jest/setup.js` (for jsdom tests)

```javascript
/**
 * Jest Setup File
 * Runs before all tests
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

// Suppress specific console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

