import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import ForgotPassword from "./pages/ForgotPassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route par Company Login khulega */}
        <Route path="/" element={<CompanyLogin />} />
        
        {/* /register path par Company Registration khulega */}
        <Route path="/register" element={<CompanyRegister />} />
        {/* /register path par Company Registration khulega */}
        <Route path="/forgot" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;