import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LenderPlans = () => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col font-sans bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
            <div className="flex h-full grow flex-col">
                
                {/* Navigation */}
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2262ec] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#2262ec]/20">
                            <span className="material-icons text-xl">account_balance_wallet</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight tracking-tight">FinPulse</h2>
                    </Link>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-[#2262ec] transition-colors">Solutions</Link>
                            <Link to="/lender/plans" className="text-[#2262ec] text-sm font-semibold">Pricing</Link>
                            <Link to="/" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-[#2262ec] transition-colors">Resources</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link to="/login" className="text-slate-600 dark:text-slate-300 text-sm font-semibold px-4 py-2 hover:text-[#2262ec] transition-colors">Sign In</Link>
                            <Link to="/register/lender" className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#2262ec] text-white text-sm font-bold leading-normal tracking-wide shadow-lg shadow-[#2262ec]/20 hover:bg-[#2262ec]/90 transition-all">
                                <span className="truncate">Start Free Trial</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 flex-col py-12 md:py-20 px-6 md:px-10 lg:px-40 max-w-[1440px] mx-auto w-full">
                    
                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center gap-6 mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2262ec]/10 text-[#2262ec] border border-[#2262ec]/20 text-xs font-bold uppercase tracking-widest">
                            Pricing Plans
                        </div>
                        <div className="flex flex-col gap-4 max-w-3xl">
                            <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                                Flexible Plans for <span className="text-[#2262ec]">Every Lender</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium">
                                Choose the right scale for your institution's growth. Start risk-free with our 14-day trial.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button className="px-6 py-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm text-sm font-bold text-slate-900 dark:text-white transition-all">Monthly</button>
                            <button className="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">
                                Yearly <span className="text-green-500 text-xs ml-1">Save 20%</span>
                            </button>
                        </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Starter Tier */}
                        <div className="flex flex-col gap-8 rounded-2xl border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-xl transition-all border-b-4 border-b-slate-300 dark:border-b-slate-700 hover:-translate-y-1">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Starter</h3>
                                <p className="text-slate-900 dark:text-white text-lg font-bold">Small NBFCs</p>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className="text-slate-900 dark:text-white text-5xl font-black tracking-tight">$499</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-lg font-bold">/mo</span>
                                </div>
                            </div>
                            <Link to="/register/lender" className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                                Start Free Trial
                            </Link>
                            <div className="flex flex-col gap-4">
                                <p className="text-slate-900 dark:text-white font-bold text-sm">Included features:</p>
                                <div className="space-y-4">
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-green-500 text-xl">check_circle</span>
                                        Basic risk assessment tools
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-green-500 text-xl">check_circle</span>
                                        Up to 100 applications/mo
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-green-500 text-xl">check_circle</span>
                                        Essential credit reporting
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-green-500 text-xl">check_circle</span>
                                        Email support (24h response)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="relative flex flex-col gap-8 rounded-2xl border-2 border-solid border-[#2262ec] bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-[#2262ec]/10 lg:scale-105 z-10 transition-transform hover:-translate-y-2">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2262ec] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                Recommended for Growth
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[#2262ec] text-sm font-bold uppercase tracking-widest">Enterprise</h3>
                                <p className="text-slate-900 dark:text-white text-lg font-bold">Commercial Banks</p>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className="text-slate-900 dark:text-white text-5xl font-black tracking-tight">$2,499</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-lg font-bold">/mo</span>
                                </div>
                            </div>
                            <Link to="/register/lender" className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-[#2262ec] text-white text-base font-bold shadow-lg shadow-[#2262ec]/25 hover:bg-[#2262ec]/90 transition-all">
                                Start Free Trial
                            </Link>
                            <div className="flex flex-col gap-4">
                                <p className="text-slate-900 dark:text-white font-bold text-sm">Everything in Starter, plus:</p>
                                <div className="space-y-4">
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-[#2262ec] text-xl">verified</span>
                                        Full AI analytics engine
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-[#2262ec] text-xl">verified</span>
                                        Real-time fraud alerts
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-[#2262ec] text-xl">verified</span>
                                        Full API access & Integrations
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-[#2262ec] text-xl">verified</span>
                                        Custom scoring models
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-[#2262ec] text-xl">verified</span>
                                        Priority 24/7 support
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Custom Tier */}
                        <div className="flex flex-col gap-8 rounded-2xl border border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:shadow-xl transition-all border-b-4 border-b-slate-300 dark:border-b-slate-700 hover:-translate-y-1">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">Custom</h3>
                                <p className="text-slate-900 dark:text-white text-lg font-bold">Large Institutions</p>
                                <div className="mt-4">
                                    <span className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">Let's Talk</span>
                                </div>
                            </div>
                            <Link to="/contact" className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
                                Contact Sales
                            </Link>
                            <div className="flex flex-col gap-4">
                                <p className="text-slate-900 dark:text-white font-bold text-sm">Enterprise-grade solutions:</p>
                                <div className="space-y-4">
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-indigo-500 text-xl">all_inclusive</span>
                                        Unlimited application scale
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-indigo-500 text-xl">all_inclusive</span>
                                        Dedicated account manager
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-indigo-500 text-xl">all_inclusive</span>
                                        On-premise deployment options
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-indigo-500 text-xl">all_inclusive</span>
                                        Custom SLAs & Legal terms
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-24 text-center">
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-8">Trusted by 200+ Financial Institutions</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
                            <div className="h-8 w-24 bg-slate-400 rounded-md"></div>
                            <div className="h-8 w-32 bg-slate-400 rounded-md"></div>
                            <div className="h-8 w-28 bg-slate-400 rounded-md"></div>
                            <div className="h-8 w-20 bg-slate-400 rounded-md"></div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-24 max-w-4xl mx-auto w-full">
                        <h2 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
                            
                            <details className="group py-6" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                                    <p className="text-slate-900 dark:text-white text-lg font-bold">How does the 14-day free trial work?</p>
                                    <span className="material-icons text-[#2262ec] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    You get full access to all Enterprise features for 14 days, including AI analytics and API access. No credit card required to start. We'll notify you 48 hours before the trial ends so you can choose a plan that fits.
                                </div>
                            </details>

                            <details className="group py-6">
                                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                                    <p className="text-slate-900 dark:text-white text-lg font-bold">Can I upgrade or downgrade my plan later?</p>
                                    <span className="material-icons text-[#2262ec] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    Absolutely. You can change your plan at any time through your dashboard. If you upgrade, the new features will be available immediately. Downgrades will take effect at the end of your current billing cycle.
                                </div>
                            </details>

                            <details className="group py-6">
                                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                                    <p className="text-slate-900 dark:text-white text-lg font-bold">What kind of API documentation is available?</p>
                                    <span className="material-icons text-[#2262ec] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    We provide comprehensive REST API documentation, including SDKs for Python, Node.js, and Java. Enterprise and Custom clients also get access to a dedicated integration engineer during onboarding.
                                </div>
                            </details>

                            <details className="group py-6">
                                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                                    <p className="text-slate-900 dark:text-white text-lg font-bold">Is my data secure and compliant?</p>
                                    <span className="material-icons text-[#2262ec] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                    Security is our top priority. FinPulse is SOC 2 Type II compliant and uses AES-256 encryption. We also support regional data residency requirements for Large Institutions on our Custom plan.
                                </div>
                            </details>

                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-24 rounded-[2rem] bg-slate-900 dark:bg-[#2262ec]/10 overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2262ec 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative px-8 py-16 md:p-20 flex flex-col items-center text-center gap-8">
                            <h2 className="text-white text-3xl md:text-5xl font-black max-w-2xl leading-tight">Ready to revolutionize your lending process?</h2>
                            <p className="text-slate-400 dark:text-slate-300 text-lg max-w-xl">Join hundreds of lenders using FinPulse to make smarter, faster credit decisions with AI-powered confidence.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register/lender" className="bg-[#2262ec] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#2262ec]/20 hover:scale-105 transition-transform flex items-center justify-center">
                                    Start Your Free Trial
                                </Link>
                                <button className="bg-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                                    Talk to Sales
                                </button>
                            </div>
                            <p className="text-slate-500 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6 md:px-10 mt-auto">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 bg-[#2262ec] rounded flex items-center justify-center text-white">
                                    <span className="material-icons text-sm">account_balance_wallet</span>
                                </div>
                                <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">FinPulse</h2>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                                The modern operating system for digital lenders. Empowering financial institutions with AI-driven risk intelligence.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Risk Tools</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">AI Analytics</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">API Reference</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Customers</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Cookie Policy</a></li>
                                <li><a className="hover:text-[#2262ec] transition-colors" href="#">Compliance</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LenderPlans;
