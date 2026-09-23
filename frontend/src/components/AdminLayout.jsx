import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  Users,
  CreditCard,
  Activity,
  History,
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
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { key: 'documents', label: 'Document Review', icon: FileCheck, to: '/admin/documents' },
  { key: 'users', label: 'User Directory', icon: Users, to: '/admin/users' },
  { key: 'loans', label: 'Loan Oversight', icon: CreditCard, to: '/admin/loans' },
  { key: 'ml-engine', label: 'AI & Risk Models', icon: Activity, to: '/admin/ml-engine' },
  { key: 'audit-logs', label: 'Audit Logs', icon: History, to: '/admin/audit-logs' },
];

export const AdminLayout = ({ activeSection = 'dashboard', title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (user && user.role !== 'admin' && !user.is_staff) {
    if (user.role === 'lender') return <Navigate to="/lender/dashboard" replace />;
    return <Navigate to="/borrower/dashboard" replace />;
  }

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username)
    : 'Platform Administrator';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body p-4 gap-4">
      {/* Floating Collapsible Sidebar */}
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
            <Logo to="/admin/dashboard" subtitle="Platform Admin" size="md" />

            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="w-7 h-7 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));

            return (
              <Link
                key={item.key}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`flex items-center h-11 rounded-2xl transition-all duration-200 font-medium text-xs ${
                  collapsed ? 'justify-center px-0' : 'px-3.5 gap-3'
                } ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold shadow-[0_0_20px_var(--accent-glow)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] hover:translate-x-0.5'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2">
          <div
            className={`flex items-center rounded-2xl p-2 bg-[var(--bg-surface-raised)] ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40 flex items-center justify-center font-display font-bold text-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold truncate text-[var(--text-primary)]">{displayName}</p>
                <span className="inline-block px-1.5 py-0.2 bg-[var(--accent-tint)] text-[var(--accent)] text-[9px] font-bold rounded">
                  Superadmin
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Log Out' : undefined}
            className={`flex items-center h-10 rounded-2xl text-[var(--status-negative)] hover:bg-[var(--status-negative)]/15 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-xs font-medium w-full ${
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
        {/* Floating Top Bar */}
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
                placeholder="Search platform documents, users, loans..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] px-3.5 py-1.5 rounded-full text-xs text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Online</span>
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

export default AdminLayout;
