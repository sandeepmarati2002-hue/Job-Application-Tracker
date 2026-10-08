import React, { useEffect } from 'react';
import { LogOut, X, Keyboard, Search, Plus, Moon, LayoutGrid, Kanban, Calendar, User, LayoutDashboard } from 'lucide-react';

const SHORTCUT_GROUPS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['1'], label: 'Go to Dashboard', icon: <LayoutDashboard size={14} /> },
      { keys: ['2'], label: 'Go to Applications', icon: <LayoutGrid size={14} /> },
      { keys: ['3'], label: 'Go to Interviews', icon: <Calendar size={14} /> },
      { keys: ['4'], label: 'Go to Candidate Profile', icon: <User size={14} /> },
    ],
  },
  {
    category: 'Quick Actions',
    items: [
      { keys: ['Ctrl', 'K'], altKey: '/', label: 'Global Search', icon: <Search size={14} /> },
      { keys: ['N'], label: 'Add New Application', icon: <Plus size={14} /> },
      { keys: ['D'], label: 'Toggle Dark / Light Theme', icon: <Moon size={14} /> },
      { keys: ['L'], label: 'Account Logout', icon: <LogOut size={14} /> },
      { keys: ['?'], label: 'Open Shortcuts Helper', icon: <Keyboard size={14} /> },
    ],
  },
  {
    category: 'Views & Overlays',
    items: [
      { keys: ['G'], label: 'Switch to Grid View (Applications)', icon: <LayoutGrid size={14} /> },
      { keys: ['B'], label: 'Switch to Kanban Board (Applications)', icon: <Kanban size={14} /> },
      { keys: ['Esc'], label: 'Close Active Modal / Dropdown', icon: <X size={14} /> },
    ],
  },
];

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
    >
      <div
        className="modal-card shortcuts-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Keyboard size={18} />
            </div>
            <div>
              <h2 id="shortcuts-dialog-title" className="modal-title">
                Keyboard Shortcuts
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Navigate and manage applications at warp speed
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="shortcuts-modal-body">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.category} className="shortcuts-group">
              <h3 className="shortcuts-group-title">{group.category}</h3>
              <div className="shortcuts-list">
                {group.items.map((item, idx) => (
                  <div key={idx} className="shortcut-row">
                    <div className="shortcut-meta">
                      <span className="shortcut-icon">{item.icon}</span>
                      <span className="shortcut-label">{item.label}</span>
                    </div>

                    <div className="shortcut-keys-wrapper">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <kbd className="shortcut-kbd">{k}</kbd>
                          {kIdx < item.keys.length - 1 && <span className="shortcut-plus">+</span>}
                        </React.Fragment>
                      ))}
                      {item.altKey && (
                        <>
                          <span className="shortcut-or">or</span>
                          <kbd className="shortcut-kbd">{item.altKey}</kbd>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between', padding: '14px 24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Tip: Press <kbd className="shortcut-kbd shortcut-kbd-sm">?</kbd> anywhere to trigger this guide
          </span>
          <button
            id="btn-close-shortcuts-modal"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
