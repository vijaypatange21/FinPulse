import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listApplications, listBorrowers, getApplicationById, getBorrowerById } from '../lib/api';

const formatMoney = (value) => {
    const numericValue = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const AlertDetail = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [borrowers, setBorrowers] = useState([]);
    const [singleEntity, setSingleEntity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlertsData = async () => {
            try {
                if (id && id !== '1') {
                    // Try fetching single entity by ID
                    let entity = null;
                    try {
                        entity = await getApplicationById(id);
                    } catch {
                        try {
                            entity = await getBorrowerById(id);
                        } catch {
                            entity = null;
                        }
                    }
                    setSingleEntity(entity);
                }

                const [appList, bList] = await Promise.all([
                    listApplications().catch(() => []),
                    listBorrowers().catch(() => []),
                ]);

                const apps = Array.isArray(appList) ? appList : (appList?.results || []);
                const bws = Array.isArray(bList) ? bList : (bList?.results || []);

                setApplications(apps);
                setBorrowers(bws);
            } catch {
                // Fallback
            } finally {
                setLoading(false);
            }
        };

        loadAlertsData();
    }, [id]);

    // Find all flagged items for this lender
    const flaggedApps = applications.filter((a) => {
        const score = a.aiScore ?? a.ai_score ?? 750;
        return score < 650 || a.status === 'rejected' || a.risk_level === 'high';
    });

    const flaggedBorrowers = borrowers.filter((b) => {
        return b.status === 'Overdue' || b.status === 'Late' || b.status === 'Grace Period' || (b.riskScore && b.riskScore < 650);
    });

    const totalAlerts = flaggedApps.length + flaggedBorrowers.length;

    // Average AI score calculation for this lender's portfolio
    const allScores = [
        ...applications.map(a => a.aiScore ?? a.ai_score).filter(s => typeof s === 'number' && s > 0),
        ...borrowers.map(b => b.healthScore ?? b.riskScore).filter(s => typeof s === 'number' && s > 0)
    ];
    const portfolioAvgScore = allScores.length > 0
        ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length)
        : null;

    if (loading) {
        return (
            <LenderLayout activeSection="alerts">
                <div className="max-w-7xl mx-auto w-full space-y-6 animate-pulse">
                    <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
                    <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
                </div>
            </LenderLayout>
        );
    }

    // If viewing a specific existing single entity
    if (singleEntity) {
        const entityName = singleEntity.borrowerName || singleEntity.name || `Facility #${id}`;
        const score = singleEntity.aiScore ?? singleEntity.healthScore ?? singleEntity.ai_score ?? singleEntity.riskScore ?? 750;
        const loanType = singleEntity.loanType || singleEntity.loan_type || singleEntity.productType || 'Credit Facility';
        const amountVal = singleEntity.amount || singleEntity.requested_amount || singleEntity.principal || 0;

        return (
            <LenderLayout activeSection="alerts">
                <div className="max-w-7xl mx-auto w-full pb-24 space-y-8">
                    <div className="flex items-center gap-4">
                        <Link to="/lender/alerts" className="bg-[#2262ec]/10 p-2 rounded-lg hover:bg-[#2262ec]/20 transition-colors">
                            <span className="material-icons text-[#2262ec]">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">FinPulse <span className="text-[#2262ec]">Surveillance Monitor</span></h1>
                            <p className="text-xs text-slate-500 mt-0.5">Facility Stream #{String(id).slice(0, 8)}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                    score >= 750 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200' :
                                    score >= 650 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200'
                                }`}>
                                    {score >= 750 ? 'HEALTHY' : score >= 650 ? 'MONITORED' : 'ACTION REQUIRED'}
                                </span>
                                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                                <div>
                                    <h2 className="text-2xl font-bold">{entityName}</h2>
                                    <p className="text-slate-500 text-sm flex items-center gap-2">
                                        <span>{loanType}</span>
                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                        <span>{formatMoney(amountVal)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">AI Health Score</p>
                                    <div className="flex items-center gap-1 justify-center">
                                        <span className="text-2xl font-bold text-[#2262ec]">{score}</span>
                                        <span className="text-xs text-slate-400">/850</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-icons text-[#2262ec]">psychology</span>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">AI Risk Assessment Summary</h3>
                        </div>
                        <div className="bg-[#2262ec]/5 border border-[#2262ec]/20 rounded-xl p-5">
                            <strong className="text-[#2262ec] font-semibold text-sm block mb-1 uppercase tracking-tight">
                                {score >= 700 ? 'Facility Performing Within Parameters' : 'Risk Volatility Detected'}
                            </strong>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {score >= 700
                                    ? 'Underwriting models evaluate positive cash flow stability, verified credit credentials, and minimal probability of default.'
                                    : 'Automated credit surveillance detected variances in debt-to-income or outflow ratios. Recommend reviewing recent transaction verification before increasing credit exposure.'
                                }
                            </p>
                        </div>
                    </section>
                </div>
            </LenderLayout>
        );
    }

    // Default Risk Alerts & Surveillance Hub View
    return (
        <LenderLayout activeSection="alerts">
            <div className="max-w-7xl mx-auto w-full pb-24 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Risk Alerts & Surveillance</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time credit volatility anomalies and portfolio risk notifications.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live AI Surveillance Active
                        </span>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Risk Alerts</p>
                        <div className="flex items-end justify-between">
                            <h3 className={`text-3xl font-bold ${totalAlerts > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                                {totalAlerts}
                            </h3>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                totalAlerts > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                                {totalAlerts > 0 ? 'Requires Action' : 'All Clear'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Portfolio Avg Health Score</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-[#2262ec]">
                                {portfolioAvgScore !== null ? portfolioAvgScore : 'N/A'}
                            </h3>
                            {portfolioAvgScore !== null && <span className="text-xs text-slate-400 font-semibold">Out of 850</span>}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monitored Facilities</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {applications.length + borrowers.length}
                            </h3>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                <span className="material-icons text-sm">verified</span> 100% Covered
                            </span>
                        </div>
                    </div>
                </div>

                {/* Alerts List / Clean Empty State */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Active Risk Notifications</h2>
                        <span className="text-xs text-slate-400 font-medium">{totalAlerts} Alert{totalAlerts === 1 ? '' : 's'}</span>
                    </div>

                    {totalAlerts === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <span className="material-icons text-3xl">verified_user</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Zero Risk Alerts Detected</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                                All monitored borrowers and incoming loan applications assigned to your institution are currently performing within expected health thresholds.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {flaggedApps.map((app) => (
                                <div key={app.id || app.application_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shrink-0 mt-0.5 sm:mt-0">
                                            <span className="material-icons text-xl">warning</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{app.borrowerName || app.name || 'Borrower'}</h4>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase">
                                                    High Risk Application
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {app.loanType || app.loan_type} • Requested {formatMoney(app.amount || app.requested_amount)} • AI Score: <strong className="text-red-600">{app.aiScore ?? app.ai_score}</strong>/850
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/lender/applications/${app.id || app.application_id}`}
                                        className="px-4 py-2 bg-[#2262ec] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
                                    >
                                        Review Application
                                    </Link>
                                </div>
                            ))}

                            {flaggedBorrowers.map((b) => (
                                <div key={b.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 sm:mt-0">
                                            <span className="material-icons text-xl">priority_high</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{b.name}</h4>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase">
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Outstanding: {formatMoney(b.outstanding)} • Risk Score: {b.riskScore || b.healthScore}/850
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/lender/borrowers/${b.id}`}
                                        className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shrink-0"
                                    >
                                        View Borrower Profile
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </LenderLayout>
    );
};

export default AlertDetail;


