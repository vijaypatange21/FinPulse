import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[#2262ec]/10 p-2 rounded-lg group-hover:bg-[#2262ec]/20 transition-colors">
                <Activity className="h-6 w-6 text-[#2262ec]" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FinPulse</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-[#2262ec] font-medium text-sm transition-colors">
              Log in
            </Link>
            <Link to="/role-selection">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
