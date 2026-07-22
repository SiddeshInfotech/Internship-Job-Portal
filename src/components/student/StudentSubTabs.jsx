import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiUser, FiFileText, FiBarChart2, FiSettings } from 'react-icons/fi';

const TABS = [
  { to: '/student/profile', label: 'My Profile', icon: FiUser },
  { to: '/student/resumes', label: 'Resumes', icon: FiFileText },
  { to: '/student/applications', label: 'Applied Status', icon: FiBarChart2 },
  { to: '/student/settings', label: 'Settings', icon: FiSettings },
];

function StudentSubTabs() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-300 ease-out outline-none whitespace-nowrap rounded-t-lg ${
                isActive
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon with smooth scale & rotation feel */}
                <t.icon
                  size={16}
                  className={`transition-all duration-300 ease-out group-hover:scale-110 ${
                    isActive 
                      ? 'text-amber-500 scale-110' 
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />

                {/* Tab Label */}
                <span className="relative z-10">{t.label}</span>

                {/* Animated Bottom Indicator Line + Soft Amber Glow */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-500 rounded-full shadow-[0_-2px_10px_rgba(245,158,11,0.6)] transition-all duration-300" />
                )}

                {/* Subtle Hover Highlight Pill */}
                <span className="absolute inset-0 rounded-lg bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default StudentSubTabs;