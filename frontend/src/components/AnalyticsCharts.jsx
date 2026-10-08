import React, { useMemo } from 'react';
import { TrendingUp, Award, Target, Compass, Layers, PieChart } from 'lucide-react';

export default function AnalyticsCharts({ applications, stats }) {
  // Funnel calculations
  const funnelData = useMemo(() => {
    const total = stats.total || 0;
    const applied = stats.applied || 0;
    const assessment = stats.assessment || 0;
    const interview = stats.interview || 0;
    const offer = stats.offer || 0;

    // Cumulative reached stages
    const reachedApplied = total;
    const reachedAssessment = assessment + interview + offer;
    const reachedInterview = interview + offer;
    const reachedOffer = offer;

    const calcPct = (count) => (total > 0 ? ((count / total) * 100).toFixed(0) : 0);

    return [
      { stage: '1. Applications Sent', count: reachedApplied, pct: 100, color: '#3b82f6', active: applied },
      { stage: '2. Assessments Cleared', count: reachedAssessment, pct: calcPct(reachedAssessment), color: '#8b5cf6', active: assessment },
      { stage: '3. Technical Interviews', count: reachedInterview, pct: calcPct(reachedInterview), color: '#f59e0b', active: interview },
      { stage: '4. Offers Secured', count: reachedOffer, pct: calcPct(reachedOffer), color: '#10b981', active: offer },
    ];
  }, [applications, stats]);

  // Top locations analysis
  const locationStats = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      const loc = (app.location || 'Not Specified').split(',')[0].trim();
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [applications]);

  // Total interviews across all apps
  const totalInterviews = useMemo(() => {
    return applications.reduce((acc, app) => acc + (app.interviews ? app.interviews.length : 0), 0);
  }, [applications]);

  const avgInterviewsPerApp = applications.length > 0 ? (totalInterviews / applications.length).toFixed(1) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* CARD 1: RECRUITMENT FUNNEL */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Recruitment Funnel</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progressive pass-through rate from application to offer</p>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', background: 'var(--bg-subtle)', borderRadius: '20px' }}>
            {stats.total} Total
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {funnelData.map((step, idx) => (
            <div key={step.stage}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>{step.stage}</span>
                <span style={{ fontWeight: 700, color: step.color }}>
                  {step.count} ({step.pct}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: 'var(--border-light)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${step.pct}%`,
                    height: '100%',
                    backgroundColor: step.color,
                    borderRadius: '5px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2: APPLICATION HEALTH & GEOGRAPHIC DISTRIBUTION */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
              <Target size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Application Health & Geography</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key operational metrics and target locations</p>
            </div>
          </div>
        </div>

        {/* 2 Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AVG ROUNDS / APP</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {avgInterviewsPerApp}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{totalInterviews} rounds total logged</div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVE APPLICATIONS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {stats.applied + stats.assessment + stats.interview}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Opportunities currently open</div>
          </div>
        </div>

        {/* Top Locations Breakdown */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Top Target Hubs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {locationStats.map(([loc, count]) => (
              <span
                key={loc}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                <span>📍 {loc}</span>
                <span
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                  }}
                >
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
