/**
 * Structure Components (Atomic)
 * Layout and spacing container elements
 *
 * @packageDocumentation
 */

export type { FlexProps, GridProps, StackProps } from '../../../types/components.js';

/**
 * Flex component - Flexbox layout container
 *
 * Direction: row, column, row-reverse, column-reverse
 * Justify: flex-start, flex-end, center, space-between, space-around, space-evenly
 * Align: flex-start, flex-end, center, stretch, baseline
 */
export { Flex } from './Flex.js';

/**
 * Grid component - CSS Grid layout container
 *
 * Features: automatic column generation, gap controls, alignment
 * Responsive: based on columns prop
 */
export { Grid } from './Grid.js';

/**
 * Stack component - Vertical or horizontal spacing container
 *
 * Direction: vertical (column), horizontal (row)
 * Spacing: xs, sm, md, lg, xl
 */
export { Stack } from './Stack.js';
