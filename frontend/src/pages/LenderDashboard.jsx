import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { getCurrentUser, listApplications, listBorrowers } from '../lib/api';

const formatMoney = (value) => {
    const numericValue = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const LenderDashboard = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLenderData = async () => {
            try {
                const [apps, bList] = await Promise.all([
                    listApplications().catch(() => []),
                    listBorrowers().catch(() => []),
                ]);

                const appArray = Array.isArray(apps) ? apps : (apps?.results || []);
                const bArray = Array.isArray(bList) ? bList : (bList?.results || []);

                setApplications(appArray);
                setBorrowers(bArray);
            } catch {
                // Fallback
            } finally {
                setLoading(false);
            }
        };

        loadLenderData();
    }, []);

    const totalBorrowers = borrowers.length;
    const pendingApps = applications.filter(a => a.status === 'under_review' || a.status === 'new');
    const approvedApps = applications.filter(a => a.status === 'approved');

    const totalActiveDisbursed = approvedApps.reduce((sum, a) => sum + Number(a.amount || a.requested_amount || 0), 0);
    const totalPendingAmount = pendingApps.reduce((sum, a) => sum + Number(a.amount || a.requested_amount || 0), 0);

    const avgAiScore = applications.length > 0
        ? Math.round(applications.reduce((sum, a) => sum + (a.aiScore || a.ai_score || 700), 0) / applications.length)
        : null;

    const highRiskApps = applications.filter(a => (a.aiScore || a.ai_score || 700) < 600 || a.status === 'flagged');

    // Risk distribution
    const lowRiskCount = applications.filter(a => (a.aiScore || a.ai_score || 700) >= 750).length;
    const medRiskCount = applications.filter(a => (a.aiScore || a.ai_score || 700) >= 650 && (a.aiScore || a.ai_score || 700) < 750).length;
    const highRiskCount = applications.filter(a => (a.aiScore || a.ai_score || 700) < 650).length;
    const totalAppCount = applications.length;

    const lowRiskPct = totalAppCount > 0 ? Math.round((lowRiskCount / totalAppCount) * 100) : 0;
    const medRiskPct = totalAppCount > 0 ? Math.round((medRiskCount / totalAppCount) * 100) : 0;
    const highRiskPct = totalAppCount > 0 ? Math.round((highRiskCount / totalAppCount) * 100) : 0;

    return (
        <LenderLayout activeSection="dashboard">
            <div className="max-w-7xl mx-auto w-full space-y-8">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Disbursed</span>
                            <span className="material-icons text-[#2262ec] bg-[#2262ec]/10 p-1.5 rounded">payments</span>
                        </div>
                        <h3 className="text-2xl font-bold">{formatMoney(totalActiveDisbursed)}</h3>
                        <p className="text-[11px] mt-2 text-slate-500 flex items-center gap-1 font-medium">
                            {approvedApps.length} active loan facility
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Avg Portfolio Health</span>
                            <span className="material-icons text-emerald-500 bg-emerald-500/10 p-1.5 rounded">security</span>
                        </div>
                        <h3 className="text-2xl font-bold">
                            {avgAiScore !== null ? `${avgAiScore}` : 'N/A'}
                            {avgAiScore !== null && <span className="text-sm text-slate-400 font-normal">/850</span>}
                        </h3>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgAiScore ? (avgAiScore / 850) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">High Risk Borrowers</span>
                            <span className="material-icons text-red-500 bg-red-500/10 p-1.5 rounded">warning_amber</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{highRiskApps.length}</h3>
                        <p className="text-[11px] mt-2 text-slate-500 flex items-center gap-1 font-medium">
                            {highRiskApps.length > 0 ? `${highRiskApps.length} flagged for review` : 'Zero flagged borrowers'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Applications</span>
                            <span className="material-icons text-blue-500 bg-blue-500/10 p-1.5 rounded">pending_actions</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2262ec]">{pendingApps.length}</h3>
                        <p className="text-[11px] mt-2 text-slate-500 flex items-center gap-1">
                            {totalPendingAmount > 0 ? `${formatMoney(totalPendingAmount)} in review` : 'No pending underwriting'}
                        </p>
                    </div>
                </div>

                {/* Main Grid: Risk Alerts & Distribution */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Risk Alerts Panel */}
                    <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-slate-800 dark:text-slate-100">Critical Risk Alerts</h2>
                                {highRiskApps.length > 0 && (
                                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">ACTION REQUIRED</span>
                                )}
                            </div>
                            <span className="text-xs text-slate-400">Live AI Surveillance</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            {highRiskApps.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="material-icons text-2xl">verified</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Portfolio In Good Standing</h4>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        No high-risk credit degradation or repayment anomalies detected across your active borrowing network.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {highRiskApps.map((app) => (
                                        <Link key={app.id || app.application_id} to={`/lender/applications/${app.id || app.application_id}`} className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 transition-colors flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0 flex items-center justify-center">
                                                <span className="material-icons text-red-500 text-xl">warning</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-bold">High Risk Application: {app.borrowerName || app.name || 'Borrower'}</h4>
                                                    <span className="text-[10px] text-slate-400">Score: {app.aiScore || app.ai_score || 550}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{app.loanType || app.loan_type} • Requested {formatMoney(app.amount || app.requested_amount)}</p>
                                                <span className="text-[11px] bg-red-600 text-white px-3 py-1 rounded font-medium inline-block">Review Application</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Risk Distribution Donut */}
                    <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">Portfolio Health Mix</h2>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center p-8">
                            {totalAppCount === 0 ? (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="material-icons text-2xl">pie_chart</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Applications Yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Health mix activates as borrowers apply.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-slate-100 dark:text-slate-800" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeWidth="18"></circle>
                                            <circle className="text-emerald-500" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (lowRiskPct / 100))} strokeWidth="18"></circle>
                                            <circle className="text-[#2262ec]" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (medRiskPct / 100))} strokeWidth="18"></circle>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-2xl font-bold">{lowRiskPct + medRiskPct}%</span>
                                            <span className="text-[10px] uppercase text-slate-400 font-bold">Good Standing</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-slate-600 dark:text-slate-400">Low Risk (750+)</span>
                                            </div>
                                            <span className="font-bold">{lowRiskPct}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#2262ec]"></span>
                                                <span className="text-slate-600 dark:text-slate-400">Moderate Risk (650-749)</span>
                                            </div>
                                            <span className="font-bold">{medRiskPct}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                                <span className="text-slate-600 dark:text-slate-400">High Risk (&lt;650)</span>
                                            </div>
                                            <span className="font-bold">{highRiskPct}%</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Applications Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Incoming Loan Applications</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time borrower requests routed to your underwriting pipeline</p>
                        </div>
                        <Link to="/lender/applications" className="text-sm font-semibold text-[#2262ec] hover:underline flex items-center gap-1">
                            View All <span className="material-icons text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Application ID</th>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Loan Product</th>
                                    <th className="px-6 py-4 text-right">Requested (₹)</th>
                                    <th className="px-6 py-4">AI Score</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {applications.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                            No incoming applications yet. Applications from borrowers will appear here automatically.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.slice(0, 5).map((app) => (
                                        <tr key={app.id || app.application_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                #{String(app.id || app.application_id).slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-[#2262ec]/10 text-[#2262ec] flex items-center justify-center font-bold text-xs">
                                                        {(app.borrowerName || app.name || 'B').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {app.borrowerName || app.name || 'Borrower'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {app.loanType || app.loan_type || 'Personal Loan'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                                {formatMoney(app.amount || app.requested_amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        (app.aiScore || app.ai_score || 700) >= 750 ? 'bg-emerald-500' : (app.aiScore || app.ai_score || 700) >= 650 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}></span>
                                                    <span className="font-semibold">{app.aiScore || app.ai_score || 700}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                    app.status === 'approved'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : app.status === 'rejected'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                    {app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    to={`/lender/applications/${app.id || app.application_id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2262ec] hover:underline"
                                                >
                                                    Review <span className="material-icons text-sm">chevron_right</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LenderLayout>
    );
};

export default LenderDashboard;

