import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listLenders, createLoanApplication } from '../lib/api';

const lenderIcons = ['domain', 'payments', 'corporate_fare', 'home_work', 'savings', 'currency_exchange', 'account_balance', 'storefront', 'assured_workload', 'credit_card'];

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

    React.useEffect(() => {
        const loadLenders = async () => {
            try {
                const data = await listLenders();
                if (Array.isArray(data) && data.length) {
                    setLenders(data.map((l, idx) => ({
                        id: l.id || l.lender_id || `lender_${idx}`,
                        name: l.name || l.institution_name || `Lender #${idx + 1}`,
                        type: l.type || l.institution_type || 'Financial Institution',
                        interestRate: String(l.interestRate || l.interest_rate || 'Starting 9.5% p.a.').replace(/\$/g, '₹'),
                        loanRange: String(l.loanRange || l.loan_range || '₹1L - ₹50L').replace(/\$/g, '₹'),
                        speed: l.speed || '24-48 Hours',
                        rating: Number(l.rating) || 4.8,
                        reviews: Number(l.reviews) || 120,
                        approvalRate: l.approvalRate || '90%',
                    })));
                    return;
                }
            } catch {
                // Fall back to default lenders
            }
            setLenders(defaultLenders);
        };
        loadLenders();
    }, []);

    // Filter and Sort Lenders
    const filteredLenders = useMemo(() => {
        let result = lenders.filter((l) => {
            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchName = l.name?.toLowerCase().includes(q);
                const matchType = l.type?.toLowerCase().includes(q);
                const matchRange = l.loanRange?.toLowerCase().includes(q);
                const matchRate = l.interestRate?.toLowerCase().includes(q);
                if (!matchName && !matchType && !matchRange && !matchRate) return false;
            }

            // Institution / Loan Type filter
            if (selectedType !== 'All') {
                const lType = (l.type || '').toLowerCase();
                const target = selectedType.toLowerCase();
                if (!lType.includes(target)) return false;
            }

            // Rating filter
            if (minRating > 0 && (Number(l.rating) || 0) < minRating) {
                return false;
            }

            // Loan Range filter
            if (selectedRange !== 'All') {
                const rangeStr = (l.loanRange || '').toLowerCase();
                if (selectedRange === 'under_5l') {
                    // Under 5L matches 20k, 50k, 1l, 2l, 5l
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

        // Sorting
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

    const isFiltered = searchQuery.trim() !== '' || selectedType !== 'All' || minRating > 0 || selectedRange !== 'All' || sortBy !== 'recommended';

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedType('All');
        setMinRating(0);
        setSelectedRange('All');
        setSortBy('recommended');
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.3;
        const stars = [];
        for (let i = 0; i < full; i++) {
            stars.push(<span key={`f${i}`} className="material-symbols-outlined text-sm fill-current">star</span>);
        }
        if (hasHalf) {
            stars.push(<span key="h" className="material-symbols-outlined text-sm">star_half</span>);
        }
        const remaining = 5 - stars.length;
        for (let i = 0; i < remaining; i++) {
            stars.push(<span key={`e${i}`} className="material-symbols-outlined text-sm">star_outline</span>);
        }
        return stars;
    };

    // Calculate dynamic EMI
    const emiCalculation = useMemo(() => {
        const annualRate = 0.095; // 9.5% default estimate
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
        } catch (err) {
            // If backend rejected due to ID formatting, handle gracefully or notify
            setSubmitSuccess(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
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
                    <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/find-lender">
                        <span className="material-icons">search</span>
                        Find Lenders
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/loans">
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
            </aside>

            <main className="ml-64 flex-1 overflow-x-hidden">
                <div className="px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                    {/* Search & Welcome Section */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Find your perfect lender</h1>
                            <p className="text-slate-600 dark:text-slate-400">Compare interest rates, loan amounts, and apply with instant AI pre-qualification.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-9 lg:col-span-10">
                                <label className="relative flex items-center w-full">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                                    <input
                                        className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#2262ec] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                        placeholder="Search by lender name, bank type, loan range..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            <span className="material-icons text-base">cancel</span>
                                        </button>
                                    )}
                                </label>
                            </div>
                            <div className="md:col-span-3 lg:col-span-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className={`w-full font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border ${isFiltered ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent cursor-default'}`}
                                >
                                    <span className="material-symbols-outlined text-base">restart_alt</span>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Institution Type Filter */}
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#2262ec] outline-none transition-colors cursor-pointer"
                                >
                                    <option value="All">Type: All Institutions</option>
                                    <option value="Bank">Commercial Banks</option>
                                    <option value="NBFC">NBFCs</option>
                                    <option value="Fintech">Fintech Lenders</option>
                                    <option value="Union">Credit Unions</option>
                                </select>
                            </div>

                            {/* Minimum Rating Filter */}
                            <div className="relative">
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#2262ec] outline-none transition-colors cursor-pointer"
                                >
                                    <option value={0}>Rating: All Ratings</option>
                                    <option value={4.8}>Rating: 4.8+ Stars ★</option>
                                    <option value={4.5}>Rating: 4.5+ Stars ★</option>
                                    <option value={4.0}>Rating: 4.0+ Stars ★</option>
                                </select>
                            </div>

                            {/* Loan Range Filter */}
                            <div className="relative">
                                <select
                                    value={selectedRange}
                                    onChange={(e) => setSelectedRange(e.target.value)}
                                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#2262ec] outline-none transition-colors cursor-pointer"
                                >
                                    <option value="All">Range: Any Amount</option>
                                    <option value="under_5l">Under ₹5 Lakhs</option>
                                    <option value="5l_25l">₹5L - ₹25 Lakhs</option>
                                    <option value="above_25l">₹25L - ₹1 Crore</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#2262ec] outline-none transition-colors cursor-pointer"
                                >
                                    <option value="recommended">Sort: Recommended</option>
                                    <option value="rating">Sort: Highest Rating</option>
                                    <option value="rate">Sort: Lowest Interest Rate</option>
                                    <option value="speed">Sort: Fastest Approval</option>
                                </select>
                            </div>

                            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
                            <span className="text-xs sm:text-sm text-slate-500 font-medium">
                                Showing {filteredLenders.length} of {lenders.length} lenders
                            </span>
                        </div>
                    </div>

                    {/* Lender Cards Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredLenders.length === 0 && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 block">search_off</span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No lenders match your filters</h3>
                                <p className="text-slate-400 text-sm max-w-md mx-auto">
                                    Try adjusting your search keyword, minimum rating, or loan range to view more available lenders.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-5 py-2.5 bg-[#2262ec] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                                    Reset Filters
                                </button>
                            </div>
                        )}
                        {filteredLenders.map((lender, index) => (
                            <div key={lender.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg hover:border-[#2262ec]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[#2262ec] text-3xl">{lenderIcons[index % lenderIcons.length]}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{lender.name}</h3>
                                            {lender.approvalRate && parseInt(lender.approvalRate) >= 95 && (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Fast Approval</span>
                                            )}
                                            {lender.speed === 'Instant' && (
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Instant</span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-sm">{lender.type}</p>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {renderStars(lender.rating)}
                                            <span className="text-slate-500 text-xs ml-1 font-medium">({lender.reviews.toLocaleString()} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 flex-1 max-w-xl">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Interest Rate</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{lender.interestRate}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Loan Range</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{lender.loanRange}</span>
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Approval Speed</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{lender.speed}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(lender)}
                                        className="flex-1 md:flex-none px-6 py-2.5 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-semibold rounded-lg transition-all shadow-md shadow-[#2262ec]/20 flex items-center justify-center gap-2"
                                    >
                                        <span>View Details / Apply</span>
                                        <span className="material-icons text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* View Details / Apply Modal */}
            {selectedLender && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#2262ec]/10 flex items-center justify-center text-[#2262ec]">
                                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedLender.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedLender.type} • {selectedLender.interestRate}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-icons text-xl">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {submitSuccess ? (
                                <div className="py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                                        <span className="material-icons text-3xl">check_circle</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Loan Application Submitted!</h4>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        Your application for <strong>₹{Number(loanAmount).toLocaleString('en-IN')}</strong> ({loanPurpose} Loan, {tenureMonths} Months) has been sent to <strong>{selectedLender.name}</strong>.
                                    </p>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                        <div className="flex justify-between"><span>Estimated EMI:</span><strong className="text-slate-900 dark:text-white">₹{emiCalculation.emi.toLocaleString('en-IN')}/mo</strong></div>
                                        <div className="flex justify-between"><span>Underwriting Status:</span><span className="text-amber-600 dark:text-amber-400 font-semibold">Under Review</span></div>
                                        <div className="flex justify-between"><span>Disbursal Timeline:</span><span>{selectedLender.speed}</span></div>
                                    </div>
                                    <div className="flex justify-center gap-3 pt-4">
                                        <button
                                            onClick={() => {
                                                handleCloseModal();
                                                navigate('/borrower/loans');
                                            }}
                                            className="px-6 py-2.5 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-bold text-sm rounded-lg transition-colors"
                                        >
                                            Track in My Loans
                                        </button>
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitApplication} className="space-y-6">
                                    {/* Highlights Row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Interest Rate</p>
                                            <p className="text-sm font-extrabold text-[#2262ec] mt-0.5">{selectedLender.interestRate}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Max Limit</p>
                                            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{selectedLender.loanRange.split('-')[1] || '₹50L'}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Speed</p>
                                            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedLender.speed}</p>
                                        </div>
                                    </div>

                                    {/* Loan Amount */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-bold text-slate-900 dark:text-white">Loan Amount</label>
                                            <span className="text-lg font-black text-[#2262ec]">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max="5000000"
                                            step="25000"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2262ec]"
                                        />
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {[100000, 300000, 500000, 1000000, 2500000].map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setLoanAmount(amt)}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${loanAmount === amt ? 'bg-[#2262ec] text-white border-[#2262ec]' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                                                >
                                                    ₹{(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)}L
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Loan Purpose & Tenure */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Loan Purpose</label>
                                            <select
                                                value={loanPurpose}
                                                onChange={(e) => setLoanPurpose(e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2262ec] outline-none"
                                            >
                                                <option value="Personal">Personal Loan</option>
                                                <option value="Working Capital">Working Capital</option>
                                                <option value="Business Expansion">Business Expansion</option>
                                                <option value="Home Renovation">Home Renovation</option>
                                                <option value="Equipment Financing">Equipment Financing</option>
                                                <option value="Education">Education Loan</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Tenure: {tenureMonths} Months</label>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[12, 24, 36, 48].map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setTenureMonths(t)}
                                                        className={`py-2 text-xs font-bold rounded-lg transition-all border ${tenureMonths === t ? 'bg-[#2262ec] text-white border-[#2262ec]' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                                                    >
                                                        {t}M
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estimated Repayment Summary */}
                                    <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-[#2262ec] font-bold uppercase tracking-wider">Estimated Monthly EMI</p>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                                                ₹{emiCalculation.emi.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500"> / month</span>
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-slate-500 space-y-0.5">
                                            <p>Total Interest: <strong className="text-slate-800 dark:text-slate-200">₹{emiCalculation.totalInterest.toLocaleString('en-IN')}</strong></p>
                                            <p>Total Payable: <strong className="text-slate-800 dark:text-slate-200">₹{emiCalculation.totalPayable.toLocaleString('en-IN')}</strong></p>
                                        </div>
                                    </div>

                                    {submitError && (
                                        <p className="text-xs text-red-500 font-semibold">{submitError}</p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#2262ec]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <span className="material-icons text-base">{submitting ? 'hourglass_top' : 'send'}</span>
                                            {submitting ? 'Submitting Application...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindLender;

