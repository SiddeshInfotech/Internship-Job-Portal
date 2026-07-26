import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 404 on brand: the runway breaks — this route flew off the flight path.
function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>Page Not Found — Placify</title></Helmet>
      <section className="min-h-screen flex items-center justify-center px-6 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <div className="relative text-center max-w-md">
          <motion.svg
            width="300" height="170" viewBox="0 0 300 170" className="mx-auto mb-6 overflow-visible"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <defs>
              <linearGradient id="nf-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* runway that breaks mid-flight */}
            <motion.path
              d="M 10 140 C 70 135, 110 115, 145 88"
              fill="none" stroke="url(#nf-grad)" strokeWidth="3.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}
            />
            <path d="M 158 78 C 200 48, 250 28, 290 15" fill="none" stroke="rgba(157,178,201,0.28)" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
            <motion.circle
              cx="150" cy="83" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="2.5"
              animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <text x="150" y="155" textAnchor="middle" fontSize="52" fontWeight="800" fill="#ffffff" fontFamily="Sora, Inter, sans-serif" letterSpacing="-0.03em">
              404
            </text>
          </motion.svg>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            This route flew off the <span className="font-serif-accent font-normal text-[#F59E0B]">runway.</span>
          </h1>
          <p className="text-slate-400 mb-9">The page you're looking for doesn't exist or may have moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold shadow-lift"
            >
              Back to home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/find-jobs')}
              className="px-8 py-3.5 rounded-2xl bg-white/[0.08] border border-white/25 text-white font-bold hover:bg-white/[0.14] transition-colors"
            >
              Browse jobs instead
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
