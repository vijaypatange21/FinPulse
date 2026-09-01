import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-[#2262ec] text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-[#2262ec]",
    secondary: "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 shadow-sm focus:ring-slate-500 dark:bg-slate-700 dark:text-white",
    outline: "border-2 border-[#2262ec] text-[#2262ec] hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-[#2262ec]",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 focus:ring-slate-400"
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
