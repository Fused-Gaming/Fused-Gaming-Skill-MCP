/**
 * SyncPulse Design Tokens
 * Complete design system token exports
 */

// Color tokens
export {
  colors,
  type ColorValue,
  type AllColors
} from './colors.js';

// Typography tokens
export {
  typography,
  type TextStyle,
  type FontFamily,
  type FontWeight,
  type FontSize,
  type LineHeight,
  type LetterSpacing
} from './typography.js';

// Spacing tokens
export {
  spacing,
  spacingSets,
  componentSpacing,
  type SpacingValue,
  type SpacingKey
} from './spacing.js';

// Shadow and glow tokens
export {
  shadows,
  shadowPresets,
  type ShadowKey,
  type ElevationLevel
} from './shadows.js';

// Motion and animation tokens
export {
  motion,
  keyframes,
  type DurationKey,
  type EasingKey,
  type AnimationKey,
  type KeyframeKey
} from './motion.js';

// Component tokens
export {
  componentTokens,
  type ComponentToken,
  type ComponentName
} from './components.js';

// Agent tokens
export {
  agentTokens,
  agentStatus,
  agentCardPresets,
  agentIconSizes,
  type AgentName,
  type AgentStatusType,
  type AgentIconSize
} from './agents.js';

// Import for designSystem object
import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, spacingSets, componentSpacing } from './spacing.js';
import { shadows, shadowPresets } from './shadows.js';
import { motion, keyframes } from './motion.js';
import { componentTokens } from './components.js';
import { agentTokens, agentStatus, agentCardPresets, agentIconSizes } from './agents.js';

/**
 * Complete Design System Bundle
 * Combines all token categories for unified exports
 */
export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  motion,
  components: componentTokens,
  agents: agentTokens,
  agentStatus,
  agentCardPresets,
  agentIconSizes,
  spacingSets,
  componentSpacing,
  shadowPresets,
  keyframes
} as const;

export type DesignSystem = typeof designSystem;
