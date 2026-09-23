import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CreditCardStack() {
  return (
    <div className="relative w-full max-w-md mx-auto py-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--accent)]/15 rounded-full blur-3xl pointer-events-none" />

      {/* BACK/BOTTOM CARD: Transaction Sanction Receipt */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full rounded-3xl p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl relative z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">Disbursement Approved</div>
              <div className="text-[10px] text-[var(--text-secondary)] font-mono">Tranche #4902 • Ref: FP-9812</div>
            </div>
          </div>
          <span className="text-sm font-display font-bold text-emerald-600 dark:text-emerald-400">
            +₹12,60,000
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)]">
          <span>Lender: Horizon Capital NBFC</span>
          <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant Credit
          </span>
        </div>
      </motion.div>

      {/* FRONT/TOP CARD: FinPulse Emerald Business Card (Matching Reference Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full -mt-8 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1E291E] via-[#152016] to-[#0D150E] text-white shadow-2xl border border-[var(--accent)]/40 relative z-20 overflow-hidden"
      >
        {/* Subtle decorative curved pattern */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[var(--accent)]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--accent)]">
              FinPulse Commercial
            </div>
            <div className="text-xs text-neutral-300 font-medium">Revolving Working Capital</div>
          </div>
          <Wifi className="w-5 h-5 text-[var(--accent)] rotate-90" />
        </div>

        {/* Card Balance */}
        <div className="mb-8 relative z-10">
          <div className="text-xs text-neutral-400 font-mono mb-1">Available Credit Facility</div>
          <div className="text-3xl font-display font-bold tracking-tight text-white flex items-baseline gap-2">
            ₹50,00,000
            <span className="text-xs font-sans font-semibold text-[var(--accent)] bg-[var(--accent)]/15 px-2 py-0.5 rounded-full border border-[var(--accent)]/30 flex items-center gap-0.5">
              +14% Limit <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Chip & Card Numbers */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            {/* Gold EMV Chip */}
            <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 rounded-sm border border-amber-200/50 shadow-inner flex items-center justify-center">
              <div className="w-6 h-4 border border-amber-800/40 rounded-sm" />
            </div>
            <span className="font-mono text-sm tracking-wider text-neutral-300">
              •••• 4525
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            EXP 09/29
          </span>
        </div>
      </motion.div>
    </div>
  );
}
