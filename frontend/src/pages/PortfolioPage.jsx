import React, { useEffect, useMemo, useState } from 'react';
import LenderLayout from '../components/LenderLayout';

const mockPortfolioData = {
  summary: {
    totalExposure: '₹45.2 Cr',
    activeLoans: 128,
    averageYield: '13.8%',
    overdueRate: '2.4%',
  },
  allocation: [
    { label: 'Home', value: 38, color: '#2262ec' },
    { label: 'Business', value: 26, color: '#14b8a6' },
    { label: 'Vehicle', value: 16, color: '#f59e0b' },
    { label: 'Personal', value: 12, color: '#8b5cf6' },
    { label: 'Education', value: 8, color: '#ef4444' },
  ],
  metrics: [
    { label: 'Weighted ROI', value: '11.9%' },
    { label: 'Net Margin', value: '4.3%' },
    { label: 'Recovery Rate', value: '98.1%' },
    { label: 'PAR 30+', value: '1.1%' },
  ],
  topBorrowers: [
    { name: 'Arjun Sharma', loan: 'Business Loan', exposure: '₹8.45L', risk: 'Low' },
    { name: 'Rahul Mehta', loan: 'Home Loan', exposure: '₹38.2L', risk: 'Medium' },
    { name: 'Neha Gupta', loan: 'Vehicle Loan', exposure: '₹6.15L', risk: 'Low' },
    { name: 'Priya Verma', loan: 'Personal Loan', exposure: '₹4.2L', risk: 'High' },
  ],
  maturity: [
    { month: 'Apr', amount: 3.2 },
    { month: 'May', amount: 4.1 },
    { month: 'Jun', amount: 5.4 },
    { month: 'Jul', amount: 4.9 },
    { month: 'Aug', amount: 6.6 },
    { month: 'Sep', amount: 5.1 },
  ],
};

const riskBadge = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PortfolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setData(mockPortfolioData);
      setLoading(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, []);

  const maturityMax = useMemo(() => Math.max(...mockPortfolioData.maturity.map((m) => m.amount)), []);

  const center = 44;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <LenderLayout activeSection="portfolio">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of exposure, yield, risk mix, and loan maturity trends.</p>
        </div>

        {loading || !data ? (
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
                <h3 className="text-3xl font-bold mt-3">{data.summary.totalExposure}</h3>
                <p className="text-xs text-emerald-600 mt-2 font-semibold">+8.2% vs last quarter</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Loans</p>
                <h3 className="text-3xl font-bold mt-3">{data.summary.activeLoans}</h3>
                <p className="text-xs text-slate-500 mt-2">Across all borrower segments</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Yield</p>
                <h3 className="text-3xl font-bold mt-3">{data.summary.averageYield}</h3>
                <p className="text-xs text-slate-500 mt-2">Net booked yield after servicing costs</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overdue Rate</p>
                <h3 className="text-3xl font-bold mt-3 text-red-600 dark:text-red-400">{data.summary.overdueRate}</h3>
                <p className="text-xs text-slate-500 mt-2">Stable relative to previous month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Portfolio allocation</h3>
                    <p className="text-sm text-slate-500 mt-1">Exposure split by product type</p>
                  </div>
                  <span className="material-icons text-[#2262ec]">pie_chart</span>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative w-56 h-56 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="18" className="text-slate-100 dark:text-slate-800" />
                      {data.allocation.map((item) => {
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
                      <span className="text-3xl font-black text-slate-900 dark:text-white">₹45.2</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cr Exposure</span>
                    </div>
                  </div>
                  <div className="w-full space-y-3">
                    {data.allocation.map((item) => (
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
              </div>

              <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold">Key metrics</h3>
                      <p className="text-sm text-slate-500 mt-1">Performance and recovery indicators</p>
                    </div>
                    <span className="material-icons text-[#2262ec]">insights</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 p-4">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{metric.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold">Top borrowers</h3>
                      <p className="text-sm text-slate-500 mt-1">Largest exposures in the portfolio</p>
                    </div>
                    <span className="material-icons text-[#2262ec]">groups</span>
                  </div>
                  <div className="space-y-4">
                    {data.topBorrowers.map((borrower) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Maturity ladder</h3>
                    <p className="text-sm text-slate-500 mt-1">Projected cash flow from near-term maturities</p>
                  </div>
                  <span className="material-icons text-[#2262ec]">timeline</span>
                </div>
                <div className="h-64 flex items-end gap-4">
                  {data.maturity.map((item) => {
                    const height = (item.amount / maturityMax) * 100;
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="w-full max-w-16 bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex items-end" style={{ height: '100%' }}>
                          <div className="w-full bg-gradient-to-t from-[#2262ec] to-blue-400 rounded-t-xl" style={{ height: `${height}%` }} />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.month}</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">₹{item.amount} Cr</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="xl:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Portfolio insights</h3>
                    <p className="text-sm text-slate-500 mt-1">What to watch</p>
                  </div>
                  <span className="material-icons text-[#2262ec]">auto_awesome</span>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>Home loans remain the largest allocation, so a sustained decline in property-backed exposure would impact total yield the most.</p>
                  <p>Recovery stays healthy above 98%, but smaller personal loans contribute a disproportionate share of overdue volume.</p>
                  <p>Keep an eye on the upcoming maturity ladder in August, which is the largest short-term inflow month in the current projection.</p>
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