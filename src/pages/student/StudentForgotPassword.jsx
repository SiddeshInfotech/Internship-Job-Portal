import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';

function StudentForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await studentAxios.post('/student/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send recovery email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans px-6">
      <BackToWebsite />
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lift border border-slate-100 p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0F172A] mx-auto mb-4 flex items-center justify-center text-white text-2xl">🔑</div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Reset your password</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your college email to receive a recovery link.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {sent && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-5">If an account exists for that email, recovery instructions have been sent.</div>}

        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@university.edu"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-5 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
        />

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#0F172A] text-white font-bold text-sm disabled:opacity-60">
          {loading ? 'Sending...' : 'Send Recovery Link'}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/student/login" className="text-slate-500">← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default StudentForgotPassword;
