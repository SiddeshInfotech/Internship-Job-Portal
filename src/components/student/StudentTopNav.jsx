import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';

function StudentTopNav() {
  const navigate = useNavigate();

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

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors pb-0.5 ${
      isActive
        ? 'text-[#0F172A] after:absolute after:left-0 after:right-0 after:-bottom-[13px] after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-[#2563eb] after:to-[#f59e0b]'
        : 'text-slate-500 hover:text-[#0F172A]'
    }`;

  return (
    <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/student/browse-jobs" className="flex items-center gap-2.5 group">
            <img
              src="/images/brand/placify-icon.png"
              alt="Placify"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-lg tracking-tight text-[#0F172A]" style={{ fontFamily: 'var(--pf-display)' }}>
              Placify
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/student/browse-jobs" className={navLinkClass}>Browse Jobs</NavLink>
            <NavLink to="/student/applications" className={navLinkClass}>My Applications</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <ThemeToggle />
          <NotificationBell axiosInstance={studentAxios} rolePrefix="student" onViewAll={() => navigate('/student/notifications')} />
          <div className="flex items-center gap-2.5 group relative">
            <span className="text-sm font-semibold text-[#0F172A] hidden sm:inline">{student.name || 'Student'}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563eb] to-[#0b1526] ring-2 ring-white shadow-md flex items-center justify-center font-bold text-white text-sm cursor-pointer">
              {(student.name || 'S').charAt(0)}
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lift border border-slate-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden">
              <Link to="/student/profile" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F172A] transition-colors">My Profile</Link>
              <Link to="/student/settings" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F172A] transition-colors">Settings</Link>
              <div className="h-px bg-slate-100 my-1" />
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentTopNav;
