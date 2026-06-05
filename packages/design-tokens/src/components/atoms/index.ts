/**
 * Atomic Components
 * Base-level UI components that cannot be broken down further
 *
 * Categories:
 * - Buttons: Click-based interactions
 * - Inputs: Form entry elements
 * - Displays: Content display (text, icons, badges)
 * - Feedback: Loading and progress indicators
 * - Structure: Layout containers
 *
 * @packageDocumentation
 */

// Button Components
export { Button, IconButton, LinkButton } from './buttons/index.js';
export type { ButtonProps } from '../../types/components.js';

// Input Components
export { Input, Textarea, Toggle } from './inputs/index.js';
export type { InputProps, TextareaProps, ToggleProps } from '../../types/components.js';

// Display Components
export { Heading, Text, Code, Icon, Badge, Tag } from './displays/index.js';
export type { HeadingProps, TextProps, CodeProps, IconProps, BadgeProps, TagProps } from '../../types/components.js';

// Feedback Components
export { Spinner, Skeleton, Progress, Divider, Chip } from './feedback/index.js';
export type { SpinnerProps, SkeletonProps, ProgressProps, DividerProps, ChipProps } from '../../types/components.js';

// Structure Components
export { Flex, Grid, Stack } from './structure/index.js';
export type { FlexProps, GridProps, StackProps } from '../../types/components.js';
