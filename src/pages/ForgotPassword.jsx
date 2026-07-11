import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulating API request with an animation delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] font-sans antialiased overflow-hidden">
      
      {/* Injecting CSS Animations directly for easy integration */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
      `}</style>

      {/* LEFT COLUMN: Placify Branding Banner */}
      <div className="hidden lg:flex lg:w-[30%] relative bg-[#1e3a8a] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Overlay Graphic */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3d8b]/90 to-[#111827]/95 z-0" />
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('https://tse3.mm.bing.net/th/id/OIP.Xl6HfAtHKKBTsDO0Lhb2uQHaE7?pid=Api&h=220&P=0')` }} 
        />

        {/* Top Header/Logo - FIXED WITH EXPLICIT WIDTH & HEIGHT */}
        <div className="z-10 flex items-center gap-3 animate-fade-in">
          <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
            <div className="brand">
            <div className="brand-icon">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="placifyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M 20 85 Q 28 65 30 50 L 30 20 L 60 20 C 85 20 95 40 85 60 C 75 75 60 75 45 75 L 35 75 Q 25 80 15 95 Z" fill="url(#placifyGrad)" />
                <circle cx="45" cy="38" r="8" fill="#163362" />
                <path d="M 38 60 L 40 48 C 40 48 45 46 50 48 L 52 60 Z" fill="#163362" />
                <path d="M 38 63 L 65 48 L 60 43 L 75 45 L 70 58 L 65 53 Z" fill="#163362" />
              </svg>
            </div>
            Placify
          </div>

          </div>
          <span className="text-2xl font-bold tracking-wide"></span>
        </div>

        {/* Catchy Headline */}
        <div className="z-10 my-auto max-w-sm animate-fade-in-up delay-1">
          <h1 className="text-4xl font-semibold leading-tight mb-4">
            Don't worry, <br />we've got you covered.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Reset your credentials securely and jump right back into exploring premium placements and top-tier mentorships.
          </p>
        </div>

        {/* Footer info */}
        <div className="z-10 text-[10px] text-slate-400 tracking-wider uppercase animate-fade-in delay-3">
          © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Container */}
      <div className="w-full lg:w-[70%] flex flex-col justify-between items-center p-6 lg:p-12 relative">
        
        {/* Mobile Logo (Visible only on small screens) - FIXED WITH EXPLICIT WIDTH & HEIGHT */}
        <div className="w-full flex lg:hidden justify-center mb-8 animate-fade-in">
          <img 
            src="/placify-icon.png" 
            alt="Placify Logo" 
            /* Added explicit w-16 (64px), h-16 (64px), and shrink-0 */
            className="w-50 h-20 object-contain shrink-0 brightness-0 invert"
          />
        </div>

        <div className="w-full flex-1 flex items-center justify-center">
          
          {/* Main White Card Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 animate-scale-in">
            
            {!isSubmitted ? (
              /* STATE 1: Enter Email Form */
              <form onSubmit={handleSubmit} className="space-y-15">
                <div className="text-center lg:text-left">
                  <h2 className="text-[28px] font-medium text-[#1e3d8b] tracking-tight mb-8">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Enter your registered email address below and we'll send you an activation link to reset your account.
                  </p>
                </div>

                {/* Email input block */}
                <div className="space-y-2 animate-fade-in-up delay-1">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide block">
                   Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1e3d8b] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3d8b] focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Animated Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1e3d8b] hover:bg-[#152a66] text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none group mt-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STATE 2: Success Confirmation */
              <div className="text-center py-4 animate-scale-in">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                  <svg className="w-8 h-8 text-emerald-500 animate-fade-in" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-[#1e3d8b] mb-2">Check your email</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  We have sent a secure password recovery link to <strong className="text-slate-700 font-semibold">{email}</strong>. Please check your inbox or spam folder.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors"
                >
                  Resend email link
                </button>
              </div>
            )}

            {/* Bottom Alternative Action Navigation */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
              <span className="text-slate-500">Remember your password? </span>
              <a 
                href="/login" 
                className="text-[#d97706] hover:text-[#b45309] font-medium transition-colors inline-flex items-center gap-1 hover:underline decoration-2"
              >
                Log in
              </a>
            </div>

          </div>
        </div>

        {/* Global Bottom Mini Footer Links */}
        <div className="flex gap-6 text-xs text-slate-400 font-medium tracking-wider uppercase animate-fade-in delay-2">
          <a href="#help" className="hover:text-slate-600 transition-colors">Help Center</a>
          <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-slate-600 transition-colors">Terms</a>
        </div>
      </div>

    </div>
  );
}