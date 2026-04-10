import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const BorrowerDashboard = () => {
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
                    <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/dashboard">
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
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/loans">
                        <span className="material-icons">account_balance</span>
                        Loans
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
                        <span className="material-icons">analytics</span>
                        Transactions
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
                        <span className="material-icons">settings</span>
                        Settings
                    </Link>
                    
                    {/* Added Log Out action */}
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

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold">Hello, Jonathan</h1>
                        <p className="text-sm text-slate-500">Here's your financial status as of Oct 24, 2023.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                            <span className="material-icons text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right flex flex-col justify-center">
                                <p className="text-sm font-semibold leading-tight">Jonathan Doe</p>
                                <p className="text-xs text-slate-500 italic leading-tight">Premium Borrower</p>
                            </div>
                            <img alt="User profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXlOr5gEy6Odf5E0XG75fdX9iJGZuS8GogdcGueycEPpns-h7Mi862_Q1EcNCjkK5VzqnGymt5xd6cSYpVzTpPOS0yM7-9MHvDjH9ppp-R8UkxuAgiyGyqtlHMLCTsK7Lv0IgwLUXkeS1GSvVgBcehU4Spgw4SjKOabyOzMfvUjhwdbh9Wr7APEnPZZfZjHYcUUa89J3W1xgtlnMAd6qst9IvI7fmSU5qLRkW4iUeZARbUsAeaFUIHhr7uUQtrW2As9Kv7WPE1OJs" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="p-8 space-y-8 pb-20">
                    {/* Hero Section: Health Score & Milestone */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Health Score Card */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#2262ec]/5 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                                {/* Circular Progress */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-slate-100 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-[#2262ec]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="138.23" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-5xl font-extrabold text-slate-900 dark:text-white">720</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Health Score</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">Good Standing</span>
                                    <span className="text-green-600 flex items-center text-sm font-semibold">
                                        <span className="material-icons text-sm mr-1">trending_up</span>
                                        +15 pts
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your score is looking great!</h2>
                                <p className="text-slate-500 leading-relaxed text-sm">You are in the top 15% of borrowers in your region. Maintaining this score will unlock lower interest rates for your next loan application.</p>
                                <div className="pt-4 flex flex-wrap gap-3">
                                    <button className="px-5 py-2.5 bg-[#2262ec] text-white font-medium rounded-lg shadow-lg shadow-[#2262ec]/20 hover:bg-[#2262ec]/90 transition-all flex items-center gap-2">
                                        View Full Report
                                    </button>
                                    <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                        Improve Score
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Next Milestone Card */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Loan Eligibility</h3>
                                    <span className="material-symbols-outlined text-[#2262ec] text-xl">info</span>
                                </div>
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wide">Maximum Capacity</p>
                                    <h4 className="text-3xl font-extrabold text-[#2262ec]">₹15,00,000</h4>
                                    <p className="text-sm text-slate-500 mt-2">Based on your <span className="font-bold text-slate-700 dark:text-slate-300">720 Health Score</span></p>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility Breakdown</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Income Stability</span>
                                        <span className="font-bold text-green-600">Excellent</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">DTI Ratio (24.2%)</span>
                                        <span className="font-bold text-green-600">Optimal</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link to="/loan-application" className="w-full py-3 bg-[#2262ec] text-white font-bold rounded-lg hover:bg-[#2262ec]/90 transition-colors shadow-lg shadow-[#2262ec]/20 flex items-center justify-center">
                                    Apply Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mini Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-[#2262ec]">
                                    <span className="material-icons">event_available</span>
                                </div>
                                <span className="text-green-500 text-xs font-bold">+2%</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Income Consistency</p>
                            <p className="text-2xl font-bold">98.4%</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                                    <span className="material-icons">history</span>
                                </div>
                                <span className="text-green-500 text-xs font-bold">Steady</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Payment History</p>
                            <p className="text-2xl font-bold">100%</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                                    <span className="material-icons">payments</span>
                                </div>
                                <span className="text-green-500 text-xs font-bold">+$120</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Avg. Cash Flow</p>
                            <p className="text-2xl font-bold">$1,240<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600">
                                    <span className="material-icons">account_balance_wallet</span>
                                </div>
                                <span className="text-slate-400 text-xs font-bold">Ratio</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Debt-to-Income</p>
                            <p className="text-2xl font-bold">24.2%</p>
                        </div>
                    </div>

                    {/* Main Section: Charts & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Income vs Expenses Chart Area */}
                        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold">Income vs. Expenses</h3>
                                    <p className="text-sm text-slate-500 mt-1">Last 6 months financial trend</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#2262ec]"></span>
                                        <span className="text-xs font-medium text-slate-500">Income</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                        <span className="text-xs font-medium text-slate-500">Expenses</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mock Chart Visualization */}
                            <div className="relative h-64 w-full flex items-end justify-between gap-4 px-2 mt-auto">
                                {/* Chart Background Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-slate-100 dark:border-slate-800 pointer-events-none">
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                    <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                </div>
                                
                                {/* Months Columns */}
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '40%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '65%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">May</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '45%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '70%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Jun</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '35%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '75%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Jul</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '50%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '80%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Aug</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '42%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '85%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Sep</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                        <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: '38%' }}></div>
                                        <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: '90%' }}></div>
                                    </div>
                                    <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Oct</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
                            <div className="space-y-4 flex-1">
                                <Link to="/borrower/upload" className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#2262ec]/50 hover:bg-[#2262ec]/5 transition-all text-left group">
                                    <div className="w-10 h-10 bg-[#2262ec]/10 rounded-lg flex items-center justify-center text-[#2262ec] group-hover:bg-[#2262ec] group-hover:text-white transition-colors shadow-sm">
                                        <span className="material-icons">cloud_upload</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2262ec] transition-colors">Upload Documents</p>
                                        <p className="text-xs text-slate-500 mt-0.5">KYC & Income Proof</p>
                                    </div>
                                </Link>
                                <Link to="/loan-application" className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#2262ec]/50 hover:bg-[#2262ec]/5 transition-all text-left group">
                                    <div className="w-10 h-10 bg-[#2262ec]/10 rounded-lg flex items-center justify-center text-[#2262ec] group-hover:bg-[#2262ec] group-hover:text-white transition-colors shadow-sm">
                                        <span className="material-icons">add_circle</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2262ec] transition-colors">Apply for Loan</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Personal or Business</p>
                                    </div>
                                </Link>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#2262ec]/50 hover:bg-[#2262ec]/5 transition-all text-left group">
                                    <div className="w-10 h-10 bg-[#2262ec]/10 rounded-lg flex items-center justify-center text-[#2262ec] group-hover:bg-[#2262ec] group-hover:text-white transition-colors shadow-sm">
                                        <span className="material-icons">history_edu</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2262ec] transition-colors">Review Offers</p>
                                        <p className="text-xs text-slate-500 mt-0.5">2 Pending pre-approvals</p>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <img alt="Financial advisor" className="w-12 h-12 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRRCQz_57JhCR9sQsgTzMAwvAd9tAmcHiai8B5Mqj7LygfDuxGUS_NIpIGDqRLebzze9gWwLlmqRJVJdW46KHexxg3OK2Ae8r0IgGUkzlHk9YtVG2F8EEWeML3PAlEv_a0akHa4Ov0EfLA9-AgNDvXMy0fErHDxG5C2hX9CZF0h8Z4E5JBBCrk7rxrCk9V1yeFdjHiYHQXmsr1TBh9FoCMB1Y5YFqiuXOLhEa0hV7RUltGVtMArAuXGN9QmLWpU2XHAYd9hPG7sog" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Your Advisor</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-none">Sarah Williams</p>
                                        <button className="text-xs text-[#2262ec] font-semibold hover:underline flex items-center gap-1">
                                            <span className="material-icons text-[14px]">call</span> Schedule Call
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity / Documents Table (Simplified) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="font-bold text-lg">Active Applications</h3>
                            <button className="text-sm font-bold text-[#2262ec] hover:underline flex items-center gap-1">
                                View All <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-4">Application ID</th>
                                        <th className="px-8 py-4">Loan Type</th>
                                        <th class="px-8 py-4">Amount</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                        <td className="px-8 py-4 font-bold text-sm text-slate-900 dark:text-white">#FP-9821-X</td>
                                        <td className="px-8 py-4 text-sm text-slate-600 dark:text-slate-300">Personal Loan</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-900 dark:text-white">$15,000.00</td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Under Review
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-500">2 hours ago</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                        <td className="px-8 py-4 font-bold text-sm text-slate-900 dark:text-white">#FP-9760-A</td>
                                        <td className="px-8 py-4 text-sm text-slate-600 dark:text-slate-300">Auto Refinance</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-900 dark:text-white">$32,500.00</td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Approved
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-500">Oct 20, 2023</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BorrowerDashboard;
