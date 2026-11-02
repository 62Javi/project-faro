import React from 'react';

interface FaroLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'minimal' | 'architectural' | 'solid';
  size?: number | string;
  className?: string;
}

export function FaroLogo({
  variant = 'minimal',
  size = 24,
  className = '',
  ...props
}: FaroLogoProps) {
  if (variant === 'architectural') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        className={className}
        {...props}
      >
        <polygon points="60,34 116,14 116,56" fill="currentColor" opacity="0.25" />
        <polygon points="60,34 4,14 4,56" fill="currentColor" opacity="0.15" />
        <rect x="26" y="98" width="68" height="6" rx="3" fill="currentColor" />
        <rect x="32" y="92" width="56" height="6" rx="2" fill="currentColor" opacity="0.8" />
        <path d="M 39 46 L 81 46 L 86 92 L 34 92 Z" fill="currentColor" />
        <path d="M 37.4 60 L 82.6 60 L 83.9 72 L 36.1 72 Z" fill="#FFFFFF" opacity="0.9" />
        <rect x="58" y="50" width="4" height="7" rx="2" fill="#FFFFFF" />
        <rect x="58" y="78" width="4" height="9" rx="2" fill="#FFFFFF" />
        <rect x="32" y="42" width="56" height="4" rx="2" fill="currentColor" />
        <path d="M 36 38 L 84 38" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <line x1="42" y1="38" x2="42" y2="42" stroke="currentColor" stroke-width="1.5" />
        <line x1="50" y1="38" x2="50" y2="42" stroke="currentColor" stroke-width="1.5" />
        <line x1="60" y1="38" x2="60" y2="42" stroke="currentColor" stroke-width="1.5" />
        <line x1="70" y1="38" x2="70" y2="42" stroke="currentColor" stroke-width="1.5" />
        <line x1="78" y1="38" x2="78" y2="42" stroke="currentColor" stroke-width="1.5" />
        <rect x="42" y="27" width="36" height="11" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="46" y="28.5" width="28" height="8" rx="1" fill="#FFFFFF" />
        <circle cx="60" cy="32.5" r="3.5" fill="currentColor" />
        <circle cx="60" cy="32.5" r="1.5" fill="#FFFFFF" />
        <path d="M 40 27 C 40 27, 44 16, 60 16 C 76 16, 80 27, 80 27 Z" fill="currentColor" />
        <path d="M 60 10 L 60 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="60" cy="9.5" r="2" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        <path d="M 22 84 C 22 82.3 23.3 81 25 81 L 75 81 C 76.7 81 78 82.3 78 84 C 78 85.7 76.7 87 75 87 L 25 87 C 23.3 87 22 85.7 22 84 Z" fill="currentColor" />
        <path d="M 33 80 L 35 70 L 65 70 L 67 80 Z" fill="currentColor" />
        <path d="M 36.5 66 L 39 54 L 61 54 L 63.5 66 Z" fill="currentColor" />
        <path d="M 40.5 50 L 42.5 40 L 57.5 40 L 59.5 50 Z" fill="currentColor" />
        <rect x="34" y="37" width="32" height="3" rx="1.5" fill="currentColor" />
        <rect x="42" y="27" width="16" height="10" rx="1.5" fill="currentColor" />
        <circle cx="50" cy="32" r="2.8" fill="#FFFFFF" />
        <path d="M 40 27 C 40 21 60 21 60 27 Z" fill="currentColor" />
        <line x1="50" y1="17" x2="50" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="50" cy="15.5" r="1.5" fill="currentColor" />
        <polygon points="58,32 94,18 94,46" fill="currentColor" opacity="0.35" />
      </svg>
    );
  }

  // Default: Minimalist Swiss Vector
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path d="M50 14 V20 M42 28 C42 22 58 22 58 28 Z" fill="currentColor" stroke="none" />
      <rect x="42.5" y="28" width="15" height="10" rx="1.5" stroke="currentColor" stroke-width="2.5" fill="none" />
      <circle cx="50" cy="33" r="2.5" fill="currentColor" stroke="none" />
      <line x1="36" y1="38" x2="64" y2="38" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <path d="M41 40 L34 82 H66 L59 40 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none" />
      <line x1="39" y1="54" x2="61" y2="54" stroke="currentColor" stroke-width="2.5" />
      <line x1="36.5" y1="68" x2="63.5" y2="68" stroke="currentColor" stroke-width="2.5" />
      <line x1="26" y1="84" x2="74" y2="84" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <path d="M58 31 L88 20 M58 35 L92 37 M58 37 L88 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.85" />
    </svg>
  );
}
