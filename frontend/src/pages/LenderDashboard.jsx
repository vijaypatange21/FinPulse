import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LenderDashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2262ec] rounded flex items-center justify-center">
                        <span className="material-icons text-white text-lg">insights</span>
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">FinPulse</h1>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium bg-[#2262ec]/10 text-[#2262ec] border-r-4 border-[#2262ec]" to="#">
                        <span className="material-icons text-xl">dashboard</span> Dashboard
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/lender/borrowers">
                        <span className="material-icons text-xl">people</span> Borrowers
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/lender/applications">
                        <span className="material-icons text-xl">assignment</span> Applications
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="#">
                        <span className="material-icons text-xl">account_balance_wallet</span> Portfolio
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/lender/alerts/1">
                        <span className="material-icons text-xl">notifications_active</span> Alerts
                        <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">8</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4" to="/login">
                        <span className="material-icons text-xl">logout</span> Log Out
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                        <img alt="User Avatar" className="w-8 h-8 rounded-full bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFz0ysoN8eA5liFvu64OJorLLRswnJPlKvS-kBdWfcPZ9snbQFPDVpmEKTnxUEu2o9v1ZUGg32zgU9SE2CKozPyW3bAXqaqOM4jUP_s_O59Bx0qQawxsyD2DqJhhVYU3z9vtzhY30rOvU8fthinBsOZkaQtm9j1_1snQ75YLICZoceVWiOprQ0s3_KFl6OZZRJ5BrmsiNSDfjjiB_Nai9JiuYOIowdKLZ2SZdQoY9z9Q75lwvDSo8VXTEPGkiQqY8VNSRssr7GV5Q" />
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold truncate">Animesh Sharma</p>
                            <p className="text-[10px] text-slate-500 truncate">Senior Risk Officer</p>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded focus:ring-1 focus:ring-[#2262ec]" placeholder="Search borrowers, loan IDs..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                            <span className="material-icons text-sm text-slate-500">calendar_today</span>
                            <span className="text-xs font-medium">Oct 1, 2023 - Oct 31, 2023</span>
                            <span className="material-icons text-xs text-slate-500">expand_more</span>
                        </div>
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-xl">filter_list</span>
                        </button>
                        <button className="bg-[#2262ec] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#2262ec]/90 transition-colors flex items-center gap-2">
                            <span className="material-icons text-sm">add</span> New Loan
                        </button>
                    </div>
                </header>
                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f6f6f8] dark:bg-[#101622]">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Active Loans</span>
                                <span className="material-icons text-[#2262ec] bg-[#2262ec]/10 p-1.5 rounded">payments</span>
                            </div>
                            <h3 className="text-2xl font-bold">₹45.2 Cr</h3>
                            <p className="text-[11px] mt-2 text-emerald-600 flex items-center gap-1 font-medium">
                                <span className="material-icons text-xs">trending_up</span> +12.4% from last month
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Portfolio Risk Score</span>
                                <span className="material-icons text-orange-500 bg-orange-500/10 p-1.5 rounded">security</span>
                            </div>
                            <h3 className="text-2xl font-bold">82<span className="text-sm text-slate-400 font-normal">/100</span></h3>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#2262ec] h-full rounded-full" style={{ width: '82%' }}></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">High Risk Borrowers</span>
                                <span className="material-icons text-red-500 bg-red-500/10 p-1.5 rounded">warning_amber</span>
                            </div>
                            <h3 className="text-2xl font-bold text-red-600">08</h3>
                            <p className="text-[11px] mt-2 text-red-500 flex items-center gap-1 font-medium">
                                <span className="material-icons text-xs">priority_high</span> 2 flagged this week
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Applications</span>
                                <span className="material-icons text-blue-500 bg-blue-500/10 p-1.5 rounded">pending_actions</span>
                            </div>
                            <h3 className="text-2xl font-bold">23</h3>
                            <p className="text-[11px] mt-2 text-slate-500 flex items-center gap-1">
                                <span className="material-icons text-xs">schedule</span> Average TAT: 4.2 days
                            </p>
                        </div>
                    </div>
                    {/* Main Grid: Risk Alerts & Distribution */}
                    <div className="grid grid-cols-12 gap-8 mb-8">
                        {/* Risk Alerts Panel */}
                        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-slate-800 dark:text-slate-100">Critical Risk Alerts</h2>
                                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">URGENT</span>
                                </div>
                                <Link to="/lender/alerts/1" className="text-[#2262ec] text-xs font-semibold hover:underline">View All Alerts</Link>
                            </div>
                            <div className="p-0 overflow-y-auto max-h-[400px]">
                                {/* Alert Item 1 */}
                                <Link to="/lender/alerts/1" className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0 flex items-center justify-center">
                                        <span className="material-icons text-red-500 text-xl">event_busy</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold">Late Payment: Quantum Tech Solutions</h4>
                                            <span className="text-[10px] text-slate-400">12 mins ago</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">EMI for Loan #LP-20394 (₹12,40,000) is overdue by 5 days. Borrower unresponsive.</p>
                                        <div className="flex items-center gap-3">
                                            <button className="text-[11px] bg-red-600 text-white px-3 py-1 rounded font-medium">Initiate Recovery</button>
                                            <button className="text-[11px] text-slate-500 hover:text-[#2262ec] font-medium">Ignore</button>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">CRITICAL</span>
                                </Link>
                                {/* Alert Item 2 */}
                                <div className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0 flex items-center justify-center">
                                        <span className="material-icons text-orange-500 text-xl">trending_down</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold">Credit Score Drop: Green Earth Organics</h4>
                                            <span className="text-[10px] text-slate-400">2 hours ago</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">TransUnion score dropped from 780 to 625. Negative remarks detected in sibling firm.</p>
                                        <div className="flex items-center gap-3">
                                            <button className="text-[11px] bg-slate-800 dark:bg-slate-700 text-white px-3 py-1 rounded font-medium">Audit Borrower</button>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold">WARNING</span>
                                </div>
                                {/* Alert Item 3 */}
                                <div className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 flex items-center justify-center">
                                        <span className="material-icons text-amber-500 text-xl">account_balance</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold">Cash Flow Variance: Skyline Infra</h4>
                                            <span className="text-[10px] text-slate-400">5 hours ago</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">20% deviation from projected quarterly revenue. Risk buffer reduced.</p>
                                        <div className="flex items-center gap-3">
                                            <button className="text-[11px] bg-slate-800 dark:bg-slate-700 text-white px-3 py-1 rounded font-medium">Review Financials</button>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-600 text-[10px] font-bold">MONITOR</span>
                                </div>
                            </div>
                        </div>
                        {/* Risk Distribution Donut */}
                        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-slate-800 dark:text-slate-100">Portfolio Health</h2>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-8">
                                {/* SVG Donut Chart Placeholder */}
                                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-100 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="20"></circle>
                                        <circle className="text-emerald-500" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="150" strokeWidth="20"></circle>
                                        <circle className="text-[#2262ec]" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="350" strokeWidth="20"></circle>
                                        <circle className="text-red-500" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="460" strokeWidth="20"></circle>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-bold">82.4%</span>
                                        <span className="text-[10px] uppercase text-slate-400 font-bold">Good Standing</span>
                                    </div>
                                </div>
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-slate-600 dark:text-slate-400">Low Risk</span>
                                        </div>
                                        <span className="font-bold">70%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#2262ec]"></span>
                                            <span className="text-slate-600 dark:text-slate-400">Medium Risk</span>
                                        </div>
                                        <span className="font-bold">22%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                            <span className="text-slate-600 dark:text-slate-400">High Risk</span>
                                        </div>
                                        <span className="font-bold">8%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Recent Applications Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Applications</h2>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Export CSV</button>
                                <button className="px-3 py-1.5 text-xs bg-[#2262ec] text-white rounded hover:bg-[#2262ec]/90">Bulk Approve</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Application ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Product</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Requested (₹)</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">APP-4921</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-icons text-slate-400 text-sm">business</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">Nexus Logistics</p>
                                                    <p className="text-[10px] text-slate-400">Submitted 2h ago</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Working Capital</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">15,00,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="text-sm font-medium">92/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-blue-100 text-blue-600">IN REVIEW</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-[#2262ec] hover:bg-[#2262ec]/10 p-1 rounded">
                                                <span className="material-icons text-lg">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">APP-4918</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-icons text-slate-400 text-sm">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">Rajesh Kumar</p>
                                                    <p className="text-[10px] text-slate-400">Submitted 5h ago</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Personal Loan</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">4,50,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                <span className="text-sm font-medium">68/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-amber-100 text-amber-600">KYC PENDING</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-[#2262ec] hover:bg-[#2262ec]/10 p-1 rounded">
                                                <span className="material-icons text-lg">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">APP-4915</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-icons text-slate-400 text-sm">store</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">Organic Bites LLP</p>
                                                    <p className="text-[10px] text-slate-400">Submitted 1d ago</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Business Expansion</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">2,10,00,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                <span className="text-sm font-medium">42/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600">AUTO-FLAGGED</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-[#2262ec] hover:bg-[#2262ec]/10 p-1 rounded">
                                                <span className="material-icons text-lg">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">APP-4912</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-icons text-slate-400 text-sm">factory</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">SteelCore Industries</p>
                                                    <p className="text-[10px] text-slate-400">Submitted 2d ago</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Machinery Lease</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">85,00,000</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="text-sm font-medium">88/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-600">VERIFIED</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-[#2262ec] hover:bg-[#2262ec]/10 p-1 rounded">
                                                <span className="material-icons text-lg">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Showing 1 to 4 of 23 applications</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LenderDashboard;
