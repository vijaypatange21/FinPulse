import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockLenders } from '../data/mockData';

const lenderIcons = ['domain', 'payments', 'corporate_fare', 'home_work', 'savings', 'currency_exchange', 'account_balance', 'storefront', 'assured_workload', 'credit_card'];

const FindLender = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLenders = mockLenders.filter((l) => {
        const q = searchQuery.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q);
    });

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
                <div className="p-4 mt-auto">
                    <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
                        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help with your application?</p>
                        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Contact Expert</button>
                    </div>
                </div>
            </aside>

            <main className="ml-64 flex-1 overflow-x-hidden">
                <div className="px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                        {/* Search & Welcome Section */}
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Find your perfect lender</h1>
                                <p className="text-slate-600 dark:text-slate-400">Compare interest rates and loan amounts from top-rated providers.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8 lg:col-span-9">
                                    <label className="relative flex items-center w-full">
                                        <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#2262ec] outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                            placeholder="Search by lender name or type..."
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div className="md:col-span-4 lg:col-span-3 flex gap-2">
                                    <button className="flex-1 bg-[#2262ec] text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">tune</span> Search
                                    </button>
                                </div>
                            </div>
                            {/* Filters Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Loan Type: <span className="text-[#2262ec] font-bold">All</span>
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Rating: <span className="text-[#2262ec] font-bold">4.0+</span>
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Range: <span className="text-[#2262ec] font-bold">Any</span>
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </button>
                                </div>
                                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
                                <span className="text-sm text-slate-500">Showing {filteredLenders.length} lenders</span>
                            </div>
                        </div>
                        {/* Lender Cards Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {filteredLenders.length === 0 && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">search_off</span>
                                    <p className="text-slate-400">No lenders found matching "{searchQuery}"</p>
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
                                        <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#2262ec] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                            View Details/Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
            </main>
        </div>
    );
};

export default FindLender;
