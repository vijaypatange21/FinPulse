import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const GlobalThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-[99999] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:scale-110 active:scale-95 border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/90 backdrop-blur-md"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-[var(--accent)]" />
      ) : (
        <Moon size={20} className="text-[var(--text-primary)]" />
      )}
    </button>
  );
};

export default GlobalThemeToggle;
