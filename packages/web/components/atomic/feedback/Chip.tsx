import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Chip variant/semantic color
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  /**
   * Chip size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Chip is selected/active
   * @default false
   */
  selected?: boolean;

  /**
   * Chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows remove button
   * @default false
   */
  removable?: boolean;

  /**
   * Called when chip is removed
   */
  onRemove?: () => void;

  /**
   * Called when chip selection state changes
   */
  onSelect?: (selected: boolean) => void;

  /**
   * Avatar content (initials, image, etc)
   */
  avatar?: React.ReactNode;

  /**
   * Icon displayed before text
   */
  icon?: React.ReactNode;

  /**
   * Chip is interactive/clickable
   * @default false
   */
  clickable?: boolean;
}

/**
 * Chip component - interactive selection element
 *
 * @example
 * ```tsx
 * <Chip
 *   variant="primary"
 *   selected={isSelected}
 *   onSelect={handleSelect}
 *   removable
 *   onRemove={handleRemove}
 * >
 *   React
 * </Chip>
 * ```
 */
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({
    variant = 'primary',
    size = 'md',
    selected = false,
    disabled = false,
    removable = false,
    onRemove,
    onSelect,
    avatar,
    icon,
    clickable = false,
    className,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      primary: selected
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      secondary: selected
        ? 'bg-purple-600 text-white'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      success: selected
        ? 'bg-green-600 text-white'
        : 'bg-green-50 text-green-900 hover:bg-green-100',
      warning: selected
        ? 'bg-amber-600 text-white'
        : 'bg-amber-50 text-amber-900 hover:bg-amber-100',
      danger: selected
        ? 'bg-red-600 text-white'
        : 'bg-red-50 text-red-900 hover:bg-red-100',
      info: selected
        ? 'bg-cyan-600 text-white'
        : 'bg-cyan-50 text-cyan-900 hover:bg-cyan-100',
      neutral: selected
        ? 'bg-gray-600 text-white'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const clickableClass = clickable && !disabled ? 'cursor-pointer' : '';

    const combinedClassName = [
      'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
      variantClasses[variant],
      sizeClasses[size],
      disabledClass,
      clickableClass,
      className,
    ].filter(Boolean).join(' ');

    const handleClick = () => {
      if (!disabled) {
        onSelect?.(!selected);
      }
    };

    return (
      <div
        ref={ref}
        className={combinedClassName}
        onClick={clickable ? handleClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        {...props}
      >
        {avatar && <span className="inline-flex items-center">{avatar}</span>}
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 inline-flex hover:opacity-70 transition-opacity"
            aria-label="Remove chip"
            type="button"
            disabled={disabled}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';
