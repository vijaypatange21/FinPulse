import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Card, { ContrastCard } from '../components/ui/Card';
import Logo from '../components/ui/Logo';

const LenderPlans = () => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col font-satoshi bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased overflow-x-hidden">
            <div className="flex h-full grow flex-col">
                
                {/* Navigation Header */}
                <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 md:px-10 py-4 bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-50">
                    <Logo to="/" size="sm" />
                    <div className="flex flex-1 justify-end gap-4 md:gap-8">
                        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
                            <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Solutions</Link>
                            <Link to="/lender/plans" className="text-[var(--accent)]">Pricing</Link>
                            <Link to="/find-lender" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Marketplace</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold px-3 py-1.5 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register/lender" className="px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-semibold shadow-[var(--shadow-accent-glow)] hover:opacity-90 transition-opacity">
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 flex-col py-12 md:py-20 px-6 md:px-10 lg:px-40 max-w-7xl mx-auto w-full">
                    
                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center gap-5 mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-semibold uppercase tracking-wider">
                            Institutional Pricing
                        </div>
                        <div className="flex flex-col gap-3 max-w-3xl">
                            <h1 className="font-clash text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                                Underwriting Infrastructure for <span className="text-[var(--accent)]">Modern Lenders</span>
                            </h1>
                            <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto">
                                Modular AI risk scoring, real-time fraud alerts, and verified OCR statement ingestion built for scale.
                            </p>
                        </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        
                        {/* Starter Tier */}
                        <Card className="p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Starter</span>
                                    <h3 className="font-clash text-xl font-bold text-[var(--text-primary)]">Emerging NBFCs</h3>
                                    <div className="flex items-baseline gap-1 mt-4">
                                        <span className="font-clash text-4xl font-bold tabular-nums text-[var(--text-primary)]">₹49,999</span>
                                        <span className="text-xs text-[var(--text-secondary)] font-medium">/ month</span>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3.5 text-xs text-[var(--text-secondary)]">
                                    <p className="font-semibold text-[var(--text-primary)]">Included features:</p>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
                                        <span>Standard risk assessment engine</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
                                        <span>Up to 100 applications / mo</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
                                        <span>Automated bank OCR ingestion</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--status-success)] text-base">check_circle</span>
                                        <span>Email support (24h turnaround)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link
                                    to="/register/lender"
                                    className="w-full flex items-center justify-center rounded-[var(--radius-pill)] h-11 px-4 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                                >
                                    Start Free Trial
                                </Link>
                            </div>
                        </Card>

                        {/* Enterprise Tier (Contrast Panel Hero Card) */}
                        <ContrastCard className="p-8 flex flex-col justify-between relative hover:-translate-y-2 transition-transform shadow-2xl">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--text-on-accent)] text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-[var(--radius-pill)] shadow-md">
                                Recommended for Scale
                            </div>
                            <div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Growth & Enterprise</span>
                                    <h3 className="font-clash text-xl font-bold">Commercial Institutions</h3>
                                    <div className="flex items-baseline gap-1 mt-4">
                                        <span className="font-clash text-4xl font-bold tabular-nums">₹2,49,999</span>
                                        <span className="text-xs opacity-75 font-medium">/ month</span>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3.5 text-xs opacity-90">
                                    <p className="font-bold">Everything in Starter, plus:</p>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                        <span>Deep Forest AI credit modeling</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                        <span>Continuous behavioral surveillance</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                        <span>Full REST API & webhook access</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                        <span>Custom threshold rule builder</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base">verified</span>
                                        <span>Priority 24/7 dedicated support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link
                                    to="/register/lender"
                                    className="w-full flex items-center justify-center rounded-[var(--radius-pill)] h-11 px-4 bg-[var(--accent)] text-[var(--text-on-accent)] text-xs font-bold shadow-[var(--shadow-accent-glow)] hover:opacity-90 transition-opacity"
                                >
                                    Start Enterprise Trial
                                </Link>
                            </div>
                        </ContrastCard>

                        {/* Custom Tier */}
                        <Card className="p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Custom</span>
                                    <h3 className="font-clash text-xl font-bold text-[var(--text-primary)]">Tier-1 Banks & SFBs</h3>
                                    <div className="mt-4">
                                        <span className="font-clash text-3xl font-bold text-[var(--text-primary)]">Custom Quote</span>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3.5 text-xs text-[var(--text-secondary)]">
                                    <p className="font-semibold text-[var(--text-primary)]">Bank-grade deployment:</p>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-base">all_inclusive</span>
                                        <span>Unlimited application throughput</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-base">all_inclusive</span>
                                        <span>Dedicated technical account executive</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-base">all_inclusive</span>
                                        <span>On-premise / hybrid cloud hosting</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[var(--accent)] text-base">all_inclusive</span>
                                        <span>Tailored legal SLAs & compliance reporting</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link
                                    to="/contact"
                                    className="w-full flex items-center justify-center rounded-[var(--radius-pill)] h-11 px-4 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                                >
                                    Speak with Enterprise Sales
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-24 max-w-3xl mx-auto w-full">
                        <h2 className="font-clash text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-8 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                            <details className="group py-5" open>
                                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none text-sm font-semibold text-[var(--text-primary)]">
                                    <span>How does the 14-day institutional trial work?</span>
                                    <span className="material-symbols-outlined text-[var(--accent)] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                                    You receive sandbox and production access to all Enterprise features for 14 days, including automated OCR statement ingestion and deep forest AI scoring. No credit card required.
                                </p>
                            </details>

                            <details className="group py-5">
                                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none text-sm font-semibold text-[var(--text-primary)]">
                                    <span>Can we modify our plan or capacity as underwriting volume scales?</span>
                                    <span className="material-symbols-outlined text-[var(--accent)] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                                    Yes. Volume tiers adjust automatically with instant provisioning. Downgrades or customized SLAs can be requested via your institutional portal.
                                </p>
                            </details>

                            <details className="group py-5">
                                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none text-sm font-semibold text-[var(--text-primary)]">
                                    <span>What data security certifications are implemented?</span>
                                    <span className="material-symbols-outlined text-[var(--accent)] group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                                    FinPulse utilizes AES-256 at rest, TLS 1.3 in transit, and maintains strict RBI digital lending compliance and SOC 2 Type II data governance standards.
                                </p>
                            </details>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10 px-6 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                            <span className="font-clash font-bold text-sm text-[var(--accent)]">FinPulse</span>
                            <span>• Institutional Underwriting Intelligence</span>
                        </div>
                        <p>© 2026 FinPulse Technologies Inc. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LenderPlans;
