import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import CustomSelect from '../components/ui/CustomSelect';
import Logo from '../components/ui/Logo';
import { mockApplications } from '../data/mockData';
import { getApplicationById, updateApplicationStatus } from '../lib/api';

const ApplicationDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const appIndex = parseInt(id, 10) - 1;
    const [apiApp, setApiApp] = useState(null);
    const app = apiApp || mockApplications[Number.isNaN(appIndex) ? 0 : appIndex] || mockApplications[0];

    const [isUpdating, setIsUpdating] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [noteModal, setNoteModal] = useState(false);
    const [requestInfoModal, setRequestInfoModal] = useState(false);
    const [customNote, setCustomNote] = useState('');
    const [appNotes, setAppNotes] = useState([]);
    const [requestedDocType, setRequestedDocType] = useState('Latest 3 Months Salary Slips');

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadApplication = async () => {
            try {
                const data = await getApplicationById(id);
                setApiApp({
                    id: data.id || data.application_id,
                    borrowerId: String(data.borrowerId || data.borrower || '').slice(0, 8),
                    name: data.name || data.borrowerName || `Borrower ${String(data.borrower || '').slice(0, 6)}`,
                    occupation: data.occupation || data.loanType || data.loan_type,
                    location: data.location || 'N/A',
                    loanType: data.loanType || data.loan_type,
                    amount: new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                    }).format(Number(data.amount || data.requested_amount || 0)),
                    tenure: data.tenure || `${data.requested_tenure_months} Months`,
                    interestRate: data.interestRate || 'N/A',
                    status: data.status,
                    healthScore: data.aiScore || 0,
                    maxPotential: data.maxPotential || 850,
                    scoreChange: data.scoreChange || 'N/A',
                    paymentHistory: data.paymentHistory ? `${data.paymentHistory}%` : 'N/A',
                    creditUtilization: data.creditUtilization ? `${data.creditUtilization}%` : 'N/A',
                    accountAge: data.accountAge || 'N/A',
                    creditMix: data.creditMix || 'N/A',
                    riskLevel: data.riskLevel === 'high' ? 'High' : (data.riskLevel === 'medium' ? 'Medium' : 'Low'),
                    defaultProbability: data.defaultProbability || 'N/A',
                    probChange: data.probChange || 'N/A',
                    monthlyIncome: data.monthlyIncome || 'N/A',
                    debtToIncome: data.debtToIncome || 'N/A',
                    note: data.note || 'Application submitted for underwriter evaluation.',
                    activities: Array.isArray(data.activities) && data.activities.length ? data.activities.map(a => ({
                        text: a.title || a.text,
                        detail: a.description || a.detail,
                        time: a.date || a.time,
                        color: 'primary',
                    })) : [
                        { text: 'Application Submitted', detail: 'Form completed with verified documents.', time: '2026-08-28', color: 'green' }
                    ],
                    avatarUrl: data.avatarUrl || '',
                });
            } catch {
                // Keep fallback UI when API data is not available.
            }
        };

        loadApplication();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        setActionMessage('');
        try {
            await updateApplicationStatus(id, newStatus, `Status updated to ${newStatus} by underwriter.`);
            setApiApp(prev => prev ? { ...prev, status: newStatus } : prev);
            setActionMessage(`Application ${newStatus} successfully!`);
        } catch (err) {
            setActionMessage(`Failed to update status: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const getScoreRingColor = (score) => {
        if (score >= 750) return 'text-[var(--status-success)]';
        if (score >= 650) return 'text-[var(--status-warning)]';
        return 'text-[var(--status-error)]';
    };

    const getScoreRingOffset = (score) => {
        const maxCircum = 263.89;
        return maxCircum - (score / 850) * maxCircum;
    };

    return (
        <div className="bg-[var(--bg-canvas)] font-satoshi text-[var(--text-primary)] min-h-screen pb-32">
            {/* Floating Top Navigation Chrome */}
            <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 py-3.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors text-[var(--text-secondary)]"
                            title="Go Back"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                        </button>
                        <Logo to="/lender/dashboard" size="sm" subtitle="Underwriting Inspection" />
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                            App #{String(app.id || id).slice(0, 8)}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Header Hero Card */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--accent)]/30 shrink-0 bg-[var(--accent-tint)] flex items-center justify-center">
                                {app.avatarUrl ? (
                                    <img className="w-full h-full object-cover" alt={app.name} src={app.avatarUrl} />
                                ) : (
                                    <span className="text-[var(--accent)] font-clash text-2xl font-bold">
                                        {app.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                    <h1 className="font-clash text-2xl font-semibold text-[var(--text-primary)]">
                                        {app.name}
                                    </h1>
                                    <StatusBadge
                                        status={app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'under_review'}
                                        label={app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review'}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                                    Applicant ID: <span className="font-mono text-[var(--text-primary)]">{app.borrowerId || 'N/A'}</span> • {app.occupation}
                                </p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                    <span className="px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--status-success-bg)] text-[var(--status-success)] text-xs font-semibold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">verified</span> KYC Verified
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)] text-xs font-semibold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">description</span> {app.loanType} Facility
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Health Score Gauge Ring */}
                        <div className="flex items-center justify-center md:justify-end gap-6 md:border-l border-[var(--border-subtle)] md:pl-8">
                            <div className="relative flex items-center justify-center w-24 h-24">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        className="text-[var(--border-subtle)]"
                                        cx="48"
                                        cy="48"
                                        fill="transparent"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        className={`${getScoreRingColor(app.healthScore)} transition-all duration-700`}
                                        cx="48"
                                        cy="48"
                                        fill="transparent"
                                        r="40"
                                        stroke="currentColor"
                                        strokeDasharray="251.3"
                                        strokeDashoffset={251.3 - (251.3 * (app.healthScore / 850))}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="font-clash text-2xl font-bold tabular-nums text-[var(--text-primary)] leading-none">
                                        {app.healthScore}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-medium mt-0.5">
                                        Health Score
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                    Max Potential
                                </p>
                                <p className="font-clash text-xl font-bold tabular-nums text-[var(--text-primary)]">
                                    {app.maxPotential}
                                </p>
                                <p className="text-xs text-[var(--status-success)] font-medium mt-0.5 tabular-nums">
                                    {app.scoreChange}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs Navigation */}
                <div className="flex gap-3 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Score & Overview', icon: 'speed' },
                        { id: 'financials', label: 'Financial Data', icon: 'account_balance' },
                        { id: 'documents', label: 'Verified Documents', icon: 'folder' },
                        { id: 'history', label: 'Credit History', icon: 'history' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-[var(--radius-pill)] text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[var(--shadow-accent-glow)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                            }`}
                        >
                            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Split Content: Left Content + Right Underwriting Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Pane (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Score Breakdown */}
                                <Card className="p-6">
                                    <h3 className="font-clash font-semibold text-base text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-lg">insights</span>
                                        Credit Dimension Breakdown
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-[var(--text-secondary)]">Payment History</span>
                                                <span className="tabular-nums font-semibold text-[var(--text-primary)]">{app.paymentHistory}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--status-success)] rounded-full" style={{ width: `${parseFloat(app.paymentHistory) || 85}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-[var(--text-secondary)]">Credit Utilization</span>
                                                <span className="tabular-nums font-semibold text-[var(--text-primary)]">{app.creditUtilization}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${parseFloat(app.creditUtilization) || 30}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-[var(--text-secondary)]">Account Age</span>
                                                <span className="tabular-nums font-semibold text-[var(--text-primary)]">{app.accountAge}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--status-info)] rounded-full" style={{ width: '70%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-[var(--text-secondary)]">Credit Mix</span>
                                                <span className="tabular-nums font-semibold text-[var(--text-primary)]">{app.creditMix}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--status-success)] rounded-full" style={{ width: '80%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Activity Timeline */}
                                <Card className="p-6">
                                    <h3 className="font-clash font-semibold text-base text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-lg">history</span>
                                        Verification Milestone Audit
                                    </h3>
                                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[var(--border-subtle)]">
                                        {app.activities.map((activity, i) => (
                                            <div key={i} className="flex gap-3 relative">
                                                <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] flex items-center justify-center shrink-0 z-10 text-xs font-bold">
                                                    ✓
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{activity.text}</p>
                                                    <p className="text-[11px] text-[var(--text-secondary)]">{activity.detail}</p>
                                                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{activity.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'financials' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <Card className="p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Monthly Inflow</p>
                                    <h4 className="font-clash text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{app.monthlyIncome}</h4>
                                    <p className="text-xs text-[var(--status-success)] mt-2 flex items-center gap-1 font-medium">
                                        <span className="material-symbols-outlined text-sm">trending_up</span> Consistent salary credit
                                    </p>
                                </Card>
                                <Card className="p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Debt-to-Income (DTI)</p>
                                    <h4 className="font-clash text-2xl font-bold text-[var(--accent)] mt-1 tabular-nums">{app.debtToIncome}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">Below maximum 45% threshold</p>
                                </Card>
                                <Card className="p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Default Probability</p>
                                    <h4 className="font-clash text-2xl font-bold text-[var(--status-success)] mt-1 tabular-nums">{app.defaultProbability}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">FinPulse Deep Forest Model</p>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <Card className="p-6 space-y-4">
                                <h4 className="font-clash font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[var(--accent)]">folder</span>
                                    Verified Underwriting Documents
                                </h4>
                                <div className="divide-y divide-[var(--border-subtle)]">
                                    <div className="py-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[var(--status-success)]">description</span>
                                            <div>
                                                <p className="text-xs font-semibold text-[var(--text-primary)]">Bank Statement (6 Months)</p>
                                                <p className="text-[11px] text-[var(--text-secondary)]">Parsed & verified via FinPulse OCR</p>
                                            </div>
                                        </div>
                                        <StatusBadge status="verified" label="Verified" />
                                    </div>
                                    <div className="py-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[var(--status-success)]">badge</span>
                                            <div>
                                                <p className="text-xs font-semibold text-[var(--text-primary)]">PAN Card Verification</p>
                                                <p className="text-[11px] text-[var(--text-secondary)]">NSDL / UIDAI Database Match</p>
                                            </div>
                                        </div>
                                        <StatusBadge status="verified" label="Verified" />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'history' && (
                            <Card className="p-6">
                                <h4 className="font-clash font-semibold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[var(--accent)]">history_toggle_off</span>
                                    Past Credit Facilities
                                </h4>
                                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-primary)]">Prior Vehicle Loan</p>
                                        <p className="text-[11px] text-[var(--text-secondary)]">Settled on 12 Jan 2024 • 0 Overdue Defaults</p>
                                    </div>
                                    <StatusBadge status="approved" label="Settled" />
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Pane (4 cols): Inverse Underwriter Detail Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Risk Overview Card */}
                        <ContrastCard className="p-6">
                            <span className="text-xs font-medium uppercase tracking-wider opacity-75">
                                Risk & Underwriter Assessment
                            </span>
                            <div className="mt-4 space-y-3">
                                <div className="p-3.5 rounded-[var(--radius-md)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-medium opacity-75">Risk Classification</p>
                                        <p className="font-clash text-lg font-bold">{app.riskLevel} Risk</p>
                                    </div>
                                    <span className="material-symbols-outlined text-2xl">
                                        {app.riskLevel === 'Low' ? 'shield' : 'warning'}
                                    </span>
                                </div>
                                <div className="p-3.5 rounded-[var(--radius-md)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-medium opacity-75">Default Probability</p>
                                        <p className="font-clash text-lg font-bold tabular-nums">{app.defaultProbability}</p>
                                    </div>
                                    <span className="text-xs font-bold tabular-nums opacity-80">{app.probChange}</span>
                                </div>
                                <div className="p-3.5 rounded-[var(--radius-md)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-medium opacity-75">Monthly Inflow</p>
                                        <p className="font-clash text-lg font-bold tabular-nums">{app.monthlyIncome}</p>
                                    </div>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">Verified</span>
                                </div>
                            </div>
                        </ContrastCard>

                        {/* Underwriter Notes */}
                        <Card className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-clash text-sm font-semibold text-[var(--text-primary)]">
                                    Underwriter Observations
                                </h3>
                                <button
                                    onClick={() => setNoteModal(true)}
                                    className="text-xs text-[var(--accent)] font-semibold hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span> Add
                                </button>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed bg-[var(--bg-canvas)] p-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
                                "{app.note}"
                            </p>
                            {appNotes.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {appNotes.map((n, i) => (
                                        <div key={i} className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs">
                                            <p className="font-medium text-[var(--text-primary)]">{n.text}</p>
                                            <span className="text-[10px] text-[var(--text-muted)] font-mono">{n.timestamp}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Action Bar with Glass Chrome */}
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] py-4 px-6 z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto">
                        <div>
                            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">Requested Facility</p>
                            <p className="font-clash text-lg md:text-xl font-bold tabular-nums text-[var(--text-primary)]">{app.amount}</p>
                        </div>
                        <div className="border-l border-[var(--border-subtle)] pl-6">
                            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">Tenure</p>
                            <p className="font-clash text-lg md:text-xl font-bold text-[var(--text-primary)]">{app.tenure}</p>
                        </div>
                        <div className="border-l border-[var(--border-subtle)] pl-6">
                            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">Interest Rate</p>
                            <p className="font-clash text-lg md:text-xl font-bold text-[var(--accent)]">{app.interestRate}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {actionMessage && (
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)]">
                                {actionMessage}
                            </span>
                        )}
                        <button
                            onClick={() => handleStatusUpdate('rejected')}
                            disabled={isUpdating}
                            className="px-5 py-2.5 rounded-[var(--radius-pill)] border border-[var(--status-error)] text-[var(--status-error)] hover:bg-[var(--status-error-bg)] text-xs font-semibold transition-all disabled:opacity-50"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => setRequestInfoModal(true)}
                            className="px-5 py-2.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all hidden sm:block"
                        >
                            Request Info
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('approved')}
                            disabled={isUpdating}
                            className="px-6 py-2.5 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold transition-all shadow-[var(--shadow-accent-glow)] hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                            Approve Facility
                        </button>
                    </div>
                </div>
            </div>

            {/* Note Addition Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-clash text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--accent)]">edit_note</span> Add Underwriting Note
                            </h3>
                            <button onClick={() => setNoteModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
                        </div>
                        <textarea
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="Type evaluation notes or observations regarding borrower income stability..."
                            className="w-full h-28 p-3 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setNoteModal(false)}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (customNote.trim()) {
                                        setAppNotes(prev => [...prev, { text: customNote.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                                        setCustomNote('');
                                        setNoteModal(false);
                                        setActionMessage('Underwriter note recorded.');
                                        setTimeout(() => setActionMessage(''), 3000);
                                    }
                                }}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)]"
                            >
                                Save Note
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Request Info Modal */}
            {requestInfoModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-clash text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--accent)]">contact_support</span> Request Additional Information
                            </h3>
                            <button onClick={() => setRequestInfoModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Send an automated request notice to the applicant's dashboard asking for missing records.
                        </p>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                Required Document / Record
                            </label>
                            <CustomSelect
                                value={requestedDocType}
                                onChange={(e) => setRequestedDocType(e.target.value)}
                                options={[
                                    'Latest 3 Months Salary Slips',
                                    'ITR-V Acknowledgement Form',
                                    'GST-3B Returns (Latest Quarter)',
                                    'Proof of Current Business Address',
                                    'Explanation of Recent Credit Enquiries'
                                ]}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setRequestInfoModal(false)}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setRequestInfoModal(false);
                                    setActionMessage(`Notice sent: Requesting ${requestedDocType}`);
                                    setTimeout(() => setActionMessage(''), 4000);
                                }}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)]"
                            >
                                Send Request Notice
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetail;
