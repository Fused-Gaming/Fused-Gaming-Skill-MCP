/**
 * SyncPulse Design System Components
 * Complete component library for atomic design
 *
 * @packageDocumentation
 */

// Atomic Components
export * from './atoms/index.js';

// Molecule Components
export * from './molecules/index.js';

// Layout Components
export * from './layout/index.js';

// Type Exports
export type {
  // Utility types
  BaseComponentProps,
  SizeVariant,
  IntentVariant,
  ShapeVariant,
  // Button types
  ButtonProps,
  // Input types
  InputProps,
  TextareaProps,
  ToggleProps,
  // Display types
  HeadingProps,
  TextProps,
  CodeProps,
  IconProps,
  BadgeProps,
  TagProps,
  // Feedback types
  SpinnerProps,
  SkeletonProps,
  ProgressProps,
  DividerProps,
  ChipProps,
  // Structure types
  FlexProps,
  GridProps,
  StackProps,
  // Molecule types
  CardProps,
  AlertProps,
  ModalProps,
  ToastProps,
  // Registry
  ComponentName,
  ComponentPropsFor,
} from '../types/components.js';

export {
  componentTypeRegistry,
} from '../types/components.js';
