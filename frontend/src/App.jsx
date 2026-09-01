import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeContext';
import GlobalThemeToggle from './components/GlobalThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Placeholder for Navbar */}
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
            
            {/* Protected Lender / Admin Routes */}
            <Route path="/lender/plans" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><LenderPlans /></ProtectedRoute>} />
            <Route path="/lender/dashboard" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><LenderDashboard /></ProtectedRoute>} />
            <Route path="/lender/portfolio" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><PortfolioPage /></ProtectedRoute>} />
            <Route path="/lender/borrowers" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><MyBorrowers /></ProtectedRoute>} />
            <Route path="/lender/borrowers/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><BorrowerMonitoring /></ProtectedRoute>} />
            <Route path="/lender/applications" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><LoanApplications /></ProtectedRoute>} />
            <Route path="/lender/applications/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><ApplicationDetail /></ProtectedRoute>} />
            <Route path="/lender/documents" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><AdminDocumentVerification /></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><AdminDocumentVerification /></ProtectedRoute>} />
            <Route path="/lender/alerts" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><AlertDetail /></ProtectedRoute>} />
            <Route path="/lender/alerts/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><AlertDetail /></ProtectedRoute>} />
            <Route path="/borrower/profile/:id" element={<ProtectedRoute allowedRoles={['lender', 'admin']}><BorrowerProfile /></ProtectedRoute>} />
          </Routes>
        </main>
        {/* Global theme toggle floating button */}
        <GlobalThemeToggle />
      </div>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
