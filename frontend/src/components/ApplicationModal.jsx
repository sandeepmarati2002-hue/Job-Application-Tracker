import React, { useState } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function ApplicationModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(() => ({
    company: initialData?.company || '',
    role: initialData?.role || '',
    location: initialData?.location || '',
    job_url: initialData?.job_url || '',
    status: initialData?.status || 'Applied',
    application_date: initialData?.application_date || getTodayDate(),
    salary: initialData?.salary || '',
    description: initialData?.description || '',
  }));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      alert('Company name and Role are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {initialData ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, TCS"
                  className="form-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE Intern, Backend Engineer"
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Application Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.application_date}
                  onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote, Bangalore, Hyderabad"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salary / Compensation</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000/month or $110k"
                  className="form-input"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Posting URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                className="form-input"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes & Description</label>
              <textarea
                placeholder="Key requirements, referral name, tech stack..."
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
