import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import BorrowerRegistration from './pages/BorrowerRegistration';
import LoanApplication from './pages/LoanApplication';
import BorrowerDashboard from './pages/BorrowerDashboard';
import DocumentUpload from './pages/DocumentUpload';
import Recommendations from './pages/Recommendations';
import LenderRegistration from './pages/LenderRegistration';
import LenderPlans from './pages/LenderPlans';
import LenderDashboard from './pages/LenderDashboard';
import AlertDetail from './pages/AlertDetail';
import BorrowerProfile from './pages/BorrowerProfile';
import FindLender from './pages/FindLender';
import MyBorrowers from './pages/MyBorrowers';
import LoanApplications from './pages/LoanApplications';
import ApplicationDetail from './pages/ApplicationDetail';
import BorrowerMonitoring from './pages/BorrowerMonitoring';
import HealthScorePage from './pages/HealthScorePage';
import LoansPage from './pages/LoansPage';
import TransactionsPage from './pages/TransactionsPage';
import PortfolioPage from './pages/PortfolioPage';
import AdminDocumentVerification from './pages/AdminDocumentVerification';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLoanOversight from './pages/AdminLoanOversight';
import AdminMLEngine from './pages/AdminMLEngine';
import AdminAuditLogs from './pages/AdminAuditLogs';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors duration-300">
            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/role-selection" element={<RoleSelectionPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Public Registration Routes */}
                <Route path="/register/borrower" element={<BorrowerRegistration />} />
                <Route path="/register/lender" element={<LenderRegistration />} />
                
                {/* Protected Borrower Routes */}
                <Route path="/loan-application" element={<ProtectedRoute allowedRoles={['borrower']}><LoanApplication /></ProtectedRoute>} />
                <Route path="/borrower/dashboard" element={<ProtectedRoute allowedRoles={['borrower']}><BorrowerDashboard /></ProtectedRoute>} />
                <Route path="/borrower/upload" element={<ProtectedRoute allowedRoles={['borrower']}><DocumentUpload /></ProtectedRoute>} />
                <Route path="/borrower/health-score" element={<ProtectedRoute allowedRoles={['borrower']}><HealthScorePage /></ProtectedRoute>} />
                <Route path="/borrower/loans" element={<ProtectedRoute allowedRoles={['borrower']}><LoansPage /></ProtectedRoute>} />
                <Route path="/borrower/transactions" element={<ProtectedRoute allowedRoles={['borrower']}><TransactionsPage /></ProtectedRoute>} />
                <Route path="/borrower/find-lender" element={<ProtectedRoute allowedRoles={['borrower']}><FindLender /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute allowedRoles={['borrower']}><Recommendations /></ProtectedRoute>} />
                
                {/* Protected Lender Routes */}
                <Route path="/lender/plans" element={<ProtectedRoute allowedRoles={['lender']}><LenderPlans /></ProtectedRoute>} />
                <Route path="/lender/dashboard" element={<ProtectedRoute allowedRoles={['lender']}><LenderDashboard /></ProtectedRoute>} />
                <Route path="/lender/portfolio" element={<ProtectedRoute allowedRoles={['lender']}><PortfolioPage /></ProtectedRoute>} />
                <Route path="/lender/borrowers" element={<ProtectedRoute allowedRoles={['lender']}><MyBorrowers /></ProtectedRoute>} />
                <Route path="/lender/borrowers/:id" element={<ProtectedRoute allowedRoles={['lender']}><BorrowerMonitoring /></ProtectedRoute>} />
                <Route path="/lender/applications" element={<ProtectedRoute allowedRoles={['lender']}><LoanApplications /></ProtectedRoute>} />
                <Route path="/lender/applications/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><ApplicationDetail /></ProtectedRoute>} />
                <Route path="/lender/alerts" element={<ProtectedRoute allowedRoles={['lender']}><AlertDetail /></ProtectedRoute>} />
                <Route path="/lender/alerts/:id" element={<ProtectedRoute allowedRoles={['lender']}><AlertDetail /></ProtectedRoute>} />
                <Route path="/borrower/profile/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><BorrowerProfile /></ProtectedRoute>} />

                {/* Protected Platform Administrator Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={['admin']}><AdminDocumentVerification /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/loans" element={<ProtectedRoute allowedRoles={['admin']}><AdminLoanOversight /></ProtectedRoute>} />
                <Route path="/admin/ml-engine" element={<ProtectedRoute allowedRoles={['admin']}><AdminMLEngine /></ProtectedRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminAuditLogs /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
