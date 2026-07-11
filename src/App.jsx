import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all your updated page views
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/admin/AdminLogin.jsx'; 
import VerifyEmail from './pages/VerifyEmail.jsx'; 
import BrowseJobs from './pages/BrowseJobs.jsx';
// 1. FIXED: Capitalized the variable name 'StudentDashboard'
import StudentDashboard from './pages/studentDashboard.jsx'; 
import MyApplications from './pages/MyApplications.jsx';
import ProfileComplete1 from './pages/ProfileComplete1.jsx';
import ProfileComplete2 from './pages/ProfileComplete2.jsx';
import ProfileComplete3 from './pages/ProfileComplete3.jsx';
import Settings from './pages/Settings.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
       <Route path="/browsejobs" element={<BrowseJobs />} />
        {/* 2. FIXED: Capitalized the JSX element tag to <StudentDashboard /> */}
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/myapplications" element={<MyApplications />} />
        <Route path="/profilecomplete1" element={<ProfileComplete1 />} />
        <Route path="/profilecomplete2" element={<ProfileComplete2 />} />
        <Route path="/profilecomplete3" element={<ProfileComplete3 />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;