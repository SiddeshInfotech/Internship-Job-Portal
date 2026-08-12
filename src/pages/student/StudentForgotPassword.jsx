import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';
import PasswordStrength from '../../components/PasswordStrength';
import { FiKey, FiMail, FiLock, FiShield, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function StudentForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: 6-Digit OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send 6-Digit OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await studentAxios.post('/student/forgot-password', { email });
      if (res.data.dev_otp) setDevOtp(res.data.dev_otp);
      setMessage(res.data.message || 'A 6-digit OTP code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP to this email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await studentAxios.post('/student/verify-reset-otp', { email, otp });
      setMessage('OTP verified! Please set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await studentAxios.post('/student/reset-password', {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-success {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#FAFAFA] font-sans px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none -z-10" />

        <div className="absolute top-6 left-6 z-20">
          <BackToWebsite />
        </div>

        <div className="w-full max-w-md relative z-10 animate-entrance">
          <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
                <FiAlertCircle className="mt-0.5 flex-shrink-0 text-rose-500" size={18} />
                <p className="font-semibold text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* STEP 1: ENTER EMAIL */}
            {step === 1 && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 mx-auto mb-6 flex items-center justify-center text-blue-600 shadow-sm">
                    <FiKey size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    Enter your email address and we'll send a 6-digit OTP code to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="student@domain.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !email} 
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      'Send 6-Digit OTP'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: ENTER 6-DIGIT OTP */}
            {step === 2 && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 mx-auto mb-6 flex items-center justify-center text-indigo-600 shadow-sm">
                    <FiShield size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enter 6-Digit OTP</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    We sent a 6-digit OTP code to <span className="font-bold text-slate-700">{email}</span>.
                  </p>
                  {devOtp && (
                    <div className="mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 inline-block">
                      Demo OTP Code: {devOtp}
                    </div>
                  )}
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <input
                        type="text" 
                        maxLength={6}
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                        required 
                        placeholder="123456"
                        className="w-full tracking-[0.5em] text-center py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xl font-extrabold text-slate-900 placeholder-slate-300 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6} 
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Resend OTP Code
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 3: SET NEW PASSWORD */}
            {step === 3 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 mx-auto mb-6 flex items-center justify-center text-emerald-600 shadow-sm">
                    <FiLock size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set New Password</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    Create a strong new password for your student account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600"
                      />
                    </div>
                    <PasswordStrength password={newPassword} />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !newPassword || !confirmPassword} 
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 4: SUCCESS STATE */}
            {step === 4 && (
              <div className="text-center py-4 animate-success">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-8 border-emerald-50/50 mx-auto mb-6 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle size={36} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Password Reset Complete!</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
                <Link 
                  to="/student/login" 
                  className="w-full inline-flex items-center justify-center py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-md"
                >
                  Return to Student Login
                </Link>
              </div>
            )}

            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link 
                  to="/student/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
                >
                  <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
                  Back to sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentForgotPassword;