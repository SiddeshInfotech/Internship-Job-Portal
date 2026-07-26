import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import BackToWebsite from '../components/BackToWebsite';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await clientAxios.post('/client/verify-otp', { email, otp });
      setSuccess('Email verified! You can now sign in.');
      setTimeout(() => navigate('/company/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await clientAxios.post('/client/resend-otp', { email, purpose: 'registration' });
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <BackToWebsite />
      <form
        onSubmit={handleVerify}
        style={{ background: '#fff', borderRadius: '14px', padding: '40px', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#0b1a30', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px' }}>✉️</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0b1a30' }}>Verify your email</h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            {email ? <>We sent a code to <b>{email}</b></> : 'Enter the OTP sent to your registered email'}
          </p>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Enter OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          maxLength={6}
          required
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '18px', letterSpacing: '4px', textAlign: 'center', marginBottom: '18px', boxSizing: 'border-box' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#ea580c', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/company/login" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default VerifyOtp;
