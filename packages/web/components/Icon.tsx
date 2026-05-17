'use client';

import { getIconPath, isStrokeIcon, type IconName } from '@/lib/design-tokens';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

export default function Icon({ name, size = 24, className = '', color }: IconProps) {
  const iconPath = getIconPath(name);
  if (!iconPath) {
    return (
      <span
        className={`inline-flex items-center justify-center text-xs font-bold ${color ? '' : 'text-current'} ${className}`}
        style={color ? { color, width: size, height: size } : { width: size, height: size }}
      >
        ?
      </span>
    );
  }

  const isStroke = isStrokeIcon(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 2 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={color ? className : `text-current ${className}`}
      style={color ? { color } : undefined}
    >
      <path d={iconPath} />
    </svg>
  );
}
