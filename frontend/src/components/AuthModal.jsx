import React, { useState } from 'react';
import { X, LogOut, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onLogout, currentUser }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (mode === 'login') {
        res = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      if (res && res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {mode === 'login' ? 'Candidate Sign In' : 'Create Candidate Account'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {mode === 'login' ? 'Access your synchronized applications' : 'Start tracking with JWT authentication'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active Account Status & Account Logout Action */}
        {currentUser && (
          <div
            style={{
              margin: '16px 24px 8px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Active Account
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                {currentUser.email}
              </div>
            </div>
            <button
              id="btn-account-logout-modal"
              type="button"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ef4444',
                borderColor: '#fca5a5',
              }}
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
            >
              <LogOut size={13} />
              <span>Account Logout</span>
            </button>
          </div>
        )}

        {/* Tab switchers */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--border-light)' }}>
          <button
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px' }}>
            {error && (
              <div
                style={{
                  background: '#fff1f2',
                  color: '#be123c',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
