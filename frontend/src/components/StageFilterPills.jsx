import React from 'react';

const STAGES = [
  { key: 'ALL', label: 'All Stages', dotColor: 'var(--text-muted)' },
  { key: 'Applied', label: 'Applied', dotColor: '#3b82f6' },
  { key: 'Assessment', label: 'Assessment', dotColor: '#f59e0b' },
  { key: 'Interview', label: 'Interview', dotColor: '#8b5cf6' },
  { key: 'Offer', label: 'Offer', dotColor: '#10b981' },
  { key: 'Rejected', label: 'Rejected', dotColor: '#ef4444' },
  { key: 'Withdrawn', label: 'Withdrawn', dotColor: '#64748b' },
];

export default function StageFilterPills({ applications = [], statusFilter, onStatusFilterChange }) {
  // Pre-calculate counts for each status
  const counts = React.useMemo(() => {
    const map = {
      ALL: applications.length,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0,
    };
    applications.forEach((app) => {
      if (map[app.status] !== undefined) {
        map[app.status] += 1;
      }
    });
    return map;
  }, [applications]);

  return (
    <div
      className="stage-filter-pills-bar"
      role="tablist"
      aria-label="Filter applications by stage"
    >
      {STAGES.map((stage) => {
        const isActive = statusFilter === stage.key;
        const count = counts[stage.key] || 0;

        return (
          <button
            key={stage.key}
            id={`filter-pill-${stage.key.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`stage-filter-pill ${isActive ? 'active' : ''}`}
            onClick={() => onStatusFilterChange(stage.key)}
          >
            <span
              className="stage-filter-dot"
              style={{ backgroundColor: stage.dotColor }}
            />
            <span className="stage-filter-label">{stage.label}</span>
            <span className="stage-filter-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
