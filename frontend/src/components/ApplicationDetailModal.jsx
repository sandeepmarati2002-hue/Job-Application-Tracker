import React, { useState } from 'react';
import { X, Calendar, MapPin, DollarSign, ExternalLink, Plus, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const INTERVIEW_TYPES = [
  'Online Assessment (OA)',
  'Technical Round 1 (DSA)',
  'Technical Round 2 (System Design)',
  'Managerial Round',
  'HR Round',
];

const INTERVIEW_RESULTS = ['Pending', 'Passed', 'Failed', 'Cancelled'];

const getTodayDateTime = () => new Date().toISOString().slice(0, 16);

export default function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onStatusChange,
  onAddInterview,
  onDeleteInterview,
}) {
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [newInterview, setNewInterview] = useState(() => ({
    interview_type: 'Technical Round 1 (DSA)',
    interview_date: getTodayDateTime(),
    interviewer: '',
    notes: '',
    result: 'Pending',
  }));

  if (!isOpen || !application) return null;

  const { id, company, role, location, salary, job_url, status, application_date, description, interviews = [] } = application;

  const handleCreateInterview = (e) => {
    e.preventDefault();
    onAddInterview(id, newInterview);
    setShowAddInterview(false);
    setNewInterview({
      interview_type: 'Technical Round 1 (DSA)',
      interview_date: getTodayDateTime(),
      interviewer: '',
      notes: '',
      result: 'Pending',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{company}</h2>
              <StatusBadge status={status} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '2px' }}>{role}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Metadata Row */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={16} /> <span>{location}</span>
              </div>
            )}
            {salary && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <DollarSign size={16} /> <span>{salary}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Calendar size={16} /> <span>Applied: {application_date}</span>
            </div>
            {job_url && (
              <a
                href={job_url}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
              >
                <ExternalLink size={15} /> <span>Job Posting</span>
              </a>
            )}
          </div>

          {/* Quick Status Update */}
          <div style={{ margin: '18px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Update Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
            >
              {['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {description && (
            <div style={{ marginBottom: '24px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>Description / Notes:</p>
              <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{description}</p>
            </div>
          )}

          {/* Interview Stages Timeline */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Interview Rounds</h3>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setShowAddInterview(!showAddInterview)}
              >
                <Plus size={14} />
                <span>{showAddInterview ? 'Cancel' : 'Log Interview Round'}</span>
              </button>
            </div>

            {/* Add Interview Form Inline */}
            {showAddInterview && (
              <form onSubmit={handleCreateInterview} style={{ background: 'var(--bg-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Schedule / Log Round</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Round Type</label>
                    <select
                      className="form-select"
                      value={newInterview.interview_type}
                      onChange={(e) => setNewInterview({ ...newInterview, interview_type: e.target.value })}
                    >
                      {INTERVIEW_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      className="form-input"
                      value={newInterview.interview_date}
                      onChange={(e) => setNewInterview({ ...newInterview, interview_date: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Interviewer</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe (Tech Lead)"
                      className="form-input"
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Outcome / Result</label>
                    <select
                      className="form-select"
                      value={newInterview.result}
                      onChange={(e) => setNewInterview({ ...newInterview, result: e.target.value })}
                    >
                      {INTERVIEW_RESULTS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Round Notes / Questions Asked</label>
                  <textarea
                    placeholder="E.g. Asked DSA binary search question, discussed projects..."
                    className="form-textarea"
                    style={{ minHeight: '60px' }}
                    value={newInterview.notes}
                    onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Save Interview Round
                </button>
              </form>
            )}

            {interviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '12px 0' }}>
                No interview rounds logged yet. Click &quot;Log Interview Round&quot; when you receive an assessment or interview invitation.
              </p>
            ) : (
              <div className="timeline">
                {interviews.map((iv, index) => (
                  <div key={iv.id || index} className="timeline-item">
                    <div className="timeline-dot" />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{iv.interview_type}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                          background: iv.result === 'Passed' ? '#ecfdf5' : iv.result === 'Failed' ? '#fff1f2' : '#fffbeb',
                          color: iv.result === 'Passed' ? '#047857' : iv.result === 'Failed' ? '#be123c' : '#b45309',
                        }}>
                          {iv.result}
                        </span>
                        {onDeleteInterview && (
                          <button
                            onClick={() => onDeleteInterview(id, iv.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#be123c', padding: '2px' }}
                            title="Delete Round"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(iv.interview_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {iv.interviewer && ` • Interviewer: ${iv.interviewer}`}
                    </div>
                    {iv.notes && (
                      <div style={{ fontSize: '0.82rem', marginTop: '6px', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '4px' }}>
                        {iv.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
