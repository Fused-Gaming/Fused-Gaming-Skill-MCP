# @h4shed/design-tokens - Usage Examples

Complete practical examples for using SyncPulse design tokens in your projects.

## Table of Contents

1. [Basic Token Access](#basic-token-access)
2. [React Components](#react-components)
3. [CSS-in-JS Usage](#css-in-js-usage)
4. [Tailwind Configuration](#tailwind-configuration)
5. [Design System Generator](#design-system-generator)
6. [Agent-Based Components](#agent-based-components)
7. [Type-Safe Tokens](#type-safe-tokens)

## Basic Token Access

### Simple Color Usage

```typescript
import { colors } from '@h4shed/design-tokens';

// Primary colors
const primaryBackground = colors.primary[500];      // #9333EA
const primaryLight = colors.primary[100];           // #E9D5FF
const primaryDark = colors.primary[900];            // #3B0764

// Neon colors
const neonPurple = colors.neon.purple;              // #A855F7
const neonGreen = colors.neon.secureGreen;          // #22C55E
const neonBlue = colors.neon.cyberBlue;             // #0EA5E9

// Semantic colors
const success = colors.semantic.success;            // #22C55E
const warning = colors.semantic.warning;            // #F59E0B
const danger = colors.semantic.danger;              // #EF4444

// Text colors
const textPrimary = colors.text.primary;            // #FFFFFF
const textSecondary = colors.text.secondary;        // #D1D5DB
const textMuted = colors.text.muted;                // #9CA3AF

console.log(`Primary button: background ${primaryBackground}`);
```

### Spacing Scale

```typescript
import { spacing, componentSpacing } from '@h4shed/design-tokens';

// Raw spacing values
const smallGap = spacing[2];                        // 8px
const mediumGap = spacing[4];                       // 16px
const largeGap = spacing[8];                        // 32px

// Component presets
const buttonPadding = componentSpacing.buttonMD;    // Padding for medium button
const cardPadding = componentSpacing.cardPaddingLG; // Large card padding
const inputPadding = componentSpacing.inputPadding; // Standard input padding

// Using in calculations
const totalWidth = `calc(100% - ${spacing[4]} * 2)`;
```

## React Components

### Button Component with Tokens

```typescript
import React from 'react';
import { colors, typography, spacing, motion, componentTokens, shadows } from '@h4shed/design-tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children,
  onClick 
}) => {
  const tokens = componentTokens.button[variant];
  
  const paddingMap = {
    sm: `${spacing[2]} ${spacing[3]}`,
    md: `${spacing[2]} ${spacing[4]}`,
    lg: `${spacing[3]} ${spacing[6]}`
  };

  return (
    <button
      onClick={onClick}
      style={{
        background: tokens.background,
        color: tokens.color,
        border: `1px solid ${tokens.border}`,
        padding: paddingMap[size],
        borderRadius: '6px',
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        cursor: 'pointer',
        transition: motion.transition.default,
        boxShadow: tokens.shadow,
        ':hover': {
          background: tokens.backgroundHover,
          boxShadow: tokens.shadowHover
        }
      }}
    >
      {children}
    </button>
  );
};
```

### Card Component with Glow Effect

```typescript
import React from 'react';
import { componentTokens, spacing, shadows, motion } from '@h4shed/design-tokens';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  elevated = false 
}) => {
  const tokens = componentTokens.card;
  const shadowStyle = elevated 
    ? shadows.shadowXL 
    : shadows.shadowMedium;

  return (
    <div
      style={{
        background: elevated ? tokens.backgroundElevated : tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        padding: spacing[4],
        boxShadow: shadowStyle,
        filter: tokens.blur,
        transition: motion.transition.default
      }}
    >
      {title && (
        <h2
          style={{
            marginTop: 0,
            marginBottom: spacing[4],
            fontSize: '1.25rem',
            color: '#FFFFFF'
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
```

### Input with Validation States

```typescript
import React, { useState } from 'react';
import { componentTokens, motion } from '@h4shed/design-tokens';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChange, 
  error 
}) => {
  const [focused, setFocused] = useState(false);
  const tokens = componentTokens.input;

  const borderColor = error 
    ? tokens.borderError 
    : (focused ? tokens.borderFocus : tokens.border);
  
  const boxShadow = error 
    ? tokens.shadowError 
    : (focused ? tokens.shadowFocus : 'none');

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        background: tokens.background,
        border: `1px solid ${borderColor}`,
        borderRadius: tokens.radius,
        padding: '8px 12px',
        color: tokens.text,
        fontSize: '1rem',
        transition: motion.transition.default,
        boxShadow,
        ':disabled': {
          color: tokens.textDisabled,
          opacity: 0.6
        }
      }}
    />
  );
};
```

## CSS-in-JS Usage

### Styled Components Integration

```typescript
import styled from 'styled-components';
import { colors, spacing, motion, shadows, typography } from '@h4shed/design-tokens';

export const StyledButton = styled.button`
  background-color: ${colors.primary[500]};
  color: ${colors.text.primary};
  padding: ${spacing[3]} ${spacing[4]};
  border: none;
  border-radius: 6px;
  font-family: ${typography.fontFamily.body};
  cursor: pointer;
  transition: ${motion.transition.default};
  box-shadow: ${shadows.glowMedium};

  &:hover {
    background-color: ${colors.primary[600]};
    box-shadow: ${shadows.glowLarge};
  }

  &:active {
    background-color: ${colors.primary[700]};
  }
`;

export const StyledCard = styled.div`
  background: ${colors.background.card};
  border: 1px solid ${colors.border.default};
  border-radius: 8px;
  padding: ${spacing[4]};
  box-shadow: ${shadows.shadowMedium};
  backdrop-filter: blur(8px);
  transition: ${motion.transition.default};

  &:hover {
    border-color: ${colors.border.glow};
    box-shadow: ${shadows.shadowLarge}, ${shadows.glowMedium};
  }
`;
```

### CSS-in-JS with Emotion

```typescript
import { css } from '@emotion/react';
import { colors, typography, spacing, shadows, motion } from '@h4shed/design-tokens';

export const buttonStyles = css`
  background-color: ${colors.primary[500]};
  color: ${colors.text.primary};
  padding: ${spacing[2]} ${spacing[4]};
  border: 1px solid ${colors.border.default};
  border-radius: 6px;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: ${motion.transition.default};
  box-shadow: ${shadows.glowSmall};

  &:hover {
    background-color: ${colors.primary[600]};
    box-shadow: ${shadows.glowMedium};
  }

  &:focus {
    outline: none;
    box-shadow: ${shadows.glowLarge};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const cardStyles = css`
  background: ${colors.background.card};
  border: 1px solid ${colors.border.default};
  border-radius: 8px;
  padding: ${spacing[4]};
  box-shadow: ${shadows.shadowMedium};
  backdrop-filter: blur(8px);
  transition: ${motion.transition.default};

  &:hover {
    border-color: ${colors.neon.purple};
    box-shadow: ${shadows.shadowLarge}, ${shadows.glowMedium};
  }
`;
```

## Tailwind Configuration

### tailwind.config.js

```javascript
import { 
  colors, 
  spacing, 
  typography, 
  motion, 
  shadows 
} from '@h4shed/design-tokens';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors,
    spacing,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    transitionDuration: motion.duration,
    transitionTimingFunction: motion.easing,
    boxShadow: shadows.elevation,
    extend: {
      animation: {
        pulse: 'pulseGlow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 16px rgba(168, 85, 247, 0.8)' },
        },
      }
    }
  }
};
```

## Design System Generator

### Exporting to CSS Variables

```typescript
import { designSystem } from '@h4shed/design-tokens';

function generateCSSVariables(): string {
  const cssVars: string[] = [':root {'];

  // Colors
  Object.entries(designSystem.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars.push(`  --color-${key}: ${value};`);
    } else {
      Object.entries(value).forEach(([colorKey, colorValue]) => {
        cssVars.push(`  --color-${key}-${colorKey}: ${colorValue};`);
      });
    }
  });

  // Spacing
  Object.entries(designSystem.spacing).forEach(([key, value]) => {
    cssVars.push(`  --spacing-${key}: ${value};`);
  });

  // Durations
  Object.entries(designSystem.motion.duration).forEach(([key, value]) => {
    cssVars.push(`  --duration-${key}: ${value};`);
  });

  cssVars.push('}');
  return cssVars.join('\n');
}

// Use it
const cssOutput = generateCSSVariables();
console.log(cssOutput);
```

## Agent-Based Components

### Agent Status Badge

```typescript
import React from 'react';
import { agentTokens, agentStatus } from '@h4shed/design-tokens';

interface AgentBadgeProps {
  agentName: 'orchestrator' | 'sentinel' | 'analyst' | 'executor';
  status: 'active' | 'inactive' | 'error' | 'pending';
  showLabel?: boolean;
}

export const AgentBadge: React.FC<AgentBadgeProps> = ({ 
  agentName, 
  status,
  showLabel = true 
}) => {
  const agent = agentTokens[agentName];
  const statusToken = agentStatus[status];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 12px',
        background: agent.cardBackground,
        border: `1px solid ${agent.borderColor}`,
        borderRadius: '6px',
        boxShadow: agent.glow
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusToken.color,
          boxShadow: `0 0 4px ${statusToken.color}`
        }}
      />
      {showLabel && (
        <span style={{ color: agent.color, fontSize: '0.875rem' }}>
          {agent.name}
        </span>
      )}
    </div>
  );
};
```

### Agent Card Component

```typescript
import React from 'react';
import { agentTokens, agentCardPresets } from '@h4shed/design-tokens';

interface AgentCardProps {
  agentName: 'orchestrator' | 'sentinel' | 'analyst' | 'executor';
  status: string;
  currentTask: string;
  confidence: number;
  children?: React.ReactNode;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agentName,
  status,
  currentTask,
  confidence,
  children
}) => {
  const agent = agentTokens[agentName];
  const preset = agentCardPresets[agentName];

  return (
    <div
      style={{
        background: preset.background,
        border: preset.border,
        borderRadius: '8px',
        padding: '16px',
        boxShadow: preset.glow,
        transition: 'all 280ms ease-in-out'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: `1px solid ${preset.accent}33`
        }}
      >
        <h3 style={{ color: agent.color, margin: 0 }}>
          {agent.name}
        </h3>
        <span style={{ color: preset.accent }}>
          {status}
        </span>
      </div>

      <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>
        <p>Task: {currentTask}</p>
        <p>Confidence: {confidence}%</p>
      </div>

      {children}
    </div>
  );
};
```

## Type-Safe Tokens

### Using TypeScript Types

```typescript
import { 
  colors,
  type AllColors,
  type TextStyle,
  type DurationKey,
  type AgentName
} from '@h4shed/design-tokens';

// Type-safe color selection
function getColorValue(colorKey: keyof AllColors): string | object {
  return colors[colorKey];
}

// Type-safe text styles
const textStyleKey: TextStyle = 'h1'; // Autocomplete available
const style = typography.textStyles[textStyleKey];

// Type-safe duration selection
const duration: DurationKey = 'normal'; // 'instant', 'fast', 'normal', 'slow', 'cinematic'
const animationDuration = motion.duration[duration];

// Type-safe agent selection
const agentName: AgentName = 'orchestrator'; // 'orchestrator' | 'sentinel' | 'analyst' | 'executor'
const agentColor = agentTokens[agentName].color;

// Function with typed tokens
function createAnimatedButton(
  durationKey: DurationKey,
  textStyle: TextStyle
): object {
  return {
    transition: `all ${motion.duration[durationKey]} ${motion.easing.default}`,
    ...typography.textStyles[textStyle]
  };
}
```

## Advanced Patterns

### Theme Provider Pattern

```typescript
import React, { createContext, useContext } from 'react';
import { designSystem } from '@h4shed/design-tokens';

interface Theme {
  colors: typeof designSystem.colors;
  spacing: typeof designSystem.spacing;
  motion: typeof designSystem.motion;
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <ThemeContext.Provider value={designSystem as any}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  return theme;
};
```

### Dynamic Token Selection

```typescript
import { componentTokens } from '@h4shed/design-tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

function getButtonTokens(variant: ButtonVariant, size: ButtonSize) {
  const variantTokens = componentTokens.button[variant];
  const sizeTokens = {
    sm: { padding: '4px 12px', fontSize: '0.875rem' },
    md: { padding: '8px 16px', fontSize: '1rem' },
    lg: { padding: '12px 24px', fontSize: '1.125rem' }
  };

  return {
    ...variantTokens,
    ...sizeTokens[size]
  };
}
```

These examples cover the main use cases for the design tokens. Adapt them to your specific framework and project needs.
