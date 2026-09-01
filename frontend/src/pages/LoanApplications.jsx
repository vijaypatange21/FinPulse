import React from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listApplications } from '../lib/api';

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

    React.useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await listApplications();
                const appList = Array.isArray(data) ? data : (data?.results || []);
                const normalized = appList.map((item) => ({
                    id: item.id || item.application_id,
                    name: item.borrowerName || item.name || 'Borrower',
                    occupation: item.occupation || item.loanType || item.loan_type || 'General',
                    loanType: item.loanType || item.loan_type,
                    amount: formatMoney(item.amount || item.requested_amount),
                    aiScore: item.aiScore ?? item.ai_score ?? 0,
                    appliedDate: formatDate(item.appliedDate || item.created_at),
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

    const getScoreStyle = (score) => {
        if (score >= 750) return { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800/30', dot: 'bg-green-600' };
        if (score >= 650) return { text: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800/30', dot: 'bg-yellow-600' };
        return { text: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800/30', dot: 'bg-red-600' };
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'fiber_new' };
            case 'Under Review': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: 'pending_actions' };
            case 'Verified': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: 'check_circle' };
            case 'Decision Pending': return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', icon: 'more_horiz' };
            default: return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', icon: 'help' };
        }
    };

    return (
        <LenderLayout activeSection="applications">
            <div className="p-8 max-w-7xl mx-auto w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Loan Applications</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and review incoming loan requests from all channels</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-symbols-outlined text-xl">download</span>
                                Export Report
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30">
                                <span className="material-symbols-outlined text-xl">add</span>
                                Manual Entry
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Pending</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold">{applications.filter(a => a.status === 'Under Review' || a.status === 'New').length}</h3>
                                {applications.filter(a => a.status === 'Under Review' || a.status === 'New').length > 0 && (
                                    <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900/30 dark:text-yellow-500">Action Required</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Average Health Score</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold">
                                    {applications.length ? Math.round(applications.reduce((sum, a) => sum + (a.aiScore || 700), 0) / applications.length) : 'N/A'}
                                </h3>
                                {applications.length > 0 && (
                                    <span className="text-xs font-semibold text-slate-400">Out of 850</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Avg. Underwriting Time</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold">{applications.length ? 'Instant' : 'N/A'}</h3>
                                {applications.length > 0 && (
                                    <div className="flex text-emerald-600 dark:text-emerald-400 items-center text-xs font-medium">
                                        <span className="material-symbols-outlined text-base mr-0.5">bolt</span>
                                        Real-time AI
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2.5 bg-[#f6f6f8] dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-slate-500" placeholder="Search applicants by name or ID..." type="text" />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 bg-[#f6f6f8] dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-lg">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Status:</span>
                                    <select className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 pr-8 outline-none dark:text-white cursor-pointer hover:text-primary transition-colors">
                                        <option className="dark:bg-slate-900">All</option>
                                        <option className="dark:bg-slate-900">New</option>
                                        <option className="dark:bg-slate-900">Under Review</option>
                                        <option className="dark:bg-slate-900">Verified</option>
                                        <option className="dark:bg-slate-900">Decision Pending</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 bg-[#f6f6f8] dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-lg">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Type:</span>
                                    <select className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 pr-8 outline-none dark:text-white cursor-pointer hover:text-primary transition-colors">
                                        <option className="dark:bg-slate-900">All Types</option>
                                        <option className="dark:bg-slate-900">Personal</option>
                                        <option className="dark:bg-slate-900">Business</option>
                                        <option className="dark:bg-slate-900">Home</option>
                                        <option className="dark:bg-slate-900">Vehicle</option>
                                        <option className="dark:bg-slate-900">Agriculture</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                        <th className="p-4 w-10"><input className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer" type="checkbox" /></th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Name</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Application ID</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Type</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Amount</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="9" className="p-6 text-center text-slate-400">Loading applications...</td>
                                        </tr>
                                    )}
                                    {!isLoading && error && (
                                        <tr>
                                            <td colSpan="9" className="p-6 text-center text-red-500">{error}</td>
                                        </tr>
                                    )}
                                    {!isLoading && !error && applications.map((app) => {
                                        const scoreStyle = getScoreStyle(app.aiScore);
                                        const statusStyle = getStatusStyle(app.status);
                                        return (
                                            <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                                <td className="p-4" onClick={(e) => e.stopPropagation()}><input className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer" type="checkbox" /></td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-primary/5 overflow-hidden shrink-0">
                                                            {app.avatarUrl ? (
                                                                <img className="w-full h-full object-cover" alt={app.name} src={app.avatarUrl} />
                                                            ) : (
                                                                <span className="text-primary text-xs font-bold">{app.name.split(' ').map(n => n[0]).join('')}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</p>
                                                            <p className="text-xs text-slate-500">{app.occupation}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400">#{String(app.id).slice(0, 8)}</td>
                                                <td className="p-4 text-sm font-medium">{app.loanType}</td>
                                                <td className="p-4 text-sm font-bold text-slate-700 dark:text-slate-300">{app.amount}</td>
                                                <td className="p-4">
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full ${scoreStyle.bg} ${scoreStyle.text} text-xs font-bold border ${scoreStyle.border}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${scoreStyle.dot} mr-1.5`}></span>
                                                        {app.aiScore}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-500">{app.appliedDate}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-lg ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold flex items-center w-fit gap-1`}>
                                                        <span className="material-symbols-outlined text-[14px]">{statusStyle.icon}</span>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link to={`/lender/applications/${app.id}`} className={`inline-flex items-center justify-center px-4 py-2 ${app.status === 'Verified' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-blue-700'} text-white text-xs font-bold rounded-lg hover:shadow-md transition-all shadow-sm cursor-pointer`}>
                                                        {app.status === 'Verified' ? 'Process' : 'Review'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <p className="text-sm text-slate-500 font-medium">Showing {applications.length} of {applications.length} results</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 disabled:opacity-50 cursor-not-allowed" disabled>
                                    <span className="material-symbols-outlined text-sm m-0 leading-none">chevron_left</span>
                                </button>
                                <button className="w-8 h-8 bg-primary text-white rounded-lg text-sm font-bold shadow-sm shadow-primary/30">1</button>
                                <button className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 disabled:opacity-50 cursor-not-allowed" disabled>
                                    <span className="material-symbols-outlined text-sm m-0 leading-none">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        </LenderLayout>
    );
};

export default LoanApplications;
