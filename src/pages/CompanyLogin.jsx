import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiTrendingUp, FiShield } from "react-icons/fi";
import clientAxios from "../api/clientAxios";
import BackToWebsite from "../components/BackToWebsite";

function CompanyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // EXACT same backend logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await clientAxios.post('/client/login', { email, password });
      const { token, client } = response.data;

      sessionStorage.setItem('client_token', token);
      sessionStorage.setItem('client_info', JSON.stringify(client));

      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.requires_verification) {
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline styles for custom entrance animations without modifying tailwind.config.js */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="min-h-screen flex bg-slate-50 font-sans relative">
        <div className="absolute top-4 left-4 z-50">
          <BackToWebsite />
        </div>

        {/* ================= LEFT PANEL (Animated & Attractive) ================= */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden text-white flex-col justify-between p-12">
          
          {/* Subtle Background Image Overlay */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop')" }}
          ></div>
          
          {/* Decorative blurred circles */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-16">
              <img src="/images/brand/placify-icon.png" alt="Placify" className="w-10 h-10 object-contain drop-shadow-lg" />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--pf-display)' }}>
                  Placify<span className="text-amber-500">.</span>
                </h1>
                <p className="text-[10px] font-bold tracking-widest text-blue-200">CONNECT • PREPARE • SUCCEED</p>
              </div>
            </div>

            {/* Hero Heading */}
            <div className="mb-12 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-4xl font-bold leading-tight mb-4 text-white drop-shadow-md">
                Find placement-ready talent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">faster.</span>
              </h2>
              <p className="text-blue-100/80 text-lg leading-relaxed">
                Access a curated pool of pre-screened students and streamline your recruitment workflow with our intelligent portal.
              </p>
            </div>

            {/* Animated Feature Cards */}
            <div className="flex flex-col gap-4">
              
              {/* Feature 1 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex-shrink-0 p-3 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 group-hover:bg-amber-500/30 transition-all">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Pre-Vetted Candidates</h3>
                  <p className="text-sm text-blue-100/70">Verified academic records and rigorous skill assessments for every profile.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex-shrink-0 p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
                  <FiTrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Seamless Onboarding</h3>
                  <p className="text-sm text-blue-100/70">Quick company registration, intelligent job matching, and easy posting tools.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div className="flex-shrink-0 p-3 bg-purple-500/20 text-purple-400 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/30 transition-all">
                  <FiShield size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Institutional Trust</h3>
                  <p className="text-sm text-blue-100/70">Secured by strict academic partnerships and enterprise-grade data protection.</p>
                </div>
              </div>

            </div>
          </div>

          <p className="relative z-10 text-xs text-blue-300/50 font-medium tracking-wide animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            © {new Date().getFullYear()} PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
          </p>
        </div>

        {/* ================= RIGHT PANEL (Login Form) ================= */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-10 absolute top-8">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--pf-display)' }}>Placify.</h1>
          </div>

          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Company Portal</h2>
              <p className="text-slate-500 text-sm">Welcome back. Please enter your corporate credentials to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-2 animate-pulse">
                  <FiShield size={16} />
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Company Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Password Input with Standard SVG Eye Toggle Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link to="/forgot" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all pr-12"
                  />
                  {/* Standard SVG Toggle Button */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {showPassword ? (
                      /* Eye Off (Hidden) Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.593c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                      </svg>
                    ) : (
                      /* Eye (Visible) Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 pt-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                  Remember my session for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Log in to Dashboard 
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">NEW TO PLACEMENT?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors group"
              >
                Register your company profile 
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyLogin;