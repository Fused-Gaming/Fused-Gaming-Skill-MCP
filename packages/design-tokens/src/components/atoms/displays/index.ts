/**
 * Display Components (Atomic)
 * Text and content display elements
 *
 * @packageDocumentation
 */

export type { HeadingProps, TextProps, CodeProps, IconProps, BadgeProps, TagProps } from '../../../types/components.js';

/**
 * Heading component - Semantic heading levels H1-H6
 *
 * Levels: 1-6
 * Sizes: xs, sm, md, lg, xl
 */
export { Heading } from './Heading.js';

/**
 * Text component - Paragraph and body text
 *
 * Sizes: xs, sm, md, lg, xl
 * Weights: light, normal, medium, semibold, bold
 */
export { Text } from './Text.js';

/**
 * Code component - Inline and block code display
 *
 * Features: syntax highlighting, line numbers, copyable
 */
export { Code } from './Code.js';

/**
 * Icon component - SVG icon renderer
 *
 * Sizes: xs, sm, md, lg, xl
 * Variants: outline, solid, duotone
 */
export { Icon } from './Icon.js';

/**
 * Badge component - Small status/label indicator
 *
 * Sizes: xs, sm, md, lg
 * Variants: primary, secondary, success, warning, danger, info, neutral
 */
export { Badge } from './Badge.js';

/**
 * Tag component - Keyword label element
 *
 * Sizes: xs, sm, md, lg, xl
 * Features: removable, colorable
 */
export { Tag } from './Tag.js';
