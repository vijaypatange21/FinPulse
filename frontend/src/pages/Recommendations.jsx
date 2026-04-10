import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Recommendations = () => {
    return (
        <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
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
                    <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/recommendations">
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
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/transactions">
                        <span className="material-icons">analytics</span>
                        Transactions
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
                        <span className="material-icons">settings</span>
                        Settings
                    </Link>
                    
                    {/* Log Out action */}
                    <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
                        <span className="material-icons">logout</span>
                        Log Out
                    </Link>
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
                        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help with your application?</p>
                        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors">Contact Expert</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold">Hello, Jonathan</h1>
                        <p className="text-sm text-slate-500">Here's your financial status as of Oct 24, 2023.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Personalized Recommendations</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Tailored steps and actionable goals to boost your FinPulse score and borrower profile.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Main Content */}
                        <div className="lg:col-span-8">
                            
                            {/* Financial Health Summary */}
                            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-[#2262ec]/10 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle className="text-slate-100 dark:text-slate-700" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                                <circle className="text-[#2262ec]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="62.8" strokeWidth="8"></circle>
                                            </svg>
                                            <span className="absolute text-2xl font-bold">745</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Good Standing</h3>
                                            <p className="text-sm text-slate-500">You're 55 points away from <span className="text-[#2262ec] font-semibold">Excellent</span></p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 flex-grow max-w-xs">
                                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <span>Level Progress</span>
                                            <span>75%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#2262ec] rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">Complete 2 more goals to reach Level 5</p>
                                    </div>
                                </div>
                            </section>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <button className="px-5 py-2 bg-[#2262ec] text-white rounded-full font-medium text-sm shadow-md shadow-[#2262ec]/20">All Recommendations</button>
                                <button className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-medium text-sm hover:border-[#2262ec] transition-all">🔥 High Impact</button>
                                <button className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-medium text-sm hover:border-[#2262ec] transition-all">⚡ Quick Wins</button>
                                <button className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-medium text-sm hover:border-[#2262ec] transition-all">📅 Long Term</button>
                            </div>

                            {/* Recommendation Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                {/* Recommendation Card 1 */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-[#2262ec]/30 transition-all group">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600">
                                                <span className="material-icons">restaurant</span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                                                +25 Points
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Reduce Dining Expenses</h4>
                                        <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="text-xs text-slate-400 ml-2 font-normal">Difficulty: Low</span>
                                        </div>
                                        <div className="bg-[#f6f6f8] dark:bg-slate-900/50 p-4 rounded-lg mb-6">
                                            <p className="text-xs font-bold text-[#2262ec] uppercase tracking-wider mb-1">Why this helps</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Lowering your monthly non-essential spending improves your debt-to-income ratio, making you a safer candidate for future loans.</p>
                                        </div>
                                        <button className="w-full py-3 bg-[#2262ec] text-white rounded-lg font-bold hover:bg-[#2262ec]/90 transition-colors flex items-center justify-center gap-2">
                                            Start This Goal <span className="material-icons text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Recommendation Card 2 */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-[#2262ec]/30 transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                                                <span className="material-icons">savings</span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                                                +40 Points
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Build Emergency Fund</h4>
                                        <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="text-xs text-slate-400 ml-2 font-normal">Difficulty: Medium</span>
                                        </div>
                                        <div className="bg-[#f6f6f8] dark:bg-slate-900/50 p-4 rounded-lg mb-6">
                                            <p className="text-xs font-bold text-[#2262ec] uppercase tracking-wider mb-1">Why this helps</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">An emergency fund provides a safety net that prevents you from taking on high-interest debt during unexpected financial shocks.</p>
                                        </div>
                                        <button className="w-full py-3 bg-[#2262ec] text-white rounded-lg font-bold hover:bg-[#2262ec]/90 transition-colors flex items-center justify-center gap-2">
                                            Start This Goal <span className="material-icons text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Recommendation Card 3 */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-[#2262ec]/30 transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                                                <span className="material-icons">merge_type</span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                                                +30 Points
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Consolidate Debt</h4>
                                        <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="text-xs text-slate-400 ml-2 font-normal">Difficulty: Medium</span>
                                        </div>
                                        <div className="bg-[#f6f6f8] dark:bg-slate-900/50 p-4 rounded-lg mb-6">
                                            <p className="text-xs font-bold text-[#2262ec] uppercase tracking-wider mb-1">Why this helps</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Simplifying multiple high-interest payments into one lower-interest loan reduces financial stress and improves payment reliability.</p>
                                        </div>
                                        <button className="w-full py-3 bg-[#2262ec] text-white rounded-lg font-bold hover:bg-[#2262ec]/90 transition-colors flex items-center justify-center gap-2">
                                            Start This Goal <span className="material-icons text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Recommendation Card 4 */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-[#2262ec]/30 transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                                                <span className="material-icons">auto_graph</span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                                                +50 Points
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Setup Auto-Pay</h4>
                                        <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                            <span className="material-icons text-sm">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="material-icons text-sm text-slate-200 dark:text-slate-600">star</span>
                                            <span className="text-xs text-slate-400 ml-2 font-normal">Difficulty: Very Easy</span>
                                        </div>
                                        <div className="bg-[#f6f6f8] dark:bg-slate-900/50 p-4 rounded-lg mb-6">
                                            <p className="text-xs font-bold text-[#2262ec] uppercase tracking-wider mb-1">Why this helps</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Consistent on-time payments are the #1 factor for credit scores. Auto-pay ensures you never miss a deadline again.</p>
                                        </div>
                                        <button className="w-full py-3 bg-[#2262ec] text-white rounded-lg font-bold hover:bg-[#2262ec]/90 transition-colors flex items-center justify-center gap-2">
                                            Start This Goal <span className="material-icons text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column: Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Active Goals Tracker */}
                            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Active Goals</h3>
                                    <span className="text-xs bg-[#2262ec]/10 text-[#2262ec] px-2 py-1 rounded font-bold">2 IN PROGRESS</span>
                                </div>
                                <div className="space-y-6">
                                    {/* Active Goal 1 */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm font-bold">Debt Snowball</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Goal: Pay off $5,000</p>
                                            </div>
                                            <span className="text-xs font-bold text-[#2262ec]">65%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#2262ec] rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span>$3,250 of $5,000</span>
                                            <span>12 days left</span>
                                        </div>
                                    </div>
                                    
                                    {/* Active Goal 2 */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm font-bold">Credit Mix Booster</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Goal: Open Credit Builder</p>
                                            </div>
                                            <span className="text-xs font-bold text-[#2262ec]">20%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#2262ec] rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span>Verification Stage</span>
                                            <span>3 days left</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-8 py-2 text-[#2262ec] font-semibold text-sm border border-[#2262ec]/30 rounded-lg hover:bg-[#2262ec]/5 transition-colors">
                                    View All Active Goals
                                </button>
                            </section>

                            {/* Milestone History */}
                            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-[#2262ec]/5">
                                    <span className="material-icons text-8xl">military_tech</span>
                                </div>
                                <h3 className="text-lg font-bold mb-4">Recent Wins</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                                            <span className="material-icons text-sm">check_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Utilities On-time</p>
                                            <p className="text-xs text-slate-500 italic">6 month streak completed! +10 pts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                                            <span className="material-icons text-sm">check_circle</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Account Verified</p>
                                            <p className="text-xs text-slate-500 italic">Security bonus achieved. +5 pts</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Educational Resource */}
                            <div className="bg-[#2262ec] rounded-xl p-6 text-white shadow-lg shadow-[#2262ec]/30 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg mb-2">Learn the Basics</h4>
                                    <p className="text-blue-100 text-sm mb-4 leading-relaxed text-white/80">Understand how your score is calculated and what lenders are really looking for.</p>
                                    <a className="inline-flex items-center gap-2 text-sm font-bold bg-white text-[#2262ec] px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors" href="#">
                                        Read Article <span className="material-icons text-sm">open_in_new</span>
                                    </a>
                                </div>
                                <div className="absolute -bottom-8 -right-8 text-white/10">
                                    <span className="material-icons text-[120px]">school</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Recommendations;
