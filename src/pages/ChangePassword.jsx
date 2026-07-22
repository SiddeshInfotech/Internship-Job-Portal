import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';

function strength(pw) {
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ c: false, n: false, cf: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const score = strength(next);

  // Live Password Criteria Checks
  const hasMinLength = next.length >= 10;
  const hasUpper = /[A-Z]/.test(next);
  const hasNumber = /[0-9]/.test(next);
  const hasSymbol = /[^A-Za-z0-9]/.test(next);
  const matches = confirm.length > 0 && next === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (next.length < 10) {
      setError('New password must be at least 10 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/admin/change-password', {
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      setSuccess('Password updated successfully.');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not update password. Please check your current password and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page-body" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes cpFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cpPulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        @keyframes cpShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .cp-container {
          animation: cpFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cp-card-enhanced {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cp-card-enhanced:hover {
          box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.08);
        }

        .cp-input-group {
          position: relative;
          transition: all 0.2s ease;
        }

        .cp-input-enhanced {
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease-in-out;
          box-sizing: border-box;
        }

        .cp-input-enhanced:focus {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }

        .cp-badge-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          animation: cpPulseGlow 3s infinite;
        }

        .cp-btn-submit {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cp-btn-submit:hover:not(:disabled) {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
        }

        .cp-btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .cp-btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cp-criterion-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .cp-criterion-active {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .cp-criterion-inactive {
          background: #f1f5f9;
          color: #94a3b8;
          border: 1px solid #e2e8f0;
        }
      `}</style>

      <TopNavbar title="Security Settings" />

      <div className="cp-container" style={{ maxWidth: '520px', margin: '28px auto 40px', padding: '0 16px' }}>
        <form onSubmit={handleSubmit} className="cp-card-enhanced" style={{ position: 'relative', overflow: 'hidden', padding: '32px' }}>
          
          {/* Top Decorative Ember Accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }} />

          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div className="cp-badge-icon" aria-hidden="true">🛡️</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>Update Password</h3>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748b' }}>Protect your account with a high-security passphrase</p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }} role="status">
              <span style={{ fontSize: '16px' }}>✨</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{success}</span>
            </div>
          )}

          {/* Current Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <FieldLabel>Current Password</FieldLabel>
            <PasswordInput
              value={current}
              onChange={setCurrent}
              show={show.c}
              toggle={() => setShow((s) => ({ ...s, c: !s.c }))}
              placeholder="Enter existing password"
            />
          </div>

          {/* New Password Field */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <FieldLabel>New Password</FieldLabel>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>MIN 10 CHARACTERS</span>
            </div>
            <PasswordInput
              value={next}
              onChange={setNext}
              show={show.n}
              toggle={() => setShow((s) => ({ ...s, n: !s.n }))}
              placeholder="Create complex password"
            />
          </div>

          {/* Interactive Strength Bar & Criteria Checklist */}
          {next.length > 0 && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Security Strength</span>
                <span style={{ fontSize: '12px', color: STRENGTH_COLORS[score], fontWeight: 700 }}>{STRENGTH_LABELS[score]}</span>
              </div>

              {/* Segmented Strength Bar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '5px',
                      borderRadius: '3px',
                      background: i < score ? STRENGTH_COLORS[score] : '#e2e8f0',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: i < score ? `0 0 8px ${STRENGTH_COLORS[score]}60` : 'none'
                    }}
                  />
                ))}
              </div>

              {/* Requirement Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className={`cp-criterion-tag ${hasMinLength ? 'cp-criterion-active' : 'cp-criterion-inactive'}`}>
                  {hasMinLength ? '✓' : '○'} 10+ Chars
                </span>
                <span className={`cp-criterion-tag ${hasUpper ? 'cp-criterion-active' : 'cp-criterion-inactive'}`}>
                  {hasUpper ? '✓' : '○'} Uppercase
                </span>
                <span className={`cp-criterion-tag ${hasNumber ? 'cp-criterion-active' : 'cp-criterion-inactive'}`}>
                  {hasNumber ? '✓' : '○'} Number
                </span>
                <span className={`cp-criterion-tag ${hasSymbol ? 'cp-criterion-active' : 'cp-criterion-inactive'}`}>
                  {hasSymbol ? '✓' : '○'} Symbol
                </span>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div style={{ marginTop: next.length > 0 ? '0' : '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <FieldLabel>Confirm New Password</FieldLabel>
              {confirm.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: matches ? '#10b981' : '#ef4444' }}>
                  {matches ? '✓ PASSWORDS MATCH' : '✕ DOES NOT MATCH'}
                </span>
              )}
            </div>
            <PasswordInput
              value={confirm}
              onChange={setConfirm}
              show={show.cf}
              toggle={() => setShow((s) => ({ ...s, cf: !s.cf }))}
              placeholder="Verify new password"
            />
          </div>

          {/* Security Best Practices Tip */}
          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '12px 14px', fontSize: '12px', color: '#1e40af', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '15px' }}>💡</span>
            <span style={{ lineHeight: '1.5' }}>
              For optimal security, combine unique phrases with letters, numbers, and symbols. Avoid personal dates or reused passwords.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="cp-btn-submit"
            style={{ width: '100%', marginTop: '24px', fontSize: '15px' }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Updating Password...</span>
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function FieldLabel({ children }) {
  return <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>{children}</label>;
}
function PasswordInput({ value, onChange, show, toggle, placeholder }) {
  return (
    <div className="cp-input-group">
      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px', zIndex: 1 }}>
        🔒
      </span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="cp-input-enhanced"
        style={{ padding: '12px 44px 12px 40px' }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: '#64748b',
          fontSize: '14px',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', /* <--- THIS IS FIXED (camelCase) */
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );

}

export default ChangePassword;