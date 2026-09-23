import React, { useRef, useState } from 'react';

export default function FeatureCard({
  icon: Icon,
  badge,
  title,
  description,
  children,
  className = '',
  highlight = false
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl p-7 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        highlight 
          ? 'bg-[var(--bg-surface)] border border-[var(--accent)]/50 shadow-xl shadow-[var(--accent-glow)]' 
          : 'bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 hover:shadow-lg'
      } ${className}`}
      style={{
        boxShadow: isHovered 
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 30px -5px var(--accent-glow)' 
          : undefined
      }}
    >
      {/* Spotlight Hover Glow Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent-glow), transparent 70%)`
        }}
      />

      {/* Top Header / Badges */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-5">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
          )}
          {badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-2 tracking-normal">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Optional Content/Graphic */}
      {children && (
        <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border-subtle)]">
          {children}
        </div>
      )}
    </div>
  );
}
