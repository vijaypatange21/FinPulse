import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { mockBorrowers } from '../data/mockData';
import { getBorrowerById } from '../lib/api';

const BorrowerMonitoring = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const borrowerIndex = parseInt(id, 10) - 1;
    const [apiBorrower, setApiBorrower] = React.useState(null);
    const borrower = apiBorrower || mockBorrowers[Number.isNaN(borrowerIndex) ? 0 : borrowerIndex] || mockBorrowers[0];

    React.useEffect(() => {
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

    const [activeTab, setActiveTab] = React.useState('overview');
    const [actionMsg, setActionMsg] = React.useState('');
    const [reminderModal, setReminderModal] = React.useState(false);
    const [limitModal, setLimitModal] = React.useState(false);
    const [recoveryModal, setRecoveryModal] = React.useState(false);
    const [forecloseModal, setForecloseModal] = React.useState(false);
    const [creditLimit, setCreditLimit] = React.useState(500000);

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

    const riskColors = {
        green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-100 dark:border-green-800/30', dot: 'bg-green-500' },
        yellow: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800/30', dot: 'bg-amber-500' },
        red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-100 dark:border-red-800/30', dot: 'bg-red-500' }
    };
    const rc = riskColors[borrower.riskColor] || riskColors.green;

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Top Navigation Bar */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-40 sticky top-0 z-40">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 text-primary">
                                <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 mr-2 -ml-4">
                                    <span className="material-icons">arrow_back</span>
                                </button>
                                <span className="material-icons text-3xl">insights</span>
                                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">FinPulse</h2>
                            </div>
                            <nav className="hidden md:flex items-center gap-9">
                                <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" to="/lender/dashboard">Dashboard</Link>
                                <Link className="text-primary text-sm font-bold border-b-2 border-primary pb-1" to="/lender/borrowers">My Borrowers</Link>
                                <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Reports</a>
                                <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Settings</a>
                            </nav>
                        </div>
                        <div className="flex flex-1 justify-end gap-6 items-center">
                            <ThemeToggle />
                            <div className="relative">
                                <span className="material-icons text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">notifications</span>
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-4 lg:px-40 py-8">
                        {/* Borrower Header Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex gap-6 items-center flex-col sm:flex-row text-center sm:text-left">
                                    <div className="h-24 w-24 rounded-xl border-4 border-slate-50 dark:border-slate-800 shrink-0 shadow-sm overflow-hidden bg-primary/10 flex items-center justify-center">
                                        {borrower.avatarUrl ? (
                                            <img className="w-full h-full object-cover" alt={borrower.name} src={borrower.avatarUrl} />
                                        ) : (
                                            <span className="text-primary text-2xl font-bold">{borrower.name.split(' ').map(n => n[0]).join('')}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                            <h1 className="text-slate-900 dark:text-white text-2xl font-bold">{borrower.name}</h1>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${borrower.status === 'On Track' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30' : borrower.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30'}`}>{borrower.status}</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Borrower ID: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{borrower.id}</span> • Member since {borrower.memberSince}</p>
                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                                                <span className="material-icons text-primary text-lg">favorite</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Score: <span className="text-primary font-bold">{borrower.healthScore}</span> <span className="text-xs text-slate-500 font-normal opacity-80">({borrower.healthLabel})</span></span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <span className="material-icons text-slate-400 text-lg">location_on</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{borrower.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                                    <button className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                                        <span className="material-icons text-lg">mail</span> Message
                                    </button>
                                    <button className="flex-1 md:flex-none px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-primary/30 flex items-center justify-center gap-2">
                                        <span className="material-icons text-lg text-white/90">description</span> Full Report
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Sidebar: Loan Details & Risk */}
                            <aside className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Active Loan Summary</h3>
                                        <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons text-sm">open_in_new</span></button>
                                    </div>
                                    <div className="p-5 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-lg opacity-80">account_balance_wallet</span>
                                                <span className="text-sm font-medium">Total Outstanding</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white text-lg">{borrower.totalOutstanding}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-lg opacity-80">event</span>
                                                <span className="text-sm font-medium">Next EMI Date</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm border border-slate-200 dark:border-slate-700">{borrower.nextEmiDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-lg opacity-80">percent</span>
                                                <span className="text-sm font-medium">Interest Rate</span>
                                            </div>
                                            <span className="font-bold text-primary">{borrower.interestRate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-lg opacity-80">category</span>
                                                <span className="text-sm font-medium">Loan Type</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{borrower.productType}</span>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={handleDownloadSummary}
                                                className="flex-1 py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1"
                                            >
                                                <span className="material-icons text-xs">download</span> Download PDF
                                            </button>
                                            <button
                                                onClick={() => setForecloseModal(true)}
                                                className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Foreclose
                                            </button>
                                        </div>
                                        <div className="mt-2 pt-5 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><span className="material-icons text-[14px]">radar</span>Risk Monitoring</span>
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${rc.text} ${rc.bg} px-2 py-1 rounded border ${rc.border}`}>
                                                    <span className={`size-2 rounded-full ${rc.dot} animate-pulse`}></span> {borrower.riskLevel} Risk
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{borrower.riskNote}</p>
                                        </div>
                                    </div>
                                </div>
                                {borrower.policyNumber !== 'None' && (
                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl border border-primary/20 p-5 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                                <span className="material-icons text-lg">verified_user</span> Insurance Coverage
                                            </h4>
                                            <span className="bg-white/80 dark:bg-slate-800/80 p-1.5 rounded-lg text-primary shadow-sm backdrop-blur-sm">
                                                <span className="material-icons text-lg block">shield</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Comprehensive Loan Protection Plan active until <strong className="text-slate-900 dark:text-white">{borrower.insuranceExpiry}</strong>.</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Policy #{borrower.policyNumber}</span>
                                                <button
                                                    onClick={() => showActionToast(`Displaying Policy Certificate #${borrower.policyNumber}`)}
                                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm transition-all hover:shadow-md"
                                                >
                                                    View Cert <span className="material-icons text-[14px]">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Alerts</h3>
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Last 30 days</span>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <div className="p-4 flex gap-3 text-sm">
                                            <span className={`material-icons text-lg mt-0.5 ${borrower.riskColor === 'red' ? 'text-red-500' : 'text-amber-500'}`}>warning_amber</span>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{borrower.alertText}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Recent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content Area */}
                            <div className="lg:col-span-8 flex flex-col">
                                <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-6 overflow-x-auto pb-0.5 no-scrollbar">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: 'dashboard' },
                                        { id: 'repayment', label: 'Repayment Schedule', icon: 'payments' },
                                        { id: 'transactions', label: 'Transaction Monitoring', icon: 'monitoring' },
                                        { id: 'documents', label: 'Documents', icon: 'description' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`pb-4 px-1 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                                                activeTab === tab.id
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-slate-500 hover:text-primary'
                                            }`}
                                        >
                                            <span className="material-icons text-sm">{tab.icon}</span> {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Progress Bar Section */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-center mb-5">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-icons text-primary text-lg">track_changes</span> Repayment Progress
                                        </h3>
                                        <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md shadow-sm">{borrower.repaymentPercent}% Paid</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-5 overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <div className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full transition-all duration-1000 ease-out relative" style={{width: `${borrower.repaymentPercent}%`}}>
                                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Total Paid: <span className="font-bold text-slate-900 dark:text-white ml-1">{borrower.totalPaid}</span></span>
                                        <span className="text-slate-500 font-medium">Remaining: <span className="font-bold text-slate-900 dark:text-white ml-1">{borrower.remaining}</span></span>
                                    </div>
                                </div>

                                {/* Cash Flow Health */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-icons text-primary text-lg">analytics</span> Cash Flow Stability
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-3 mr-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="size-2.5 bg-primary rounded-sm shadow-sm"></span>
                                                    <span className="text-xs text-slate-500 font-medium">Income</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="size-2.5 bg-primary/20 rounded-sm"></span>
                                                    <span className="text-xs text-slate-500 font-medium">Expenses</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-56 w-full flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-4 mt-4 pb-2 relative border-b border-slate-100 dark:border-slate-800">
                                        {borrower.cashFlow.map((cf, i) => (
                                            <div key={i} className={`flex-1 max-w-16 space-y-2 group flex flex-col justify-end h-full relative z-10 w-full`}>
                                                <div className={`w-full flex items-end gap-[2px] h-[${Math.max(cf.incomeH, cf.expenseH)}%] group-hover:-translate-y-1 transition-transform duration-300`}>
                                                    <div className="flex-1 bg-primary/20 hover:bg-primary/30 rounded-t-sm transition-colors cursor-pointer" style={{height: `${cf.expenseH}%`}}></div>
                                                    <div className="flex-1 bg-primary hover:bg-primary/90 rounded-t-sm transition-colors shadow-sm cursor-pointer" style={{height: `${cf.incomeH}%`}}></div>
                                                </div>
                                                <p className={`text-[10px] text-center font-bold uppercase tracking-wider ${i === borrower.cashFlow.length - 1 ? 'text-primary' : 'text-slate-400'}`}>{cf.month}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* EMI Timeline */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md mb-8">
                                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-icons text-primary text-lg">history</span> Repayment Timeline
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {borrower.timeline.map((t, i) => (
                                            <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`${t.status === 'Paid Full' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50' : t.status === 'Missed' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'} rounded-lg p-3 shrink-0 group-hover:scale-110 transition-transform shadow-inner border`}>
                                                        <span className="material-icons leading-none">{t.status === 'Paid Full' ? 'check_circle' : t.status === 'Missed' ? 'cancel' : 'warning'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">EMI - {t.month}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <span>{t.date}</span>
                                                            <span className="size-1 bg-slate-300 rounded-full"></span>
                                                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Ref: {t.ref}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-base font-bold text-slate-900 dark:text-white leading-none mb-1.5">{t.amount}</p>
                                                    <span className={`text-[10px] font-bold ${t.status === 'Paid Full' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' : t.status === 'Missed' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30'} px-2.5 py-1 rounded border uppercase tracking-wider`}>{t.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Upcoming EMI */}
                                        <div className="p-4 sm:p-5 flex items-center justify-between bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary group">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white dark:bg-slate-800 text-primary border border-primary/20 rounded-lg p-3 shrink-0 shadow-sm">
                                                    <span className="material-icons leading-none animate-bounce" style={{animationDuration: '2s'}}>schedule</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Next EMI <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest hidden sm:inline-block">Due Soon</span></p>
                                                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                                                        <span>Scheduled for {borrower.nextEmiDate} (Auto-Debit)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-base font-bold text-slate-900 dark:text-white leading-none mb-1.5">{borrower.emiAmount}</p>
                                                <span className="text-[10px] font-bold text-primary bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-primary/20 uppercase tracking-wider shadow-sm">Upcoming</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Action Toast */}
                    {actionMsg && (
                        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 shadow-2xl animate-fade-in">
                            <span className="material-icons text-emerald-400 text-base">check_circle</span>
                            <span>{actionMsg}</span>
                        </div>
                    )}

                    {/* Sticky Bottom Action Bar */}
                    <footer className="sticky bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-40 py-4 lg:py-4 z-40 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="hidden lg:flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <span className="material-icons text-amber-500">info</span>
                                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">Next formal review scheduled in <span className="font-bold underline decoration-amber-400">12 days</span>. {borrower.healthLabel} financial profile.</p>
                            </div>
                            <div className="flex flex-wrap md:flex-nowrap justify-center sm:justify-end gap-3 w-full lg:w-auto">
                                <button
                                    onClick={() => setReminderModal(true)}
                                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span className="material-icons text-lg">notifications_active</span> <span className="hidden sm:inline">Send Reminder</span><span className="sm:hidden">Remind</span>
                                </button>
                                <button
                                    onClick={() => setLimitModal(true)}
                                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span className="material-icons text-lg">edit_note</span> Adjust Limit
                                </button>
                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                                <button
                                    onClick={() => setRecoveryModal(true)}
                                    className="flex-[2] sm:flex-none px-4 sm:px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-sm font-bold rounded-lg transition-all border border-red-200 dark:border-red-900/50 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <span className="material-icons text-lg">gavel</span> Initiate Recovery
                                </button>
                            </div>
                        </div>
                    </footer>

            {/* Reminder Modal */}
            {reminderModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">notifications_active</span> Send Borrower Notice
                            </h3>
                            <button onClick={() => setReminderModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
                        </div>
                        <p className="text-xs text-slate-500">Dispatch an automated payment reminder to <strong>{borrower.name}</strong> for upcoming EMI ({borrower.emiAmount}) due on {borrower.nextEmiDate}.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setReminderModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={() => {
                                    setReminderModal(false);
                                    showActionToast(`Payment reminder SMS & email dispatched to ${borrower.name}.`);
                                }}
                                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary/90"
                            >
                                Dispatch Notice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Limit Adjustment Modal */}
            {limitModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">tune</span> Modify Credit Exposure Limit
                            </h3>
                            <button onClick={() => setLimitModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                <span>Sanctioned Credit Limit</span>
                                <span className="text-primary font-bold">₹{creditLimit.toLocaleString('en-IN')}</span>
                            </div>
                            <input
                                type="range"
                                min="100000"
                                max="2000000"
                                step="50000"
                                value={creditLimit}
                                onChange={(e) => setCreditLimit(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setLimitModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={() => {
                                    setLimitModal(false);
                                    showActionToast(`Credit limit for ${borrower.name} adjusted to ₹${creditLimit.toLocaleString('en-IN')}.`);
                                }}
                                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary/90"
                            >
                                Confirm Adjustment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recovery Modal */}
            {recoveryModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                <span className="material-icons">gavel</span> Initiate Legal Recovery Notice
                            </h3>
                            <button onClick={() => setRecoveryModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
                        </div>
                        <p className="text-xs text-slate-500">Initiate formal loan default escalation and issue formal legal recovery proceedings for outstanding amount {borrower.totalOutstanding}.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setRecoveryModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={() => {
                                    setRecoveryModal(false);
                                    showActionToast(`Recovery notice initiated against facility #${borrower.id}.`);
                                }}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
                            >
                                Proceed with Notice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Foreclose Modal */}
            {forecloseModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-icons text-primary">account_balance</span> Foreclosure Settlement
                            </h3>
                            <button onClick={() => setForecloseModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
                            <p className="text-slate-500">Total Outstanding Balance: <strong className="text-slate-900 dark:text-white">{borrower.totalOutstanding}</strong></p>
                            <p className="text-slate-500">Foreclosure Waiver: <strong>100% Prepayment Penalty Waived</strong></p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setForecloseModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300">Cancel</button>
                            <button
                                onClick={() => {
                                    setForecloseModal(false);
                                    showActionToast(`Foreclosure demand note issued for ${borrower.name}.`);
                                }}
                                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary/90"
                            >
                                Issue Settlement
                            </button>
                        </div>
                    </div>
                </div>
            )}
                </div>
            </div>
        </div>
    );
};

export default BorrowerMonitoring;
