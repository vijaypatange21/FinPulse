import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  Activity, 
  Layers, 
  Lock, 
  Scale, 
  Users, 
  ChevronRight, 
  Sliders, 
  Sparkles, 
  Menu, 
  X, 
  Building2, 
  Compass,
  FileCheck,
  Cpu,
  BarChart3,
  Check,
  ArrowUpRight,
  Database,
  Key,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

import ThemeToggle from '../components/ThemeToggle';
import AnimatedCounter from '../components/landing/AnimatedCounter';
import FeatureCard from '../components/landing/FeatureCard';
import FAQAccordion from '../components/landing/FAQAccordion';
import ScrollReveal from '../components/landing/ScrollReveal';
import HeroShowcase from '../components/landing/HeroShowcase';
import DocumentScannerMockup from '../components/landing/DocumentScannerMockup';
import CreditCardStack from '../components/landing/CreditCardStack';
import Logo, { LogoIcon } from '../components/ui/Logo';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState('lenders'); // 'lenders' | 'borrowers' | 'compliance'
  
  // Interactive Simulator State
  const [simRevenue, setSimRevenue] = useState(65); // in Lakhs
  const [simStability, setSimStability] = useState(85); // %
  const [simOcrVerified, setSimOcrVerified] = useState(true);

  // Computed Demo Score: Base + factors
  const computedScore = Math.min(
    880,
    Math.round(550 + (simRevenue * 1.8) + (simStability * 1.6) + (simOcrVerified ? 50 : 0))
  );

  const getTier = (score) => {
    if (score >= 760) return { label: 'Prime Tier (Low Risk)', color: 'text-emerald-600 dark:text-[var(--accent)]', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
    if (score >= 680) return { label: 'Near Prime (Moderate Risk)', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30' };
    return { label: 'Subprime (Elevated Spread)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
  };

  const currentTier = getTier(computedScore);

  const faqItems = [
    {
      question: 'How is FinPulse different from traditional CIBIL or bureau credit scores?',
      answer: 'Traditional bureaus rely strictly on historical loan repayment history, penalizing newer enterprises and thin-file borrowers. FinPulse utilizes real-time cashflow intelligence (GST e-filings, verified bank statement ledgers, transaction velocity) through a cascade Deep Forest AI architecture. This produces a forward-looking creditworthiness index with verifiable SHAP explainability.'
    },
    {
      question: 'How does the OCR document verification prevent fraud?',
      answer: 'Our document processing pipeline extracts multi-page tabular transactions, cross-verifies IFSC/tax checksums against official government registries, and scans for visual tampering, font manipulation, and metadata inconsistencies in under 3 seconds.'
    },
    {
      question: 'Can institutional lenders configure custom risk thresholds?',
      answer: 'Yes! FinPulse provides a dedicated Lender Portal and REST APIs that allow risk officers to customize debt-to-income caps, minimum cashflow stability scores, exposure limits, and automated webhook triggers for instant loan disbursement.'
    },
    {
      question: 'How is borrower financial data protected and encrypted?',
      answer: 'We employ bank-grade 256-bit AES encryption at rest and TLS 1.3 in transit. FinPulse never stores raw net-banking credentials, operates under ISO 27001 data protection protocols, and ensures borrowers retain granular consent over all shared documents.'
    },
    {
      question: 'How long does underwriting and offer matching take?',
      answer: 'Borrowers who upload required bank statements and KYC documents receive an instant FinPulse Credit Health Diagnosis. Verified profiles are indexed on the lender exchange, where institutional capital partners deploy sanction offers typically within 2 to 24 hours.'
    }
  ];

  return (
    <div className="bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body min-h-screen selection:bg-[var(--accent)] selection:text-black overflow-x-hidden transition-colors duration-300">
      
      {/* 1. STICKY GLASSMORPHIC NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Logo to="/" size="md" subtitle="AI Credit Intelligence" />

          {/* Desktop Navigation Links (Clean 4 Core Links) */}
          <nav className="hidden lg:flex items-center gap-9 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#process" className="hover:text-[var(--text-primary)] transition-colors">How It Works</a>
            <a href="#suite" className="hover:text-[var(--text-primary)] transition-colors">Platform</a>
            <Link to="/find-lender" className="hover:text-[var(--text-primary)] transition-colors">Marketplace</Link>
            <Link to="/lender/plans" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/role-selection"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm tracking-normal whitespace-nowrap bg-[var(--accent)] text-black hover:opacity-90 shadow-lg shadow-[var(--accent-glow)] transition-all hover:scale-105"
            >
              <span>Get Started</span>
              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-6 space-y-4"
            >
              <div className="flex flex-col space-y-3 text-base font-medium text-[var(--text-primary)]">
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent)] py-1">How It Works</a>
                <a href="#suite" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent)] py-1">Platform</a>
                <Link to="/find-lender" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent)] py-1">Marketplace</Link>
                <Link to="/lender/plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--accent)] py-1">Pricing</Link>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/role-selection"
                  className="w-full text-center py-2.5 rounded-xl bg-[var(--accent)] text-black font-display font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. CENTER-ALIGNED HERO SECTION (MATCHING REFERENCE DESIGN EXACTLY) */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden transition-colors duration-300">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[var(--accent)]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          
          {/* Main Headline */}
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-normal text-[var(--text-primary)] leading-[1.12] mb-6 max-w-4xl mx-auto">
              Autonomous <span className="text-gradient-lime">Credit Intelligence</span> for Next-Gen Lending.
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed font-body">
              Assess borrower cashflow resilience, automate bank statement OCR, and match with verified institutional lenders in real-time.
            </p>
          </ScrollReveal>

          {/* Centered Primary CTA Button (Matching Reference Button Style) */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/role-selection"
                className="group px-8 py-3.5 rounded-full font-display font-semibold text-sm bg-[var(--accent)] text-black hover:opacity-90 shadow-xl shadow-[var(--accent-glow)] flex items-center gap-3 transition-all hover:scale-105"
              >
                <span>Get Started Free</span>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
              <Link
                to="/role-selection"
                className="px-7 py-3.5 rounded-full font-display font-medium text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 text-[var(--text-primary)] transition-all flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-[var(--accent)]" />
                <span>Simulate Score</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* HERO VISUAL SHOWCASE: SLEEK DEVICE + SURROUNDING FLOATING METRIC CARDS */}
          <ScrollReveal direction="up" delay={0.5}>
            <HeroShowcase />
          </ScrollReveal>

        </div>
      </section>

      {/* 3. VERIFIED DATA PROTOCOLS & ARCHITECTURE STRIP (Clean & Authentic - No Fake Logos!) */}
      <section className="py-10 border-y border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/60 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">
            Supported Data Standards & Protocols
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <FileSpreadsheet className="w-4 h-4 text-[var(--accent)]" />
              <span>PDF Bank OCR</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>GSTR-3B Ingestion</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>ITR-V Tax Records</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Account Aggregator</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <Lock className="w-4 h-4 text-[var(--accent)]" />
              <span>AES-256 GCM</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-primary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ISO 27001 Protocol</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNDERWRITING PROCESS STEP BY STEP (MATCHING REFERENCE SECTION 3) */}
      <section id="process" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-4">
              FinPulse Underwriting Process Step by Step
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)]">
              Upload, verify, evaluate, and disburse capital faster than ever before.
            </p>
          </div>

          {/* Split 2-Column Process Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Left Column: Live Document Scanner Mockup */}
            <div className="lg:col-span-6">
              <DocumentScannerMockup />
            </div>

            {/* Right Column: 3 Sequential Step Cards */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:border-[var(--accent)]/50 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-black flex items-center justify-center shrink-0 font-display font-bold text-lg">
                  01
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-1">
                    Upload Financial Statements
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Borrowers upload multi-page PDF bank statements, GST invoices, and ITR filings. FinPulse automatically detects bank formats and validates checksums.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:border-[var(--accent)]/50 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-display font-bold text-lg">
                  02
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-1">
                    Deep Forest Multi-Modal Analysis
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Our proprietary cascade tree ensemble examines 240+ behavioral cashflow features—revenue velocity, volatility indices, and bounce history—far beyond basic bureau numbers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:border-[var(--accent)]/50 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 font-display font-bold text-lg">
                  03
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-1">
                    Instant Sanction & Capital Disbursement
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Approved borrowers match with partner institutional lenders who disburse pre-calibrated working capital tranches with zero paperwork friction.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 4 Bottom Feature Badges (Matching Reference Section 3 Bottom Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Sub-3s OCR Parsing</h4>
                <p className="text-xs text-[var(--text-secondary)]">Zero manual data transcription</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Deep Forest AI Scoring</h4>
                <p className="text-xs text-[var(--text-secondary)]">240+ behavioral signal trees</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Bank-Grade Encryption</h4>
                <p className="text-xs text-[var(--text-secondary)]">AES-256 GCM & ISO 27001</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Delinquency Radar</h4>
                <p className="text-xs text-[var(--text-secondary)]">Continuous post-sanction watch</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. THE INTELLIGENT CREDIT SUITE (MATCHING REFERENCE SECTION 4: CENTER PHONE + 4 FLANKING CARDS) */}
      <section id="suite" className="py-24 bg-[var(--bg-surface-raised)]/40 border-t border-[var(--border-subtle)] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-4">
              The Next-Gen Credit Intelligence Suite
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)]">
              Expand institutional underwriting velocity and empower MSMEs with transparent, data-driven decisions.
            </p>
          </div>

          {/* 3-Column Layout: Left 2 Cards, Center Phone Mockup, Right 2 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 2 Cards */}
            <div className="lg:col-span-4 space-y-6">
              <FeatureCard
                icon={Zap}
                badge="Speed"
                title="Sub-3-Second OCR Parsing"
                description="Upload raw multi-page bank statements or scanned returns. High-precision OCR extracts ledgers and reconciles tax checksums in under 3 seconds."
              />
              <FeatureCard
                icon={TrendingUp}
                badge="Signals"
                title="Alternative Cashflow Modeling"
                description="Evaluate daily operating stability, seasonal revenue consistency, and vendor payment velocity instead of relying strictly on stale bureau records."
              />
            </div>

            {/* Center Phone Screen Showcase */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-[280px] rounded-[40px] p-3 bg-neutral-900 shadow-2xl border-4 border-neutral-700 text-white font-sans overflow-hidden">
                <div className="w-full rounded-[32px] bg-[#0E1218] p-4 text-center">
                  <div className="w-20 h-3.5 bg-black rounded-full mx-auto mb-4" />
                  
                  <div className="text-[10px] text-neutral-400 uppercase font-mono mb-1">
                    Explainable AI Breakdown
                  </div>
                  <div className="text-xl font-display font-bold text-white mb-3">
                    SHAP Factor Matrix
                  </div>

                  {/* SHAP Bars inside Phone */}
                  <div className="space-y-3 text-left mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-300">Revenue Consistency</span>
                        <span className="text-[var(--accent)] font-mono font-bold">+44 pts</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[var(--accent)] h-full w-[85%]" />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-300">Tax Filing Punctuality</span>
                        <span className="text-emerald-400 font-mono font-bold">+28 pts</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[70%]" />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-300">Cash Cushion Margin</span>
                        <span className="text-sky-400 font-mono font-bold">+16 pts</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full w-[55%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-xs text-[var(--accent)] font-semibold">
                    AUROC 0.942 • Bank Auditable
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Cards */}
            <div className="lg:col-span-4 space-y-6">
              <FeatureCard
                icon={Scale}
                badge="Explainable"
                title="Explainable SHAP Risk Vectors"
                description="Inspect exact positive and negative factor contributions before capital allocation. Generate regulatory adverse action disclosures with one click."
              />
              <FeatureCard
                icon={Activity}
                badge="Automation"
                title="Real-Time Webhook & API Alerts"
                description="Connect FinPulse directly into your existing loan management system (LMS). Receive instant alerts on underwriting status and tranche disbursement."
              />
            </div>

          </div>

        </div>
      </section>

      {/* 6. NEXT-GEN CREDIT FACILITY & ASSET MANAGEMENT (MATCHING REFERENCE SECTION 5) */}
      <section id="facility" className="py-24 border-t border-[var(--border-subtle)] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Descriptions, and Green CTA Button */}
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-6">
                Explore Next-Gen Credit Facility Management
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                Empower your business with revolving lines of credit, automated repayments, and dynamic limit expansion based on real-time operating performance.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Automated limit increases as monthly bank cashflow expands
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Interest charged only on deployed capital, zero idle commitment fees
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    Flexible repayment schedules matched with seasonal invoice cycles
                  </span>
                </div>
              </div>

              <Link
                to="/register/borrower"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-display font-semibold text-sm bg-[var(--accent)] text-black hover:opacity-90 shadow-lg shadow-[var(--accent-glow)] transition-all hover:scale-105"
              >
                <span>Apply for Credit Facility</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column: Stacked Credit Card Showcase */}
            <div className="lg:col-span-6">
              <CreditCardStack />
            </div>

          </div>
        </div>
      </section>

      {/* 7. DUAL-SIDED ARCHITECTURE: FOR LENDERS & BORROWERS (MATCHING REFERENCE SECTION 6) */}
      <section className="py-24 bg-[var(--bg-surface-raised)]/40 border-t border-[var(--border-subtle)] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-4">
              Best Underwriting Solution, Built for Scale
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)]">
              Tailored tools for institutional underwriters, risk officers, and ambitious borrowers.
            </p>
          </div>

          {/* Interactive Audience Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
              <button
                onClick={() => setActiveAudienceTab('lenders')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeAudienceTab === 'lenders'
                    ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                For Institutional Lenders
              </button>
              <button
                onClick={() => setActiveAudienceTab('borrowers')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeAudienceTab === 'borrowers'
                    ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                For Growing Borrowers
              </button>
              <button
                onClick={() => setActiveAudienceTab('compliance')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeAudienceTab === 'compliance'
                    ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Risk & Compliance
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl">
            {activeAudienceTab === 'lenders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-3">
                    Automated Portfolio Underwriting
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    Connect your LMS or loan origination system to ingest borrower files, verify bank statement authenticity, and deploy capital under pre-calibrated risk thresholds.
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                      <span>Custom risk weights and exposure caps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                      <span>Automated webhook event triggers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                      <span>Early warning delinquency monitoring</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
                  <div className="text-xs uppercase font-mono text-[var(--text-secondary)] mb-1">Underwriter Benefit</div>
                  <div className="text-3xl font-display font-bold text-[var(--accent)] mb-2">90 Seconds</div>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">Turnaround time from file upload to automated sanction recommendation.</p>
                  <Link
                    to="/register/lender"
                    className="w-full py-3 rounded-full bg-[var(--accent)] text-black font-display font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span>Onboard as Partner Lender</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {activeAudienceTab === 'borrowers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-3">
                    Fair, Cashflow-Driven Capital
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    Get evaluated on the real health of your business operations. Our AI looks at your cash inflows, operating consistency, and tax filings—not just legacy CIBIL history.
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Zero bureau score inquiry penalty</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Direct matches with 15+ verified lenders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Actionable recommendations to boost credit rating</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
                  <div className="text-xs uppercase font-mono text-[var(--text-secondary)] mb-1">Borrower Benefit</div>
                  <div className="text-3xl font-display font-bold text-emerald-500 mb-2">₹50L Limit</div>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">Maximum instant working capital facility with flexible seasonal tranches.</p>
                  <Link
                    to="/register/borrower"
                    className="w-full py-3 rounded-full bg-[var(--accent)] text-black font-display font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span>Check Business Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {activeAudienceTab === 'compliance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-3">
                    Bank-Grade Explainability & Audits
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    Meet all regulatory requirements with mathematically sound SHAP explanations for every credit approval or decline decision.
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500" />
                      <span>One-click Adverse Action Notice generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500" />
                      <span>Immutable audit logs for compliance officers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500" />
                      <span>ISO 27001 and AES-256 data protection</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]">
                  <div className="text-xs uppercase font-mono text-[var(--text-secondary)] mb-1">Audit Guarantee</div>
                  <div className="text-3xl font-display font-bold text-sky-500 mb-2">100% SHAP</div>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">Every prediction is fully explainable with exact feature weight attribution.</p>
                  <Link
                    to="/role-selection"
                    className="w-full py-3 rounded-full bg-[var(--accent)] text-black font-display font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span>Inspect Compliance Stack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE CREDIT HEALTH SIMULATOR */}
      <section id="simulator" className="py-24 lg:py-32 relative overflow-hidden border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-6">
                Simulate Your Underwriting Health Score
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                Test how real-time operating parameters impact your predicted default risk and lender pricing tiers. Drag the sliders to see instant model calibration.
              </p>

              {/* Slider 1: Revenue */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-display font-semibold text-[var(--text-primary)]">Monthly Cash Inflow</label>
                    <span className="font-mono text-sm text-[var(--accent)] font-bold">₹{simRevenue} Lakhs</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={simRevenue}
                    onChange={(e) => setSimRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-surface-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
                    <span>₹10L</span>
                    <span>₹75L</span>
                    <span>₹150L</span>
                  </div>
                </div>

                {/* Slider 2: Stability */}
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-display font-semibold text-[var(--text-primary)]">Operating Balance Consistency</label>
                    <span className="font-mono text-sm text-emerald-500 font-bold">{simStability}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={simStability}
                    onChange={(e) => setSimStability(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-surface-raised)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
                    <span>Volatile (30%)</span>
                    <span>Moderate (65%)</span>
                    <span>Highly Stable (100%)</span>
                  </div>
                </div>

                {/* Checkbox: OCR Verification */}
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-semibold text-[var(--text-primary)]">GST & Bank Statements Verified via OCR</div>
                    <div className="text-xs text-[var(--text-secondary)]">Provides +50 confidence factor weighting</div>
                  </div>
                  <button
                    onClick={() => setSimOcrVerified(!simOcrVerified)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                      simOcrVerified ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]'
                    }`}
                  >
                    {simOcrVerified && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Result Simulation Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-surface-raised)] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs uppercase font-mono tracking-widest text-[var(--text-secondary)]">
                    Calculated Health Score
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentTier.bg} ${currentTier.color} border ${currentTier.border}`}>
                    {currentTier.label}
                  </span>
                </div>

                {/* Big Score Gauge */}
                <div className="text-center py-6">
                  <div className="font-display font-bold text-7xl sm:text-8xl tracking-tight text-[var(--text-primary)] mb-2">
                    {computedScore}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-mono">
                    Scale Range: 300 - 900
                  </div>
                </div>

                {/* Offer Metrics */}
                <div className="grid grid-cols-2 gap-4 my-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Pre-Approved Capital</div>
                    <div className="text-xl font-display font-bold text-[var(--text-primary)]">
                      ₹{(simRevenue * 0.45).toFixed(1)} Lakhs
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-secondary)] mb-1">Indicative Interest Rate</div>
                    <div className="text-xl font-display font-bold text-[var(--accent)]">
                      {(14.5 - (computedScore - 600) * 0.015).toFixed(2)}% p.a.
                    </div>
                  </div>
                </div>

                <Link
                  to="/role-selection"
                  className="w-full py-4 rounded-full font-semibold text-sm tracking-wide bg-[var(--accent)] text-black hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-glow)] transition-all"
                >
                  <span>Apply with This Score</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (MATCHING REFERENCE SECTION 8) */}
      <section id="faq" className="py-24 lg:py-32 border-t border-[var(--border-subtle)] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[var(--text-primary)] tracking-normal mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)]">
              Everything you need to know about our scoring methodology and platform architecture.
            </p>
          </div>

          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* 10. HIGH-IMPACT BOTTOM BANNER (MATCHING REFERENCE SECTION 9) */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="rounded-[40px] p-8 sm:p-14 bg-gradient-to-r from-[#141C16] via-[#1A261D] to-[#121A14] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[var(--accent)]/30">
            <div className="absolute inset-0 bg-radial from-[var(--accent)]/15 via-transparent to-transparent pointer-events-none" />

            {/* Left Column: Device Mockup */}
            <div className="w-48 sm:w-56 shrink-0 relative z-10 hidden sm:block">
              <div className="w-full rounded-[30px] p-2 bg-neutral-900 shadow-2xl border-2 border-neutral-700">
                <div className="w-full rounded-[24px] bg-[#0E1218] p-3 text-center">
                  <div className="w-12 h-2.5 bg-black rounded-full mx-auto mb-2" />
                  <div className="text-[9px] text-neutral-400 font-mono">Instant Limit</div>
                  <div className="text-lg font-display font-bold text-[var(--accent)] mb-1">₹50,00,000</div>
                  <div className="text-[8px] text-emerald-400 font-medium">● 90s Underwrite Ready</div>
                </div>
              </div>
            </div>

            {/* Right Column: Copy & Action */}
            <div className="relative z-10 text-center md:text-left flex-1">
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
                Start Underwriting Smarter with FinPulse
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 max-w-lg mb-8 leading-relaxed">
                Connect your business or lending portfolio to the autonomous AI credit intelligence network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  to="/role-selection"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-display font-semibold text-sm bg-[var(--accent)] text-black hover:opacity-90 shadow-xl shadow-[var(--accent-glow)] transition-all hover:scale-105"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/find-lender"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-display font-medium text-sm bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all"
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. FOOTER WITH MASSIVE "FINPULSE" BRAND TYPOGRAPHY (MATCHING REFERENCE SECTION 10) */}
      <footer className="pt-20 pb-12 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            
            {/* Col 1: Brand Info */}
            <div className="col-span-2">
              <div className="mb-4">
                <Logo to="/" size="lg" subtitle="Autonomous Underwriting" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">
                Autonomous AI credit underwriting platform powering next-generation financial inclusion for verified MSMEs and lenders.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span>All Models & Systems Operational</span>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-4 font-semibold">Platform</h4>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li><a href="#process" className="hover:text-[var(--text-primary)] transition-colors">Underwriting Engine</a></li>
                <li><a href="#process" className="hover:text-[var(--text-primary)] transition-colors">OCR Parser</a></li>
                <li><a href="#simulator" className="hover:text-[var(--text-primary)] transition-colors">Risk Simulator</a></li>
                <li><Link to="/find-lender" className="hover:text-[var(--text-primary)] transition-colors">Lender Exchange</Link></li>
              </ul>
            </div>

            {/* Col 3: Solutions */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-4 font-semibold">Solutions</h4>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li><Link to="/role-selection" className="hover:text-[var(--text-primary)] transition-colors">For FinTech Lenders</Link></li>
                <li><Link to="/role-selection" className="hover:text-[var(--text-primary)] transition-colors">For Small Businesses</Link></li>
                <li><Link to="/lender/plans" className="hover:text-[var(--text-primary)] transition-colors">Enterprise Plans</Link></li>
                <li><Link to="/role-selection" className="hover:text-[var(--text-primary)] transition-colors">API Integration</Link></li>
              </ul>
            </div>

            {/* Col 4: Trust & Legal */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] mb-4 font-semibold">Compliance</h4>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li><span>ISO 27001 Certified</span></li>
                <li><span>AES-256 Encryption</span></li>
                <li><span>SHAP Explainability</span></li>
                <li><span>Data Privacy Policy</span></li>
              </ul>
            </div>

          </div>

          {/* MASSIVE BRAND NAME TEXT (As in Reference Image) */}
          <div className="w-full text-center overflow-hidden py-4 select-none pointer-events-none">
            <span className="text-massive-brand block">
              FINPULSE
            </span>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-4">
            <div>
              © {new Date().getFullYear()} FinPulse Technologies Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Financial Intelligence Protocol v2.4</span>
              <span>Made for High-Trust Lending</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
