import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 dark:bg-slate-850 border-t border-gray-100 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);
