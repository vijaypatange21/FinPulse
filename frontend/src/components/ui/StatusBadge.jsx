import React from 'react';

export const StatusBadge = ({ status = 'pending', label, className = '' }) => {
  const norm = String(status || '').toLowerCase().replace(/[\s_-]+/g, '');

  let color = 'var(--status-pending)';
  let bg = 'rgba(245, 166, 35, 0.12)';
  let defaultLabel = 'Pending';

  if (norm.includes('verif') || norm.includes('approv') || norm.includes('track') || norm.includes('safe') || norm.includes('disburs') || norm.includes('paid')) {
    color = 'var(--status-positive)';
    bg = 'rgba(52, 209, 163, 0.12)';
    defaultLabel = status;
  } else if (norm.includes('reject') || norm.includes('overdue') || norm.includes('high') || norm.includes('flag')) {
    color = 'var(--status-negative)';
    bg = 'rgba(255, 107, 107, 0.12)';
    defaultLabel = status;
  } else if (norm.includes('review') || norm.includes('info') || norm.includes('process') || norm.includes('watch')) {
    color = 'var(--status-info)';
    bg = 'rgba(91, 155, 255, 0.12)';
    defaultLabel = status;
  } else if (norm.includes('grace')) {
    color = 'var(--status-pending)';
    bg = 'rgba(245, 166, 35, 0.12)';
    defaultLabel = status;
  }

  // Ensure sentence case (§2.3 / §10: sentence case labels, never ALL-CAPS)
  const displayLabel = label || defaultLabel;
  const sentenceCased = displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full select-none ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{sentenceCased}</span>
    </span>
  );
};

export default StatusBadge;
