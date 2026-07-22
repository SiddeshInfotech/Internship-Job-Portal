import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedStudentRoute({ children }) {
  const token = sessionStorage.getItem('student_token');
  if (!token) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
}

export default ProtectedStudentRoute;
