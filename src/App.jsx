import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all your updated page views
import HomePage from './pages/HomePage'; // The newly created layout view
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render the production-ready Placify Home page at root path */}
        <Route path="/" element={<HomePage />} />
        
        {/* Secondary user flow routing portals */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;