import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
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

  const handleNext = async (e) => {
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
      navigate('/loan-application');
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
            <h1 className="text-3xl font-bold text-gray-900">Borrower Registration</h1>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">1</span>
              Personal Details
              <div className="w-12 h-px bg-gray-300 mx-4"></div>
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">2</span>
              Loan Request
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Step 1: Personal Information</h2>
              <p className="text-sm text-gray-500 mt-1">Please provide your basic information to get started.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNext} className="space-y-6">
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" placeholder="Jane" required name="first_name" value={form.first_name} onChange={handleChange} />
                  <Input label="Last Name" placeholder="Doe" required name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Email Address" type="email" placeholder="jane@example.com" required name="email" value={form.email} onChange={handleChange} />
                  <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" required name="phone_number" value={form.phone_number} onChange={handleChange} />
                </div>
                
                <Input label="Create Password" type="password" placeholder="Minimum 8 characters" required minLength={8} name="password" value={form.password} onChange={handleChange} />
                <Input label="Occupation" placeholder="Software Engineer" name="occupation" value={form.occupation} onChange={handleChange} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input placeholder="City" className="col-span-2" required name="city" value={form.city} onChange={handleChange} />
                    <Input placeholder="State" required name="state" value={form.state} onChange={handleChange} />
                    <Input placeholder="ZIP (optional)" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <Link to="/role-selection" className="text-gray-500 hover:text-gray-900 font-medium">
                    Back
                  </Link>
                  <Button type="submit" className="px-8" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Continue to Step 2'}
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

export default BorrowerRegistration;
