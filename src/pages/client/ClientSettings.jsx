import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

function ClientSettings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('password');

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Settings" />
      <div className="cp-page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="cp-settings-grid">
        <div className="cp-panel" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }} role="tablist" aria-label="Settings sections">
          <TabButton active={tab === 'password'} onClick={() => setTab('password')} icon="🔒" label="Change Password" />
          <TabButton active={tab === 'profile'} onClick={() => setTab('profile')} icon="👤" label="Profile Information" />
          <TabButton active={tab === 'notifications'} onClick={() => setTab('notifications')} icon="🔔" label="Notification Settings" />
        </div>

        <div className="cp-form-card">
          {tab === 'password' && <ChangePasswordPanel />}
          {tab === 'profile' && <ProfileInfoPanel onGoToProfile={() => navigate('/company-profile')} />}
          {tab === 'notifications' && <NotificationSettingsPanel />}
        </div>
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 14px', borderRadius: '10px', border: 'none',
        fontFamily: 'var(--pf-font)', fontWeight: 600, fontSize: '13.5px',
        background: active ? 'var(--pf-primary-soft)' : 'transparent',
        color: active ? 'var(--pf-primary-deep)' : 'var(--pf-text-2)',
        boxShadow: active ? 'inset 0 0 0 1px var(--pf-blue-ln)' : 'none',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'background 150ms ease, color 150ms ease',
      }}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </button>
  );
}

function ChangePasswordPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('New password and confirmation do not match.'); return; }

    setLoading(true);
    try {
      await clientAxios.post('/client/change-password', {
        current_password: current, new_password: next, confirm_password: confirm,
      });
      setSuccess('Password updated successfully.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '440px' }}>
      <h3 className="cp-form-section-title" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '4px' }}>Change Password</h3>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--pf-text-3)' }}>Update your password regularly to keep your account secure.</p>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {success && <div className="pf-alert-success" role="status"><span aria-hidden="true">✓</span>{success}</div>}

      <div className="cp-field">
        <label className="pf-label">Old Password</label>
        <PwInput value={current} onChange={setCurrent} placeholder="Enter your old password" />
      </div>

      <div className="cp-field">
        <label className="pf-label">New Password</label>
        <PwInput value={next} onChange={setNext} placeholder="Enter your new password" />
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--pf-text-3)' }}>
          Use at least 8 characters with a mix of letters, numbers and symbols.
        </p>
      </div>

      <div className="cp-field">
        <label className="pf-label">Confirm Password</label>
        <PwInput value={confirm} onChange={setConfirm} placeholder="Confirm your new password" />
      </div>

      <div className="cp-form-actions">
        <button
          type="button"
          className="pf-btn pf-btn-ghost"
          onClick={() => { setCurrent(''); setNext(''); setConfirm(''); setError(''); setSuccess(''); }}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="pf-btn pf-btn-primary">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}

function ProfileInfoPanel({ onGoToProfile }) {
  return (
    <div>
      <h3 className="cp-form-section-title" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '4px' }}>Profile Information</h3>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--pf-text-3)' }}>
        Your company details, HR contacts, and hiring preferences are managed on the Company Profile page.
      </p>
      <button onClick={onGoToProfile} className="pf-btn pf-btn-primary">
        Go to Company Profile →
      </button>
    </div>
  );
}

function NotificationSettingsPanel() {
  return (
    <div>
      <h3 className="cp-form-section-title" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '4px' }}>Notification Settings</h3>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--pf-text-3)' }}>Choose which alerts you'd like to receive by email.</p>
      <div className="pf-alert-info" style={{ marginBottom: 0 }}>
        <span aria-hidden="true">ⓘ</span>
        Notification preferences aren't wired up yet — there's no backend support for this section currently.
      </div>
    </div>
  );
}

function PwInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-text-3)', fontSize: '13px', pointerEvents: 'none' }}>🔒</span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="pf-input"
        style={{ padding: '11px 42px 11px 36px' }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--pf-text-3)', fontSize: '13px', padding: '5px', borderRadius: '7px' }}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default ClientSettings;
