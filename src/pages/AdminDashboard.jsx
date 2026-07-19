import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import ErrorBoundary from '../components/ErrorBoundary';
import './AdminDashboard.css';

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Active tab ko blue text/background dene ke liye logic
  const isActive = (path) => location.pathname === path ? 'nav-item-link active' : 'nav-item-link';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_info');
    navigate('/admin/login');
  };

  return (
    <div className="db-layout-container">
      
      {/* 🧭 LEFT SIDEBAR */}
      <aside className="db-sidebar">
        <div className="sidebar-brand-area">
          <BrandLogo size={42} plate />
          <div className="brand-text-block">
            <h3 className="brand-title">Placify</h3>
            <p className="brand-subtitle">CONNECT • PREPARE • SUCCEED</p>
          </div>
        </div>

        {/* 🔗 SARE BUTTONS KO LINK ME CONVERT KAR DIYA HAI */}
        <nav className="sidebar-nav-list">
          <Link to="/admin" className={isActive('/admin')}>📊 Dashboard Overview</Link>
          <Link to="/admin/students" className={isActive('/admin/students')}>👨‍🎓 Manage Students</Link>
          <Link to="/admin/companies" className={isActive('/admin/companies')}>🏢 Manage Companies</Link>
          <Link to="/admin/jobs" className={isActive('/admin/jobs')}>💼 Manage Job Posts</Link>
          <Link to="/admin/applications" className={isActive('/admin/applications')}>📄 Manage Applications</Link>
          <Link to="/admin/reports" className={isActive('/admin/reports')}>📈 Reports & Analytics</Link>
          <Link to="/admin/notifications" className={isActive('/admin/notifications')}>🔔 Notifications</Link>
          <Link to="/admin/password" className={isActive('/admin/password')}>⚙️ Change Password</Link>
        </nav>

        <div className="sidebar-bottom-zone">
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit' }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* 🖥️ RIGHT SIDE MAIN DYNAMIC WINDOW */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        
        {/* 🔥 YAHAN OUTLET LAGAYA HAI: Ab jab bhi tum kisi link par click karoge, 
            toh right-side ka content crash hue bina smoothly change ho jayega! */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>

      </div>

    </div>
  );
}

export default AdminDashboard;