import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { mockApplications } from '../data/mockData';
import { getApplicationById } from '../lib/api';

const ApplicationDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const appIndex = parseInt(id, 10) - 1;
    const [apiApp, setApiApp] = React.useState(null);
    const app = apiApp || mockApplications[Number.isNaN(appIndex) ? 0 : appIndex] || mockApplications[0];

    React.useEffect(() => {
        if (!id || !id.includes('-')) {
            return;
        }

        const loadApplication = async () => {
            try {
                const data = await getApplicationById(id);
                setApiApp({
                    ...mockApplications[0],
                    id: data.application_id,
                    borrowerId: String(data.borrower || '').slice(0, 8),
                    name: `Borrower ${String(data.borrower || '').slice(0, 6)}`,
                    occupation: data.loan_type,
                    location: 'N/A',
                    loanType: data.loan_type,
                    amount: new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                    }).format(Number(data.requested_amount || 0)),
                    tenure: `${data.requested_tenure_months} Months`,
                    status: data.status,
                });
            } catch {
                // Keep fallback UI when API data is not available.
            }
        };

        loadApplication();
    }, [id]);

    const getScoreRingColor = (score) => {
        if (score >= 750) return 'text-green-500';
        if (score >= 650) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreRingOffset = (score) => {
        const maxCircum = 263.89;
        return maxCircum - (score / 850) * maxCircum;
    };

    const riskConfig = {
        Low: { bg: 'bg-green-50 dark:bg-green-900/10', border: 'border-green-100 dark:border-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'text-green-600', icon: 'shield' },
        Medium: { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-100 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'text-amber-600', icon: 'warning' },
        High: { bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'text-red-600', icon: 'dangerous' }
    };

    const risk = riskConfig[app.riskLevel] || riskConfig.Low;

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 min-h-screen pb-24">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Navigation */}
                <nav className="bg-white dark:bg-slate-900 border-b border-primary/10 px-8 py-4 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 mr-2">
                                <span className="material-icons">arrow_back</span>
                            </button>
                            <span className="material-icons text-primary text-3xl">analytics</span>
                            <span className="text-xl font-bold tracking-tight text-primary">FinPulse</span>
                            <span className="text-slate-300 dark:text-slate-700 mx-2">|</span>
                            <span className="text-sm font-medium text-slate-500">Underwriting Dashboard</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <ThemeToggle />
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                                <span className="material-icons text-base">notifications</span>
                                <span>4 Alerts</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer">
                                <span className="material-icons text-sm">person</span>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Main Content Column */}
                        <div className="col-span-1 md:col-span-9 space-y-8">
                            {/* Profile Header Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 text-center sm:text-left">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shrink-0 bg-primary/5 flex items-center justify-center">
                                        {app.avatarUrl ? (
                                            <img className="w-full h-full object-cover" alt={app.name} src={app.avatarUrl} />
                                        ) : (
                                            <span className="text-primary text-2xl font-bold">{app.name.split(' ').map(n => n[0]).join('')}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{app.name}</h1>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">ID: <span className="text-primary">{app.borrowerId}</span></p>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1">
                                                <span className="material-icons text-xs">verified</span> KYC Verified
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-full flex items-center gap-1">
                                                <span className="material-icons text-xs">description</span> {app.loanType} Loan
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-end gap-6 md:border-l border-slate-100 dark:border-slate-800 md:pl-8 mt-4 md:mt-0">
                                    <div className="relative flex items-center justify-center">
                                        <svg className="w-24 h-24 transform -rotate-90">
                                            <circle className="text-slate-100 dark:text-slate-800" cx="48" cy="48" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
                                            <circle className={getScoreRingColor(app.healthScore)} cx="48" cy="48" fill="transparent" r="42" stroke="currentColor" strokeDasharray="263.89" strokeDashoffset={getScoreRingOffset(app.healthScore)} strokeWidth="8"></circle>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-2xl font-bold leading-none">{app.healthScore}</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1 text-center">Health<br/>Score</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Max Potential</p>
                                        <p className="text-lg font-bold">{app.maxPotential}</p>
                                        <p className={`text-xs font-medium mt-1 ${app.scoreChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{app.scoreChange}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tabs Navigation */}
                            <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                                <nav className="flex gap-8 min-w-max">
                                    <button className="border-b-2 border-primary pb-4 px-1 text-sm font-semibold text-primary flex items-center gap-2">
                                        <span className="material-icons text-sm">dashboard</span> Overview
                                    </button>
                                    <button className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="material-icons text-sm">account_balance_wallet</span> Financial Data
                                    </button>
                                    <button className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="material-icons text-sm">description</span> Documents
                                    </button>
                                    <button className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="material-icons text-sm">history</span> Loan History
                                    </button>
                                </nav>
                            </div>

                            {/* Main Viewport Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Score Breakdown */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/5 transition-all hover:shadow-md">
                                    <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                                        <span className="material-icons text-primary text-sm">insights</span> Score Breakdown
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Payment History</span>
                                                <span className={`text-sm font-bold ${app.paymentHistory >= 90 ? 'text-green-500' : app.paymentHistory >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>{app.paymentHistory}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${app.paymentHistory >= 90 ? 'bg-green-500' : app.paymentHistory >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${app.paymentHistory}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Credit Utilization</span>
                                                <span className={`text-sm font-bold ${app.creditUtilization <= 30 ? 'text-green-500' : app.creditUtilization <= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{app.creditUtilization}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${app.creditUtilization <= 30 ? 'bg-green-500' : app.creditUtilization <= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${app.creditUtilization}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Account Age</span>
                                                <span className="text-sm font-bold text-primary">{app.accountAge}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{width: `${Math.min(parseFloat(app.accountAge) / 10 * 100, 100)}%`}}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Credit Mix</span>
                                                <span className="text-sm font-bold text-primary">{app.creditMix}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{width: `${app.creditMix === 'Excellent' ? 90 : app.creditMix === 'Good' ? 75 : app.creditMix === 'Average' ? 55 : 40}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Activity Timeline */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/5 transition-all hover:shadow-md">
                                    <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                                        <span className="material-icons text-primary text-sm">update</span> Recent Activity
                                    </h3>
                                    <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                                        {app.activities.map((act, i) => (
                                            <div key={i} className="relative pl-8">
                                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${act.color === 'green' ? 'bg-green-500' : act.color === 'red' ? 'bg-red-500' : act.color === 'primary' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'} border-4 border-white dark:border-slate-900 z-10 flex items-center justify-center`}>
                                                    {act.color === 'green' && <span className="material-icons text-[10px] text-white">check</span>}
                                                </div>
                                                <p className="text-sm font-semibold">{act.text}</p>
                                                <p className="text-xs text-slate-500">{act.detail}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase">{act.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Sidebar (Quick Stats & Risk Analysis) */}
                        <div className="col-span-1 md:col-span-3 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-primary/5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Overview</h3>
                                <div className="space-y-4">
                                    <div className={`p-4 ${risk.bg} rounded-lg border ${risk.border}`}>
                                        <p className={`text-xs ${risk.text} font-semibold mb-1`}>Risk Level</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xl font-bold ${risk.label}`}>{app.riskLevel}</span>
                                            <span className={`material-icons ${risk.label}`}>{risk.icon}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-slate-500 font-semibold mb-1">Default Probability</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">{app.defaultProbability}</span>
                                            <span className={`text-xs font-bold ${app.probChange.startsWith('-') ? 'text-green-500' : 'text-red-500'}`}>{app.probChange}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-slate-500 font-semibold mb-1">Monthly Income</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">{app.monthlyIncome}</span>
                                            <span className="text-[10px] font-bold py-0.5 px-2 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">Verified</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-slate-500 font-semibold mb-1">Debt-to-Income</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">{app.debtToIncome}</span>
                                            <span className="material-icons text-slate-400 text-sm">info</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 border border-primary/20">
                                <h3 className="text-sm font-bold mb-4 text-slate-900 dark:text-slate-100">Underwriter Notes</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-4 leading-relaxed">
                                    "{app.note}"
                                </p>
                                <button className="w-full py-2.5 bg-white dark:bg-slate-800 text-primary border border-primary/20 text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm">
                                    Add New Note
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-primary/5">
                                <h3 className="text-sm font-bold mb-4">Applicant Info</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="material-icons text-primary text-lg">work</span>
                                        <span className="text-xs font-medium">{app.occupation}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-icons text-primary text-lg">location_on</span>
                                        <span className="text-xs font-medium">{app.location}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-icons text-green-500 text-lg">check_circle</span>
                                        <span className="text-xs font-medium">PAN Card Verified</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-icons text-green-500 text-lg">check_circle</span>
                                        <span className="text-xs font-medium">Aadhaar Card Linked</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 md:gap-8 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <div className="shrink-0">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest hidden sm:block">Loan Amount Request</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest sm:hidden">Amount</p>
                            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{app.amount}</p>
                        </div>
                        <div className="shrink-0 border-l border-slate-200 dark:border-slate-700 pl-4 md:pl-6">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tenure</p>
                            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{app.tenure}</p>
                        </div>
                        <div className="shrink-0 border-l border-slate-200 dark:border-slate-700 pl-4 md:pl-6">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Interest Rate</p>
                            <p className="text-lg md:text-xl font-bold text-primary">{app.interestRate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                            Reject
                        </button>
                        <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold rounded-lg transition-colors whitespace-nowrap hidden lg:block">
                            Request Info
                        </button>
                        <button className="flex-1 sm:flex-none px-4 sm:px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                            <span className="material-icons text-sm hidden sm:block">verified_user</span> 
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;
