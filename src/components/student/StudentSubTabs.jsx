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
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                isActive ? 'text-[#F59E0B] border-[#F59E0B]' : 'text-slate-500 border-transparent hover:text-[#0F172A]'
              }`
            }
          >
            <t.icon size={14} /> {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default StudentSubTabs;
