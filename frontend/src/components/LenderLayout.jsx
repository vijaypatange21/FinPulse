import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  ShieldCheck,
  PieChart,
  BellRing,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { getCurrentUser, clearAuthSession } from '../lib/api';
import Logo, { LogoIcon } from './ui/Logo';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/lender/dashboard' },
  { key: 'applications', label: 'Loan Applications', icon: FileCheck, to: '/lender/applications' },
  { key: 'borrowers', label: 'Borrower Risk', icon: Users, to: '/lender/borrowers' },
  { key: 'portfolio', label: 'Portfolio Health', icon: PieChart, to: '/lender/portfolio' },
  { key: 'alerts', label: 'Early Warnings', icon: BellRing, to: '/lender/alerts' },
];

const LenderLayout = ({ activeSection = 'dashboard', title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (user && user.role === 'borrower') {
    return <Navigate to="/borrower/dashboard" replace />;
  }

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username)
    : 'Lender Partner';
  const roleName = user?.institution_name || (user?.role === 'admin' ? 'Platform Administrator' : 'Institutional Lender');
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body p-4 gap-4">
      {/* Floating Collapsible Sidebar (§3.2) */}
      <aside
        className={`glass-chrome rounded-[32px] flex flex-col z-30 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] relative select-none ${
          collapsed ? 'w-[84px]' : 'w-[264px]'
        }`}
      >
        {/* Header / Logo */}
        {collapsed ? (
          <div className="h-20 flex items-center justify-center border-b border-[var(--border-subtle)]">
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="p-1 rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <LogoIcon size={38} variant="squircle" />
            </button>
          </div>
        ) : (
          <div className="h-20 px-5 flex items-center justify-between border-b border-[var(--border-subtle)]">
            <Logo to="/lender/dashboard" subtitle="Lender Risk Console" size="md" />

            {/* Explicit Chevron Toggle (§3.2) */}
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key || location.pathname === item.to;

            return (
              <Link
                key={item.key}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center h-11 rounded-2xl transition-all duration-200 relative ${
                  collapsed ? 'justify-center px-0' : 'px-3.5 gap-3'
                } ${
                  isActive
                    ? 'bg-[var(--accent)]/15 text-[var(--text-primary)] font-medium shadow-[inset_0_0_0_1px_rgba(201,255,77,0.15)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)]'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-colors ${
                    isActive ? 'text-[var(--accent)]' : 'group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={19} strokeWidth={1.75} />
                </div>

                {!collapsed && (
                  <span className="text-sm tracking-tight whitespace-nowrap truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Chip & Logout */}
        <div className="p-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
          <div
            className={`flex items-center p-2 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40 flex items-center justify-center font-display font-bold text-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold truncate text-[var(--text-primary)]">{displayName}</p>
                <p className="text-[10px] text-[var(--text-secondary)] truncate">{roleName}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Log Out' : undefined}
            className={`flex items-center h-10 rounded-2xl text-[var(--status-negative)] hover:bg-[var(--status-negative)]/10 transition-colors cursor-pointer text-xs font-medium ${
              collapsed ? 'justify-center' : 'px-3.5 gap-3'
            }`}
          >
            <LogOut size={16} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Floating Top Bar (§3.3) */}
        <header className="h-20 glass-chrome rounded-[32px] px-8 flex items-center justify-between z-10 shrink-0 mb-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            {title && (
              <h1 className="font-display font-semibold text-xl tracking-tight text-[var(--text-primary)] mr-4 whitespace-nowrap">
                {title}
              </h1>
            )}
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                className="w-full pl-11 pr-4 py-2.5 text-xs bg-[var(--bg-surface-raised)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/50"
                placeholder="Search applications, borrowers, loan IDs..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] px-3.5 py-1.5 rounded-full text-xs text-[var(--text-secondary)]">
              <span>{currentMonthYear}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-[var(--accent)]/15 text-[var(--accent)] px-3.5 py-1.5 rounded-full border border-[var(--accent)]/30 text-xs font-semibold">
              <Sparkles size={14} />
              <span>AI Underwriting Active</span>
            </div>

            <NotificationDropdown />
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Main Content Container */}
        <main
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto no-scrollbar rounded-[32px] glass-chrome p-6 sm:p-8 scroll-smooth overscroll-contain"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LenderLayout;
