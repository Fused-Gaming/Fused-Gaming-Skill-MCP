/**
 * Feedback Components (Atomic)
 * User feedback and loading state indicators
 *
 * @packageDocumentation
 */

export type { SpinnerProps, SkeletonProps, ProgressProps, DividerProps, ChipProps } from '../../../types/components.js';

/**
 * Spinner component - Animated loading indicator
 *
 * Types: spinner, dots, pulse, bounce
 * Sizes: xs, sm, md, lg, xl
 */
export { Spinner } from './Spinner.js';

/**
 * Skeleton component - Placeholder for loading states
 *
 * Variants: text, circle, rectangle, thumbnail
 * Animated: true/false
 */
export { Skeleton } from './Skeleton.js';

/**
 * Progress component - Task completion indicator
 *
 * Sizes: xs, sm, md, lg, xl
 * Shapes: sharp, rounded, pill
 */
export { Progress } from './Progress.js';

/**
 * Divider component - Visual separator
 *
 * Directions: horizontal, vertical
 * Styles: solid, dashed, dotted
 */
export { Divider } from './Divider.js';

/**
 * Chip component - Compact interactive element
 *
 * Features: selectable, removable, avatar support
 * Sizes: xs, sm, md, lg, xl
 */
export { Chip } from './Chip.js';
