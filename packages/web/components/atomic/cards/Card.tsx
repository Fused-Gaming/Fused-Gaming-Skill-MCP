import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card elevation level (shadow)
   * @default 'md'
   */
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Card has a border
   * @default false
   */
  bordered?: boolean;

  /**
   * Border color
   * @default 'gray'
   */
  borderColor?: 'gray' | 'blue' | 'red' | 'green';

  /**
   * Card is interactive (shows hover effects)
   * @default false
   */
  interactive?: boolean;

  /**
   * Padding around content
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Border radius style
   * @default 'md'
   */
  shape?: 'sharp' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;
}

/**
 * Card component - container with optional header and footer
 *
 * @example
 * ```tsx
 * <Card elevation="md" padding="md" header="Card Title">
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    elevation = 'md',
    bordered = false,
    borderColor = 'gray',
    interactive = false,
    padding = 'md',
    shape = 'md',
    header,
    footer,
    children,
    className,
    ...props
  }, ref) => {
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    const shapeClasses = {
      sharp: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const borderClasses = bordered
      ? {
          gray: 'border border-gray-200',
          blue: 'border border-blue-200',
          red: 'border border-red-200',
          green: 'border border-green-200',
        }
      : { gray: '', blue: '', red: '', green: '' };

    const interactiveClass = interactive ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

    const combinedClassName = [
      'bg-white',
      shadowClasses[elevation],
      borderClasses[borderColor],
      paddingClasses[padding],
      shapeClasses[shape],
      interactiveClass,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {header && (
          <div className="border-b border-gray-100 pb-3 mb-3">
            {typeof header === 'string' ? (
              <h3 className="text-lg font-semibold text-gray-900">{header}</h3>
            ) : (
              header
            )}
          </div>
        )}

        <div className="text-gray-800">{children}</div>

        {footer && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            {typeof footer === 'string' ? (
              <p className="text-sm text-gray-600">{footer}</p>
            ) : (
              footer
            )}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
