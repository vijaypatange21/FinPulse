import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
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

  const handleSubmit = async (e) => {
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
      navigate('/lender/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] font-satoshi text-[var(--text-primary)] flex flex-col pb-16">
      <Navbar />
      
      <main className="flex-grow flex py-12 px-6 sm:px-8">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Institution Onboarding
            </span>
            <h1 className="font-clash text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
              Register Institutional Lender
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
              Deploy automated credit underwriting and continuous portfolio surveillance.
            </p>
          </div>
          
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[var(--status-error)]/30 text-xs font-semibold">
                  {error}
                </div>
              )}

              <Input label="Corporate Institution Name" placeholder="Acme Capital Ltd" required name="institution_name" value={form.institution_name} onChange={handleChange} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Institution Classification</label>
                  <select
                    name="institution_type"
                    value={form.institution_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-canvas)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--accent)] text-xs"
                  >
                    <option className="bg-[var(--bg-surface)]">Commercial Bank</option>
                    <option className="bg-[var(--bg-surface)]">NBFC / Microfinance</option>
                    <option className="bg-[var(--bg-surface)]">Credit Union</option>
                    <option className="bg-[var(--bg-surface)]">Private Debt / Equity</option>
                    <option className="bg-[var(--bg-surface)]">Fintech Lending Platform</option>
                  </select>
                </div>
                <Input label="Estimated Monthly Loan Volume (₹)" type="number" placeholder="10000000" required name="monthly_loan_volume" value={form.monthly_loan_volume} onChange={handleChange} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Lead Underwriter First Name" placeholder="John" required name="first_name" value={form.first_name} onChange={handleChange} />
                <Input label="Lead Underwriter Last Name" placeholder="Smith" required name="last_name" value={form.last_name} onChange={handleChange} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Institutional Email Address" type="email" placeholder="john.smith@acmecapital.com" required name="email" value={form.email} onChange={handleChange} />
                <Input label="Password" type="password" minLength={8} placeholder="Minimum 8 characters" required name="password" value={form.password} onChange={handleChange} />
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <Link to="/role-selection" className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  ← Back to Roles
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-bold shadow-[var(--shadow-accent-glow)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Complete Lender Registration'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LenderRegistration;
