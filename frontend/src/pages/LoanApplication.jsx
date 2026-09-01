import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
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

  const displayName = borrowerProfile
    ? (borrowerProfile.display_name || borrowerProfile.name || currentUser?.first_name || currentUser?.username)
    : (currentUser?.first_name || currentUser?.username || 'Borrower');

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-800 dark:text-slate-200 antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2262ec] rounded-lg flex items-center justify-center">
            <span className="material-icons text-white">insights</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2262ec]">FinPulse</span>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/dashboard">
            <span className="material-icons">dashboard</span>
            Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/health-score">
            <span className="material-icons">favorite</span>
            My Health Score
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/recommendations">
            <span className="material-icons">auto_awesome</span>
            Recommendations
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/upload">
            <span className="material-icons">description</span>
            Documents
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/find-lender">
            <span className="material-icons">search</span>
            Find Lenders
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/loans">
            <span className="material-icons">account_balance</span>
            Loans
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/transactions">
            <span className="material-icons">analytics</span>
            Transactions
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
            <span className="material-icons">logout</span>
            Log Out
          </Link>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
            <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Instant Underwriting</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">AI-evaluated credit decision in seconds.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold">Hello, {displayName.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500">Apply for financing with real-time AI underwriting.</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right flex flex-col justify-center">
                <p className="text-sm font-semibold leading-tight">{displayName}</p>
                <p className="text-xs text-slate-500 italic leading-tight">Borrower</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex mb-6 text-sm text-slate-500 dark:text-slate-400">
            <ol className="flex items-center space-x-2">
              <li><Link className="hover:text-[#2262ec] transition-colors" to="/borrower/dashboard">Dashboard</Link></li>
              <li className="flex items-center space-x-2">
                <span className="material-icons text-sm">chevron_right</span>
                <Link className="hover:text-[#2262ec] transition-colors" to="/borrower/loans">Loans</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-icons text-sm">chevron_right</span>
                <span className="font-medium text-slate-900 dark:text-white">Apply for Loan</span>
              </li>
            </ol>
          </nav>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">New Loan Application</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Configure your requested loan amount and tenure. Our engine checks multi-dimensional affordability in real time.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
              <span className="material-icons text-red-500 text-base">error_outline</span>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-center gap-3">
              <span className="material-icons text-green-500 text-base">check_circle</span>
              Application submitted successfully! Redirecting to your loans dashboard...
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <form onSubmit={handleApply} className="space-y-6">
                {/* Loan Amount Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Requested Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-lg pointer-events-none">
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
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2262ec] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          Number(form.requested_amount) === amt
                            ? 'bg-[#2262ec] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Loan Purpose
                  </label>
                  <select
                    name="loan_type"
                    value={form.loan_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2262ec] focus:border-transparent transition-all"
                  >
                    <option value="Personal Loan">Personal / Unrestricted Loan</option>
                    <option value="Debt Consolidation">Debt Consolidation</option>
                    <option value="Home Improvement">Home Improvement / Renovation</option>
                    <option value="Business Expansion">Business & Commercial Working Capital</option>
                    <option value="Vehicle Purchase">Vehicle Purchase</option>
                    <option value="Education Loan">Education / Skill Development</option>
                    <option value="Medical Emergency">Medical & Emergency Expense</option>
                    <option value="Other">Other Purpose</option>
                  </select>
                </div>

                {/* Desired Tenure */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Desired Tenure (Months)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {TERM_OPTIONS.map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, requested_tenure_months: opt.months }))}
                        className={`py-2.5 px-3 rounded-xl border text-center font-semibold text-sm transition-all ${
                          Number(form.requested_tenure_months) === opt.months
                            ? 'border-[#2262ec] bg-[#2262ec]/10 text-[#2262ec] shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Lender (Optional) */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Preferred Institution (Optional)
                  </label>
                  <select
                    name="preferred_lender"
                    value={form.preferred_lender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2262ec] transition-all text-sm"
                  >
                    <option value="">Auto-Match (Best Competitive Rate)</option>
                    {lenders.map((l) => (
                      <option key={l.id || l.lender_id} value={l.id || l.lender_id}>
                        {l.name || l.institution_name} ({l.type || l.institution_type || 'Bank'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <Link
                    to="/borrower/loans"
                    className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className="px-8 py-3 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-bold rounded-xl shadow-lg shadow-[#2262ec]/20 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-icons animate-spin text-sm">refresh</span>
                        Evaluating Application...
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm">send</span>
                        Submit Loan Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Breakdown / Live EMI Calculator */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-icons text-[#2262ec] text-lg">calculate</span>
                  Estimated EMI Breakdown
                </h3>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Principal</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Indicative APR</span>
                    <span className="font-bold text-emerald-600">10.50% p.a.</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Tenure</span>
                    <span className="font-bold text-slate-900 dark:text-white">{tenure} Months</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="text-slate-500">Total Interest</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">₹{totalInterest.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Estimated Monthly EMI</p>
                  <p className="text-3xl font-extrabold text-[#2262ec]">₹{estimatedEmi.toLocaleString()}<span className="text-xs text-slate-400 font-normal"> /mo</span></p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Final terms and interest rate are determined by the lender following live credit assessment.
                  </p>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                <span className="material-icons text-[#2262ec] text-xl mt-0.5">verified_user</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Zero Impact on Credit Score</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Submitting this initial quote application conducts a soft evaluation with zero penalty to your credit score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanApplication;

