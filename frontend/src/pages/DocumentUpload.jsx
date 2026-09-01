import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { getCurrentUser, listDocuments, uploadDocument, deleteDocument, getMediaUrl } from '../lib/api';

const CATEGORY_MAP = {
    bank_statement: { label: 'Bank Statement', color: 'blue', icon: 'account_balance', desc: 'Latest 6 months of your primary savings account.' },
    gst: { label: 'GST Records', color: 'purple', icon: 'receipt_long', desc: 'GSTR-3B filings for the last 4 quarters.' },
    itr: { label: 'ITR Records', color: 'amber', icon: 'description', desc: 'Income Tax Returns for the last 2 financial years.' },
    upi: { label: 'UPI History', color: 'emerald', icon: 'qr_code_2', desc: 'Digital transaction logs from the last 90 days.' },
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

    const user = getCurrentUser();
    const displayName = user ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username) : 'Borrower';
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
        const hasProcessing = documents.some(d => d.status === 'processing');
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
            setDocuments(prev => prev.filter(d => d.id !== id));
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

    const getCategoryCount = (key) => documents.filter(d => d.document_type === key).length;

    return (
        <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-800 dark:text-slate-200 antialiased">
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files, selectedCategory)}
            />

            {/* Sidebar Navigation */}
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
                    <Link className="flex items-center gap-3 px-4 py-3 bg-[#2262ec]/10 text-[#2262ec] rounded-lg font-medium" to="/borrower/upload">
                        <span className="material-icons">description</span>
                        Documents
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/find-lender">
                        <span className="material-icons">search</span>
                        Find Lenders
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/loans">
                        <span className="material-icons">account_balance</span>
                        Loans
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/borrower/transactions">
                        <span className="material-icons">analytics</span>
                        Transactions
                    </Link>
                    {/* Added Log Out action */}
                    <Link className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" to="/login">
                        <span className="material-icons">logout</span>
                        Log Out
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold">Hello, {displayName.split(' ')[0]}</h1>
                        <p className="text-sm text-slate-500">Document status as of {currentDate}.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                            <span className="material-icons text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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

                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-24 right-8 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-3 animate-fade-in ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                        <span className="material-icons text-sm">{notification.type === 'error' ? 'error' : 'check_circle'}</span>
                        {notification.msg}
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                    {/* Header */}
                    <header className="mb-8">
                        <nav aria-label="Breadcrumb" className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
                            <ol className="flex items-center space-x-2">
                                <li><Link className="hover:text-[#2262ec] transition-colors" to="/borrower/dashboard">Dashboard</Link></li>
                                <li className="flex items-center space-x-2">
                                    <span className="material-icons text-sm">chevron_right</span>
                                    <span className="font-medium text-slate-900 dark:text-white">Document Management</span>
                                </li>
                            </ol>
                        </nav>
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Document Upload Center</h1>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Complete your loan application by uploading the required financial records.</p>
                            </div>
                        </div>
                    </header>
                    
                    {/* Main Upload Hero Zone */}
                    <section className="mb-10">
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative group cursor-pointer transition-all ${dragActive ? 'scale-[1.01]' : ''}`}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#2262ec] to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className={`relative flex flex-col items-center justify-center border-2 border-dashed ${dragActive ? 'border-[#2262ec] bg-blue-50/50 dark:bg-blue-900/20' : 'border-[#2262ec]/30 bg-white dark:bg-slate-900'} rounded-xl p-12 text-center hover:border-[#2262ec] transition-all`}>
                                <div className="w-20 h-20 bg-[#2262ec]/10 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-icons text-[#2262ec] text-4xl">
                                        {uploading ? 'hourglass_top' : 'cloud_upload'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {uploading ? 'Uploading your files...' : 'Upload your financial documents'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Drag and drop your files here, or click to browse from your computer. Supports PDF, JPG, PNG, DOC (Max 10MB each).
                                </p>
                                
                                <div className="flex items-center gap-3 mb-4" onClick={(e) => e.stopPropagation()}>
                                    <label className="text-xs font-semibold text-slate-500">Target Category:</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2262ec]"
                                    >
                                        <option value="bank_statement">Bank Statements</option>
                                        <option value="gst">GST Records</option>
                                        <option value="itr">ITR Records</option>
                                        <option value="upi">UPI History</option>
                                        <option value="other">Other Document</option>
                                    </select>
                                </div>

                                <button
                                    disabled={uploading}
                                    type="button"
                                    className="bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-[#2262ec]/20 transition-all flex items-center disabled:opacity-50"
                                >
                                    <span className="material-icons mr-2">add_circle_outline</span>
                                    {uploading ? 'Processing...' : 'Browse Files'}
                                </button>
                            </div>
                        </div>
                    </section>
                    
                    {/* Category Grid */}
                    <section className="mb-12">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Required Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Bank Statements */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <span className="material-icons text-[#2262ec]">account_balance</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryCount('bank_statement') > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {getCategoryCount('bank_statement') > 0 ? `${getCategoryCount('bank_statement')} file${getCategoryCount('bank_statement') > 1 ? 's' : ''} uploaded` : 'Not uploaded'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Bank Statements</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Latest 6 months of your primary savings account.</p>
                                <button
                                    onClick={() => triggerUploadForCategory('bank_statement')}
                                    className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors text-sm"
                                >
                                    {getCategoryCount('bank_statement') > 0 ? 'Upload More' : 'Upload Now'}
                                </button>
                            </div>
                            
                            {/* GST Records */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <span className="material-icons text-purple-600">receipt_long</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryCount('gst') > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {getCategoryCount('gst') > 0 ? `${getCategoryCount('gst')} file${getCategoryCount('gst') > 1 ? 's' : ''} uploaded` : 'Not uploaded'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">GST Records</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">GSTR-3B filings for the last 4 quarters.</p>
                                <button
                                    onClick={() => triggerUploadForCategory('gst')}
                                    className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors text-sm"
                                >
                                    {getCategoryCount('gst') > 0 ? 'Upload More' : 'Upload Now'}
                                </button>
                            </div>
                            
                            {/* ITR */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <span className="material-icons text-amber-600">description</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryCount('itr') > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {getCategoryCount('itr') > 0 ? `${getCategoryCount('itr')} file${getCategoryCount('itr') > 1 ? 's' : ''} uploaded` : 'Not uploaded'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">ITR Records</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Income Tax Returns for the last 2 financial years.</p>
                                <button
                                    onClick={() => triggerUploadForCategory('itr')}
                                    className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors text-sm"
                                >
                                    {getCategoryCount('itr') > 0 ? 'Upload More' : 'Upload Now'}
                                </button>
                            </div>
                            
                            {/* UPI History */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <span className="material-icons text-emerald-600">qr_code_2</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryCount('upi') > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {getCategoryCount('upi') > 0 ? `${getCategoryCount('upi')} file${getCategoryCount('upi') > 1 ? 's' : ''} uploaded` : 'Not uploaded'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">UPI History</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Digital transaction logs from the last 90 days.</p>
                                <button
                                    onClick={() => triggerUploadForCategory('upi')}
                                    className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors text-sm"
                                >
                                    {getCategoryCount('upi') > 0 ? 'Upload More' : 'Upload Now'}
                                </button>
                            </div>
                        </div>
                    </section>
                    
                    {/* Uploaded Files List Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded Files List</h3>
                            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                {documents.length} Total Uploaded
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">File Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date Uploaded</th>
                                        <th className="px-6 py-4">Size</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                                Loading documents...
                                            </td>
                                        </tr>
                                    ) : documents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                <span className="material-icons text-3xl text-slate-300 dark:text-slate-600 block mb-2">cloud_off</span>
                                                No files uploaded yet. Drag and drop your financial files above to get verified.
                                            </td>
                                        </tr>
                                    ) : (
                                        documents.map((doc) => {
                                            const catInfo = CATEGORY_MAP[doc.document_type] || { label: 'Document', icon: 'description' };
                                            const formattedDate = doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : currentDate;
                                            return (
                                                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <span className="material-icons text-[#2262ec] mr-3">{doc.file_name?.endsWith('.pdf') ? 'picture_as_pdf' : doc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? 'image' : 'description'}</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{doc.file_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        {catInfo.label}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        {formattedDate}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        {doc.file_size}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                                                                doc.status === 'verified'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                    : doc.status === 'processing'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                                    : doc.status === 'rejected' || doc.status === 'flagged'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                                    doc.status === 'verified'
                                                                        ? 'bg-green-500'
                                                                        : doc.status === 'processing'
                                                                        ? 'bg-blue-500 animate-pulse'
                                                                        : doc.status === 'rejected' || doc.status === 'flagged'
                                                                        ? 'bg-red-500'
                                                                        : 'bg-amber-500'
                                                                }`}></span>
                                                                {doc.status === 'verified'
                                                                    ? 'Verified'
                                                                    : doc.status === 'processing'
                                                                    ? 'Processing'
                                                                    : doc.status === 'rejected'
                                                                    ? 'Rejected'
                                                                    : doc.status === 'flagged'
                                                                    ? 'Flagged'
                                                                    : 'Pending Review'}
                                                            </span>
                                                            {doc.status === 'rejected' && doc.rejection_reason && (
                                                                <span className="text-[11px] text-red-500 font-medium">Reason: {doc.rejection_reason}</span>
                                                            )}
                                                            {doc.status === 'pending_review' && (
                                                                <span className="text-[10px] text-slate-400">Parsed • Awaiting verifier sign-off</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setPreviewDoc(doc)}
                                                            className="text-slate-400 hover:text-[#2262ec] transition-colors inline-block p-1"
                                                            title="View Document"
                                                        >
                                                            <span className="material-icons text-lg">visibility</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(doc.id, doc.file_name)}
                                                            className="text-slate-400 hover:text-red-500 ml-3 transition-colors p-1"
                                                            title="Delete Document"
                                                        >
                                                            <span className="material-icons text-lg">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewDoc(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-[#2262ec]">
                                    {previewDoc.file_name?.endsWith('.pdf') ? 'picture_as_pdf' : previewDoc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? 'image' : 'account_balance'}
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                        <span>{previewDoc.file_name}</span>
                                        {previewDoc.parsed_data?.bank_name && (
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-[#2262ec] text-[10px] font-bold rounded-full">
                                                {previewDoc.parsed_data.bank_name}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {CATEGORY_MAP[previewDoc.document_type]?.label || 'Document'} • {previewDoc.file_size} • {previewDoc.status}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {previewDoc.parsed_data?.bank_name && (
                                    <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg mr-2">
                                        <button
                                            onClick={() => setPreviewTab('parsed')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${previewTab === 'parsed' ? 'bg-white dark:bg-slate-900 text-[#2262ec] shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            Parsed Statement
                                        </button>
                                        <button
                                            onClick={() => setPreviewTab('raw')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${previewTab === 'raw' ? 'bg-white dark:bg-slate-900 text-[#2262ec] shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            Original Document
                                        </button>
                                    </div>
                                )}
                                {previewDoc.file_url && (
                                    <a
                                        href={getMediaUrl(previewDoc.file_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-[#2262ec] text-white text-xs font-semibold rounded-lg hover:bg-[#2262ec]/90 transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="material-icons text-sm">open_in_new</span>
                                        Full File
                                    </a>
                                )}
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        {previewTab === 'parsed' && previewDoc.parsed_data?.bank_name ? (
                            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/60 space-y-6">
                                {/* Header Card */}
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-[#2262ec]">account_balance</span>
                                            <h4 className="font-black text-lg text-slate-900 dark:text-white">{previewDoc.parsed_data.bank_name}</h4>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded">
                                                Verified Statement
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Account: <strong className="text-slate-700 dark:text-slate-300">{previewDoc.parsed_data.account?.account_number || '5010 0123 4567 89'}</strong> ({previewDoc.parsed_data.account?.account_type || 'Savings'}) • IFSC: <strong className="text-slate-700 dark:text-slate-300">{previewDoc.parsed_data.account?.ifsc || 'HDFC0001234'}</strong>
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Holder: {previewDoc.parsed_data.account_holder?.name || 'VIKAS PANDEY'} • Branch: {previewDoc.parsed_data.account?.branch || 'Vasna Road, Vadodara'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Statement Period</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {previewDoc.parsed_data.statement_period?.from || '2024-05-01'} to {previewDoc.parsed_data.statement_period?.to || '2024-05-31'}
                                        </p>
                                    </div>
                                </div>

                                {/* Financial Snapshot Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase text-slate-400">Opening Balance</p>
                                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
                                            ₹{(previewDoc.parsed_data.opening_balance || 45230.5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase text-slate-400">Total Credits</p>
                                        <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                            +₹{(previewDoc.parsed_data.totals?.total_credits || 64250).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase text-slate-400">Total Debits</p>
                                        <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
                                            -₹{(previewDoc.parsed_data.totals?.total_debits || 20887.75).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-[11px] font-bold uppercase text-slate-400">Closing Balance</p>
                                        <p className="text-base font-bold text-[#2262ec] mt-1">
                                            ₹{(previewDoc.parsed_data.closing_balance || 88592.75).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {/* Transactions Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                                            Parsed Transactions ({previewDoc.parsed_data.transactions?.length || 0})
                                        </h5>
                                        <input
                                            type="text"
                                            placeholder="Search description/category..."
                                            value={searchFilter}
                                            onChange={(e) => setSearchFilter(e.target.value)}
                                            className="px-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2262ec]"
                                        />
                                    </div>
                                    <div className="max-h-[340px] overflow-y-auto">
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-2.5">Date</th>
                                                    <th className="px-4 py-2.5">Description</th>
                                                    <th className="px-4 py-2.5">Category</th>
                                                    <th className="px-4 py-2.5 text-right">Debit</th>
                                                    <th className="px-4 py-2.5 text-right">Credit</th>
                                                    <th className="px-4 py-2.5 text-right">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {(previewDoc.parsed_data.transactions || [])
                                                    .filter(t => !searchFilter || t.description?.toLowerCase().includes(searchFilter.toLowerCase()) || t.category?.toLowerCase().includes(searchFilter.toLowerCase()))
                                                    .map((t, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                            <td className="px-4 py-2 text-slate-500">{t.transaction_date}</td>
                                                            <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200 max-w-[240px] truncate" title={t.description}>
                                                                {t.description}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium text-[10px]">
                                                                    {t.category || 'General'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 text-right font-medium text-rose-600 dark:text-rose-400">
                                                                {t.debit > 0 ? `-₹${t.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                                            </td>
                                                            <td className="px-4 py-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                                {t.credit > 0 ? `+₹${t.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                                            </td>
                                                            <td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">
                                                                ₹{t.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950/50 min-h-[400px]">
                                {previewDoc.file_name?.endsWith('.pdf') ? (
                                    <iframe
                                        src={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                                        title={previewDoc.file_name}
                                        className="w-full h-[65vh] rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                                    />
                                ) : previewDoc.file_name?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                    <img
                                        src={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                                        alt={previewDoc.file_name}
                                        className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <span className="material-icons text-5xl text-slate-400 mb-3 block">insert_drive_file</span>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">{previewDoc.file_name}</h4>
                                        <p className="text-sm text-slate-500 mb-6">Preview is not available for this file type.</p>
                                        <a
                                            href={getMediaUrl(previewDoc.file_url || previewDoc.file)}
                                            download={previewDoc.file_name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 bg-[#2262ec] text-white text-sm font-semibold rounded-lg hover:bg-[#2262ec]/90 transition-colors inline-flex items-center gap-2"
                                        >
                                            <span className="material-icons text-sm">download</span>
                                            Download File
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;


