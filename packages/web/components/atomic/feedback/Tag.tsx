import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Tag variant/semantic color
   * @default 'neutral'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Tag size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Tag shape style
   * @default 'rounded'
   */
  shape?: 'sharp' | 'rounded' | 'pill';

  /**
   * Shows remove/close button
   * @default false
   */
  removable?: boolean;

  /**
   * Called when tag is removed
   */
  onRemove?: () => void;

  /**
   * Show tag as filled or outlined
   * @default 'filled'
   */
  fill?: 'filled' | 'outlined';
}

/**
 * Tag component - similar to badge, used in lists and collections
 *
 * @example
 * ```tsx
 * <Tag variant="primary" size="md" removable onRemove={handleRemove}>
 *   React
 * </Tag>
 * ```
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({
    variant = 'neutral',
    size = 'md',
    shape = 'rounded',
    removable = false,
    onRemove,
    fill = 'filled',
    className,
    children,
    ...props
  }, ref) => {
    const filledVariantClasses = {
      primary: 'bg-blue-100 text-blue-900',
      secondary: 'bg-purple-100 text-purple-900',
      success: 'bg-green-100 text-green-900',
      warning: 'bg-amber-100 text-amber-900',
      danger: 'bg-red-100 text-red-900',
      info: 'bg-cyan-100 text-cyan-900',
      neutral: 'bg-gray-100 text-gray-900',
    };

    const outlinedVariantClasses = {
      primary: 'border border-blue-300 text-blue-900 bg-blue-50',
      secondary: 'border border-purple-300 text-purple-900 bg-purple-50',
      success: 'border border-green-300 text-green-900 bg-green-50',
      warning: 'border border-amber-300 text-amber-900 bg-amber-50',
      danger: 'border border-red-300 text-red-900 bg-red-50',
      info: 'border border-cyan-300 text-cyan-900 bg-cyan-50',
      neutral: 'border border-gray-300 text-gray-900 bg-gray-50',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const shapeClasses = {
      sharp: 'rounded-none',
      rounded: 'rounded-md',
      pill: 'rounded-full',
    };

    const variantClasses = fill === 'filled' ? filledVariantClasses : outlinedVariantClasses;

    const combinedClassName = [
      'inline-flex items-center gap-1.5 font-medium transition-colors',
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses[shape],
      className,
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 inline-flex hover:opacity-70 transition-opacity"
            aria-label="Remove tag"
            type="button"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
