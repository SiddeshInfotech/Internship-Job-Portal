import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import ErrorBoundary from '../components/ErrorBoundary';
import './AdminDashboard.css'; // Kept for safety, though UI uses modern utility classes

import { 
  FiPieChart, 
  FiUsers, 
  FiBriefcase, 
  FiFileText, 
  FiInbox, 
  FiBarChart2, 
  FiBell, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when a route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_info');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard Overview', icon: <FiPieChart size={18} /> },
    { path: '/admin/students', label: 'Manage Students', icon: <FiUsers size={18} /> },
    { path: '/admin/companies', label: 'Manage Companies', icon: <FiBriefcase size={18} /> },
    { path: '/admin/jobs', label: 'Manage Job Posts', icon: <FiFileText size={18} /> },
    { path: '/admin/applications', label: 'Manage Applications', icon: <FiInbox size={18} /> },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: <FiBarChart2 size={18} /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <FiBell size={18} /> },
    { path: '/admin/password', label: 'Change Password', icon: <FiSettings size={18} /> },
  ];

  // Helper function to handle active class styling
  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 translate-x-1' 
        : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1'
    }`;
  };

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in forwards;
        }
        
        /* Custom scrollbar for sidebar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
      `}</style>

      <div className="admin-scope flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 🧭 LEFT SIDEBAR */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 shadow-[0_0_40px_rgba(0,0,0,0.03)] flex flex-col transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Brand Area */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 flex-shrink-0 animate-slide-in" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3">
              <BrandLogo size={36} plate />
              <div className="flex flex-col">
                <h3 className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">Placify<span className="text-blue-600">.</span></h3>
                <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Admin Portal</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2">
            <p className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            {navItems.map((item, index) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`${getLinkClasses(item.path)} animate-slide-in`}
                style={{ animationDelay: `${(index + 1) * 50}ms` }}
              >
                <div className={`transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Bottom Logout Area */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0 animate-slide-in" style={{ animationDelay: '500ms' }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white hover:shadow-md hover:shadow-rose-600/20 transition-all duration-300 group"
            >
              <FiLogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* 🖥️ RIGHT SIDE MAIN DYNAMIC WINDOW */}
        <div className="flex-1 flex flex-col min-w-0 h-screen relative">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <header className="lg:hidden bg-white border-b border-slate-200/80 px-4 h-16 flex items-center justify-between z-30 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <BrandLogo size={28} />
              <span className="font-extrabold text-lg text-slate-900">Placify</span>
            </div>
            <button 
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu size={24} />
            </button>
          </header>

          {/* Main Dynamic Content Area */}
          <main className="admin-main flex-1 overflow-y-auto bg-[#F8FAFC] relative">
            {/* Subtle Gradient Background Effect for the Main View */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />
            
            <div className="p-4 sm:p-6 lg:p-8 min-h-full animate-fade-in">
              {/* 🔥 YAHAN OUTLET LAGAYA HAI: React Router handles the smooth component swapping here */}
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;