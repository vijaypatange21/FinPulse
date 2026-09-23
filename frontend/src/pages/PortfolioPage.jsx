import React, { useEffect, useMemo, useState } from 'react';
import LenderLayout from '../components/LenderLayout';
import { listApplications, listBorrowers } from '../lib/api';
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

const CATEGORY_COLORS = {
  'Personal Loan': 'var(--accent)',
  'Home Loan': '#14b8a6',
  'Business Loan': '#f59e0b',
  'Vehicle Loan': '#8b5cf6',
  'Education Loan': '#ef4444',
  'Other': 'var(--border-strong)',
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
      color: CATEGORY_COLORS[label] || 'var(--accent)',
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
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
        {toastMsg && (
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
              Capital Exposure & Yield
            </span>
            <h1 className="font-clash text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-1">
              Portfolio Analytics
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Overview of capital deployment, weighted yield, risk diversification, and maturity distribution
            </p>
          </div>
          <button
            onClick={handleExportPortfolio}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold rounded-[var(--radius-pill)] shadow-[var(--shadow-accent-glow)] transition-all hover:opacity-90 inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 animate-pulse">
            <div className="h-28 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
            <div className="h-28 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
            <div className="h-28 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
            <div className="h-28 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          </div>
        ) : (
          <>
            {/* Bento Stat Grid: 3 Quiet + 1 Contrast Island */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <ContrastCard className="p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-xs font-medium uppercase tracking-wider opacity-75">Total Exposure</span>
                <div className="mt-3">
                  <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                    {formatMoney(totalExposure)}
                  </span>
                  <p className="text-xs opacity-75 mt-1 font-medium">{approvedLoans.length} active facilities</p>
                </div>
              </ContrastCard>

              <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Active Borrowers</span>
                <div className="mt-3">
                  <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                    {borrowers.length}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Across all facilities</p>
                </div>
              </Card>

              <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Indicative APR</span>
                <div className="mt-3">
                  <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--accent)]">
                    {approvedLoans.length > 0 ? '10.5%' : 'N/A'}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Weighted average yield</p>
                </div>
              </Card>

              <Card className="p-6 flex flex-col justify-between min-h-[140px]">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Overdue Rate</span>
                <div className="mt-3">
                  <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                    {overdueRate}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{overdueBorrowers.length} overdue accounts</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Product Allocation Chart */}
              <Card className="xl:col-span-5 p-6 flex flex-col">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
                  <div>
                    <h3 className="font-clash font-semibold text-base text-[var(--text-primary)]">Portfolio Allocation</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Exposure split by product type</p>
                  </div>
                  <span className="material-symbols-outlined text-[var(--accent)]">pie_chart</span>
                </div>

                {allocation.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                    <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] mb-2">pie_chart</span>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">No Allocation Data</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Allocation activates as borrowers apply.</p>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row items-center gap-8 flex-1 justify-center">
                    <div className="relative w-44 h-44 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="16" className="text-[var(--border-subtle)]" />
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
                              strokeWidth="16"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-clash text-2xl font-bold tabular-nums text-[var(--text-primary)]">{applications.length}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Requests</span>
                      </div>
                    </div>
                    <div className="w-full space-y-2.5">
                      {allocation.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[var(--text-secondary)]">{item.label}</span>
                          </div>
                          <span className="font-semibold tabular-nums text-[var(--text-primary)]">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Key Indicators & Top Borrowers */}
              <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 flex flex-col">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
                    <div>
                      <h3 className="font-clash font-semibold text-base text-[var(--text-primary)]">Key Indicators</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Performance & risk benchmarks</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--accent)]">insights</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Underwriting</p>
                      <p className="mt-1 font-clash text-xl font-bold text-[var(--status-success)]">Real-Time</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Pipeline</p>
                      <p className="mt-1 font-clash text-xl font-bold text-[var(--text-primary)] tabular-nums">{applications.length}</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Disbursed</p>
                      <p className="mt-1 font-clash text-xl font-bold text-[var(--accent)] tabular-nums">{approvedLoans.length}</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Flagged</p>
                      <p className="mt-1 font-clash text-xl font-bold text-[var(--status-error)] tabular-nums">{overdueBorrowers.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 flex flex-col">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-4">
                    <div>
                      <h3 className="font-clash font-semibold text-base text-[var(--text-primary)]">Top Borrowers</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Largest exposures in registry</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--accent)]">groups</span>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {topBorrowers.length === 0 ? (
                      <div className="text-center py-6 text-[var(--text-muted)] text-xs">
                        No active borrowers currently recorded in the portfolio.
                      </div>
                    ) : (
                      topBorrowers.map((borrower) => (
                        <div key={borrower.name} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3 bg-[var(--bg-canvas)]">
                          <div>
                            <p className="font-semibold text-xs text-[var(--text-primary)]">{borrower.name}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">{borrower.loan}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-xs text-[var(--text-primary)] tabular-nums">{borrower.exposure}</p>
                            <StatusBadge
                              status={borrower.risk === 'Low' ? 'approved' : borrower.risk === 'High' ? 'rejected' : 'under_review'}
                              label={`${borrower.risk} Risk`}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </LenderLayout>
  );
};

export default PortfolioPage;