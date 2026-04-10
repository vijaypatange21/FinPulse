import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

type RiskLabel = 'Low' | 'Medium' | 'High';

type BreakdownItem = {
  factor: string;
  impact: number;
  type: 'positive' | 'negative';
};

type HistoryPoint = {
  month: string;
  score: number;
};

type HealthScoreData = {
  score: number;
  risk_label: RiskLabel;
  breakdown: BreakdownItem[];
  history: HistoryPoint[];
  average_score: number;
};

const mockHealthScoreData: HealthScoreData = {
  score: 72,
  risk_label: 'Low',
  breakdown: [
    { factor: 'Savings Rate', impact: 8, type: 'positive' },
    { factor: 'EMI / Income Ratio', impact: -12, type: 'negative' },
    { factor: 'Cashflow Volatility', impact: -6, type: 'negative' },
    { factor: 'Missed EMIs', impact: -10, type: 'negative' },
    { factor: 'Credit History Length', impact: 12, type: 'positive' },
  ],
  history: [
    { month: 'Jan', score: 60 },
    { month: 'Feb', score: 65 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 72 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 72 },
  ],
  average_score: 66,
};

const riskStyles: Record<RiskLabel, { badge: string; accent: string }> = {
  Low: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/40',
    accent: 'text-green-600',
  },
  Medium: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
    accent: 'text-amber-600',
  },
  High: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40',
    accent: 'text-red-600',
  },
};

const riskDotClass = (label: RiskLabel) => {
  if (label === 'Low') return 'bg-green-500';
  if (label === 'Medium') return 'bg-amber-500';
  return 'bg-red-500';
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
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/dashboard">
        <span className="material-icons">dashboard</span>
        Dashboard
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/health-score">
        <span className="material-icons">favorite</span>
        My Health Score
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/recommendations">
        <span className="material-icons">auto_awesome</span>
        Recommendations
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/upload">
        <span className="material-icons">description</span>
        Documents
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/find-lender">
        <span className="material-icons">search</span>
        Find Lenders
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
        <span className="material-icons">account_balance</span>
        Loans
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
        <span className="material-icons">analytics</span>
        Transactions
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
        <span className="material-icons">settings</span>
        Settings
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
        <span className="material-icons">logout</span>
        Log Out
      </Link>
    </nav>
    <div className="p-4 mt-auto">
      <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help with your application?</p>
        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Contact Expert</button>
      </div>
    </div>
  </aside>
);

const HealthGauge = ({ score, riskLabel }: { score: number; riskLabel: RiskLabel }) => {
  const risk = riskStyles[riskLabel];
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-64 h-64 -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-100 dark:text-slate-800" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className={risk.accent}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-6xl font-extrabold text-slate-900 dark:text-white">{score}</span>
        <span className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-[0.18em] ${risk.badge}`}>
          <span className={`size-2 rounded-full ${riskDotClass(riskLabel)}`} />
          {riskLabel} Risk
        </span>
      </div>
    </div>
  );
};

const ScoreHistoryChart = ({ history }: { history: HistoryPoint[] }) => {
  const points = useMemo(() => {
    if (!history.length) return '';
    return history
      .map((point, index) => {
        const x = history.length === 1 ? 50 : (index / (history.length - 1)) * 100;
        const y = 100 - point.score;
        return `${x},${y}`;
      })
      .join(' ');
  }, [history]);

  return (
    <div className="w-full">
      <svg viewBox="0 0 100 100" className="w-full h-64 overflow-visible">
        {[20, 40, 60, 80].map((tick) => (
          <line key={tick} x1="0" x2="100" y1={tick} y2={tick} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
        ))}
        <polyline fill="none" stroke="#2262ec" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
        {history.map((point, index) => {
          const x = history.length === 1 ? 50 : (index / (history.length - 1)) * 100;
          const y = 100 - point.score;
          return <circle key={point.month} cx={x} cy={y} r="2.5" fill="#2262ec" />;
        })}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
        {history.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
};

const HealthScorePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthScoreData | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setData(mockHealthScoreData);
      setLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  const risk = data ? riskStyles[data.risk_label] : riskStyles.Low;

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <NavSidebar />

      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold">Health Score</h1>
            <p className="text-sm text-slate-500">Detailed view of your FinPulse financial health profile.</p>
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Health Score</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">A detailed summary of your score, what affects it, and how it moves over time.</p>
          </div>

          {loading || !data ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
              <Card className="lg:col-span-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardContent className="p-8">
                  <div className="mx-auto h-64 w-64 rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="mt-6 h-6 w-40 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="mt-3 h-4 w-56 rounded bg-slate-100 dark:bg-slate-800" />
                </CardContent>
              </Card>
              <Card className="lg:col-span-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="h-6 w-48 rounded bg-slate-100 dark:bg-slate-800" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Financial Health Score</p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Current standing</h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${risk.badge}`}>{data.risk_label} Risk</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 flex flex-col items-center">
                    <HealthGauge score={data.score} riskLabel={data.risk_label} />
                    <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                      Your score reflects savings behavior, repayment discipline, cashflow consistency, and overall credit history.
                    </p>
                  </CardContent>
                </Card>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                    <CardHeader className="border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Comparison</h3>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your score</p>
                        <p className={`mt-2 text-4xl font-extrabold ${risk.accent}`}>{data.score}</p>
                        <p className="mt-2 text-sm text-slate-500">Currently above the platform average.</p>
                      </div>
                      <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Platform average</p>
                        <p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">{data.average_score}</p>
                        <p className="mt-2 text-sm text-slate-500">An average borrower in the current cohort.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                    <CardHeader className="border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Insights</h3>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      <p>
                        A score in the low-risk range means your borrowing profile is generally stable and should qualify for competitive lending terms.
                      </p>
                      <p>
                        To improve it, focus on reducing your EMI-to-income ratio, maintaining steady savings, and avoiding missed payments over the next few cycles.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Score breakdown</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.breakdown.map((item) => {
                      const isPositive = item.type === 'positive';
                      const intensity = Math.min(100, Math.abs(item.impact) * 8);
                      return (
                        <div key={item.factor} className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{item.factor}</p>
                              <p className="text-xs text-slate-500">{isPositive ? 'Positive influence' : 'Negative influence'}</p>
                            </div>
                            <span className={`text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {item.impact > 0 ? '+' : ''}{item.impact}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${intensity}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Score history</h3>
                      <p className="text-sm text-slate-500 mt-1">Monthly trend over the last six months</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${risk.badge}`}>
                      <span className={`size-2 rounded-full ${riskDotClass(data.risk_label)}`} />
                      Trending stable
                    </span>
                  </CardHeader>
                  <CardContent>
                    <ScoreHistoryChart history={data.history} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HealthScorePage;