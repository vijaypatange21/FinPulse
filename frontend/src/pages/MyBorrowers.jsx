import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listBorrowers } from '../lib/api';
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

const MyBorrowers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowers, setBorrowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBorrowers = async () => {
      try {
        const data = await listBorrowers();
        const bList = Array.isArray(data) ? data : (data?.results || []);
        setBorrowers(
          bList.map((item) => ({
            id: item.id || item.borrower_id,
            name: item.name || 'Borrower',
            location: item.location || 'N/A',
            productType: item.productType || item.occupation || 'General',
            rawPrincipal: Number(item.principal || item.principal_amount || 0),
            principal: formatMoney(item.principal || item.principal_amount),
            outstanding: formatMoney(item.outstanding || item.outstanding_amount),
            nextEmi: item.nextEmi || item.nextEmiDate || 'TBD',
            status: item.status || 'On Track',
            riskScore: item.healthScore || item.riskScore || 650,
          })),
        );
      } catch (err) {
        setError(err.message || 'Unable to load borrowers.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBorrowers();
  }, []);

  const totalDisbursed = borrowers.reduce((sum, b) => sum + b.rawPrincipal, 0);
  const onTrackCount = borrowers.filter((b) => b.status === 'On Track' || b.status === 'Good').length;
  const healthPercent = borrowers.length > 0 ? Math.round((onTrackCount / borrowers.length) * 100) : null;
  const overdueCount = borrowers.filter((b) => b.status === 'Overdue' || b.status === 'Late').length;

  const filteredBorrowers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return borrowers.filter((b) => b.name.toLowerCase().includes(q) || String(b.id).toLowerCase().includes(q));
  }, [borrowers, searchQuery]);

  return (
    <LenderLayout activeSection="borrowers">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
              Portfolio Portfolio Registry
            </span>
            <h1 className="font-clash text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-1">
              Active Borrowers
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Live roster of verified borrowers with active and historical credit facilities
            </p>
          </div>
        </div>

        {/* Bento Stat Grid: 3 Quiet + 1 Contrast Island */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ContrastCard className="p-5 flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">Total Disbursed</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                {formatMoney(totalDisbursed)}
              </span>
              <p className="text-[11px] opacity-75 mt-0.5 font-medium">Across active accounts</p>
            </div>
          </ContrastCard>

          <Card className="p-5 flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Total Borrowers</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                {borrowers.length}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Under institutional monitoring</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Portfolio Health</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--status-success)]">
                {healthPercent !== null ? `${healthPercent}%` : 'N/A'}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">On-track repayments</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">Overdue Flags</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--status-error)]">
                {overdueCount}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Delayed EMI installments</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base">
              search
            </span>
            <input
              className="pl-9 pr-4 py-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-pill)] text-xs w-full focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              placeholder="Search by name or borrower ID..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto min-h-[360px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[var(--bg-canvas)]/40 text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-3.5">Borrower Name</th>
                  <th className="px-6 py-3.5">Borrower ID</th>
                  <th className="px-6 py-3.5">Profile Type</th>
                  <th className="px-6 py-3.5 text-right">Principal</th>
                  <th className="px-6 py-3.5 text-right">Outstanding</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
                {isLoading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-xs text-[var(--text-muted)]">
                      Loading borrowers...
                    </td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-xs text-[var(--status-error)]">
                      {error}
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filteredBorrowers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-xs text-[var(--text-muted)]">
                      No borrowers found.
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filteredBorrowers.map((borrower) => (
                  <tr key={borrower.id} className="h-14 hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                          {borrower.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[var(--text-primary)]">{borrower.name}</p>
                          <p className="text-[11px] text-[var(--text-secondary)]">{borrower.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                      #{String(borrower.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[var(--text-primary)]">{borrower.productType}</td>
                    <td className="px-6 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                      {borrower.principal}
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs font-semibold tabular-nums text-[var(--accent)]">
                      {borrower.outstanding}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge
                        status={borrower.status === 'On Track' || borrower.status === 'Good' ? 'approved' : 'rejected'}
                        label={borrower.status}
                      />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/lender/borrowers/${borrower.id}`}
                        className="px-3 py-1.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all inline-flex items-center gap-1"
                      >
                        Profile <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </LenderLayout>
  );
};

export default MyBorrowers;
