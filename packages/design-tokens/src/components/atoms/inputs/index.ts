/**
 * Input Components (Atomic)
 * Form input elements including text, textarea, and toggle controls
 *
 * @packageDocumentation
 */

export type { InputProps, TextareaProps, ToggleProps } from '../../../types/components.js';

/**
 * Input component - Single-line text input
 *
 * Types: text, email, password, number, url, tel, search
 * States: default, focused, error, success, disabled
 */
export { Input } from './Input.js';

/**
 * Textarea component - Multi-line text input
 *
 * Features: auto-resize, character counter, placeholder
 */
export { Textarea } from './Textarea.js';

/**
 * Toggle/Switch component - Binary choice input
 *
 * States: on, off, disabled
 * Sizes: sm, md, lg
 */
export { Toggle } from './Toggle.js';
