import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  FileCheck,
  Building,
  Receipt,
  QrCode,
  Trash2,
  Eye,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import BorrowerLayout from '../components/BorrowerLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { getCurrentUser, listDocuments, uploadDocument, deleteDocument, getMediaUrl } from '../lib/api';

const CATEGORY_MAP = {
  bank_statement: {
    label: 'Bank Statement',
    icon: Building,
    desc: 'Latest 6 months of your primary savings or checking account.',
  },
  gst: {
    label: 'GST Records',
    icon: Receipt,
    desc: 'GSTR-3B filings for the last 4 quarters.',
  },
  itr: {
    label: 'ITR Records',
    icon: FileText,
    desc: 'Income Tax Returns (ITR-V) for the last 2 assessment years.',
  },
  upi: {
    label: 'UPI History',
    icon: QrCode,
    desc: 'Digital transaction logs from the last 90 days.',
  },
};

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('bank_statement');
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewTab, setPreviewTab] = useState('parsed');
  const [searchFilter, setSearchFilter] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    try {
      const data = await listDocuments();
      if (Array.isArray(data)) {
        setDocuments(data);
      } else if (data && Array.isArray(data.results)) {
        setDocuments(data.results);
      } else {
        setDocuments([]);
      }
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchDocs();
    }, 1500);

    return () => clearInterval(interval);
  }, [documents]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFiles = async (files, docType = selectedCategory) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', docType);
        await uploadDocument(formData);
      }
      showToast(`Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}!`);
      await fetchDocs();
    } catch (err) {
      showToast(err?.message || 'Failed to upload document. Please try again.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUploadForCategory = (catKey) => {
    setSelectedCategory(catKey);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast('Document deleted.');
    } catch {
      showToast('Failed to delete document.', 'error');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, selectedCategory);
    }
  };

  const getCategoryCount = (key) => documents.filter((d) => d.document_type === key).length;

  return (
    <BorrowerLayout activeSection="documents" title="KYC & Documents">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, selectedCategory)}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-24 right-8 z-50 px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)] animate-fade-in ${
            notification.type === 'error'
              ? 'bg-[var(--status-negative)] text-white'
              : 'bg-[var(--accent)] text-[var(--text-on-accent)]'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex text-xs text-[var(--text-secondary)]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link className="hover:text-[var(--accent)] transition-colors" to="/borrower/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <ChevronRight size={13} />
              <span className="font-medium text-[var(--text-primary)]">Documents & Verification</span>
            </li>
          </ol>
        </nav>

        {/* Section Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Financial Document Center
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Verified financial documents boost your AI health score and unlock prime underwriting rates.
          </p>
        </div>

        {/* Main Upload Dropzone (§4 Upload Cards) */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`card-surface p-10 sm:p-12 text-center cursor-pointer transition-all border-dashed relative overflow-hidden group ${
            dragActive
              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-[var(--border-subtle)] hover:border-[var(--accent)]/60'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud size={28} />
          </div>

          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-1">
            {uploading ? 'Ingesting and parsing document...' : 'Upload Financial Records'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            Drag and drop statement files or browse from device. Supports PDF, JPG, PNG up to 10MB each.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-medium text-[var(--text-secondary)]">Target Classification:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] rounded-full px-4 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="bank_statement">Bank Statement</option>
              <option value="gst">GST Records</option>
              <option value="itr">ITR Records</option>
              <option value="upi">UPI History</option>
              <option value="other">Other Document</option>
            </select>
          </div>

          <button
            type="button"
            disabled={uploading}
            className="btn-accent px-7 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <FolderOpen size={14} />
            <span>{uploading ? 'Processing File...' : 'Select File'}</span>
          </button>
        </div>

        {/* Categories Bento Row */}
        <div>
          <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-4">
            Required Documentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(CATEGORY_MAP).map(([key, info]) => {
              const Icon = info.icon;
              const count = getCategoryCount(key);
              return (
                <div key={key} className="card-surface p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                        <Icon size={19} />
                      </div>
                      <StatusBadge
                        status={count > 0 ? 'verified' : 'pending'}
                        label={count > 0 ? `${count} File${count > 1 ? 's' : ''}` : 'Pending'}
                      />
                    </div>
                    <h4 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-1">
                      {info.label}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                      {info.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => triggerUploadForCategory(key)}
                    className="w-full py-2.5 px-4 rounded-full btn-secondary text-xs font-semibold cursor-pointer"
                  >
                    {count > 0 ? 'Upload Additional' : 'Upload Document'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Uploaded Documents List Table */}
        <div className="card-surface overflow-hidden">
          <div className="px-7 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Uploaded Records & Verification Pipeline
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Real-time parsing and underwriter approval logs
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)] px-3 py-1 rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
              {documents.length} Total Documents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider bg-[var(--bg-surface-raised)]/40">
                  <th className="px-7 py-3.5">Document Name</th>
                  <th className="px-7 py-3.5">Category</th>
                  <th className="px-7 py-3.5">File Size</th>
                  <th className="px-7 py-3.5">Upload Date</th>
                  <th className="px-7 py-3.5">Audit Status</th>
                  <th className="px-7 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-7 py-8 text-center text-xs text-[var(--text-secondary)]">
                      Loading repository documents...
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-7 py-12 text-center text-xs text-[var(--text-secondary)]">
                      No documents uploaded yet. Upload statements above to begin verification.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const cat = CATEGORY_MAP[doc.document_type] || { label: 'Document' };
                    return (
                      <tr key={doc.id} className="hover:bg-[var(--bg-surface-raised)]/60 transition-colors h-14">
                        <td className="px-7 py-3">
                          <div className="flex items-center gap-3">
                            <FileText size={17} className="text-[var(--accent)] shrink-0" />
                            <span className="text-xs font-semibold text-[var(--text-primary)] max-w-xs truncate">
                              {doc.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-7 py-3 text-xs text-[var(--text-secondary)]">{cat.label}</td>
                        <td className="px-7 py-3 text-xs text-[var(--text-secondary)] tabular-nums">{doc.file_size}</td>
                        <td className="px-7 py-3 text-xs text-[var(--text-secondary)] tabular-nums">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="px-7 py-3">
                          <div className="flex flex-col gap-0.5">
                            <StatusBadge status={doc.status} />
                            {doc.status === 'rejected' && doc.rejection_reason && (
                              <span className="text-[10px] text-[var(--status-negative)]">
                                {doc.rejection_reason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-7 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] transition-colors cursor-pointer"
                              title="Inspect Document"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id, doc.file_name)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--status-negative)] hover:bg-[var(--status-negative)]/10 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
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

      {/* Document Inspector Modal (§4 Drawer / Inverse Panel Pattern) */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="card-surface max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-[var(--border-subtle)] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 px-7 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface-raised)]/70">
              <div className="flex items-center gap-3">
                <FileCheck size={20} className="text-[var(--accent)]" />
                <div>
                  <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <span>{previewDoc.file_name}</span>
                    {previewDoc.parsed_data?.bank_name && (
                      <span className="px-2.5 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] font-semibold rounded-full">
                        {previewDoc.parsed_data.bank_name}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {CATEGORY_MAP[previewDoc.document_type]?.label || 'Document'} • {previewDoc.file_size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {previewDoc.file_url && (
                  <a
                    href={getMediaUrl(previewDoc.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} /> Open Raw
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)] cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto min-h-[360px] flex items-center justify-center bg-[var(--bg-canvas)]">
              {previewDoc.file_name?.endsWith('.pdf') ? (
                <iframe
                  src={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                  title={previewDoc.file_name}
                  className="w-full h-[65vh] rounded-2xl border border-[var(--border-subtle)] bg-white"
                />
              ) : previewDoc.file_name?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <img
                  src={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                  alt={previewDoc.file_name}
                  className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-md"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText size={48} className="text-[var(--text-secondary)]/50 mx-auto mb-3" />
                  <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                    {previewDoc.file_name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-5">
                    Direct visual preview not supported for this file type.
                  </p>
                  <a
                    href={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                    download={previewDoc.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent px-5 py-2 text-xs inline-flex items-center gap-2"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </BorrowerLayout>
  );
};

export default DocumentUpload;
