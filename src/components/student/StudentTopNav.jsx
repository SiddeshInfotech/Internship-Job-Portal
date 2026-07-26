import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBriefcase, 
  FiFileText,
  FiChevronDown
} from 'react-icons/fi';

function StudentTopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  let student = { name: 'Student' };
  try {
    const stored = sessionStorage.getItem('student_info');
    if (stored) student = JSON.parse(stored);
  } catch { /* ignore malformed storage */ }

  const handleLogout = () => {
    sessionStorage.removeItem('student_token');
    sessionStorage.removeItem('student_info');
    navigate('/student/login');
  };

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Premium desktop nav link styling with smooth transitions
  const desktopNavLinkClass = ({ isActive }) =>
    `relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out flex items-center gap-2 hover:scale-105 active:scale-95 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-700 dark:text-indigo-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] border border-indigo-100 dark:border-indigo-800/50'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 border border-transparent'
    }`;

  // Mobile nav link styling
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 active:scale-[0.98] ${
      isActive
        ? 'bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  return (
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes profileFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateY(-10px); }
          70% { transform: scale(1.02) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .hover-float:hover {
          animation: profileFloat 2s ease-in-out infinite;
        }
      `}</style>

      <header className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand & Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to="/student/browse-jobs" className="flex items-center gap-3 group active:scale-95 transition-transform duration-300">
                <div className="relative w-10 h-10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center group-hover:shadow-indigo-500/20 group-hover:shadow-lg group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-all duration-500 group-hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <img
                    src="/images/brand/placify-icon.png"
                    alt="Placify"
                    className="w-6 h-6 object-contain relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  Placify<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">.</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-3 ml-6">
                <NavLink to="/student/browse-jobs" className={desktopNavLinkClass}>
                  <FiBriefcase size={18} className="drop-shadow-sm" /> Browse Jobs
                </NavLink>
                <NavLink to="/student/applications" className={desktopNavLinkClass}>
                  <FiFileText size={18} className="drop-shadow-sm" /> My Applications
                </NavLink>
              </nav>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Utility Icons */}
              <div className="flex items-center gap-2 sm:gap-3 border-r border-slate-200/80 dark:border-slate-800 pr-4 sm:pr-6">
                <div className="hover:scale-110 active:scale-95 transition-transform duration-300">
                  <ThemeToggle />
                </div>
                <div className="hover:scale-110 active:scale-95 transition-transform duration-300">
                  <NotificationBell 
                    axiosInstance={studentAxios} 
                    rolePrefix="student" 
                    onViewAll={() => navigate('/student/notifications')} 
                  />
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
                >
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-sm flex items-center justify-center font-extrabold text-white text-sm group-hover:shadow-md group-hover:ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 transition-all duration-300 z-10 hover-float">
                    {student.profile_photo ? (
                      <img src={student.profile_photo} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" />
                    ) : (
                      <span className="drop-shadow-md">{(student.name || 'S').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start justify-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {student.name || 'Student'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                      Student
                    </span>
                  </div>
                  <FiChevronDown className={`text-slate-400 dark:text-slate-500 transition-transform duration-500 hidden sm:block ${isProfileOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} size={16} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100/80 dark:border-slate-800 p-2 z-50 animate-pop-in origin-top-right">
                    <div className="px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{student.name}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{student.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Link to="/student/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200 group">
                        <FiUser size={16} className="group-hover:scale-110 transition-transform" /> My Profile
                      </Link>
                      <Link to="/student/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200 group">
                        <FiSettings size={16} className="group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300" /> Account Settings
                      </Link>
                    </div>
                    
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                    
                    <div>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200 text-left group"
                      >
                        <FiLogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-300 focus:outline-none active:scale-90"
              >
                <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
                  {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'max-h-80 opacity-100 border-t' : 'max-h-0 opacity-0 border-t-0'}`}>
          <nav className="flex flex-col p-4 space-y-2">
            <NavLink to="/student/browse-jobs" className={mobileNavLinkClass}>
              <FiBriefcase size={20} className="drop-shadow-sm" /> Browse Jobs
            </NavLink>
            <NavLink to="/student/applications" className={mobileNavLinkClass}>
              <FiFileText size={20} className="drop-shadow-sm" /> My Applications
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}

export default StudentTopNav;