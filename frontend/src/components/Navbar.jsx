import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Logo from './ui/Logo';

const Navbar = () => {
  return (
    <nav className="bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo to="/" size="md" />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-xs transition-colors">
              Log in
            </Link>
            <Link
              to="/role-selection"
              className="px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)] hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
