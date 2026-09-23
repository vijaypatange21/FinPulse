import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const baseStyle = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:ring-offset-1 focus:ring-offset-[var(--bg-canvas)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

  const variants = {
    primary: "bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold shadow-[0_0_20px_rgba(201,255,77,0.15)] hover:shadow-[0_0_24px_rgba(201,255,77,0.3)] hover:brightness-105",
    secondary: "bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-raised)] hover:border-[var(--accent)]/40",
    outline: "border border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent)]/10",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)]",
    inverse: "bg-[var(--text-on-inverse)] text-[var(--bg-inverse-panel)] hover:opacity-90 font-semibold shadow-md",
    danger: "bg-[var(--status-negative)]/15 text-[var(--status-negative)] border border-[var(--status-negative)]/30 hover:bg-[var(--status-negative)]/25",
  };

  return (
    <button className={`${baseStyle} ${sizeStyles[size] || sizeStyles.md} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
