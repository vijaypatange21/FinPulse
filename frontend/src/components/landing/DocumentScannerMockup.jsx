import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Shield, Eye, Cpu, ArrowUpRight } from 'lucide-react';

export default function DocumentScannerMockup() {
  const [docType, setDocType] = useState('bank'); // 'bank' | 'gst' | 'itr'

  const docData = {
    bank: {
      title: 'HDFC_Bank_Statement_Q3.pdf',
      period: 'Apr 2024 - Sep 2024',
      pages: '14 Pages Analyzed',
      fields: [
        { label: 'Total Inflow Credits', value: '₹58,40,250', status: 'Verified' },
        { label: 'Average Daily Balance', value: '₹12,85,400', status: 'Stable' },
        { label: 'Inward Return Rate', value: '0.00%', status: 'Pristine' },
        { label: 'Operating Volatility', value: 'Low (6.2%)', status: 'Prime' }
      ]
    },
    gst: {
      title: 'GSTR_3B_Filing_FY24.pdf',
      period: 'Monthly Filing Track',
      pages: '6 Filings Cross-Matched',
      fields: [
        { label: 'Reported Turnover', value: '₹1,24,00,000', status: 'Matched' },
        { label: 'ITC Claimed vs 2B', value: '100% Reconciled', status: 'Verified' },
        { label: 'Late Filing Flags', value: '0 Late Returns', status: 'Punctual' },
        { label: 'E-Way Bill Velocity', value: '42 Active/Month', status: 'High Volume' }
      ]
    },
    itr: {
      title: 'ITR_Form_5_Acknowledgement.pdf',
      period: 'Assessment Year 2024-25',
      pages: 'Official Tax Acknowledgment',
      fields: [
        { label: 'Gross Total Income', value: '₹84,20,000', status: 'Verified' },
        { label: 'Effective Tax Paid', value: '₹18,40,000', status: 'Confirmed' },
        { label: 'Debt-to-Income', value: '0.24x', status: 'Low Risk' },
        { label: 'Verification Hash', value: '0x8F4A...B91C', status: 'Valid' }
      ]
    }
  };

  const currentDoc = docData[docType];

  return (
    <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Laser Scanning Animation Beam */}
      <motion.div
        animate={{ y: [0, 280, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent shadow-[0_0_15px_var(--accent)] z-20 opacity-80"
      />

      <div>
        {/* Document Selector Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setDocType('bank')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              docType === 'bank'
                ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            Bank Statement
          </button>
          <button
            onClick={() => setDocType('gst')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              docType === 'gst'
                ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            GST Returns (GSTR-3B)
          </button>
          <button
            onClick={() => setDocType('itr')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              docType === 'itr'
                ? 'bg-[var(--accent)] text-black font-semibold shadow-sm'
                : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            ITR e-Filing
          </button>
        </div>

        {/* Mockup Document Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={docType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    {currentDoc.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-mono">
                    {currentDoc.period} • {currentDoc.pages}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                99.4% OCR
              </span>
            </div>

            {/* Extracted Key Metric Fields */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentDoc.fields.map((field, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-secondary)] mb-1">
                    {field.label}
                  </div>
                  <div className="text-base font-display font-bold text-[var(--text-primary)]">
                    {field.value}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ● {field.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Verification Ledger Footer */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)] font-mono flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
          Multi-layer parsing: 1.8s
        </span>
        <span className="text-[var(--accent)] font-semibold flex items-center gap-1">
          Zero Manual Entry <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
