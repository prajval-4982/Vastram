import React from 'react';

/**
 * Vastram Logo — custom "V" monogram built from two overlapping ribbon strokes.
 * Uses currentColor for automatic dark/light mode theming.
 */
const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vastram logo"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="vastram-logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="vastram-ribbon" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#vastram-logo-bg)" />
      {/* V monogram — two ribbon strokes that overlap in the center */}
      <path
        d="M14 14 L24 36 L26 36 L16 14 Z"
        fill="url(#vastram-ribbon)"
        opacity="0.9"
      />
      <path
        d="M34 14 L24 36 L22 36 L32 14 Z"
        fill="url(#vastram-ribbon)"
        opacity="0.75"
      />
      {/* Subtle fold accent at the V intersection */}
      <path
        d="M22 30 L24 36 L26 30 Z"
        fill="#ffffff"
        opacity="0.5"
      />
    </svg>
  );
};

export default Logo;
