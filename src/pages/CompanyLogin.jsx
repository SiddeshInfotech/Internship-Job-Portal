import React, { useState } from "react";
import "./CompanyLogin.css"; 
import { Link, useNavigate } from "react-router-dom";
import clientAxios from "../api/clientAxios";
import BackToWebsite from "../components/BackToWebsite";
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiArrowRight, 
  FiCheckCircle, 
  FiShield, 
  FiBriefcase,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";

function CompanyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // EXACT same logic, perfectly preserved
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
      {/* Custom Animations & Styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-fade-in {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="min-h-screen w-full flex bg-white overflow-hidden selection:bg-blue-600 selection:text-white">
        
        {/* Absolute Back Button */}
        <div className="absolute top-6 left-6 z-50 hover:scale-105 transition-transform duration-300">
          <BackToWebsite />
        </div>

        {/* --- LEFT PANEL (Visuals & Features) - Hidden on Mobile --- */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 flex-col justify-between overflow-hidden">
          {/* Background Ambient Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulseGlow 8s ease-in-out infinite' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulseGlow 8s ease-in-out infinite 4s' }} />

          {/* Top Brand Section */}
          <div className="p-12 z-10 animate-fade-in opacity-0">
            <div className="flex items-center gap-3 mb-16 mt-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <img src="/images/brand/placify-icon.png" alt="Placify" className="w-7 h-7 object-contain drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Placify<span className="text-blue-600">.</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mt-0.5">
                  CONNECT • PREPARE • SUCCEED
                </p>
              </div>
            </div>

            <h2 className="text-4xl leading-tight font-bold text-white mb-6 pr-8">
              Find placement-ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-400">talent, faster.</span>
            </h2>
            <p className="text-lg text-slate-400 pr-12 leading-relaxed">
              Access a curated pool of pre-screened students and streamline your recruitment workflow with our intelligent placement portal.
            </p>
          </div>

          {/* Feature Cards Section */}
          <div className="px-12 pb-12 z-10 flex flex-col gap-4">
            {[
              { icon: FiCheckCircle, title: "Pre-Vetted Candidates", desc: "Verified academic records and skill assessments." },
              { icon: FiBriefcase, title: "Seamless Onboarding", desc: "Quick company registration and job posting tools." },
              { icon: FiShield, title: "Institutional Trust", desc: "Secured by academic partnerships & data protection." }
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:translate-x-1 transition-all duration-300 opacity-0 animate-fade-in delay-${(i + 1) * 100}`}
              >
                <div className="p-2.5 bg-blue-600/20 text-blue-500 rounded-xl mt-0.5">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="px-12 pb-8 z-10 opacity-0 animate-fade-in delay-300">
            <p className="text-xs font-medium text-slate-500 tracking-wider">
              © {new Date().getFullYear()} PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
            </p>
          </div>
        </div>

        {/* --- RIGHT PANEL (Login Form) --- */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-24 h-screen overflow-y-auto hide-scrollbar bg-slate-50 relative">
          
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 opacity-0 animate-fade-in delay-100 relative z-10">
            
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Company Portal</h2>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">Welcome back. Please enter your corporate credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium border border-rose-100 animate-fade-in">
                  <FiAlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Company Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMail size={18} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <Link to="/forgot" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiLock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full pl-11 pr-14 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                  
                  {/* UPGRADED Show/Hide Button */}
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>

                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 pt-1">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)} 
                    className="pf-check sm"
                  />
                </div>
                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                  Remember my session for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2 shadow-lg shadow-slate-900/20"
              >
                {loading ? (
                  <FiLoader className="animate-spin" size={20} />
                ) : (
                  <>
                    Log in to Dashboard 
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6 relative flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 tracking-wider uppercase">
             welcome to placify
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors group"
              >
                Register your company profile
                <span className="group-hover:translate-x-1 transition-transform text-blue-600">&rarr;</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyLogin;