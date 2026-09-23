import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  FileCheck, 
  Building2, 
  Sparkles, 
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { LogoIcon } from '../ui/Logo';

export default function HeroShowcase() {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8 flex items-center justify-center select-none">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[var(--accent)]/15 dark:bg-[var(--accent)]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative SVG Animated Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGlowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineGlowRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D1A3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34D1A3" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Curved Connection Path to Left Card */}
        <path
          d="M 220 180 C 310 180, 360 260, 440 280"
          fill="none"
          stroke="url(#lineGlowLeft)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Curved Connection Path to Right Card */}
        <path
          d="M 800 180 C 710 180, 660 260, 580 280"
          fill="none"
          stroke="url(#lineGlowRight)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* FLOATING CARD 1: TOP LEFT (Health Score) */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.2 },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        className="absolute -top-4 left-0 sm:left-4 lg:left-8 z-20 hidden sm:block"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl shadow-black/20 w-64">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
              AI Credit Score
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              Prime Tier
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">
              780
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">/ 900</span>
          </div>
          <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[var(--accent)] h-full rounded-full w-[86%]" />
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-2">
            Verified cashflow • 0.3% default risk
          </p>
        </div>
      </motion.div>

      {/* FLOATING CARD 2: BOTTOM LEFT (Net Approved) */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.4 },
          y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }
        }}
        className="absolute bottom-6 left-0 sm:left-6 lg:left-12 z-20 hidden sm:block"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl shadow-black/20 w-64">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Pre-Approved Capital
            </span>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Instant
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-[var(--text-primary)]">
            ₹45,00,000
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <span>Interest Rate</span>
            <span className="font-semibold text-[var(--accent)]">8.5% p.a.</span>
          </div>
        </div>
      </motion.div>

      {/* FLOATING CARD 3: TOP RIGHT (Lender Bids) */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.3 },
          y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }
        }}
        className="absolute -top-2 right-0 sm:right-4 lg:right-8 z-20 hidden sm:block"
      >
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl shadow-black/20 w-64">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-500" />
              Lender Network
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-2xl font-display font-bold text-[var(--text-primary)]">
            14 Active Bids
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            Automated competitive risk pricing
          </p>
          <div className="flex -space-x-2 mt-3 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg-surface)] bg-emerald-600 text-[9px] text-white font-bold flex items-center justify-center">H</div>
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg-surface)] bg-blue-600 text-[9px] text-white font-bold flex items-center justify-center">I</div>
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg-surface)] bg-amber-600 text-[9px] text-white font-bold flex items-center justify-center">A</div>
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--bg-surface)] bg-purple-600 text-[9px] text-white font-bold flex items-center justify-center">+11</div>
          </div>
        </div>
      </motion.div>

      {/* FLOATING CARD 4: BOTTOM RIGHT (Disbursed Pill) */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 7, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.5 },
          y: { repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 }
        }}
        className="absolute bottom-10 right-0 sm:right-6 lg:right-12 z-20 hidden sm:block"
      >
        <div className="p-3.5 px-5 rounded-full bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-surface-raised)] backdrop-blur-xl border border-[var(--accent)]/30 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-black flex items-center justify-center shrink-0 font-bold">
            ₹
          </div>
          <div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)]">Disbursement Confirmed</div>
            <div className="text-sm font-display font-bold text-[var(--accent)]">
              + ₹25,00,000 Transferred
            </div>
          </div>
        </div>
      </motion.div>

      {/* CENTERPIECE: SLEEK MODERN PHONE DEVICE (Matching Reference Design) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[300px] sm:w-[320px] rounded-[44px] p-3 bg-neutral-900 shadow-2xl shadow-black/60 border-4 border-neutral-700/80 ring-1 ring-white/10"
      >
        {/* Device Inner Screen Container */}
        <div className="w-full rounded-[36px] bg-[#0E1218] text-white p-5 overflow-hidden relative font-sans">
          
          {/* Dynamic Island / Speaker Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4 flex items-center justify-end px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* App Header Inside Phone */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={28} />
              <div>
                <div className="text-[10px] text-neutral-400 font-mono">Good Morning</div>
                <div className="text-xs font-semibold text-neutral-100">Apex Transports</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Active
            </span>
          </div>

          {/* Credit Limit Card inside Phone */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C2230] to-[#141822] border border-white/10 mb-4 shadow-inner">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Sanctioned Credit Line
            </div>
            <div className="text-2xl font-display font-bold text-white tracking-tight mb-2">
              ₹32,00,000
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Available: <strong className="text-white">₹24.5L</strong></span>
              <span className="text-[var(--accent)] font-semibold flex items-center gap-0.5">
                +12% Limit <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Quick Actions inside Phone */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] mb-1">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-neutral-300">OCR Scan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-1">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-neutral-300">Disburse</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-neutral-300">Health</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[9px] text-neutral-300">SHAP</span>
            </div>
          </div>

          {/* Live OCR Verification Notification Card */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">GST_Return_Q3.pdf</div>
                <div className="text-[9px] text-emerald-400">OCR Verified • 99.4% Match</div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Underwriting Health Status Bar */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-neutral-400">Deep Forest Underwrite</span>
              <span className="text-[var(--accent)] font-mono">Completed in 1.4s</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-[var(--accent)] h-full rounded-full w-full animate-pulse" />
            </div>
          </div>

          {/* Device Home Indicator Bar */}
          <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-4" />

        </div>
      </motion.div>
    </div>
  );
}
