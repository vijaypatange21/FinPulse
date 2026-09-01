import React, { useState, useEffect, useMemo } from 'react';
import { listDocuments, verifyDocument, rejectDocument, getMediaUrl } from '../lib/api';
import LenderLayout from '../components/LenderLayout';

const AdminDocumentVerification = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending_review'); // 'all', 'pending_review', 'verified', 'rejected'
    const [searchQuery, setSearchQuery] = useState('');
    const [inspectDoc, setInspectDoc] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationNotes, setVerificationNotes] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('Statement period does not cover recent 3 months');
    const [feedbackToast, setFeedbackToast] = useState(null);
    const [txSearch, setTxSearch] = useState('');

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const data = await listDocuments();
            if (Array.isArray(data)) {
                setDocuments(data);
            }
        } catch (err) {
            console.error("Failed to load documents", err);
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

    const counts = useMemo(() => {
        const total = documents.length;
        const pending = documents.filter((d) => d.status === 'pending_review' || d.status === 'processing').length;
        const verified = documents.filter((d) => d.status === 'verified').length;
        const rejected = documents.filter((d) => d.status === 'rejected' || d.status === 'flagged').length;
        return { total, pending, verified, rejected };
    }, [documents]);

    const filteredDocs = useMemo(() => {
        return documents.filter((doc) => {
            if (activeTab === 'pending_review') {
                if (doc.status !== 'pending_review' && doc.status !== 'processing') return false;
            } else if (activeTab === 'verified') {
                if (doc.status !== 'verified') return false;
            } else if (activeTab === 'rejected') {
                if (doc.status !== 'rejected' && doc.status !== 'flagged') return false;
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const nameMatch = doc.borrowerName?.toLowerCase().includes(q);
                const fileMatch = doc.file_name?.toLowerCase().includes(q);
                const typeMatch = doc.document_type?.toLowerCase().includes(q);
                if (!nameMatch && !fileMatch && !typeMatch) return false;
            }
            return true;
        });
    }, [documents, activeTab, searchQuery]);

    const handleVerify = async (docId) => {
        try {
            setIsVerifying(true);
            const res = await verifyDocument(docId, verificationNotes);
            showToast(`Document successfully approved! Borrower credit health score evaluated.`, 'success');
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
            await rejectDocument(docId, rejectionReason, verificationNotes);
            showToast(`Document marked as rejected with reason.`, 'info');
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

    // Filter parsed transactions if inspecting
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
        <LenderLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document Verification Queue</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Human-in-the-loop review and verification for submitted borrower financial statements.
                        </p>
                    </div>
                    <button
                        onClick={fetchDocs}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 self-start md:self-auto transition-colors"
                    >
                        <span className={`material-icons text-base ${loading ? 'animate-spin' : ''}`}>refresh</span>
                        Refresh Queue
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold uppercase text-slate-400">Total Uploads</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{counts.total}</p>
                    </div>
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40">
                        <p className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Pending Review</p>
                        <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{counts.pending}</p>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
                        <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Verified</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{counts.verified}</p>
                    </div>
                    <div className="bg-red-50/50 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/40">
                        <p className="text-xs font-bold uppercase text-red-600 dark:text-red-400">Rejected</p>
                        <p className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">{counts.rejected}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {[
                            { id: 'pending_review', label: 'Pending Review', count: counts.pending },
                            { id: 'all', label: 'All Documents', count: counts.total },
                            { id: 'verified', label: 'Verified', count: counts.verified },
                            { id: 'rejected', label: 'Rejected', count: counts.rejected },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === tab.id
                                        ? 'bg-[#2262ec] text-white shadow-md shadow-[#2262ec]/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search by borrower or file..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2262ec] outline-none"
                        />
                    </div>
                </div>

                {/* Feedback Toast */}
                {feedbackToast && (
                    <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 animate-fade-in ${
                        feedbackToast.type === 'success' ? 'bg-emerald-500 text-white' : feedbackToast.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'
                    }`}>
                        <span className="material-icons text-lg">{feedbackToast.type === 'success' ? 'check_circle' : 'info'}</span>
                        <span>{feedbackToast.message}</span>
                    </div>
                )}

                {/* Document Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Borrower</th>
                                    <th className="px-6 py-4">Document Details</th>
                                    <th className="px-6 py-4">Financial Inflow/Outflow</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Upload Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            <span className="material-icons animate-spin text-3xl mb-2 text-[#2262ec] block">refresh</span>
                                            Loading document queue...
                                        </td>
                                    </tr>
                                ) : filteredDocs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-4xl mb-2 block text-slate-300">task</span>
                                            No documents found in this view.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocs.map((doc) => {
                                        const pData = doc.parsed_data || {};
                                        const totals = pData.totals || {};
                                        return (
                                            <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                                                            {(doc.borrowerName || 'B')[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{doc.borrowerName || 'Unknown Borrower'}</p>
                                                            <p className="text-xs text-slate-400">ID: {String(doc.borrowerId || '').slice(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-icons text-[#2262ec] text-base">description</span>
                                                        <div>
                                                            <p className="text-slate-800 dark:text-slate-200 font-semibold leading-tight">{doc.file_name}</p>
                                                            <p className="text-[11px] text-slate-400 capitalize">{doc.document_type?.replace('_', ' ')} • {doc.file_size}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    {totals.total_credits ? (
                                                        <div>
                                                            <span className="text-emerald-600 font-bold">+₹{Number(totals.total_credits).toLocaleString('en-IN')}</span>
                                                            <span className="text-slate-400 mx-1">/</span>
                                                            <span className="text-slate-600 dark:text-slate-400">-₹{Number(totals.total_debits || 0).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Pending OCR extraction</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        doc.status === 'verified'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : doc.status === 'processing'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : doc.status === 'rejected'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                            doc.status === 'verified' ? 'bg-green-500' : doc.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                                                        }`}></span>
                                                        {doc.status === 'verified' ? 'Verified' : doc.status === 'rejected' ? 'Rejected' : doc.status === 'processing' ? 'Processing' : 'Pending Review'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setInspectDoc(doc)}
                                                        className="px-3.5 py-1.5 bg-[#2262ec] hover:bg-[#2262ec]/90 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
                                                    >
                                                        <span className="material-icons text-sm">visibility</span>
                                                        Inspect & Verify
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Document Inspection & Decision Modal */}
            {inspectDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setInspectDoc(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#2262ec]/10 flex items-center justify-center text-[#2262ec]">
                                    <span className="material-symbols-outlined text-xl">verified</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>Document Review: {inspectDoc.file_name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            inspectDoc.status === 'verified' ? 'bg-green-100 text-green-700' : inspectDoc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {inspectDoc.status?.replace('_', ' ')}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-500">Borrower: {inspectDoc.borrowerName} • Uploaded {new Date(inspectDoc.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setInspectDoc(null)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                                <span className="material-icons text-xl">close</span>
                            </button>
                        </div>

                        {/* Modal Body: Two Column Inspector */}
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Pane: Account Metadata & Original File Link */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Account Metadata</h4>
                                    <div className="space-y-1 text-xs">
                                        <p className="text-slate-500">Bank Name</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{parsedData.bank_name || 'HDFC Bank'}</p>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p className="text-slate-500">Account Number</p>
                                        <p className="font-bold text-slate-900 dark:text-white font-mono">{parsedData.account?.account_number || '5010 0123 4567 89'}</p>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p className="text-slate-500">IFSC & Branch</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{parsedData.account?.ifsc || 'HDFC0001234'} • {parsedData.account?.branch || 'Vadodara'}</p>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <p className="text-slate-500">Statement Period</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{parsedData.statement_period?.from || '2024-05-01'} to {parsedData.statement_period?.to || '2024-05-31'}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Original Uploaded File</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">File: {inspectDoc.file_name} ({inspectDoc.file_size})</p>
                                    {inspectDoc.file_url && (
                                        <a
                                            href={getMediaUrl(inspectDoc.file_url)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <span className="material-icons text-sm">open_in_new</span>
                                            Open Original Document
                                        </a>
                                    )}
                                </div>

                                {/* Verification Notes */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Verification Notes (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={verificationNotes}
                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                        placeholder="Add notes for the audit trail (e.g. Verified against HDFC netbanking records)..."
                                        className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#2262ec] outline-none"
                                    />
                                </div>
                            </div>

                            {/* Right Pane: Parsed KPIs & Transaction List */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* KPI Summary */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                                        <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Total Credits</p>
                                        <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                                            +₹{Number(parsedData.totals?.total_credits || 64250).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                                        <p className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">Total Debits</p>
                                        <p className="text-base font-extrabold text-red-700 dark:text-red-300 mt-0.5">
                                            -₹{Number(parsedData.totals?.total_debits || 20888).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
                                        <p className="text-[10px] uppercase font-bold text-[#2262ec]">Closing Balance</p>
                                        <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                                            ₹{Number(parsedData.closing_balance || 88592.75).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Parsed Transactions Table */}
                                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            Parsed Statement Transactions ({filteredTxns.length} records)
                                        </h4>
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={txSearch}
                                            onChange={(e) => setTxSearch(e.target.value)}
                                            className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                                        />
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-100/60 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                                                <tr>
                                                    <th className="p-2.5">Date</th>
                                                    <th className="p-2.5">Description</th>
                                                    <th className="p-2.5">Category</th>
                                                    <th className="p-2.5 text-right">Debit</th>
                                                    <th className="p-2.5 text-right">Credit</th>
                                                    <th className="p-2.5 text-right">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {filteredTxns.map((tx, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                        <td className="p-2.5 text-slate-500 font-mono">{tx.transaction_date}</td>
                                                        <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]" title={tx.description}>{tx.description}</td>
                                                        <td className="p-2.5 text-slate-500">{tx.category}</td>
                                                        <td className="p-2.5 text-right text-red-500 font-medium">{tx.debit > 0 ? `-₹${Number(tx.debit).toLocaleString('en-IN')}` : '-'}</td>
                                                        <td className="p-2.5 text-right text-emerald-600 font-bold">{tx.credit > 0 ? `+₹${Number(tx.credit).toLocaleString('en-IN')}` : '-'}</td>
                                                        <td className="p-2.5 text-right font-mono">₹{Number(tx.balance).toLocaleString('en-IN')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                            <div className="text-xs text-slate-400">
                                {inspectDoc.status === 'verified' && <span className="text-emerald-600 font-bold">✓ This document has been verified.</span>}
                                {inspectDoc.status === 'rejected' && <span className="text-red-500 font-bold">✕ Document rejected: {inspectDoc.rejection_reason}</span>}
                            </div>
                            <div className="flex gap-3">
                                {inspectDoc.status !== 'rejected' && (
                                    <button
                                        type="button"
                                        disabled={isVerifying}
                                        onClick={() => setShowRejectModal(true)}
                                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        Reject Document
                                    </button>
                                )}
                                {inspectDoc.status !== 'verified' && (
                                    <button
                                        type="button"
                                        disabled={isVerifying}
                                        onClick={() => handleVerify(inspectDoc.id)}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <span className="material-icons text-sm">{isVerifying ? 'hourglass_top' : 'verified'}</span>
                                        {isVerifying ? 'Verifying...' : 'Approve & Verify'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Prompt Modal */}
            {showRejectModal && inspectDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowRejectModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 text-red-600">
                            <span className="material-icons text-2xl">warning</span>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Reject Document</h3>
                        </div>
                        <p className="text-xs text-slate-500">
                            Select or enter the primary reason for rejecting <strong>{inspectDoc.file_name}</strong>. The borrower will be notified.
                        </p>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Rejection Reason</label>
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                            >
                                <option value="Statement period does not cover recent 3 months">Statement period does not cover recent 3 months</option>
                                <option value="Document image or scan is blurred / unreadable">Document image or scan is blurred / unreadable</option>
                                <option value="Account holder name does not match borrower profile">Account holder name does not match borrower profile</option>
                                <option value="Missing password for protected PDF">Missing password for protected PDF</option>
                                <option value="Suspected document alteration or formatting anomaly">Suspected document alteration or formatting anomaly</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isVerifying}
                                onClick={() => handleReject(inspectDoc.id)}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LenderLayout>
    );
};

export default AdminDocumentVerification;
