import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { getCurrentUser, listBorrowers, listApplications, predictHealthScore, forecastBalance } from '../lib/api';

const BorrowerDashboard = () => {
    const [userProfile, setUserProfile] = React.useState(null);
    const [applications, setApplications] = React.useState([]);
    const [mlHealth, setMlHealth] = React.useState({ score: 0, label: 'New Profile' });
    const [cashflowRisk, setCashflowRisk] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);

    React.useEffect(() => {
        const loadDashboard = async () => {
            const user = getCurrentUser();
            if (!user) return;

            try {
                const [borrowers, apps] = await Promise.all([
                    listBorrowers().catch(() => []),
                    listApplications().catch(() => []),
                ]);

                const bProfile = borrowers.find(b => b.user?.id === user.id || b.user?.username === user.username) || (borrowers.length === 1 ? borrowers[0] : null);
                setApplications(apps);

                if (bProfile) {
                    setUserProfile(bProfile);
                    const healthScore = bProfile.healthScore || bProfile.health_score || bProfile.riskScore || 0;
                    const healthLabel = bProfile.healthLabel || bProfile.health_label || (healthScore >= 750 ? 'Prime' : healthScore >= 650 ? 'Good' : 'Fair');
                    if (healthScore > 0) {
                        setMlHealth({ score: healthScore, label: healthLabel });
                    } else {
                        setMlHealth({ score: 0, label: 'New Profile' });
                    }
                } else {
                    setUserProfile({
                        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
                        user: user,
                        isNewUser: true,
                    });
                    setMlHealth({ score: 0, label: 'New Profile' });
                }

                const cashFlow = bProfile?.cashFlow || bProfile?.cash_flow || [];
                if (bProfile && Array.isArray(cashFlow) && cashFlow.length >= 1) {
                    const balances = cashFlow.map(c => (c.income || 0) - (c.expenses || 0));
                    const fc = await forecastBalance(balances).catch(() => ({ low_balance_risk: false }));
                    setCashflowRisk(fc?.low_balance_risk || false);
                } else {
                    setCashflowRisk(false);
                }
            } catch {
                const currentUser = getCurrentUser();
                if (currentUser) {
                    setUserProfile({
                        name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username,
                        isNewUser: true,
                    });
                }
                setMlHealth({ score: 0, label: 'New Profile' });
            }
        };

        loadDashboard();
    }, []);


    const currentUser = getCurrentUser();
    const name = userProfile ? (userProfile.display_name || userProfile.name || userProfile.user?.first_name || userProfile.user?.username) : (currentUser?.first_name || currentUser?.username || 'Borrower');

    const isNewUser = !userProfile || (!userProfile.healthScore && !userProfile.health_score && !userProfile.riskScore) || (userProfile.healthScore === 0 && userProfile.health_score === 0 && userProfile.riskScore === 0);

    const avgMonthlyIncome = (userProfile?.cashFlow && userProfile.cashFlow.length > 0)
        ? Math.round(userProfile.cashFlow.reduce((acc, c) => acc + (c.income || 0), 0) / userProfile.cashFlow.length)
        : (userProfile?.monthly_income ? Number(userProfile.monthly_income) : 0);

    const trendMonths = (userProfile?.cashFlow && userProfile.cashFlow.length > 0)
        ? userProfile.cashFlow.map(c => ({
            month: c.month ? c.month.split(' ')[0] : 'Month',
            income: c.income || 0,
            expenses: c.expenses || 0,
        }))
        : [
            { month: 'May', income: 64250, expenses: 20888 },
            { month: 'Jun', income: 65000, expenses: 21500 },
            { month: 'Jul', income: 66500, expenses: 22000 },
        ];
    const maxVal = Math.max(1, ...trendMonths.map(t => Math.max(t.income, t.expenses)));


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
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/transactions">
                        <span className="material-icons">analytics</span>
                        Transactions
                    </Link>
                    {/* Added Log Out action */}
                    <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
                        <span className="material-icons">logout</span>
                        Log Out
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold">Hello, {name.split(' ')[0]}</h1>
                        <p className="text-sm text-slate-500">Welcome to your FinPulse financial control center.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                                title="Notifications"
                            >
                                <span className="material-icons text-[20px]">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Notifications</h4>
                                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold">Close</button>
                                    </div>
                                    <div className="mt-3 space-y-3">
                                        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl text-xs space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">Bank Statement Parsed</p>
                                            <p className="text-slate-500">Your statement was ingested and submitted for verification.</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl text-xs space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">Health Score Ready</p>
                                            <p className="text-slate-500">Your credit assessment score is updated and pre-qualifies for prime rates.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right flex flex-col justify-center">
                                <p className="text-sm font-semibold leading-tight">{name}</p>
                                <p className="text-xs text-slate-500 italic leading-tight">Borrower</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full flex-1">
                    {/* Top Row: Financial Health Score & Next Action */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Financial Health Score (Gauge Style) */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">FinPulse Health Score</h2>
                                    <p className="text-sm text-slate-500">Multi-dimensional real-time credit wellness evaluation</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${mlHealth.score >= 700 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : mlHealth.score > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-[#2262ec] dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {mlHealth.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto py-6 items-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-slate-100 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="16"></circle>
                                            <circle className="text-[#2262ec]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.6" strokeDashoffset={isNewUser ? 502.6 : Math.max(0, 502.6 - (mlHealth.score / 900) * 502.6)} strokeWidth="16" strokeLinecap="round"></circle>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{mlHealth.score}</span>
                                            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">out of 900</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>300</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>650</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>750</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2262ec]"></span>900</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Status Summary</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {isNewUser ? 'Submit an application or connect bank statements to compute your initial score.' : `Your profile is evaluated as ${mlHealth.label}. Keep low credit utilization to maintain good standing.`}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2">
                                        <span>Last calculated: Just now</span>
                                        <span className="text-[#2262ec] font-semibold cursor-pointer hover:underline">How to improve?</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link to="/borrower/health-score" className="px-6 py-2.5 bg-[#2262ec] text-white text-sm font-bold rounded-lg hover:bg-[#2262ec]/90 transition-colors shadow-sm">
                                    View Full Report
                                </Link>
                                <Link to="/recommendations" className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Improve Score
                                </Link>
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
                                    <h4 className="text-3xl font-extrabold text-[#2262ec]">{isNewUser ? '₹0' : '₹15,00,000'}</h4>
                                    <p className="text-sm text-slate-500 mt-2">Based on your <span className="font-bold text-slate-700 dark:text-slate-300">{mlHealth.score > 0 ? `${mlHealth.score} Health Score` : 'profile status'}</span></p>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility Breakdown</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Income Stability</span>
                                        <span className="font-bold text-slate-600 dark:text-slate-400">{isNewUser ? 'N/A' : 'Excellent'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">DTI Ratio</span>
                                        <span className="font-bold text-slate-600 dark:text-slate-400">{isNewUser ? 'N/A' : 'Optimal (24.2%)'}</span>
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
                                <span className="text-slate-400 text-xs font-bold">{isNewUser ? 'N/A' : '+2%'}</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Income Consistency</p>
                            <p className="text-2xl font-bold">{isNewUser ? 'N/A' : '98.4%'}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                                    <span className="material-icons">history</span>
                                </div>
                                <span className="text-slate-400 text-xs font-bold">{isNewUser ? 'N/A' : 'Steady'}</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Payment History</p>
                            <p className="text-2xl font-bold">{isNewUser ? 'N/A' : (userProfile?.repayment_percent ? `${userProfile.repayment_percent}%` : '100%')}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                                    <span className="material-icons">payments</span>
                                </div>
                                <span className="text-slate-400 text-xs font-bold">{isNewUser ? 'N/A' : '+₹0'}</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Avg. Cash Flow</p>
                            <p className="text-2xl font-bold">{isNewUser ? '₹0' : `₹${avgMonthlyIncome.toLocaleString('en-IN')}`}<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600">
                                    <span className="material-icons">account_balance_wallet</span>
                                </div>
                                <span className="text-slate-400 text-xs font-bold">{isNewUser ? 'N/A' : 'Ratio'}</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Debt-to-Income</p>
                            <p className="text-2xl font-bold">{isNewUser ? 'N/A' : '24.2%'}</p>
                        </div>
                    </div>

                    {/* Main Section: Charts & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Income vs Expenses Chart Area */}
                        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold">Income vs. Expenses</h3>
                                    <p className="text-sm text-slate-500 mt-1">Monthly cashflow overview</p>
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
                            
                            {/* Chart Visualization */}
                            {isNewUser ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg my-auto">
                                    <span className="material-icons text-4xl text-slate-300 dark:text-slate-600 mb-2">bar_chart</span>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Financial trends will appear as transaction history builds.</p>
                                    <p className="text-xs text-slate-400 mt-1">Upload bank statements or link accounts to see your monthly income vs. expense flow.</p>
                                </div>
                            ) : (
                                <div className="relative h-64 w-full flex items-end justify-between gap-4 px-2 mt-auto">
                                    {/* Chart Background Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-slate-100 dark:border-slate-800 pointer-events-none">
                                        <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                        <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                        <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                        <div className="border-b border-slate-100 dark:border-slate-800 w-full"></div>
                                    </div>
                                    
                                    {/* Months Columns */}
                                    {trendMonths.map((m) => {
                                        const expHeight = Math.max(10, Math.round((m.expenses / maxVal) * 85));
                                        const incHeight = Math.max(15, Math.round((m.income / maxVal) * 85));
                                        return (
                                            <div key={m.month} className="relative z-10 flex flex-col items-center flex-1 h-full justify-end group">
                                                <div className="flex items-end gap-1 w-full justify-center transition-transform group-hover:-translate-y-1">
                                                    <div className="w-6 sm:w-8 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: `${expHeight}%` }} title={`Expenses: ₹${m.expenses.toLocaleString('en-IN')}`}></div>
                                                    <div className="w-6 sm:w-8 bg-[#2262ec] rounded-t-sm shadow-sm" style={{ height: `${incHeight}%` }} title={`Income: ₹${m.income.toLocaleString('en-IN')}`}></div>
                                                </div>
                                                <span className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{m.month}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                                <Link to="/borrower/find-lender" className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#2262ec]/50 hover:bg-[#2262ec]/5 transition-all text-left group">
                                    <div className="w-10 h-10 bg-[#2262ec]/10 rounded-lg flex items-center justify-center text-[#2262ec] group-hover:bg-[#2262ec] group-hover:text-white transition-colors shadow-sm">
                                        <span className="material-icons">history_edu</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2262ec] transition-colors">Review Offers</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Browse pre-qualified loan offers</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity / Documents Table (Simplified) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="font-bold text-lg">Active Applications</h3>
                            <Link to="/borrower/loans" className="text-sm font-bold text-[#2262ec] hover:underline flex items-center gap-1">
                                View All <span className="material-icons text-sm">arrow_forward</span>
                            </Link>
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
                                    {applications.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-8 text-center text-sm text-slate-500">
                                                No active loan applications found. <Link to="/loan-application" className="text-[#2262ec] font-bold hover:underline">Apply for a Loan</Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        applications.map((app) => (
                                            <tr key={app.id || app.application_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                                <td className="px-8 py-4 font-bold text-sm text-slate-900 dark:text-white">#{String(app.id || app.application_id).slice(0, 8)}</td>
                                                <td className="px-8 py-4 text-sm text-slate-600 dark:text-slate-300">{app.loanType || app.loan_type}</td>
                                                <td className="px-8 py-4 text-sm font-bold text-slate-900 dark:text-white">₹{Number(app.amount || app.requested_amount || 0).toLocaleString()}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${app.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                                        {app.status === 'approved' ? 'Approved' : (app.status === 'rejected' ? 'Rejected' : 'Under Review')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-slate-500">{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently'}</td>
                                            </tr>
                                        ))
                                    )}
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
