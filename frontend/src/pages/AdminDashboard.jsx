import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Card, { ContrastCard } from '../components/ui/Card';
import { getAdminStats } from '../lib/api';
import {
  Users,
  Building2,
  FileCheck,
  CreditCard,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = stats?.kpis || {
    total_borrowers: 0,
    total_lenders: 0,
    verified_lenders: 0,
    pending_borrower_docs: 0,
    pending_lender_docs: 0,
    total_pending_verifications: 0,
    total_loans: 0,
    approved_loans: 0,
    volume_requested: 0,
    volume_disbursed: 0,
  };

  const activities = stats?.recent_activities || [];
  const systemHealth = stats?.system_health || {
    celery_broker: 'Operational',
    websocket_gateway: 'Active',
    ml_underwriter_status: 'Online (v2.4)',
    active_models: ['XGBoost Default Classifier', 'Isolation Forest Anomaly', 'ARIMA Forecaster', 'Neural Credit Score'],
  };

  return (
    <AdminLayout activeSection="dashboard" title="Platform Dashboard">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[var(--accent)]/15 via-transparent to-transparent p-6 rounded-3xl border border-[var(--accent)]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Institutional Oversight
              </span>
            </div>
            <h1 className="font-clash text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
              Platform Executive Dashboard
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
              Real-time surveillance of platform liquidity, dual document verification queues, algorithmic risk scoring, and institutional accreditation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/documents"
              className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-bold shadow-[0_0_20px_var(--accent-glow)] hover:opacity-95 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck size={15} />
              <span>Audit Document Queue ({kpis.total_pending_verifications})</span>
            </Link>
          </div>
        </div>

        {/* Primary KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContrastCard className="p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Pending Verifications
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <FileCheck size={16} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-clash text-4xl font-bold tracking-tight tabular-nums">
                  {kpis.total_pending_verifications}
                </span>
                <span className="text-xs opacity-75">
                  ({kpis.pending_borrower_docs} borrower / {kpis.pending_lender_docs} lender)
                </span>
              </div>
              <Link
                to="/admin/documents"
                className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 opacity-90 hover:underline"
              >
                <span>Process queue</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </ContrastCard>

          <Card className="p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Borrower Ecosystem
              </span>
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-clash text-4xl font-bold tracking-tight tabular-nums text-[var(--text-primary)]">
                {kpis.total_borrowers}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Active financial profiles monitored
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Institutional Lenders
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 size={16} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-clash text-4xl font-bold tracking-tight tabular-nums text-[var(--text-primary)]">
                  {kpis.total_lenders}
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  {kpis.verified_lenders} Verified
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Banks & NBFC capital partners
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Capital Requested
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-clash text-3xl font-bold tracking-tight tabular-nums text-[var(--text-primary)]">
                ₹{Number(kpis.volume_requested || 0).toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Across {kpis.total_loans} loan applications
              </p>
            </div>
          </Card>
        </div>

        {/* Middle Section: Recent Verifications & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Ingested Documents Queue */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-clash text-lg font-bold text-[var(--text-primary)]">
                    Recent Document Ingestion
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Live document submissions awaiting or recently completing Admin verification
                  </p>
                </div>
                <Link
                  to="/admin/documents"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="divide-y divide-[var(--border-subtle)]/60">
                {activities.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
                    No recent document activities recorded.
                  </p>
                ) : (
                  activities.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0">
                          {item.type === 'borrower_doc' ? <FileCheck size={15} /> : <Building2 size={15} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">{item.title}</p>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            From: <span className="font-semibold">{item.user}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            item.status === 'verified'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                        <Link
                          to="/admin/documents"
                          className="px-3 py-1 rounded-full border border-[var(--border-subtle)] text-[11px] font-semibold hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)] hover:scale-105 active:scale-95 transition-all duration-200 text-[var(--text-primary)] cursor-pointer"
                        >
                          Audit
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Admin verification required for all credit score recalculations.</span>
              <span className="text-[var(--accent)] font-semibold">Strict Separation of Duties Active</span>
            </div>
          </Card>

          {/* AI & System Health Panel */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-[var(--text-primary)]">
                    AI & Infrastructure
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Machine learning & async pipeline health
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      WebSocket Gateway
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {systemHealth.websocket_gateway}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server size={14} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Celery Worker Pool
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {systemHealth.celery_broker}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      ML Underwriter
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-tint)] px-2 py-0.5 rounded-full border border-[var(--accent)]/30">
                    {systemHealth.ml_underwriter_status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Active Algorithms
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {systemHealth.active_models.map((m, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[10px] font-medium text-[var(--text-primary)]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
              <span>Automated OCR Accuracy</span>
              <span className="font-bold text-emerald-400">98.4%</span>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
