import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listApplications, listBorrowers } from '../lib/api';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';

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
            <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
                            Underwriting & Portfolio Overview
                        </span>
                        <h1 className="font-clash text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-1">
                            Lender Command Center
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/lender/applications"
                            className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--border-strong)] transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            Filter Pipeline
                        </Link>
                        <Link
                            to="/lender/borrowers"
                            className="px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold text-xs transition-all shadow-[var(--shadow-accent-glow)] hover:opacity-90 flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">groups</span>
                            Active Borrowers ({totalBorrowers})
                        </Link>
                    </div>
                </div>

                {/* Bento Stat Grid: 3 Quiet Cards + 1 Contrast Island Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Contrast Island Card: Total Disbursed */}
                    <ContrastCard className="p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                                Total Disbursed
                            </span>
                            <span className="material-symbols-outlined p-2 rounded-full bg-black/10 dark:bg-white/10 text-base">
                                payments
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                                {formatMoney(totalActiveDisbursed)}
                            </div>
                            <p className="text-xs opacity-75 mt-1 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                {approvedApps.length} active loan facility
                            </p>
                        </div>
                    </ContrastCard>

                    {/* Quiet Card 2: Average Portfolio Health */}
                    <Card className="p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Avg Portfolio Health
                            </span>
                            <span className="material-symbols-outlined p-2 rounded-xl bg-[var(--status-success-bg)] text-[var(--status-success)] text-base">
                                ecg_heart
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                                    {avgAiScore !== null ? avgAiScore : 'N/A'}
                                </span>
                                {avgAiScore !== null && (
                                    <span className="text-xs text-[var(--text-muted)] font-medium">/ 850</span>
                                )}
                            </div>
                            <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="bg-[var(--status-success)] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${avgAiScore ? (avgAiScore / 850) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Quiet Card 3: High Risk Borrowers */}
                    <Card className="p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                High Risk Flags
                            </span>
                            <span className={`material-symbols-outlined p-2 rounded-xl text-base ${
                                highRiskApps.length > 0
                                    ? 'bg-[var(--status-error-bg)] text-[var(--status-error)]'
                                    : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
                            }`}>
                                warning
                            </span>
                        </div>
                        <div className="mt-4">
                            <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                                {highRiskApps.length}
                            </span>
                            <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                                {highRiskApps.length > 0 ? (
                                    <span className="text-[var(--status-error)] font-medium">Action required</span>
                                ) : (
                                    <span>Zero flagged borrowers</span>
                                )}
                            </p>
                        </div>
                    </Card>

                    {/* Quiet Card 4: Pending Applications */}
                    <Card className="p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                                Pending Pipeline
                            </span>
                            <span className="material-symbols-outlined p-2 rounded-xl bg-[var(--accent-tint)] text-[var(--accent)] text-base">
                                pending_actions
                            </span>
                        </div>
                        <div className="mt-4">
                            <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--accent)]">
                                {pendingApps.length}
                            </span>
                            <p className="text-xs text-[var(--text-secondary)] mt-1 tabular-nums">
                                {totalPendingAmount > 0 ? `${formatMoney(totalPendingAmount)} in underwriting` : 'Pipeline up to date'}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Main Grid: Risk Alerts & Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Risk Alerts Panel */}
                    <Card className="lg:col-span-8 p-6 flex flex-col">
                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="font-clash font-semibold text-lg text-[var(--text-primary)]">
                                    Critical Risk Surveillance
                                </h2>
                                {highRiskApps.length > 0 && (
                                    <StatusBadge status="high_risk" label={`${highRiskApps.length} flagged`} />
                                )}
                            </div>
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                                Live AI Surveillance
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            {highRiskApps.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center mx-auto mb-3">
                                        <span className="material-symbols-outlined text-2xl">verified</span>
                                    </div>
                                    <h4 className="font-clash text-base font-semibold text-[var(--text-primary)]">
                                        Portfolio In Good Standing
                                    </h4>
                                    <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mt-1">
                                        No high-risk credit degradation or repayment anomalies detected across your active borrowing network.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {highRiskApps.map((app) => (
                                        <Link
                                            key={app.id || app.application_id}
                                            to={`/lender/applications/${app.id || app.application_id}`}
                                            className="p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--status-error)] transition-colors flex items-start gap-4 group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[var(--status-error-bg)] text-[var(--status-error)] flex-shrink-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xl">warning</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                                                        High Risk Application: {app.borrowerName || app.name || 'Borrower'}
                                                    </h4>
                                                    <span className="text-xs tabular-nums text-[var(--status-error)] font-medium">
                                                        AI Score: {app.aiScore || app.ai_score || 550}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                    {app.loanType || app.loan_type || 'Personal Loan'} • Requested {formatMoney(app.amount || app.requested_amount)}
                                                </p>
                                                <div className="mt-3">
                                                    <span className="text-xs font-semibold px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--status-error-bg)] text-[var(--status-error)] inline-flex items-center gap-1">
                                                        Review Application <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Risk Distribution Chart */}
                    <Card className="lg:col-span-4 p-6 flex flex-col">
                        <div className="border-b border-[var(--border-subtle)] pb-4 mb-4">
                            <h2 className="font-clash font-semibold text-lg text-[var(--text-primary)]">
                                Portfolio Health Mix
                            </h2>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            {totalAppCount === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--border-subtle)] text-[var(--text-muted)] flex items-center justify-center mx-auto mb-3">
                                        <span className="material-symbols-outlined text-2xl">pie_chart</span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">No Applications Yet</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">Health mix activates as borrowers apply.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                className="text-[var(--border-subtle)]"
                                                cx="80"
                                                cy="80"
                                                fill="transparent"
                                                r="64"
                                                stroke="currentColor"
                                                strokeWidth="16"
                                            />
                                            <circle
                                                className="text-[var(--status-success)] transition-all duration-700"
                                                cx="80"
                                                cy="80"
                                                fill="transparent"
                                                r="64"
                                                stroke="currentColor"
                                                strokeDasharray="402"
                                                strokeDashoffset={402 - (402 * (lowRiskPct / 100))}
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="font-clash text-2xl font-bold tabular-nums text-[var(--text-primary)]">
                                                {lowRiskPct + medRiskPct}%
                                            </span>
                                            <span className="text-[10px] uppercase text-[var(--text-muted)] font-medium">
                                                Good Standing
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)]"></span>
                                                <span className="text-[var(--text-secondary)]">Low Risk (750+)</span>
                                            </div>
                                            <span className="font-semibold tabular-nums text-[var(--text-primary)]">{lowRiskPct}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-info)]"></span>
                                                <span className="text-[var(--text-secondary)]">Moderate Risk (650-749)</span>
                                            </div>
                                            <span className="font-semibold tabular-nums text-[var(--text-primary)]">{medRiskPct}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-error)]"></span>
                                                <span className="text-[var(--text-secondary)]">High Risk (&lt;650)</span>
                                            </div>
                                            <span className="font-semibold tabular-nums text-[var(--text-primary)]">{highRiskPct}%</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Incoming Applications Data Table */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                            <h2 className="font-clash font-semibold text-lg text-[var(--text-primary)]">
                                Incoming Loan Applications
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                Real-time borrower requests routed to your underwriting pipeline
                            </p>
                        </div>
                        <Link
                            to="/lender/applications"
                            className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                        >
                            View All Pipeline <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40 text-[var(--text-secondary)] text-xs font-semibold tracking-wider">
                                    <th className="px-6 py-3.5">Application ID</th>
                                    <th className="px-6 py-3.5">Applicant</th>
                                    <th className="px-6 py-3.5">Loan Product</th>
                                    <th className="px-6 py-3.5 text-right">Requested</th>
                                    <th className="px-6 py-3.5">AI Score</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-xs text-[var(--text-muted)]">
                                            Loading applications...
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-xs text-[var(--text-muted)]">
                                            No incoming applications yet. Applications from borrowers will appear here automatically.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.slice(0, 5).map((app) => (
                                        <tr
                                            key={app.id || app.application_id}
                                            className="h-14 hover:bg-[var(--bg-surface-hover)] transition-colors"
                                        >
                                            <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[var(--text-primary)]">
                                                #{String(app.id || app.application_id).slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                                                        {(app.borrowerName || app.name || 'B').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-xs text-[var(--text-primary)]">
                                                        {app.borrowerName || app.name || 'Borrower'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)]">
                                                {app.loanType || app.loan_type || 'Personal Loan'}
                                            </td>
                                            <td className="px-6 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                                                {formatMoney(app.amount || app.requested_amount)}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        (app.aiScore || app.ai_score || 700) >= 750
                                                            ? 'bg-[var(--status-success)]'
                                                            : (app.aiScore || app.ai_score || 700) >= 650
                                                            ? 'bg-[var(--status-warning)]'
                                                            : 'bg-[var(--status-error)]'
                                                    }`} />
                                                    <span className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                                                        {app.aiScore || app.ai_score || 700}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <StatusBadge
                                                    status={app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'under_review'}
                                                    label={app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review'}
                                                />
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Link
                                                    to={`/lender/applications/${app.id || app.application_id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                                                >
                                                    Review <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </LenderLayout>
    );
};

export default LenderDashboard;
