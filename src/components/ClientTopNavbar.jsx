import React from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

// Shared header for the company portal. Styled by the same premium header
// classes as the admin portal (src/styles/admin.css) so both back-office
// portals share one design language.
function ClientTopNavbar({ title, searchPlaceholder = 'Search applications...' }) {
  const navigate = useNavigate();
  let client = { company_name: 'Company' };
  try {
    const stored = sessionStorage.getItem('client_info');
    if (stored) client = JSON.parse(stored);
  } catch {
    // ignore malformed storage
  }

  const isApproved = client.admin_status === 'Approved';

  return (
    <header className="db-top-navbar">
      <h2 className="nav-left-title">{title}</h2>
      <div className="nav-right-controls">
        <div className="search-bar-wrapper">
          <input type="text" placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
          <span aria-hidden="true">🔍</span>
        </div>
        <ThemeToggle />
        <NotificationBell axiosInstance={clientAxios} rolePrefix="client" onViewAll={() => navigate('/notifications')} />
        <div className="admin-profile-identity">
          <div className="profile-text-node">
            <h4>{client.company_name || 'Company'}</h4>
            <p style={{ color: isApproved ? 'var(--pf-green)' : 'var(--pf-amber)' }}>
              {isApproved ? 'Verified partner' : client.admin_status || 'Pending approval'}
            </p>
          </div>
          <div className="avatar-circle" style={{ background: 'linear-gradient(140deg, #f59e0b, #b45309)' }}>
            {(client.company_name || 'C').charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ClientTopNavbar;
