import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Card, { ContrastCard } from '../components/ui/Card';
import Logo from '../components/ui/Logo';
import { login, saveAuthSession } from '../lib/api';

const demoAccounts = {
    borrower: {
        usernameOrEmail: 'borrower0@example.com',
        password: 'Test1234',
    },
    lender: {
        usernameOrEmail: 'lender0@example.com',
        password: 'Test1234',
    },
    admin: {
        usernameOrEmail: 'admin@finpulse.com',
        password: 'Admin@123',
    },
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const performLogin = async (usernameOrEmail, userPassword) => {
        setError('');
        setIsSubmitting(true);

        try {
            const data = await login(usernameOrEmail, userPassword);
            saveAuthSession(data.token, data.user);

            if (data?.user?.role === 'admin' || data?.user?.is_staff) {
                navigate('/admin/dashboard');
                return;
            }
            if (data?.user?.role === 'lender') {
                navigate('/lender/dashboard');
                return;
            }
            navigate('/borrower/dashboard');
        } catch (err) {
            setError(err.message || 'Unable to sign in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        await performLogin(email, password);
    };

    const handleDemoLogin = async (role) => {
        const credentials = demoAccounts[role];
        setEmail(credentials.usernameOrEmail);
        setPassword(credentials.password);
        await performLogin(credentials.usernameOrEmail, credentials.password);
    };

    return (
        <main className="flex w-full min-h-screen font-satoshi text-[var(--text-primary)] bg-[var(--bg-canvas)]">
            {/* Left Side: Authentication Form */}
            <section className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-[var(--bg-canvas)]">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center lg:text-left">
                        <div className="flex items-center justify-between mb-6">
                            <Logo to="/" size="md" />
                            <ThemeToggle />
                        </div>
                        <h1 className="font-clash text-3xl font-bold text-[var(--text-primary)] mb-1">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)]">Access your credit portfolio and underwriting portal</p>
                    </div>

                    {/* Login Card */}
                    <Card className="p-8">
                        <form className="space-y-4" onSubmit={handleLogin}>
                            {error && (
                                <div className="rounded-[var(--radius-md)] border border-[var(--status-error)]/30 bg-[var(--status-error-bg)] p-3 text-xs font-semibold text-[var(--status-error)]">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">
                                        mail
                                    </span>
                                    <input 
                                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--accent)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors" 
                                        id="email" 
                                        name="email" 
                                        placeholder="name@company.com" 
                                        required 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-medium text-[var(--text-secondary)]" htmlFor="password">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">
                                        lock
                                    </span>
                                    <input 
                                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--accent)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        required 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full bg-[var(--accent)] text-[var(--text-on-accent)] font-semibold py-3 px-4 rounded-[var(--radius-pill)] shadow-[var(--shadow-accent-glow)] transition-all hover:opacity-90 active:scale-[0.98] text-xs disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>

                            {/* Demo Accounts */}
                            <div className="pt-5 border-t border-[var(--border-subtle)]">
                                <p className="text-xs font-medium text-[var(--text-secondary)] mb-2.5 text-center">
                                    Instant Sandbox Access (One-Click)
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDemoLogin('borrower')}
                                        className="py-2 px-2 border border-[var(--border-subtle)] hover:border-[var(--accent)] rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] text-[11px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-all text-center"
                                    >
                                        Borrower
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDemoLogin('lender')}
                                        className="py-2 px-2 border border-[var(--border-subtle)] hover:border-[var(--accent)] rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] text-[11px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-all text-center"
                                    >
                                        Lender
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDemoLogin('admin')}
                                        className="py-2 px-2 border border-[var(--accent)]/40 hover:border-[var(--accent)] rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[11px] font-bold text-[var(--accent)] transition-all text-center shadow-[0_0_10px_var(--accent-glow)]"
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
                        Don't have an account? 
                        <Link className="font-semibold text-[var(--accent)] hover:underline ml-1" to="/role-selection">
                            Create account
                        </Link>
                    </p>
                </div>
            </section>

            {/* Right Side: Visual Graphic Column */}
            <section className="hidden lg:flex w-[55%] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] relative overflow-hidden items-center justify-center p-12">
                <div className="relative z-10 w-full max-w-xl space-y-6">
                    <span className="inline-block px-3.5 py-1 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-semibold uppercase tracking-wider">
                        FinPulse Intelligence
                    </span>
                    <h2 className="font-clash text-4xl font-bold leading-tight text-[var(--text-primary)]">
                        Next-Generation Underwriting <br />
                        <span className="text-[var(--accent)]">Driven by Deep Learning</span>
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                        Join leading NBFCs and financial institutions operating on FinPulse for instant OCR statement audit and predictive credit scoring.
                    </p>

                    {/* Abstract Mini Dashboard Preview */}
                    <ContrastCard className="p-6 rounded-[var(--radius-lg)] shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                                Institutional Health Metrics
                            </span>
                            <span className="material-symbols-outlined text-base">verified</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] opacity-75">Avg Ingestion Latency</p>
                                <p className="font-clash text-2xl font-bold mt-0.5">850 ms</p>
                            </div>
                            <div>
                                <p className="text-[11px] opacity-75">Portfolio Underwriting</p>
                                <p className="font-clash text-2xl font-bold mt-0.5">99.8%</p>
                            </div>
                        </div>
                    </ContrastCard>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
