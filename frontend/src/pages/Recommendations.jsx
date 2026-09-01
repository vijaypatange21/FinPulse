import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

import { getCurrentUser, listBorrowers, recommendWellness } from '../lib/api';

const Recommendations = () => {
    const [aiRecommendation, setAiRecommendation] = React.useState(null);
    const [borrowerProfile, setBorrowerProfile] = React.useState(null);
    const user = getCurrentUser();
    const displayName = user ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username) : 'Borrower';
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    React.useEffect(() => {
        const fetchProfileAndAi = async () => {
            try {
                const list = await listBorrowers().catch(() => []);
                const bProfile = list.find((b) => b.user?.id === user?.id || b.user?.username === user?.username);
                setBorrowerProfile(bProfile || null);

                if (bProfile && bProfile.health_score > 0) {
                    const res = await recommendWellness({
                        savings_rate: 0.2,
                        debt_income_ratio: 0.3,
                        discretionary_spending_ratio: 0.25,
                        health_score: bProfile.health_score,
                        risk_class: bProfile.risk_level === 'high' ? 'High Risk' : bProfile.risk_level === 'medium' ? 'Caution' : 'Safe',
                    }).catch(() => null);
                    setAiRecommendation(res);
                } else {
                    setAiRecommendation(null);
                }
            } catch {
                setAiRecommendation(null);
            }
        };
        fetchProfileAndAi();
    }, [user?.id, user?.username]);

    const score = borrowerProfile?.health_score || 0;
    const isNew = score === 0;
    const statusLabel = isNew ? 'New Profile' : (score >= 750 ? 'Excellent' : score >= 650 ? 'Good Standing' : 'Fair');

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
                    {/* Log Out action */}
                    <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
                        <span className="material-icons">logout</span>
                        Log Out
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold">Hello, {displayName.split(' ')[0]}</h1>
                        <p className="text-sm text-slate-500">Wellness insights as of {currentDate}.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-icons text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Personalized Recommendations</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Tailored steps and actionable goals to boost your FinPulse score and borrower profile.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Main Content */}
                        <div className="lg:col-span-8">
                            {aiRecommendation ? (
                                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg text-white mb-8">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                                        <span className="material-icons text-sm">auto_awesome</span> Live ML Model Insight
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Recommended Action: {aiRecommendation.recommendation_code}</h3>
                                    <p className="text-sm text-blue-100 leading-relaxed font-medium">{aiRecommendation.advice}</p>
                                </section>
                            ) : (
                                <section className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 shadow-lg text-white mb-8">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                                        <span className="material-icons text-sm">auto_awesome</span> Profile Assessment
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Get Started with FinPulse</h3>
                                    <p className="text-sm text-slate-200 leading-relaxed font-medium">Apply for financing or link your financial accounts to generate real-time AI wellness recommendations tailored to your profile.</p>
                                </section>
                            )}

                            {/* Financial Health Summary */}
                            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-[#2262ec]/10 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle className="text-slate-100 dark:text-slate-700" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                                <circle className="text-[#2262ec]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={isNew ? 251.2 : Math.max(0, 251.2 - (score / 900) * 251.2)} strokeWidth="8"></circle>
                                            </svg>
                                            <span className="absolute text-2xl font-bold">{score}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{statusLabel}</h3>
                                            <p className="text-sm text-slate-500">{isNew ? 'Submit an application to calculate your health score' : `Health score based on your active credit record`}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 flex-grow max-w-xs">
                                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <span>Profile Completion</span>
                                            <span>{isNew ? '20%' : '100%'}</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#2262ec] rounded-full" style={{ width: isNew ? '20%' : '100%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic">{isNew ? 'Upload financial documents to complete your profile' : 'Profile verified and active'}</p>
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
                                    <span className="text-xs bg-[#2262ec]/10 text-[#2262ec] px-2 py-1 rounded font-bold">{isNew ? '0 ACTIVE' : '1 IN PROGRESS'}</span>
                                </div>
                                {isNew ? (
                                    <p className="text-sm text-slate-500 py-4 text-center">No active goals. Pick a recommendation on the left to set your first milestone.</p>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-sm font-bold">Credit Builder</p>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Goal: Maintain 100% on-time</p>
                                                </div>
                                                <span className="text-xs font-bold text-[#2262ec]">Active</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#2262ec] rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Milestone History */}
                            <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-[#2262ec]/5">
                                    <span className="material-icons text-8xl">military_tech</span>
                                </div>
                                <h3 className="text-lg font-bold mb-4">Recent Wins</h3>
                                {isNew ? (
                                    <p className="text-sm text-slate-500 py-4 text-center">No milestones yet. Complete your profile to earn badges.</p>
                                ) : (
                                    <div className="space-y-4">
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
                                )}
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
