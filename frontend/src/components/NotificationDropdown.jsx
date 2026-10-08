import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Award,
  Clock,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

export default function NotificationDropdown({
  applications = [],
  onSelectApplication,
  onNavigateTab,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all | interviews | actions
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jobtrack_read_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);

  // Generate dynamic notification items based on actual applications state
  const notifications = useMemo(() => {
    const items = [];
    const now = new Date();

    applications.forEach((app) => {
      // 1. Check for upcoming interviews
      (app.interviews || []).forEach((iv) => {
        const ivDate = new Date(iv.interview_date);
        const isUpcoming = ivDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const isPending = iv.result === 'Pending';

        if (isUpcoming || isPending) {
          const diffDays = Math.ceil((ivDate - now) / (1000 * 60 * 60 * 24));
          let timeLabel = '';
          if (diffDays === 0) timeLabel = 'Today';
          else if (diffDays === 1) timeLabel = 'Tomorrow';
          else if (diffDays > 1) timeLabel = `In ${diffDays} days`;
          else timeLabel = 'Recent';

          items.push({
            id: `iv-${app.id}-${iv.id}`,
            appId: app.id,
            company: app.company,
            role: app.role,
            type: 'interview',
            title: `${app.company}: ${iv.interview_type}`,
            description: `${timeLabel} at ${ivDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with ${iv.interviewer || 'Interview Panel'}`,
            date: ivDate,
            priority: diffDays <= 2 ? 'high' : 'medium',
            icon: <Calendar size={16} color="#8b5cf6" />,
            badgeBg: '#f3e8ff',
          });
        }
      });

      // 2. Check for Offers
      if (app.status === 'Offer') {
        items.push({
          id: `offer-${app.id}`,
          appId: app.id,
          company: app.company,
          role: app.role,
          type: 'offer',
          title: `Offer Received: ${app.company}`,
          description: `Package: ${app.salary || 'Competitive'} for ${app.role}. Review terms & schedule compensation call.`,
          date: new Date(app.application_date || now),
          priority: 'high',
          icon: <Award size={16} color="#059669" />,
          badgeBg: '#ecfdf5',
        });
      }

      // 3. Check for Assessments in progress
      if (app.status === 'Assessment') {
        items.push({
          id: `assess-${app.id}`,
          appId: app.id,
          company: app.company,
          role: app.role,
          type: 'action',
          title: `Assessment Due: ${app.company}`,
          description: `Online coding assessment pending completion. Check email for portal access link.`,
          date: new Date(app.application_date || now),
          priority: 'high',
          icon: <AlertCircle size={16} color="#d97706" />,
          badgeBg: '#fffbeb',
        });
      }

      // 4. Follow-up recommendations for applications submitted > 5 days ago
      if (app.status === 'Applied' && app.application_date) {
        const appDate = new Date(app.application_date);
        const daysOld = Math.floor((now - appDate) / (1000 * 60 * 60 * 24));
        if (daysOld >= 5) {
          items.push({
            id: `followup-${app.id}`,
            appId: app.id,
            company: app.company,
            role: app.role,
            type: 'action',
            title: `Follow Up: ${app.company}`,
            description: `Applied ${daysOld} days ago. Consider connecting with a recruiter or alumni on LinkedIn.`,
            date: appDate,
            priority: 'medium',
            icon: <Clock size={16} color="#3b82f6" />,
            badgeBg: '#eff6ff',
          });
        }
      }
    });

    // Default welcoming notification if empty
    if (items.length === 0) {
      items.push({
        id: 'welcome-jobtrack',
        type: 'general',
        title: 'JobTrack Ready',
        description: 'Track applications, rounds, and analytics in one unified dashboard.',
        date: new Date(),
        priority: 'low',
        icon: <CheckCircle2 size={16} color="#10b981" />,
        badgeBg: '#ecfdf5',
      });
    }

    return items;
  }, [applications]);

  // Unread items count
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !readIds.includes(item.id)).length;
  }, [notifications, readIds]);

  // Filtered notifications based on active tab
  const filteredItems = useMemo(() => {
    if (activeFilter === 'interviews') {
      return notifications.filter((item) => item.type === 'interview');
    }
    if (activeFilter === 'actions') {
      return notifications.filter((item) => item.type === 'action' || item.type === 'offer');
    }
    return notifications;
  }, [notifications, activeFilter]);

  // Mark all as read
  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('jobtrack_read_notifications', JSON.stringify(allIds));
  };

  // Mark single item as read
  const markAsRead = (id, e) => {
    e?.stopPropagation();
    if (!readIds.includes(id)) {
      const next = [...readIds, id];
      setReadIds(next);
      localStorage.setItem('jobtrack_read_notifications', JSON.stringify(next));
    }
  };

  // Handle item click
  const handleItemClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.appId) {
      const targetApp = applications.find((a) => a.id === item.appId);
      if (targetApp && onSelectApplication) {
        onSelectApplication(targetApp);
      }
    } else if (onNavigateTab) {
      onNavigateTab('interviews');
    }
  };

  // Light dismiss on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="notification-center-wrapper" ref={dropdownRef}>
      <button
        id="btn-notifications-toggle"
        type="button"
        className={`notification-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Notifications & Upcoming Deadlines"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-badge-count" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="notifications-popover"
          className="notification-dropdown-panel"
          role="region"
          aria-label="Activity and notifications center"
        >
          {/* Header */}
          <div className="notification-panel-header">
            <div className="notification-header-title">
              <span className="notification-header-text">Notifications</span>
              {unreadCount > 0 && (
                <span className="notification-header-chip">{unreadCount} new</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {unreadCount > 0 && (
                <button
                  id="btn-mark-all-read"
                  type="button"
                  className="notification-mark-all-btn"
                  onClick={markAllAsRead}
                  title="Mark all notifications as read"
                >
                  <Check size={13} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                className="notification-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close notification panel"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="notification-tabs">
            <button
              type="button"
              className={`notification-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              className={`notification-tab-btn ${activeFilter === 'interviews' ? 'active' : ''}`}
              onClick={() => setActiveFilter('interviews')}
            >
              Interviews
            </button>
            <button
              type="button"
              className={`notification-tab-btn ${activeFilter === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveFilter('actions')}
            >
              Action Items
            </button>
          </div>

          {/* Notifications List */}
          <div className="notification-list-container">
            {filteredItems.length === 0 ? (
              <div className="notification-empty-state">
                <CheckCircle2 size={28} color="var(--primary)" />
                <p style={{ marginTop: '8px', fontWeight: 600 }}>All caught up!</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  No pending alerts in this category
                </span>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`notification-item-${item.id}`}
                    className={`notification-item ${!isRead ? 'unread' : ''}`}
                    onClick={() => handleItemClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleItemClick(item);
                      }
                    }}
                  >
                    <div
                      className="notification-icon-wrapper"
                      style={{ background: item.badgeBg }}
                    >
                      {item.icon}
                    </div>

                    <div className="notification-content">
                      <div className="notification-title-row">
                        <span className="notification-item-title">{item.title}</span>
                        {!isRead && <span className="notification-unread-dot" />}
                      </div>
                      <p className="notification-item-desc">{item.description}</p>
                    </div>

                    <div className="notification-action-hint">
                      <ExternalLink size={13} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="notification-panel-footer">
            <button
              type="button"
              className="notification-view-timeline-btn"
              onClick={() => {
                setIsOpen(false);
                if (onNavigateTab) onNavigateTab('interviews');
              }}
            >
              <span>View full interview timeline &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
