import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

type TransactionType = 'Income' | 'Expense' | 'Transfer';

type TransactionItem = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  account: string;
  status: 'Completed' | 'Pending' | 'Flagged';
};

type MonthlyPoint = { month: string; income: number; expense: number };

type TransactionData = {
  summary: {
    totalInflow: string;
    totalOutflow: string;
    netCashflow: string;
    anomalyCount: number;
  };
  monthlyTrend: MonthlyPoint[];
  recentTransactions: TransactionItem[];
  categories: { name: string; total: string; percent: number }[];
  anomalies: string[];
};

const mockTransactionData: TransactionData = {
  summary: {
    totalInflow: '₹2,36,000',
    totalOutflow: '₹1,58,400',
    netCashflow: '₹77,600',
    anomalyCount: 2,
  },
  monthlyTrend: [
    { month: 'Jan', income: 34000, expense: 22400 },
    { month: 'Feb', income: 35500, expense: 24100 },
    { month: 'Mar', income: 38200, expense: 23800 },
    { month: 'Apr', income: 39500, expense: 25000 },
    { month: 'May', income: 41200, expense: 27500 },
    { month: 'Jun', income: 42100, expense: 25600 },
  ],
  recentTransactions: [
    { id: 'TX-9012', date: '11 Apr 2026', description: 'Salary Credit', category: 'Income', amount: 42000, type: 'Income', account: 'HDFC Salary A/C', status: 'Completed' },
    { id: 'TX-9011', date: '10 Apr 2026', description: 'Apartment Rent', category: 'Housing', amount: 18500, type: 'Expense', account: 'ICICI Savings', status: 'Completed' },
    { id: 'TX-9009', date: '09 Apr 2026', description: 'Auto EMI', category: 'Loan', amount: 19200, type: 'Expense', account: 'ICICI Savings', status: 'Completed' },
    { id: 'TX-9007', date: '08 Apr 2026', description: 'UPI to Grocery Store', category: 'Groceries', amount: 2450, type: 'Expense', account: 'ICICI Savings', status: 'Completed' },
    { id: 'TX-9004', date: '06 Apr 2026', description: 'Refund from retailer', category: 'Refund', amount: 1800, type: 'Income', account: 'HDFC Salary A/C', status: 'Completed' },
    { id: 'TX-9001', date: '04 Apr 2026', description: 'Unusual card swipe at electronics store', category: 'Card Purchase', amount: 28900, type: 'Expense', account: 'Axis Credit Card', status: 'Flagged' },
  ],
  categories: [
    { name: 'Housing', total: '₹18,500', percent: 29 },
    { name: 'Loans', total: '₹19,200', percent: 30 },
    { name: 'Groceries', total: '₹12,900', percent: 20 },
    { name: 'Transport', total: '₹6,400', percent: 10 },
    { name: 'Lifestyle', total: '₹7,100', percent: 11 },
  ],
  anomalies: [
    'A card purchase of ₹28,900 was flagged due to unusual merchant location.',
    'Cash withdrawal activity is 22% higher than your typical monthly average.',
  ],
};

const typeStyle: Record<TransactionType, string> = {
  Income: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Expense: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Transfer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusStyle: Record<TransactionItem['status'], string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/40',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  Flagged: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40',
};

const NavSidebar = () => (
  <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20">
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#2262ec] rounded-lg flex items-center justify-center">
        <span className="material-icons text-white">insights</span>
      </div>
      <span className="text-xl font-bold tracking-tight text-[#2262ec]">FinPulse</span>
    </div>
    <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/dashboard"><span className="material-icons">dashboard</span>Dashboard</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/health-score"><span className="material-icons">favorite</span>My Health Score</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/recommendations"><span className="material-icons">auto_awesome</span>Recommendations</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/upload"><span className="material-icons">description</span>Documents</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/find-lender"><span className="material-icons">search</span>Find Lenders</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/loans"><span className="material-icons">account_balance</span>Loans</Link>
      <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/transactions"><span className="material-icons">analytics</span>Transactions</Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#"><span className="material-icons">settings</span>Settings</Link>
      <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login"><span className="material-icons">logout</span>Log Out</Link>
    </nav>
    <div className="p-4 mt-auto">
      <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help reviewing transactions?</p>
        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Contact Expert</button>
      </div>
    </div>
  </aside>
);

const TransactionTrend = ({ points }: { points: MonthlyPoint[] }) => {
  const incomePath = useMemo(() => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${100 - (p.income / 50000) * 100}`).join(' '), [points]);
  const expensePath = useMemo(() => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${100 - (p.expense / 50000) * 100}`).join(' '), [points]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-64 overflow-visible">
      {[20, 40, 60, 80].map((tick) => <line key={tick} x1="0" x2="100" y1={tick} y2={tick} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />)}
      <path d={expensePath} fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={incomePath} fill="none" stroke="#2262ec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        return <circle key={p.month} cx={x} cy={100 - (p.income / 50000) * 100} r="2.2" fill="#2262ec" />;
      })}
    </svg>
  );
};

const TransactionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TransactionData | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setData(mockTransactionData);
      setLoading(false);
    }, 550);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <NavSidebar />
      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold">Transactions</h1>
            <p className="text-sm text-slate-500">Monitor inflow, outflow, and unusual activity in one place.</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <span className="material-icons text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right flex flex-col justify-center">
                <p className="text-sm font-semibold leading-tight">Jonathan Doe</p>
                <p className="text-xs text-slate-500 italic leading-tight">Premium Borrower</p>
              </div>
              <img alt="User profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXlOr5gEy6Odf5E0XG75fdX9iJGZuS8GogdcGueycEPpns-h7Mi862_Q1EcNCjkK5VzqnGymt5xd6cSYpVzTpPOS0yM7-9MHvDjH9ppp-R8UkxuAgiyGyqtlHMLCTsK7Lv0IgwLUXkeS1GSvVgBcehU4Spgw4SjKOabyOzMfvUjhwdbh9Wr7APEnPZZfZjHYcUUa89J3W1xgtlnMAd6qst9IvI7fmSU5qLRkW4iUeZARbUsAeaFUIHhr7uUQtrW2As9Kv7WPE1OJs" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Transactions</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">View money movement, category spend, and anomaly signals tied to your financial health.</p>
          </div>

          {loading || !data ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
              <div className="lg:col-span-3 h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
              <div className="lg:col-span-3 h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
              <div className="lg:col-span-3 h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
              <div className="lg:col-span-3 h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Inflow</p><p className="mt-3 text-3xl font-extrabold">{data.summary.totalInflow}</p><p className="mt-2 text-sm text-slate-500">Salary credits and refunds.</p></CardContent></Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outflow</p><p className="mt-3 text-3xl font-extrabold">{data.summary.totalOutflow}</p><p className="mt-2 text-sm text-slate-500">Bills, EMI, and lifestyle spending.</p></CardContent></Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Cashflow</p><p className="mt-3 text-3xl font-extrabold text-[#2262ec]">{data.summary.netCashflow}</p><p className="mt-2 text-sm text-slate-500">Positive cash generation this period.</p></CardContent></Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Anomaly Alerts</p><p className="mt-3 text-3xl font-extrabold text-red-600 dark:text-red-400">{data.summary.anomalyCount}</p><p className="mt-2 text-sm text-slate-500">Potentially unusual activity to review.</p></CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold">Cashflow trend</h3>
                  </CardHeader>
                  <CardContent>
                    <TransactionTrend points={data.monthlyTrend} />
                    <div className="mt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2262ec]"></span>Income</span>
                      <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>Expenses</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold">Category spend</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.categories.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{cat.total}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-[#2262ec]" style={{ width: `${cat.percent}%` }} /></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Recent transactions</h3>
                      <p className="text-sm text-slate-500 mt-1">Latest entries from connected accounts</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Export CSV</button>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Date</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.recentTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                              <p className="text-xs text-slate-500 mt-1">{tx.account} • {tx.id}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${typeStyle[tx.type]}`}>{tx.category}</span>
                            </td>
                            <td className={`px-6 py-4 font-bold ${tx.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>{tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[tx.status]}`}>{tx.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold">Anomaly insights</h3>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      {data.anomalies.map((item) => (
                        <div key={item} className="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4">
                          {item}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-slate-100 dark:border-slate-800"><h3 className="text-lg font-bold">Insights</h3></CardHeader>
                    <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      <p>Your salary credit is strong enough to keep your cashflow positive after EMI and rent payments.</p>
                      <p>Reducing irregular high-value card spends will help lower risk flags and improve financial consistency over time.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;