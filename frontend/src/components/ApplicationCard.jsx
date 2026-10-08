import React from 'react';
import StatusBadge from './StatusBadge';
import { MapPin, DollarSign, Calendar, ExternalLink, Trash2, Edit3, ArrowRight } from 'lucide-react';

export default function ApplicationCard({ application, onSelect, onEdit, onDelete }) {
  const { id, company, role, location, salary, job_url, status, application_date, interviews = [] } = application;

  return (
    <div className="app-card" onClick={() => onSelect(application)}>
      <div>
        <div className="app-card-header">
          <h3 className="app-company">{company}</h3>
          <StatusBadge status={status} />
        </div>

        <p className="app-role">{role}</p>

        <div className="app-meta">
          {location && (
            <div className="app-meta-item">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          )}
          {salary && (
            <div className="app-meta-item">
              <DollarSign size={14} />
              <span>{salary}</span>
            </div>
          )}
          <div className="app-meta-item">
            <Calendar size={14} />
            <span>Applied: {application_date || 'Recent'}</span>
          </div>
        </div>
      </div>

      <div className="app-card-footer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {job_url && (
            <a
              href={job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              title="Open Job Link"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            onClick={() => onEdit(application)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            title="Edit Application"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="btn btn-danger"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            title="Delete Application"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <button
          onClick={() => onSelect(application)}
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <span>{interviews.length > 0 ? `${interviews.length} Rounds` : 'Details'}</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
