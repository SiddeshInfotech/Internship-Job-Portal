import React from 'react';
import { Link } from 'react-router-dom';

/* Shown at the top of the student/company dashboards when the profile
   isn't fully filled in, with a direct link to finish it. */
function ProfileCompletionBanner({ percent, to, label = 'Complete profile now' }) {
  if (percent >= 100) return null;
  return (
    <div
      className="pf-fade-up"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap',
        padding: '14px 18px', marginBottom: '20px',
        borderRadius: 'var(--pf-r-lg)',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(245,158,11,0.09) 100%)',
        border: '1px solid var(--pf-amber-ln)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
        <div
          aria-hidden="true"
          style={{
            width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            background: 'var(--pf-ember-soft)', border: '1px solid var(--pf-amber-ln)',
          }}
        >
          ⚡
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>
            Your profile is {percent}% complete
          </p>
          <p style={{ margin: '2px 0 8px', fontSize: '12.5px', color: 'var(--pf-text-2)' }}>
            A complete profile gets noticed far more often — finish the remaining sections.
          </p>
          <div style={{ height: 5, borderRadius: 99, background: 'var(--pf-line)', overflow: 'hidden', maxWidth: 320 }}>
            <div
              style={{
                height: '100%', width: `${percent}%`, borderRadius: 99,
                background: 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)',
                transition: 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>
        </div>
      </div>
      <Link to={to} className="pf-btn pf-btn-ember" style={{ textDecoration: 'none', flexShrink: 0 }}>
        {label}
      </Link>
    </div>
  );
}

export default ProfileCompletionBanner;
