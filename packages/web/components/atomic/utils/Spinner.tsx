import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Spinner color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'white';

  /**
   * Type of spinner animation
   * @default 'spinner'
   */
  type?: 'spinner' | 'dots' | 'pulse' | 'bounce';

  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: 'slow' | 'normal' | 'fast';

  /**
   * Optional label text
   */
  label?: string;

  /**
   * Label position relative to spinner
   * @default 'below'
   */
  labelPosition?: 'above' | 'below' | 'right';
}

/**
 * Spinner component - loading indicator with multiple animation styles
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" type="spinner" label="Loading..." />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({
    size = 'md',
    variant = 'primary',
    type = 'spinner',
    speed = 'normal',
    label,
    labelPosition = 'below',
    className,
    ...props
  }, ref) => {
    const sizeMap = {
      sm: { size: 'w-4 h-4', text: 'text-xs' },
      md: { size: 'w-6 h-6', text: 'text-sm' },
      lg: { size: 'w-8 h-8', text: 'text-base' },
      xl: { size: 'w-12 h-12', text: 'text-lg' },
    };

    const colorClasses = {
      primary: 'border-blue-500 text-blue-600',
      secondary: 'border-purple-500 text-purple-600',
      success: 'border-green-500 text-green-600',
      warning: 'border-amber-500 text-amber-600',
      danger: 'border-red-500 text-red-600',
      info: 'border-cyan-500 text-cyan-600',
      white: 'border-white text-white',
    };

    const speedMap = {
      slow: 'duration-1000',
      normal: 'duration-600',
      fast: 'duration-400',
    };

    const isVertical = labelPosition === 'above' || labelPosition === 'below';
    const containerClasses = isVertical
      ? 'flex flex-col items-center gap-2'
      : 'flex items-center gap-2';

    const renderSpinner = () => {
      const { size: sizeClass } = sizeMap[size];

      switch (type) {
        case 'dots':
          return (
            <div className={`flex gap-1 ${sizeClass}`}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${colorClasses[variant]} animate-bounce`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          );

        case 'pulse':
          return (
            <div
              className={`${sizeClass} rounded-full ${colorClasses[variant]} animate-pulse`}
            />
          );

        case 'bounce':
          return (
            <div
              className={`${sizeClass} rounded-full ${colorClasses[variant]} animate-bounce`}
            />
          );

        case 'spinner':
        default:
          return (
            <div
              className={`${sizeClass} border-2 rounded-full border-current ${colorClasses[variant]} animate-spin`}
              style={{
                borderRightColor: 'transparent',
                animation: `spin ${speedMap[speed]} linear infinite`,
              }}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className={`${containerClasses} ${className}`}
        {...props}
      >
        {labelPosition === 'above' && label && (
          <span className={`text-gray-600 ${sizeMap[size].text}`}>{label}</span>
        )}

        {renderSpinner()}

        {labelPosition !== 'above' && label && (
          <span className={`text-gray-600 ${sizeMap[size].text}`}>{label}</span>
        )}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
