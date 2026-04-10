import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { mockBorrowers } from '../data/mockData';

const MyBorrowers = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'On Track':
                return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
            case 'Overdue':
                return 'text-rose-600 bg-rose-100 dark:bg-rose-900/30';
            case 'Grace Period':
                return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
            default:
                return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case 'On Track': return 'bg-emerald-600';
            case 'Overdue': return 'bg-rose-600';
            case 'Grace Period': return 'bg-amber-600';
            default: return 'bg-slate-600';
        }
    };

    const getRiskBarColor = (score) => {
        if (score >= 750) return 'bg-emerald-500';
        if (score >= 600) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const getRiskTextColor = (score) => {
        if (score >= 750) return 'text-emerald-500';
        if (score >= 600) return 'text-amber-500';
        return 'text-rose-500';
    };

    const filteredBorrowers = mockBorrowers.filter((b) => {
        const q = searchQuery.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    });

    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">FinPulse</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Lender Dashboard</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/lender/dashboard">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" to="/lender/borrowers">
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm font-medium">Borrowers</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/lender/applications">
                        <span className="material-symbols-outlined">description</span>
                        <span className="text-sm font-medium">Applications</span>
                    </Link>
                    <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" href="#">
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="text-sm font-medium">Repayments</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" href="#">
                        <span className="material-symbols-outlined">monitoring</span>
                        <span className="text-sm font-medium">Risk Analytics</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-xl font-bold">My Borrowers</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="pl-10 pr-4 py-2 bg-[#f6f6f8] dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50" placeholder="Global search..." type="text" />
                        </div>
                        <ThemeToggle />
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f6f6f8] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10">
                            <img className="w-full h-full object-cover" alt="User avatar profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgwAEDfyN2VMygbP9yDuZ3Y7DbmHMafkxhLDYv7-8Fnl0LvMdJ38OezT8PE6T5qcUkcZKcyfd89SWRQ6tasa_JsexNYCunfXIBhFZ0tQhwll_t2e7I1o-ezReVXvUwLJFbVEG9nSMxanrb20gpV2MnWzvoHaN4DJY67Jtisdp7UppwcDlM6jIVsRYVJRHbx981reU1KuIvZ6OavK9oizVzDPH3YD13axPHaYHtmT6I6ISPPeenIR8ztGMdbB83tlMe_3pLjsmqxwI" />
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Borrowers</p>
                            <div className="flex items-end justify-between mt-2">
                                <h3 className="text-2xl font-bold">{mockBorrowers.length}</h3>
                                <span className="text-emerald-500 text-sm font-semibold flex items-center">+5.2% <span className="material-symbols-outlined text-xs">arrow_upward</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Disbursed</p>
                            <div className="flex items-end justify-between mt-2">
                                <h3 className="text-2xl font-bold">₹45.2 Cr</h3>
                                <span className="text-emerald-500 text-sm font-semibold flex items-center">+12.4% <span className="material-symbols-outlined text-xs">arrow_upward</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Portfolio Health</p>
                            <div className="flex items-end justify-between mt-2">
                                <h3 className="text-2xl font-bold">94.2%</h3>
                                <span className="text-emerald-500 text-sm font-semibold flex items-center">+0.8% <span className="material-symbols-outlined text-xs">arrow_upward</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overdue Count</p>
                            <div className="flex items-end justify-between mt-2">
                                <h3 className="text-2xl font-bold">{mockBorrowers.filter(b => b.status === 'Overdue').length}</h3>
                                <span className="text-rose-500 text-sm font-semibold flex items-center">-2.1% <span className="material-symbols-outlined text-xs">arrow_downward</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Table Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Table Actions */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                    <input
                                        className="pl-10 pr-4 py-2 bg-[#f6f6f8] dark:bg-slate-800 border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-primary/50"
                                        placeholder="Search by name or loan ID..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#f6f6f8] dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <span className="material-symbols-outlined text-lg">filter_list</span>
                                    All Statuses
                                    <span className="material-symbols-outlined text-lg">expand_more</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#f6f6f8] dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <span className="material-symbols-outlined text-lg">category</span>
                                    Product Type
                                    <span className="material-symbols-outlined text-lg">expand_more</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Borrower Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                        <th className="px-6 py-4">Borrower Name</th>
                                        <th className="px-6 py-4">Loan ID</th>
                                        <th className="px-6 py-4">Loan Product</th>
                                        <th className="px-6 py-4">Principal Amount</th>
                                        <th className="px-6 py-4">Outstanding</th>
                                        <th className="px-6 py-4">Next EMI</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">AI Risk Score</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredBorrowers.length === 0 && (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                                                No borrowers found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                    {filteredBorrowers.map((borrower, index) => (
                                        <tr key={borrower.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                                                        {borrower.avatarUrl ? (
                                                            <img className="w-full h-full object-cover" alt="Borrower avatar" src={borrower.avatarUrl} />
                                                        ) : (
                                                            <span className="text-primary text-xs font-bold">{borrower.name.split(' ').map(n => n[0]).join('')}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">{borrower.name}</p>
                                                        <p className="text-xs text-slate-500">{borrower.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{borrower.id}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 rounded uppercase">{borrower.productType}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold">{borrower.principal}</td>
                                            <td className="px-6 py-4 text-sm font-semibold">{borrower.outstanding}</td>
                                            <td className={`px-6 py-4 text-sm ${borrower.status === 'Overdue' ? 'text-rose-500 font-medium' : ''}`}>{borrower.nextEmi}</td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-semibold ${getStatusStyle(borrower.status)} px-2 py-1 rounded-full w-fit`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(borrower.status)}`}></span>
                                                    {borrower.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div className={`${getRiskBarColor(borrower.riskScore)} h-full`} style={{ width: `${Math.min(borrower.riskScore / 10, 100)}%` }}></div>
                                                    </div>
                                                    <span className={`text-xs font-bold ${getRiskTextColor(borrower.riskScore)}`}>{borrower.riskScore}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <Link to={`/lender/borrowers/${index + 1}`} className="p-1.5 text-primary hover:bg-primary/10 hover:text-blue-700 dark:hover:text-blue-400 rounded transition-colors cursor-pointer" title="View Profile">
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </Link>
                                                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Contact">
                                                        <span className="material-symbols-outlined text-xl">chat_bubble</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <p className="text-sm text-slate-500">Showing {filteredBorrowers.length} of {mockBorrowers.length} borrowers</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyBorrowers;
