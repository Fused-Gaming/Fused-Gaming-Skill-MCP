import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton variant/shape
   * @default 'rectangle'
   */
  variant?: 'text' | 'circle' | 'rectangle' | 'thumbnail';

  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;

  /**
   * Height of the skeleton
   * @default '20px'
   */
  height?: string | number;

  /**
   * Radius for rounded corners
   * @default 'md'
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Number of skeleton lines (for text variant)
   * @default 1
   */
  count?: number;

  /**
   * Gap between skeleton lines
   * @default 'sm'
   */
  gap?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Shows shimmer animation
   * @default true
   */
  animated?: boolean;
}

/**
 * Skeleton component - placeholder for loading states
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="100%" height="20px" count={3} gap="md" />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    variant = 'rectangle',
    width = '100%',
    height = '20px',
    radius = 'md',
    count = 1,
    gap = 'sm',
    animated = true,
    className,
    ...props
  }, ref) => {
    const radiusClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'text':
          return 'rounded-sm';
        case 'circle':
          return 'rounded-full';
        case 'thumbnail':
          return radiusClasses[radius];
        case 'rectangle':
        default:
          return radiusClasses[radius];
      }
    };

    const getVariantDimensions = () => {
      if (variant === 'circle') {
        return { width: height, height };
      }
      if (variant === 'thumbnail') {
        return { width: '100px', height: '100px' };
      }
      if (variant === 'text') {
        return { width, height: '16px' };
      }
      return { width, height };
    };

    const dimensions = getVariantDimensions();
    const animationClass = animated ? 'animate-pulse' : '';

    const baseClasses = `bg-gray-200 ${getVariantClasses()} ${animationClass}`;

    if (count > 1 && variant === 'text') {
      return (
        <div ref={ref} className={`flex flex-col ${gapClasses[gap]} ${className}`} {...props}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={baseClasses}
              style={{
                width: i === count - 1 ? '70%' : width,
                height: dimensions.height,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${className}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
