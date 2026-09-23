import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  ShieldCheck,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import { createLoanApplication, getCurrentUser, listBorrowers, listLenders } from '../lib/api';

const TERM_OPTIONS = [
  { label: '12 Months', months: 12 },
  { label: '24 Months', months: 24 },
  { label: '36 Months', months: 36 },
  { label: '48 Months', months: 48 },
  { label: '60 Months', months: 60 },
];

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

const LoanApplication = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [borrowerProfile, setBorrowerProfile] = useState(null);
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    requested_amount: '250000',
    loan_type: 'Personal Loan',
    requested_tenure_months: 36,
    preferred_lender: '',
    purpose_note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);

      try {
        const [bList, lList] = await Promise.all([
          listBorrowers().catch(() => []),
          listLenders().catch(() => []),
        ]);

        const profile = bList.find((b) => b.user?.id === user.id || b.user?.username === user.username);
        setBorrowerProfile(profile || null);
        setLenders(Array.isArray(lList) ? lList : []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountSelect = (amt) => {
    setForm((prev) => ({ ...prev, requested_amount: String(amt) }));
  };

  // Calculate approximate monthly EMI
  const amount = Number(form.requested_amount) || 0;
  const tenure = Number(form.requested_tenure_months) || 36;
  const annualRate = 0.105; // 10.5% base estimated APR
  const monthlyRate = annualRate / 12;
  const estimatedEmi =
    amount > 0
      ? Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1))
      : 0;
  const totalPayable = estimatedEmi * tenure;
  const totalInterest = Math.max(0, totalPayable - amount);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || amount < 5000) {
      setError('Please enter a valid loan amount (minimum ₹5,000).');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!borrowerProfile?.borrower_id && !borrowerProfile?.id) {
        throw new Error('Borrower profile not found for the current account.');
      }

      const borrowerId = borrowerProfile.borrower_id || borrowerProfile.id;
      const selectedLender = form.preferred_lender || (lenders[0]?.id || lenders[0]?.lender_id || null);

      await createLoanApplication({
        borrower: borrowerId,
        preferred_lender: selectedLender,
        loan_type: form.loan_type,
        requested_amount: amount,
        requested_tenure_months: tenure,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/borrower/loans');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Unable to submit loan application. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BorrowerLayout activeSection="apply" title="Apply for Loan">
      <div className="max-w-5xl mx-auto space-y-6">
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
              <Link className="hover:text-[var(--accent)] transition-colors" to="/borrower/loans">
                Loans
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <ChevronRight size={13} />
              <span className="font-medium text-[var(--text-primary)]">New Application</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Configure Your Facility
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Our multi-model ML engine evaluates affordability, health scores, and default risk in real time.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[var(--status-negative)]/10 border border-[var(--status-negative)]/30 rounded-2xl text-[var(--status-negative)] text-xs flex items-center gap-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-[var(--status-positive)]/10 border border-[var(--status-positive)]/30 rounded-2xl text-[var(--status-positive)] text-xs flex items-center gap-3">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Application submitted successfully! Redirecting to your loans portfolio...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Column */}
          <div className="lg:col-span-2 card-surface p-7 sm:p-8">
            <form onSubmit={handleApply} className="space-y-6">
              {/* Requested Amount */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Requested Principal Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--accent)] font-display font-semibold text-lg pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="requested_amount"
                    min="5000"
                    step="1000"
                    required
                    value={form.requested_amount}
                    onChange={handleChange}
                    placeholder="250000"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-2xl font-display font-semibold text-xl text-[var(--text-primary)] tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent)] transition-all"
                  />
                </div>

                {/* Preset Amount Chips (§4 pill tabs) */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = Number(form.requested_amount) === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer tabular-nums ${
                          isSelected
                            ? 'bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold shadow-[0_0_12px_var(--accent-glow)]'
                            : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Facility Purpose
                </label>
                <select
                  name="loan_type"
                  value={form.loan_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-2xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent)] transition-all"
                >
                  <option value="Personal Loan">Personal / Unrestricted Capital</option>
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Home Improvement">Home Renovation / Infrastructure</option>
                  <option value="Business Expansion">Commercial Working Capital</option>
                  <option value="Vehicle Purchase">Vehicle Asset Financing</option>
                  <option value="Education Loan">Education / Professional Training</option>
                  <option value="Medical Emergency">Medical Contingency</option>
                  <option value="Other">Other Purpose</option>
                </select>
              </div>

              {/* Desired Tenure (§4 Segmented Pill Controls) */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Repayment Tenure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TERM_OPTIONS.map((opt) => {
                    const isSelected = Number(form.requested_tenure_months) === opt.months;
                    return (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, requested_tenure_months: opt.months }))}
                        className={`py-2.5 px-3 rounded-full text-center text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold shadow-[0_0_12px_var(--accent-glow)]'
                            : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Lender (Optional) */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Preferred Lending Partner (Optional)
                </label>
                <select
                  name="preferred_lender"
                  value={form.preferred_lender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-2xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent)] transition-all"
                >
                  <option value="">Smart Match (Lowest Offered APR)</option>
                  {lenders.map((l) => (
                    <option key={l.id || l.lender_id} value={l.id || l.lender_id}>
                      {l.name || l.institution_name} ({l.type || l.institution_type || 'Institution'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
                <Link
                  to="/borrower/loans"
                  className="px-6 py-2.5 rounded-full btn-secondary text-xs"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="btn-accent px-8 py-3 text-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Evaluating via ML Models...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Inverse Contrast Panel (§4 Inverse Detail Panel) */}
          <div className="space-y-5">
            <div className="rounded-[24px] p-7 bg-[var(--bg-inverse-panel)] text-[var(--text-on-inverse)] shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
              <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                <Calculator size={16} />
                Estimated Facility Breakdown
              </h3>

              <div className="space-y-3 mb-6 text-xs">
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Principal Amount</span>
                  <span className="font-semibold tabular-nums">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Indicative APR</span>
                  <span className="font-semibold text-[var(--status-positive)]">10.50% p.a.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-75">Tenure</span>
                  <span className="font-semibold">{tenure} Months</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--text-on-inverse)]/15 pt-2">
                  <span className="opacity-75">Calculated Interest</span>
                  <span className="font-semibold tabular-nums">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-[var(--text-on-inverse)]/15 pt-4">
                <p className="text-[11px] opacity-70 uppercase tracking-wider mb-1 font-medium">Estimated Monthly EMI</p>
                <div className="font-display text-3xl font-semibold tracking-tight tabular-nums">
                  ₹{estimatedEmi.toLocaleString('en-IN')}<span className="text-xs opacity-75 font-normal"> /mo</span>
                </div>
                <p className="text-[11px] opacity-75 mt-2 leading-relaxed">
                  Final APR and monthly terms are calculated by the automated underwriter following document verification.
                </p>
              </div>
            </div>

            {/* Zero Impact Trust Badge */}
            <div className="card-surface p-5 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[var(--text-primary)]">Soft Credit Inquiry</h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  Applying does not affect your official credit bureau score. Pre-approvals run through private models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BorrowerLayout>
  );
};

export default LoanApplication;
