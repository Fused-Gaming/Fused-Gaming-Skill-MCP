'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends MotionProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[#667eea] to-[#764ba2]
    text-white
    border border-white/[0.12]
    shadow-[0_0_28px_rgba(102,126,234,0.45)]
    hover:shadow-[0_0_40px_rgba(102,126,234,0.65)]
    hover:border-white/25
    active:shadow-[0_0_50px_rgba(102,126,234,0.8)]
  `,
  secondary: `
    bg-white/5
    text-white
    border border-white/15
    hover:bg-white/10
    hover:border-white/25
    hover:shadow-lg
  `,
  ghost: `
    bg-transparent
    text-white
    border border-white/10
    hover:bg-white/5
    hover:border-white/20
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-red-700
    text-white
    border border-red-500/30
    shadow-[0_0_24px_rgba(239,68,68,0.45)]
    hover:shadow-[0_0_35px_rgba(239,68,68,0.65)]
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
  ...motionProps
}: ButtonProps) {
  const baseClasses = `
    rounded-lg
    font-semibold
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 focus:ring-offset-[#050508]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
