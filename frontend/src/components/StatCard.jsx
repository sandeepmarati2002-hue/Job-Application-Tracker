import React from 'react';

export default function StatCard({ label, value, icon, color = '#4f46e5', bg = '#eef2ff' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon" style={{ backgroundColor: bg, color: color }}>
        {icon}
      </div>
    </div>
  );
}
