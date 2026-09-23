import React from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listApplications } from '../lib/api';
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

const formatDate = (isoDate) => {
    if (!isoDate) {
        return 'N/A';
    }
    return new Date(isoDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const statusToBadgeStatus = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'approved') return 'approved';
    if (s === 'rejected') return 'rejected';
    if (s === 'verified') return 'verified';
    return 'under_review';
};

const statusToLabel = (status) => {
    const map = {
        new: 'New',
        under_review: 'Under Review',
        verified: 'Verified',
        approved: 'Approved',
        rejected: 'Rejected',
    };
    return map[status] || 'Under Review';
};

const LoanApplications = () => {
    const [applications, setApplications] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedStatus, setSelectedStatus] = React.useState('All');
    const [selectedType, setSelectedType] = React.useState('All Types');

    React.useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await listApplications();
                const appList = Array.isArray(data) ? data : (data?.results || []);
                const normalized = appList.map((item) => ({
                    id: item.id || item.application_id,
                    name: item.borrowerName || item.name || 'Borrower',
                    occupation: item.occupation || item.loanType || item.loan_type || 'General',
                    loanType: item.loanType || item.loan_type || 'Personal Loan',
                    amountNum: Number(item.amount || item.requested_amount || 0),
                    amount: formatMoney(item.amount || item.requested_amount),
                    aiScore: item.aiScore ?? item.ai_score ?? 0,
                    appliedDate: formatDate(item.appliedDate || item.created_at),
                    statusRaw: item.status,
                    status: statusToLabel(item.status),
                    avatarUrl: item.avatarUrl || null,
                }));
                setApplications(normalized);
            } catch (err) {
                setError(err.message || 'Unable to load applications.');
            } finally {
                setIsLoading(false);
            }
        };

        loadApplications();
    }, []);

    const filteredApplications = applications.filter((app) => {
        if (selectedStatus !== 'All' && app.status !== selectedStatus) return false;
        if (selectedType !== 'All Types' && !app.loanType.toLowerCase().includes(selectedType.toLowerCase())) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesName = app.name.toLowerCase().includes(q);
            const matchesId = String(app.id).toLowerCase().includes(q);
            if (!matchesName && !matchesId) return false;
        }
        return true;
    });

    const pendingCount = applications.filter(a => a.status === 'Under Review' || a.status === 'New').length;
    const avgScore = applications.length
        ? Math.round(applications.reduce((sum, a) => sum + (a.aiScore || 700), 0) / applications.length)
        : null;

    return (
        <LenderLayout activeSection="applications">
            <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
                            Origination Pipeline
                        </span>
                        <h1 className="font-clash text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-1">
                            Loan Applications
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Manage and underwrite incoming credit applications across all institutional facilities
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <ContrastCard className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-75">
                            Underwriting Pipeline
                        </span>
                        <div className="mt-3">
                            <div className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                                {pendingCount}
                            </div>
                            <p className="text-xs opacity-75 mt-1 font-medium flex items-center gap-1">
                                {pendingCount > 0 ? 'Awaiting underwriter decision' : 'All applications addressed'}
                            </p>
                        </div>
                    </ContrastCard>

                    <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                            Average Applicant Score
                        </span>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-2">
                                <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                                    {avgScore !== null ? avgScore : 'N/A'}
                                </span>
                                {avgScore !== null && (
                                    <span className="text-xs text-[var(--text-muted)] font-medium">/ 850</span>
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Calculated via live AI scoring model</p>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                            Processing Velocity
                        </span>
                        <div className="mt-3">
                            <div className="font-clash text-3xl font-semibold tracking-tight text-[var(--status-success)]">
                                Real-Time AI
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Instant document verification & OCR</p>
                        </div>
                    </Card>
                </div>

                {/* Search & Filter Bar */}
                <Card className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">
                                search
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                                placeholder="Search applicants by name or ID..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] px-3 py-2 rounded-[var(--radius-md)]">
                                <span className="text-xs font-medium text-[var(--text-secondary)]">Status:</span>
                                <select
                                    className="bg-transparent border-none text-xs font-semibold focus:outline-none text-[var(--text-primary)] cursor-pointer"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="All" className="bg-[var(--bg-surface)]">All</option>
                                    <option value="New" className="bg-[var(--bg-surface)]">New</option>
                                    <option value="Under Review" className="bg-[var(--bg-surface)]">Under Review</option>
                                    <option value="Verified" className="bg-[var(--bg-surface)]">Verified</option>
                                    <option value="Approved" className="bg-[var(--bg-surface)]">Approved</option>
                                    <option value="Rejected" className="bg-[var(--bg-surface)]">Rejected</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] px-3 py-2 rounded-[var(--radius-md)]">
                                <span className="text-xs font-medium text-[var(--text-secondary)]">Type:</span>
                                <select
                                    className="bg-transparent border-none text-xs font-semibold focus:outline-none text-[var(--text-primary)] cursor-pointer"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="All Types" className="bg-[var(--bg-surface)]">All Types</option>
                                    <option value="Personal" className="bg-[var(--bg-surface)]">Personal</option>
                                    <option value="Business" className="bg-[var(--bg-surface)]">Business</option>
                                    <option value="Home" className="bg-[var(--bg-surface)]">Home</option>
                                    <option value="Vehicle" className="bg-[var(--bg-surface)]">Vehicle</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Applications Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto min-h-[360px]">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40 text-[var(--text-secondary)] text-xs font-semibold tracking-wider">
                                    <th className="px-6 py-3.5">Applicant Name</th>
                                    <th className="px-6 py-3.5">Application ID</th>
                                    <th className="px-6 py-3.5">Loan Type</th>
                                    <th className="px-6 py-3.5 text-right">Requested</th>
                                    <th className="px-6 py-3.5">AI Score</th>
                                    <th className="px-6 py-3.5">Applied Date</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                                {isLoading && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-xs text-[var(--text-muted)]">
                                            Loading applications...
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && error && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-xs text-[var(--status-error)]">
                                            {error}
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && !error && filteredApplications.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-xs text-[var(--text-muted)]">
                                            No applications match your filter criteria.
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && !error && filteredApplications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="h-14 hover:bg-[var(--bg-surface-hover)] transition-colors"
                                    >
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                                                    {app.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-xs text-[var(--text-primary)]">{app.name}</p>
                                                    <p className="text-[11px] text-[var(--text-secondary)]">{app.occupation}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                                            #{String(app.id).slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-3.5 text-xs text-[var(--text-primary)]">
                                            {app.loanType}
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                                            {app.amount}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    app.aiScore >= 750
                                                        ? 'bg-[var(--status-success)]'
                                                        : app.aiScore >= 650
                                                        ? 'bg-[var(--status-warning)]'
                                                        : 'bg-[var(--status-error)]'
                                                }`} />
                                                <span className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                                                    {app.aiScore}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)]">
                                            {app.appliedDate}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <StatusBadge
                                                status={statusToBadgeStatus(app.statusRaw)}
                                                label={app.status}
                                            />
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <Link
                                                to={`/lender/applications/${app.id}`}
                                                className="px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                                            >
                                                Review
                                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        <p className="text-xs text-[var(--text-secondary)]">
                            Showing {filteredApplications.length} of {applications.length} applications
                        </p>
                    </div>
                </Card>
            </div>
        </LenderLayout>
    );
};

export default LoanApplications;
