import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import Card from '../components/ui/Card';
import { listAdminUsers, updateAdminUser } from '../lib/api';
import { Users, Search, Shield, Building2, User, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'borrower' | 'lender' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await listAdminUsers();
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load platform users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleActive = async (user) => {
    try {
      const newStatus = !user.is_active;
      await updateAdminUser(user.id, { is_active: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u))
      );
      showToast(`User ${user.username} is now ${newStatus ? 'Active' : 'Suspended'}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update user status.');
    }
  };

  const handleUpdateAccreditation = async (user, newStatus) => {
    try {
      await updateAdminUser(user.id, { verification_status: newStatus });
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              details: { ...u.details, verification_status: newStatus },
            };
          }
          return u;
        })
      );
      showToast(`Institution ${user.name} accreditation updated to ${newStatus}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update accreditation.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (u.name || '').toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        const matchUsername = (u.username || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchUsername) return false;
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  return (
    <AdminLayout activeSection="users" title="User Directory">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
              Identity & Access Management
            </span>
            <h1 className="font-clash text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
              Platform User Management
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Audit registered borrowers, institutional lenders, and administrators across the network.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-[var(--bg-surface-raised)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-full text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Controls */}
        <Card className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Users', count: users.length },
              {
                id: 'borrower',
                label: 'Borrowers',
                count: users.filter((u) => u.role === 'borrower').length,
              },
              {
                id: 'lender',
                label: 'Institutions',
                count: users.filter((u) => u.role === 'lender').length,
              },
              {
                id: 'admin',
                label: 'Admins',
                count: users.filter((u) => u.role === 'admin' || u.is_staff).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                    roleFilter === tab.id
                      ? 'bg-black/20 text-current'
                      : 'bg-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-full focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] transition-colors"
            />
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar min-h-[340px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-canvas)]/40 text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-3.5">User / Entity</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Entity Profile Details</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5">Access Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      Loading user directory...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      No users match the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isLender = u.role === 'lender';
                    const isBorrower = u.role === 'borrower';
                    const isAdmin = u.role === 'admin' || u.is_staff;

                    return (
                      <tr key={u.id} className="h-14 hover:bg-[var(--bg-surface-raised)]/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-[var(--text-primary)] leading-tight">
                                {u.name}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)]">
                                {u.email} • @{u.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isAdmin
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : isLender
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : 'bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent)]/30'
                            }`}
                          >
                            {isAdmin ? <Shield size={11} /> : isLender ? <Building2 size={11} /> : <User size={11} />}
                            <span>{u.role}</span>
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-xs">
                          {isBorrower ? (
                            <span className="text-[var(--text-secondary)]">
                              Score:{' '}
                              <strong className="text-[var(--accent)] font-bold">
                                {u.details?.health_score || 'N/A'}
                              </strong>{' '}
                              • {u.details?.occupation || 'General'}
                            </span>
                          ) : isLender ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-secondary)]">
                                {u.details?.institution_type || 'Institution'}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                                  u.details?.verification_status === 'verified'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {u.details?.verification_status || 'pending'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[var(--text-secondary)]">Full Administrative Authority</span>
                          )}
                        </td>

                        <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)]">
                          {new Date(u.date_joined).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.is_active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {u.is_active ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isLender && u.details?.verification_status !== 'verified' && (
                              <button
                                onClick={() => handleUpdateAccreditation(u, 'verified')}
                                className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                              >
                                Accredit
                              </button>
                            )}

                            {!isAdmin && (
                              <button
                                onClick={() => handleToggleActive(u)}
                                className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold cursor-pointer transition-colors ${
                                  u.is_active
                                    ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                              >
                                {u.is_active ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
