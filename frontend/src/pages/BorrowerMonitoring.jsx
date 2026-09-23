import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Logo from '../components/ui/Logo';
import { mockBorrowers } from '../data/mockData';
import { getBorrowerById } from '../lib/api';

const BorrowerMonitoring = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const borrowerIndex = parseInt(id, 10) - 1;
    const [apiBorrower, setApiBorrower] = useState(null);
    const borrower = apiBorrower || mockBorrowers[Number.isNaN(borrowerIndex) ? 0 : borrowerIndex] || mockBorrowers[0];

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadBorrower = async () => {
            try {
                const data = await getBorrowerById(id);
                setApiBorrower({
                    id: data.id || data.borrower_id,
                    name: data.name || 'Borrower',
                    location: data.location || 'N/A',
                    productType: data.productType || data.occupation || 'General',
                    principal: data.principal,
                    outstanding: data.outstanding,
                    totalOutstanding: data.totalOutstanding || data.outstanding,
                    nextEmiDate: data.nextEmiDate || data.nextEmi || 'TBD',
                    interestRate: data.interestRate || 'N/A',
                    status: data.status || 'On Track',
                    healthScore: data.healthScore || 0,
                    healthLabel: data.healthLabel || 'New Profile',
                    riskLevel: data.riskLevel || 'low',
                    riskColor: data.riskColor || 'green',
                    riskNote: data.riskNote || 'Profile Active',
                    avatarUrl: data.avatarUrl || '',
                    repaymentPercent: data.repaymentPercent || 0,
                    totalPaid: data.totalPaid || 0,
                    remaining: data.remaining || 0,
                    emiAmount: data.emiAmount || 0,
                    cashFlow: Array.isArray(data.cashFlow) ? data.cashFlow.map(cf => ({
                        month: cf.month,
                        incomeH: Math.min(100, Math.round((cf.income / 120000) * 100)),
                        expenseH: Math.min(100, Math.round((cf.expenses / 120000) * 100)),
                    })) : [],
                    timeline: data.timeline || [],
                    alertText: data.alertText || 'Account active with low volatility.',
                    memberSince: data.memberSince || '2026',
                    policyNumber: data.policyNumber || 'None',
                    insuranceExpiry: data.insuranceExpiry || 'N/A',
                });
            } catch {
                // Keep fallback UI when API data is not available.
            }
        };

        loadBorrower();
    }, [id]);

    const [activeTab, setActiveTab] = useState('overview');
    const [actionMsg, setActionMsg] = useState('');
    const [reminderModal, setReminderModal] = useState(false);
    const [limitModal, setLimitModal] = useState(false);
    const [recoveryModal, setRecoveryModal] = useState(false);
    const [forecloseModal, setForecloseModal] = useState(false);
    const [creditLimit, setCreditLimit] = useState(500000);

    const showActionToast = (msg) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(''), 3500);
    };

    const handleDownloadSummary = () => {
        const content = `FINPULSE BORROWER MONITORING DOSSIER\n` +
            `====================================\n` +
            `Borrower Name: ${borrower.name}\n` +
            `Location: ${borrower.location}\n` +
            `Facility Type: ${borrower.productType}\n` +
            `Principal: ${borrower.principal}\n` +
            `Outstanding: ${borrower.outstanding}\n` +
            `Health Score: ${borrower.healthScore}/850 (${borrower.healthLabel})\n` +
            `Risk Level: ${borrower.riskLevel}\n` +
            `Generated On: ${new Date().toLocaleString()}\n`;

        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Dossier_${borrower.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showActionToast('Dossier downloaded successfully.');
    };

    return (
        <div className="bg-[var(--bg-canvas)] font-satoshi text-[var(--text-primary)] min-h-screen pb-32">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 py-3.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors text-[var(--text-secondary)]"
                            title="Go Back"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                        </button>
                        <Logo to="/lender/dashboard" size="sm" subtitle="Borrower Surveillance" />
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                            Borrower #{String(borrower.id).slice(0, 8)}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Borrower Header Card */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex gap-5 items-center flex-col sm:flex-row text-center sm:text-left">
                            <div className="h-20 w-20 rounded-full border-2 border-[var(--accent)]/30 shrink-0 bg-[var(--accent-tint)] flex items-center justify-center">
                                {borrower.avatarUrl ? (
                                    <img className="w-full h-full object-cover rounded-full" alt={borrower.name} src={borrower.avatarUrl} />
                                ) : (
                                    <span className="text-[var(--accent)] font-clash text-2xl font-bold">
                                        {borrower.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col items-center sm:items-start">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                    <h1 className="font-clash text-2xl font-semibold text-[var(--text-primary)]">{borrower.name}</h1>
                                    <StatusBadge
                                        status={borrower.status === 'On Track' ? 'approved' : 'rejected'}
                                        label={borrower.status}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                                    Borrower ID: <span className="font-mono text-[var(--text-primary)]">{borrower.id}</span> • Member since {borrower.memberSince}
                                </p>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)] text-xs font-semibold">
                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                        <span>Health Score: <strong className="tabular-nums font-bold">{borrower.healthScore}</strong> ({borrower.healthLabel})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-medium">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        <span>{borrower.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                            <button
                                onClick={handleDownloadSummary}
                                className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--border-strong)] transition-all flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export Dossier
                            </button>
                            <button
                                onClick={() => setReminderModal(true)}
                                className="px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold transition-all shadow-[var(--shadow-accent-glow)] hover:opacity-90 flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-sm">notifications</span>
                                Send Notice
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Main Grid: Left Sidebar (4 cols) + Right Content Area (8 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar: Loan Details & Risk */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Active Loan Summary Contrast Card */}
                        <ContrastCard className="p-6">
                            <span className="text-xs font-medium uppercase tracking-wider opacity-75">
                                Facility Snapshot
                            </span>
                            <div className="mt-4 space-y-3.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-75">Total Outstanding</span>
                                    <span className="font-clash text-lg font-bold tabular-nums">{borrower.totalOutstanding}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-75">Next EMI Due</span>
                                    <span className="font-semibold">{borrower.nextEmiDate}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-75">Interest Rate</span>
                                    <span className="font-bold">{borrower.interestRate}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-75">Loan Type</span>
                                    <span className="font-semibold">{borrower.productType}</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">Risk Classification</span>
                                    <span className="text-xs font-bold capitalize">{borrower.riskLevel} Risk</span>
                                </div>
                                <p className="text-xs opacity-75 leading-relaxed">{borrower.riskNote}</p>
                            </div>
                        </ContrastCard>

                        {/* Recent Alerts Card */}
                        <Card className="p-5">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-clash text-sm font-semibold text-[var(--text-primary)]">Surveillance Alert</h3>
                                <span className="text-[10px] text-[var(--text-muted)] font-medium">Last 30 days</span>
                            </div>
                            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                                <span className="material-symbols-outlined text-[var(--status-warning)] text-base mt-0.5">warning</span>
                                <div>
                                    <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">{borrower.alertText}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">Live AI Alert Engine</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Repayment Progress Card */}
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-clash font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[var(--accent)] text-lg">track_changes</span>
                                    Repayment Amortization
                                </h3>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)] tabular-nums">
                                    {borrower.repaymentPercent}% Paid
                                </span>
                            </div>
                            <div className="w-full bg-[var(--border-subtle)] rounded-full h-2.5 mb-4 overflow-hidden">
                                <div
                                    className="bg-[var(--accent)] h-full rounded-full transition-all duration-700"
                                    style={{ width: `${borrower.repaymentPercent}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                                <span>Total Paid: <strong className="tabular-nums text-[var(--text-primary)] font-semibold">{borrower.totalPaid}</strong></span>
                                <span>Remaining: <strong className="tabular-nums text-[var(--text-primary)] font-semibold">{borrower.remaining}</strong></span>
                            </div>
                        </Card>

                        {/* Cash Flow Stability Chart */}
                        <Card className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                                <div>
                                    <h3 className="font-clash font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-lg">analytics</span>
                                        Monthly Cash Flow Stability
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Verified bank inflow vs debit expenses</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)]"></span>
                                        <span className="text-[var(--text-secondary)]">Income</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-[var(--border-strong)]"></span>
                                        <span className="text-[var(--text-secondary)]">Expenses</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-48 w-full flex items-end justify-between gap-2 px-2 pb-2 border-b border-[var(--border-subtle)]">
                                {borrower.cashFlow.map((cf, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end items-center h-full">
                                        <div className="w-full max-w-[36px] flex items-end gap-1 h-full">
                                            <div
                                                className="w-1/2 bg-[var(--border-strong)] rounded-t-sm transition-all"
                                                style={{ height: `${cf.expenseH}%` }}
                                                title={`Expense: ${cf.expenseH}%`}
                                            />
                                            <div
                                                className="w-1/2 bg-[var(--accent)] rounded-t-sm transition-all"
                                                style={{ height: `${cf.incomeH}%` }}
                                                title={`Income: ${cf.incomeH}%`}
                                            />
                                        </div>
                                        <p className="text-[10px] text-center font-semibold text-[var(--text-secondary)] mt-2 uppercase">
                                            {cf.month}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Repayment Timeline */}
                        <Card className="overflow-hidden">
                            <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40 flex justify-between items-center">
                                <h3 className="font-clash font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[var(--accent)] text-lg">history</span>
                                    Repayment History & Schedule
                                </h3>
                            </div>
                            <div className="divide-y divide-[var(--border-subtle)]">
                                {borrower.timeline.map((t, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-[var(--bg-surface-hover)] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-[var(--text-primary)]">EMI - {t.month}</p>
                                                <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                                                    <span>{t.date}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">Ref: {t.ref}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{t.amount}</p>
                                            <StatusBadge status="approved" label={t.status} />
                                        </div>
                                    </div>
                                ))}

                                {/* Upcoming EMI */}
                                <div className="p-4 flex items-center justify-between bg-[var(--accent-tint)]/20 border-l-4 border-l-[var(--accent)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-[var(--text-primary)]">
                                                Upcoming EMI Due
                                            </p>
                                            <p className="text-[11px] text-[var(--accent)] font-medium">
                                                Scheduled for {borrower.nextEmiDate} (NACH Auto-Debit)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-[var(--text-primary)] tabular-nums">{borrower.emiAmount}</p>
                                        <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">Scheduled</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Action Toast */}
            {actionMsg && (
                <div className="fixed top-20 right-8 z-50 p-4 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold flex items-center gap-2 shadow-2xl animate-fade-in">
                    <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
                    <span>{actionMsg}</span>
                </div>
            )}

            {/* Sticky Bottom Action Bar with Glass Chrome */}
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] px-6 py-4 z-40">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="material-symbols-outlined text-base text-[var(--accent)]">info</span>
                        <span>Next formal review scheduled in 12 days. {borrower.healthLabel} profile.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setReminderModal(true)}
                            className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">notifications_active</span>
                            Send Reminder
                        </button>
                        <button
                            onClick={() => setLimitModal(true)}
                            className="px-4 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">tune</span>
                            Adjust Limit
                        </button>
                        <button
                            onClick={() => setRecoveryModal(true)}
                            className="px-5 py-2 rounded-[var(--radius-pill)] border border-[var(--status-error)] text-[var(--status-error)] hover:bg-[var(--status-error-bg)] text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">gavel</span>
                            Initiate Recovery
                        </button>
                    </div>
                </div>
            </div>

            {/* Reminder Modal */}
            {reminderModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-clash text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--accent)]">notifications_active</span> Send Borrower Notice
                            </h3>
                            <button onClick={() => setReminderModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Dispatch an automated payment reminder to <strong>{borrower.name}</strong> for upcoming EMI ({borrower.emiAmount}) due on {borrower.nextEmiDate}.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setReminderModal(false)} className="flex-1 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">Cancel</button>
                            <button
                                onClick={() => {
                                    setReminderModal(false);
                                    showActionToast(`Payment reminder dispatched to ${borrower.name}.`);
                                }}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)]"
                            >
                                Dispatch Notice
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Limit Adjustment Modal */}
            {limitModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-clash text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--accent)]">tune</span> Modify Exposure Limit
                            </h3>
                            <button onClick={() => setLimitModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)] mb-2">
                                <span>Sanctioned Credit Limit</span>
                                <span className="font-clash font-bold tabular-nums text-[var(--accent)]">₹{creditLimit.toLocaleString('en-IN')}</span>
                            </div>
                            <input
                                type="range"
                                min="100000"
                                max="2000000"
                                step="50000"
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(Number(e.target.value))}
                                className="w-full accent-[var(--accent)]"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setLimitModal(false)} className="flex-1 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">Cancel</button>
                            <button
                                onClick={() => {
                                    setLimitModal(false);
                                    showActionToast(`Credit limit adjusted to ₹${creditLimit.toLocaleString('en-IN')}.`);
                                }}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)]"
                            >
                                Confirm Adjustment
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Recovery Modal */}
            {recoveryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center gap-2.5 text-[var(--status-error)]">
                            <span className="material-symbols-outlined text-2xl">gavel</span>
                            <h3 className="font-clash font-semibold text-base text-[var(--text-primary)]">Legal Recovery Escalation</h3>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Initiate formal loan default escalation and issue formal legal recovery proceedings for outstanding amount {borrower.totalOutstanding}.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setRecoveryModal(false)} className="flex-1 py-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">Cancel</button>
                            <button
                                onClick={() => {
                                    setRecoveryModal(false);
                                    showActionToast(`Recovery notice initiated against facility #${borrower.id}.`);
                                }}
                                className="flex-1 py-2 rounded-[var(--radius-pill)] bg-[var(--status-error)] text-white text-xs font-semibold hover:opacity-90"
                            >
                                Proceed with Notice
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default BorrowerMonitoring;
