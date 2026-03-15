import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
            title="Toggle Theme"
        >
            {theme === 'dark' ? (
                <span className="material-icons text-[20px] text-amber-500">light_mode</span>
            ) : (
                <span className="material-icons text-[20px] text-indigo-500">dark_mode</span>
            )}
        </button>
    );
};

export default ThemeToggle;
