import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

function ClientSettings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('password');

  return (
    <main className="modern-settings-page">
      {/* 
        INJECTED STYLES FOR ENHANCED UI & ANIMATIONS
        This ensures the page looks beautiful and animated without altering your external CSS.
      */}
      <style>{`
        .modern-settings-page {
          --st-primary: #3b82f6;
          --st-primary-hover: #2563eb;
          --st-primary-soft: #eff6ff;
          --st-bg: #f8fafc;
          --st-surface: #ffffff;
          --st-text-main: #0f172a;
          --st-text-muted: #64748b;
          --st-border: #e2e8f0;
          --st-error: #ef4444;
          --st-error-bg: #fef2f2;
          --st-success: #10b981;
          --st-success-bg: #ecfdf5;
          --st-radius: 16px;
          --st-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          
          padding: 24px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: var(--st-bg);
          min-height: 100vh;
        }

        /* Animations */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .st-header {
          margin-bottom: 30px;
          animation: slideInLeft 0.5s ease-out;
        }
        .st-header h1 {
          font-size: 2rem;
          color: var(--st-text-main);
          margin: 0 0 8px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .st-header p {
          color: var(--st-text-muted);
          margin: 0;
          font-size: 1.05rem;
        }

        .st-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .st-layout { grid-template-columns: 1fr; }
        }

        /* Sidebar Tabs */
        .st-sidebar {
          background: var(--st-surface);
          padding: 12px;
          border-radius: var(--st-radius);
          box-shadow: var(--st-shadow);
          border: 1px solid var(--st-border);
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeSlideUp 0.6s ease-out;
        }

        .st-tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          color: var(--st-text-muted);
        }
        .st-tab-btn:hover:not(.active) {
          background: var(--st-primary-soft);
          color: var(--st-primary);
          transform: translateX(4px);
        }
        .st-tab-btn.active {
          background: var(--st-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .st-tab-btn svg {
          width: 20px; height: 20px;
          transition: transform 0.3s ease;
        }
        .st-tab-btn.active svg {
          transform: scale(1.15);
        }

        /* Main Content Panel */
        .st-panel-container {
          background: var(--st-surface);
          padding: 35px;
          border-radius: var(--st-radius);
          box-shadow: var(--st-shadow);
          border: 1px solid var(--st-border);
          min-height: 400px;
        }
        
        .animated-panel {
          animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Form Styles */
        .st-form-title {
          font-size: 1.5rem;
          color: var(--st-text-main);
          margin: 0 0 8px 0;
        }
        .st-form-subtitle {
          color: var(--st-text-muted);
          font-size: 0.95rem;
          margin-bottom: 25px;
        }

        .st-field {
          margin-bottom: 20px;
          animation: fadeSlideUp 0.5s ease-out backwards;
        }
        .st-field:nth-child(1) { animation-delay: 0.1s; }
        .st-field:nth-child(2) { animation-delay: 0.2s; }
        .st-field:nth-child(3) { animation-delay: 0.3s; }

        .st-label {
          display: block;
          font-weight: 600;
          color: var(--st-text-main);
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        
        .st-input-wrapper {
          position: relative;
          transition: transform 0.2s ease;
        }
        .st-input-wrapper:focus-within {
          transform: translateY(-2px);
        }
        
        .st-input {
          width: 100%;
          padding: 12px 40px 12px 42px;
          border: 1px solid var(--st-border);
          border-radius: 10px;
          font-size: 0.95rem;
          color: var(--st-text-main);
          background: var(--st-bg);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .st-input:focus {
          outline: none;
          border-color: var(--st-primary);
          background: var(--st-surface);
          box-shadow: 0 0 0 4px var(--st-primary-soft);
        }

        /* Buttons */
        .st-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
          animation: fadeIn 0.8s ease-out backwards;
          animation-delay: 0.4s;
        }
        .st-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .st-btn-primary {
          background: var(--st-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .st-btn-primary:hover:not(:disabled) {
          background: var(--st-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
        }
        .st-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .st-btn-ghost {
          background: transparent;
          color: var(--st-text-muted);
          border: 1px solid var(--st-border);
        }
        .st-btn-ghost:hover {
          background: var(--st-bg);
          color: var(--st-text-main);
        }

        /* Alerts */
        .st-alert {
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          animation: fadeSlideUp 0.3s ease-out;
        }
        .st-alert-error {
          background: var(--st-error-bg);
          color: var(--st-error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .st-alert-success {
          background: var(--st-success-bg);
          color: var(--st-success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .st-alert-info {
          background: var(--st-primary-soft);
          color: var(--st-primary);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <ClientTopNavbar title="Settings" />
      
      <div className="st-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences securely.</p>
      </div>

      <div className="st-layout">
        {/* Sidebar */}
        <div className="st-sidebar" role="tablist" aria-label="Settings sections">
          <TabButton 
            active={tab === 'password'} 
            onClick={() => setTab('password')} 
            icon={
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            } 
            label="Change Password" 
          />
          <TabButton 
            active={tab === 'profile'} 
            onClick={() => setTab('profile')} 
            icon={
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            } 
            label="Profile Information" 
          />
          <TabButton 
            active={tab === 'notifications'} 
            onClick={() => setTab('notifications')} 
            icon={
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            } 
            label="Notifications" 
          />
        </div>

        {/* Dynamic Content Area (Uses key={tab} to force re-mounting and trigger animation) */}
        <div className="st-panel-container">
          <div key={tab} className="animated-panel">
            {tab === 'password' && <ChangePasswordPanel />}
            {tab === 'profile' && <ProfileInfoPanel onGoToProfile={() => navigate('/company-profile')} />}
            {tab === 'notifications' && <NotificationSettingsPanel />}
          </div>
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
      className={`st-tab-btn ${active ? 'active' : ''}`}
    >
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> 
      {label}
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

  // LOGIC REMAINS EXACTLY THE SAME
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '480px' }}>
      <h3 className="st-form-title">Change Password</h3>
      <p className="st-form-subtitle">Update your password regularly to keep your account secure.</p>

      {error && (
        <div className="st-alert st-alert-error" role="alert">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="st-alert st-alert-success" role="status">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {success}
        </div>
      )}

      <div className="st-field">
        <label className="st-label">Old Password</label>
        <PwInput value={current} onChange={setCurrent} placeholder="Enter your old password" />
      </div>

      <div className="st-field">
        <label className="st-label">New Password</label>
        <PwInput value={next} onChange={setNext} placeholder="Enter your new password" />
        <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--st-text-muted)' }}>
          Use at least 8 characters with a mix of letters, numbers and symbols.
        </p>
      </div>

      <div className="st-field">
        <label className="st-label">Confirm Password</label>
        <PwInput value={confirm} onChange={setConfirm} placeholder="Confirm your new password" />
      </div>

      <div className="st-actions">
        <button
          type="button"
          className="st-btn st-btn-ghost"
          onClick={() => { setCurrent(''); setNext(''); setConfirm(''); setError(''); setSuccess(''); }}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="st-btn st-btn-primary">
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" opacity="0.3"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Updating...
            </span>
          ) : 'Update Password'}
        </button>
      </div>
    </form>
  );
}

function ProfileInfoPanel({ onGoToProfile }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ 
        width: '80px', height: '80px', background: 'var(--st-primary-soft)', 
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        margin: '0 auto 20px', color: 'var(--st-primary)'
      }}>
        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h5"></path></svg>
      </div>
      <h3 className="st-form-title">Profile Information</h3>
      <p className="st-form-subtitle" style={{ maxWidth: '400px', margin: '0 auto 30px' }}>
        Your company details, HR contacts, and hiring preferences are managed centrally on your Company Profile page.
      </p>
      <button onClick={onGoToProfile} className="st-btn st-btn-primary">
        Go to Company Profile →
      </button>
    </div>
  );
}

function NotificationSettingsPanel() {
  return (
    <div>
      <h3 className="st-form-title">Notification Settings</h3>
      <p className="st-form-subtitle">Choose which alerts you'd like to receive by email.</p>
      
      <div className="st-alert st-alert-info">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span><strong>Coming Soon!</strong> Notification preferences aren't wired up yet. Check back later.</span>
      </div>

      {/* Decorative mockup to make it look full */}
      <div style={{ opacity: 0.5, pointerEvents: 'none', marginTop: '30px' }}>
        {['Email me when a student applies', 'Weekly digest of new candidates', 'Marketing and platform updates'].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', borderBottom: '1px solid var(--st-border)' }}>
            <div style={{ width: '40px', height: '24px', background: 'var(--st-border)', borderRadius: '12px', position: 'relative' }}>
              <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
            </div>
            <span style={{ fontSize: '0.95rem', color: 'var(--st-text-main)' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PwInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="st-input-wrapper">
      <span aria-hidden="true" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--st-text-muted)', display: 'flex' }}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </span>
      
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="st-input"
      />
      
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{ 
          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', 
          border: 'none', background: 'var(--st-bg)', cursor: 'pointer', color: 'var(--st-text-muted)', 
          padding: '6px', borderRadius: '8px', display: 'flex', transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--st-primary)'; e.currentTarget.style.background = 'var(--st-primary-soft)'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--st-text-muted)'; e.currentTarget.style.background = 'var(--st-bg)'; }}
      >
        {show ? (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.593c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"></path></svg>
        ) : (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        )}
      </button>
    </div>
  );
}

export default ClientSettings;