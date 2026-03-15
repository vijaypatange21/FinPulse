import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
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
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Navigation Header */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2262ec]/10 bg-white dark:bg-slate-900 px-6 lg:px-20 py-4">
                        <div className="flex items-center gap-8">
                            <Link to="/borrower/dashboard" className="flex items-center gap-2 text-[#2262ec]">
                                <span className="material-symbols-outlined text-3xl font-bold">account_balance</span>
                                <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">FinPulse</h2>
                            </Link>
                            <nav className="hidden md:flex items-center gap-6">
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-[#2262ec] text-sm font-medium transition-colors" to="/borrower/find-lender">Lenders</Link>
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-[#2262ec] text-sm font-medium transition-colors" to="/borrower/dashboard">My Loans</Link>
                                <Link className="text-slate-600 dark:text-slate-400 hover:text-[#2262ec] text-sm font-medium transition-colors" to="#">Profile</Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="bg-[#2262ec]/10 flex items-center justify-center rounded-full w-10 h-10 border border-[#2262ec]/20 overflow-hidden">
                                <img className="w-full h-full object-cover" alt="User profile avatar smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA635eK4aVXKEEaHOhVLggmT5xw4vc0Rc5a-1599MWrgdZggoFbKV9HNle3iq6-T-e0ejCYC38hDJxQ-GDut4PZo4iZtt6DFHHI2fsu6MAXsf2RFyBmQRBsLYH0Lh3exJqGE4K6qo0RLRuiV0O0g7X2BAPNILLXQCfFvuQaOdnhqrX6-7QZI5tYdi3sEN78z7KvLoNuJILXto4adAOm9LBKRLj4x0lPIHuQBZyGeqqDyW7_EW_fcshoU3vNhsqVYN2xb8fzcmB_C9g"/>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
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
                    </main>
                    {/* Footer */}
                    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-20 py-8 mt-auto">
                        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2 text-[#2262ec] opacity-50 grayscale">
                                <span className="material-symbols-outlined text-xl">account_balance</span>
                                <span className="font-bold">FinPulse</span>
                            </div>
                            <div className="flex gap-8 text-sm text-slate-500">
                                <span className="hover:text-[#2262ec] transition-colors cursor-pointer">Terms</span>
                                <span className="hover:text-[#2262ec] transition-colors cursor-pointer">Privacy</span>
                                <span className="hover:text-[#2262ec] transition-colors cursor-pointer">Support</span>
                            </div>
                            <p className="text-xs text-slate-400">© 2024 FinPulse Financial Technologies Inc.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default FindLender;
