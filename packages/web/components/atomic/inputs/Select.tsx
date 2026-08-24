import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  /**
   * Select size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Select variant
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'filled';

  /**
   * Shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Helper text displayed below select
   */
  helperText?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * Select options
   */
  options?: SelectOption[];

  /**
   * Placeholder text when no option selected
   */
  placeholder?: string;

  /**
   * Called when selection changes
   */
  onChange?: (value: string | number) => void;

  /**
   * Right icon/arrow slot
   */
  icon?: React.ReactNode;
}

/**
 * Select component - dropdown select control
 *
 * @example
 * ```tsx
 * <Select
 *   label="Choose an option"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' }
 *   ]}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    size = 'md',
    variant = 'default',
    error = false,
    errorMessage,
    helperText,
    label,
    options = [],
    placeholder,
    onChange,
    icon,
    disabled = false,
    className,
    children,
    ...props
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      // Try to convert to number if possible
      const numValue = !isNaN(Number(value)) ? Number(value) : value;
      onChange?.(numValue);
    };

    const baseClasses = 'font-medium transition-colors focus:outline-none appearance-none';

    const variantClasses = {
      default: 'border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      outline: 'border-2 border-gray-300 bg-transparent hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      filled: 'border-b-2 border-gray-300 bg-gray-100 hover:bg-gray-150 focus:border-blue-500 focus:ring-0',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-5 py-3 text-lg h-12',
    };

    const errorClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

    const combinedSelectClass = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      errorClass,
      disabledClass,
      'pr-10',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={combinedSelectClass}
            onChange={handleChange}
            {...props}
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {options.map((option) => (
              <option
                key={`${option.value}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {children}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon || (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
          </div>
        </div>
        {(errorMessage || helperText) && (
          <div className="mt-1 text-sm">
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {helperText && !errorMessage && <p className="text-gray-600">{helperText}</p>}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
