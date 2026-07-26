import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import BackToWebsite from '../../components/BackToWebsite';
import { 
  FiMail, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft,
  FiShield,
  FiRefreshCw,
  FiCheck
} from 'react-icons/fi';

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

  // Purely UI logic to determine which success state to show without changing state management
  const isVerifySuccess = success.includes('verified');
  const isResendSuccess = success.includes('sent');

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
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .premium-loader-dark {
          border-color: rgba(79, 70, 229, 0.2);
          border-top-color: #4f46e5;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#FAFAFA] font-sans px-4 sm:px-6 overflow-hidden">
        
        {/* Subtle SaaS Background Elements */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none -z-10" />

        {/* Back to Website Component */}
        <div className="absolute top-6 left-6 z-20">
          <BackToWebsite />
        </div>

        <div className="w-full max-w-md relative z-10 animate-entrance">
          <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

            {!isVerifySuccess ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 mx-auto mb-6 flex items-center justify-center text-indigo-600 shadow-sm">
                    <FiShield size={28} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify your email</h2>
                  <p className="text-sm font-medium text-slate-500 mt-3 leading-relaxed">
                    {email ? (
                      <>We sent a 6-digit code to <br/><span className="inline-block mt-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{email}</span></>
                    ) : (
                      'Enter the OTP sent to your registered email'
                    )}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Resend Success Banner */}
                {isResendSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
                    <FiCheckCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{success}</p>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                  
                  {/* OTP Input */}
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block text-center group-focus-within:text-indigo-600 transition-colors">
                      Verification Code
                    </label>
                    <input
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="••••••" 
                      maxLength={6} 
                      required
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200/80 text-2xl font-bold font-mono text-slate-800 tracking-[0.5em] text-center outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Verify Button */}
                    <button 
                      type="submit" 
                      disabled={loading || otp.length < 6} 
                      className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="premium-loader"></div>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          Verify & Continue <FiCheck size={18} />
                        </>
                      )}
                    </button>

                    {/* Resend Button */}
                    <button 
                      type="button" 
                      onClick={handleResend} 
                      disabled={resending} 
                      className="w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {resending ? (
                        <>
                          <div className="premium-loader premium-loader-dark"></div>
                          <span>Sending New Code...</span>
                        </>
                      ) : (
                        <>
                          <FiRefreshCw size={16} /> Resend Code
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Highly Attractive Full-Card Success State */
              <div className="text-center py-8 animate-success">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  {/* Outer animated rings */}
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
                  <div className="absolute inset-2 rounded-full bg-emerald-200 animate-pulse"></div>
                  {/* Center icon */}
                  <div className="relative w-full h-full rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20">
                    <FiCheckCircle size={44} strokeWidth={2.5} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Email Verified!</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                  Your identity has been confirmed. We are securely redirecting you to the portal.
                </p>
                <div className="flex justify-center">
                   <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Bottom Back Link (Hidden during Success State) */}
            {!isVerifySuccess && (
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link 
                  to="/student/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
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

export default StudentVerifyOtp;