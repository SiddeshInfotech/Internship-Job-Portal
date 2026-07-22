import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import BackToWebsite from '../components/BackToWebsite';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosClient.post('/admin/login', { email, password });
      const { token, admin } = response.data;

      // sessionStorage: clears on tab close. Use localStorage instead if you
      // want the session to survive browser restarts (slightly larger XSS
      // exposure — a tradeoff, not done here by default).
      sessionStorage.setItem('admin_token', token);
      sessionStorage.setItem('admin_info', JSON.stringify(admin));

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--pf-font)',
        background:
          'radial-gradient(720px 400px at 80% -10%, rgba(37,99,235,0.08), transparent 60%), radial-gradient(560px 380px at 0% 110%, rgba(245,158,11,0.07), transparent 60%), var(--pf-page)',
      }}
    >
      <BackToWebsite />
      <ThemeToggle floating />
      <form
        onSubmit={handleLogin}
        className="pf-fade-up"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--pf-card)',
          border: '1px solid var(--pf-line)',
          borderRadius: 'var(--pf-r-xl)',
          boxShadow: 'var(--pf-shadow-md)',
          padding: '42px 40px',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box',
        }}
      >
        {/* Signature ember line */}
        <div className="pf-ember-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', borderRadius: 0 }} />

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <BrandLogo size={56} style={{ margin: '0 auto 16px' }} />
          <h2 className="pf-display" style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--pf-text)' }}>
            Placify Admin
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: '13.5px', color: 'var(--pf-text-2)' }}>
            Sign in to the institutional dashboard
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--pf-red-bg)', border: '1px solid var(--pf-red-ln)',
              color: 'var(--pf-red)', padding: '10px 14px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 500, marginBottom: '18px',
            }}
          >
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        <label className="pf-label" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          className="pf-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@placify.com"
          required
          style={{ marginBottom: '18px' }}
        />

        <label className="pf-label" htmlFor="admin-password">Password</label>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            id="admin-password"
            className="pf-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{ paddingRight: '44px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--pf-text-3)', fontSize: '14px', padding: '6px', borderRadius: '8px',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit" disabled={loading} className="pf-btn pf-btn-primary pf-btn-lg" style={{ width: '100%' }}>
          {loading ? (
            <>
              <span className="pf-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.35)' }} />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
