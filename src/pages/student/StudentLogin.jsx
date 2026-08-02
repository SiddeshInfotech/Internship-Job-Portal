import React, { useState } from "react";
import "../CompanyLogin.css"; 
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import studentAxios from "../../api/studentAxios";
import BackToWebsite from "../../components/BackToWebsite";
import { 
  FiMail, 
  FiLock, 
  FiAlertCircle, 
  FiArrowRight, 
  FiCheckCircle,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

// FIXED FOR VITE: Replaced process.env with import.meta.env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const routeAfterLogin = (student) => {
    if (!student?.college || !student?.branch) {
      navigate('/student/profile-wizard/1');
    } else {
      navigate('/student/browse-jobs');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await studentAxios.post('/student/google-login', { id_token: credentialResponse.credential });
      sessionStorage.setItem('student_token', res.data.token);
      sessionStorage.setItem('student_info', JSON.stringify(res.data.student));
      routeAfterLogin(res.data.student);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await studentAxios.post('/student/login', { email, password });
      const { token, student } = response.data;

      sessionStorage.setItem('student_token', token);
      sessionStorage.setItem('student_info', JSON.stringify(student));

      routeAfterLogin(student);
    } catch (err) {
      const data = err.response?.data;
      if (data?.requires_verification) {
        navigate('/student/verify-otp', { state: { email } });
      } else {
        setError(data?.message || 'Invalid email or password');
      }
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Premium Circular Loader */
        .premium-loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
        
        {/* LEFT PANEL - Branding (Hidden on Mobile, Visible on lg screens) */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
          <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-blue-700/30 blur-[80px] pointer-events-none" />

          <div className="relative z-10 animate-entrance">
            <div className="flex items-center gap-3 mb-10">
              <img src="/images/brand/placify-icon.png" alt="Placify" className="w-10 h-10 object-contain drop-shadow-lg" />
              <span className="font-extrabold text-2xl text-white tracking-tight">Placify<span className="text-blue-600">.</span></span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Your next internship starts with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">one login.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Connect with top-tier employers, manage your applications, and launch your career — all from your campus hub.
            </p>
          </div>

          <div className="relative z-10 animate-entrance delay-200 animate-float">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-start gap-5 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Join 5,000+ students today</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trusted by students across the country to discover opportunities and launch their professional careers.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 animate-entrance delay-300">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              © {new Date().getFullYear()} Placify. All academic rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Login Form Container */}
        <div className="w-full lg:w-7/12 flex items-center justify-center relative bg-[#FAFAFA] px-4 sm:px-6 py-12">
          
          <div className="absolute top-6 left-6 z-20">
            <BackToWebsite />
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 animate-entrance delay-100">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                   <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
                   <span className="font-extrabold text-xl text-slate-900 tracking-tight">Placify.</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
                <p className="text-slate-500 font-medium text-sm">Enter your credentials to continue.</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-5">
                
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5 group">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                    Enter Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="e.g. abc@gmail.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-600 transition-colors">
                      Password
                    </label>
                    <Link to="/student/forgot-password" className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ border: 'none', background: 'transparent', boxShadow: 'none', outline: 'none' }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-0 border-0 bg-transparent shadow-none outline-none focus:outline-none focus:ring-0 text-slate-400 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer select-none flex items-center justify-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5 pt-1 pb-2">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      checked={remember} 
                      onChange={(e) => setRemember(e.target.checked)}
                      className="pf-check sm"
                    />
                  </div>
                  <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <div className="premium-loader"></div>
                  ) : (
                    <>
                      Log In <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Dividers */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-[1px] bg-slate-200"></div>
                <span className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Or continue with</span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>

              {/* Google Login Area - Simplified Wrapper */}
              <div className="flex justify-center w-full">
                <div className="relative inline-block w-full max-w-[280px]">
                  <div className="flex justify-center w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google login failed. Please try again.')}
                      text="signin_with"
                      shape="pill"
                      theme="outline"
                      size="large"
                    />
                  </div>
                  {googleLoading && (
                    <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm z-10 border border-slate-200">
                       <div className="w-5 h-5 border-2 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Register Link */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  New to Placify?{' '}
                  <Link to="/student/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                    Register now &rarr;
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Wrap the export directly instead of wrapping the return body 
// to prevent re-rendering when typing in the form fields!
export default function StudentLoginWrapper() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <StudentLogin />
    </GoogleOAuthProvider>
  );
}