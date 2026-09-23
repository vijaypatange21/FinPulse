import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { listApplications } from '../lib/api';
import {
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  User,
  X,
  ExternalLink,
} from 'lucide-react';

const formatMoney = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusToBadgeStatus = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'approved') return 'approved';
  if (s === 'rejected') return 'rejected';
  if (s === 'verified') return 'verified';
  return 'under_review';
};

const AdminLoanOversight = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [inspectApp, setInspectApp] = useState(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await listApplications();
      const appList = Array.isArray(data) ? data : data?.results || [];
      const normalized = appList.map((item) => ({
        id: item.application_id || item.id,
        name: item.borrower?.name || item.borrower?.display_name || 'Borrower Account',
        occupation: item.borrower?.occupation || item.borrower?.product_type || 'General',
        loanType: item.loan_type || 'Personal Loan',
        amount: formatMoney(item.requested_amount),
        amountRaw: Number(item.requested_amount || 0),
        aiScore: item.ai_score || 700,
        appliedDate: formatDate(item.created_at),
        status: (item.status || 'under_review').replace(/_/g, ' '),
        statusRaw: item.status || 'under_review',
        lenderName: item.preferred_lender?.name || item.preferred_lender?.institution_name || 'Unassigned',
        defaultProbability: item.default_probability || '5%',
        monthlyIncome: item.monthly_income || 'N/A',
        debtToIncome: item.debt_to_income || 'N/A',
        paymentHistory: item.payment_history || 80,
        creditUtilization: item.credit_utilization || 30,
        note: item.note || '',
        activities: item.activities || [],
      }));
      setApplications(normalized);
    } catch (err) {
      setError(err.message || 'Unable to load loan applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const kpis = useMemo(() => {
    const total = applications.length;
    const underReview = applications.filter(
      (a) => a.statusRaw === 'under_review' || a.statusRaw === 'new'
    ).length;
    const approved = applications.filter((a) => a.statusRaw === 'approved').length;
    const totalVolume = applications.reduce((sum, a) => sum + (a.amountRaw || 0), 0);
    return { total, underReview, approved, totalVolume };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(app.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.lenderName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' ||
        app.statusRaw.toLowerCase() === selectedStatus.toLowerCase().replace(/ /g, '_');

      const matchesType =
        selectedType === 'All Types' ||
        app.loanType.toLowerCase().includes(selectedType.toLowerCase());

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchQuery, selectedStatus, selectedType]);

  return (
    <AdminLayout activeSection="loans" title="Loan Pipeline Oversight">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
              Cross-Platform Surveillance
            </span>
            <h1 className="font-clash text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
              Platform Loan Oversight
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Global registry of credit applications across all institutional lenders and borrowers.
            </p>
          </div>

          <button
            onClick={loadApplications}
            className="px-4 py-2 bg-[var(--bg-surface-raised)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-full text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ContrastCard className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">Total Applications</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-bold tracking-tight tabular-nums">
                {kpis.total}
              </span>
              <p className="text-[11px] opacity-75 mt-0.5">Across all capital partners</p>
            </div>
          </ContrastCard>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Capital Pipeline
            </span>
            <div className="mt-2">
              <span className="font-clash text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[var(--text-primary)]">
                {formatMoney(kpis.totalVolume)}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Total requested liquidity</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Under Review
            </span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-bold tracking-tight tabular-nums text-amber-400">
                {kpis.underReview}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">In underwriter queues</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Disbursed / Approved
            </span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-bold tracking-tight tabular-nums text-emerald-400">
                {kpis.approved}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Capital deployed</p>
            </div>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Status Tabs */}
            <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {['All', 'Under Review', 'Verified', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                      : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input & Type Filter */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search applicant, loan ID, lender..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-full focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] transition-colors"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-full text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Home">Home</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Applications Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar min-h-[340px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40 text-[var(--text-secondary)] text-xs font-semibold tracking-wider">
                  <th className="px-6 py-3.5">Applicant</th>
                  <th className="px-6 py-3.5">Application ID</th>
                  <th className="px-6 py-3.5">Loan Type</th>
                  <th className="px-6 py-3.5 text-right">Requested</th>
                  <th className="px-6 py-3.5">AI Credit Score</th>
                  <th className="px-6 py-3.5">Assigned Institution</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm font-medium">
                {isLoading && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      Loading platform applications...
                    </td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-xs text-rose-400">
                      {error}
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      No loan applications match your filter criteria.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !error &&
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="h-14 hover:bg-[var(--bg-surface-raised)]/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[var(--text-primary)]">{app.name}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">{app.occupation}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 font-mono text-xs text-[var(--text-secondary)]">
                        #{String(app.id).slice(0, 8)}
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[var(--text-primary)]">{app.loanType}</td>

                      <td className="px-6 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                        {app.amount}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              app.aiScore >= 750
                                ? 'bg-emerald-400'
                                : app.aiScore >= 650
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                            {app.aiScore}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Building2 size={13} className="text-[var(--accent)]" />
                        <span>{app.lenderName}</span>
                      </td>

                      <td className="px-6 py-3.5">
                        <StatusBadge status={statusToBadgeStatus(app.statusRaw)} label={app.status} />
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setInspectApp(app)}
                          className="px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] text-xs font-semibold hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 shadow-sm"
                        >
                          <Eye size={13} />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>
              Showing {filteredApplications.length} of {applications.length} total loan applications
            </span>
            <span className="text-[var(--accent)] font-semibold">Platform Oversight Mode</span>
          </div>
        </Card>

        {/* Modal: Loan Application Details Inspector */}
        {inspectApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    Application Audit • #{String(inspectApp.id).slice(0, 8)}
                  </span>
                  <h3 className="font-clash text-xl font-bold text-[var(--text-primary)] mt-0.5">
                    {inspectApp.name} — {inspectApp.loanType}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Assigned Partner: <strong className="text-[var(--text-primary)]">{inspectApp.lenderName}</strong> • Applied: {inspectApp.appliedDate}
                  </p>
                </div>

                <button
                  onClick={() => setInspectApp(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                      Requested
                    </span>
                    <p className="text-base font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                      {inspectApp.amount}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                      AI Health Score
                    </span>
                    <p className="text-base font-bold text-[var(--accent)] mt-1 tabular-nums">
                      {inspectApp.aiScore} / 850
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                      Default Prob.
                    </span>
                    <p className="text-base font-bold text-emerald-400 mt-1 tabular-nums">
                      {inspectApp.defaultProbability}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                      DTI Ratio
                    </span>
                    <p className="text-base font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                      {inspectApp.debtToIncome}
                    </p>
                  </div>
                </div>

                {/* Additional Risk Indicators */}
                <div className="p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Underwriting Diagnostics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--text-secondary)]">Payment History Index: </span>
                      <strong className="text-[var(--text-primary)]">{inspectApp.paymentHistory}%</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Credit Utilization: </span>
                      <strong className="text-[var(--text-primary)]">{inspectApp.creditUtilization}%</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Verified Monthly Income: </span>
                      <strong className="text-[var(--text-primary)]">{inspectApp.monthlyIncome}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Underwriter Note: </span>
                      <strong className="text-[var(--text-primary)]">{inspectApp.note || 'None recorded'}</strong>
                    </div>
                  </div>
                </div>

                {/* Timeline / Activities */}
                {inspectApp.activities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2">Audit Activity Trail</h4>
                    <div className="space-y-2">
                      {inspectApp.activities.map((act, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{act.title}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">{act.description}</p>
                          </div>
                          <span className="text-[10px] text-[var(--text-secondary)] font-mono">{act.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] flex justify-end">
                <button
                  onClick={() => setInspectApp(null)}
                  className="px-5 py-2 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-bold shadow-[0_0_15px_var(--accent-glow)] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLoanOversight;
