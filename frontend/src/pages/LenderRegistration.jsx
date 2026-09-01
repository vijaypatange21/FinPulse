import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { registerLender, saveAuthSession } from '../lib/api';

const usernameFromEmail = (email) => {
  const local = email.split('@')[0] || 'lender';
  return `${local}_${Date.now().toString().slice(-6)}`;
};

const LenderRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    institution_name: '',
    institution_type: 'Commercial Bank',
    monthly_loan_volume: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        username: usernameFromEmail(form.email),
        monthly_loan_volume: Number(form.monthly_loan_volume || 0),
      };
      const data = await registerLender(payload);
      saveAuthSession(data.token, data.user);
      navigate('/lender/plans');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Lender Registration</h1>
            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">1</span>
              Institution Details
              <div className="w-12 h-px bg-slate-300 dark:bg-slate-700 mx-4"></div>
              <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mr-2">2</span>
              Plan Selection
            </div>
          </div>
          
          <Card className="border-indigo-100 dark:border-slate-800">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/30">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Step 1: Institution Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Register your financial institution to start accessing the FinPulse intelligence network.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNext} className="space-y-6">
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Input label="Institution Name" placeholder="Acme Lending Corp" required name="institution_name" value={form.institution_name} onChange={handleChange} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution Type</label>
                    <select name="institution_type" value={form.institution_type} onChange={handleChange} className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                      <option className="dark:bg-slate-900">Commercial Bank</option>
                      <option className="dark:bg-slate-900">Credit Union</option>
                      <option className="dark:bg-slate-900">Private Equity</option>
                      <option className="dark:bg-slate-900">Alternative Lender</option>
                    </select>
                  </div>
                  <Input label="Estimated Monthly Loan Volume" type="number" placeholder="10000000" required name="monthly_loan_volume" value={form.monthly_loan_volume} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Admin First Name" placeholder="John" required name="first_name" value={form.first_name} onChange={handleChange} />
                  <Input label="Admin Last Name" placeholder="Smith" required name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Work Email Address" type="email" placeholder="john.smith@acmelending.com" required name="email" value={form.email} onChange={handleChange} />
                  <Input label="Password" type="password" minLength={8} placeholder="Minimum 8 characters" required name="password" value={form.password} onChange={handleChange} />
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <Link to="/role-selection" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium">
                    Back
                  </Link>
                  <Button type="submit" className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'View Plans'}
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

export default LenderRegistration;
