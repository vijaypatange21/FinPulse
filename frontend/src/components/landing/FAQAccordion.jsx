import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
              isOpen
                ? 'bg-[var(--bg-surface)] border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/40'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`text-base md:text-lg font-display font-medium tracking-tight transition-colors ${
                isOpen ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-primary)]'
              }`}>
                {item.question}
              </span>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                  isOpen
                    ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                    : 'bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                }`}
              >
                {isOpen ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-6 pb-6 pt-1 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
