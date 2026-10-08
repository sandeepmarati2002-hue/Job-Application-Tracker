import React, { useState, useEffect } from 'react';
import { X, User, Mail, Briefcase, MapPin, DollarSign, Globe, Code, LogOut } from 'lucide-react';

export default function ProfileEditModal({ isOpen, profile, onClose, onSave, onLogout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    location: '',
    targetSalary: '',
    github: '',
    linkedin: '',
    leetcode: '',
    portfolio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        bio: profile.bio || '',
        location: profile.location || 'Bangalore, India',
        targetSalary: profile.targetSalary || '₹18 - ₹24 LPA',
        github: profile.github || 'https://github.com',
        linkedin: profile.linkedin || 'https://linkedin.com',
        leetcode: profile.leetcode || 'https://leetcode.com',
        portfolio: profile.portfolio || 'https://portfolio.dev',
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="modal-card"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} />
            </div>
            <div>
              <h2 id="profile-modal-title" className="modal-title">
                Edit Candidate Profile
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Customize your recruiter-facing summary and social portfolio links
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close profile modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-profile-name">
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="input-profile-name"
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sandeep Kumar"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-profile-email">
                  Email Address *
                </label>
                <input
                  id="input-profile-email"
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. candidate@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-profile-role">
                Professional Title / Headline
              </label>
              <input
                id="input-profile-role"
                type="text"
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Aspiring Software Engineer / MCA Candidate"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-profile-bio">
                Professional Bio & Career Objective
              </label>
              <textarea
                id="input-profile-bio"
                className="form-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Passionate about building scalable backend services, distributed systems, and modern web applications..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-profile-location">
                  Preferred Location
                </label>
                <input
                  id="input-profile-location"
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore, India (Hybrid / Remote)"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-profile-salary">
                  Target Compensation
                </label>
                <input
                  id="input-profile-salary"
                  type="text"
                  className="form-input"
                  value={formData.targetSalary}
                  onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                  placeholder="e.g. ₹18 - ₹24 LPA"
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>
                Portfolio & Profiles
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-profile-github">
                    GitHub URL
                  </label>
                  <input
                    id="input-profile-github"
                    type="url"
                    className="form-input"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-profile-linkedin">
                    LinkedIn URL
                  </label>
                  <input
                    id="input-profile-linkedin"
                    type="url"
                    className="form-input"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-profile-leetcode">
                    LeetCode Profile
                  </label>
                  <input
                    id="input-profile-leetcode"
                    type="url"
                    className="form-input"
                    value={formData.leetcode}
                    onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                    placeholder="https://leetcode.com/username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-profile-portfolio">
                    Personal Portfolio / Blog
                  </label>
                  <input
                    id="input-profile-portfolio"
                    type="url"
                    className="form-input"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://myportfolio.dev"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {onLogout ? (
              <button
                id="btn-account-logout-editmodal"
                type="button"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ef4444',
                  borderColor: 'var(--border-light)',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                }}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <LogOut size={14} />
                <span>Account Logout</span>
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                id="btn-cancel-profile-edit"
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                id="btn-save-profile"
                type="submit"
                className="btn btn-primary"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
