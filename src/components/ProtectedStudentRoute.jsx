import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStudentToken } from '../utils/authStorage';

function ProtectedStudentRoute({ children }) {
  const token = getStudentToken();
  if (!token) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
}

export default ProtectedStudentRoute;
