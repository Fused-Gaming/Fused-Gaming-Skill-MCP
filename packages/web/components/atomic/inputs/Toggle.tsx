import React from 'react';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * Toggle size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Toggle color variant
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';

  /**
   * Toggle is in checked/on state
   * @default false
   */
  checked?: boolean;

  /**
   * Label text displayed next to toggle
   */
  label?: string;

  /**
   * Label position relative to toggle
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Called when toggle state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Shows description text below toggle
   */
  description?: string;
}

/**
 * Toggle component - switch/checkbox component for boolean values
 *
 * @example
 * ```tsx
 * <Toggle
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable notifications"
 * />
 * ```
 */
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({
    size = 'md',
    color = 'blue',
    checked = false,
    label,
    labelPosition = 'right',
    onChange,
    description,
    disabled = false,
    className,
    ...props
  }, ref) => {
    const sizeMap = {
      sm: { toggle: 'w-8 h-5', thumb: 'w-4 h-4' },
      md: { toggle: 'w-11 h-6', thumb: 'w-5 h-5' },
      lg: { toggle: 'w-14 h-7', thumb: 'w-6 h-6' },
    };

    const colorClasses = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
      gray: 'bg-gray-600',
    };

    const { toggle: toggleSize, thumb: thumbSize } = sizeMap[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const toggleContent = (
      <div className="flex items-center gap-2">
        {labelPosition === 'left' && label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}

        <div
          className={`relative ${toggleSize} rounded-full transition-colors ${
            checked ? colorClasses[color] : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            ref={ref}
            type="checkbox"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 ${thumbSize} bg-white rounded-full transition-transform shadow-sm ${
              checked ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0.5'
            }`}
          />
        </div>

        {labelPosition === 'right' && label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
      </div>
    );

    if (description) {
      return (
        <div className={className}>
          {toggleContent}
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      );
    }

    return <div className={className}>{toggleContent}</div>;
  }
);

Toggle.displayName = 'Toggle';
