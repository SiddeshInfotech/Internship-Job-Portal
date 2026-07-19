import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/BrandLogo';

// Company portal shell. Reuses the premium sidebar/header design language
// from src/styles/admin.css so admin + company portals feel like one product.
function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  let client = { company_name: 'Company' };
  try {
    const stored = sessionStorage.getItem('client_info');
    if (stored) client = JSON.parse(stored);
  } catch {
    // ignore malformed storage
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    sessionStorage.removeItem('client_token');
    sessionStorage.removeItem('client_info');
    navigate('/company/login');
  };

  const navItem = (path, icon, label) => (
    <Link to={path} className={`nav-item-link${isActive(path) ? ' active' : ''}`}>
      <span aria-hidden="true">{icon}</span> {label}
    </Link>
  );

  return (
    <div className="db-layout-container">
      <aside className="db-sidebar">
        <div className="sidebar-brand-area">
          <BrandLogo size={38} plate />
          <div className="brand-text-block">
            <h3 className="brand-title">Placify</h3>
            <p className="brand-subtitle">Company portal</p>
          </div>
        </div>

        <nav className="sidebar-nav-list">
          {navItem('/dashboard', '📊', 'Dashboard')}
          {navItem('/jobs', '💼', 'Jobs')}
          {navItem('/applicants', '👥', 'Applicants')}
          {navItem('/company-profile', '🏢', 'Company Profile')}
          {navItem('/settings', '⚙️', 'Settings')}
        </nav>

        <div className="sidebar-bottom-zone">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <span aria-hidden="true">🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="db-main-body client-shell-body">
        <Outlet context={{ client }} />
      </div>
    </div>
  );
}

export default ClientLayout;
