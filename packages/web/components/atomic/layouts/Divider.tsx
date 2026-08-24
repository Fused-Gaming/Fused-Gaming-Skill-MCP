import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Divider orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Divider color
   * @default 'gray'
   */
  color?: 'gray' | 'blue' | 'red' | 'green' | 'neutral';

  /**
   * Divider line style
   * @default 'solid'
   */
  variant?: 'solid' | 'dashed' | 'dotted';

  /**
   * Spacing around divider
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Thickness of the divider line in pixels
   * @default 1
   */
  thickness?: number;

  /**
   * Text to display in the center of the divider
   */
  label?: string;

  /**
   * Height for vertical divider
   */
  height?: string | number;
}

/**
 * Divider component - visual separator
 *
 * @example
 * ```tsx
 * <Divider orientation="horizontal" variant="solid" spacing="md" />
 * ```
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({
    orientation = 'horizontal',
    color = 'gray',
    variant = 'solid',
    spacing = 'md',
    thickness = 1,
    label,
    height,
    className,
    ...props
  }, ref) => {
    const colorClasses = {
      gray: 'border-gray-200',
      blue: 'border-blue-200',
      red: 'border-red-200',
      green: 'border-green-200',
      neutral: 'border-gray-300',
    };

    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
      md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
      lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    };

    const variantStyles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    if (orientation === 'vertical') {
      const combinedClassName = [
        'inline-block border-l',
        colorClasses[color],
        spacingClasses[spacing],
        variantStyles[variant],
        className,
      ].filter(Boolean).join(' ');

      return (
        <div
          ref={ref as any}
          className={combinedClassName}
          style={{
            height: height || '1em',
            borderLeftWidth: `${thickness}px`,
          }}
          {...(props as any)}
        />
      );
    }

    // Horizontal divider with optional label
    if (label) {
      return (
        <div className={spacingClasses[spacing]}>
          <div className="relative flex items-center">
            <div
              className={[
                'flex-grow border-t',
                colorClasses[color],
                variantStyles[variant],
              ].filter(Boolean).join(' ')}
              style={{ borderTopWidth: `${thickness}px` }}
            />
            <span className="px-3 text-sm text-gray-600 font-medium">{label}</span>
            <div
              className={[
                'flex-grow border-t',
                colorClasses[color],
                variantStyles[variant],
              ].filter(Boolean).join(' ')}
              style={{ borderTopWidth: `${thickness}px` }}
            />
          </div>
        </div>
      );
    }

    const combinedClassName = [
      'border-0 border-t',
      colorClasses[color],
      spacingClasses[spacing],
      variantStyles[variant],
      className,
    ].filter(Boolean).join(' ');

    return (
      <hr
        ref={ref}
        className={combinedClassName}
        style={{ borderTopWidth: `${thickness}px` }}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
