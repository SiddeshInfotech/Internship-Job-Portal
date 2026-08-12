import React from 'react';
import { Navigate } from 'react-router-dom';
import { getClientToken } from '../utils/authStorage';

function ProtectedClientRoute({ children }) {
  const token = getClientToken();
  if (!token) {
    return <Navigate to="/company/login" replace />;
  }
  return children;
}

export default ProtectedClientRoute;
