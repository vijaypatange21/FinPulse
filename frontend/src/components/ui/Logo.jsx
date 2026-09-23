import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Premium FinPulse Vector Icon Mark
 * Monogram "F" fused with a dynamic market pulse / heartbeat frequency curve.
 */
export const LogoIcon = ({
  size = 40,
  variant = 'squircle', // 'squircle' | 'flat'
  className = '',
  glow = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : size === 'sm' ? 32 : size === 'lg' ? 48 : size === 'xl' ? 60 : 40;
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-200 ${
        glow ? 'group-hover:scale-105' : ''
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        <defs>
          <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent, #C9FF4D)" />
            <stop offset="60%" stopColor="#A3E635" />
            <stop offset="100%" stopColor="#34D1A3" />
          </linearGradient>

          <linearGradient id={`bg-glow-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent, #C9FF4D)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#34D1A3" stopOpacity="0.04" />
          </linearGradient>

          <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="var(--accent, #C9FF4D)" floodOpacity="0.4" />
          </filter>
        </defs>

        {variant === 'squircle' && (
          <>
            {/* Squircle Background Container */}
            <rect
              width="64"
              height="64"
              rx="18"
              fill="#0E1210"
            />
            <rect width="64" height="64" rx="18" fill={`url(#bg-glow-${uniqueId})`} />
            <rect
              x="0.75"
              y="0.75"
              width="62.5"
              height="62.5"
              rx="17.25"
              stroke="rgba(255, 255, 255, 0.12)"
            />
          </>
        )}

        {/* Monogram F + Financial Pulse Geometry */}
        <g filter={`url(#shadow-${uniqueId})`}>
          {/* Main Vertical Spine */}
          <path
            d="M17 17C17 15.3431 18.3431 14 20 14H23.5C25.1569 14 26.5 15.3431 26.5 17V47C26.5 48.6569 25.1569 50 23.5 50H20C18.3431 50 17 48.6569 17 47V17Z"
            fill={`url(#grad-${uniqueId})`}
          />

          {/* Top Forward Velocity Wing */}
          <path
            d="M24 14H44.8C46.568 14 47.784 15.772 47.092 17.399L44.882 22.599C44.472 23.564 43.524 24.188 42.472 24.188H26.5V16.5C26.5 15.1193 25.3807 14 24 14Z"
            fill={`url(#grad-${uniqueId})`}
          />

          {/* Middle Pulse Surge Arm */}
          <path
            d="M26.5 30H31.5L34.8 24.5C35.55 23.25 37.35 23.25 38.1 24.5L41.2 29.7H47.2C48.3 29.7 49.2 30.6 49.2 31.7C49.2 32.8 48.3 33.7 47.2 33.7H39.8L36.4 28L33.2 33.7H26.5V30Z"
            fill={`url(#grad-${uniqueId})`}
          />

          {/* AI Intelligence Beacon Spark */}
          <circle cx="36.45" cy="23.2" r="2.2" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Full FinPulse Logo Lockup
 * Combines the LogoIcon mark with typography and role/subtitle badges.
 */
export const Logo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  iconVariant = 'squircle',
  subtitle,
  showText = true,
  className = '',
  to,
}) => {
  const iconPixelSize =
    size === 'sm' ? 32 : size === 'lg' ? 44 : size === 'xl' ? 52 : 38;

  const titleSizeClass =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
      ? 'text-2xl'
      : size === 'xl'
      ? 'text-3xl'
      : 'text-xl';

  const content = (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={iconPixelSize} variant={iconVariant} />

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center tracking-tight leading-none">
            <span
              className={`font-display font-bold text-[var(--text-primary)] ${titleSizeClass}`}
            >
              Fin
            </span>
            <span
              className={`font-display font-bold text-[var(--accent)] ${titleSizeClass}`}
            >
              Pulse
            </span>
          </div>

          {subtitle && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mt-0.5 truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
