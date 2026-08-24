import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant/semantic color
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Border radius style
   * @default 'full'
   */
  shape?: 'sharp' | 'rounded' | 'full' | 'pill';

  /**
   * Shows dot indicator before text
   * @default false
   */
  dot?: boolean;

  /**
   * Dot color (defaults to variant color)
   */
  dotColor?: string;

  /**
   * Shows icon before text
   */
  icon?: React.ReactNode;

  /**
   * Shows close button to dismiss
   * @default false
   */
  dismissible?: boolean;

  /**
   * Called when badge is dismissed
   */
  onDismiss?: () => void;
}

/**
 * Badge component - compact status/category indicator
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md">
 *   Active
 * </Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = 'primary',
    size = 'md',
    shape = 'full',
    dot = false,
    dotColor,
    icon,
    dismissible = false,
    onDismiss,
    className,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      neutral: 'bg-gray-100 text-gray-900',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const shapeClasses = {
      sharp: 'rounded-none',
      rounded: 'rounded-md',
      full: 'rounded-full',
      pill: 'rounded-full px-4',
    };

    const dotColorMap = {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
      info: 'bg-cyan-600',
      neutral: 'bg-gray-600',
    };

    const combinedClassName = [
      'inline-flex items-center gap-1.5 font-medium transition-colors',
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses[shape],
      className,
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {dot && (
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor || dotColorMap[variant]}`}
            aria-hidden="true"
          />
        )}
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-1 inline-flex hover:opacity-70 transition-opacity"
            aria-label="Dismiss badge"
            type="button"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
