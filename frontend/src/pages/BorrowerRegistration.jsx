import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { registerBorrower, saveAuthSession } from '../lib/api';

const usernameFromEmail = (email) => {
  const local = email.split('@')[0] || 'borrower';
  return `${local}_${Date.now().toString().slice(-6)}`;
};

const BorrowerRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    city: '',
    state: '',
    occupation: '',
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
      };
      const data = await registerBorrower(payload);
      saveAuthSession(data.token, data.user);
      navigate('/borrower/dashboard');
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
              Borrower Onboarding
            </span>
            <h1 className="font-clash text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
              Create Borrower Account
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
              Access pre-approved credit facilities and real-time health score evaluations.
            </p>
          </div>
          
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[var(--status-error)]/30 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Jane" required name="first_name" value={form.first_name} onChange={handleChange} />
                <Input label="Last Name" placeholder="Doe" required name="last_name" value={form.last_name} onChange={handleChange} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email Address" type="email" placeholder="jane@example.com" required name="email" value={form.email} onChange={handleChange} />
                <Input label="Phone Number" type="tel" placeholder="9876543210" required name="phone_number" value={form.phone_number} onChange={handleChange} />
              </div>
              
              <Input label="Password" type="password" placeholder="Minimum 8 characters" required minLength={8} name="password" value={form.password} onChange={handleChange} />
              <Input label="Occupation / Industry" placeholder="Software Engineer" name="occupation" value={form.occupation} onChange={handleChange} />
              
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Residential Location</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="City (e.g. Mumbai)" required name="city" value={form.city} onChange={handleChange} />
                  <Input placeholder="State (e.g. Maharashtra)" required name="state" value={form.state} onChange={handleChange} />
                </div>
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
                  {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BorrowerRegistration;
