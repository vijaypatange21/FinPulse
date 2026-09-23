import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Wallet,
  Calendar,
  CloudUpload,
  PlusCircle,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { getCurrentUser, listBorrowers, listApplications, forecastBalance } from '../lib/api';

const BorrowerDashboard = () => {
  const [userProfile, setUserProfile] = React.useState(null);
  const [applications, setApplications] = React.useState([]);
  const [mlHealth, setMlHealth] = React.useState({ score: 0, label: 'New Profile' });
  const [cashflowRisk, setCashflowRisk] = React.useState(false);

  React.useEffect(() => {
    const loadDashboard = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const [borrowers, apps] = await Promise.all([
          listBorrowers().catch(() => []),
          listApplications().catch(() => []),
        ]);

        const bProfile =
          borrowers.find((b) => b.user?.id === user.id || b.user?.username === user.username) ||
          (borrowers.length === 1 ? borrowers[0] : null);
        setApplications(apps);

        if (bProfile) {
          setUserProfile(bProfile);
          const healthScore = bProfile.healthScore || bProfile.health_score || bProfile.riskScore || 0;
          const healthLabel =
            bProfile.healthLabel ||
            bProfile.health_label ||
            (healthScore >= 750 ? 'Prime' : healthScore >= 650 ? 'Good' : 'Fair');
          if (healthScore > 0) {
            setMlHealth({ score: healthScore, label: healthLabel });
          } else {
            setMlHealth({ score: 0, label: 'New Profile' });
          }
        } else {
          setUserProfile({
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
            user: user,
            isNewUser: true,
          });
          setMlHealth({ score: 0, label: 'New Profile' });
        }

        const cashFlow = bProfile?.cashFlow || bProfile?.cash_flow || [];
        if (bProfile && Array.isArray(cashFlow) && cashFlow.length >= 1) {
          const balances = cashFlow.map((c) => (c.income || 0) - (c.expenses || 0));
          const fc = await forecastBalance(balances).catch(() => ({ low_balance_risk: false }));
          setCashflowRisk(fc?.low_balance_risk || false);
        } else {
          setCashflowRisk(false);
        }
      } catch {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUserProfile({
            name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username,
            isNewUser: true,
          });
        }
        setMlHealth({ score: 0, label: 'New Profile' });
      }
    };

    loadDashboard();
  }, []);

  const currentUser = getCurrentUser();
  const name = userProfile
    ? userProfile.display_name || userProfile.name || userProfile.user?.first_name || userProfile.user?.username
    : currentUser?.first_name || currentUser?.username || 'Borrower';

  const isNewUser =
    !userProfile ||
    (!userProfile.healthScore && !userProfile.health_score && !userProfile.riskScore) ||
    (userProfile.healthScore === 0 && userProfile.health_score === 0 && userProfile.riskScore === 0);

  const avgMonthlyIncome =
    userProfile?.cashFlow && userProfile.cashFlow.length > 0
      ? Math.round(userProfile.cashFlow.reduce((acc, c) => acc + (c.income || 0), 0) / userProfile.cashFlow.length)
      : userProfile?.monthly_income
      ? Number(userProfile.monthly_income)
      : 0;

  const trendMonths =
    userProfile?.cashFlow && userProfile.cashFlow.length > 0
      ? userProfile.cashFlow.map((c) => ({
          month: c.month ? c.month.split(' ')[0] : 'Month',
          income: c.income || 0,
          expenses: c.expenses || 0,
        }))
      : [
          { month: 'May', income: 64250, expenses: 20888 },
          { month: 'Jun', income: 65000, expenses: 21500 },
          { month: 'Jul', income: 66500, expenses: 22000 },
        ];
  const maxVal = Math.max(1, ...trendMonths.map((t) => Math.max(t.income, t.expenses)));

  return (
    <BorrowerLayout activeSection="dashboard" title={`Welcome back, ${name.split(' ')[0]}`}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Bento Stat Grid (§3.4): 3 Quiet Cards + 1 Signature Contrast Island Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Health Score */}
          <div className="card-surface p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Financial Health</span>
              <StatusBadge status={mlHealth.score >= 700 ? 'verified' : 'pending'} label={mlHealth.label} />
            </div>
            <div className="my-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {mlHealth.score || 720}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-medium">/ 900</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {isNewUser ? 'Initial estimation' : 'Real-time ML evaluated'}
              </p>
            </div>
            <Link
              to="/borrower/health-score"
              className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1 group"
            >
              Analyze factors <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Card 2: Repayment Discipline */}
          <div className="card-surface p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Repayment Standing</span>
              <span className="w-2 h-2 rounded-full bg-[var(--status-positive)]" />
            </div>
            <div className="my-4">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {userProfile?.repayment_percent ? `${userProfile.repayment_percent}%` : '98.4%'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Payment punctuality</p>
            </div>
            <span className="text-xs text-[var(--status-positive)] font-medium inline-flex items-center gap-1">
              <CheckCircle2 size={13} /> 0 overdue installments
            </span>
          </div>

          {/* Card 3: Cash Flow Health */}
          <div className="card-surface p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Avg. Monthly Inflow</span>
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">Net</span>
            </div>
            <div className="my-4">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                  ₹{avgMonthlyIncome ? avgMonthlyIncome.toLocaleString('en-IN') : '65,000'}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">/mo</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {cashflowRisk ? 'High cash-flow variance detected' : 'Steady surplus cash flow'}
              </p>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-medium">Debt-to-income: 24.2%</span>
          </div>

          {/* Card 4: Signature Contrast Island Card (§3.4) */}
          <div className="rounded-[24px] p-6 bg-[var(--bg-inverse-panel)] text-[var(--text-on-inverse)] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-medium opacity-80">Pre-Approved Limit</span>
              <Sparkles size={16} className="text-[var(--text-on-inverse)] opacity-90" />
            </div>
            <div className="my-4 relative z-10">
              <div className="font-display text-3xl font-semibold tracking-tight tabular-nums">
                {isNewUser ? '₹5,00,000' : '₹15,00,000'}
              </div>
              <p className="text-xs opacity-75 mt-1">Lowest rates starting at 10.5% p.a.</p>
            </div>
            <Link
              to="/loan-application"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[var(--text-on-inverse)] text-[var(--bg-inverse-panel)] font-semibold text-xs transition-all hover:opacity-90 relative z-10"
            >
              Apply with Instant Underwriting <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Middle Section: Cash Flow Graph & Action Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cash Flow Analysis Chart */}
          <div className="card-surface p-7 lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Monthly Cash Flow Trends
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Verified income against monthly outflows</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-secondary)]/40" />
                  <span>Expenses</span>
                </div>
              </div>
            </div>

            {/* Barchart Visualization */}
            <div className="relative h-60 w-full flex items-end justify-between gap-6 px-4 pt-4 border-b border-[var(--border-subtle)]">
              {trendMonths.map((m) => {
                const expHeight = Math.max(12, Math.round((m.expenses / maxVal) * 85));
                const incHeight = Math.max(18, Math.round((m.income / maxVal) * 85));
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="flex items-end gap-2 w-full justify-center">
                      <div
                        className="w-8 sm:w-10 rounded-t-lg bg-[var(--text-secondary)]/25 transition-all group-hover:opacity-90"
                        style={{ height: `${expHeight}%` }}
                        title={`Expenses: ₹${m.expenses.toLocaleString('en-IN')}`}
                      />
                      <div
                        className="w-8 sm:w-10 rounded-t-lg bg-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] transition-all group-hover:brightness-110"
                        style={{ height: `${incHeight}%` }}
                        title={`Income: ₹${m.income.toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="mt-3 text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Surplus Ratio: <strong className="text-[var(--text-primary)]">~65%</strong></span>
              <Link to="/borrower/transactions" className="text-[var(--accent)] hover:underline inline-flex items-center gap-1">
                View Ledger <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="card-surface p-7 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-1">
                Direct Actions
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-6">Manage profile and active facilities</p>
            </div>

            <div className="space-y-3 flex-1">
              <Link
                to="/borrower/upload"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CloudUpload size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Upload Documents
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Submit bank statements or GST proof</p>
                </div>
              </Link>

              <Link
                to="/loan-application"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Apply for New Loan
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Personal, business, or education</p>
                </div>
              </Link>

              <Link
                to="/borrower/find-lender"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Search size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Find Lenders
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Browse partner institutions & rates</p>
                </div>
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <Link
                to="/recommendations"
                className="w-full py-2.5 px-4 rounded-full btn-secondary text-xs flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-[var(--accent)]" /> AI Wellness Recommendations
              </Link>
            </div>
          </div>
        </div>

        {/* Active Loan Applications Table (§4 Data Table) */}
        <div className="card-surface overflow-hidden">
          <div className="px-7 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Active Loan Applications
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Live status from participating lenders</p>
            </div>
            <Link to="/borrower/loans" className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1">
              View All Loans <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-surface-raised)]/40">
                  <th className="px-7 py-3.5">Application Ref</th>
                  <th className="px-7 py-3.5">Facility Type</th>
                  <th className="px-7 py-3.5">Requested Amount</th>
                  <th className="px-7 py-3.5">Tenure</th>
                  <th className="px-7 py-3.5">Decision Status</th>
                  <th className="px-7 py-3.5 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-7 py-10 text-center text-xs text-[var(--text-secondary)]">
                      No active loan applications in progress.{' '}
                      <Link to="/loan-application" className="text-[var(--accent)] font-semibold hover:underline">
                        Apply Now
                      </Link>
                    </td>
                  </tr>
                ) : (
                  applications.slice(0, 5).map((app) => (
                    <tr
                      key={app.id || app.application_id}
                      className="hover:bg-[var(--bg-surface-raised)]/60 transition-colors h-14"
                    >
                      <td className="px-7 py-3 text-xs font-semibold text-[var(--text-primary)]">
                        #{String(app.id || app.application_id).slice(0, 8)}
                      </td>
                      <td className="px-7 py-3 text-xs text-[var(--text-secondary)]">
                        {app.loanType || app.loan_type}
                      </td>
                      <td className="px-7 py-3 text-xs font-semibold text-[var(--text-primary)] tabular-nums">
                        ₹{Number(app.amount || app.requested_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-7 py-3 text-xs text-[var(--text-secondary)]">
                        {app.requested_tenure_months || app.tenure || 12} Months
                      </td>
                      <td className="px-7 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-7 py-3 text-xs text-[var(--text-secondary)] text-right tabular-nums">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BorrowerLayout>
  );
};

export default BorrowerDashboard;
