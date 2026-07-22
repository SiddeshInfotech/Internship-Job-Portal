import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import BackToWebsite from '../components/BackToWebsite';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetToken) {
      setError('This reset link is missing its token. Please use the link from your email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await clientAxios.post('/client/reset-password', {
        token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/company/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <BackToWebsite />
      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', borderRadius: '14px', padding: '40px', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#0b1a30', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px' }}>🔑</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0b1a30' }}>Set a new password</h2>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          required
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#ea580c', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/company/login" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
