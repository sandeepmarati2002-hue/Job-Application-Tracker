import React from 'react';

const STATUS_ICONS = {
  Applied: '●',
  Assessment: '◆',
  Interview: '▲',
  Offer: '★',
  Rejected: '✕',
  Withdrawn: '○',
};

export default function StatusBadge({ status }) {
  const icon = STATUS_ICONS[status] || '●';
  return (
    <span className={`status-badge ${status || 'Applied'}`}>
      <span>{icon}</span>
      <span>{status || 'Applied'}</span>
    </span>
  );
}
