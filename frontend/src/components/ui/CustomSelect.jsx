import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  className = '',
  id,
  name,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange({ target: { value: val, name: name || id } });
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Hidden native input for form compatibility */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-[var(--accent)] bg-[var(--bg-surface-raised)] ring-2 ring-[var(--accent-glow)]'
            : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-surface-raised)]/60'
        }`}
      >
        <span className={`truncate font-medium ${selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 ml-2 text-[var(--text-secondary)] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[var(--accent)]' : ''
          }`}
        />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 p-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/95 backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.55),0_0_24px_var(--accent-glow)] animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <ul role="listbox" className="max-h-60 overflow-y-auto space-y-1 py-0.5 custom-scrollbar">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold shadow-[inset_0_0_0_1px_rgba(201,255,77,0.2)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:translate-x-0.5'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="shrink-0 text-[var(--accent)] ml-2" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
