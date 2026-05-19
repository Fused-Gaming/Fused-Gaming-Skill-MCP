# 🏗️ Atomic Components Architecture (Phase-2)

**Document:** SPECIALIST-1 ARCHITECTURE DESIGN
**Author:** Queen Coordinator (Specialist-1 Agent)
**Date:** 2026-05-19
**Status:** APPROVED FOR EXECUTION

---

## Executive Summary

The Atomic Components Library implements a **hierarchical UI component system** using React 18+, TypeScript strict mode, and design tokens. Components are organized in three tiers:

1. **Atoms** (20 fundamental building blocks)
2. **Compounds** (composite components from atoms)
3. **Patterns** (high-order application patterns)

This document establishes the architecture for Phase-2 (Atoms only).

---

## 1. Directory Structure

```
packages/design-tokens/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── buttons/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   ├── IconButton.tsx
│   │   │   │   ├── IconButton.test.tsx
│   │   │   │   ├── IconButton.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── inputs/
│   │   │   │   ├── TextInput.tsx
│   │   │   │   ├── TextInput.test.tsx
│   │   │   │   ├── TextInput.stories.tsx
│   │   │   │   └── ... (NumberInput, SearchInput, PasswordInput)
│   │   │   ├── displays/
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Chip.tsx
│   │   │   │   ├── Tag.tsx
│   │   │   │   └── Label.tsx
│   │   │   ├── structure/
│   │   │   │   ├── Divider.tsx
│   │   │   │   ├── Spacer.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   └── Grid.tsx
│   │   │   ├── feedback/
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── index.ts (barrel export)
│   │   ├── compounds/ (Phase-2B, future)
│   │   └── patterns/ (Phase-2C, future)
│   ├── types/
│   │   └── components.ts (shared component interfaces)
│   ├── tokens/
│   └── index.ts
├── dist/
└── package.json
```

---

## 2. Base Component Architecture

### 2.1 Component Interface Pattern

All atoms extend a common base interface for consistency:

```typescript
// packages/design-tokens/src/types/components.ts

import React from 'react';

/**
 * Base props for all atomic components
 * Extends native HTML element attributes
 */
export interface BaseComponentProps {
  /**
   * CSS class name for styling
   */
  className?: string;

  /**
   * Inline CSS styles
   */
  style?: React.CSSProperties;

  /**
   * Data attributes for testing/analytics
   */
  'data-testid'?: string;
  'data-qa'?: string;

  /**
   * ARIA accessibility attributes
   */
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-disabled'?: boolean;
}

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Input component props
 */
export interface InputProps extends BaseComponentProps, React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
  isDisabled?: boolean;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Badge/Display component props
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  maxCount?: number;
  children?: React.ReactNode;
}

/**
 * Container/Layout component props
 */
export interface ContainerProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '100%';
  children?: React.ReactNode;
}

/**
 * Grid layout component props
 */
export interface GridProps extends ContainerProps {
  columns?: number | { sm: number; md: number; lg: number };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rows?: 'auto' | 'equal';
}

/**
 * Alert/Feedback component props
 */
export interface AlertProps extends BaseComponentProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  icon?: React.ReactNode;
  closeable?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

/**
 * Spinner/Loading component props
 */
export interface SpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
}
```

---

### 2.2 Component Template

Every atom component follows this template:

```typescript
import React, { forwardRef, memo } from 'react';
import type { ButtonProps } from '../types/components.js';
import { designSystem } from '../tokens/index.js';
import './Button.css'; // Optional CSS Module

/**
 * Button Component
 * 
 * A fundamental button element with multiple variants and sizes.
 * Supports loading states and icon positioning.
 * 
 * @example
 * ```tsx
 * <Button variant="primary">Click Me</Button>
 * <Button variant="secondary" size="lg">Large Button</Button>
 * <Button isLoading>Processing...</Button>
 * ```
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        isDisabled = false,
        fullWidth = false,
        className,
        style,
        children,
        ...restProps
      },
      ref
    ) => {
      // Compute derived styles using design tokens
      const buttonStyle: React.CSSProperties = {
        ...designSystem.components.button[variant]?.[size],
        width: fullWidth ? '100%' : 'auto',
        opacity: isDisabled || isLoading ? 0.6 : 1,
        cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
        ...style,
      };

      return (
        <button
          ref={ref}
          className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className || ''}`}
          style={buttonStyle}
          disabled={isDisabled || isLoading}
          aria-busy={isLoading}
          aria-disabled={isDisabled}
          {...restProps}
        >
          {isLoading ? <Spinner size="sm" /> : children}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';
```

---

## 3. Design Token Integration

### 3.1 Token Reference Pattern

Components access design tokens through the `designSystem` object:

```typescript
import { designSystem } from '@h4shed/design-tokens';

// Colors
designSystem.colors.action.primary
designSystem.colors.action.secondary
designSystem.colors.status.success
designSystem.colors.status.error

// Typography
designSystem.typography.body.md
designSystem.typography.heading.h3

// Spacing
designSystem.spacing[2]    // xs
designSystem.spacing[4]    // sm
designSystem.spacing[8]    // md
designSystem.spacing[12]   // lg
designSystem.spacing[16]   // xl

// Shadows
designSystem.shadows.elevation[1]
designSystem.shadows.elevation[2]

// Motion
designSystem.motion.duration.fast
designSystem.motion.easing.easeInOut
```

### 3.2 Component Token Enhancement

Extend `packages/design-tokens/src/tokens/components.ts` with atom-specific tokens:

```typescript
// packages/design-tokens/src/tokens/components.ts

export const atomTokens = {
  button: {
    primary: {
      xs: {
        padding: '4px 8px',
        fontSize: '12px',
        borderRadius: '4px',
        backgroundColor: colors.action.primary,
        color: colors.neutrals.white,
      },
      sm: {
        padding: '6px 12px',
        fontSize: '13px',
      },
      md: {
        padding: '8px 16px',
        fontSize: '14px',
      },
      lg: {
        padding: '12px 24px',
        fontSize: '16px',
      },
      xl: {
        padding: '16px 32px',
        fontSize: '18px',
      },
    },
    secondary: {
      // Similar structure
    },
    danger: {
      // Similar structure
    },
  },
  input: {
    default: {
      sm: {
        padding: '6px 12px',
        fontSize: '13px',
        border: `1px solid ${colors.neutrals.border}`,
      },
      // ... md, lg
    },
  },
  // ... other atoms
};
```

---

## 4. Testing Strategy

### 4.1 Test File Organization

Each component has three files:
- `Button.tsx` - Implementation
- `Button.test.tsx` - Unit & integration tests
- `Button.stories.tsx` - Storybook documentation

### 4.2 Test Coverage Requirements

```
Minimum coverage targets:
- Statements: 80%
- Branches: 80%
- Lines: 80%
- Functions: 80%
```

### 4.3 Test Categories

1. **Render Tests** - Component renders without error
2. **Props Tests** - All prop combinations work correctly
3. **Event Tests** - Event handlers fire appropriately
4. **Accessibility Tests** - ARIA attributes present and correct
5. **Forward Ref Tests** - forwardRef works correctly
6. **Variant Tests** - All variants render with correct styles

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept all HTML button attributes', () => {
      render(<Button id="test-btn" data-testid="btn">Button</Button>);
      expect(screen.getByTestId('btn')).toHaveAttribute('id', 'test-btn');
    });

    it('should apply variant class', () => {
      render(<Button variant="secondary">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-secondary');
    });

    it('should apply size class', () => {
      render(<Button size="lg">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });
  });

  describe('Events', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes when disabled', () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Forward Ref', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it.each(['primary', 'secondary', 'danger'])('should render %s variant', (variant) => {
      const { container } = render(<Button variant={variant as any}>Button</Button>);
      expect(container.querySelector(`.btn-${variant}`)).toBeInTheDocument();
    });
  });
});
```

---

## 5. Storybook Documentation

### 5.1 Story File Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Processing...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    isDisabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};
```

---

## 6. TypeScript Strict Mode Compliance

### 6.1 Required tsconfig.json Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false
  }
}
```

### 6.2 Strict Mode Checklist

- [ ] All props interfaces explicitly typed
- [ ] All function return types explicit
- [ ] No `any` types (use generics or union types)
- [ ] All null/undefined cases handled
- [ ] All variables initialized with proper types
- [ ] No unused variables or imports
- [ ] All event handlers typed with proper signatures

---

## 7. Component Lifecycle & Hooks

### 7.1 Allowed Hooks

- `useState` - Local component state
- `useCallback` - Memoize callbacks for event handlers
- `useEffect` - Side effects only (minimize)
- `useRef` - Ref access (limited use)
- `useContext` - Design token context injection
- `useMemo` - Expensive computations

### 7.2 Hooks Best Practices

```typescript
// DO: Memoize callbacks
const handleClick = useCallback(() => {
  onClickHandler?.();
}, [onClickHandler]);

// DON'T: Create functions in render
const handleClick = () => {
  onClickHandler?.();
};

// DO: Use memo for expensive computations
const computedStyle = useMemo(
  () => calculateStyle(variant, size),
  [variant, size]
);

// DO: Minimize effects
useEffect(() => {
  // Only when necessary
}, [dependency]);
```

---

## 8. Export & Barrel Files

### 8.1 Component-Level Exports

```typescript
// packages/design-tokens/src/components/atoms/buttons/index.ts
export { Button } from './Button.js';
export type { ButtonProps } from '../../types/components.js';
export { IconButton } from './IconButton.js';
export type { IconButtonProps } from '../../types/components.js';
```

### 8.2 Category-Level Exports

```typescript
// packages/design-tokens/src/components/atoms/index.ts
// Buttons
export { Button, IconButton, FloatingActionButton } from './buttons/index.js';
export type { ButtonProps, IconButtonProps, FloatingActionButtonProps } from '../types/components.js';

// Inputs
export { TextInput, NumberInput, SearchInput, PasswordInput } from './inputs/index.js';
export type { InputProps } from '../types/components.js';

// Displays
export { Badge, Chip, Tag, Label } from './displays/index.js';
export type { BadgeProps } from '../types/components.js';

// Structure
export { Divider, Spacer, Container, Grid } from './structure/index.js';
export type { ContainerProps, GridProps } from '../types/components.js';

// Feedback
export { Alert, Toast, Skeleton, Spinner } from './feedback/index.js';
export type { AlertProps, SpinnerProps } from '../types/components.js';
```

---

## 9. Quality Assurance Checkpoints

### 9.1 Pre-Commit Checks

```bash
# Component implementation ready
npm run lint -- packages/design-tokens/src/components
npm run typecheck -- packages/design-tokens/src/components
npm run test -- packages/design-tokens/src/components --coverage

# Required coverage: 80%+
```

### 9.2 Build Verification

```bash
npm run build
# Verify dist/ contains all type definitions (.d.ts files)
# Verify source maps present (.js.map files)
```

---

## 10. Implementation Checklist

- [ ] Directory structure created
- [ ] Component type interfaces defined
- [ ] Base component template validated
- [ ] Design token integration confirmed
- [ ] Test setup and patterns established
- [ ] Storybook configuration ready
- [ ] tsconfig.json strict mode validated
- [ ] CI/CD lint and typecheck passing
- [ ] Ready for Specialist-2 (Component Coder) execution

---

## 11. Phase-2 Implementation Schedule

**Week 1 (May 20-21): Buttons & Inputs**
- Button, IconButton, FloatingActionButton
- TextInput, NumberInput, SearchInput, PasswordInput

**Week 2 (May 22-23): Display & Structure**
- Badge, Chip, Tag, Label
- Divider, Spacer, Container, Grid

**Week 3 (May 23-24): Feedback Components**
- Alert, Toast, Skeleton, Spinner
- Integration & testing completion

---

**Architecture Status:** ✅ COMPLETE - READY FOR SPECIALIST-2
**Next Action:** Component Coder begins Button implementation on May 20
