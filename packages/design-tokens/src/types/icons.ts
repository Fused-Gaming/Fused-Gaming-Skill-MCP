// Icon type definitions for the SyncPulse design system

import type React from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type IconVariant = 'outline' | 'solid' | 'duotone';

export const ICON_SIZES: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
};

export type IconName =
  | 'home'
  | 'dashboard'
  | 'settings'
  | 'help'
  | 'logout'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'
  | 'warning'
  | 'success'
  | 'play'
  | 'pause'
  | 'stop'
  | 'retry'
  | 'rollback'
  | 'delete'
  | 'edit'
  | 'orchestrator'
  | 'sentinel'
  | 'analyst'
  | 'executor'
  | 'bell'
  | 'user';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  variant?: IconVariant;
  className?: string;
  title?: string;
  'aria-label'?: string;
}

export interface IconDefinition {
  name: IconName;
  viewBox: string;
  path: string | string[];
  strokeWidth?: number;
  category?: string;
  tags?: string[];
}
