import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, Building2, User } from 'lucide-react';

const testimonials = [
  {
    quote: "FinPulse slashed our MSME underwriting latency from 4 days to 90 seconds. The OCR document verification and Deep Forest scoring gave us higher approval confidence than traditional CIBIL scores alone.",
    author: "Vikram Malhotra",
    role: "Chief Risk Officer",
    company: "Apex Capital Finance",
    type: "Lender",
    scoreIncrease: "+34% Approval Rate",
    rating: 5
  },
  {
    quote: "As a young tech founder with limited credit history, traditional banks turned me down twice. FinPulse assessed our utility cashflow and GST records, giving me a 780 health score and instant loan offers.",
    author: "Ananya Sharma",
    role: "Founder & CEO",
    company: "NexGen Logistics",
    type: "Borrower",
    scoreIncrease: "₹25L Approved in 2 hrs",
    rating: 5
  },
  {
    quote: "The explainability matrices and simulated stress tests let our risk committee inspect exact SHAP values before deploying capital. It's the most auditable credit intelligence stack we've deployed.",
    author: "Rohan Singhania",
    role: "VP of Credit Products",
    company: "Horizon Microfin",
    type: "Lender",
    scoreIncrease: "0.28% Default Rate",
    rating: 5
  },
  {
    quote: "Uploading bank statements and getting an instant alternative credit diagnosis was seamless. We improved our repayment trajectory score in just 30 days and lowered our loan interest rate by 2.4%.",
    author: "Devendra Patil",
    role: "Managing Director",
    company: "Kisan Agro Supplies",
    type: "Borrower",
    scoreIncrease: "-240 bps Interest",
    rating: 5
  }
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const next = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeItem = testimonials[current];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Testimonial Card */}
      <div className="relative rounded-3xl p-8 md:p-12 bg-[#15181F]/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
                activeItem.type === 'Lender'
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {activeItem.type === 'Lender' ? (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Institutional Partner
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Verified Borrower
                  </span>
                )}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/80 border border-white/10">
                {activeItem.scoreIncrease}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[var(--accent)]">
              {[...Array(activeItem.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[var(--accent)]" />
              ))}
            </div>
          </div>

          {/* Quote Body with animated transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Quote className="w-10 h-10 text-[var(--accent)]/30 mb-3" />
              <p className="text-lg md:text-2xl font-body text-white font-medium leading-relaxed tracking-tight mb-8">
                "{activeItem.quote}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Author & Navigation */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-display font-bold text-white tracking-wide">
              {activeItem.author}
            </h4>
            <p className="text-xs md:text-sm text-[#8B8F98]">
              {activeItem.role} • <span className="text-white/80">{activeItem.company}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#8B8F98] px-2 font-mono">
              {current + 1} / {testimonials.length}
            </span>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setAutoplay(false);
              setCurrent(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
