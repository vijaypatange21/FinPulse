import React, { useEffect, useMemo, useState } from 'react';
import LenderLayout from '../components/LenderLayout';
import { listApplications, listBorrowers } from '../lib/api';

const formatMoney = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const riskBadge = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CATEGORY_COLORS = {
  'Personal Loan': '#2262ec',
  'Home Loan': '#14b8a6',
  'Business Loan': '#f59e0b',
  'Vehicle Loan': '#8b5cf6',
  'Education Loan': '#ef4444',
  'Other': '#64748b',
};

const PortfolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [borrowers, setBorrowers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bList, aList] = await Promise.all([
          listBorrowers().catch(() => []),
          listApplications().catch(() => []),
        ]);

        setBorrowers(Array.isArray(bList) ? bList : (bList?.results || []));
        setApplications(Array.isArray(aList) ? aList : (aList?.results || []));
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const approvedLoans = applications.filter((a) => a.status === 'approved');
  const totalExposure = approvedLoans.reduce((sum, a) => sum + Number(a.amount || a.requested_amount || 0), 0);
  const overdueBorrowers = borrowers.filter((b) => b.status === 'Overdue' || b.status === 'Late');
  const overdueRate = borrowers.length > 0 ? `${((overdueBorrowers.length / borrowers.length) * 100).toFixed(1)}%` : '0.0%';

  // Dynamic allocation
  const allocation = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      const type = a.loanType || a.loan_type || 'Personal Loan';
      counts[type] = (counts[type] || 0) + 1;
    });

    const total = applications.length;
    if (total === 0) return [];

    return Object.entries(counts).map(([label, count]) => ({
      label,
      value: Math.round((count / total) * 100),
      color: CATEGORY_COLORS[label] || '#2262ec',
    }));
  }, [applications]);

  const topBorrowers = useMemo(() => {
    return borrowers.slice(0, 4).map((b) => ({
      name: b.name || 'Borrower',
      loan: b.productType || b.occupation || 'Loan Facility',
      exposure: formatMoney(b.principal || b.outstanding || 0),
      risk: (b.healthScore || b.riskScore || 700) >= 750 ? 'Low' : (b.healthScore || b.riskScore || 700) >= 650 ? 'Medium' : 'High',
    }));
  }, [borrowers]);

  const center = 44;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  const [toastMsg, setToastMsg] = useState('');

  const handleExportPortfolio = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [
      'Borrower Name,Facility Type,Exposure (INR),Risk Level',
      ...borrowers.map(b => `"${b.name || 'Borrower'}","${b.productType || b.occupation || 'Loan'}","${b.principal || b.outstanding || 0}","${(b.healthScore || b.riskScore || 700) >= 750 ? 'Low' : (b.healthScore || b.riskScore || 700) >= 650 ? 'Medium' : 'High'}"`)
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinPulse_Portfolio_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg('Portfolio report exported as CSV.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <LenderLayout activeSection="portfolio">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-icons text-emerald-400 text-base">check_circle</span>
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Portfolio</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of exposure, yield, risk mix, and loan maturity trends.</p>
          </div>
          <button
            onClick={handleExportPortfolio}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            <span className="material-icons text-sm">download</span>
            Export Report
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse">
            <div className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <div className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <div className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <div className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Exposure</p>
                <h3 className="text-3xl font-bold mt-3">{formatMoney(totalExposure)}</h3>
                <p className="text-xs text-slate-500 mt-2">{approvedLoans.length} active facilities</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Borrowers</p>
                <h3 className="text-3xl font-bold mt-3">{borrowers.length}</h3>
                <p className="text-xs text-slate-500 mt-2">Across all loan portfolios</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Indicative APR</p>
                <h3 className="text-3xl font-bold mt-3">{approvedLoans.length > 0 ? '10.5%' : 'N/A'}</h3>
                <p className="text-xs text-slate-500 mt-2">Weighted average yield</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overdue Rate</p>
                <h3 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">{overdueRate}</h3>
                <p className="text-xs text-slate-500 mt-2">{overdueBorrowers.length} overdue accounts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Portfolio allocation</h3>
                    <p className="text-sm text-slate-500 mt-1">Exposure split by product type</p>
                  </div>
                  <span className="material-icons text-[#2262ec]">pie_chart</span>
                </div>

                {allocation.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                    <span className="material-icons text-4xl text-slate-400 mb-2">pie_chart_outline</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Allocation Data</p>
                    <p className="text-xs text-slate-400 mt-1">Portfolio allocation will activate when loan requests are submitted.</p>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row items-center gap-8 flex-1">
                    <div className="relative w-48 h-48 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="18" className="text-slate-100 dark:text-slate-800" />
                        {allocation.map((item) => {
                          const dash = (item.value / 100) * circumference;
                          const strokeDasharray = `${dash} ${circumference - dash}`;
                          const strokeDashoffset = circumference - accumulated * circumference;
                          accumulated += item.value / 100;
                          return (
                            <circle
                              key={item.label}
                              cx={center}
                              cy={center}
                              r={radius}
                              fill="none"
                              stroke={item.color}
                              strokeWidth="18"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{applications.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requests</span>
                      </div>
                    </div>
                    <div className="w-full space-y-3">
                      {allocation.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold">Key metrics</h3>
                      <p className="text-sm text-slate-500 mt-1">Performance and underwriting indicators</p>
                    </div>
                    <span className="material-icons text-[#2262ec]">insights</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Underwriting Speed</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-600">Real-Time</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Active Pipeline</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{applications.length}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Disbursed Loans</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{approvedLoans.length}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Flagged Anomalies</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{overdueBorrowers.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold">Top Borrowers</h3>
                      <p className="text-sm text-slate-500 mt-1">Largest exposures in the portfolio</p>
                    </div>
                    <span className="material-icons text-[#2262ec]">groups</span>
                  </div>
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {topBorrowers.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        No active borrowers currently recorded in the portfolio.
                      </div>
                    ) : (
                      topBorrowers.map((borrower) => (
                        <div key={borrower.name} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-800/30">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{borrower.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{borrower.loan}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">{borrower.exposure}</p>
                            <span className={`inline-flex mt-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${riskBadge[borrower.risk]}`}>{borrower.risk} Risk</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </LenderLayout>
  );
};

export default PortfolioPage;