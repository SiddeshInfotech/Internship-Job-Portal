import React from 'react';
import { Navigate } from 'react-router-dom';

// Frontend-side gate: stops a logged-out user from briefly seeing an
// Admin page's layout before an API call fails. The backend is the
// real protection (every endpoint requires the JWT) — this is just UX.
function ProtectedAdminRoute({ children }) {
  const token = sessionStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default ProtectedAdminRoute;
