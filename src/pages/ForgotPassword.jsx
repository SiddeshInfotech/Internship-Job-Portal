import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';

function strength(pw) {
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#10b981'];

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ c: false, n: false, cf: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const score = strength(next);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (next.length < 10) {
      setError('New password must be at least 10 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/admin/change-password', {
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      setSuccess('Password updated successfully.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Premium Staggered Animations */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatEffect {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        
        .animate-stagger-1 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-stagger-2 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-stagger-3 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-stagger-4 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        
        .floating-icon {
          animation: floatEffect 4s ease-in-out infinite;
        }

        /* Ultra Premium Concentric Circular Loader */
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
      `}</style>

      <main className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
        {/* Immersive Background Effects */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

        <TopNavbar title="Security Settings" />

        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden relative animate-stagger-1">
            
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 opacity-90"></div>

            <div className="p-8 sm:p-12">
              
              {/* Header Section */}
              <div className="flex flex-col items-center text-center gap-4 mb-10">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-100 flex items-center justify-center text-4xl shadow-sm flex-shrink-0 floating-icon" style={{ animationDelay: '0.2s' }}>
                  🛡️
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Update Password</h3>
                  <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                    Ensure your account stays secure by choosing a strong, unique password.
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="bg-rose-50 border border-rose-100/80 text-rose-700 text-sm px-6 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-stagger-1" style={{ animationDuration: '0.4s' }}>
                  <span aria-hidden="true" className="text-xl leading-none mt-0.5">⚠</span>
                  <p className="font-semibold leading-relaxed">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 border border-emerald-100/80 text-emerald-700 text-sm px-6 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-stagger-1" style={{ animationDuration: '0.4s' }}>
                  <span aria-hidden="true" className="text-xl leading-none mt-0.5">✓</span>
                  <p className="font-semibold leading-relaxed">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* Current Password */}
                <div className="space-y-2.5 animate-stagger-2">
                  <FieldLabel>Current Password</FieldLabel>
                  <PasswordInput 
                    value={current} 
                    onChange={setCurrent} 
                    show={show.c} 
                    toggle={() => setShow((s) => ({ ...s, c: !s.c }))} 
                    placeholder="Enter existing password" 
                  />
                </div>

                {/* Elegant Divider */}
                <div className="flex items-center justify-center gap-4 animate-stagger-2 opacity-50">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  <span className="text-slate-300 text-xs">✨</span>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                </div>

                {/* New Password */}
                <div className="space-y-2.5 animate-stagger-3">
                  <div className="flex justify-between items-end">
                    <FieldLabel>New Password</FieldLabel>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                      Min 10 Characters
                    </span>
                  </div>
                  <PasswordInput 
                    value={next} 
                    onChange={setNext} 
                    show={show.n} 
                    toggle={() => setShow((s) => ({ ...s, n: !s.n }))} 
                    placeholder="Create a strong password" 
                  />
                  
                  {/* Dynamic Glowing Strength Meter */}
                  <div className={`transition-all duration-500 overflow-hidden ${next.length > 0 ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Score</span>
                        <span className="text-[12px] font-extrabold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5" style={{ color: STRENGTH_COLORS[score] }}>
                          {STRENGTH_LABELS[score]}
                        </span>
                      </div>
                      <div className="flex gap-2 h-2.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            className="flex-1 rounded-full transition-all duration-500 ease-out" 
                            style={{ 
                              background: i < score ? STRENGTH_COLORS[score] : '#e2e8f0',
                              boxShadow: i < score ? `0 0 12px ${STRENGTH_COLORS[score]}60` : 'none',
                              transform: i < score ? 'scaleY(1.1)' : 'scaleY(1)'
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2.5 animate-stagger-4">
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <PasswordInput 
                    value={confirm} 
                    onChange={setConfirm} 
                    show={show.cf} 
                    toggle={() => setShow((s) => ({ ...s, cf: !s.cf }))} 
                    placeholder="Verify new password" 
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading || !current || !next || !confirm} 
                  className="shimmer-btn relative w-full py-4 mt-8 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.4)] hover:-translate-y-1 disabled:opacity-60 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-3 overflow-hidden"
                >
                  {loading ? (
                    <>
                      <div className="ultra-loader">
                        <div className="ultra-loader-ring"></div>
                        <div className="ultra-loader-ring"></div>
                      </div>
                      <span className="tracking-wide">Encrypting & Updating...</span>
                    </>
                  ) : (
                    <span className="tracking-wide">Confirm Password Change</span>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Bottom Tip Box */}
          <div className="mt-8 text-center animate-stagger-4" style={{ animationDelay: '0.6s' }}>
            <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
              <span aria-hidden="true" className="text-base">ℹ️</span> 
              Never share your institutional password with anyone.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block ml-1">
      {children}
    </label>
  );
}

function PasswordInput({ value, onChange, show, toggle, placeholder }) {
  return (
    <div className="relative group">
      {/* Kept original emoji exact constraint */}
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors opacity-80" style={{ fontSize: '16px' }}>
        🔒
      </span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50/50 border-2 border-slate-200/60 text-[15px] font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300"
      />
      <button 
        type="button" 
        onClick={toggle} 
        aria-label={show ? 'Hide password' : 'Show password'} 
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl focus:outline-none opacity-80"
        style={{ fontSize: '18px' }}
      >
        {/* Kept original emoji exact constraint */}
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

export default ChangePassword;