import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const DocumentUpload = () => {
    return (
        <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans text-slate-800 dark:text-slate-200 antialiased">
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
                <div className="p-4 mt-auto">
                    <div className="bg-[#2262ec]/5 rounded-xl p-4 border border-[#2262ec]/10">
                        <p className="text-xs font-semibold text-[#2262ec] uppercase mb-2">Support Available</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Need help with your application?</p>
                        <button className="w-full py-2 bg-[#2262ec] text-white text-sm font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors">Contact Expert</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold">Hello, Jonathan</h1>
                        <p className="text-sm text-slate-500">Here's your financial status as of Oct 24, 2023.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                            <span className="material-icons text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
                            <div className="flex items-center bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                <span className="material-icons text-[#2262ec] mr-3">verified_user</span>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Security Status</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">256-bit AES Encrypted</p>
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    {/* Main Upload Hero Zone */}
                    <section className="mb-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#2262ec] to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#2262ec]/30 bg-white dark:bg-slate-900 rounded-xl p-12 text-center hover:border-[#2262ec] transition-all cursor-pointer">
                                <div className="w-20 h-20 bg-[#2262ec]/10 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-icons text-[#2262ec] text-4xl">cloud_upload</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload your financial documents</h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">Drag and drop your files here, or click to browse from your computer. Supports PDF, JPG, PNG (Max 10MB each).</p>
                                <button className="bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-[#2262ec]/20 transition-all flex items-center">
                                    <span className="material-icons mr-2">add_circle_outline</span>
                                    Browse Files
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
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        2 files uploaded
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Bank Statements</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Latest 6 months of your primary savings account.</p>
                                <button className="w-full py-2 border border-[#2262ec] text-[#2262ec] hover:bg-[#2262ec]/5 font-medium rounded-lg transition-colors text-sm">Upload More</button>
                            </div>
                            
                            {/* GST Records */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <span className="material-icons text-purple-600">receipt_long</span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                        Not uploaded
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">GST Records</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">GSTR-3B filings for the last 4 quarters.</p>
                                <button className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg transition-colors hover:bg-[#2262ec]/90 text-sm">Upload Now</button>
                            </div>
                            
                            {/* ITR */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow border-l-4 border-l-amber-400 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <span className="material-icons text-amber-600">description</span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                        1 file uploaded
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">ITR Records</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Income Tax Returns for the last 2 financial years.</p>
                                <button className="w-full py-2 border border-[#2262ec] text-[#2262ec] hover:bg-[#2262ec]/5 font-medium rounded-lg transition-colors text-sm">Upload More</button>
                            </div>
                            
                            {/* UPI History */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <span className="material-icons text-emerald-600">qr_code_2</span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                        Not uploaded
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">UPI History</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Digital transaction logs from the last 90 days.</p>
                                <button className="w-full py-2 bg-[#2262ec] text-white font-medium rounded-lg hover:bg-[#2262ec]/90 transition-colors text-sm">Upload Now</button>
                            </div>
                        </div>
                    </section>
                    
                    {/* Uploaded Files List Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded Files List</h3>
                            <div className="flex space-x-2">
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                    <input className="pl-10 pr-4 py-2 w-full text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-[#2262ec] focus:border-[#2262ec] outline-none" placeholder="Search files..." type="text"/>
                                </div>
                            </div>
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
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="material-icons text-red-500 mr-3">picture_as_pdf</span>
                                                <span className="font-medium text-slate-900 dark:text-white">HDFC_Savings_Oct23.pdf</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Bank Statement</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Oct 24, 2023</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">1.2 MB</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                Verified
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-[#2262ec] transition-colors"><span className="material-icons text-lg">visibility</span></button>
                                            <button className="text-slate-400 hover:text-red-500 ml-3 transition-colors"><span className="material-icons text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="material-icons text-red-500 mr-3">picture_as_pdf</span>
                                                <span className="font-medium text-slate-900 dark:text-white">ITR_V_AY_2023.pdf</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">ITR Records</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Oct 25, 2023</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">2.4 MB</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                                                Processing
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-[#2262ec] transition-colors"><span className="material-icons text-lg">visibility</span></button>
                                            <button className="text-slate-400 hover:text-red-500 ml-3 transition-colors"><span className="material-icons text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="material-icons text-[#2262ec] mr-3">image</span>
                                                <span className="font-medium text-slate-900 dark:text-white">Bank_Salary_Credit.jpg</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Bank Statement</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Oct 26, 2023</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">850 KB</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                Verified
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-[#2262ec] transition-colors"><span className="material-icons text-lg">visibility</span></button>
                                            <button className="text-slate-400 hover:text-red-500 ml-3 transition-colors"><span className="material-icons text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-200 dark:border-slate-700">
                            <button className="text-[#2262ec] hover:text-[#2262ec]/80 font-semibold text-sm transition-colors">View All History</button>
                        </div>
                    </section>
                    
                    {/* Security Note */}
                    <footer className="mt-12 flex flex-col xl:flex-row items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 gap-6">
                        <div className="flex items-center">
                            <div className="bg-[#2262ec]/10 p-3 rounded-full mr-4 shrink-0">
                                <span className="material-icons text-[#2262ec]">security</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Bank-Grade Security</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">All uploaded documents are encrypted with 256-bit AES protocol and stored in secure cloud environments.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 shrink-0">
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Compliance</p>
                                <div className="flex space-x-2">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500">GDPR</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500">ISO 27001</span>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Verified By</p>
                                <div className="flex items-center">
                                    <img alt="Security Partner" className="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE7GxbeDCwesP2PavUhZVEpJi4qQcSHleikVpttmXBfEmGx9z0jc0jnLciyqM7nbIBXdfEI-qTEVIVHsnH75aOHsKYNmr0o7lnqLCn2IKN3-NryrNm0q6PMbvKRkY-KAn4fGMulpuujl7AcZ4WYAoWql0OHH10BAmkSN2b4cATD94ctziHz0uFgrN1E5ENGN3hkc9img-_fXAx6xmCVSdYu3ynOfo7ELidA7IoNqhcYpTX0EOjRCf4qcvfqDbCR_BFQlXnUS1qsAI"/>
                                    <span className="ml-2 text-sm font-bold text-slate-900 dark:text-white">SecureVault</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default DocumentUpload;
