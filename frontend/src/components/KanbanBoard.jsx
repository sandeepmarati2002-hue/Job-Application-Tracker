import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const COLUMNS = [
  { id: 'Applied', title: 'Applied', color: '#3b82f6', bg: 'var(--status-applied-bg)', border: 'var(--status-applied-border)' },
  { id: 'Assessment', title: 'Assessment', color: '#a855f7', bg: 'var(--status-assessment-bg)', border: 'var(--status-assessment-border)' },
  { id: 'Interview', title: 'Interview', color: '#f59e0b', bg: 'var(--status-interview-bg)', border: 'var(--status-interview-border)' },
  { id: 'Offer', title: 'Offer', color: '#10b981', bg: 'var(--status-offer-bg)', border: 'var(--status-offer-border)' },
  { id: 'Rejected', title: 'Rejected', color: '#ef4444', bg: 'var(--status-rejected-bg)', border: 'var(--status-rejected-border)' },
  { id: 'Withdrawn', title: 'Withdrawn', color: '#64748b', bg: 'var(--status-withdrawn-bg)', border: 'var(--status-withdrawn-border)' },
];

export default function KanbanBoard({
  applications,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNewInColumn,
}) {
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', String(appId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const appIdStr = e.dataTransfer.getData('text/plain');
    const appId = Number(appIdStr);
    if (appId) {
      onStatusChange(appId, targetStatus);
    }
    setDraggedAppId(null);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-grid">
        {COLUMNS.map((column) => {
          const colApps = applications.filter((app) => app.status === column.id);
          const isOver = dragOverCol === column.id;

          return (
            <div
              key={column.id}
              className={`kanban-column ${isOver ? 'kanban-column-dragover' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="kanban-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="kanban-dot"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="kanban-col-title">{column.title}</span>
                  <span className="kanban-col-count">{colApps.length}</span>
                </div>

                {onAddNewInColumn && (
                  <button
                    onClick={() => onAddNewInColumn(column.id)}
                    className="kanban-add-btn"
                    title={`Add new ${column.title} application`}
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>

              {/* Cards List */}
              <div className="kanban-cards-list">
                {colApps.length === 0 ? (
                  <div className="kanban-empty-col">
                    Drop applications here
                  </div>
                ) : (
                  colApps.map((app) => {
                    const isDragging = draggedAppId === app.id;
                    const interviewCount = (app.interviews && app.interviews.length) || 0;

                    return (
                      <div
                        key={app.id}
                        className={`kanban-card ${isDragging ? 'kanban-card-dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelect(app)}
                      >
                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <div className="kanban-card-company">{app.company}</div>
                            <div className="kanban-card-role">{app.role}</div>
                          </div>
                          <div
                            style={{ display: 'flex', gap: '4px' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => onEdit(app)}
                              className="kanban-action-icon"
                              title="Edit application"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDelete(app.id)}
                              className="kanban-action-icon kanban-action-delete"
                              title="Delete application"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Location & Salary */}
                        <div className="kanban-card-meta">
                          {app.location && (
                            <span className="kanban-meta-item">
                              <MapPin size={12} />
                              <span className="truncate">{app.location}</span>
                            </span>
                          )}
                          {app.salary && (
                            <span className="kanban-meta-item">
                              <DollarSign size={12} />
                              <span>{app.salary}</span>
                            </span>
                          )}
                        </div>

                        {/* Card Footer: Date & Interview Count */}
                        <div className="kanban-card-footer">
                          <span className="kanban-card-date">
                            <Clock size={11} />
                            <span>{app.application_date}</span>
                          </span>

                          {interviewCount > 0 ? (
                            <span className="kanban-interview-pill">
                              <CheckCircle2 size={11} />
                              <span>{interviewCount} {interviewCount === 1 ? 'round' : 'rounds'}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
