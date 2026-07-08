import React from 'react';
import './CompanyRegister.css';
import {Link} from "react-router-dom";
function CompanyRegister() {
  return (
    <div className="login-container">
      
      {/* LEFT BLUE PANEL - Same Identity as Login */}
      <div className="left-panel">
        <div className="left-top-content">
          
          {/* Brand Logo */}
          <div className="placify-brand-logo">
            <svg className="brand-icon-svg" width="42" height="42" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="60%" stop-color="#4f46e5" />
                  <stop offset="100%" stop-color="#2563eb" />
                </linearGradient>
              </defs>
              <path d="M20 20H70C95 20 110 38 110 58C110 78 95 95 70 95H55V110H20V20Z" fill="url(#logo-gradient)" />
              <circle cx="55" cy="45" r="10" fill="#ffffff" />
              <path d="M43 68C43 60 48 57 55 57C62 57 67 60 67 68V76H43V68Z" fill="#ffffff" />
              <path d="M20 100C40 90 60 75 80 60L70 55L95 50L90 75L80 60" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>

            <div className="brand-text-block">
              <h1 class="brand-main-title">
                Placify<span class="purple-dot">.</span>
              </h1>
              <p className="brand-slogan">
                CONNECT <span>•</span> PREPARE <span>•</span> SUCCEED
              </p>
            </div>
          </div>

          {/* Contextual Texts changed for Registration */}
          <div className="hero-content">
            <h2>Expand your campus hiring network.</h2>
            <p>
              Create a corporate account to tap into top-tier university talent pools, schedule drives, and automate your entire recruitment workflow seamlessly.
            </p>
          </div>

          {/* Custom Feature Items for registration */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="feature-text-box">
                <h3>Direct Talent Access</h3>
                <p>Filter and connect with verified, placement-ready profiles instantly.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><line x1="12" y1="12" x2="12" y2="21"></line></svg>
              </div>
              <div className="feature-text-box">
                <h3>Drive Management</h3>
                <p>Post job tracks, coordinate interviews, and track offers on one unified dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="footer-text">
          © 2026 PLACIFY PORTAL. OPTIMIZED FOR ENTERPRISE RECRUITMENT.
        </p>
      </div>

      {/* RIGHT PANEL - Clean Registration Layout */}
      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Register your company</h2>
          <p className="sub-title">Join our hiring network to discover premium student talent.</p>

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* Two Column Fields */}
            <div className="form-grid-row">
              <div className="input-group">
                <label>Company Name <span className="star-req">*</span></label>
                <input type="text" placeholder="e.g. Acme Tech Solutions" required />
              </div>
              <div className="input-group">
                <label>Official Email <span className="star-req">*</span></label>
                <input type="email" placeholder="hiring@company.com" required />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Password <span className="star-req">*</span></label>
                <input type="password" placeholder="Min. 8 characters" required />
              </div>
              <div className="input-group">
                <label>Confirm Password <span className="star-req">*</span></label>
                <input type="password" placeholder="Repeat password" required />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Industry <span className="star-req">*</span></label>
                <select required defaultValue="">
                  <option value="" disabled>Select industry</option>
                  <option value="it">Information Technology</option>
                  <option value="finance">Finance / Fintech</option>
                  <option value="consulting">Consulting / Management</option>
                </select>
              </div>
              <div className="input-group">
                <label>Company Size <span className="star-req">*</span></label>
                <select required defaultValue="">
                  <option value="" disabled>No. of employees</option>
                  <option value="1">1-50 employees</option>
                  <option value="2">51-500 employees</option>
                  <option value="3">500+ employees</option>
                </select>
              </div>
            </div>

            <div className="input-group full-width-field">
              <label>Website URL</label>
              <input type="url" placeholder="https://www.yourcompany.com" />
            </div>

            <div className="checkbox-group align-top">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the Terms of Service <br />
                <span className="checkbox-subtext">By checking this box, you agree to our processing of data for recruitment purposes.</span>
              </label>
            </div>

            <div className="action-flex-row">
              <button type="submit" className="login-btn register-btn">
                Create account
              </button>
             <Link to="/"> 
              <button type="button" className="back-btn">
                ← Back to sign in
              </button>
             </Link> 
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default CompanyRegister;