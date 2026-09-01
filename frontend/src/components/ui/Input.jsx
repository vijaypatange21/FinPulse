import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2262ec]/50 focus:border-[#2262ec] transition-shadow placeholder:text-slate-400 ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
