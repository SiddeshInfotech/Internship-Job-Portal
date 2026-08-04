import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';
import { FiKey, FiMail, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
    <>
      {/* Premium Animations */}
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

            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-100 mx-auto mb-6 flex items-center justify-center text-blue-600 shadow-sm">
                    <FiKey size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset password</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="xyz@gmail.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !email} 
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      'Send Recovery Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State UI */
              <div className="text-center py-4 animate-success">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-8 border-emerald-50/50 mx-auto mb-6 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle size={36} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Check your inbox</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                  If an account exists for <span className="font-bold text-slate-700">{email}</span>, an email with a reset link has been sent.
                </p>
                <Link 
                  to="/student/login" 
                  className="w-full inline-flex items-center justify-center py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all shadow-sm hover:border-slate-300"
                >
                  Return to Login
                </Link>
              </div>
            )}

            {/* Bottom Back Link (Hidden in Success State for cleaner UX) */}
            {!sent && (
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
