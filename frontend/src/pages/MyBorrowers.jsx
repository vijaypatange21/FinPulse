import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LenderLayout from '../components/LenderLayout';
import { listBorrowers } from '../lib/api';

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
        setBorrowers(
          data.map((item) => ({
            id: item.id || item.borrower_id,
            name: item.name || 'Borrower',
            location: item.location || 'N/A',
            productType: item.productType || item.occupation || 'General',
            principal: formatMoney(item.principal),
            outstanding: formatMoney(item.outstanding),
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

  const filteredBorrowers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return borrowers.filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  }, [borrowers, searchQuery]);

  return (
    <LenderLayout activeSection="borrowers">
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Borrowers</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">{borrowers.length}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Disbursed</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">₹45.2 Cr</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Portfolio Health</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">94.2%</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overdue Count</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">{borrowers.filter((b) => b.status === 'Overdue').length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-[#f6f6f8] dark:bg-slate-800 border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-primary/50"
                placeholder="Search by name or borrower ID..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Borrower Name</th>
                  <th className="px-6 py-4">Borrower ID</th>
                  <th className="px-6 py-4">Profile Type</th>
                  <th className="px-6 py-4">Principal Amount</th>
                  <th className="px-6 py-4">Outstanding</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {isLoading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading borrowers...</td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-red-500">{error}</td>
                  </tr>
                )}
                {!isLoading && !error && filteredBorrowers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No borrowers found.</td>
                  </tr>
                )}
                {!isLoading && !error && filteredBorrowers.map((borrower) => (
                  <tr key={borrower.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{borrower.name}</p>
                      <p className="text-xs text-slate-500">{borrower.location}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{borrower.id}</td>
                    <td className="px-6 py-4 text-sm">{borrower.productType}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{borrower.principal}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{borrower.outstanding}</td>
                    <td className="px-6 py-4 text-sm">{borrower.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link to={`/lender/borrowers/${borrower.id}`} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors cursor-pointer" title="View Profile">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Showing {filteredBorrowers.length} of {borrowers.length} borrowers</p>
          </div>
        </div>
      </div>
    </LenderLayout>
  );
};

export default MyBorrowers;
