import React from 'react';

/* Reusable password-strength meter (same rubric as admin Change Password).
   Renders a 4-segment bar + label. Pass the current password string. */
export function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#16a34a'];

function PasswordStrength({ password, className = '' }) {
  if (!password) return null;
  const score = scorePassword(password);
  return (
    <div className={className} style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 5, borderRadius: 99,
              background: i < score ? COLORS[score] : 'rgba(148,163,184,0.3)',
              transition: 'background 220ms ease',
            }}
          />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: COLORS[score] }}>
        {LABELS[score]}
        <span style={{ color: 'var(--pf-text-3, #94a3b8)', fontWeight: 500 }}> · 10+ chars, uppercase, number & symbol</span>
      </p>
    </div>
  );
}

export default PasswordStrength;
