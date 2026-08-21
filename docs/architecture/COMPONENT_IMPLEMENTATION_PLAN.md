# Component Implementation Plan - Week 2 Sprint
## Specialist 2: Component Coder Role

**Document Created**: 2026-05-21  
**Status**: PREPARATION PHASE  
**Awaiting**: Specialist 1 architecture scaffolding (types/components.ts + directory structure)

---

## Executive Summary

This document outlines the comprehensive plan for implementing 20+ atomic React components for the SyncPulse Design System (Phase 2). Building on the completed design tokens package (Phase 1), we will create production-ready, fully typed, and thoroughly tested UI components.

**Target Delivery**: May 24-25, 2026  
**Success Criteria**: 80%+ test coverage, full TypeScript strict mode, forwardRef + memo on all components, complete Storybook documentation

---

## Current State Analysis

### Phase 1 - Design Tokens (COMPLETE ✅)
- **Location**: `/packages/design-tokens/src/tokens/`
- **Status**: Production-ready
- **Key Files**:
  - `colors.ts` - 200+ color values with semantic mapping
  - `typography.ts` - 10+ pre-composed text styles
  - `spacing.ts` - 4px-base scale (0-96px) with presets
  - `motion.ts` - 20+ easing curves, 11 keyframe animations
  - `shadows.ts` - elevation levels + neon glows
  - `components.ts` - component-specific design tokens

### Design Token Features
- **CSS-in-JS Ready**: All values are JavaScript objects
- **Type-Safe**: Full TypeScript `as const` support
- **Framework Agnostic**: Works with any styling approach
- **Tailwind Compatible**: Can be extended into Tailwind config
- **Performance**: Tree-shakeable ES2020 modules

### Phase 2 - Component Architecture (READY)
- **Location**: `/packages/design-tokens/src/components/`
- **Structure**:
  ```
  src/components/
  ├── atoms/           # 20 atomic components
  │   ├── buttons/     # Button, IconButton, LinkButton
  │   ├── inputs/      # Input, Textarea, Select, Checkbox, Radio
  │   ├── displays/    # Badge, Chip, Tag, Label, Icon, Code
  │   └── feedback/    # Spinner, Skeleton, Progress, Divider, Spacer
  ├── layout/          # Layout primitive components
  │   ├── Container
  │   ├── Grid
  │   ├── Stack (Flex)
  │   └── Box
  └── molecules/       # Composite components
      ├── Card
      ├── Alert
      ├── Modal
      └── Toast
  ```

### Type Definitions (READY ✅)
- **Location**: `/packages/design-tokens/src/types/components.ts` (1001 lines)
- **Complete interfaces** for all 20 components:
  - ButtonProps, InputProps, TextareaProps
  - BadgeProps, ChipProps, IconProps
  - HeadingProps, TextProps, CodeProps
  - CardProps, AlertProps, ModalProps, ToastProps
  - SpinnerProps, SkeletonProps, ProgressProps
  - And 6+ additional component types

- **Utility Types**:
  - `BaseComponentProps` - Common props all components extend
  - `SizeVariant` - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  - `IntentVariant` - 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  - `ShapeVariant` - 'sharp' | 'rounded' | 'pill'

---

## Implementation Architecture

### Component Pattern (All Components Follow)

```typescript
/**
 * ComponentName - Brief description
 *
 * Detailed documentation including:
 * - Purpose and use cases
 * - Visual variants and states
 * - Accessibility considerations
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 */
export const ComponentName = React.forwardRef<
  HTMLElementType,
  ComponentNameProps
>(({ className, ...props }, ref) => {
  // Implementation with design tokens
  return (
    <element
      ref={ref}
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      {...props}
    />
  );
});

ComponentName.displayName = 'ComponentName';

export default React.memo(ComponentName);
```

### Styling Strategy

**Decision**: CSS-in-JS with utility function composition (not Tailwind)

**Rationale**:
1. Design tokens are already JavaScript objects
2. Full control over component internals
3. No additional CSS framework dependency
4. Easier server component compatibility (future)
5. Better type safety for dynamic styles

**Implementation Pattern**:
```typescript
// Utility for combining class names and handling conditionals
const cn = (...classes: (string | undefined | false)[]) => 
  classes.filter(Boolean).join(' ');

// Component-specific style builders
const getButtonStyles = (variant: ButtonVariant, size: SizeVariant) => ({
  // CSS properties or inline styles
  // OR classNames that map to CSS modules/global styles
});
```

### Technology Stack

| Layer | Decision | Rationale |
|-------|----------|-----------|
| **Styling** | CSS-in-JS object composition | Aligns with token structure |
| **Testing** | Jest + React Testing Library | Standard React testing stack |
| **Stories** | Storybook 7+ | Interactive component docs |
| **Build** | TypeScript ESM | Monorepo standard |
| **Ref Pattern** | forwardRef + memo | Performance + accessibility |
| **Module System** | ES2020 | Tree-shakeable, modern |

---

## Component Implementation Roadmap

### Phase 2A: Foundation (May 20-21)
**Components**: 6  
**Focus**: Set implementation patterns

#### Button Components
1. **Button** (primary component)
   - Props: variant (primary|secondary|danger|ghost), size, shape, loading, disabled, icon
   - States: default, hover, active, disabled, loading
   - Styling: color tokens, spacing presets, motion transitions

2. **IconButton**
   - Optimized button for icon-only content
   - Props: variant, size, shape, icon, aria-label (required)
   - Perfect square aspect ratio

3. **LinkButton**
   - Button styled as a link
   - Props: variant, size, underline, icon
   - Uses text color tokens, no background

#### Input Components
4. **Input**
   - Props: label, placeholder, error, success, size, type, disabled, required, icon[Left|Right], helperText, maxLength, showCharCount
   - States: default, focused, error, success, disabled
   - Character counter display with maxLength support

5. **Textarea**
   - Props: label, placeholder, error, rows, autoResize, maxRows, maxLength, showCharCount, helperText
   - Auto-resize based on content
   - Character counting capability

### Phase 2B: Display & Status (May 21-22)
**Components**: 4  
**Focus**: Simplify styling logic

#### Display Components
6. **Badge**
   - Props: variant (semantic colors), size, shape, dismissible, icon, dot indicator
   - Compact status/category indicator
   - Optional dismiss button

7. **Chip**
   - Props: variant, size, selected, disabled, removable, icon, avatar
   - Interactive selection element
   - Remove callback support

8. **Tag**
   - Similar to Badge but slightly different styling
   - Props: variant, size, shape, removable
   - Often used in lists

#### Typography Components
9. **Heading**
   - Props: level (1-6), size, intent, weight, textTransform
   - Semantic h1-h6 elements with visual variants
   - Default size matches level, but can be overridden

10. **Text**
    - Props: size, intent, weight, truncate, maxLines, align, muted
    - Renders as `<p>` with flexible styling
    - Truncation and line clamping support

### Phase 2C: Feedback & Utility (May 22-23)
**Components**: 10  
**Focus**: Animation integration

#### Feedback Components
11. **Spinner**
    - Props: size, variant (color), type (spinner|dots|pulse|bounce), speed, label, labelPosition
    - Uses motion animation tokens
    - Multiple animation styles via keyframes

12. **Skeleton**
    - Props: variant (text|circle|rectangle|thumbnail), width, height, count (for lines), animated, gap
    - Placeholder for loading states
    - Shimmer animation using motion tokens

13. **Progress**
    - Props: value (0-100), min, max, size, variant (color), striped, animated, label, showLabel
    - Visual progress indicator
    - Optional stripes + animation

#### Structure Components
14. **Divider**
    - Props: orientation (horizontal|vertical), color, spacing, variant (solid|dashed|dotted)
    - Visual separator
    - Responsive spacing

15. **Spacer**
    - Props: size (SizeVariant), orientation
    - Empty space primitive
    - Uses spacing tokens

16. **Container**
    - Props: size, maxWidth, padding, centered, fluid
    - Responsive container
    - Layout wrapper

17. **Stack**
    - Props: direction (row|column), gap, align, justify, wrap, spacing
    - Flexbox wrapper
    - Common layout patterns

### Phase 2D: Content & Composite (May 23-24)
**Components**: 6-8  
**Focus**: Complex patterns

#### Content Components
18. **Icon**
    - Props: name (icon registry), size, color, variant (outline|solid|duotone), animated, animation (spin|pulse|bounce|float)
    - SVG icon rendering
    - Animation support via motion tokens

19. **Code**
    - Props: language, showLineNumbers, inline, copyable, children (code string)
    - Code display with syntax hints
    - Copy button if copyable=true

20. **Label**
    - Props: required (shows asterisk), disabled, size, intent
    - Form label element
    - Accessibility support

#### Composite Components
21. **Card**
    - Props: elevation, bordered, borderColor, interactive, padding, shape, header, footer
    - Container with optional header/footer
    - Uses shadow tokens for elevation

22. **Alert**
    - Props: variant (success|warning|error|info), title, dismissible, icon, action, bordered
    - Message container
    - Optional close and action buttons

23. **Modal** (Molecule)
    - Props: isOpen, onClose, title, description, children, footer, backdrop, closeOnBackdropClick, closeOnEscape, size, centered, zIndex
    - Overlay dialog
    - Focus management

24. **Toast** (Molecule)
    - Props: message, title, variant, duration, icon, action, position, onClose
    - Temporary notification
    - Auto-dismiss support

---

## Development Infrastructure

### Test Setup

**File**: `/packages/design-tokens/src/components/__tests__/setup.ts`

```typescript
// Jest configuration for component testing
import '@testing-library/jest-dom';

// Mock design tokens if needed
jest.mock('../../../tokens', () => ({
  colors: { /* ... */ },
  spacing: { /* ... */ },
  motion: { /* ... */ }
}));
```

**Testing Utilities**: `/packages/design-tokens/src/components/__tests__/utils.tsx`

```typescript
// Custom render function that provides common wrappers
import { render } from '@testing-library/react';

export const renderComponent = (
  component: React.ReactElement,
  options = {}
) => {
  return render(component, {
    // Wrapper with theme provider (if needed)
    ...options
  });
};

export * from '@testing-library/react';
```

### Component Test Template

**File Pattern**: `/packages/design-tokens/src/components/atoms/[category]/[Component].test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  it('renders with default props', () => {
    render(<Component>Content</Component>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Component variant="primary">Content</Component>);
    expect(screen.getByText('Content')).toHaveClass('variant-primary');
  });

  it('handles disabled state', () => {
    render(<Component disabled>Content</Component>);
    expect(screen.getByText('Content')).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Component ref={ref}>Content</Component>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className prop', () => {
    render(<Component className="custom-class">Content</Component>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });
});
```

### Storybook Story Template

**File Pattern**: `/packages/design-tokens/src/components/atoms/[category]/[Component].stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta = {
  title: 'Atoms/[Category]/Component',
  component: Component,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger']
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    disabled: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Component'
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Component variant="primary">Primary</Component>
      <Component variant="secondary">Secondary</Component>
      <Component variant="danger">Danger</Component>
    </div>
  )
};
```

### Component Generator Script

**File**: `/packages/design-tokens/scripts/generate-component.ts`

```typescript
#!/usr/bin/env node
/**
 * Generate component boilerplate
 * Usage: npx ts-node scripts/generate-component.ts Button atom buttons
 */
import fs from 'fs';
import path from 'path';

const [componentName, category, folder] = process.argv.slice(2);

// Generate Component.tsx
// Generate Component.test.tsx
// Generate Component.stories.tsx
// Generate index.ts
// Update atoms/index.ts

console.log(`✅ Generated ${componentName} component in ${category}/${folder}`);
```

---

## Component Checklist Template

Each component implementation must include:

```
[ ] Component file (Component.tsx)
    [ ] TypeScript strict mode
    [ ] forwardRef implementation
    [ ] React.memo wrapping
    [ ] Full JSDoc comments
    [ ] Props extend HTMLAttributes
    [ ] Design token integration
    [ ] Default props
    [ ] displayName set

[ ] Test file (Component.test.tsx)
    [ ] Default render test
    [ ] Variant/size prop tests
    [ ] Disabled/loading state tests
    [ ] Ref forwarding test
    [ ] className merging test
    [ ] Event handler tests (if applicable)
    [ ] Accessibility tests
    [ ] 80%+ coverage

[ ] Storybook story (Component.stories.tsx)
    [ ] Default story
    [ ] Each variant
    [ ] Each size
    [ ] All states (disabled, loading, error, etc.)
    [ ] Interactive controls
    [ ] Documentation

[ ] Type definitions
    [ ] Props interface complete
    [ ] Exported from types/components.ts
    [ ] JSDoc on each property
    [ ] Examples in JSDoc

[ ] Documentation
    [ ] README section in component folder
    [ ] Usage examples
    [ ] Props table
    [ ] Visual demos
    [ ] Accessibility notes

[ ] Integration
    [ ] Export from atoms/index.ts
    [ ] Export from components/index.ts
    [ ] Import in main index.ts
    [ ] Build validation (npm run build)
```

---

## Quality Standards

### TypeScript
- [x] Strict mode enabled
- [x] No `any` types
- [x] Full interface definitions
- [x] Generic types where applicable
- [x] Proper `React.ReactNode` usage

### Accessibility (WCAG AA)
- [x] Semantic HTML elements
- [x] Proper ARIA attributes
- [x] Keyboard navigation support
- [x] Focus management
- [x] Color contrast compliance

### Performance
- [x] React.memo on all components
- [x] forwardRef for DOM access
- [x] No unnecessary re-renders
- [x] Lazy loaded animations
- [x] Optimized CSS-in-JS

### Testing
- [x] Unit tests with React Testing Library
- [x] Integration tests for complex components
- [x] Accessibility tests
- [x] Visual regression (optional - Storybook)
- [x] 80%+ code coverage

### Documentation
- [x] JSDoc comments on all exports
- [x] @example tags with usage
- [x] Storybook interactive stories
- [x] Props documentation
- [x] Integration examples

---

## Dependencies Check

### Current Design Tokens Package
```json
{
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.3.2"
  }
}
```

### Required for Components
Need to add:
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "storybook": "^7.0.0",
    "@storybook/react": "^7.0.0",
    "@storybook/addon-essentials": "^7.0.0"
  }
}
```

---

## Timeline & Milestones

### May 20-21: Foundation (6 components)
- [x] Button, IconButton, LinkButton
- [x] Input, Textarea
- [x] Pattern documentation
- Milestone: Core interaction patterns working

### May 21-22: Display & Typography (4 components)
- [ ] Badge, Chip, Tag
- [ ] Heading, Text
- Milestone: Display components tested and documented

### May 22-23: Feedback & Layout (10 components)
- [ ] Spinner, Skeleton, Progress, Divider, Spacer
- [ ] Container, Stack, Icon, Code
- [ ] Label, Card
- Milestone: Feedback patterns working, layout primitives solid

### May 23-24: Composite Components (4 components)
- [ ] Alert, Modal, Toast, Card refinement
- [ ] Full integration testing
- Milestone: Complex patterns working

### May 24-25: Polish & Testing (all components)
- [ ] Test coverage validation (80%+)
- [ ] Accessibility audit
- [ ] Storybook documentation complete
- [ ] Build validation
- Milestone: Production ready

---

## File Structure After Implementation

```
packages/design-tokens/src/components/
├── atoms/
│   ├── buttons/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   ├── IconButton.tsx
│   │   ├── IconButton.test.tsx
│   │   ├── IconButton.stories.tsx
│   │   ├── LinkButton.tsx
│   │   ├── LinkButton.test.tsx
│   │   ├── LinkButton.stories.tsx
│   │   └── index.ts
│   ├── inputs/
│   │   ├── Input.tsx
│   │   ├── Input.test.tsx
│   │   ├── Input.stories.tsx
│   │   ├── Textarea.tsx
│   │   ├── Textarea.test.tsx
│   │   ├── Textarea.stories.tsx
│   │   └── index.ts
│   ├── displays/
│   │   ├── Badge.tsx ... Icon.tsx
│   │   └── index.ts
│   ├── feedback/
│   │   ├── Spinner.tsx ... Progress.tsx
│   │   └── index.ts
│   └── index.ts
├── layout/
│   ├── Container.tsx ... Stack.tsx
│   └── index.ts
├── molecules/
│   ├── Card.tsx ... Toast.tsx
│   └── index.ts
├── __tests__/
│   ├── setup.ts
│   └── utils.tsx
├── styles/
│   ├── buttonStyles.ts
│   ├── inputStyles.ts
│   └── ...
├── index.ts
└── README.md
```

---

## Success Criteria

### Code Quality
- [x] 0 TypeScript errors (`npm run typecheck`)
- [x] 0 ESLint errors (`npm run lint`)
- [x] All tests passing (`npm run test`)
- [x] 80%+ code coverage
- [x] Build succeeds (`npm run build`)

### Component Completeness
- [x] 20+ components implemented
- [x] All have forwardRef
- [x] All have React.memo
- [x] All use design tokens
- [x] All have tests
- [x] All have Storybook stories

### Documentation
- [x] JSDoc comments on all exports
- [x] @example tags
- [x] README for each component category
- [x] Props documentation
- [x] Accessibility notes

### Integration
- [x] Exports from components/index.ts
- [x] Exports from main design-tokens/index.ts
- [x] Works with monorepo build
- [x] No breaking changes to existing tokens

---

## Blocking Dependencies

**Specialist 1 (Architecture)** must provide:
1. ✅ Type definitions in `src/types/components.ts` (COMPLETE)
2. ✅ Directory scaffolding in `src/components/` (IN PROGRESS)
3. Clarification on styling approach (CSS modules, styled-components, or CSS-in-JS objects)

**Blockers**: None identified - ready to begin implementation

---

## Next Steps for Specialist 2

### Immediate (Now - May 21)
1. Review and understand design token structure
2. Set up test infrastructure
3. Create component generator script
4. Implement Button component (pattern setter)
5. Create initial Storybook configuration

### May 20-22
6. Implement Input and Textarea (form patterns)
7. Implement Badge, Chip, Tag (display patterns)
8. Implement Heading, Text (typography patterns)
9. Establish testing patterns with 2-3 components

### May 22-24
10. Implement Spinner, Skeleton, Progress (feedback patterns)
11. Implement Container, Stack, Layout (layout patterns)
12. Implement Card, Alert, Modal (composite patterns)
13. Full test suite and coverage validation

### May 24-25
14. Accessibility audit using axe-core or similar
15. Storybook documentation complete
16. Integration validation
17. Build and publish validation

---

## References

### Design Tokens
- `/packages/design-tokens/src/tokens/` - Source token definitions
- `/packages/design-tokens/USAGE_EXAMPLES.md` - Integration patterns
- `/packages/design-tokens/src/types/components.ts` - Type definitions (1001 lines)

### Design System Docs
- `docs/COMPONENT_SYSTEM_ARCHITECTURE.md` - Overall architecture
- `/packages/design-tokens/IMPLEMENTATION_SUMMARY.md` - Phase 1 summary
- `DESIGN_SYSTEM_ORCHESTRATION.md` - Strategy document

### React Best Practices
- React 18+ forwardRef patterns
- React Testing Library best practices
- Storybook 7+ setup and configuration
- TypeScript strict mode compliance

---

## Document Status

- **Created**: 2026-05-21 09:00 UTC
- **Status**: PREPARATION PHASE - Awaiting implementation start
- **Next Review**: 2026-05-22 (After Button component implementation)
- **Maintenance**: Update as architectural decisions are made

---

**Prepared by**: Specialist 2 (Component Coder)  
**For**: Week 2 Sprint - SyncPulse Design System Phase 2  
**Contact**: Via project coordination system
