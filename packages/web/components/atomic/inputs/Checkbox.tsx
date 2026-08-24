import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Checkbox is checked
   * @default false
   */
  checked?: boolean;

  /**
   * Shows indeterminate state (partial selection)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Label text displayed next to checkbox
   */
  label?: string;

  /**
   * Called when checkbox state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Description text below checkbox
   */
  description?: string;

  /**
   * Checkbox color variant
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
}

/**
 * Checkbox component - checkbox input control
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onChange={setIsChecked}
 *   label="I agree to the terms"
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    size = 'md',
    checked = false,
    indeterminate = false,
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

    const checkboxEl = (
      <input
        ref={ref}
        type="checkbox"
        className={`${sizeMap[size]} ${colorClasses[color]} cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
    );

    const checkboxContent = (
      <div className="flex items-start gap-2">
        <div className="pt-1">{checkboxEl}</div>
        {label && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-900">{label}</label>
            {description && <p className="text-xs text-gray-600 mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );

    return <div className={className}>{checkboxContent}</div>;
  }
);

Checkbox.displayName = 'Checkbox';
