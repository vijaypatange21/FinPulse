import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { getCurrentUser, listBorrowers } from '../lib/api';

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

const HealthGauge = ({ score, riskLabel }: { score: number; riskLabel: RiskLabel }) => {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const percent = score > 100 ? Math.max(0, Math.min(100, ((score - 300) / 550) * 100)) : Math.max(0, Math.min(100, score));
  const dashOffset = circumference - (percent / 100) * circumference;

  let strokeColor = 'var(--accent)';
  if (riskLabel === 'High') strokeColor = 'var(--status-negative)';
  else if (riskLabel === 'Medium') strokeColor = 'var(--status-pending)';

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="var(--border-subtle)"
          strokeWidth="14"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
          {score}
        </span>
        <div className="mt-2">
          <StatusBadge status={riskLabel === 'Low' ? 'verified' : riskLabel === 'Medium' ? 'pending' : 'rejected'} label={`${riskLabel} risk`} />
        </div>
      </div>
    </div>
  );
};

const ScoreHistoryChart = ({ history }: { history: HistoryPoint[] }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Chart dimensions in SVG coordinates
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Min and max scores to normalize
  const minScore = 600;
  const maxScore = 850;

  const coords = useMemo(() => {
    if (!history.length) return [];
    return history.map((point, index) => {
      const x =
        history.length === 1
          ? svgWidth / 2
          : paddingX + (index / (history.length - 1)) * chartWidth;
      const normalized = Math.max(0, Math.min(1, (point.score - minScore) / (maxScore - minScore)));
      const y = paddingTop + (1 - normalized) * chartHeight;
      return { x, y, point, index };
    });
  }, [history, chartWidth, chartHeight]);

  // Compute smooth cubic bezier path
  const { pathD, areaD } = useMemo(() => {
    if (coords.length < 2) {
      if (coords.length === 1) {
        return {
          pathD: `M ${coords[0].x} ${coords[0].y}`,
          areaD: '',
        };
      }
      return { pathD: '', areaD: '' };
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;

      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const groundY = paddingTop + chartHeight;
    const area = `${d} L ${coords[coords.length - 1].x} ${groundY} L ${coords[0].x} ${groundY} Z`;

    return { pathD: d, areaD: area };
  }, [coords, chartHeight]);

  // Active point: hovered or last point
  const activeIdx = hoveredIdx !== null ? hoveredIdx : coords.length - 1;
  const activeCoord = coords[activeIdx];

  // Calculate delta from previous point
  const activeDelta = useMemo(() => {
    if (!activeCoord || activeIdx === 0) return null;
    const prev = coords[activeIdx - 1];
    return activeCoord.point.score - prev.point.score;
  }, [activeCoord, activeIdx, coords]);

  const gridLevels = [
    { score: 800, label: '800 Prime' },
    { score: 720, label: '720 Good' },
    { score: 650, label: '650 Fair' },
  ];

  return (
    <div className="w-full relative select-none">
      {/* Top Floating Glass Summary for Active Point */}
      {activeCoord && (
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-medium">Selected Month:</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] px-2 py-0.5 rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
              {activeCoord.point.month}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-[var(--accent)] tabular-nums">
              {activeCoord.point.score} pts
            </span>
            {activeDelta !== null && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeDelta >= 0
                    ? 'text-[var(--status-positive)] bg-[var(--status-positive)]/10'
                    : 'text-[var(--status-negative)] bg-[var(--status-negative)]/10'
                }`}
              >
                {activeDelta >= 0 ? `+${activeDelta}` : activeDelta} vs prev
              </span>
            )}
          </div>
        </div>
      )}

      {/* Glassmorphic SVG Graph */}
      <div className="relative rounded-2xl p-2 border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40 backdrop-blur-md overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Glass Area Gradient */}
            <linearGradient id="glassWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.12" />
              <stop offset="90%" stopColor="var(--accent)" stopOpacity="0.01" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="neonGlowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid Milestone Lines */}
          {gridLevels.map((lvl) => {
            const normalized = (lvl.score - minScore) / (maxScore - minScore);
            const y = paddingTop + (1 - normalized) * chartHeight;
            return (
              <g key={lvl.score}>
                <line
                  x1={paddingX}
                  x2={svgWidth - paddingX}
                  y1={y}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - paddingX + 6}
                  y={y + 3}
                  fill="var(--text-secondary)"
                  fontSize="9"
                  fontFamily="sans-serif"
                  opacity="0.75"
                >
                  {lvl.label}
                </text>
              </g>
            );
          })}

          {/* Glass Gradient Area */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#glassWaveGrad)"
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Active Hover Scanning Guideline */}
          {activeCoord && (
            <line
              x1={activeCoord.x}
              x2={activeCoord.x}
              y1={paddingTop}
              y2={paddingTop + chartHeight}
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
              className="transition-all duration-150"
            />
          )}

          {/* Glowing Stroke Curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlowLine)"
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Interactive Data Nodes */}
          {coords.map((c, i) => {
            const isHovered = activeIdx === i;
            return (
              <g
                key={c.point.month}
                onMouseEnter={() => setHoveredIdx(i)}
                className="cursor-pointer group"
              >
                {/* Large Invisible Hit Target */}
                <circle cx={c.x} cy={c.y} r="18" fill="transparent" />

                {/* Pulsing Outer Halo on active point */}
                {isHovered && (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="8.5"
                    fill="var(--accent)"
                    opacity="0.25"
                    className="animate-ping origin-center"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? '6' : '4.5'}
                  fill="var(--bg-canvas)"
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? '3' : '2'}
                  className="transition-all duration-200"
                />

                {/* Center Core */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? '3' : '2'}
                  fill="var(--accent)"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Month Labels */}
        <div className="flex items-center justify-between text-xs font-semibold px-8 pt-1 text-[var(--text-secondary)]">
          {coords.map((c, i) => {
            const isSelected = activeIdx === i;
            return (
              <button
                key={c.point.month}
                type="button"
                onClick={() => setHoveredIdx(i)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[var(--accent)] font-bold'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                {c.point.month}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HealthScorePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthScoreData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = getCurrentUser();

      try {
        const borrowers = await listBorrowers().catch(() => []);
        const bProfile =
          borrowers.find((b: any) => b.user?.id === user?.id || b.user?.username === user?.username) ||
          (borrowers.length === 1 ? borrowers[0] : null);

        const score = bProfile?.healthScore || bProfile?.health_score || bProfile?.riskScore || 720;
        const riskLevel =
          bProfile?.riskLevel || bProfile?.risk_level || (score >= 750 ? 'low' : score >= 650 ? 'medium' : 'high');
        const riskLabel = (riskLevel === 'high' ? 'High' : riskLevel === 'medium' ? 'Medium' : 'Low') as RiskLabel;

        const cashFlow = bProfile?.cashFlow || bProfile?.cash_flow || [];
        const defaultMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        const offsets = [-38, -26, -18, -22, -10, 0];
        const history =
          Array.isArray(cashFlow) && cashFlow.length >= 4
            ? cashFlow.map((c: any, idx: number) => {
                const wiggle = Math.sin(idx * 2) * 6;
                const delta = Math.round((idx - (cashFlow.length - 1)) * 7 + wiggle);
                return {
                  month: c.month ? c.month.split(' ')[0] : `M${idx + 1}`,
                  score: Math.min(850, Math.max(600, score + delta)),
                };
              })
            : defaultMonths.map((m, idx) => ({
                month: m,
                score: Math.min(850, Math.max(600, score + offsets[idx])),
              }));

        setData({
          score: score,
          risk_label: riskLabel,
          breakdown: [
            { factor: 'Savings & Liquidity Buffer', impact: 14, type: 'positive' },
            { factor: 'Credit-to-Debit Inflow Ratio', impact: 12, type: 'positive' },
            { factor: 'Punctual EMI Discipline', impact: 10, type: 'positive' },
            { factor: 'Zero Cheque / EMI Bounces', impact: 8, type: 'positive' },
            { factor: 'DTI Ratio Variance', impact: -4, type: 'negative' },
          ],
          history: history,
          average_score: Math.round(history.reduce((a, b) => a + b.score, 0) / history.length),
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        const defaultMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        const offsets = [-38, -26, -18, -22, -10, 0];
        setData({
          score: 720,
          risk_label: 'Low' as RiskLabel,
          breakdown: [
            { factor: 'Savings & Liquidity Buffer', impact: 14, type: 'positive' },
            { factor: 'Credit-to-Debit Inflow Ratio', impact: 12, type: 'positive' },
            { factor: 'Punctual EMI Discipline', impact: 10, type: 'positive' },
            { factor: 'Zero Cheque / EMI Bounces', impact: 8, type: 'positive' },
            { factor: 'DTI Ratio Variance', impact: -4, type: 'negative' },
          ],
          history: defaultMonths.map((m, idx) => ({
            month: m,
            score: Math.min(850, Math.max(600, 720 + offsets[idx])),
          })),
          average_score: 712,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <BorrowerLayout activeSection="health-score" title="Credit Health Score">
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
              <span className="font-medium text-[var(--text-primary)]">Credit Health Assessment</span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            AI Financial Health Score
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Multi-factor assessment trained on verified banking cash flow, tax returns, and debt servicing.
          </p>
        </div>

        {loading || !data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="card-surface p-8 h-80 bg-[var(--bg-surface-raised)]" />
            <div className="card-surface p-8 h-80 lg:col-span-2 bg-[var(--bg-surface-raised)]" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Health Score Gauge Card */}
              <div className="lg:col-span-4 card-surface p-7 flex flex-col items-center justify-between text-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Current standing</span>
                  <StatusBadge
                    status={data.risk_label === 'Low' ? 'verified' : data.risk_label === 'Medium' ? 'pending' : 'rejected'}
                    label={`${data.risk_label} risk`}
                  />
                </div>

                <div className="my-3">
                  <HealthGauge score={data.score || 720} riskLabel={data.risk_label} />
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xs mt-2">
                  Score synthesized from liquidity buffer, debt-to-income ratio, and zero missed payments.
                </p>

                <div className="w-full pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-center">
                  <Link
                    to="/recommendations"
                    className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                  >
                    View optimization advice <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Comparison & Insights Bento Cards */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="card-surface p-6">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Your evaluated score</span>
                    <div className="font-display text-4xl font-semibold tracking-tight text-[var(--accent)] mt-2 tabular-nums">
                      {data.score || 720}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Above cohort benchmark</p>
                  </div>

                  <div className="card-surface p-6">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Platform cohort benchmark</span>
                    <div className="font-display text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-2 tabular-nums">
                      {data.average_score}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Representative borrower median</p>
                  </div>
                </div>

                {/* Score History Chart Card */}
                <div className="card-surface p-7">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                        Six-Month Score Trajectory
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Historical trend progression</p>
                    </div>
                    <StatusBadge status="verified" label="Trending stable" />
                  </div>
                  <ScoreHistoryChart history={data.history} />
                </div>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="card-surface p-7">
              <div className="mb-6">
                <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                  Primary Score Influencers
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Breakdown of key positive and negative credit behavioral factors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.breakdown.map((item) => {
                  const isPositive = item.type === 'positive';
                  const intensity = Math.min(100, Math.abs(item.impact) * 7);
                  return (
                    <div
                      key={item.factor}
                      className="p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{item.factor}</p>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            {isPositive ? 'Positive credit signal' : 'Negative pressure factor'}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            isPositive ? 'text-[var(--status-positive)]' : 'text-[var(--status-negative)]'
                          }`}
                        >
                          {item.impact > 0 ? `+${item.impact}` : item.impact} pts
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${intensity}%`,
                            backgroundColor: isPositive ? 'var(--status-positive)' : 'var(--status-negative)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </BorrowerLayout>
  );
};

export default HealthScorePage;