// Icon type definitions for the SyncPulse design system

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
  | 'settings'
  | 'user'
  | 'logout'
  | 'menu'
  | 'close'
  | 'search'
  | 'filter'
  | 'sort'
  | 'refresh'
  | 'edit'
  | 'delete'
  | 'copy'
  | 'download'
  | 'upload'
  | 'share'
  | 'favorite'
  | 'bookmark'
  | 'alert'
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'check'
  | 'checkmark'
  | 'cross'
  | 'plus'
  | 'minus'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'external-link'
  | 'link'
  | 'help'
  | 'clock'
  | 'calendar'
  | 'bell'
  | 'mail'
  | 'phone'
  | 'lock'
  | 'unlock'
  | 'visibility'
  | 'visibility-off'
  | 'code'
  | 'terminal'
  | 'github'
  | 'agents'
  | 'swarm'
  | 'agent-active'
  | 'agent-idle'
  | 'agent-error'
  | 'play'
  | 'pause'
  | 'stop'
  | 'dashboard'
  | 'active'
  | 'pending'
  | 'orchestrator'
  | 'sentinel'
  | 'analyst'
  | 'executor'
  | 'retry'
  | 'inactive';

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
