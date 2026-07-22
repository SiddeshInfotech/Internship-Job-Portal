import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import studentAxios from '../../api/studentAxios';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';

function StudentTopNav() {
  const navigate = useNavigate();

  let student = { name: 'Student' };
  try {
    const stored = sessionStorage.getItem('student_info');
    if (stored) student = JSON.parse(stored);
  } catch {
    /* ignore malformed storage */
  }

  const handleLogout = () => {
    sessionStorage.removeItem('student_token');
    sessionStorage.removeItem('student_info');
    navigate('/student/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left Section: Brand & Nav Links */}
        <div className="flex items-center gap-10">
          
          {/* Animated Brand Logo */}
          <Link to="/student/browse-jobs" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/images/brand/placify-icon.png"
                alt="Placify"
                className="w-8 h-8 object-contain transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 relative z-10"
              />
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-blue-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
            </div>
            <span 
              className="font-extrabold text-lg tracking-tight text-slate-800 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-amber-500" 
              style={{ fontFamily: 'var(--pf-display)' }}
            >
              Placify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            
            {/* Browse Jobs Link */}
            <NavLink
              to="/student/browse-jobs"
              className={({ isActive }) =>
                `group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-out flex items-center gap-2 overflow-hidden ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 shadow-sm shadow-blue-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13V7a2 2 0 00-2-2h-3V3H8v2H5a2 2 0 00-2 2v6m18 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m18 0H3" />
                  </svg>
                  <span className="relative z-10">Browse Jobs</span>
                </>
              )}
            </NavLink>

            {/* My Applications Link */}
            <NavLink
              to="/student/applications"
              className={({ isActive }) =>
                `group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ease-out flex items-center gap-2 overflow-hidden ${
                  isActive
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 shadow-sm shadow-amber-100'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110 ${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5a3 3 0 016 0" />
                  </svg>
                  <span className="relative z-10">My Applications</span>
                </>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Right Section: Tools & Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          <ThemeToggle />
          <NotificationBell axiosInstance={studentAxios} rolePrefix="student" onViewAll={() => navigate('/student/notifications')} />
          
          {/* Profile Dropdown */}
          <div className="flex items-center gap-3 group relative cursor-pointer p-1.5 rounded-full hover:bg-slate-50 transition-colors">
            
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline transition-colors group-hover:text-blue-600">
              {student.name || 'Student'}
            </span>
            
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 ring-2 ring-white shadow-md flex items-center justify-center font-bold text-white text-sm group-hover:ring-blue-100 group-hover:scale-105 transition-all duration-300">
              {(student.name || 'S').charAt(0)}
            </div>
            
            {/* Dropdown Menu (Animated slide-down & fade-in) */}
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
              
              <Link to="/student/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                <FiUser size={16} className="text-slate-400" />
                My Profile
              </Link>
              
              <Link to="/student/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                <FiSettings size={16} className="text-slate-400" />
                Settings
              </Link>
              
              <div className="h-px bg-slate-100 my-1 mx-4" />
              
              <button onClick={handleLogout} className="flex w-full items-center gap-3 text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <FiLogOut size={16} className="text-red-400" />
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

export default StudentTopNav;