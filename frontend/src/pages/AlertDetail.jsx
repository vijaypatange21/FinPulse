import React from 'react';
import { Link, useParams } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';

const AlertDetail = () => {
    const { id } = useParams();

    return (
        <LenderLayout activeSection="alerts">
            <div className="max-w-7xl mx-auto w-full pb-24">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/lender/dashboard" className="bg-[#2262ec]/10 p-2 rounded-lg hover:bg-[#2262ec]/20 transition-colors">
                            <span className="material-icons text-[#2262ec]">arrow_back</span>
                        </Link>
                        <div className="bg-[#2262ec]/10 p-2 rounded-lg hidden sm:block">
                            <span className="material-icons text-[#2262ec]">analytics</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">FinPulse <span className="text-[#2262ec]">Lender</span></h1>
                            <p className="text-xs text-slate-500 mt-1">Alert ID: #{id}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-200 dark:border-red-800/50">HIGH PRIORITY</span>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                            <div>
                                <h2 className="text-2xl font-bold">John Doe</h2>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <span>Account: #FP-990218</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span>Personal Loan - Tier 2</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Risk Score</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-bold text-orange-600">68</span>
                                    <span className="text-xs text-slate-400">/100</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                                <p className="text-sm font-medium">Oct 24, 14:02</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 pb-32">
                    <div className="flex-grow space-y-8">
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="material-icons text-[#2262ec]/20 text-6xl">auto_awesome</span>
                            </div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-icons text-[#2262ec]">psychology</span>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">AI-Generated Alert Insights</h3>
                                </div>
                                <div className="bg-[#2262ec]/5 border border-[#2262ec]/20 rounded-lg p-5">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        <strong className="text-[#2262ec] font-semibold text-sm block mb-1 uppercase tracking-tight">Cash Flow Volatility Detected</strong>
                                        John Doe's checking account shows a <span className="font-bold">24% increase in non-essential outflows</span> over the last 15 days, coinciding with a delay in his typical primary payroll deposit. Historical data suggests a 78% probability of a missed payment in the next billing cycle if credit limit is not adjusted.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700">VOLATILITY SCORE: 8.4</span>
                                        <span className="px-2 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700">LIQUIDITY RATIO: 0.92</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <nav className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                <button className="px-6 py-4 text-sm font-semibold border-b-2 border-[#2262ec] text-[#2262ec]">Financial Metrics</button>
                                <button className="px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Transaction Analysis</button>
                                <button className="px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Historical Performance</button>
                            </nav>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wide">Debt-to-Income</p>
                                        <p className="text-2xl font-bold">42.5% <span className="text-sm font-normal text-red-500 ml-1">↑ 4.2%</span></p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wide">Current Ratio</p>
                                        <p className="text-2xl font-bold">1.2x <span className="text-sm font-normal text-slate-400 ml-1">Stable</span></p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wide">Liquidity Index</p>
                                        <p className="text-2xl font-bold text-orange-500">Caution</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-widest">Cash Flow Trend (Last 6 Months)</h4>
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end justify-around p-4 relative">
                                        <div className="w-10 bg-[#2262ec]/20 h-32 rounded-t transition-all hover:bg-[#2262ec]/40"></div>
                                        <div className="w-10 bg-[#2262ec]/20 h-40 rounded-t transition-all hover:bg-[#2262ec]/40"></div>
                                        <div className="w-10 bg-[#2262ec]/20 h-28 rounded-t transition-all hover:bg-[#2262ec]/40"></div>
                                        <div className="w-10 bg-[#2262ec] h-44 rounded-t relative">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">Current Cycle</div>
                                        </div>
                                        <div className="w-10 bg-red-500/40 h-24 rounded-t"></div>
                                        <div className="w-10 bg-red-500/60 h-16 rounded-t"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                                <h3 className="font-bold text-sm uppercase tracking-wider">Activity Log</h3>
                                <span className="material-icons text-slate-400 text-sm">history</span>
                            </div>
                            <div className="p-6 space-y-6 overflow-y-auto max-h-[600px] scrollbar-hide">
                                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                                    <p className="text-xs text-slate-400 mb-1">Oct 24, 2023 • 14:02</p>
                                    <p className="text-sm font-semibold">High Priority Alert Triggered</p>
                                    <p className="text-xs text-slate-500 mt-1">System detected "Cash Flow Volatility" anomaly.</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-900"></div>
                                    <p className="text-xs text-slate-400 mb-1">Oct 12, 2023 • 09:15</p>
                                    <p className="text-sm font-semibold">Email Contact Sent</p>
                                    <p className="text-xs text-slate-500 mt-1">Subject: "Routine Financial Wellness Check-in"</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-orange-400 rounded-full border-4 border-white dark:border-slate-900"></div>
                                    <p className="text-xs text-slate-400 mb-1">Oct 10, 2023 • 11:30</p>
                                    <p className="text-sm font-semibold">Risk Score Update</p>
                                    <p className="text-xs text-slate-500 mt-1">Score dropped 5 points due to missed utility payment.</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-900"></div>
                                    <p className="text-xs text-slate-400 mb-1">Sep 28, 2023 • 16:45</p>
                                    <p className="text-sm font-semibold">Automated Credit Scan</p>
                                    <p className="text-xs text-slate-500 mt-1">Status: Stable. No action taken.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 mt-auto border-t border-slate-200 dark:border-slate-800">
                                <button className="w-full text-xs font-semibold text-[#2262ec] hover:text-[#2262ec]/80 transition-colors flex items-center justify-center gap-1">
                                    VIEW FULL AUDIT TRAIL
                                    <span className="material-icons text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                <footer className="mt-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-4 px-4 rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="hidden md:flex items-center gap-2 text-slate-500">
                            <span className="material-icons text-sm">security</span>
                            <span className="text-xs font-medium">Lender Risk Mitigation Portal</span>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-3 w-full sm:w-auto">
                            <button className="px-5 py-2.5 rounded text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Dismiss Alert</button>
                            <button className="px-5 py-2.5 rounded text-sm font-semibold text-[#2262ec] bg-[#2262ec]/10 hover:bg-[#2262ec]/20 transition-colors">Contact Borrower</button>
                            <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#2262ec] hover:bg-blue-700 shadow-md shadow-[#2262ec]/20 transition-all flex items-center gap-2">
                                <span className="material-icons text-[18px]">credit_card</span>
                                Adjust Credit Limit
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </LenderLayout>
    );
};

export default AlertDetail;
