import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listApplications, listBorrowers, getApplicationById, getBorrowerById } from '../lib/api';
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
                    <div className="h-20 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]" />
                    <div className="h-64 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)]" />
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
                        <Link to="/lender/alerts" className="p-2 rounded-full border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors text-[var(--text-secondary)]">
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="font-clash text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                                Surveillance Detail Inspection
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Facility Stream #{String(id).slice(0, 8)}</p>
                        </div>
                    </div>

                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <StatusBadge
                                    status={score >= 750 ? 'approved' : score >= 650 ? 'under_review' : 'rejected'}
                                    label={score >= 750 ? 'Healthy' : score >= 650 ? 'Monitored' : 'Action Required'}
                                />
                                <div className="h-10 w-px bg-[var(--border-subtle)] hidden md:block"></div>
                                <div>
                                    <h2 className="font-clash text-2xl font-bold text-[var(--text-primary)]">{entityName}</h2>
                                    <p className="text-[var(--text-secondary)] text-xs flex items-center gap-2 mt-1">
                                        <span>{loanType}</span>
                                        <span>•</span>
                                        <span className="font-semibold tabular-nums text-[var(--text-primary)]">{formatMoney(amountVal)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Health Score</p>
                                    <div className="flex items-baseline gap-1 justify-center">
                                        <span className="font-clash text-2xl font-bold tabular-nums text-[var(--accent)]">{score}</span>
                                        <span className="text-xs text-[var(--text-muted)]">/ 850</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-xs font-semibold text-[var(--status-success)]">Active</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[var(--accent)]">psychology</span>
                            <h3 className="font-clash font-semibold text-base text-[var(--text-primary)]">AI Risk Assessment Summary</h3>
                        </div>
                        <div className="bg-[var(--accent-tint)]/40 border border-[var(--accent)]/30 rounded-[var(--radius-md)] p-5">
                            <strong className="text-[var(--accent)] font-semibold text-xs block mb-1 uppercase tracking-wider">
                                {score >= 700 ? 'Facility Performing Within Parameters' : 'Risk Volatility Detected'}
                            </strong>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                {score >= 700
                                    ? 'Underwriting models evaluate positive cash flow stability, verified credit credentials, and minimal probability of default.'
                                    : 'Automated credit surveillance detected variances in debt-to-income or outflow ratios. Recommend reviewing recent transaction verification before increasing credit exposure.'
                                }
                            </p>
                        </div>
                    </Card>
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
                        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
                            Credit Volatility Stream
                        </span>
                        <h1 className="font-clash text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-1">
                            Risk Alerts & Surveillance
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Real-time credit volatility anomalies and portfolio risk notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-[var(--status-success-bg)] text-[var(--status-success)] rounded-[var(--radius-pill)] text-xs font-semibold border border-[var(--status-success)]/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse"></span>
                            Live AI Surveillance Active
                        </span>
                    </div>
                </div>

                {/* Bento Stat Grid: 3 Quiet + 1 Contrast Island */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <ContrastCard className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-75">Active Risk Alerts</span>
                        <div className="mt-3">
                            <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                                {totalAlerts}
                            </span>
                            <p className="text-xs opacity-75 mt-1 font-medium">
                                {totalAlerts > 0 ? 'Requires underwriting attention' : 'All clear across network'}
                            </p>
                        </div>
                    </ContrastCard>

                    <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Portfolio Avg Score</span>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-2">
                                <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--accent)]">
                                    {portfolioAvgScore !== null ? portfolioAvgScore : 'N/A'}
                                </span>
                                {portfolioAvgScore !== null && <span className="text-xs text-[var(--text-muted)] font-medium">/ 850</span>}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Consolidated AI health rating</p>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Monitored Facilities</span>
                        <div className="mt-3">
                            <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                                {applications.length + borrowers.length}
                            </span>
                            <p className="text-xs text-[var(--status-success)] mt-1 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">verified</span> 100% active coverage
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Alerts List */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <h2 className="font-clash font-semibold text-lg text-[var(--text-primary)]">Active Risk Notifications</h2>
                        <span className="text-xs text-[var(--text-secondary)] font-medium">{totalAlerts} Alert{totalAlerts === 1 ? '' : 's'}</span>
                    </div>

                    {totalAlerts === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-3xl">verified_user</span>
                            </div>
                            <h3 className="font-clash text-base font-semibold text-[var(--text-primary)] mb-1">Zero Risk Alerts Detected</h3>
                            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                                All monitored borrowers and incoming loan applications assigned to your institution are currently performing within expected health thresholds.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {flaggedApps.map((app) => (
                                <div key={app.id || app.application_id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-surface-hover)] transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[var(--status-error-bg)] text-[var(--status-error)] flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-outlined text-lg">warning</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-semibold text-xs text-[var(--text-primary)]">{app.borrowerName || app.name || 'Borrower'}</h4>
                                                <StatusBadge status="rejected" label="High Risk Application" />
                                            </div>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                {app.loanType || app.loan_type} • Requested {formatMoney(app.amount || app.requested_amount)} • AI Score: <strong className="text-[var(--status-error)] tabular-nums">{app.aiScore ?? app.ai_score}</strong>/850
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/lender/applications/${app.id || app.application_id}`}
                                        className="px-3.5 py-1.5 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-[var(--radius-pill)] text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
                                    >
                                        Review Application
                                    </Link>
                                </div>
                            ))}

                            {flaggedBorrowers.map((b) => (
                                <div key={b.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-surface-hover)] transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[var(--status-warning-bg)] text-[var(--status-warning)] flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="material-symbols-outlined text-lg">priority_high</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-semibold text-xs text-[var(--text-primary)]">{b.name}</h4>
                                                <StatusBadge status="rejected" label={b.status} />
                                            </div>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                Outstanding: {formatMoney(b.outstanding)} • Risk Score: {b.riskScore || b.healthScore}/850
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/lender/borrowers/${b.id}`}
                                        className="px-3.5 py-1.5 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-pill)] text-xs font-semibold transition-colors shrink-0"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </LenderLayout>
    );
};

export default AlertDetail;
