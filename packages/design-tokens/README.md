# @h4shed/design-tokens

SyncPulse Design System - Complete token system with colors, typography, spacing, shadows, animations, and component tokens.

## Overview

This package provides the foundational design tokens for the SyncPulse design system, a purple-neon cyberpunk-themed design language used across all SyncPulse products and components.

## Features

- **Colors**: Complete color palette with primary gradients, neon colors, semantic colors, and status indicators
- **Typography**: Font families, weights, sizes, line heights, and pre-composed text styles
- **Spacing**: 4px-based spacing scale with component presets and utility combinations
- **Shadows & Glows**: Multiple shadow layers, neon glows, and glassmorphism effects
- **Animations**: Easing curves, durations, keyframe animations, and transition presets
- **Components**: Pre-defined tokens for buttons, cards, inputs, terminals, and more
- **Agents**: Special tokens for agent personas (Orchestrator, Sentinel, Analyst, Executor)

## Installation

```bash
npm install @h4shed/design-tokens
```

## Usage

### Import All Tokens

```typescript
import { designSystem, colors, typography, spacing } from '@h4shed/design-tokens';

// Access nested tokens
const primaryColor = colors.primary[500];
const buttonBackground = colors.neon.purple;
```

### Import Specific Token Categories

```typescript
// Colors
import { colors } from '@h4shed/design-tokens/colors';

// Typography
import { typography } from '@h4shed/design-tokens/typography';

// Spacing
import { spacing } from '@h4shed/design-tokens/spacing';

// Shadows
import { shadows, shadowPresets } from '@h4shed/design-tokens/shadows';

// Motion
import { motion, keyframes } from '@h4shed/design-tokens/motion';

// Components
import { componentTokens } from '@h4shed/design-tokens/components';

// Agents
import { agentTokens, agentStatus } from '@h4shed/design-tokens/agents';
```

## Token Categories

### Colors

```typescript
import { colors } from '@h4shed/design-tokens';

// Primary purple gradient
colors.primary[50];   // #F3E8FF
colors.primary[500];  // #9333EA
colors.primary[900];  // #3B0764

// Neon palette
colors.neon.purple;       // #A855F7
colors.neon.cyberBlue;    // #0EA5E9
colors.neon.secureGreen;  // #22C55E

// Semantic colors
colors.semantic.success;  // #22C55E
colors.semantic.warning;  // #F59E0B
colors.semantic.danger;   // #EF4444
colors.semantic.info;     // #0EA5E9

// Text colors
colors.text.primary;      // #FFFFFF
colors.text.secondary;    // #D1D5DB
colors.text.muted;        // #9CA3AF
```

### Typography

```typescript
import { typography } from '@h4shed/design-tokens';

// Font families
typography.fontFamily.display;  // Orbitron, Rajdhani
typography.fontFamily.body;     // Inter, Manrope
typography.fontFamily.mono;     // JetBrains Mono

// Font sizes
typography.fontSize.xs;     // 0.75rem (12px)
typography.fontSize.base;   // 1rem (16px)
typography.fontSize.hero;   // 7.5rem (120px)

// Text styles (pre-composed)
const heading = typography.textStyles.h1;
const body = typography.textStyles.body;
const code = typography.textStyles.mono;
```

### Spacing

```typescript
import { spacing, componentSpacing } from '@h4shed/design-tokens';

// Base scale
spacing[0];   // 0px
spacing[4];   // 16px
spacing[8];   // 32px
spacing[24];  // 96px

// Component presets
componentSpacing.buttonMD;    // Padding for medium button
componentSpacing.cardPaddingLG; // Padding for large card
componentSpacing.inputPadding;  // Standard input padding
```

### Shadows & Glows

```typescript
import { shadows, shadowPresets } from '@h4shed/design-tokens';

// Individual shadows
shadows.glowMedium;      // 0 0 16px rgba(168, 85, 247, 0.6)
shadows.glowSecure;      // 0 0 12px rgba(34, 197, 94, 0.5)
shadows.neonBorder;      // Multiple layer border glow

// Presets
shadowPresets.card;      // Complete card shadow with glow
shadowPresets.buttonHover; // Button hover state shadow
shadowPresets.inputFocus;  // Input focus shadow
```

### Motion & Animations

```typescript
import { motion, keyframes } from '@h4shed/design-tokens';

// Durations
motion.duration.fast;    // 160ms
motion.duration.normal;  // 280ms
motion.duration.slow;    // 420ms

// Easing curves
motion.easing.default;   // cubic-bezier(0.4, 0, 0.2, 1)
motion.easing.smooth;    // Smooth spring curve
motion.easing.bounce;    // Bounce effect

// Animation presets
motion.animation.fadeIn;
motion.animation.slideInUp;
motion.animation.pulse;

// Keyframes (CSS string)
keyframes.pulseGlow;
keyframes.float;
keyframes.scanline;
```

### Component Tokens

```typescript
import { componentTokens } from '@h4shed/design-tokens';

// Button tokens
componentTokens.button.primary;     // Primary button colors
componentTokens.button.secondary;   // Secondary button
componentTokens.button.danger;      // Danger/destructive button

// Card tokens
componentTokens.card.background;    // Card background
componentTokens.card.radius;        // Border radius
componentTokens.card.shadowGlow;    // Card glow effect

// Input tokens
componentTokens.input.background;   // Input field background
componentTokens.input.borderFocus;  // Focus state border
componentTokens.input.shadowFocus;  // Focus state glow

// Terminal tokens
componentTokens.terminal.background;  // Terminal background
componentTokens.terminal.text;        // Terminal text color
componentTokens.terminal.glow;        // Terminal glow effect
```

### Agent Tokens

```typescript
import { agentTokens, agentStatus } from '@h4shed/design-tokens';

// Agent persona colors
agentTokens.orchestrator.color;   // #A855F7 (purple)
agentTokens.sentinel.color;       // #22C55E (green)
agentTokens.analyst.color;        // #0EA5E9 (cyan)
agentTokens.executor.color;       // #EC4899 (pink)

// Agent status
agentStatus.active;     // Green status
agentStatus.error;      // Red status
agentStatus.pending;    // Amber status

// Agent card presets
const orchestratorCard = agentCardPresets.orchestrator;
// Includes background, border, glow, and accent colors
```

## Design System Structure

The SyncPulse design system uses a purple-neon cyberpunk theme with:

- **Primary Color**: Purple (#A855F7) - Main interaction and brand color
- **Neon Accents**: Electric blue, plasma pink, secure green for semantic meaning
- **Dark Backgrounds**: Deep navy (#0F0F1E) for OLED and accessibility
- **Typography**: Modern sans-serif (Inter/Manrope) with tech-forward display font (Orbitron)
- **Spacing**: 4px base unit for flexible, scalable layouts
- **Motion**: Smooth cubic-bezier curves with neon glow effects

## Usage Examples

### React Component

```typescript
import { colors, typography, spacing, componentTokens } from '@h4shed/design-tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const tokens = componentTokens.button[variant];
  
  return (
    <button
      style={{
        background: tokens.background,
        color: tokens.color,
        border: `1px solid ${tokens.border}`,
        padding: `${spacing[2]} ${spacing[4]}`,
        borderRadius: '6px',
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.base,
        cursor: 'pointer',
        transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: tokens.shadow
      }}
    >
      {children}
    </button>
  );
}
```

### CSS Variables Export

```typescript
// Generate CSS variables from tokens
import { colors, spacing, typography } from '@h4shed/design-tokens';

const cssVariables = `
  :root {
    --color-primary: ${colors.primary[500]};
    --color-neon-purple: ${colors.neon.purple};
    --spacing-4: ${spacing[4]};
    --spacing-8: ${spacing[8]};
    --font-display: ${typography.fontFamily.display};
    --font-body: ${typography.fontFamily.body};
  }
`;
```

### Tailwind Configuration

```javascript
// tailwind.config.js
import { colors, spacing, typography, motion } from '@h4shed/design-tokens';

module.exports = {
  theme: {
    colors,
    spacing,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    transitionDuration: motion.duration
  }
};
```

## TypeScript Support

All tokens are fully typed with TypeScript interfaces:

```typescript
import type {
  AllColors,
  TextStyle,
  SpacingValue,
  DurationKey,
  ComponentName,
  AgentName
} from '@h4shed/design-tokens';
```

## Accessibility

- High contrast ratios (WCAG AA compliant)
- Semantic color usage for status indication
- Readable typography scales
- Sufficient spacing between interactive elements

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript ES2020+
- CSS Grid and Flexbox support recommended

## Development

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Watch Mode

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

## Publishing

This package is published to npm as `@h4shed/design-tokens`.

```bash
npm publish
```

## License

Apache 2.0 - See LICENSE file for details

## Contributing

Contributions are welcome. Please ensure:
- All token values are defined with proper TypeScript types
- Documentation is updated for new tokens
- Accessibility standards are maintained
- Tokens follow the naming conventions

## Icon System

This package also includes the **24-Icon System** for SyncPulse:

```typescript
import { Icon } from '@h4shed/design-tokens/icons';

// Navigation icons
<Icon name="home" size="md" color="primary" />
<Icon name="dashboard" size="md" color="primary" />
<Icon name="settings" size="md" color="primary" />

// Status icons
<Icon name="active" color="success" />
<Icon name="error" color="danger" />
<Icon name="pending" color="primary" />

// Agent icons
<Icon name="orchestrator" size="lg" color="primary" />
<Icon name="sentinel" size="lg" color="warning" />
<Icon name="analyst" size="lg" color="secondary" />
<Icon name="executor" size="lg" color="success" />
```

See [ICONS_GUIDE.md](./ICONS_GUIDE.md) for complete icon documentation.

## Related Packages

- `@h4shed/ui-components` - UI component library using these tokens
- `@h4shed/mcp` - Main MCP server package
- `@h4shed/cli` - Command-line interface

## Support

For issues, questions, or suggestions:
- GitHub Issues: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues
- Email: support@fused-gaming.io
