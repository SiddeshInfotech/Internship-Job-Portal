import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';
import { 
  FiLock, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheck
} from 'react-icons/fi';

function StudentResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // New UI states for better UX
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <>
      {/* Premium Animations & Custom Loader */}
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
          animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-success {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Attractive Custom Circular Loader */
        .premium-loader {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#FAFAFA] font-sans px-4 sm:px-6 overflow-hidden">
        
        {/* Subtle SaaS Background Elements */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none -z-10" />

        {/* Back to Website Component (Positioned Top Left) */}
        <div className="absolute top-6 left-6 z-20">
          <BackToWebsite />
        </div>

        <div className="w-full max-w-md relative z-10 animate-entrance">
          <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-600"></div>

            {!success ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-100 mx-auto mb-6 flex items-center justify-center text-blue-600 shadow-sm">
                    <FiLock size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set new password</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    Create a strong, secure password to access your account.
                  </p>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* New Password Input */}
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        placeholder="Min. 8 characters"
                        minLength={8}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg focus:outline-none"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        placeholder="Repeat your password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading || !newPassword || !confirmPassword} 
                    className="w-full py-4 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="premium-loader"></div>
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        Reset Password <FiCheck size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State UI */
              <div className="text-center py-6 animate-success">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-8 border-emerald-50/50 mx-auto mb-6 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle size={36} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Password Updated!</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                  {success}
                </p>
                <div className="flex justify-center">
                   <div className="w-6 h-6 border-2 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Bottom Back Link */}
            {!success && (
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

export default StudentResetPassword;
