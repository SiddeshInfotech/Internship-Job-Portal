import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

// Shared header used across all admin pages. Reads the logged-in admin's
// name from sessionStorage (set at login) instead of hardcoding "Super Admin".
// Styled entirely by src/styles/admin.css (.db-top-navbar family).
function TopNavbar({ title }) {
  const navigate = useNavigate();
  let admin = { name: 'Admin' };
  try {
    const stored = sessionStorage.getItem('admin_info');
    if (stored) admin = JSON.parse(stored);
  } catch {
    // ignore malformed storage, fall back to default
  }
  const initials = (admin.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="db-top-navbar">
      <h2 className="nav-left-title">{title}</h2>
      <div className="nav-right-controls">
        <div className="search-bar-wrapper">
          <input type="text" placeholder="Search dashboard..." aria-label="Search dashboard" />
          <span aria-hidden="true">🔍</span>
        </div>
        <ThemeToggle />
        <NotificationBell axiosInstance={axiosClient} rolePrefix="admin" onViewAll={() => navigate('/admin/notifications')} />
        <div className="admin-profile-identity">
          <div className="profile-text-node">
            <h4>{admin.name || 'Admin'}</h4>
            <p>Institutional role</p>
          </div>
          <div className="avatar-circle">{initials}</div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
