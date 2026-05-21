/**
 * Button Components
 * Atomic button elements with multiple variants and states
 *
 * @packageDocumentation
 */

export type { ButtonProps } from '../../../types/components.js';

/**
 * Button component - Main clickable button element
 *
 * Variants: primary, secondary, danger, ghost
 * Sizes: xs, sm, md, lg, xl
 *
 * @example
 * ```tsx
 * import { Button } from '@h4shed/design-tokens/components';
 *
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
 */
export { Button } from './Button.js';

/**
 * IconButton component - Button optimized for icon content
 *
 * Typically square, no text label
 */
export { IconButton } from './IconButton.js';

/**
 * LinkButton component - Button styled as a link
 *
 * For secondary actions and navigation
 */
export { LinkButton } from './LinkButton.js';
