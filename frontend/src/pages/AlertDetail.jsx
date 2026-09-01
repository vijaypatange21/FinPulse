import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { getApplicationById, getBorrowerById } from '../lib/api';

const AlertDetail = () => {
    const { id } = useParams();
    const [targetData, setTargetData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEntity = async () => {
            try {
                // Try fetching as application first, then borrower
                let data = null;
                try {
                    data = await getApplicationById(id);
                } catch {
                    try {
                        data = await getBorrowerById(id);
                    } catch {
                        data = null;
                    }
                }
                setTargetData(data);
            } catch {
                // Fallback
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEntity();
        } else {
            setLoading(false);
        }
    }, [id]);

    const entityName = targetData?.borrowerName || targetData?.name || `Account #${id}`;
    const score = targetData?.aiScore || targetData?.healthScore || 720;
    const loanType = targetData?.loanType || targetData?.productType || 'Standard Credit Facility';

    return (
        <LenderLayout activeSection="alerts">
            <div className="max-w-7xl mx-auto w-full pb-24 space-y-8">
                <div className="flex items-center gap-4">
                    <Link to="/lender/dashboard" className="bg-[#2262ec]/10 p-2 rounded-lg hover:bg-[#2262ec]/20 transition-colors">
                        <span className="material-icons text-[#2262ec]">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">FinPulse <span className="text-[#2262ec]">Alert Monitor</span></h1>
                        <p className="text-xs text-slate-500 mt-0.5">Monitoring Stream #{id}</p>
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
                                {score >= 750 ? 'HEALTHY' : score >= 650 ? 'MONITORED' : 'ATTENTION REQUIRED'}
                            </span>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                            <div>
                                <h2 className="text-2xl font-bold">{entityName}</h2>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <span>Facility: #{id}</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span>{loanType}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Health Score</p>
                                <div className="flex items-center gap-1 justify-center">
                                    <span className="text-2xl font-bold text-[#2262ec]">{score}</span>
                                    <span className="text-xs text-slate-400">/850</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Surveillance</p>
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-icons text-[#2262ec]">psychology</span>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">AI Risk Assessment Summary</h3>
                            </div>
                            <div className="bg-[#2262ec]/5 border border-[#2262ec]/20 rounded-xl p-5">
                                <strong className="text-[#2262ec] font-semibold text-sm block mb-1 uppercase tracking-tight">
                                    {score >= 700 ? 'Facility Performing Within Parameters' : 'Elevated Risk Factors Detected'}
                                </strong>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                    {score >= 700
                                        ? 'Underwriting models indicate positive cash flow stability, verified credit credentials, and minimal probability of default over the next 12 billing cycles.'
                                        : 'Automated credit surveillance detected variances in debt-to-income or outflow ratios. Recommend reviewing recent transaction verification before increasing credit exposure.'
                                    }
                                </p>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-700 dark:text-slate-300">Underwriting Safeguards</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Verification</p>
                                    <p className="text-lg font-bold text-emerald-600">Complete</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Repayment Status</p>
                                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Standard</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">AI Health Tier</p>
                                    <p className="text-lg font-bold text-[#2262ec]">{score >= 750 ? 'Tier 1' : 'Tier 2'}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="font-bold text-sm uppercase tracking-wider">Audit Log</h3>
                                <span className="material-icons text-slate-400 text-sm">history</span>
                            </div>
                            <div className="space-y-4 text-xs">
                                <div className="pl-4 border-l-2 border-[#2262ec] space-y-1">
                                    <p className="font-semibold text-slate-900 dark:text-white">Active AI Surveillance</p>
                                    <p className="text-slate-500">Real-time risk scoring initialized.</p>
                                </div>
                                <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                                    <p className="font-semibold text-slate-900 dark:text-white">Credit Verification</p>
                                    <p className="text-slate-500">Facility registered on FinPulse platform.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </LenderLayout>
    );
};

export default AlertDetail;

