# SyncPulse Component Architecture Reference
## Implementation Guide for Specialist 2 (Component Coder)

**Date**: May 21, 2026  
**Status**: Complete Architecture Specification  
**Ready for**: Implementation Phase

---

## Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [Styling System](#styling-system)
3. [Type Safety Patterns](#type-safety-patterns)
4. [Component Template](#component-template)
5. [Testing Patterns](#testing-patterns)
6. [Token Integration](#token-integration)
7. [Accessibility Guidelines](#accessibility-guidelines)

---

## Component Hierarchy

### Atomic Design Structure

```
Level 0: Design Tokens
  └─ Colors, Spacing, Typography, Motion, Shadows
     (See: packages/design-tokens/src/tokens/)

Level 1: Atoms (20 components)
  ├─ Buttons (3)
  │  ├─ Button
  │  ├─ IconButton
  │  └─ LinkButton
  │
  ├─ Inputs (2)
  │  ├─ Input
  │  └─ Textarea
  │
  ├─ Displays (6)
  │  ├─ Badge
  │  ├─ Chip
  │  ├─ Tag
  │  ├─ Heading
  │  ├─ Text
  │  └─ Code
  │
  ├─ Feedback (3)
  │  ├─ Spinner
  │  ├─ Skeleton
  │  └─ Progress
  │
  ├─ Controls (2)
  │  ├─ Toggle
  │  └─ Divider
  │
  └─ Layout (3)
     ├─ Flex
     ├─ Grid
     └─ Stack

Level 2: Molecules (4 components)
  ├─ Card
  ├─ Alert
  ├─ Modal
  └─ Toast

Level 3: Organisms (Future)
  ├─ Form (composition of Input + Button)
  ├─ Navigation
  ├─ Sidebar
  └─ etc.
```

### Dependency Graph

```
Design Tokens (no dependencies)
    ↓
Type System
    ↓
Utility Helpers
    ↓
Atoms (depend on tokens + utils)
    ├─ Buttons (depend on Spinner for loading state)
    ├─ Inputs (independent atoms)
    ├─ Displays (depend on Icon system)
    ├─ Feedback (depend on motion tokens)
    ├─ Controls (independent atoms)
    └─ Layout (composition of basic elements)
         ↓
    Molecules (depend on atoms + tokens)
    ├─ Card (uses Flex/Grid internally)
    ├─ Alert (uses Badge for icons)
    ├─ Modal (uses Buttons, might use Divider)
    └─ Toast (uses Button, motion tokens)
```

---

## Styling System

### CSS-in-JS Pattern

All components use **inline style objects** with **design token values**:

```typescript
// ❌ DO NOT DO THIS (hardcoded values):
const style = {
  backgroundColor: '#9333EA',
  padding: '16px',
  fontSize: '14px'
};

// ✅ DO THIS (token-based):
import { colors, spacing, typography } from '@h4shed/design-tokens';

const style = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
  fontSize: typography.fontSize.base,
  fontFamily: typography.fontFamily.body,
  transition: motion.transition.default
};
```

### Style Composition Levels

#### Level 1: Base Styles (Always Applied)
```typescript
const baseStyles: React.CSSProperties = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.base,
  lineHeight: typography.lineHeight.normal,
  margin: 0,
  padding: 0,
  border: 'none',
  boxSizing: 'border-box'
};
```

#### Level 2: Variant Styles (Based on Props)
```typescript
interface VariantStyles {
  [key: string]: React.CSSProperties;
}

const variantStyles: VariantStyles = {
  primary: {
    backgroundColor: colors.primary[500],
    color: colors.text.primary,
    ...shadows.buttonDefault
  },
  secondary: {
    backgroundColor: colors.gray[600],
    color: colors.text.primary,
    ...shadows.buttonDefault
  },
  danger: {
    backgroundColor: colors.semantic.danger,
    color: colors.text.primary,
    ...shadows.buttonDefault
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.primary[500],
    border: `2px solid ${colors.border.default}`
  }
};
```

#### Level 3: Size Styles (Scaling)
```typescript
interface SizeStyles {
  [key: string]: React.CSSProperties;
}

const sizeStyles: SizeStyles = {
  xs: {
    paddingTop: spacing[1],
    paddingRight: spacing[2],
    paddingBottom: spacing[1],
    paddingLeft: spacing[2],
    fontSize: typography.fontSize.xs
  },
  sm: {
    paddingTop: spacing[2],
    paddingRight: spacing[3],
    paddingBottom: spacing[2],
    paddingLeft: spacing[3],
    fontSize: typography.fontSize.sm
  },
  md: {
    paddingTop: spacing[2],
    paddingRight: spacing[4],
    paddingBottom: spacing[2],
    paddingLeft: spacing[4],
    fontSize: typography.fontSize.base
  },
  lg: {
    paddingTop: spacing[3],
    paddingRight: spacing[6],
    paddingBottom: spacing[3],
    paddingLeft: spacing[6],
    fontSize: typography.fontSize.lg
  },
  xl: {
    paddingTop: spacing[4],
    paddingRight: spacing[8],
    paddingBottom: spacing[4],
    paddingLeft: spacing[8],
    fontSize: typography.fontSize.xl
  }
};
```

#### Level 4: State Styles (Interactive)
```typescript
const stateStyles = {
  hover: (variant: string) => {
    if (variant === 'primary') {
      return {
        backgroundColor: colors.primary[600],
        ...shadows.buttonHover
      };
    }
    // ... other variants
  },
  active: (variant: string) => {
    if (variant === 'primary') {
      return {
        backgroundColor: colors.primary[700],
        ...shadows.buttonActive
      };
    }
  },
  disabled: {
    backgroundColor: colors.gray[600],
    color: colors.text.disabled,
    cursor: 'not-allowed',
    opacity: 0.6
  }
};
```

### Style Merging Strategy

```typescript
function mergeStyles(
  baseStyles: React.CSSProperties,
  variantStyles: React.CSSProperties,
  sizeStyles: React.CSSProperties,
  customClassName?: string
): React.CSSProperties {
  return {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles
  };
}
```

### CSS Variables (Optional Enhancement)

```css
/* In global stylesheet */
:root {
  --color-primary: #9333EA;
  --color-primary-hover: #7E22CE;
  --space-1: 4px;
  --space-2: 8px;
  --font-size-base: 1rem;
  --transition-default: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

```typescript
// Can reference in styles if desired (for dynamic theme switching):
const style = {
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--space-4)',
  transition: 'var(--transition-default)'
};
```

---

## Type Safety Patterns

### Props Interface Pattern

All component props must:
1. Extend the appropriate HTML element type
2. Omit the className property (handled by component)
3. Add custom props
4. Include full JSDoc

```typescript
/**
 * Button component props
 * 
 * Extends HTMLButtonElement with custom design system props
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps 
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * Additional CSS class names to apply
   * @default undefined
   */
  className?: string;

  /**
   * Visual variant of the button
   * 
   * - `primary`: Main CTA (purple neon)
   * - `secondary`: Alternative action (gray)
   * - `danger`: Destructive action (red)
   * - `ghost`: Minimal style (outline)
   * 
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /**
   * Size of the button
   * 
   * - `xs`: 8px height, 12px font
   * - `sm`: 12px height, 14px font
   * - `md`: 16px height, 16px font (default)
   * - `lg`: 24px height, 18px font
   * - `xl`: 32px height, 20px font
   * 
   * @default 'md'
   */
  size?: SizeVariant;

  /**
   * Button shape/border radius
   * 
   * - `sharp`: No border radius (0)
   * - `rounded`: Standard radius (6px)
   * - `pill`: Full rounded (999px)
   * 
   * @default 'rounded'
   */
  shape?: ShapeVariant;

  /**
   * Whether the button is in loading state
   * Disables interaction and shows spinner
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon element to display before text
   * @default undefined
   */
  icon?: React.ReactNode;

  /**
   * Icon element to display after text
   * @default undefined
   */
  iconRight?: React.ReactNode;

  /**
   * Whether the button takes full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Text to display during loading state
   * @example "Loading..."
   * @default undefined
   */
  loadingText?: string;
}
```

### Generic Type Helpers

```typescript
// For components that accept any HTML element type
export interface PolymorphicComponentProps<T extends React.ElementType = 'div'> {
  as?: T;
  children: React.ReactNode;
  className?: string;
}

// Usage:
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ as: Component = 'div', ...props }, ref) => (
    <Component ref={ref} {...props} />
  )
);
```

### Type Guards

```typescript
// Runtime type checking
function isValidVariant(value: unknown): value is ButtonVariant {
  return ['primary', 'secondary', 'danger', 'ghost'].includes(value as string);
}

// Usage in component
if (!isValidVariant(variant)) {
  console.warn(`Invalid variant: ${variant}, falling back to 'primary'`);
  variant = 'primary';
}
```

---

## Component Template

### Standard Component Structure

```typescript
/**
 * [ComponentName] Component
 * 
 * [One-paragraph description of purpose and typical use cases]
 * 
 * ## Features
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 * 
 * ## Accessibility
 * - Semantic HTML element
 * - Keyboard navigation support
 * - WCAG AA color contrast
 * 
 * @example
 * ```tsx
 * import { ComponentName } from '@h4shed/design-tokens/components';
 * 
 * export function MyComponent() {
 *   return (
 *     <ComponentName variant="primary" size="md">
 *       Content
 *     </ComponentName>
 *   );
 * }
 * ```
 * 
 * @see {@link ComponentNameProps} for prop details
 */

import React from 'react';
import type { ComponentNameProps } from '../../types/components.js';
import { colors, spacing, typography, motion, shadows } from '../../../tokens/index.js';

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

/**
 * Base styles applied to all instances
 */
const baseStyles: React.CSSProperties = {
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.base,
  margin: 0,
  padding: 0,
  border: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: motion.transition.default,
  borderRadius: '0.375rem' // Default rounded
};

/**
 * Variant-specific styles
 */
const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.primary[500],
    color: colors.text.primary,
    boxShadow: shadows.buttonDefault
  },
  secondary: {
    backgroundColor: colors.gray[600],
    color: colors.text.primary,
    boxShadow: shadows.buttonDefault
  },
  danger: {
    backgroundColor: colors.semantic.danger,
    color: colors.text.primary,
    boxShadow: shadows.buttonDefault
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.primary[500],
    border: `2px solid ${colors.border.default}`
  }
};

/**
 * Size-specific styles
 */
const sizeStyles: Record<string, React.CSSProperties> = {
  xs: {
    paddingTop: spacing[1],
    paddingRight: spacing[2],
    paddingBottom: spacing[1],
    paddingLeft: spacing[2],
    fontSize: typography.fontSize.xs,
    minHeight: '24px'
  },
  sm: {
    paddingTop: spacing[2],
    paddingRight: spacing[3],
    paddingBottom: spacing[2],
    paddingLeft: spacing[3],
    fontSize: typography.fontSize.sm,
    minHeight: '32px'
  },
  md: {
    paddingTop: spacing[2],
    paddingRight: spacing[4],
    paddingBottom: spacing[2],
    paddingLeft: spacing[4],
    fontSize: typography.fontSize.base,
    minHeight: '40px'
  },
  lg: {
    paddingTop: spacing[3],
    paddingRight: spacing[6],
    paddingBottom: spacing[3],
    paddingLeft: spacing[6],
    fontSize: typography.fontSize.lg,
    minHeight: '48px'
  },
  xl: {
    paddingTop: spacing[4],
    paddingRight: spacing[8],
    paddingBottom: spacing[4],
    paddingLeft: spacing[8],
    fontSize: typography.fontSize.xl,
    minHeight: '56px'
  }
};

/**
 * Shape-specific border radius
 */
const shapeStyles: Record<string, React.CSSProperties> = {
  sharp: { borderRadius: '0' },
  rounded: { borderRadius: '0.375rem' },
  pill: { borderRadius: '999px' }
};

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

/**
 * ComponentName - [Brief description]
 * 
 * @param props - Component props
 * @param ref - Forward reference to HTML element
 * 
 * @returns React component
 * 
 * @throws {Error} When required props are missing
 */
export const ComponentName = React.forwardRef<
  HTMLButtonElement,
  ComponentNameProps
>(
  (
    {
      // Destructure props with defaults
      variant = 'primary',
      size = 'md',
      shape = 'rounded',
      className = '',
      disabled = false,
      isLoading = false,
      children,
      
      // Spread remaining native props
      ...nativeProps
    },
    ref
  ) => {
    // ========================================================================
    // VALIDATION & NORMALIZATION
    // ========================================================================
    
    // Validate variant
    if (!Object.hasOwn(variantStyles, variant)) {
      console.warn(
        `ComponentName: Invalid variant "${variant}", falling back to "primary"`
      );
      variant = 'primary';
    }

    // Validate size
    if (!Object.hasOwn(sizeStyles, size)) {
      console.warn(
        `ComponentName: Invalid size "${size}", falling back to "md"`
      );
      size = 'md';
    }

    // Compute disabled state (from prop or loading)
    const isDisabled = disabled || isLoading;

    // ========================================================================
    // STYLE COMPOSITION
    // ========================================================================
    
    // Merge style objects for final result
    const computedStyle: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...shapeStyles[shape],
      
      // State-based overrides
      ...(isDisabled && {
        opacity: 0.6,
        cursor: 'not-allowed',
        backgroundColor: colors.gray[600],
        color: colors.text.disabled
      })
    };

    // ========================================================================
    // RENDER
    // ========================================================================
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={className}
        style={computedStyle}
        aria-busy={isLoading}
        aria-disabled={disabled}
        {...nativeProps}
      >
        {isLoading && <Spinner size="sm" variant="primary" />}
        {children}
      </button>
    );
  }
);

// Set display name for debugging
ComponentName.displayName = 'ComponentName';

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Memoized version for performance optimization
 * Use when component is used frequently with same props
 */
export const MemoizedComponentName = React.memo(ComponentName);
```

### Variation: Display Component

```typescript
/**
 * Text Component - Typographic element with rich control
 */

export const Text = React.forwardRef<
  HTMLParagraphElement,
  TextProps
>(
  (
    {
      size = 'md',
      intent = 'primary',
      weight = 'normal',
      lineHeight = 'normal',
      textTransform = 'none',
      muted = false,
      truncate = false,
      maxLines = undefined,
      align = 'left',
      className = '',
      style,
      children,
      ...nativeProps
    },
    ref
  ) => {
    const computedStyle: React.CSSProperties = {
      ...style,
      fontSize: sizeFontMap[size],
      color: muted ? colors.text.muted : intentColorMap[intent],
      fontWeight: fontWeightMap[weight],
      lineHeight: lineHeightMap[lineHeight],
      textTransform,
      textAlign: align,
      // Truncation
      ...(truncate && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }),
      ...(maxLines && {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
        overflow: 'hidden'
      })
    };

    return (
      <p
        ref={ref}
        className={className}
        style={computedStyle}
        {...nativeProps}
      >
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';
```

---

## Testing Patterns

### Component Test Template

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

// Register jest-axe matchers
expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  // ========================================================================
  // RENDERING TESTS
  // ========================================================================
  
  describe('Rendering', () => {
    it('renders with required props', () => {
      render(<ComponentName>Content</ComponentName>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders as correct HTML element', () => {
      const { container } = render(<ComponentName>Test</ComponentName>);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      const { container } = render(
        <ComponentName className="custom-class">Test</ComponentName>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('accepts style prop', () => {
      const { container } = render(
        <ComponentName style={{ color: 'red' }}>Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle('color: red');
    });

    it('accepts data attributes', () => {
      render(<ComponentName data-testid="component">Test</ComponentName>);
      expect(screen.getByTestId('component')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // VARIANT TESTS
  // ========================================================================
  
  describe('Variants', () => {
    it('renders primary variant', () => {
      const { container } = render(
        <ComponentName variant="primary">Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle(`background-color: ${colors.primary[500]}`);
    });

    it('renders secondary variant', () => {
      const { container } = render(
        <ComponentName variant="secondary">Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle(`background-color: ${colors.gray[600]}`);
    });

    it('renders danger variant', () => {
      const { container } = render(
        <ComponentName variant="danger">Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle(
        `background-color: ${colors.semantic.danger}`
      );
    });

    it('renders ghost variant', () => {
      const { container } = render(
        <ComponentName variant="ghost">Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle('background-color: transparent');
    });

    it('defaults to primary variant when invalid', () => {
      const { container } = render(
        <ComponentName variant="invalid" as any>Test</ComponentName>
      );
      expect(container.firstChild).toHaveStyle(`background-color: ${colors.primary[500]}`);
    });
  });

  // ========================================================================
  // SIZE TESTS
  // ========================================================================
  
  describe('Sizes', () => {
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      it(`renders ${size} size`, () => {
        const { container } = render(
          <ComponentName size={size as any}>Test</ComponentName>
        );
        const element = container.firstChild as HTMLElement;
        expect(element).toHaveStyle(`font-size: ${typographyFontSizeMap[size]}`);
      });
    });
  });

  // ========================================================================
  // INTERACTION TESTS
  // ========================================================================
  
  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handler = jest.fn();
      render(<ComponentName onClick={handler}>Test</ComponentName>);
      
      const user = userEvent.setup();
      await user.click(screen.getByText('Test'));
      
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state', async () => {
      const handler = jest.fn();
      render(
        <ComponentName disabled onClick={handler}>
          Test
        </ComponentName>
      );
      
      const user = userEvent.setup();
      const button = screen.getByText('Test');
      
      expect(button).toBeDisabled();
      
      // Disabled elements don't trigger click
      await user.click(button);
      expect(handler).not.toHaveBeenCalled();
    });

    it('handles loading state', async () => {
      const { container, rerender } = render(
        <ComponentName isLoading={false}>Test</ComponentName>
      );
      
      expect(container.querySelector('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
      
      rerender(<ComponentName isLoading={true}>Test</ComponentName>);
      
      expect(container.querySelector('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    });
  });

  // ========================================================================
  // KEYBOARD TESTS
  // ========================================================================
  
  describe('Keyboard Navigation', () => {
    it('receives focus via Tab', async () => {
      render(<ComponentName>Test</ComponentName>);
      
      const user = userEvent.setup();
      const button = screen.getByText('Test');
      
      expect(button).not.toHaveFocus();
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('activates with Enter key', async () => {
      const handler = jest.fn();
      render(<ComponentName onClick={handler}>Test</ComponentName>);
      
      const user = userEvent.setup();
      const button = screen.getByText('Test');
      
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('activates with Space key', async () => {
      const handler = jest.fn();
      render(<ComponentName onClick={handler}>Test</ComponentName>);
      
      const user = userEvent.setup();
      const button = screen.getByText('Test');
      
      button.focus();
      await user.keyboard(' ');
      
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  // ========================================================================
  // ACCESSIBILITY TESTS
  // ========================================================================
  
  describe('Accessibility', () => {
    it('passes axe accessibility audit', async () => {
      const { container } = render(
        <ComponentName>Test</ComponentName>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      const { container } = render(
        <ComponentName disabled={false} isLoading={false}>
          Test
        </ComponentName>
      );
      
      expect(container.firstChild).toHaveAttribute('aria-disabled', 'false');
      expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
    });

    it('has sufficient color contrast', () => {
      // Color contrast validation
      // Requires actual color values for calculation
      expect(colorContrast(colors.primary[500], colors.text.primary)).toBeGreaterThanOrEqual(4.5);
    });
  });

  // ========================================================================
  // REF FORWARDING TESTS
  // ========================================================================
  
  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<ComponentName ref={ref}>Test</ComponentName>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Test');
    });

    it('allows calling focus() via ref', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<ComponentName ref={ref}>Test</ComponentName>);
      
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  // ========================================================================
  // SNAPSHOT TESTS (use sparingly)
  // ========================================================================
  
  it('matches snapshot', () => {
    const { container } = render(
      <ComponentName variant="primary" size="md">
        Test
      </ComponentName>
    );
    
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

---

## Token Integration

### Token Import Pattern

```typescript
// ❌ DO NOT: Import entire token objects
import * as tokens from '@h4shed/design-tokens';

// ✅ DO: Import specific token categories
import { colors, spacing, typography, motion, shadows } 
  from '@h4shed/design-tokens';

// ✅ EVEN BETTER: Import named values when possible
import { colors } from '@h4shed/design-tokens/colors';
```

### Token Usage Examples

```typescript
// Colors
colors.primary[500]              // Base primary color
colors.primary[600]              // Darker variant
colors.semantic.success           // Semantic intent
colors.neon.plasma                // Neon effect
colors.text.primary               // Text color
colors.background.base            // Background color

// Spacing
spacing[1]    // 4px
spacing[2]    // 8px
spacing[4]    // 16px
spacing[6]    // 24px
spacing[8]    // 32px

// Typography
typography.fontSize.base          // 16px
typography.fontWeight.bold        // 700
typography.fontFamily.body        // Inter/Manrope
typography.textStyles.h1          // Complete H1 style object
typography.lineHeight.relaxed     // 1.75
typography.letterSpacing.wide     // 0.025em

// Motion
motion.duration.normal            // 280ms
motion.easing.default             // Cubic-bezier curve
motion.animation.pulse            // Predefined animation
motion.transition.default         // Transition preset
motion.transition.transform       // Transform-specific

// Shadows
shadows.buttonDefault              // Button shadow
shadows.glowMedium                 // Purple neon glow
shadows.elevation.level2           // Elevation shadow
shadows.cardShadow                // Card composition
```

### Token Type Safety

```typescript
// All token values are typed as const
// This enables type-safe access:

type ColorVariant = keyof typeof colors;
type SpacingValue = keyof typeof spacing;
type FontSize = keyof typeof typography.fontSize;

// Type guards for runtime safety
function isValidSpacing(value: unknown): value is SpacingValue {
  return Object.hasOwn(spacing, value);
}
```

---

## Accessibility Guidelines

### WCAG AA Compliance Checklist

For **every component**, verify:

- [ ] **Semantics**: Uses correct HTML element (`button`, `input`, `p`, etc.)
- [ ] **Color Contrast**: Text/background contrast ≥4.5:1 (large text ≥3:1)
- [ ] **Focus Indicator**: Visible focus style on interactive elements
- [ ] **Keyboard Navigation**: All interactions work with Tab/Enter/Space/Escape
- [ ] **ARIA Attributes**: Proper roles, labels, states as needed
- [ ] **Form Labels**: All inputs have associated labels
- [ ] **Error Handling**: Errors clearly communicated
- [ ] **Content Structure**: Logical heading hierarchy (h1 → h6)
- [ ] **Alternative Text**: Icons have aria-label
- [ ] **Animation**: Respects prefers-reduced-motion

### Accessibility Patterns

#### Button Accessibility
```typescript
<button
  disabled={isDisabled}
  aria-disabled={isDisabled}
  aria-busy={isLoading}
  aria-label={accessibleLabel}
  aria-describedby={errorId}
  onClick={handleClick}
>
  {children}
</button>
```

#### Input Accessibility
```typescript
<label htmlFor="input-id">
  Label text
</label>
<input
  id="input-id"
  aria-label="Accessible label"
  aria-describedby="error-id help-id"
  aria-invalid={!!error}
  required={required}
/>
<div id="help-id" role="region">Helper text</div>
<div id="error-id" role="alert">{error}</div>
```

#### Badge/Icon Accessibility
```typescript
<span aria-label="Active status">
  <IconComponent aria-hidden="true" />
</span>
```

#### Loading State Accessibility
```typescript
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Spinner aria-label="Loading..." /> : null}
  Content
</div>
```

### Color Contrast Calculator

```typescript
function getContrastRatio(color1: string, color2: string): number {
  // Convert hex/rgb to luminance
  // Calculate WCAG contrast ratio
  // Return value (3.0 to 21.0)
}

// Example usage in component
const contrastRatio = getContrastRatio(
  colors.primary[500],  // background
  colors.text.primary   // foreground
);

if (contrastRatio < 4.5) {
  console.warn('Color contrast may not meet WCAG AA standards');
}
```

### Focus Management

```typescript
// Visible focus outline
const focusStyle: React.CSSProperties = {
  outline: `2px solid ${colors.primary[500]}`,
  outlineOffset: '2px'
};

// Or use CSS variable for consistency
const focusStyle: React.CSSProperties = {
  outline: '2px solid var(--focus-color)',
  outlineOffset: '2px'
};
```

---

## Next Steps

1. **Day 1**: Create utility helpers
2. **Days 2-3**: Implement Button atoms (core pattern)
3. **Days 4-6**: Implement remaining 17 components
4. **Throughout**: Test and document each component
5. **Final**: Validate, build, and deploy

---

**Architecture Complete & Ready for Implementation**  
**Date**: May 21, 2026  
**Branch**: feat/atomic-components-w2
