import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardOverview from "./pages/DashboardOverview"; // 👈 Ensure this is correct
import ManageCompanies from "./pages/ManageCompanies";
import ManageJobPosts from "./pages/ManageJobPosts";
import ManageApplications from "./pages/ManageApplications";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import ManageStudents from "./pages/ManageStudents";
import Notifications from "./pages/Notifications";
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Open Auth Routes */}
        <Route path="/" element={<CompanyLogin />} />
        <Route path="/register" element={<CompanyRegister />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* 🔐 Admin Workspace Cluster */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Index route: Jab URL sirf '/admin' ho, toh direct DashboardOverview open hoga */}
          <Route index element={<DashboardOverview />} />
          
          {/* Sub-routes under dashboard layout shell */}
          <Route path="companies" element={<ManageCompanies />} />
          <Route path="jobs" element={<ManageJobPosts />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="password" element={<ChangePassword />} />
          
          {/* Safe Fallbacks for secondary tabs */}
          
          
          
        </Route>

        {/* Catch-all global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;