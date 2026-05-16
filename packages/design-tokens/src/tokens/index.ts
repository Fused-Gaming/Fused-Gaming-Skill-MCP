/**
 * SyncPulse Design Tokens
 * Complete design system token exports
 */

// Color tokens
export {
  colors,
  type ColorValue,
  type AllColors
} from './colors';

// Typography tokens
export {
  typography,
  type TextStyle,
  type FontFamily,
  type FontWeight,
  type FontSize,
  type LineHeight,
  type LetterSpacing
} from './typography';

// Spacing tokens
export {
  spacing,
  spacingSets,
  componentSpacing,
  type SpacingValue,
  type SpacingKey
} from './spacing';

// Shadow and glow tokens
export {
  shadows,
  shadowPresets,
  type ShadowKey,
  type ElevationLevel
} from './shadows';

// Motion and animation tokens
export {
  motion,
  keyframes,
  type DurationKey,
  type EasingKey,
  type AnimationKey,
  type KeyframeKey
} from './motion';

// Component tokens
export {
  componentTokens,
  type ComponentToken,
  type ComponentName
} from './components';

// Agent tokens
export {
  agentTokens,
  agentStatus,
  agentCardPresets,
  agentIconSizes,
  type AgentName,
  type AgentStatusType,
  type AgentIconSize
} from './agents';

// Import for designSystem object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, spacingSets, componentSpacing } from './spacing';
import { shadows, shadowPresets } from './shadows';
import { motion, keyframes } from './motion';
import { componentTokens } from './components';
import { agentTokens, agentStatus, agentCardPresets, agentIconSizes } from './agents';

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
