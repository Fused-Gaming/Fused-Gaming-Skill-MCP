import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  /**
   * Radio size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Radio is selected
   * @default false
   */
  checked?: boolean;

  /**
   * Label text displayed next to radio
   */
  label?: string;

  /**
   * Called when radio state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Description text below radio
   */
  description?: string;

  /**
   * Radio color variant
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

/**
 * Radio component - radio button input control
 *
 * @example
 * ```tsx
 * <Radio
 *   name="option"
 *   value="option1"
 *   checked={selected === 'option1'}
 *   onChange={() => setSelected('option1')}
 *   label="Option 1"
 * />
 * ```
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({
    size = 'md',
    checked = false,
    label,
    onChange,
    description,
    disabled = false,
    color = 'blue',
    className,
    ...props
  }, ref) => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const colorClasses = {
      blue: 'accent-blue-600',
      green: 'accent-green-600',
      red: 'accent-red-600',
      purple: 'accent-purple-600',
      gray: 'accent-gray-600',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const radioEl = (
      <input
        ref={ref}
        type="radio"
        className={`${sizeMap[size]} ${colorClasses[color]} cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
    );

    const radioContent = (
      <div className="flex items-start gap-2">
        <div className="pt-1">{radioEl}</div>
        {label && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-900">{label}</label>
            {description && <p className="text-xs text-gray-600 mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );

    return <div className={className}>{radioContent}</div>;
  }
);

Radio.displayName = 'Radio';
