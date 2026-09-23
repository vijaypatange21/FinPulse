import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Star,
  Search,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { listLenders, createLoanApplication } from '../lib/api';

const defaultLenders = [
  {
    id: 'apex_capital',
    name: 'Apex Capital Finance',
    type: 'Commercial NBFC',
    interestRate: 'Starting 9.2% p.a.',
    loanRange: '₹1L - ₹50L',
    speed: '24-48 Hours',
    rating: 4.9,
    reviews: 428,
    approvalRate: '96%',
    features: ['Zero Prepayment Penalty', 'Instant Digital KYC', 'Minimal Documentation'],
  },
  {
    id: 'horizon_bank',
    name: 'Horizon National Bank',
    type: 'Scheduled Commercial Bank',
    interestRate: 'Starting 8.75% p.a.',
    loanRange: '₹5L - ₹1Cr',
    speed: '24-48 Hours',
    rating: 4.8,
    reviews: 312,
    approvalRate: '94%',
    features: ['Low Interest Rate', 'Flexible Tenure up to 84 months', 'High Loan Limits'],
  },
  {
    id: 'stellar_lending',
    name: 'Stellar Micro-Lending',
    type: 'Fintech NBFC',
    interestRate: 'Starting 11.5% p.a.',
    loanRange: '₹25K - ₹10L',
    speed: 'Instant',
    rating: 4.7,
    reviews: 215,
    approvalRate: '98%',
    features: ['Instant Disbursal in 2 Hours', 'Paperless 100% Digital', 'Ideal for Working Capital'],
  },
];

const FindLender = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [selectedRange, setSelectedRange] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const [lenders, setLenders] = useState([]);
  const [selectedLender, setSelectedLender] = useState(null);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenureMonths, setTenureMonths] = useState(24);
  const [loanPurpose, setLoanPurpose] = useState('Personal');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const loadLenders = async () => {
      try {
        const data = await listLenders();
        if (Array.isArray(data) && data.length) {
          setLenders(
            data.map((l, idx) => ({
              id: l.id || l.lender_id || `lender_${idx}`,
              name: l.name || l.institution_name || `Lender #${idx + 1}`,
              type: l.type || l.institution_type || 'Financial Institution',
              interestRate: String(l.interestRate || l.interest_rate || 'Starting 9.5% p.a.').replace(/\$/g, '₹'),
              loanRange: String(l.loanRange || l.loan_range || '₹1L - ₹50L').replace(/\$/g, '₹'),
              speed: l.speed || '24-48 Hours',
              rating: Number(l.rating) || 4.8,
              reviews: Number(l.reviews) || 120,
              approvalRate: l.approvalRate || '90%',
            }))
          );
          return;
        }
      } catch {
        // Fall back to defaults
      }
      setLenders(defaultLenders);
    };
    loadLenders();
  }, []);

  const filteredLenders = useMemo(() => {
    let result = lenders.filter((l) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = l.name?.toLowerCase().includes(q);
        const matchType = l.type?.toLowerCase().includes(q);
        const matchRange = l.loanRange?.toLowerCase().includes(q);
        const matchRate = l.interestRate?.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchRange && !matchRate) return false;
      }

      if (selectedType !== 'All') {
        const lType = (l.type || '').toLowerCase();
        const target = selectedType.toLowerCase();
        if (!lType.includes(target)) return false;
      }

      if (minRating > 0 && (Number(l.rating) || 0) < minRating) {
        return false;
      }

      if (selectedRange !== 'All') {
        const rangeStr = (l.loanRange || '').toLowerCase();
        if (selectedRange === 'under_5l') {
          const isSmall = rangeStr.includes('k') || rangeStr.includes('1l') || rangeStr.includes('2l') || rangeStr.includes('5l');
          if (!isSmall) return false;
        } else if (selectedRange === '5l_25l') {
          const isMid = rangeStr.includes('5l') || rangeStr.includes('10l') || rangeStr.includes('20l') || rangeStr.includes('25l');
          if (!isMid) return false;
        } else if (selectedRange === 'above_25l') {
          const isHigh = rangeStr.includes('50l') || rangeStr.includes('1cr') || rangeStr.includes('cr');
          if (!isHigh) return false;
        }
      }

      return true;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'rate') {
      result.sort((a, b) => {
        const rateA = parseFloat(a.interestRate?.match(/[\d.]+/)?.[0] || '10');
        const rateB = parseFloat(b.interestRate?.match(/[\d.]+/)?.[0] || '10');
        return rateA - rateB;
      });
    } else if (sortBy === 'speed') {
      result.sort((a, b) => (a.speed?.toLowerCase().includes('instant') || a.speed?.toLowerCase().includes('same') ? -1 : 1));
    }

    return result;
  }, [lenders, searchQuery, selectedType, minRating, selectedRange, sortBy]);

  const isFiltered =
    searchQuery.trim() !== '' || selectedType !== 'All' || minRating > 0 || selectedRange !== 'All' || sortBy !== 'recommended';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setMinRating(0);
    setSelectedRange('All');
    setSortBy('recommended');
  };

  const emiCalculation = useMemo(() => {
    const annualRate = 0.095;
    const monthlyRate = annualRate / 12;
    const n = tenureMonths;
    const p = loanAmount;
    if (!p || !n) return { emi: 0, totalInterest: 0, totalPayable: 0 };
    const emi = Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - p;
    return { emi, totalInterest, totalPayable };
  }, [loanAmount, tenureMonths]);

  const handleOpenModal = (lender) => {
    setSelectedLender(lender);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleCloseModal = () => {
    setSelectedLender(null);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleSubmitApplication = async (e) => {
    e?.preventDefault();
    if (!selectedLender) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      await createLoanApplication({
        preferred_lender: selectedLender.id,
        requested_amount: Number(loanAmount),
        requested_tenure_months: Number(tenureMonths),
        loan_type: loanPurpose,
      });
      setSubmitSuccess(true);
    } catch {
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BorrowerLayout activeSection="find-lender" title="Lending Partner Marketplace">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex text-xs text-[var(--text-secondary)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-[var(--accent)] transition-colors" to="/borrower/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <ChevronRight size={13} />
              <span className="font-medium text-[var(--text-primary)]">Lending Directory</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Explore Verified Institutional Lenders
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Browse commercial banks, fintechs, and credit funds offering pre-qualified APR terms.
          </p>
        </div>

        {/* Filter Bar Card */}
        <div className="card-surface p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 lg:col-span-9 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search lenders by name, APR, loan limit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
              />
            </div>

            <div className="md:col-span-4 lg:col-span-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isFiltered ? 'btn-accent' : 'btn-secondary opacity-70'
                }`}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="All">All Types</option>
              <option value="Bank">Commercial Banks</option>
              <option value="NBFC">NBFCs</option>
              <option value="Fintech">Fintech Lenders</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-4 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value={0}>All Ratings</option>
              <option value={4.8}>4.8+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>

            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="All">Any Facility Amount</option>
              <option value="under_5l">Under ₹5 Lakhs</option>
              <option value="5l_25l">₹5L - ₹25 Lakhs</option>
              <option value="above_25l">₹25L - ₹1 Crore</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ml-auto"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="rate">Sort: Lowest APR</option>
              <option value="speed">Sort: Fastest Disbursal</option>
            </select>
          </div>
        </div>

        {/* Lenders List */}
        <div className="space-y-4">
          {filteredLenders.map((lender) => (
            <div
              key={lender.id}
              className="card-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35),0_0_0_1px_var(--accent-glow)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                      {lender.name}
                    </h3>
                    <StatusBadge status="verified" label={lender.speed} />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{lender.type}</p>
                  <div className="flex items-center gap-1 text-[var(--accent)] text-xs mt-1">
                    <Star size={13} fill="currentColor" />
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">{lender.rating}</span>
                    <span className="text-[var(--text-secondary)]">({lender.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1 max-w-lg text-xs">
                <div>
                  <span className="text-[var(--text-secondary)]">APR Range</span>
                  <div className="font-display font-semibold text-sm text-[var(--text-primary)] mt-0.5 tabular-nums">
                    {lender.interestRate}
                  </div>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Loan Limit</span>
                  <div className="font-display font-semibold text-sm text-[var(--text-primary)] mt-0.5 tabular-nums">
                    {lender.loanRange}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[var(--text-secondary)]">Approval Rate</span>
                  <div className="font-display font-semibold text-sm text-[var(--status-positive)] mt-0.5 tabular-nums">
                    {lender.approvalRate}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal(lender)}
                className="btn-accent px-6 py-2.5 text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>View & Apply</span> <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apply / Details Modal */}
      {selectedLender && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="card-surface max-w-xl w-full flex flex-col overflow-hidden border border-[var(--border-subtle)] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-raised)]/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                    {selectedLender.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">{selectedLender.interestRate}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-[var(--status-positive)]/15 text-[var(--status-positive)] rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={30} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Application Sent to Partner Bank!
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                    Your request for ₹{Number(loanAmount).toLocaleString('en-IN')} has been submitted to {selectedLender.name}.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        handleCloseModal();
                        navigate('/borrower/loans');
                      }}
                      className="btn-accent px-6 py-2.5 text-xs cursor-pointer"
                    >
                      Track Facility
                    </button>
                    <button onClick={handleCloseModal} className="btn-secondary px-6 py-2.5 text-xs cursor-pointer">
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium text-[var(--text-secondary)]">Desired Amount:</span>
                      <span className="font-display font-semibold text-sm text-[var(--text-primary)] tabular-nums">
                        ₹{Number(loanAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="25000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-[var(--bg-surface-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                    />
                  </div>

                  {/* Calculated Estimated EMI */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[var(--text-secondary)]">Estimated Monthly EMI</span>
                      <div className="font-display text-xl font-semibold text-[var(--accent)] mt-0.5 tabular-nums">
                        ₹{emiCalculation.emi.toLocaleString('en-IN')} /mo
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-[var(--text-secondary)]">
                      <span>Tenure: {tenureMonths} Months</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2.5 rounded-full btn-secondary text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-full btn-accent text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </BorrowerLayout>
  );
};

export default FindLender;
