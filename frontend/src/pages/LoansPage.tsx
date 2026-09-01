import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { getCurrentUser, listApplications } from '../lib/api';

type LoanStatus = 'On Track' | 'Due Soon' | 'Grace Period' | 'Closed';

type LoanItem = {
  id: string;
  name: string;
  type: string;
  lender: string;
  principal: string;
  outstanding: string;
  emiAmount: string;
  interestRate: string;
  nextDue: string;
  remainingTenure: string;
  progress: number;
  status: LoanStatus;
  autopay: boolean;
};

type EMIItem = {
  month: string;
  dueDate: string;
  amount: string;
  status: 'Paid' | 'Upcoming' | 'Late';
};

type LoansData = {
  summary: {
    activeLoans: number;
    totalOutstanding: string;
    nextPayment: string;
    onTimeRate: string;
  };
  loans: LoanItem[];
  schedule: EMIItem[];
  averageEmi: string;
};

const mockLoansData: LoansData = {
  summary: {
    activeLoans: 3,
    totalOutstanding: '₹53,30,000',
    nextPayment: '₹32,500 due in 4 days',
    onTimeRate: '97%',
  },
  loans: [
    {
      id: 'LN-24091',
      name: 'Primary Home Loan',
      type: 'Home',
      lender: 'Horizon Bank',
      principal: '₹50,00,000',
      outstanding: '₹38,20,000',
      emiAmount: '₹48,200',
      interestRate: '8.75% p.a.',
      nextDue: '28 Oct 2023',
      remainingTenure: '86 months',
      progress: 24,
      status: 'Grace Period',
      autopay: true,
    },
    {
      id: 'LN-44108',
      name: 'Vehicle Loan',
      type: 'Vehicle',
      lender: 'Drive Finance',
      principal: '₹8,00,000',
      outstanding: '₹6,15,000',
      emiAmount: '₹19,200',
      interestRate: '12% p.a.',
      nextDue: '15 Oct 2023',
      remainingTenure: '32 months',
      progress: 23,
      status: 'On Track',
      autopay: false,
    },
    {
      id: 'LN-82114',
      name: 'Education Loan',
      type: 'Education',
      lender: 'Future Scholars Co.',
      principal: '₹12,00,000',
      outstanding: '₹8,95,000',
      emiAmount: '₹22,800',
      interestRate: '9% p.a.',
      nextDue: '02 Nov 2023',
      remainingTenure: '48 months',
      progress: 33,
      status: 'Due Soon',
      autopay: true,
    },
  ],
  schedule: [
    { month: 'Sep', dueDate: '15 Sep', amount: '₹19,200', status: 'Paid' },
    { month: 'Oct', dueDate: '15 Oct', amount: '₹19,200', status: 'Upcoming' },
    { month: 'Oct', dueDate: '28 Oct', amount: '₹48,200', status: 'Upcoming' },
    { month: 'Nov', dueDate: '02 Nov', amount: '₹22,800', status: 'Upcoming' },
  ],
  averageEmi: '₹30,067',
};

const loanStatusStyles: Record<LoanStatus, string> = {
  'On Track': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/40',
  'Due Soon': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  'Grace Period': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
  Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
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
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/health-score">
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
      <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/loans">
        <span className="material-icons">account_balance</span>
        Loans
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/transactions">
        <span className="material-icons">analytics</span>
        Transactions
      </Link>
      <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
        <span className="material-icons">logout</span>
        Log Out
      </Link>
    </nav>
    <div className="p-4 mt-auto">
      <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help with your repayment plan?</p>
        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Contact Expert</button>
      </div>
    </div>
  </aside>
);

const LoansPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LoansData | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadLoans = async () => {
      const user = getCurrentUser();
      setCurrentUser(user);

      try {
        const apps = await listApplications().catch(() => []);
        const approvedLoans = apps.filter((a: any) => a.status === 'approved');

        if (approvedLoans.length > 0) {
          const totalAmt = approvedLoans.reduce((sum: number, l: any) => sum + Number(l.amount || l.requested_amount || 0), 0);
          setData({
            summary: {
              activeLoans: approvedLoans.length,
              totalOutstanding: `₹${totalAmt.toLocaleString('en-IN')}`,
              nextPayment: 'No upcoming payment',
              onTimeRate: '100%',
            },
            loans: approvedLoans.map((l: any) => ({
              id: `LN-${String(l.id || l.application_id).slice(0, 5)}`,
              name: `${l.loanType || l.loan_type || 'Personal'} Loan`,
              type: l.loanType || l.loan_type || 'Personal',
              lender: l.preferred_lender?.institution_name || 'FinPulse Partner Bank',
              principal: `₹${Number(l.amount || l.requested_amount || 0).toLocaleString('en-IN')}`,
              outstanding: `₹${Number(l.amount || l.requested_amount || 0).toLocaleString('en-IN')}`,
              emiAmount: `₹${Math.round(Number(l.amount || l.requested_amount || 0) / (Number(l.tenure || l.requested_tenure_months || 12))).toLocaleString('en-IN')}`,
              interestRate: '10.5% p.a.',
              nextDue: 'Next month',
              remainingTenure: `${l.tenure || l.requested_tenure_months || 12} months`,
              progress: 0,
              status: 'On Track' as LoanStatus,
              autopay: true,
            })),
            schedule: [],
            averageEmi: '₹0',
          });
        } else {
          // Clean empty state for new borrower
          setData({
            summary: {
              activeLoans: 0,
              totalOutstanding: '₹0',
              nextPayment: 'N/A',
              onTimeRate: 'N/A',
            },
            loans: [],
            schedule: [],
            averageEmi: '₹0',
          });
        }
      } catch {
        setData({
          summary: {
            activeLoans: 0,
            totalOutstanding: '₹0',
            nextPayment: 'N/A',
            onTimeRate: 'N/A',
          },
          loans: [],
          schedule: [],
          averageEmi: '₹0',
        });
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  const averageProgress = useMemo(() => {
    if (!data || !data.loans.length) return 0;
    return Math.round(data.loans.reduce((sum, loan) => sum + loan.progress, 0) / data.loans.length);
  }, [data]);

  const displayName = currentUser ? (`${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username) : 'Borrower';

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100 antialiased">
      <NavSidebar />

      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold">Loans</h1>
            <p className="text-sm text-slate-500">Track active loans, repayment progress, and upcoming EMIs.</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <span className="material-icons text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right flex flex-col justify-center">
                <p className="text-sm font-semibold leading-tight">{displayName}</p>
                <p className="text-xs text-slate-500 italic leading-tight">Borrower</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2262ec] text-white flex items-center justify-center font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Loans</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">A consolidated view of your active loans, payment progress, and repayment schedule.</p>
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
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Loans</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{data.summary.activeLoans}</p>
                    <p className="mt-2 text-sm text-slate-500">Across home, vehicle, and education financing.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outstanding</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{data.summary.totalOutstanding}</p>
                    <p className="mt-2 text-sm text-slate-500">Combined remaining principal.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Payment</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{data.summary.nextPayment}</p>
                    <p className="mt-2 text-sm text-slate-500">{data.loans.length > 0 ? 'Due on your active loan facility.' : 'No upcoming payments due.'}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">On-time Rate</p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{data.summary.onTimeRate}</p>
                    <p className="mt-2 text-sm text-slate-500">{data.loans.length > 0 ? `Average EMI progress: ${averageProgress}% paid.` : 'No repayment history yet.'}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active loans</h3>
                      <p className="text-sm text-slate-500 mt-1">Repayment status and loan-level progress</p>
                    </div>
                    <Link to="/loan-application" className="px-4 py-2 rounded-lg bg-[#2262ec] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Apply New
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.loans.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#2262ec] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-icons text-3xl">account_balance</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Loans</h4>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">You currently have no active borrowing facilities. Submit an application to get started.</p>
                        <Link to="/loan-application" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2262ec] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          <span className="material-icons text-sm">add</span> Apply for Loan
                        </Link>
                      </div>
                    ) : (
                      data.loans.map((loan) => (
                      <div key={loan.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-5">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{loan.name}</h4>
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${loanStatusStyles[loan.status]}`}>{loan.status}</span>
                              {loan.autopay && <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">Autopay Enabled</span>}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{loan.id} • {loan.lender} • {loan.type} loan</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Outstanding</p>
                              <p className="font-bold text-slate-900 dark:text-white mt-1">{loan.outstanding}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">EMI</p>
                              <p className="font-bold text-slate-900 dark:text-white mt-1">{loan.emiAmount}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Interest</p>
                              <p className="font-bold text-slate-900 dark:text-white mt-1">{loan.interestRate}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Next Due</p>
                              <p className="font-bold text-slate-900 dark:text-white mt-1">{loan.nextDue}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            <span>Repayment progress</span>
                            <span>{loan.progress}% paid</span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#2262ec] to-blue-400" style={{ width: `${loan.progress}%` }} />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
                          <p>Original principal: <span className="font-semibold text-slate-900 dark:text-white">{loan.principal}</span> • Remaining tenure: <span className="font-semibold text-slate-900 dark:text-white">{loan.remainingTenure}</span></p>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">View Schedule</button>
                            <button className="px-4 py-2 rounded-lg bg-[#2262ec] text-white font-semibold hover:bg-blue-700 transition-colors">Pay EMI</button>
                          </div>
                        </div>
                      </div>
                    )))}
                  </CardContent>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming EMIs</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.schedule.length === 0 ? (
                        <p className="text-sm text-slate-500 py-4 text-center">No upcoming EMIs scheduled.</p>
                      ) : (
                        data.schedule.map((item) => (
                        <div key={`${item.month}-${item.dueDate}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-800/30">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{item.dueDate}</p>
                            <p className="text-xs text-slate-500">{item.month}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">{item.amount}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'Paid' ? 'text-green-600 dark:text-green-400' : item.status === 'Late' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>{item.status}</span>
                          </div>
                        </div>
                      )))}
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick actions</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#2262ec]/40 hover:bg-[#2262ec]/5 transition-all text-left">
                        <span className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><span className="material-icons text-[#2262ec]">download</span> Download statements</span>
                        <span className="material-icons text-slate-400">arrow_forward</span>
                      </button>
                      <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#2262ec]/40 hover:bg-[#2262ec]/5 transition-all text-left">
                        <span className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><span className="material-icons text-[#2262ec]">notifications_active</span> Set EMI reminder</span>
                        <span className="material-icons text-slate-400">arrow_forward</span>
                      </button>
                      <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#2262ec]/40 hover:bg-[#2262ec]/5 transition-all text-left">
                        <span className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><span className="material-icons text-[#2262ec]">schedule</span> Foreclosure calculator</span>
                        <span className="material-icons text-slate-400">arrow_forward</span>
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Repayment health insights</h3>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>Your overall repayment profile is stable, but the home loan is the main item to watch because it has the highest outstanding balance and a grace period note.</p>
                    <p>Keeping auto-pay enabled on all eligible loans and reducing your high-value EMI concentration will improve your debt-to-income ratio and keep your score in the low-risk range.</p>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader className="border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Loan overview</h3>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Average EMI</span>
                      <span className="font-bold text-slate-900 dark:text-white">{data.averageEmi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Autopay enabled</span>
                      <span className="font-bold text-green-600 dark:text-green-400">2 of 3 loans</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Next review</span>
                      <span className="font-bold text-slate-900 dark:text-white">End of month</span>
                    </div>
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

export default LoansPage;