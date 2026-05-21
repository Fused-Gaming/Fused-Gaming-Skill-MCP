# SyncPulse Atomic Component Implementation
## Week 2 Specialist 2 (Component Coder) - Detailed Status & Architecture

**Current Date**: May 21, 2026  
**Branch**: `feat/atomic-components-w2`  
**Status**: PREPARATION PHASE COMPLETE - Ready for Architecture Scaffolding  

---

## Preparation Phase Completion Summary

### ✅ Analysis Completed

#### 1. Design System Deep Dive
- **Colors**: 200+ semantic colors with neon cyberpunk palette
  - Primary purple gradient (50-900)
  - Semantic colors: success, warning, danger, info
  - Neon effects: plasma, electric, ultraviolet
  - Grayscale scale for neutral elements
  - Background/surface/border/text color systems

- **Spacing**: 4px-based scale (0-24 steps, 0-96px max)
  - Component presets: button, input, card, sidebar, modal
  - Layout sets: padding, margin, gap (XS-XXL)
  - Pattern: Consistent multi-directional spacing

- **Typography**: Complete font system
  - 3 font families: display (Orbitron), body (Inter), mono (JetBrains)
  - 10 font weights (100-900)
  - 13 font sizes (xs-8xl + hero/display)
  - 4 line height variants
  - 6 letter spacing options
  - 13 pre-composed text styles (H1-H6, body, caption, mono)

- **Motion**: Professional animation system
  - 5 durations (80ms-900ms)
  - 20+ easing curves (ease-in/out variants, bounce, elastic)
  - 11 keyframe animations (fade, slide, scale, spin, pulse, float, shimmer)
  - Transition presets for properties

- **Shadows**: Neon + elevation system
  - Basic shadows (small-xl)
  - Neon glows (purple, cyan, electric, green, plasma)
  - Inner glows for inset effects
  - Elevation levels (0-5)
  - Composite effects (card, button, input, text)
  - Glassmorphism backdrop blur

#### 2. Type System Analysis
- Reviewed `/packages/design-tokens/src/types/components.ts`
- 22 component type definitions defined
- Comprehensive prop interfaces with JSDoc
- Utility types established:
  - `BaseComponentProps` - Common props
  - `SizeVariant` - 5 sizes (xs-xl)
  - `IntentVariant` - 7 semantic colors
  - `ShapeVariant` - 3 shape options
- Component type registry for runtime lookup
- Generic `ComponentPropsFor<T>` helper type

#### 3. Component Pattern Recognition
- Reviewed existing Icon component (`Icon.tsx`)
- Pattern: React.forwardRef with props spread
- displayName set for debugging
- Color/size mapping using token values
- SVG attribute handling
- Grid utility components (IconGrid, IconBox)

#### 4. Directory Structure Reviewed
```
packages/design-tokens/src/components/
├── atoms/
│   ├── buttons/          (index.ts scaffolded)
│   ├── displays/         (empty, ready)
│   ├── inputs/           (empty, ready)
│   └── feedback/         (empty, ready)
├── layout/               (empty, ready)
├── molecules/            (empty, ready)
└── utils/                (needs creation)
```

---

## Component Breakdown & Implementation Priority

### TIER 1: Core Atoms (Foundation)
**Purpose**: Establish reusable patterns and utilities  
**Priority**: Week 1 (May 20-21)  
**Blockers**: Utility helpers

#### Button Component Family (3 files)
```typescript
// Button.tsx - Primary action button
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: SizeVariant;
  shape?: ShapeVariant;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
}

// Implementation approach:
// - Use CSS-in-JS for variant/size styles
// - Token-based colors, spacing, typography
// - Spinner integration for loading state
// - forwardRef to <button> element
// - Disabled + loading state handling
```

**Test Coverage** (15+ cases):
- Renders with all 4 variants
- Renders with all 5 sizes
- Renders with all 3 shapes
- Click handler works
- Disabled prevents interaction
- Loading shows spinner + disables button
- Icons render left/right
- FullWidth applies correct styles
- Keyboard: Tab, Enter, Space work
- forwardRef properly exposes button element
- Styling tests for active/hover states
- WCAG AA contrast ratios verified

**Stories** (Storybook):
- Primary variant, all sizes
- Secondary variant, all sizes
- Danger/Ghost variants
- Loading state stories
- With icons (left/right)
- Disabled state
- Full width example
- Interactive playground

#### IconButton.tsx - Square icon-only button
```typescript
// Variant of Button but:
// - Square sizing (width = height)
// - No text content (icon only)
// - Tooltip integration point
// - Circular variant option
// - Default aria-label required for a11y
```

**Test Coverage** (10+ cases):
- Renders as square
- Size variants scale properly
- Icon centers
- Circular variant option
- aria-label present
- onClick handler works
- Hover/focus states apply
- Keyboard navigation

#### LinkButton.tsx - Text link styled button
```typescript
// Button that looks like a link:
// - No background color
// - Text foreground color based on variant
// - Underline on hover
// - Can be <a> tag or <button>
// - href prop support
```

**Test Coverage** (8+ cases):
- Renders without background
- Color variants apply
- Underline appears on hover
- Can function as link or button
- Text decoration correct

---

### TIER 2: Input Atoms (User Input)
**Priority**: Week 1-2 (May 21-22)

#### Input.tsx - Text/Email/Password/Number input
```typescript
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  label?: string;
  error?: string;
  success?: boolean;
  size?: SizeVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  helperText?: string;
  showCharCount?: boolean;
  shape?: ShapeVariant;
}

// Features:
// - All native input types supported
// - Validation state: error, success, default
// - Label + helper text
// - Icon addons (left/right)
// - Character counter
// - Focus glow effect with neon border
// - Shape variant styling
```

**Test Coverage** (18+ cases):
- All HTML5 input types work
- Label renders correctly
- Error message displays
- Success indicator shows
- Icons position correctly
- Helper text appears
- Character counter updates
- Focus applies neon glow
- Value changes handled
- Disabled state works
- Required validation
- Placeholder text
- Shape variants apply
- Size variants apply
- Tab navigation works
- Clear button integration

#### Textarea.tsx - Multi-line text input
```typescript
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
  label?: string;
  error?: string;
  autoResize?: boolean;
  maxRows?: number;
  showCharCount?: boolean;
  helperText?: string;
  size?: SizeVariant;
}

// Features:
// - Auto-resize based on content
// - Max rows limit
// - Character counter
// - Same validation/help as Input
// - Scroll handling
```

**Test Coverage** (14+ cases):
- Basic rendering
- Auto-resize works
- Max rows respected
- Character counter
- Value updates
- Placeholder text
- Disabled state
- Error display
- Helper text
- Size variants
- Keyboard entry

---

### TIER 3: Display Atoms (Text & Labels)
**Priority**: Week 2 (May 22-23)

#### Badge.tsx - Status indicator label
```typescript
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  className?: string;
  variant?: IntentVariant;  // 7 colors
  size?: Exclude<SizeVariant, 'xl'>;  // xs-lg
  shape?: ShapeVariant;  // sharp, rounded, pill
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  dot?: boolean;  // Dot indicator instead of full badge
  children: React.ReactNode;
}

// Rendering: <span> with semantic styling
// Use cases: Status labels, notification counts, tags
```

**Test Coverage** (16+ cases):
- All 7 variants render with correct colors
- All sizes apply correct spacing/font
- All shapes apply correct border-radius
- Icons display
- Dismissible option with callback
- Dot variant hides text
- Children render correctly
- No accessibility issues

#### Chip.tsx - Interactive selector/filter
```typescript
export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  variant?: IntentVariant;
  size?: SizeVariant;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onSelect?: () => void;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  avatar?: React.ReactNode;
  children: React.ReactNode;
}

// Interactive: click to select, remove button
// Use cases: Tag selection, filter pills, multi-select UI
```

**Test Coverage** (18+ cases):
- Selection state toggles
- Remove callback fires
- Select callback fires
- Disabled prevents interaction
- Icons/avatar position
- Hover/focus states
- Keyboard: Enter, Delete
- Active styling

#### Tag.tsx - Simple removable label
```typescript
// Similar to Badge but:
// - Removable option (cleaner UI)
// - No dismissible animation
// - Simpler interaction model
// - Often used in lists
```

**Test Coverage** (12+ cases):
- Renders correctly
- Remove button works
- Icons appear
- Size/variant/shape apply

#### Heading.tsx - Semantic heading element
```typescript
export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'> {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;  // h1-h6
  size?: SizeVariant;  // Visual size (can differ from level)
  intent?: IntentVariant;  // Color
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

// Renders correct heading level for accessibility
// Visual size independent of semantic level (h1 can look like h3)
// Uses typography.textStyles[hX] for styling
```

**Test Coverage** (18+ cases):
- All heading levels render (h1-h6)
- Level maps to correct HTML element
- Size applies correct font-size
- Intent colors apply
- Text transform works
- Font weights apply
- Accessibility: correct heading hierarchy
- Visual styling matches tokens

#### Text.tsx - Paragraph/body text
```typescript
export interface TextProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'className'> {
  className?: string;
  size?: SizeVariant;
  intent?: IntentVariant;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  muted?: boolean;  // Reduced opacity/color
  truncate?: boolean;  // Single line truncation
  maxLines?: number;  // Multi-line truncation
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

// Renders as <p> with rich typography control
// Supports truncation (single + multi-line)
// Color intent variants
```

**Test Coverage** (20+ cases):
- All sizes apply correct font-size
- Intent colors work
- Weight variants apply
- Line height controls spacing
- Text transform works
- Muted reduces opacity
- Truncate uses text-overflow
- Max lines uses line-clamp
- Alignment applies
- No forced truncation without prop

#### Code.tsx - Code display (inline/block)
```typescript
export interface CodeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  className?: string;
  children: string;
  language?: string;  // For future syntax highlighting
  showLineNumbers?: boolean;  // For block mode
  inline?: boolean;  // Inline vs block
  copyable?: boolean;  // Copy button for block
}

// Inline: <code> with monospace font
// Block: <pre><code> with padding/background
// Copy functionality for code blocks
// Language hint for future syntax highlight integration
```

**Test Coverage** (12+ cases):
- Inline vs block rendering
- Monospace font applied
- Copy button works
- Line numbers render
- Proper code escaping

---

### TIER 4: Feedback Atoms (Loading & Status)
**Priority**: Week 2 (May 22-23)

#### Spinner.tsx - Animated loading indicator
```typescript
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  size?: SizeVariant;  // xs: 16px, sm: 20px, md: 24px, lg: 32px, xl: 40px
  variant?: IntentVariant;  // Color
  type?: 'spinner' | 'dots' | 'pulse' | 'bounce';
  speed?: number;  // RPM or multiplier
  label?: string;  // Optional text
  labelPosition?: 'below' | 'right' | 'left';
}

// Animation types:
// - spinner: rotating circle (motion.animation.spin)
// - dots: 3 dots bouncing (motion.animation.bounce)
// - pulse: opacity pulse (motion.animation.pulse)
// - bounce: vertical bounce (motion.animation.bounce)
// All use CSS animations (no JS)
```

**Test Coverage** (14+ cases):
- All animation types render
- Size variants scale correctly
- Color variants apply
- Speed option changes duration
- Label renders in correct position
- CSS animation present
- No animation jank
- Accessibility: aria-busy role

#### Skeleton.tsx - Loading placeholder
```typescript
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  variant?: 'text' | 'circle' | 'rectangle' | 'thumbnail';
  width?: string | number;  // CSS width
  height?: string | number;  // CSS height
  count?: number;  // For text variant (multiple lines)
  animated?: boolean;  // Shimmer animation
  gap?: SizeVariant;  // Between elements
}

// Uses motion.animation.shimmer for loading effect
// text: horizontal bar, repeated count times
// circle: perfect circle (avatar-like)
// rectangle: generic box
// thumbnail: wider rectangle (image-like)
```

**Test Coverage** (14+ cases):
- All variants render
- Dimensions apply correctly
- Count creates multiple elements
- Animation present
- Gap spacing correct
- Accessibility: aria-hidden

#### Progress.tsx - Visual progress bar
```typescript
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  value: number;  // 0-100 (or custom min/max)
  min?: number;  // Default 0
  max?: number;  // Default 100
  size?: SizeVariant;  // Bar height
  variant?: IntentVariant;  // Color
  showLabel?: boolean;  // Show percentage
  animated?: boolean;  // Pulsing animation
  shape?: ShapeVariant;  // Border radius
  formatLabel?: (value: number) => string;  // Custom label
}

// Renders: <div> container with <div> fill bar
// Percentage calculated from value/max
// Optional animated fill effect
```

**Test Coverage** (16+ cases):
- Various progress values render
- Custom min/max work
- Percentage calculates correctly
- Size applies to height
- Colors apply
- Label formats correctly
- Animated state works
- Shapes apply
- Value outside range handled
- Accessibility: role="progressbar"

---

### TIER 5: Control Atoms (Interaction)
**Priority**: Week 2-3 (May 23-24)

#### Toggle.tsx - Binary switch/checkbox
```typescript
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
  description?: string;  // Helper text
  size?: SizeVariant;  // Toggle handle size
  onChange?: (checked: boolean) => void;
}

// Renders: <div> container with <input type="checkbox" /> (hidden) + <span> switch visual
// Label clickable (linked with for/id)
// Can function as checkbox replacement with better UX
```

**Test Coverage** (14+ cases):
- Checked/unchecked renders
- Label clickable (fires onChange)
- Description shows
- Size variants work
- onChange fires with boolean
- Keyboard: Space/Enter toggle
- Tab navigation works
- Accessibility: proper input + label
- Disabled state works

#### Divider.tsx - Visual separator
```typescript
export interface DividerProps extends Omit<React.HTMLAttributes<HTMLHRElement>, 'className'> {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spacing?: SizeVariant;  // Margin
  variant?: IntentVariant;  // Color
  label?: string;  // Text on divider
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

// Horizontal (default): <hr> or <div> with border-bottom
// Vertical: tall <div> with border-right
// Optional label centered on line
// Color from token system
```

**Test Coverage** (12+ cases):
- Both directions render
- Spacing applies
- Line styles work
- Color variants apply
- Label positions correctly
- Semantic <hr> for horizontal
- Accessibility: separates sections

---

### TIER 6: Layout Components (Spacing)
**Priority**: Week 3 (May 24-25)

#### Flex.tsx - Flexbox container
```typescript
export interface FlexProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'auto';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: SizeVariant;  // 4px-96px via token
  grow?: number;  // flex-grow
  shrink?: number;  // flex-shrink
  basis?: string;  // flex-basis
  children: React.ReactNode;
}

// Wrapper around flexbox with preset values
// All flex properties exposed
// Gap uses spacing tokens
```

**Test Coverage** (16+ cases):
- All directions work
- Justify-content values apply
- Align-items values apply
- Gap spacing correct
- Flex grow/shrink/basis work
- Children render
- Nesting works
- Responsive behavior (future)

#### Grid.tsx - CSS Grid container
```typescript
export interface GridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  columns?: number;  // grid-template-columns: repeat(n, 1fr)
  gap?: SizeVariant;  // uniform gap
  columnGap?: SizeVariant;  // separate column gap
  rowGap?: SizeVariant;  // separate row gap
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'stretch';
  children: React.ReactNode;
}

// Wrapper around CSS Grid
// Column count as simple API
// Gap uses spacing tokens
```

**Test Coverage** (14+ cases):
- Column count creates grid
- Gap spacing correct
- Auto-flow works
- Align/justify properties apply
- Children render in grid
- Responsive future support

#### Stack.tsx - Simplified spacing container
```typescript
export interface StackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  direction?: 'vertical' | 'horizontal';
  spacing?: SizeVariant;  // Gap between items
  align?: 'start' | 'center' | 'end' | 'stretch';
  equalWidths?: boolean;  // All children same width
  children: React.ReactNode;
}

// Convenience wrapper around Flex
// Simplified API for common layout pattern
// Vertical by default
```

**Test Coverage** (10+ cases):
- Direction changes layout
- Spacing applies between items
- Alignment works
- Equal widths option
- Children render

---

### TIER 7: Molecule Components (Complex)
**Priority**: Week 3 (May 24-25)

#### Card.tsx - Content container
```typescript
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  bordered?: boolean;
  borderColor?: IntentVariant;
  interactive?: boolean;  // Hover effect
  padding?: SizeVariant;
  shape?: ShapeVariant;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Elevation maps to shadow preset:
// - none: no shadow
// - low: shadowSmall + glowSmall
// - medium: shadowMedium + glowMedium
// - high: shadowLarge + glowLarge
// Optional border with intent color
// Optional header/footer slots
```

**Test Coverage** (16+ cases):
- All elevations render with correct shadow
- Border option and color work
- Interactive hover effect applies
- Padding variants correct
- Shape applies border-radius
- Header/footer slots render
- Children render
- Nesting works
- Background color correct

#### Alert.tsx - User messaging
```typescript
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  variant: 'success' | 'warning' | 'error' | 'info';  // Required
  title?: string;
  children: React.ReactNode;  // Required (message)
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  bordered?: boolean;
}

// Semantic colors based on variant
// Auto-select icon if not provided
// Dismissible with X button
// Optional action button
// Bordered variant for visual accent
```

**Test Coverage** (18+ cases):
- All 4 variants render with correct colors
- Title + message display
- Icon auto-selection works
- Icon custom override works
- Dismiss button fires callback
- Dismissible hides alert
- Action button renders and fires
- Bordered variant applies
- Accessibility: role="alert", aria-live="polite"
- Keyboard: Tab/Enter on buttons

#### Modal.tsx - Overlay dialog
```typescript
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;  // Required
  onClose: () => void;  // Required
  title?: string;
  description?: string;  // For a11y
  children: React.ReactNode;  // Required
  footer?: React.ReactNode;
  backdrop?: boolean;  // Default true
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;  // Default true
  size?: SizeVariant;  // Modal size
  centered?: boolean;  // Vertical center
  zIndex?: number;
  overlayClassName?: string;
}

// Conditional rendering based on isOpen
// Backdrop overlay (optional)
// Portal mounting (future)
// Focus management (future)
// Escape key handling
```

**Test Coverage** (18+ cases):
- Renders when open, hidden when closed
- Close button fires onClose
- Backdrop click fires onClose (if enabled)
- Escape key fires onClose
- Title/description display
- Footer renders
- Size variants apply
- Centered option works
- Z-index applies
- Overlay styling correct
- Accessibility: role="dialog", aria-modal
- Keyboard: Tab trap within modal

#### Toast.tsx - Temporary notification
```typescript
export interface ToastProps extends BaseComponentProps {
  message: string;  // Required
  variant: IntentVariant;  // Required
  title?: string;
  duration?: number | null;  // ms, null = persistent
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// Fixed position container
// Auto-dismiss based on duration
// Slide-in animation (motion.animation.slideInUp)
// Slide-out on dismiss
// Optional action button
```

**Test Coverage** (16+ cases):
- Renders with message
- Variant colors apply
- Position styles correct
- Auto-dismiss fires onClose
- Manual close works
- Icon displays
- Action button works
- Animation on mount/unmount
- Accessibility: role="status", aria-live
- Multiple toasts stack (container component)

---

## Utility Helpers Required

### classNameBuilder.ts
```typescript
/**
 * Compose className strings with variants and conditions
 */
export function classNameBuilder(
  base: string,
  variants?: Record<string, string | undefined>,
  conditions?: Record<string, boolean>
): string {
  // Returns optimized className string
}

// Usage:
const className = classNameBuilder(
  'button',
  {
    'button-primary': variant === 'primary',
    'button-md': size === 'md',
  },
  {
    'button-disabled': disabled,
    'button-loading': loading,
  }
);
```

### sizeMapper.ts
```typescript
/**
 * Map SizeVariant to pixel values for various properties
 */
export const sizePixels: Record<SizeVariant, number> = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32
};

export const sizeFontMap: Record<SizeVariant, string> = {
  xs: typography.fontSize.xs,
  sm: typography.fontSize.sm,
  md: typography.fontSize.base,
  lg: typography.fontSize.lg,
  xl: typography.fontSize.xl
};

export const sizePaddingMap: Record<SizeVariant, { top: string; right: string; bottom: string; left: string }> = {
  xs: { top: spacing[1], right: spacing[2], bottom: spacing[1], left: spacing[2] },
  // ... etc
};
```

### intentMapper.ts
```typescript
/**
 * Map IntentVariant to color values
 */
export const intentColorMap: Record<IntentVariant, string> = {
  primary: colors.primary[500],
  secondary: colors.gray[500],
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  danger: colors.semantic.danger,
  info: colors.semantic.info,
  neutral: colors.gray[400]
};

export const intentBackgroundMap: Record<IntentVariant, string> = {
  // Lighter backgrounds for badge/chip
};
```

### shapeMapper.ts
```typescript
/**
 * Map ShapeVariant to border-radius values
 */
export const shapeBorderRadiusMap: Record<ShapeVariant, string> = {
  sharp: '0',
  rounded: '0.375rem',  // 6px
  pill: '999px'
};
```

### styleBuilder.ts
```typescript
/**
 * Compose component styles with design tokens
 */
export function buildButtonStyles(variant: string, size: string): React.CSSProperties {
  return {
    backgroundColor: intentColorMap[variant as IntentVariant],
    padding: `${sizePixels[size as SizeVariant]}px`,
    fontSize: sizeFontMap[size as SizeVariant],
    // ... composed style object
  };
}
```

---

## Implementation Order (Detailed)

### Day 1 (May 20): Utilities
1. Create `components/utils/` directory
2. Implement classNameBuilder.ts
3. Implement sizeMapper.ts
4. Implement intentMapper.ts
5. Implement shapeMapper.ts
6. Implement styleBuilder.ts
7. Export from utils/index.ts

### Days 2-3 (May 21-22): Button & Input
1. Button.tsx + Button.test.tsx + Button.stories.tsx
2. IconButton.tsx integration test
3. LinkButton.tsx integration test
4. Input.tsx + Input.test.tsx + Input.stories.tsx
5. Textarea.tsx integration test
6. Root atoms/buttons/index.ts exports
7. Root atoms/inputs/index.ts exports

### Days 4-5 (May 23-24): Display & Feedback
1. Badge.tsx through Heading.tsx (display atoms)
2. Text.tsx, Code.tsx
3. Spinner.tsx through Skeleton.tsx (feedback atoms)
4. Progress.tsx
5. Display.test.tsx, Display.stories.tsx
6. Feedback.test.tsx, Feedback.stories.tsx

### Days 5-6 (May 24-25): Control, Layout, Molecules
1. Toggle.tsx, Divider.tsx
2. Flex.tsx, Grid.tsx, Stack.tsx
3. Card.tsx, Alert.tsx, Modal.tsx, Toast.tsx
4. Comprehensive test suite
5. Storybook build + validation
6. Root components/index.ts
7. Components README.md
8. Type validation check

---

## Testing Infrastructure Required

### Jest Setup
```typescript
// jest.config.js in package root or design-tokens package
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages/design-tokens/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/types/**'
  ],
  coverageThresholds: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  }
};
```

### React Testing Library Setup
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// Custom render with theme providers (if needed)
export const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui);
};
```

### Accessibility Testing
```typescript
// Use jest-axe for accessibility audits
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Success Metrics

✅ **Code Quality**
- No TypeScript errors (strict mode)
- No ESLint violations
- No console warnings
- Proper error handling

✅ **Testing**
- 80%+ line coverage
- 80%+ branch coverage
- All user interactions tested
- Accessibility tested

✅ **Documentation**
- JSDoc on all exports
- Storybook story per variant
- README with examples
- Type definitions exported

✅ **Performance**
- No unnecessary re-renders
- Memoization where needed
- forwardRef properly used
- CSS-in-JS optimization

✅ **Accessibility**
- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ≥4.5:1

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  @h4shed/design-tokens Package                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/                                                        │
│  ├── tokens/                    [Design System Base]        │
│  │   ├── colors.ts              ~200 color values          │
│  │   ├── spacing.ts             4px scale (0-96px)         │
│  │   ├── typography.ts          Font system + styles       │
│  │   ├── motion.ts              Animations + easing        │
│  │   └── shadows.ts             Shadows + glows            │
│  │                                                          │
│  ├── types/                     [Type System]               │
│  │   └── components.ts          22 component interfaces    │
│  │                                                          │
│  ├── components/                [Component Implementation]  │
│  │   ├── utils/                 [Helper Functions]         │
│  │   │   ├── classNameBuilder.ts                           │
│  │   │   ├── sizeMapper.ts                                 │
│  │   │   ├── intentMapper.ts                               │
│  │   │   ├── shapeMapper.ts                                │
│  │   │   └── styleBuilder.ts                               │
│  │   │                                                      │
│  │   ├── atoms/                 [20 Atomic Components]     │
│  │   │   ├── buttons/           3 button types             │
│  │   │   ├── inputs/            2 input types              │
│  │   │   ├── displays/          6 display types            │
│  │   │   ├── feedback/          3 feedback types           │
│  │   │   └── controls/          2 control types            │
│  │   │                                                      │
│  │   ├── layout/                [3 Layout Components]      │
│  │   │   ├── Flex.tsx                                      │
│  │   │   ├── Grid.tsx                                      │
│  │   │   └── Stack.tsx                                     │
│  │   │                                                      │
│  │   └── molecules/             [4 Molecule Components]    │
│  │       ├── Card.tsx                                      │
│  │       ├── Alert.tsx                                     │
│  │       ├── Modal.tsx                                     │
│  │       └── Toast.tsx                                     │
│  │                                                          │
│  └── icons/                     [Icon System]              │
│      └── Icon.tsx               Existing icon component    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| May 21 | Preparation Phase Complete | ✅ DONE |
| May 21 | Architecture Scaffolding Ready | ⏳ Awaiting Specialist 1 |
| May 22-23 | Button + Input Complete | ⏳ Pending Start |
| May 23-24 | Display + Feedback Complete | ⏳ Pending Start |
| May 24-25 | Layout + Molecules Complete | ⏳ Pending Start |
| May 25 | Testing & Validation | ⏳ Pending Start |
| May 25 | Documentation Complete | ⏳ Pending Start |
| May 25 | Storybook Build Success | ⏳ Pending Start |

---

## Blocking Dependencies

1. **Specialist 1 Deliverables** (Architecture Scaffolding)
   - Component directory structure
   - Utility file templates
   - TypeScript configuration updates
   - Jest/testing setup

2. **External Dependencies** (Already Available)
   - React 18.x (peerDependency)
   - TypeScript 5.3+ (installed)
   - Design tokens (ready)
   - Type definitions (ready)

---

## Notes & Considerations

**Styling Approach:**
- CSS-in-JS via template literals preferred (token integration)
- CSS Modules as fallback
- No external CSS framework required
- All values from design tokens

**Component Philosophy:**
- Atomic design methodology (atoms → molecules)
- Single responsibility principle
- Composition over inheritance
- Props-based variant system
- Full TypeScript strict mode

**React Patterns:**
- Functional components only
- forwardRef for all components
- React.memo for performance
- Custom hooks for logic reuse
- Proper cleanup for effects

**Testing Philosophy:**
- Test user behavior (not implementation)
- Accessibility tests required
- Interaction tests (click, keyboard)
- Snapshot tests sparingly
- 80%+ coverage target

**Documentation:**
- JSDoc on all public APIs
- Storybook for visual documentation
- Type safety as documentation
- Examples in comments
- README per component group

---

**Document Status**: Complete & Ready for Implementation  
**Date**: May 21, 2026  
**Branch**: feat/atomic-components-w2
