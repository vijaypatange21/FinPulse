import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getCurrentUser } from '../lib/api';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/lender/dashboard' },
  { key: 'borrowers', label: 'Borrowers', icon: 'people', to: '/lender/borrowers' },
  { key: 'applications', label: 'Applications', icon: 'assignment', to: '/lender/applications' },
  { key: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet', to: '/lender/portfolio' },
  { key: 'alerts', label: 'Alerts', icon: 'notifications_active', to: '/lender/alerts/1' },
];

const LenderLayout = ({ activeSection = 'dashboard', children }) => {
  const user = getCurrentUser();
  const displayName = user ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username) : 'Lender Partner';
  const roleName = user?.institution_name || 'Lending Partner';

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2262ec] rounded flex items-center justify-center">
            <span className="material-icons text-white text-lg">insights</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-[#2262ec]">FinPulse</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.key === activeSection;
            return (
              <Link
                key={item.key}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${active ? 'bg-[#2262ec]/10 text-[#2262ec] border-r-4 border-[#2262ec]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                to={item.to}
              >
                <span className="material-icons text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4" to="/login">
            <span className="material-icons text-xl">logout</span> Log Out
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="w-9 h-9 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{roleName}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded focus:ring-1 focus:ring-[#2262ec]" placeholder="Search borrowers, loan IDs..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
              <span className="material-icons text-sm text-slate-500">calendar_today</span>
              <span className="text-xs font-medium">{currentMonthYear}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#2262ec] dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800/30 text-xs font-bold">
              <span className="material-icons text-sm">auto_awesome</span> AI Underwriting Active
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f6f8] dark:bg-[#101622]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LenderLayout;

