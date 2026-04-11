import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { login, saveAuthSession } from '../lib/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const data = await login(email, password);
            saveAuthSession(data.token, data.user);

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

    return (
        <main className="flex w-full min-h-screen font-sans text-slate-900 bg-[#f6f6f8]">
            <style>{`
                .bg-gradient-pulse {
                    background: linear-gradient(135deg, #2262ec 0%, #1a4db8 100%);
                }
                .abstract-pattern {
                    background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
                    background-size: 32px 32px;
                }
            `}</style>
            
            {/* Left Side: Authentication Form */}
            <section className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-12 md:p-20 bg-[#f6f6f8] dark:bg-[#101622]">
                <div className="w-full max-w-md">
                    {/* Logo & Heading */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                            <div className="w-10 h-10 bg-[#2262ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#2262ec]/30">
                                <span className="material-icons text-white">insights</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">FinPulse</span>
                            <div className="ml-auto"><ThemeToggle /></div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Access your portfolio and financial insights.</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
                                    {error}
                                </div>
                            )}
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail_outline</span>
                                    <input 
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#2262ec] focus:border-[#2262ec] transition-all text-slate-900 dark:text-white outline-none" 
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <a className="text-sm font-semibold text-[#2262ec] hover:underline" href="#">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_open</span>
                                    <input 
                                        className="w-full pl-11 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#2262ec] focus:border-[#2262ec] transition-all text-slate-900 dark:text-white outline-none" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        required 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                        <span className="material-icons text-xl">visibility</span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input className="w-4 h-4 text-[#2262ec] bg-slate-100 border-slate-300 rounded focus:ring-[#2262ec] dark:ring-offset-slate-900 dark:bg-slate-800 dark:border-slate-700" id="remember" name="remember" type="checkbox"/>
                                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 select-none" htmlFor="remember">Keep me logged in</label>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full bg-[#2262ec] hover:bg-[#2262ec]/90 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-[#2262ec]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900/50 px-2 text-slate-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Logins */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" type="button">
                                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRzstfnHEXiikV_oVbf2BC8PQWiZE3tfYJrQvVtz71a9d2344CfUiC-46TSfQM6ulgg3n_KjcElES21Omgo-1zsubMUdbsN3P1NKYbnjccBQaWB5ZGyy_IUliVPI2SqvI6I3WMYvs2gRosAZKU0nccKDcP-MxAGzw5dl4V5H-6hZMjyY-DEnstao2b6Z8DK3tGaZCW4Ryr9-NEg9iiy2Hu7G_9Bj-ljko01kYpfxNkVEE0-ah4BfGdlqcQmj9LIlLkWMcIoWeptUg" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" type="button">
                                    <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
                                </button>
                            </div>

                            {/* Demo Accounts Wrapper */}
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">Demo Accounts (For Testing)</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail('borrower@demo.com');
                                            setPassword('password123');
                                        }}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 dark:hover:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                    >
                                        Borrower Demo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail('lender@demo.com');
                                            setPassword('password123');
                                        }}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 dark:hover:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                    >
                                        Lender Demo
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account? 
                        <Link className="font-bold text-[#2262ec] hover:underline ml-1" to="/role-selection">Start free trial</Link>
                    </p>

                    {/* Footer Disclaimer */}
                    <footer className="mt-12 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
                            By logging in, you agree to our <br/>
                            <a className="hover:text-[#2262ec] transition-colors" href="#">Terms of Service</a> &amp; 
                            <a className="hover:text-[#2262ec] transition-colors ml-1" href="#">Privacy Policy</a>
                        </p>
                    </footer>
                </div>
            </section>

            {/* Right Side: Visual Graphic */}
            <section className="hidden lg:flex w-[55%] bg-gradient-pulse relative overflow-hidden items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute inset-0 abstract-pattern opacity-30"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1a4db8]/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 w-full max-w-2xl px-12 text-white">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="text-xs font-semibold tracking-wider uppercase">Fintech Excellence</span>
                        </div>
                        <h2 className="text-5xl font-bold leading-tight">Master your capital with <span className="text-white/80">real-time</span> intelligence.</h2>
                        <p className="text-xl text-blue-100/80 max-w-lg leading-relaxed">
                            Join over 10,000+ financial professionals who use FinPulse to track assets, analyze market trends, and secure their digital future.
                        </p>

                        {/* Abstract Dashboard Preview Element */}
                        <div className="relative mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                </div>
                                <div className="w-24 h-2 bg-white/20 rounded-full"></div>
                            </div>
                            <div className="flex items-end gap-3 h-40">
                                <div className="flex-1 bg-white/40 rounded-t-lg" style={{ height: "40%" }}></div>
                                <div className="flex-1 bg-white/60 rounded-t-lg" style={{ height: "65%" }}></div>
                                <div className="flex-1 bg-white/40 rounded-t-lg" style={{ height: "45%" }}></div>
                                <div className="flex-1 bg-white/80 rounded-t-lg" style={{ height: "90%" }}></div>
                                <div className="flex-1 bg-white/40 rounded-t-lg" style={{ height: "55%" }}></div>
                                <div className="flex-1 bg-white/50 rounded-t-lg" style={{ height: "75%" }}></div>
                                <div className="flex-1 bg-white/30 rounded-t-lg" style={{ height: "35%" }}></div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#2262ec] rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-white/10">
                                <span className="text-3xl font-bold">+24%</span>
                                <span className="text-[10px] uppercase tracking-tighter opacity-70">Growth Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Data Points Decoration */}
                <div className="absolute top-20 right-20 flex gap-4 animate-bounce" style={{ animationDuration: '3000ms' }}>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                        <span className="material-icons text-white">trending_up</span>
                    </div>
                </div>
                <div className="absolute bottom-20 left-20 flex gap-4 animate-bounce" style={{ animationDuration: '4000ms' }}>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                        <span className="material-icons text-white">security</span>
                    </div>
                </div>

            </section>
        </main>
    );
};

export default LoginPage;
