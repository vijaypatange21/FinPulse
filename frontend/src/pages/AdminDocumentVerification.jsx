import React, { useState, useEffect, useMemo } from 'react';
import {
  listDocuments,
  verifyDocument,
  rejectDocument,
  listLenderDocuments,
  verifyLenderDocument,
  rejectLenderDocument,
  getMediaUrl,
} from '../lib/api';
import AdminLayout from '../components/AdminLayout';
import Card, { ContrastCard } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import {
  FileCheck,
  Building2,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  FileText,
} from 'lucide-react';

const AdminDocumentVerification = () => {
  const [docCategory, setDocCategory] = useState('borrower'); // 'borrower' | 'lender'
  const [borrowerDocs, setBorrowerDocs] = useState([]);
  const [lenderDocs, setLenderDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_review'); // 'all', 'pending_review', 'verified', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectDoc, setInspectDoc] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Document criteria or legibility not met');
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [txSearch, setTxSearch] = useState('');

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const [bDocs, lDocs] = await Promise.all([
        listDocuments().catch(() => []),
        listLenderDocuments().catch(() => []),
      ]);
      if (Array.isArray(bDocs)) setBorrowerDocs(bDocs);
      if (Array.isArray(lDocs)) setLenderDocs(lDocs);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const currentDocs = docCategory === 'borrower' ? borrowerDocs : lenderDocs;

  const counts = useMemo(() => {
    const total = currentDocs.length;
    const pending = currentDocs.filter(
      (d) => d.status === 'pending_review' || d.status === 'processing' || d.status === 'under_review'
    ).length;
    const verified = currentDocs.filter((d) => d.status === 'verified').length;
    const rejected = currentDocs.filter((d) => d.status === 'rejected' || d.status === 'flagged').length;
    return { total, pending, verified, rejected };
  }, [currentDocs]);

  const filteredDocs = useMemo(() => {
    return currentDocs.filter((doc) => {
      if (activeTab === 'pending_review') {
        if (doc.status !== 'pending_review' && doc.status !== 'processing' && doc.status !== 'under_review')
          return false;
      } else if (activeTab === 'verified') {
        if (doc.status !== 'verified') return false;
      } else if (activeTab === 'rejected') {
        if (doc.status !== 'rejected' && doc.status !== 'flagged') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (doc.borrowerName || doc.institutionName || '').toLowerCase().includes(q);
        const fileMatch = (doc.file_name || '').toLowerCase().includes(q);
        const typeMatch = (doc.document_type || '').toLowerCase().includes(q);
        if (!nameMatch && !fileMatch && !typeMatch) return false;
      }
      return true;
    });
  }, [currentDocs, activeTab, searchQuery]);

  const handleVerify = async (docId) => {
    try {
      setIsVerifying(true);
      if (docCategory === 'borrower') {
        await verifyDocument(docId, verificationNotes);
        showToast('Borrower document verified! Health score recalculated and notification pushed.', 'success');
      } else {
        await verifyLenderDocument(docId, verificationNotes);
        showToast('Institutional compliance document approved! Institution accreditation activated.', 'success');
      }
      setInspectDoc(null);
      setVerificationNotes('');
      await fetchDocs();
    } catch (err) {
      showToast(err.message || 'Failed to verify document.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async (docId) => {
    try {
      setIsVerifying(true);
      if (docCategory === 'borrower') {
        await rejectDocument(docId, rejectionReason, verificationNotes);
        showToast('Borrower document marked as rejected.', 'info');
      } else {
        await rejectLenderDocument(docId, rejectionReason, verificationNotes);
        showToast('Institutional document rejected.', 'info');
      }
      setShowRejectModal(false);
      setInspectDoc(null);
      setVerificationNotes('');
      await fetchDocs();
    } catch (err) {
      showToast(err.message || 'Failed to reject document.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Filter parsed transactions if inspecting a borrower document
  const parsedData = inspectDoc?.parsed_data || {};
  const transactions = parsedData.transactions || [];
  const filteredTxns = useMemo(() => {
    if (!txSearch.trim()) return transactions;
    const q = txSearch.toLowerCase();
    return transactions.filter(
      (t) => t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)
    );
  }, [transactions, txSearch]);

  return (
    <AdminLayout activeSection="documents" title="Document Verification">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header with Category Toggle */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">
              Platform Compliance Authority
            </span>
            <h1 className="font-clash text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
              Dual Verification Queue
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Review and authenticate financial records uploaded by borrowers and institutional accreditation from lenders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDocs}
              className="px-4 py-2 bg-[var(--bg-surface-raised)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Category Switcher: Borrower Financials vs Lender Compliance */}
        <div className="flex p-1.5 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] max-w-md">
          <button
            onClick={() => {
              setDocCategory('borrower');
              setInspectDoc(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              docCategory === 'borrower'
                ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <User size={15} />
            <span>Borrower Financials</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">
              {borrowerDocs.length}
            </span>
          </button>

          <button
            onClick={() => {
              setDocCategory('lender');
              setInspectDoc(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              docCategory === 'lender'
                ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 size={15} />
            <span>Lender Accreditation</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">
              {lenderDocs.length}
            </span>
          </button>
        </div>

        {/* Feedback Toast */}
        {feedbackToast && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-fade-in ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : feedbackToast.type === 'error'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : 'bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent)]/30'
            }`}
          >
            {feedbackToast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ContrastCard className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">Pending Review</span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums">
                {counts.pending}
              </span>
              <p className="text-[11px] opacity-75 mt-0.5">Awaiting human sign-off</p>
            </div>
          </ContrastCard>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Total Ingested
            </span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-[var(--text-primary)]">
                {counts.total}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {docCategory === 'borrower' ? 'Bank statements & filings' : 'Institutional registrations'}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Verified & Active
            </span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-emerald-400">
                {counts.verified}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Approved compliance</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Flagged / Rejected
            </span>
            <div className="mt-2">
              <span className="font-clash text-3xl font-semibold tracking-tight tabular-nums text-rose-400">
                {counts.rejected}
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Deficiencies detected</p>
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {[
              { id: 'pending_review', label: 'Pending Review', count: counts.pending },
              { id: 'all', label: 'All Documents', count: counts.total },
              { id: 'verified', label: 'Verified', count: counts.verified },
              { id: 'rejected', label: 'Rejected', count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-[0_0_15px_var(--accent-glow)]'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                    activeTab === tab.id
                      ? 'bg-black/20 text-current'
                      : 'bg-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder={
                docCategory === 'borrower' ? 'Search borrower or document...' : 'Search institution or license...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-full focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)] transition-colors"
            />
          </div>
        </Card>

        {/* Document Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar min-h-[340px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-canvas)]/40 text-[11px] font-semibold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-3.5">{docCategory === 'borrower' ? 'Borrower' : 'Institution'}</th>
                  <th className="px-6 py-3.5">Document Details</th>
                  <th className="px-6 py-3.5">
                    {docCategory === 'borrower' ? 'Extracted Cash Flow' : 'Compliance Scope'}
                  </th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Upload Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      Loading verification queue...
                    </td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[var(--text-secondary)]">
                      No documents found in this queue.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const isBorrower = docCategory === 'borrower';
                    const entityName = isBorrower
                      ? doc.borrowerName || 'Borrower Account'
                      : doc.institutionName || 'Institutional Lender';
                    const totals = doc.parsed_data?.totals || {};

                    return (
                      <tr key={doc.id} className="h-14 hover:bg-[var(--bg-surface-raised)]/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                              {entityName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-[var(--text-primary)] leading-tight">
                                {entityName}
                              </p>
                              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                                {isBorrower
                                  ? `ID: ${String(doc.borrowerId || '').slice(0, 8)}`
                                  : `Lender ID: ${String(doc.lenderId || '').slice(0, 8)}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-[var(--accent)]" />
                            <div>
                              <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                                {doc.file_name}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)] capitalize">
                                {doc.document_type?.replace(/_/g, ' ')} • {doc.file_size}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3.5 text-xs">
                          {isBorrower ? (
                            totals.total_credits ? (
                              <div className="tabular-nums">
                                <span className="text-emerald-400 font-semibold">
                                  +₹{Number(totals.total_credits).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[var(--text-secondary)] mx-1">/</span>
                                <span className="text-[var(--text-secondary)]">
                                  -₹{Number(totals.total_debits || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[var(--text-secondary)] font-mono text-[11px]">
                                {doc.status === 'processing' ? 'OCR In-Flight...' : 'Awaiting Inspection'}
                              </span>
                            )
                          ) : (
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              Regulatory Statutory Filing
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-3.5">
                          <StatusBadge status={doc.status} />
                        </td>

                        <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)]">
                          {new Date(doc.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setInspectDoc(doc);
                              setVerificationNotes(doc.verification_notes || '');
                            }}
                            className="px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] text-xs font-semibold hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Eye size={13} />
                            <span>Audit & Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Document Inspection & Audit */}
        {inspectDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    {docCategory === 'borrower' ? 'Borrower Financial Record' : 'Institutional Compliance Audit'}
                  </span>
                  <h3 className="font-clash text-xl font-bold text-[var(--text-primary)] mt-0.5">
                    {inspectDoc.file_name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Submitted by {inspectDoc.borrowerName || inspectDoc.institutionName} • Type:{' '}
                    <span className="capitalize font-semibold text-[var(--text-primary)]">
                      {inspectDoc.document_type?.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setInspectDoc(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Download / View File Link */}
                {inspectDoc.file_url && (
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <FileText size={16} className="text-[var(--accent)]" />
                      <span>Original Document File ({inspectDoc.file_size})</span>
                    </div>
                    <a
                      href={getMediaUrl(inspectDoc.file_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline"
                    >
                      <span>Open File</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* If borrower bank statement, show financial summary */}
                {docCategory === 'borrower' && inspectDoc.parsed_data?.totals && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                        Total Inflow
                      </span>
                      <p className="text-base font-bold text-emerald-400 mt-1 tabular-nums">
                        ₹{Number(inspectDoc.parsed_data.totals.total_credits || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                        Total Outflow
                      </span>
                      <p className="text-base font-bold text-rose-400 mt-1 tabular-nums">
                        ₹{Number(inspectDoc.parsed_data.totals.total_debits || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                        Avg Balance
                      </span>
                      <p className="text-base font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                        ₹{Number(inspectDoc.parsed_data.totals.average_balance || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                        Transactions
                      </span>
                      <p className="text-base font-bold text-[var(--accent)] mt-1 tabular-nums">
                        {inspectDoc.parsed_data.totals.transaction_count || 0}
                      </p>
                    </div>
                  </div>
                )}

                {/* Verification Audit Notes Input */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    Admin Compliance & Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter observations, OCR validation remarks, or reason for approval..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full p-3.5 text-xs bg-[var(--bg-canvas)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/40 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isVerifying}
                  className="px-5 py-2.5 rounded-full border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <XCircle size={15} />
                  <span>Reject Document</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInspectDoc(null)}
                    className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-semibold hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleVerify(inspectDoc.id)}
                    disabled={isVerifying}
                    className="px-6 py-2.5 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-bold shadow-[0_0_20px_var(--accent-glow)] hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 size={15} />
                    <span>
                      {isVerifying
                        ? 'Verifying...'
                        : docCategory === 'borrower'
                        ? 'Approve & Update Health Score'
                        : 'Approve Institutional Accreditation'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Rejection Reason Dialog */}
        {showRejectModal && inspectDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-clash text-lg font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>Specify Rejection Reason</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                The reason will be communicated to the user via real-time WebSocket notification.
              </p>

              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Statement period does not cover recent 3 months">
                  Statement period does not cover recent 3 months
                </option>
                <option value="Document corrupted or illegible">Document corrupted or illegible</option>
                <option value="Tampering detected or checksum mismatch">Tampering detected or checksum mismatch</option>
                <option value="License not registered with RBI/Regulatory authority">
                  License not registered with RBI/Regulatory authority
                </option>
                <option value="Corporate entity name mismatch with registration">
                  Corporate entity name mismatch with registration
                </option>
                <option value="Other compliance deficiency">Other compliance deficiency</option>
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleReject(inspectDoc.id)}
                  className="flex-1 py-2 bg-rose-500 text-white text-xs font-bold rounded-full hover:bg-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDocumentVerification;
