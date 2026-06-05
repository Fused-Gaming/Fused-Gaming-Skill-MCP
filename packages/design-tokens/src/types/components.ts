/**
 * SyncPulse Component Type Definitions
 * Complete TypeScript interfaces for all 20 atomic components
 *
 * These interfaces define the contract for all UI components in the design system.
 * They extend HTML attributes and support React.forwardRef patterns.
 *
 * All props are documented with JSDoc comments and include strict TypeScript validation.
 *
 * @packageDocumentation
 */

import type React from 'react';

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Base component props that all components should extend
 */
export interface BaseComponentProps {
  /** Additional CSS class names to apply */
  className?: string;
  /** HTML data attributes for testing and custom metadata */
  'data-testid'?: string;
  'data-qa'?: string;
  /** Inline styles with CSS custom properties for theming */
  style?: React.CSSProperties & Record<string, string | number>;
  /** ID for form associations */
  id?: string;
}

/**
 * Size variant type used across multiple components
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Intent/semantic variant type for status components
 */
export type IntentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Shape/border radius variant type
 */
export type ShapeVariant = 'sharp' | 'rounded' | 'pill';

// ============================================================================
// BUTTON COMPONENT (Atomic)
// ============================================================================

/**
 * Button component props
 *
 * Represents a clickable button element with multiple visual variants and sizes.
 * Supports loading states, disabled states, and icon integration.
 *
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="md"
 *   onClick={handleClick}
 * >
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Size of the button */
  size?: SizeVariant;

  /** Button shape/border radius */
  shape?: ShapeVariant;

  /** Whether the button is loading */
  isLoading?: boolean;

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Icon element to display (left side) */
  icon?: React.ReactNode;

  /** Icon element to display (right side) */
  iconRight?: React.ReactNode;

  /** Whether the button takes full width */
  fullWidth?: boolean;

  /** Whether to show a loading spinner */
  loading?: boolean;

  /** Loading spinner text */
  loadingText?: string;
}

// ============================================================================
// INPUT COMPONENT (Atomic)
// ============================================================================

/**
 * Input (text field) component props
 *
 * Represents a single-line text input with validation states,
 * placeholder text, and error messaging support.
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter email"
 *   error="Invalid email format"
 *   required
 * />
 * ```
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Label text for the input */
  label?: string;

  /** Error message to display */
  error?: string;

  /** Success indicator */
  success?: boolean;

  /** Size of the input */
  inputSize?: SizeVariant;

  /** Left icon/addon */
  iconLeft?: React.ReactNode;

  /** Right icon/addon */
  iconRight?: React.ReactNode;

  /** Helper text below input */
  helperText?: string;

  /** Show character counter */
  showCharCount?: boolean;

  /** Input shape */
  shape?: ShapeVariant;
}

// ============================================================================
// TEXTAREA COMPONENT (Atomic)
// ============================================================================

/**
 * Textarea component props
 *
 * Multi-line text input with auto-resize capability and character limits.
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Label text */
  label?: string;

  /** Error message */
  error?: string;

  /** Whether to auto-resize based on content */
  autoResize?: boolean;

  /** Maximum number of rows when auto-resizing */
  maxRows?: number;

  /** Show character counter */
  showCharCount?: boolean;

  /** Helper text */
  helperText?: string;

  /** Size variant */
  size?: SizeVariant;
}

// ============================================================================
// BADGE COMPONENT (Atomic)
// ============================================================================

/**
 * Badge component props
 *
 * Small, compact label displaying status, categories, or tags.
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">Active</Badge>
 * ```
 */
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Visual variant/intent */
  variant?: IntentVariant;

  /** Size of the badge */
  size?: Exclude<SizeVariant, 'xl'>;

  /** Badge shape */
  shape?: ShapeVariant;

  /** Whether badge is dismissible */
  dismissible?: boolean;

  /** Callback when badge is dismissed */
  onDismiss?: () => void;

  /** Icon to display before text */
  icon?: React.ReactNode;

  /** Icon to display after text */
  iconRight?: React.ReactNode;

  /** Dot indicator instead of background */
  dot?: boolean;

  /** Badge content */
  children: React.ReactNode;
}

// ============================================================================
// CHIP COMPONENT (Atomic)
// ============================================================================

/**
 * Chip component props
 *
 * Compact interactive element for selections, filters, or tags.
 * Often used in selection lists and filter sets.
 */
export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Visual variant */
  variant?: IntentVariant;

  /** Size of the chip */
  size?: SizeVariant;

  /** Whether chip is selected */
  selected?: boolean;

  /** Whether chip is disabled */
  disabled?: boolean;

  /** Whether chip can be removed */
  removable?: boolean;

  /** Callback when chip is removed */
  onRemove?: () => void;

  /** Callback when chip is selected */
  onSelect?: () => void;

  /** Icon before text */
  icon?: React.ReactNode;

  /** Icon after text (before close button) */
  iconRight?: React.ReactNode;

  /** Avatar image before text */
  avatar?: React.ReactNode;

  /** Chip content */
  children: React.ReactNode;
}

// ============================================================================
// ICON COMPONENT (Atomic)
// ============================================================================

/**
 * Icon component props
 *
 * Renders SVG icons from the design system icon set.
 *
 * @example
 * ```tsx
 * <Icon name="dashboard" size="lg" color="primary" />
 * ```
 */
export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Icon name from registry */
  name: string;

  /** Icon size */
  size?: SizeVariant;

  /** Icon color */
  color?: IntentVariant;

  /** Icon visual variant */
  variant?: 'outline' | 'solid' | 'duotone';

  /** Whether icon is animated */
  animated?: boolean;

  /** Animation type */
  animation?: 'spin' | 'pulse' | 'bounce' | 'float';

  /** Animation duration in ms */
  animationDuration?: number;
}

// ============================================================================
// TEXT DISPLAY COMPONENTS (Atomic)
// ============================================================================

/**
 * Heading component props (H1-H6)
 */
export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Heading level (1-6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Visual size (can differ from level) */
  size?: SizeVariant;

  /** Text color/intent */
  intent?: IntentVariant;

  /** Text transformation */
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

  /** Heading content */
  children: React.ReactNode;
}

/**
 * Paragraph/text component props
 */
export interface TextProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Text size */
  size?: SizeVariant;

  /** Text color/intent */
  intent?: IntentVariant;

  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

  /** Line height multiplier */
  lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose';

  /** Text transformation */
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

  /** Whether text is muted/secondary */
  muted?: boolean;

  /** Whether text is truncated */
  truncate?: boolean;

  /** Number of lines to show before truncating */
  maxLines?: number;

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';

  /** Text content */
  children: React.ReactNode;
}

/**
 * Code display component props
 */
export interface CodeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Code content */
  children: string;

  /** Programming language for syntax highlighting */
  language?: string;

  /** Whether to show line numbers */
  showLineNumbers?: boolean;

  /** Whether code is inline or block */
  inline?: boolean;

  /** Copyable code block */
  copyable?: boolean;
}

// ============================================================================
// CARD COMPONENT (Molecule)
// ============================================================================

/**
 * Card component props
 *
 * Container component for grouping related content.
 * Supports hover effects, borders, and elevation levels.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Visual elevation/shadow level */
  elevation?: 'none' | 'low' | 'medium' | 'high';

  /** Whether card has a border */
  bordered?: boolean;

  /** Border color intent */
  borderColor?: IntentVariant;

  /** Interactive hover state */
  interactive?: boolean;

  /** Card padding */
  padding?: SizeVariant;

  /** Card shape */
  shape?: ShapeVariant;

  /** Card content */
  children: React.ReactNode;

  /** Header content (optional) */
  header?: React.ReactNode;

  /** Footer content (optional) */
  footer?: React.ReactNode;
}

// ============================================================================
// ALERT COMPONENT (Molecule)
// ============================================================================

/**
 * Alert component props
 *
 * Messages for communicating important information to users.
 * Supports dismissible state and action buttons.
 *
 * @example
 * ```tsx
 * <Alert variant="warning" dismissible onDismiss={handleDismiss}>
 *   This is a warning message
 * </Alert>
 * ```
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Alert semantic intent */
  variant: 'success' | 'warning' | 'error' | 'info';

  /** Alert title */
  title?: string;

  /** Alert description/content */
  children: React.ReactNode;

  /** Icon to display */
  icon?: React.ReactNode;

  /** Whether alert can be dismissed */
  dismissible?: boolean;

  /** Callback when alert is dismissed */
  onDismiss?: () => void;

  /** Action button configuration */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** Whether to show border only variant */
  bordered?: boolean;
}

// ============================================================================
// MODAL/DIALOG COMPONENT (Molecule)
// ============================================================================

/**
 * Modal/Dialog component props
 *
 * Overlay container for focused user interactions.
 * Manages focus, backdrop, and escape key behavior.
 */
export interface ModalProps extends BaseComponentProps {
  /** Whether modal is open */
  isOpen: boolean;

  /** Callback when modal should close */
  onClose: () => void;

  /** Modal title */
  title?: string;

  /** Modal description (for accessibility) */
  description?: string;

  /** Modal content */
  children: React.ReactNode;

  /** Footer content (typically action buttons) */
  footer?: React.ReactNode;

  /** Whether to show backdrop overlay */
  backdrop?: boolean;

  /** Whether to close on backdrop click */
  closeOnBackdropClick?: boolean;

  /** Whether to close on escape key */
  closeOnEscape?: boolean;

  /** Modal size */
  size?: SizeVariant;

  /** Whether to center modal vertically */
  centered?: boolean;

  /** Z-index for stacking */
  zIndex?: number;

  /** Custom overlay class */
  overlayClassName?: string;
}

// ============================================================================
// TOAST/NOTIFICATION COMPONENT (Molecule)
// ============================================================================

/**
 * Toast notification component props
 *
 * Temporary notification messages that appear and auto-dismiss.
 */
export interface ToastProps extends BaseComponentProps {
  /** Toast message content */
  message: string;

  /** Toast variant/intent */
  variant: IntentVariant;

  /** Toast title */
  title?: string;

  /** Duration before auto-dismiss (ms), null for no auto-dismiss */
  duration?: number | null;

  /** Icon to display */
  icon?: React.ReactNode;

  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** Callback when toast closes */
  onClose?: () => void;

  /** Position on screen */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// ============================================================================
// LOADER/SPINNER COMPONENT (Atomic)
// ============================================================================

/**
 * Spinner/Loader component props
 *
 * Animated loading indicator for async operations.
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" />
 * ```
 */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Spinner size */
  size?: SizeVariant;

  /** Spinner color variant */
  variant?: IntentVariant;

  /** Spinner type/style */
  type?: 'spinner' | 'dots' | 'pulse' | 'bounce';

  /** Spinner rotation speed (rpm) */
  speed?: number;

  /** Optional loading text */
  label?: string;

  /** Label position relative to spinner */
  labelPosition?: 'below' | 'right' | 'left';
}

// ============================================================================
// SKELETON/PLACEHOLDER COMPONENT (Atomic)
// ============================================================================

/**
 * Skeleton/placeholder component props
 *
 * Placeholder for loading states while content is being fetched.
 */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Skeleton variant */
  variant?: 'text' | 'circle' | 'rectangle' | 'thumbnail';

  /** Width of skeleton */
  width?: string | number;

  /** Height of skeleton */
  height?: string | number;

  /** Number of skeleton lines (for text variant) */
  count?: number;

  /** Whether skeleton is animated */
  animated?: boolean;

  /** Gap between skeleton elements */
  gap?: SizeVariant;
}

// ============================================================================
// PROGRESS BAR COMPONENT (Atomic)
// ============================================================================

/**
 * Progress bar component props
 *
 * Visual indicator of task completion or progress.
 */
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Progress percentage (0-100) */
  value: number;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Progress bar height/size */
  size?: SizeVariant;

  /** Color variant */
  variant?: IntentVariant;

  /** Whether to show percentage label */
  showLabel?: boolean;

  /** Whether progress is animated */
  animated?: boolean;

  /** Progress bar shape */
  shape?: ShapeVariant;

  /** Label formatter function */
  formatLabel?: (value: number) => string;
}

// ============================================================================
// TOGGLE/SWITCH COMPONENT (Atomic)
// ============================================================================

/**
 * Toggle/Switch component props
 *
 * Binary choice input component.
 *
 * @example
 * ```tsx
 * <Toggle
 *   checked={isEnabled}
 *   onChange={handleChange}
 *   label="Enable feature"
 * />
 * ```
 */
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'size' | 'onChange'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Label text */
  label?: string;

  /** Label position */
  labelPosition?: 'left' | 'right';

  /** Description/helper text */
  description?: string;

  /** Size of toggle */
  toggleSize?: SizeVariant;

  /** Callback when state changes */
  onChange?: (checked: boolean) => void;
}

// ============================================================================
// TAG COMPONENT (Atomic)
// ============================================================================

/**
 * Tag component props
 *
 * Label component for organizing content with keywords.
 * Similar to Badge but typically used in collections.
 */
export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Tag variant/intent */
  variant?: IntentVariant;

  /** Tag size */
  size?: SizeVariant;

  /** Whether tag is removable */
  removable?: boolean;

  /** Callback when tag is removed */
  onRemove?: () => void;

  /** Tag shape */
  shape?: ShapeVariant;

  /** Icon before text */
  icon?: React.ReactNode;

  /** Tag content */
  children: React.ReactNode;
}

// ============================================================================
// DIVIDER COMPONENT (Atomic)
// ============================================================================

/**
 * Divider component props
 *
 * Visual separator between content sections.
 */
export interface DividerProps extends Omit<React.HTMLAttributes<HTMLHRElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Divider orientation */
  direction?: 'horizontal' | 'vertical';

  /** Divider spacing/margin */
  spacing?: SizeVariant;

  /** Divider color variant */
  variant?: IntentVariant;

  /** Text to display on the divider */
  label?: string;

  /** Divider line style (solid, dashed, dotted) */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

// ============================================================================
// CONTAINER/LAYOUT COMPONENTS (Structure)
// ============================================================================

/**
 * Flex container component props
 *
 * Flexbox layout container with preset configurations.
 */
export interface FlexProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Flex direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /** Justify content alignment */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

  /** Align items alignment */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

  /** Align self alignment */
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'auto';

  /** Flex wrap behavior */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /** Gap between items */
  gap?: SizeVariant;

  /** Flex grow factor */
  grow?: number;

  /** Flex shrink factor */
  shrink?: number;

  /** Flex basis width */
  basis?: string;

  /** Container content */
  children: React.ReactNode;
}

/**
 * Grid container component props
 *
 * CSS Grid layout container.
 */
export interface GridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Number of columns */
  columns?: number;

  /** Gap between grid items */
  gap?: SizeVariant;

  /** Horizontal gap between items */
  columnGap?: SizeVariant;

  /** Vertical gap between items */
  rowGap?: SizeVariant;

  /** Grid auto flow */
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

  /** Grid content alignment */
  align?: 'start' | 'end' | 'center' | 'stretch';

  /** Grid content justification */
  justify?: 'start' | 'end' | 'center' | 'stretch';

  /** Grid container content */
  children: React.ReactNode;
}

/**
 * Stack container component props
 *
 * Vertical or horizontal spacing container.
 */
export interface StackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class names to apply */
  className?: string;

  /** Stack direction */
  direction?: 'vertical' | 'horizontal';

  /** Spacing between items */
  spacing?: SizeVariant;

  /** Item alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';

  /** Whether items take equal space */
  equalWidths?: boolean;

  /** Stack content */
  children: React.ReactNode;
}

// ============================================================================
// COMPONENT REGISTRY & UTILITIES
// ============================================================================

/**
 * Component type registry for runtime validation and type-safe component lookup
 */
export const componentTypeRegistry = {
  button: 'ButtonProps',
  input: 'InputProps',
  textarea: 'TextareaProps',
  badge: 'BadgeProps',
  chip: 'ChipProps',
  icon: 'IconProps',
  heading: 'HeadingProps',
  text: 'TextProps',
  code: 'CodeProps',
  card: 'CardProps',
  alert: 'AlertProps',
  modal: 'ModalProps',
  toast: 'ToastProps',
  spinner: 'SpinnerProps',
  skeleton: 'SkeletonProps',
  progress: 'ProgressProps',
  toggle: 'ToggleProps',
  tag: 'TagProps',
  divider: 'DividerProps',
  flex: 'FlexProps',
  grid: 'GridProps',
  stack: 'StackProps',
} as const;

export type ComponentName = keyof typeof componentTypeRegistry;

/**
 * Helper type to extract props from component names
 */
export type ComponentPropsFor<T extends ComponentName> =
  T extends 'button' ? ButtonProps :
  T extends 'input' ? InputProps :
  T extends 'textarea' ? TextareaProps :
  T extends 'badge' ? BadgeProps :
  T extends 'chip' ? ChipProps :
  T extends 'icon' ? IconProps :
  T extends 'heading' ? HeadingProps :
  T extends 'text' ? TextProps :
  T extends 'code' ? CodeProps :
  T extends 'card' ? CardProps :
  T extends 'alert' ? AlertProps :
  T extends 'modal' ? ModalProps :
  T extends 'toast' ? ToastProps :
  T extends 'spinner' ? SpinnerProps :
  T extends 'skeleton' ? SkeletonProps :
  T extends 'progress' ? ProgressProps :
  T extends 'toggle' ? ToggleProps :
  T extends 'tag' ? TagProps :
  T extends 'divider' ? DividerProps :
  T extends 'flex' ? FlexProps :
  T extends 'grid' ? GridProps :
  T extends 'stack' ? StackProps :
  never;
