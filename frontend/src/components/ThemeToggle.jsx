import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-all cursor-pointer"
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {theme === 'dark' ? (
        <Sun size={17} className="text-[var(--accent)]" />
      ) : (
        <Moon size={17} className="text-[var(--text-primary)]" />
      )}
    </button>
  );
};

export default ThemeToggle;
