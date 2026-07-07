import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect scroll to trigger the sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dynamically set the Favicon browser tab icon
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/placify-icon.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-x-hidden relative bg-white">
      
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleSlow {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes smoothPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.05); opacity: 0.35; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatRotate {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(29, 78, 216, 0.4), 0 0 40px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 30px rgba(29, 78, 216, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounceInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(29, 78, 216, 0); }
          100% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0); }
        }
        
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-right { animation: slideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bg-zoom { animation: scaleSlow 20s linear infinite alternate; }
        .animate-pulse-glow { animation: smoothPulse 4s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-rotate { animation: floatRotate 8s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-flow-gradient { animation: flowGradient 6s ease infinite; }
        .animate-bounce-in-up { animation: bounceInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-rotate-slow { animation: rotateSlow 20s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s infinite; }
        
        /* Staggered Delays */
        .delay-100 { animation-delay: 100ms; opacity: 0; }
        .delay-200 { animation-delay: 200ms; opacity: 0; }
        .delay-300 { animation-delay: 300ms; opacity: 0; }
        .delay-400 { animation-delay: 400ms; opacity: 0; }
        .delay-500 { animation-delay: 500ms; opacity: 0; }
        .delay-600 { animation-delay: 600ms; opacity: 0; }
        .delay-700 { animation-delay: 700ms; opacity: 0; }

        /* Gradient Animation */
        .gradient-flow {
          background: linear-gradient(-45deg, #1d4ed8, #0d52ff, #3b82f6, #1d4ed8);
          background-size: 400% 400%;
          animation: flowGradient 8s ease infinite;
        }

        /* Shimmer Effect */
        .shimmer-effect {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* --- ANIMATED BACKGROUND WITH MULTIPLE LAYERS --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none h-[100vh]">
        {/* Premium Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[.6] animate-bg-zoom"
          style={{ backgroundImage: `url('https://tse3.mm.bing.net/th/id/OIP.vW4OZFaBXrS-2p1PybwaCgHaEK?pid=Api&h=220&P=0')` }}
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/60 to-blue-50/40" />
        
        {/* Animated Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-blue-200/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-indigo-400/15 to-blue-200/5 rounded-full blur-[120px] animate-float-rotate" style={{animationDelay: '2s'}} />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-[80px] animate-pulse-glow" />
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(29, 78, 216, 0.05) 25%, rgba(29, 78, 216, 0.05) 26%, transparent 27%, transparent 74%, rgba(29, 78, 216, 0.05) 75%, rgba(29, 78, 216, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(29, 78, 216, 0.05) 25%, rgba(29, 78, 216, 0.05) 26%, transparent 27%, transparent 74%, rgba(29, 78, 216, 0.05) 75%, rgba(29, 78, 216, 0.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* --- FIXED HEADER NAVBAR --- */}
      <header 
        className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-2xl shadow-lg border-b border-slate-200/60 py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO WITH ANIMATION */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/placify-icon.png" 
              alt="Placify Logo" 
              className="h-30 md:h-25 w-auto object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-lg"
            />
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <Link 
              to="/login" 
              className="px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 hover:shadow-md active:scale-[0.98] transition-all duration-300"
            >
              Student Login
            </Link>
            <Link
              to="/company-login"
              className="hidden sm:block px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 hover:shadow-md active:scale-[0.98] transition-all duration-300"
            >
              Company Login
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col">
        
        {/* --- HERO SECTION WITH ENHANCED ANIMATIONS --- */}
        <section className="pt-44 pb-16 max-w-7xl mx-auto px-6 text-center w-full min-h-[65vh] flex flex-col justify-center">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center justify-center animate-bounce-in-up">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200/80 backdrop-blur-md shadow-lg shadow-blue-500/10 tracking-wide hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-default animate-pulse-ring">
                ✨ The #1 Career Platform for Higher Ed
              </span>
            </div>

            {/* Main Heading with Gradient */}
            <h1 className="text-5xl lg:text-7xl font-serif tracking-tight text-slate-900 font-normal leading-[1.15] animate-fade-up delay-100 relative">
              <span className="inline-block">Your next</span>{' '}
              <span className="inline-block relative">
                <span className="relative z-10">internship</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/40 rounded-full -z-10 animate-pulse"></span>
              </span>
              {' '}<span className="inline-block">starts here.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto animate-fade-up delay-200">
              Discover vetted opportunities, apply with one profile, and track progress — all on a professional platform built for students and elite employers.
            </p>

            {/* CTA Buttons with Glow Effect */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up delay-300">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/50 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 text-center relative overflow-hidden group"
              >
                <span className="relative z-10">I'm a Student</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/company-signup"
                className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 font-semibold text-base rounded-xl border border-slate-200/80 shadow-lg hover:bg-slate-50 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 text-center group"
              >
                <span className="group-hover:text-blue-600 transition-colors duration-300">I'm a Company</span>
              </Link>
            </div>
          </div>
        </section>

        {/* --- ANIMATED STATS CARD --- */}
        <section className="py-12 max-w-7xl mx-auto px-6 w-full animate-fade-up delay-400">
          <div className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-blue-500/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-slate-200 group/card hover:-translate-y-2">
            
            <div className="pt-14 pb-10 px-6 text-center space-y-12">
              <div className="space-y-3 animate-fade-up delay-100">
                <h2 className="text-3xl lg:text-[40px] font-serif font-normal text-slate-900 tracking-tight">
                  Platform Scale
                </h2>
                <p className="text-slate-500 text-sm font-normal">
                  Real-time metrics from our university network.
                </p>
              </div>

              {/* Animated Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 max-w-4xl mx-auto pt-4">
                {[
                  { number: '5,400+', label: 'Internships Posted', color: 'from-blue-500 to-blue-600', delay: 200 },
                  { number: '1,200', label: 'Active Companies', color: 'from-amber-400 to-amber-500', delay: 300 },
                  { number: '92%', label: 'Placement Rate', color: 'from-emerald-500 to-emerald-600', delay: 400 }
                ].map((stat, idx) => (
                  <div key={idx} className={`space-y-2 transform transition-all duration-300 hover:-translate-y-2 animate-bounce-in-up delay-${stat.delay}`}>
                    <div className={`text-4xl lg:text-[48px] font-sans font-bold bg-gradient-to-br ${stat.color} text-transparent bg-clip-text tracking-tight`}>
                      {stat.number}
                    </div>
                    <div className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="px-12">
              <div className="border-t border-dashed border-slate-200/60 w-full" />
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/40 backdrop-blur-sm p-6 md:p-8 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 group-hover/card:from-slate-50 group-hover/card:to-blue-50/60">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover/card:scale-110 group-hover/card:shadow-xl transition-all duration-500 animate-float">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p className="text-slate-700 text-sm md:text-base font-medium">
                  Join 45,000+ students already advancing their careers this year.
                </p>
              </div>
              <Link 
                to="/roles"
                className="text-blue-600 text-sm md:text-base font-bold flex items-center gap-2 transition-all duration-300 group/btn hover:text-blue-700 hover:gap-3"
              >
                <span>Explore Open Roles</span>
                <svg className="w-5 h-5 transform transition-all duration-300 group-hover/btn:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>
        </section>

        {/* --- UNIFIED PROFILE SECTION WITH ANIMATIONS --- */}
        <section className="py-20 bg-white/50 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Content */}
              <div className="lg:w-[45%] space-y-8 animate-slide-left delay-200">
                <h2 className="text-4xl lg:text-[48px] font-serif text-slate-900 tracking-tight leading-[1.2]">
                  A unified profile for <br className="hidden lg:block"/> your academic career.
                </h2>
                
                <ul className="space-y-5">
                  {[
                    "Verified transcripts and certifications",
                    "Integrated faculty recommendation tools",
                    "Direct secure messaging with HR teams",
                    "Automated interview scheduling"
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-600 text-base font-normal transform transition-all duration-300 hover:translate-x-2 hover:text-slate-800 group">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link 
                    to="/about"
                    className="inline-flex items-center justify-between gap-3 px-7 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base rounded-[12px] hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 transition-all duration-300 group shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 active:scale-[0.98]"
                  >
                    <span>Learn more about Placify</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Image with Advanced Effects */}
              <div className="lg:w-[55%] w-full animate-slide-right delay-300">
                <div className="relative group/img">
                  {/* Glowing Background */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-75 group-hover/img:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Image Container */}
                  <div className="relative p-3 bg-white/80 backdrop-blur-lg rounded-[2.2rem] shadow-2xl border border-slate-200/60 overflow-hidden">
                    <div className="overflow-hidden rounded-[1.8rem] bg-slate-200 shadow-inner">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                        alt="Platform Dashboard UI Mockup" 
                        className="w-full h-auto object-cover transform scale-100 group-hover/img:scale-[1.05] transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* --- ANIMATED FOOTER --- */}
      <footer className="bg-gradient-to-b from-slate-50/80 to-white/80 backdrop-blur-sm border-t border-slate-200/80 py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="max-w-xs space-y-4">
              
              {/* FOOTER LOGO */}
              <Link to="/" className="inline-block group">
                <img 
                  src="/placify-icon.png" 
                  alt="Placify Logo" 
                  className="h-30 w-50 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                />
              </Link>

              <p className="text-slate-500 text-sm leading-relaxed font-normal">
                Empowering the next generation of professionals through streamlined internship access and institutional-grade career tools.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm font-medium text-slate-500">
              {[
                { label: 'About', path: '/about' },
                { label: 'How it Works', path: '/how-it-works' },
                { label: 'Contact', path: '/contact' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' }
              ].map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path} 
                  className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 group relative"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
            <div>© 2026 Placify. All rights reserved.</div>
            <div className="flex items-center gap-4 select-none">
              <span>Built with Integrity</span>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" />
              <span>Higher-Ed Compliant</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}