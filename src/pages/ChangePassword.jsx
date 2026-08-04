import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import { useToast } from '../context/ToastContext';

function strength(pw) {
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#16a34a'];

function ChangePassword() {
  const { showToast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ c: false, n: false, cf: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const score = strength(next);

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
      showToast('Password updated successfully! 🎉', 'success');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Security Settings" />

      <div style={{ maxWidth: '480px', margin: '20px auto 0' }}>
        <form onSubmit={handleSubmit} className="pf-card pf-fade-up" style={{ position: 'relative', overflow: 'hidden', padding: '28px' }}>
          <div className="pf-ember-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div className="cp-metric-icon" style={{ marginBottom: 0 }} aria-hidden="true">🛡️</div>
            <div>
              <h3 className="pf-display" style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--pf-text)' }}>Update Password</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--pf-text-3)' }}>Manage your institutional account security</p>
            </div>
          </div>

          {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
          {success && <div className="pf-alert-success" role="status"><span aria-hidden="true">✓</span>{success}</div>}

          <FieldLabel>Current Password</FieldLabel>
          <PasswordInput value={current} onChange={setCurrent} show={show.c} toggle={() => setShow((s) => ({ ...s, c: !s.c }))} placeholder="Enter existing password" />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px' }}>
            <FieldLabel>New Password</FieldLabel>
            <span style={{ fontSize: '11px', color: 'var(--pf-text-3)', fontWeight: 600 }}>MIN 10 CHARACTERS</span>
          </div>
          <PasswordInput value={next} onChange={setNext} show={show.n} toggle={() => setShow((s) => ({ ...s, n: !s.n }))} placeholder="Create complex password" />

          {next.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Security Strength</span>
                <span style={{ fontSize: '11px', color: STRENGTH_COLORS[score], fontWeight: 700 }}>{STRENGTH_LABELS[score]}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < score ? STRENGTH_COLORS[score] : 'var(--pf-line)' }} />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '18px' }}>
            <FieldLabel>Confirm New Password</FieldLabel>
            <PasswordInput value={confirm} onChange={setConfirm} show={show.cf} toggle={() => setShow((s) => ({ ...s, cf: !s.cf }))} placeholder="Verify new password" />
          </div>

          <div className="cp-tip-box" style={{ marginTop: '18px', fontSize: '12px' }}>
            <span aria-hidden="true">ℹ️</span>
            <span>For better security, use a combination of letters, numbers, and symbols. Avoid using common words or birthdays associated with your profile.</span>
          </div>

          <button type="submit" disabled={loading} className="pf-btn pf-btn-ember pf-btn-lg" style={{ width: '100%', marginTop: '22px' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  );
}

function FieldLabel({ children }) {
  return <label className="pf-label">{children}</label>;
}

function PasswordInput({ value, onChange, show, toggle, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}>🔒</span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="pf-input"
        style={{ padding: '11px 42px 11px 36px' }}
      />
      <button type="button" onClick={toggle} aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--pf-text-3)', fontSize: '13px', padding: '5px', borderRadius: '7px' }}>
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default ChangePassword;
