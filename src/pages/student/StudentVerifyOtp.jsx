import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';

function StudentVerifyOtp() {
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
      await studentAxios.post('/student/verify-otp', { email, otp });
      setSuccess('Email verified! You can now sign in.');
      setTimeout(() => navigate('/student/login'), 1500);
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
      await studentAxios.post('/student/resend-otp', { email, purpose: 'registration' });
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans px-6">
      <BackToWebsite />
      <form onSubmit={handleVerify} className="bg-white rounded-2xl shadow-lift border border-slate-100 p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0F172A] mx-auto mb-4 flex items-center justify-center text-white text-2xl">✉️</div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Verify your email</h2>
          <p className="text-sm text-slate-500 mt-1">{email ? <>We sent a code to <b>{email}</b></> : 'Enter the OTP sent to your registered email'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-5">{success}</div>}

        <input
          type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg text-center tracking-[6px] mb-5 outline-none focus:ring-2 focus:ring-[#F59E0B]"
        />

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#F59E0B] text-white font-bold text-sm disabled:opacity-60 mb-3">
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
        <button type="button" onClick={handleResend} disabled={resending} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/student/login" className="text-slate-500">← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default StudentVerifyOtp;
