import React from 'react';

export const Card = ({ children, className = '', hoverGlow = true, ...props }) => {
  return (
    <div
      className={`bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-[24px] border border-[var(--border-subtle)] shadow-[0_12px_32px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-200 ${
        hoverGlow ? 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.35),0_0_0_1px_var(--accent-glow)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ContrastCard = ({ children, className = '', accent = false, ...props }) => {
  return (
    <div
      className={`rounded-[24px] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-200 ${
        accent
          ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
          : 'bg-[var(--bg-inverse-panel)] text-[var(--text-on-inverse)]'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-[var(--border-subtle)] ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-[var(--bg-surface-raised)] border-t border-[var(--border-subtle)] ${className}`}>
    {children}
  </div>
);

export default Card;
