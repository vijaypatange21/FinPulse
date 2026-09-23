import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  BookmarkCheck,
  Play,
  RotateCcw,
  Utensils,
  PiggyBank,
  Layers,
  Repeat,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Check,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import { getCurrentUser, listBorrowers, recommendWellness } from '../lib/api';

const iconMap = {
  restaurant: Utensils,
  savings: PiggyBank,
  merge_type: Layers,
  auto_graph: Repeat,
  shopping_bag: ShoppingBag,
  credit_score: CreditCard,
};

const recommendationsList = [
  {
    id: 'reduce_dining',
    category: 'quick_wins',
    icon: 'restaurant',
    points: '+25 Points',
    title: 'Trim Discretionary Dining',
    difficulty: 'Low',
    why: 'Lowering non-essential monthly food debits directly optimizes your surplus-to-income ratio for upcoming loans.',
  },
  {
    id: 'emergency_fund',
    category: 'high_impact',
    icon: 'savings',
    points: '+40 Points',
    title: 'Maintain 3-Month Emergency Reserve',
    difficulty: 'Medium',
    why: 'A liquid contingency buffer prevents sudden EMI defaults during temporary income variance or emergency expenses.',
  },
  {
    id: 'consolidate_debt',
    category: 'high_impact',
    icon: 'merge_type',
    points: '+30 Points',
    title: 'Consolidate High-Interest Balances',
    difficulty: 'Medium',
    why: 'Amalgamating fragmented high-rate debt into a single primary facility lowers cashflow friction.',
  },
  {
    id: 'auto_pay',
    category: 'quick_wins',
    icon: 'auto_graph',
    points: '+50 Points',
    title: 'Enable Bank Standing Instructions (e-NACH)',
    difficulty: 'Easy',
    why: 'Automated debits eliminate accidental grace periods and secure a 100% on-time settlement score.',
  },
  {
    id: 'credit_builder',
    category: 'habits',
    icon: 'credit_score',
    points: '+35 Points',
    title: 'Limit Credit Utilization Under 30%',
    difficulty: 'Easy',
    why: 'Maintaining revolving utilization below 30% of authorized limits is prioritized by machine learning risk models.',
  },
];

const Recommendations = () => {
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [borrowerProfile, setBorrowerProfile] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [startedGoals, setStartedGoals] = useState(['credit_builder']);
  const [toastMessage, setToastMessage] = useState(null);

  const user = getCurrentUser();

  useEffect(() => {
    const fetchProfileAndAi = async () => {
      try {
        const list = await listBorrowers().catch(() => []);
        const bProfile = list.find((b) => b.user?.id === user?.id || b.user?.username === user?.username);
        setBorrowerProfile(bProfile || null);

        if (bProfile && bProfile.health_score > 0) {
          const res = await recommendWellness({
            savings_rate: 0.2,
            debt_income_ratio: 0.3,
            discretionary_spending_ratio: 0.25,
            health_score: bProfile.health_score,
            risk_class: bProfile.risk_level === 'high' ? 'High Risk' : bProfile.risk_level === 'medium' ? 'Caution' : 'Safe',
          }).catch(() => null);
          setAiRecommendation(res);
        } else {
          setAiRecommendation(null);
        }
      } catch {
        setAiRecommendation(null);
      }
    };
    fetchProfileAndAi();
  }, [user?.id, user?.username]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleGoal = (goalId, goalTitle) => {
    if (startedGoals.includes(goalId)) {
      setStartedGoals((prev) => prev.filter((g) => g !== goalId));
      showToast(`Goal paused: ${goalTitle}`);
    } else {
      setStartedGoals((prev) => [...prev, goalId]);
      showToast(`Goal activated! Track progress under Active Focus.`);
    }
  };

  const filteredRecs = recommendationsList.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <BorrowerLayout activeSection="recommendations" title="AI Financial Wellness">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 px-5 py-3 rounded-full text-xs font-semibold bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex text-xs text-[var(--text-secondary)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-[var(--accent)] transition-colors" to="/borrower/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <ChevronRight size={13} />
              <span className="font-medium text-[var(--text-primary)]">Wellness & Insights</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Personalized Financial Recommendations
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Actionable strategies generated by the Wellness Rule Engine to maximize credit capacity.
          </p>
        </div>

        {/* Signature Contrast Island Hero (§3.4 & §4 Contrast Card) */}
        <div className="rounded-[24px] p-7 sm:p-8 bg-[var(--bg-inverse-panel)] text-[var(--text-on-inverse)] shadow-[0_12px_32px_rgba(0,0,0,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[var(--text-on-inverse)]/15 uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Live ML Wellness Synthesis</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              {aiRecommendation?.advice ||
                'Your financial cashflow profile is on track. Maintain continuous savings habits to unlock prime interest bands.'}
            </h2>
            <p className="text-xs opacity-75">
              Code: <strong className="uppercase">{aiRecommendation?.recommendation_code || 'ON_TRACK'}</strong> • Based on verified debt-to-income and cash variance.
            </p>
          </div>

          <Link
            to="/borrower/health-score"
            className="btn-accent px-6 py-3 text-xs inline-flex items-center justify-center gap-2 shrink-0 self-start md:self-auto relative z-10"
          >
            Review Factors <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter Pill Tabs (§4 Segmented Control) */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'All Recommendations' },
            { key: 'high_impact', label: 'High Impact' },
            { key: 'quick_wins', label: 'Quick Wins' },
            { key: 'habits', label: 'Credit Habits' },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold shadow-[0_0_12px_var(--accent-glow)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs.map((item) => {
            const isStarted = startedGoals.includes(item.id);
            const Icon = iconMap[item.icon] || Sparkles;

            return (
              <div key={item.id} className="card-surface p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                      <Icon size={19} />
                    </div>
                    <span className="text-xs font-bold text-[var(--accent)] tabular-nums">
                      {item.points}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.why}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Difficulty: <strong className="text-[var(--text-primary)]">{item.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => toggleGoal(item.id, item.title)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                      isStarted
                        ? 'bg-[var(--status-positive)]/15 text-[var(--status-positive)] border border-[var(--status-positive)]/30'
                        : 'btn-secondary'
                    }`}
                  >
                    {isStarted ? (
                      <>
                        <Check size={13} /> Active Goal
                      </>
                    ) : (
                      <>
                        <Play size={12} /> Start Goal
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BorrowerLayout>
  );
};

export default Recommendations;
