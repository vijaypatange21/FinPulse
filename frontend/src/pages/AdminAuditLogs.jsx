import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import Card, { ContrastCard } from '../components/ui/Card';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  User,
  Server,
  FileCheck,
  CreditCard,
  Lock,
  Download,
  Eye,
  X,
} from 'lucide-react';

const mockAuditLogs = [
  {
    id: 'aud_9f81a',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    action: 'DOC_VERIFY_APPROVED',
    category: 'KYC & Verification',
    actor: 'Site Admin (admin@finpulse.com)',
    actorRole: 'Superadmin',
    target: 'Document #b_1092 (HDFC Bank Statement)',
    entityId: 'doc_b_1092',
    ip: '192.168.1.14',
    severity: 'info',
    status: 'Verified',
    details: {
      documentType: 'bank_statement',
      verifiedBy: 'admin@finpulse.com',
      automatedOcrScore: 98.4,
      hash: 'sha256:4a8f9c2d1e0b5a3f7890123456789abc',
    },
  },
  {
    id: 'aud_8c72b',
    timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    action: 'ML_HEALTH_SCORE_RECOMPUTE',
    category: 'Risk Models',
    actor: 'FinPulse Underwriter ML v2.4',
    actorRole: 'System Agent',
    target: 'Application #d825755d (Borrower Account)',
    entityId: 'app_d825755d',
    ip: '127.0.0.1 (Internal Bus)',
    severity: 'info',
    status: 'Verified',
    details: {
      priorScore: 685,
      newScore: 742,
      delta: '+57 pts',
      trigger: 'Verified Bank Statement Ingestion',
      modelExecutionTimeMs: 14.1,
    },
  },
  {
    id: 'aud_7b63c',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    action: 'LENDER_ACCREDITATION_VERIFIED',
    category: 'Institutional',
    actor: 'Site Admin (admin@finpulse.com)',
    actorRole: 'Superadmin',
    target: 'Tata Capital Financial Services',
    entityId: 'len_4421',
    ip: '192.168.1.14',
    severity: 'info',
    status: 'Verified',
    details: {
      licenseType: 'RBI NBFC Registration Certificate',
      accreditationStatus: 'ACTIVE_TIER_1',
      maxSingleExposure: '₹25,00,000',
    },
  },
  {
    id: 'aud_6a54d',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    action: 'ANOMALY_TRANSACTION_FLAG',
    category: 'Security & Auth',
    actor: 'Isolation Forest Anomaly Model',
    actorRole: 'System Agent',
    target: 'Account #acc_8819 (Priya Sharma)',
    entityId: 'acc_8819',
    ip: '10.0.4.12',
    severity: 'warning',
    status: 'Flagged for Review',
    details: {
      deviationScore: 2.84,
      reason: 'Rapid sequential loan applications from distinct IP addresses',
      remedialAction: 'Automated 24h Cooling-Off Enforcement',
    },
  },
  {
    id: 'aud_5f45e',
    timestamp: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    action: 'USER_ROLE_PERMISSIONS_UPDATE',
    category: 'Security & Auth',
    actor: 'Site Admin (admin@finpulse.com)',
    actorRole: 'Superadmin',
    target: 'User #u_38 (HDFC Underwriting Team)',
    entityId: 'u_38',
    ip: '192.168.1.14',
    severity: 'info',
    status: 'Verified',
    details: {
      roleGranted: 'Lender Senior Credit Analyst',
      previousRole: 'Lender Associate',
      approvalReference: 'SEC-GOV-2026-081',
    },
  },
  {
    id: 'aud_4e36f',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    action: 'LOAN_APPLICATION_REJECTED',
    category: 'Loan Decisions',
    actor: 'Bajaj Finance Credit Committee',
    actorRole: 'Institutional Lender',
    target: 'Application #957d0ef1 (₹60,000)',
    entityId: 'app_957d0ef1',
    ip: '49.207.18.92',
    severity: 'info',
    status: 'Verified',
    details: {
      reason: 'DTI threshold of 50% breached (Calculated: 58.4%)',
      coApplicantSuggested: true,
      noticeDispatched: 'SMS + In-App Push Notification',
    },
  },
];

const AdminAuditLogs = () => {
  const [logs] = useState(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [inspectLog, setInspectLog] = useState(null);

  const categories = ['All', 'KYC & Verification', 'Risk Models', 'Loan Decisions', 'Security & Auth', 'Institutional'];

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesSeverity =
        selectedSeverity === 'All' || item.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [logs, searchQuery, selectedCategory, selectedSeverity]);

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <AdminLayout activeSection="audit-logs" title="Audit & Compliance Logs">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header / Sub-Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent p-6 rounded-3xl border border-blue-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Regulatory Compliance Trail
              </span>
            </div>
            <h1 className="font-clash text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
              Platform Audit & Compliance Logs
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
              Tamper-evident system activity journal recording all administrative actions, KYC decisions, automated ML underwriter recalculations, and security events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="font-semibold text-[var(--text-primary)]">SHA-256 Ledger</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Integrity Verified</span>
            </div>
          </div>
        </div>

        {/* Audit Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Total Audit Events
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <History size={16} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-clash text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                2,418
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Continuous compliance logging
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Verification Decisions
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileCheck size={16} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-clash text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  842
                </span>
                <span className="text-xs text-emerald-400 font-semibold">100% Accounted</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Zero unverified document grants
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Algorithmic Decisions
              </span>
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center">
                <Server size={16} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-clash text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                1,120
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Credit score & default evaluations
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Security Flags & Warnings
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-clash text-3xl font-bold tracking-tight text-amber-400">
                  4
                </span>
                <span className="text-xs text-[var(--text-secondary)]">Under Review</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                Zero security breaches recorded
              </p>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === c
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                    : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search action, actor, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] uppercase text-[10px] tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-3 px-4 font-semibold w-28">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Action / Event</th>
                  <th className="py-3 px-4 font-semibold">Actor</th>
                  <th className="py-3 px-4 font-semibold">Target Entity</th>
                  <th className="py-3 px-4 font-semibold w-28">Origin IP</th>
                  <th className="py-3 px-4 font-semibold w-24">Integrity</th>
                  <th className="py-3 px-4 font-semibold text-right w-20">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]/60">
                {filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.severity === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="font-mono font-bold text-[var(--text-primary)] truncate">
                          {item.action}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-[var(--text-primary)] truncate max-w-[170px]">{item.actor}</p>
                      <span className="text-[10px] text-[var(--accent)] font-medium">
                        {item.actorRole}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[var(--text-primary)] truncate block max-w-[190px]">{item.target}</span>
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono block">
                        {item.entityId}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[var(--text-secondary)] font-mono text-[11px]">
                      {item.ip}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setInspectLog(item)}
                        className="px-3 py-1 rounded-xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Inspection Modal */}
        {inspectLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] p-6 shadow-2xl relative">
              <button
                onClick={() => setInspectLog(null)}
                className="absolute top-5 right-5 p-1 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-emerald-400" />
                <h3 className="font-clash text-lg font-bold text-[var(--text-primary)]">
                  Audit Event Payload Details
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Event ID:</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">{inspectLog.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Action Code:</span>
                    <span className="font-mono font-bold text-[var(--accent)]">{inspectLog.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Actor:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{inspectLog.actor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Origin IP:</span>
                    <span className="font-mono text-[var(--text-primary)]">{inspectLog.ip}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Audit Payload Metadata:
                  </span>
                  <pre className="mt-2 p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-primary)] overflow-x-auto">
                    {JSON.stringify(inspectLog.details, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex justify-end">
                <button
                  onClick={() => setInspectLog(null)}
                  className="px-5 py-2 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] font-bold text-xs cursor-pointer hover:opacity-90"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
