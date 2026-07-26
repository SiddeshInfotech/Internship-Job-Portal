import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useScrolled } from '../../hooks/useScrolled';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/find-jobs', label: 'Jobs' },
  { to: '/for-companies', label: 'Companies' },
  { to: '/for-students', label: 'Students' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const scrolled = useScrolled(40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Permanent scrim: keeps nav text readable against ANY hero content
          behind it (video, gradient, images) before the scroll state kicks
          in. Fades out once the scrolled glass pill takes over. */}
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none transition-opacity duration-500 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div
        className={`relative transition-all duration-500 ${
          scrolled ? 'mx-4 mt-3 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lift border border-white/60' : 'mx-0 mt-0 rounded-none bg-transparent border border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/images/brand/placify-icon.png"
              alt="Placify"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
            <span className={`font-extrabold text-lg tracking-tight ${scrolled ? 'text-[#0F172A]' : 'text-white'}`}>
              Placify
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 relative ml-auto">
            {NAV_LINKS.map((link) => {
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    scrolled ? (isActive ? 'text-[#0F172A]' : 'text-slate-500 hover:text-[#0F172A]') : (isActive ? 'text-white' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-lg -z-10 ${scrolled ? 'bg-slate-100' : 'bg-white/15'}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-3">
            <Link
              to="/student/login"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${scrolled ? 'text-slate-600 hover:text-[#0F172A]' : 'text-white/80 hover:text-white'}`}
            >
              Log in
            </Link>
            <Link
              to="/student/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Get started
            </Link>
          </div>

          <button
            className={`md:hidden text-2xl ${scrolled ? 'text-[#0F172A]' : 'text-white'}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mx-4 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lift overflow-hidden border border-white/60"
          >
            <div className="flex flex-col px-6 py-5 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={link.to} onClick={() => setMobileOpen(false)} className="block py-2.5 text-slate-700 font-semibold">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
                <Link
                  to="/student/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-center text-sm font-bold text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/student/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-center text-sm font-bold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
