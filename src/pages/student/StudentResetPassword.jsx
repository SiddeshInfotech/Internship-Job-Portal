import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';

function StudentResetPassword() {
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
    if (!resetToken) { setError('This reset link is missing its token.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await studentAxios.post('/student/reset-password', {
        token: resetToken, new_password: newPassword, confirm_password: confirmPassword,
      });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/student/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans px-6">
      <BackToWebsite />
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lift border border-slate-100 p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0F172A] mx-auto mb-4 flex items-center justify-center text-white text-2xl">🔒</div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Set a new password</h2>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-5">{success}</div>}

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-4 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm" />

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-6 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm" />

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#F59E0B] text-white font-bold text-sm disabled:opacity-60">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/student/login" className="text-slate-500">← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default StudentResetPassword;
