import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/lender/dashboard' },
  { key: 'borrowers', label: 'Borrowers', icon: 'people', to: '/lender/borrowers' },
  { key: 'applications', label: 'Applications', icon: 'assignment', to: '/lender/applications' },
  { key: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet', to: '#' },
  { key: 'alerts', label: 'Alerts', icon: 'notifications_active', to: '/lender/alerts/1', badge: '8' },
];

const LenderLayout = ({ activeSection = 'dashboard', children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2262ec] rounded flex items-center justify-center">
            <span className="material-icons text-white text-lg">insights</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight">FinPulse</h1>
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
                {item.badge && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
              </Link>
            );
          })}
          <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4" to="/login">
            <span className="material-icons text-xl">logout</span> Log Out
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            <img alt="User Avatar" className="w-8 h-8 rounded-full bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFz0ysoN8eA5liFvu64OJorLLRswnJPlKvS-kBdWfcPZ9snbQFPDVpmEKTnxUEu2o9v1ZUGg32zgU9SE2CKozPyW3bAXqaqOM4jUP_s_O59Bx0qQawxsyD2DqJhhVYU3z9vtzhY30rOvU8fthinBsOZkaQtm9j1_1snQ75YLICZoceVWiOprQ0s3_KFl6OZZRJ5BrmsiNSDfjjiB_Nai9JiuYOIowdKLZ2SZdQoY9z9Q75lwvDSo8VXTEPGkiQqY8VNSRssr7GV5Q" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">Animesh Sharma</p>
              <p className="text-[10px] text-slate-500 truncate">Senior Risk Officer</p>
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
              <span className="text-xs font-medium">Oct 1, 2023 - Oct 31, 2023</span>
              <span className="material-icons text-xs text-slate-500">expand_more</span>
            </div>
            <ThemeToggle />
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <span className="material-icons text-xl">filter_list</span>
            </button>
            <button className="bg-[#2262ec] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#2262ec]/90 transition-colors flex items-center gap-2">
              <span className="material-icons text-sm">add</span> New Loan
            </button>
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
