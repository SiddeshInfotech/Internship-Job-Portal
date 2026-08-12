import React from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

import { getClientInfo } from '../utils/authStorage';

// Shared header for the company portal. Styled by the same premium header
// classes as the admin portal (src/styles/admin.css) so both back-office
// portals share one design language.
function ClientTopNavbar({ title, searchPlaceholder = 'Search applications...' }) {
  const navigate = useNavigate();
  const client = getClientInfo() || { company_name: 'Company' };

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
          <div className="avatar-circle overflow-hidden" style={{ background: 'linear-gradient(140deg, #f59e0b, #b45309)' }}>
            {(client.logo_url || client.company_logo || client.logo) ? (
              <img 
                src={client.logo_url || client.company_logo || client.logo} 
                alt={client.company_name || 'Company'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              (client.company_name || 'C').charAt(0)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ClientTopNavbar;
