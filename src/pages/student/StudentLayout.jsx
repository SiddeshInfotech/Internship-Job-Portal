import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentTopNav from '../../components/student/StudentTopNav';

function StudentLayout() {
  return (
    <div className="student-scope min-h-screen bg-[#F8FAFC] font-sans">
      <StudentTopNav />
      <Outlet />
    </div>
  );
}

export default StudentLayout;
