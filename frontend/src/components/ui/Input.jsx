import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-[var(--bg-surface-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/50 text-sm ${
          error ? 'border-[var(--status-negative)] focus:ring-[var(--status-negative)]/30 focus:border-[var(--status-negative)]' : ''
        } ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-[var(--text-secondary)]">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-[var(--status-negative)]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
