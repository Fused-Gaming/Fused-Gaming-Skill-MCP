import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input variant style
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'filled';

  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

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
   * Shows success state
   * @default false
   */
  success?: boolean;

  /**
   * Helper text displayed below input
   */
  helperText?: string;

  /**
   * Left icon slot
   */
  iconLeft?: React.ReactNode;

  /**
   * Right icon slot
   */
  iconRight?: React.ReactNode;

  /**
   * Label text
   */
  label?: string;

  /**
   * Shows character count when maxLength is set
   * @default false
   */
  showCharCount?: boolean;
}

/**
 * Input component for text and numeric input
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter text"
 *   label="Username"
 *   size="md"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'default',
    size = 'md',
    error = false,
    errorMessage,
    success = false,
    helperText,
    iconLeft,
    iconRight,
    label,
    showCharCount = false,
    disabled = false,
    maxLength,
    className,
    ...props
  }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const baseClasses = 'font-medium transition-colors focus:outline-none';

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
    const successClass = success && !error ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

    const combinedInputClass = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      errorClass,
      successClass,
      disabledClass,
      iconLeft && 'pl-10',
      iconRight && 'pr-10',
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
          {iconLeft && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            className={combinedInputClass}
            onChange={handleChange}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>
        {(errorMessage || helperText || showCharCount) && (
          <div className="mt-1 text-sm">
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {helperText && !errorMessage && <p className="text-gray-600">{helperText}</p>}
            {showCharCount && maxLength && (
              <p className="text-gray-600 text-xs mt-1">
                {charCount} / {maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
