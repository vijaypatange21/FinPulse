import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Calculator,
  ChevronRight,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { getCurrentUser, listApplications } from '../lib/api';

type LoanStatus = 'On Track' | 'Due Soon' | 'Grace Period' | 'Closed';

type LoanItem = {
  id: string;
  name: string;
  type: string;
  lender: string;
  principal: string;
  outstanding: string;
  emiAmount: string;
  interestRate: string;
  nextDue: string;
  remainingTenure: string;
  progress: number;
  status: LoanStatus;
  autopay: boolean;
};

type EMIItem = {
  month: string;
  dueDate: string;
  amount: string;
  status: 'Paid' | 'Upcoming' | 'Late';
};

type LoansData = {
  summary: {
    activeLoans: number | string;
    totalOutstanding: string;
    nextPayment: string;
    onTimeRate: string;
  };
  loans: LoanItem[];
  schedule: EMIItem[];
  averageEmi: string;
};

const LoansPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LoansData | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadLoans = async () => {
      const user = getCurrentUser();

      try {
        const apps = await listApplications().catch(() => []);
        const appList = Array.isArray(apps) ? apps : apps?.results || [];
        setApplications(appList);

        const approvedLoans = appList.filter((a: any) => a.status === 'approved');
        const pendingApps = appList.filter((a: any) => a.status !== 'approved');

        const totalApprovedAmt = approvedLoans.reduce(
          (sum: number, l: any) => sum + Number(l.amount || l.requested_amount || 0),
          0
        );
        const totalPendingAmt = pendingApps.reduce(
          (sum: number, l: any) => sum + Number(l.amount || l.requested_amount || 0),
          0
        );

        if (approvedLoans.length > 0) {
          setData({
            summary: {
              activeLoans: approvedLoans.length,
              totalOutstanding: `₹${totalApprovedAmt.toLocaleString('en-IN')}`,
              nextPayment: 'No upcoming payment',
              onTimeRate: '100%',
            },
            loans: approvedLoans.map((l: any) => ({
              id: `LN-${String(l.id || l.application_id).slice(0, 5)}`,
              name: `${l.loanType || l.loan_type || 'Personal'} Loan`,
              type: l.loanType || l.loan_type || 'Personal',
              lender: l.preferred_lender?.institution_name || 'FinPulse Partner Bank',
              principal: `₹${Number(l.amount || l.requested_amount || 0).toLocaleString('en-IN')}`,
              outstanding: `₹${Number(l.amount || l.requested_amount || 0).toLocaleString('en-IN')}`,
              emiAmount: `₹${Math.round(
                Number(l.amount || l.requested_amount || 0) /
                  Number(l.tenure || l.requested_tenure_months || 12)
              ).toLocaleString('en-IN')}`,
              interestRate: '10.5% p.a.',
              nextDue: 'Next month',
              remainingTenure: `${l.tenure || l.requested_tenure_months || 12} months`,
              progress: 0,
              status: 'On Track' as LoanStatus,
              autopay: true,
            })),
            schedule: [],
            averageEmi: '₹0',
          });
        } else {
          setData({
            summary: {
              activeLoans: pendingApps.length > 0 ? `${pendingApps.length} in Review` : 0,
              totalOutstanding: totalPendingAmt > 0 ? `₹${totalPendingAmt.toLocaleString('en-IN')}` : '₹0',
              nextPayment: pendingApps.length > 0 ? 'Pending Sanction' : 'N/A',
              onTimeRate: 'N/A',
            },
            loans: [],
            schedule: [],
            averageEmi: '₹0',
          });
        }
      } catch {
        setData({
          summary: {
            activeLoans: 0,
            totalOutstanding: '₹0',
            nextPayment: 'N/A',
            onTimeRate: 'N/A',
          },
          loans: [],
          schedule: [],
          averageEmi: '₹0',
        });
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  return (
    <BorrowerLayout activeSection="loans" title="My Loans & Obligations">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex text-xs text-[var(--text-secondary)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-[var(--accent)] transition-colors" to="/borrower/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <ChevronRight size={13} />
              <span className="font-medium text-[var(--text-primary)]">Loan Facilities</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Credit Facilities & Repayments
            </h1>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Real-time portfolio management, EMI schedules, and active borrowing accounts.
            </p>
          </div>
          <Link to="/loan-application" className="btn-accent px-6 py-2.5 text-xs inline-flex items-center gap-2">
            <PlusCircle size={15} /> Apply for Loan
          </Link>
        </div>

        {/* Bento Stat Row (§3.4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card-surface p-6">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Active Facilities</span>
            <div className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] mt-2 tabular-nums">
              {data?.summary.activeLoans || 0}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Sanctioned & in servicing</p>
          </div>

          {/* Signature Contrast Island Card for Outstanding Balance */}
          <div className="rounded-[24px] p-6 bg-[var(--bg-inverse-panel)] text-[var(--text-on-inverse)] shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            <span className="text-xs font-medium opacity-80">Total Outstanding Balance</span>
            <div className="font-display text-3xl font-semibold tracking-tight mt-2 tabular-nums">
              {data?.summary.totalOutstanding || '₹0'}
            </div>
            <p className="text-xs opacity-75 mt-1">Principal remaining across all lenders</p>
          </div>

          <div className="card-surface p-6">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Next Due Date</span>
            <div className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)] mt-3 truncate">
              {data?.summary.nextPayment || 'N/A'}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Automatic debit enrolled</p>
          </div>

          <div className="card-surface p-6">
            <span className="text-xs font-medium text-[var(--text-secondary)]">On-Time Payment Score</span>
            <div className="font-display text-3xl font-semibold tracking-tight text-[var(--accent)] mt-2 tabular-nums">
              {data?.summary.onTimeRate || '98%'}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Punctual settlement history</p>
          </div>
        </div>

        {/* Active Loans List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Active Loan Accounts
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {data?.loans.length || 0} active accounts
              </span>
            </div>

            {loading ? (
              <div className="card-surface p-8 text-center text-xs text-[var(--text-secondary)] animate-pulse">
                Loading loan portfolio accounts...
              </div>
            ) : data?.loans.length === 0 ? (
              <div className="card-surface p-12 text-center">
                <CreditCard size={40} className="text-[var(--text-secondary)]/40 mx-auto mb-3" />
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-1">
                  {applications.length > 0 ? 'Application Under Review' : 'No Active Loans Found'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
                  {applications.length > 0
                    ? `You have ${applications.length} submitted loan application(s). As soon as the lender verifies documents, the loan terms will activate here.`
                    : 'You currently have no active borrowing lines. Configure and submit an application to receive competitive lender quotes.'}
                </p>
                <Link to="/loan-application" className="btn-accent px-6 py-2.5 text-xs inline-flex items-center gap-2">
                  <PlusCircle size={14} /> Apply for New Loan
                </Link>
              </div>
            ) : (
              data?.loans.map((loan) => (
                <div key={loan.id} className="card-surface p-7 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-display font-semibold text-base text-[var(--text-primary)]">
                          {loan.name}
                        </h4>
                        <StatusBadge status={loan.status} />
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {loan.id} • {loan.lender} • {loan.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium">Outstanding Principal</span>
                      <div className="font-display text-2xl font-semibold text-[var(--text-primary)] tabular-nums">
                        {loan.outstanding}
                      </div>
                    </div>
                  </div>

                  {/* Repayment Progress Gauge Bar (§4) */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
                      <span>Repayment Progress</span>
                      <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                        {loan.progress}% settled
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-surface-raised)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
                        style={{ width: `${Math.max(5, loan.progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Terms Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-xs">
                    <div>
                      <span className="text-[var(--text-secondary)]">Monthly EMI</span>
                      <p className="font-semibold text-[var(--text-primary)] mt-0.5 tabular-nums">{loan.emiAmount}</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Interest Rate</span>
                      <p className="font-semibold text-[var(--text-primary)] mt-0.5 tabular-nums">{loan.interestRate}</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Next Installment</span>
                      <p className="font-semibold text-[var(--text-primary)] mt-0.5">{loan.nextDue}</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Remaining Tenure</span>
                      <p className="font-semibold text-[var(--text-primary)] mt-0.5">{loan.remainingTenure}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Prepayment / Repayment Calculator Sidebar Card */}
          <div className="space-y-5">
            <div className="card-surface p-7">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Calculator size={16} className="text-[var(--accent)]" />
                Prepayment Estimator
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-5">
                Calculate interest savings by paying lump-sum amounts against principal.
              </p>

              <div className="space-y-3 p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Sample Prepayment:</span>
                  <span className="font-semibold text-[var(--text-primary)] tabular-nums">₹50,000</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2">
                  <span className="text-[var(--text-secondary)]">Tenure Reduced:</span>
                  <span className="font-semibold text-[var(--accent)]">~4 Months</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2">
                  <span className="text-[var(--text-secondary)]">Interest Saved:</span>
                  <span className="font-semibold text-[var(--status-positive)] tabular-nums">~₹16,500</span>
                </div>
              </div>

              <Link
                to="/borrower/find-lender"
                className="mt-6 w-full py-2.5 px-4 rounded-full btn-secondary text-xs flex items-center justify-center gap-2"
              >
                Explore Better APR Offers <ArrowRight size={13} />
              </Link>
            </div>

            {/* Underwriting Trust Badge */}
            <div className="card-surface p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[var(--text-primary)]">Disbursement Verification</h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  All loan disbursements are cryptographically logged and registered to your primary bank account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BorrowerLayout>
  );
};

export default LoansPage;