import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { createLoanApplication, getCurrentUser, listBorrowers } from '../lib/api';

const TERM_MAP = {
  '12 Months': 12,
  '24 Months': 24,
  '36 Months': 36,
  '60 Months': 60,
};

const LoanApplication = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    requested_amount: '',
    loan_type: 'Debt Consolidation',
    requested_tenure_months: 36,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTermSelect = (label) => {
    setForm((prev) => ({
      ...prev,
      requested_tenure_months: TERM_MAP[label] || 36,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Please log in first.');
      }

      const borrowers = await listBorrowers();
      const borrowerProfile = borrowers.find((b) => b.user?.id === currentUser.id);

      if (!borrowerProfile?.borrower_id) {
        throw new Error('Borrower profile not found for the current account.');
      }

      await createLoanApplication({
        borrower: borrowerProfile.borrower_id,
        preferred_lender: null,
        loan_type: form.loan_type,
        requested_amount: Number(form.requested_amount),
        requested_tenure_months: Number(form.requested_tenure_months),
      });

      navigate('/borrower/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to submit loan application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">✓</span>
              Personal Details
              <div className="w-12 h-px bg-primary mx-4"></div>
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">2</span>
              Loan Request
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Step 2: Loan Details & Financials</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us how much you need and link your accounts for rapid approval.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply} className="space-y-8">
                {error && <p className="text-sm text-red-600">{error}</p>}
                
                {/* Loan Specifics */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Requested Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Loan Amount ($)" type="number" placeholder="50000" min="1000" required name="requested_amount" value={form.requested_amount} onChange={handleChange} />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loan Purpose</label>
                      <select name="loan_type" value={form.loan_type} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                        <option>Debt Consolidation</option>
                        <option>Home Improvement</option>
                        <option>Business Expansion</option>
                        <option>Major Purchase</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Term Length</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['12 Months', '24 Months', '36 Months', '60 Months'].map((term) => (
                        <label key={term} className="cursor-pointer">
                          <input
                            type="radio"
                            name="term"
                            className="peer sr-only"
                            checked={form.requested_tenure_months === TERM_MAP[term]}
                            onChange={() => handleTermSelect(term)}
                          />
                          <div className="text-center px-4 py-3 border border-gray-200 rounded-lg peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium">{term}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Data Connect */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Connect Financial Data</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Securely Link Your Bank Account</h4>
                    <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                      FinPulse uses Plaid to securely access your read-only financial data. This replaces traditional paperwork and speeds up approval.
                    </p>
                    <Button type="button" variant="secondary" className="bg-white">
                      Connect via Plaid
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <Link to="/register/borrower" className="text-gray-500 hover:text-gray-900 font-medium">
                    Back
                  </Link>
                  <Button type="submit" className="px-8 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LoanApplication;
