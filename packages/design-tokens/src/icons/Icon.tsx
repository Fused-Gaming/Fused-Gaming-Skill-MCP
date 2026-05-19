/**
 * Icon Component
 * Reusable React component for rendering SyncPulse icons with customizable size and color
 */

import React from 'react';
import type { IconProps, IconColor } from '../types/icons.js';
import { getIcon } from './registry.js';
import { ICON_SIZES } from '../types/icons.js';

/**
 * Color CSS variable mappings for semantic icon colors
 */
const colorMap: Record<IconColor, string> = {
  primary: 'var(--color-primary, currentColor)',
  secondary: 'var(--color-secondary, currentColor)',
  success: 'var(--color-success, #10b981)',
  warning: 'var(--color-warning, #f59e0b)',
  danger: 'var(--color-danger, #ef4444)',
  neutral: 'var(--color-neutral, #6b7280)',
};

/**
 * Icon Component
 * Renders SVG icons with support for size, color, and styling variants
 *
 * @example
 * ```tsx
 * <Icon name="home" size="md" color="primary" />
 * <Icon name="settings" size="lg" color="secondary" />
 * <Icon name="success" color="success" />
 * ```
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color = 'primary',
      variant = 'outline',
      className = '',
      title,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const iconDef = getIcon(name);

    if (!iconDef) {
      console.warn(`Icon "${name}" not found in registry`);
      return null;
    }

    const sizePixels = ICON_SIZES[size];
    const colorValue = colorMap[color];

    // Build additional attributes for different icon variants
    // All icon definitions are stroke-based primitives, so we keep strokes enabled for both variants
    // Solid variant uses fill + stroke for better visual appearance with outline primitives
    const strokeAttrs = {
      fill: variant === 'solid' ? colorValue : 'none',
      stroke: colorValue,
      strokeWidth: iconDef.strokeWidth || 1.5,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    return (
      <svg
        ref={ref}
        width={sizePixels}
        height={sizePixels}
        viewBox={iconDef.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={`icon icon-${name} icon-${size} ${className}`}
        aria-label={ariaLabel || name}
        role="img"
        {...strokeAttrs}
        {...props}
      >
        {title && <title>{title}</title>}
        <g dangerouslySetInnerHTML={{ __html: Array.isArray(iconDef.path) ? iconDef.path.join('') : iconDef.path }} />
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

/**
 * Icon Grid Component
 * Utility component for displaying multiple icons with consistent spacing
 */
interface IconGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export const IconGrid = ({ children, columns = 4, gap = 2 }: IconGridProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}rem`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Icon Box Component
 * Container for displaying an icon with optional label
 */
interface IconBoxProps {
  icon: React.ReactNode;
  label?: string;
  description?: string;
}

export const IconBox = ({ icon, label, description }: IconBoxProps) => {
  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '0.5rem' }}>{icon}</div>
      {label && <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>}
      {description && <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{description}</div>}
    </div>
  );
};
