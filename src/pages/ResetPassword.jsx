import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import BackToWebsite from '../components/BackToWebsite';
import { 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft,
  FiLoader
} from 'react-icons/fi';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // UX Enhancements: Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.95); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-fast { animation: floatFast 6s ease-in-out infinite reverse; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white p-4">
        
        {/* Absolute Back Button */}
        <div className="absolute top-6 left-6 z-50 hover:scale-105 transition-transform duration-300">
          <BackToWebsite />
        </div>

        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-float-fast" />

        {/* Form Card */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-10 relative z-10 animate-slide-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-slate-900/20">
              <FiLock size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set a new password</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Must be at least 8 characters long.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3.5 rounded-xl flex items-start gap-3 animate-slide-up">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-bold leading-tight">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3.5 rounded-xl flex items-start gap-3 animate-slide-up">
              <FiCheckCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-bold leading-tight">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-extrabold text-slate-700">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <FiLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-extrabold text-slate-700">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <FiLock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link 
              to="/company/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to sign in
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
