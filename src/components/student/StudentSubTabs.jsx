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
    <>
      {/* Utility to hide the scrollbar for clean mobile swiping */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 
        Uses backdrop blur and slight transparency. 
        If placed directly under a sticky header, you can add `top-[68px] z-40 sticky` to this container. 
      */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Scrollable container for mobile devices */}
          <div className="flex items-center gap-2 sm:gap-8 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2.5 py-4 px-3 sm:px-1 text-sm font-bold transition-all duration-300 ease-out whitespace-nowrap group active:scale-[0.98] ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <t.icon 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        isActive 
                          ? 'scale-110 drop-shadow-sm text-indigo-500' 
                          : 'group-hover:scale-110 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`} 
                    />
                    <span>{t.label}</span>
                    
                    {/* Animated Bottom Border */}
                    <div 
                      className={`absolute bottom-0 left-0 w-full h-[3px] rounded-t-full transition-all duration-300 ease-out origin-center ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 opacity-100 scale-x-100 shadow-[0_-2px_10px_rgba(99,102,241,0.4)]' 
                          : 'bg-slate-300 dark:bg-slate-600 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-75'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentSubTabs;