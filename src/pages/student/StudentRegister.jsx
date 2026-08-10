import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import BackToWebsite from "../../components/BackToWebsite";
import PasswordStrength from "../../components/PasswordStrength";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBook, 
  FiAward, 
  FiBriefcase, 
  FiAlertCircle, 
  FiCheck, 
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiChevronRight
} from 'react-icons/fi';

function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', college: '', branch: '', year: '',
    experience_level: 'Fresher', years_of_experience: '',
  });
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false); // For premium initial page load effect
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Trigger page load animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.experience_level === 'Experienced' && !String(form.years_of_experience).trim()) {
      setError('Please enter your years of experience.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await studentAxios.post('/student/register', {
        name: form.name, email: form.email, password: form.password, college: form.college, branch: form.branch,
        experience_level: form.experience_level,
        years_of_experience: form.experience_level === 'Experienced' ? form.years_of_experience : 0,
      });
      navigate('/student/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Ultra-Premium Animations & Custom Loaders */}
      <style>{`
        /* Staggered Page Load Animations */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatEffect {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes expandDown {
          from { max-height: 0; opacity: 0; transform: translateY(-10px); }
          to { max-height: 100px; opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-stagger-1 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-stagger-2 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-stagger-3 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-stagger-4 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-stagger-5 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        .animate-float { animation: floatEffect 6s ease-in-out infinite; }
        .animate-expand { animation: expandDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* Concentric Circular Loader for Button */
        .ultra-loader {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .ultra-loader-ring {
          position: absolute;
          border-radius: 50%;
          border: 2.5px solid transparent;
        }
        .ultra-loader-ring:nth-child(1) {
          inset: 0;
          border-top-color: #ffffff;
          border-left-color: #ffffff;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .ultra-loader-ring:nth-child(2) {
          inset: 4px;
          border-bottom-color: rgba(255, 255, 255, 0.6);
          border-right-color: rgba(255, 255, 255, 0.6);
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Checkbox Spring Animation */
        @keyframes checkSpring {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .peer:checked ~ .check-icon {
          animation: checkSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* Shimmer Effect for Button */
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          transition: 0.5s;
        }
        .shimmer-btn:hover::after {
          left: 150%;
        }

        /* Initial Page Loading Overlay */
        .page-loader-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.6s ease-out, visibility 0.6s ease-out;
        }
        .page-loader-overlay.hidden {
          opacity: 0; visibility: hidden;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Initial Page Loading Overlay */}
      <div className={`page-loader-overlay ${pageLoaded ? 'hidden' : ''}`}>
        <div className="flex flex-col items-center gap-4">
          <img src="/images/brand/placify-icon.png" alt="Placify" className="w-12 h-12 object-contain animate-pulse" />
          <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-1/2 animate-[spin_1s_infinite_linear]" style={{ transformOrigin: 'left' }}></div>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex w-full bg-[#F8FAFC] font-sans overflow-hidden">
        
        {/* LEFT PANEL - Branding (Hidden on Mobile, Visible on lg screens) */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-slate-900 border-r border-slate-800 shadow-2xl z-10">
          {/* Animated Immersive Background Elements */}
          <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-700/20 blur-[100px] pointer-events-none" />

          {/* Top Brand Area */}
          <div className="relative z-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-extrabold text-3xl text-white tracking-tight">Placify<span className="text-blue-600">.</span></span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-6">
              Your next career move starts with a <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">single step.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              Join thousands of students connecting with top-tier companies and securing exclusive placement opportunities.
            </p>
          </div>

          {/* Floating Feature Cards */}
          <div className="relative z-10 space-y-5 animate-stagger-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 flex items-start gap-5 shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <FiBriefcase size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-1.5">Premium Placements</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Exclusive access to internships not listed on public job boards.</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 flex items-start gap-5 shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <FiAward size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-1.5">Verified Credentials</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Stand out globally with an institution-backed digital portfolio.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 animate-fade-in mt-10">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              © {new Date().getFullYear()} Placify. All academic rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Registration Form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center relative bg-[#F8FAFC] px-4 sm:px-6 lg:px-10 py-8 overflow-y-auto no-scrollbar">
          
          <div className="absolute top-6 left-6 z-20">
            <BackToWebsite />
          </div>

          <div className="w-full max-w-2xl relative z-10 py-10 lg:py-0">
            
            {/* Form Container */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              
              <div className="text-center mb-10 animate-stagger-1">
                <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                     <img src="/images/brand/placify-icon.png" alt="Placify" className="w-6 h-6 object-contain" />
                   </div>
                   <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Placify<span className="text-blue-600">.</span></span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Create Account</h2>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Please provide your institutional details to get started.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="bg-rose-50 border border-rose-100/80 text-rose-700 text-sm px-6 py-4 rounded-2xl flex items-start gap-3 shadow-sm animate-stagger-1">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0 text-rose-500" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid sm:grid-cols-2 gap-6 animate-stagger-2">
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input
  value={form.name}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[A-Za-z ]*$/.test(value)) {
      update('name')(e);
    }
  }}
  placeholder="John Doe"
  required
  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
/>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="email" value={form.email} onChange={update('email')} placeholder="john@university.edu" required
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Row */}
                <div className="grid sm:grid-cols-2 gap-6 animate-stagger-3">
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} value={form.password} onChange={update('password')} placeholder="Min. 8 characters" minLength={8} required
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
                      />
                      {/* Password Show/Hide Button */}
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
                    <PasswordStrength password={form.password} />
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Repeat password" required
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
                      />
                      {/* Confirm Password Show/Hide Button */}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none', outline: 'none' }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-0 border-0 bg-transparent shadow-none outline-none focus:outline-none focus:ring-0 text-slate-400 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer select-none flex items-center justify-center"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* College - Full Width */}
                <div className="space-y-1.5 group animate-stagger-4">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                    College / Institution <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                   <input
  value={form.college}
  onChange={(e) => {
    const value = e.target.value;

    // Allow letters, numbers, spaces, &, -, . and '
    if (/^[A-Za-z0-9 &'().-]*$/.test(value)) {
      update('college')(e);
    }
  }}
  placeholder="Enter your university name"
  required
  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
/>
                  </div>
                </div>

                {/* Branch & Year Row */}
                <div className="grid sm:grid-cols-2 gap-6 animate-stagger-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Branch<span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                     <input
  value={form.branch}
  onChange={(e) => {
    const value = e.target.value;

    // Allow letters, numbers, spaces, &, -, . and '
    if (/^[A-Za-z0-9 &'().-]*$/.test(value)) {
      update('branch')(e);
    }
  }}
  placeholder="e.g. Computer Science"
  required
  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
/>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Year of Study
                    </label>
                    <div className="relative">
                      <select 
                        value={form.year} onChange={update('year')}
                        className="w-full pl-5 pr-12 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300 appearance-none cursor-pointer"
                      >
                        <option value="">Select year...</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year (Senior)</option>
                      </select>
                      <FiChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                {/* Experience Row */}
                <div className="grid sm:grid-cols-2 gap-6 animate-stagger-5">
                  <div className="space-y-1.5 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                      Experience Level <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={form.experience_level} onChange={update('experience_level')} required
                        className="w-full pl-5 pr-12 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300 appearance-none cursor-pointer"
                      >
                        <option value="Fresher">Fresher (No Experience)</option>
                        <option value="Experienced">Experienced (Internships/Jobs)</option>
                      </select>
                      <FiChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={18} />
                    </div>
                  </div>

                  {form.experience_level === 'Experienced' && (
                    <div className="space-y-1.5 group animate-expand">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1 group-focus-within:text-blue-600 transition-colors">
                        Years of Exp <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" min="0" max="50" step="0.5" value={form.years_of_experience} onChange={update('years_of_experience')} placeholder="e.g. 1.5" required
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
                      />
                    </div>
                  )}
                </div>

                {/* Custom Animated Checkbox */}
                <div className="flex items-start gap-3.5 pt-4 pb-2 animate-stagger-5">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="pf-check"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-snug">
                    I accept the terms and conditions
                    <span className="block text-xs text-slate-500 font-medium mt-1">
                      By clicking, you agree to our Student User Agreement and Privacy Policy.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="shimmer-btn relative w-full py-4 mt-6 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-3 overflow-hidden animate-stagger-5"
                >
                  {loading ? (
                    <>
                      <div className="ultra-loader">
                        <div className="ultra-loader-ring"></div>
                        <div className="ultra-loader-ring"></div>
                      </div>
                      <span className="tracking-wide">Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Create Account</span> <FiArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="pt-6 text-center animate-stagger-5">
                  <p className="text-sm font-bold text-slate-500">
                    Already have an account?{' '}
                    <Link to="/student/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-all ml-1">
                      Log in here &rarr;
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentRegister;