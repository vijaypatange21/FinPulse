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
            
            {/* Borrower Routes */}
            <Route path="/register/borrower" element={<BorrowerRegistration />} />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
            <Route path="/borrower/upload" element={<DocumentUpload />} />
            <Route path="/borrower/health-score" element={<HealthScorePage />} />
            <Route path="/borrower/loans" element={<LoansPage />} />
            <Route path="/borrower/transactions" element={<TransactionsPage />} />
            <Route path="/recommendations" element={<Recommendations />} />
            
            {/* Lender Routes */}
            <Route path="/register/lender" element={<LenderRegistration />} />
            <Route path="/lender/plans" element={<LenderPlans />} />
            <Route path="/lender/dashboard" element={<LenderDashboard />} />
            <Route path="/lender/portfolio" element={<PortfolioPage />} />
            <Route path="/lender/borrowers" element={<MyBorrowers />} />
            <Route path="/lender/borrowers/:id" element={<BorrowerMonitoring />} />
            <Route path="/lender/applications" element={<LoanApplications />} />
            <Route path="/lender/applications/:id" element={<ApplicationDetail />} />
            <Route path="/lender/alerts" element={<AlertDetail />} />
            <Route path="/lender/alerts/:id" element={<AlertDetail />} />
            <Route path="/borrower/profile/:id" element={<BorrowerProfile />} />
            <Route path="/borrower/find-lender" element={<FindLender />} />
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
