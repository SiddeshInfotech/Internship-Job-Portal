import React from "react";
import "./CompanyLogin.css";

function CompanyLogin() {
  return (
    <div className="login-container">
      {/* Left Blue Panel (Fixed Side - 35% Width) */}
      <div className="left-panel">
        <div className="left-top-content">
          
          {/* Brand Logo */}
          <div className="placify-brand-logo">
            <svg className="brand-icon-svg" width="42" height="42" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="60%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path d="M20 20H70C95 20 110 38 110 58C110 78 95 95 70 95H55V110H20V20Z" fill="url(#logo-gradient)" />
              <circle cx="55" cy="45" r="10" fill="#ffffff" />
              <path d="M43 68C43 60 48 57 55 57C62 57 67 60 67 68V76H43V68Z" fill="#ffffff" />
              <path d="M20 100C40 90 60 75 80 60L70 55L95 50L90 75L80 60" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>

            <div className="brand-text-block">
              <h1 className="brand-main-title">
                Placify<span className="purple-dot">.</span>
              </h1>
              <p className="brand-slogan">
                CONNECT <span>•</span> PREPARE <span>•</span> SUCCEED
              </p>
            </div>
          </div>

          {/* Hero Heading (Bigger Font Size Like Image) */}
          <div className="hero-content">
            <h2>Find placement-ready talent, faster.</h2>
            <p>
              Access a curated pool of pre-screened students and streamline
              your recruitment workflow with our intelligent placement portal.
            </p>
          </div>

          {/* Features List with Golden Icons */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v5"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Pre-Vetted Candidates</h3>
                <p>Verified academic records and skill assessments for every profile.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Seamless Onboarding</h3>
                <p>Quick company registration and job posting tools.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Institutional Trust</h3>
                <p>Secured by academic partnerships and data protection standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Text */}
        <p className="footer-text">
          © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
        </p>
      </div>

      {/* Right Login Panel (Wide Form Side - 65% Width) */}
      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Company Portal</h2>
          <p className="sub-title">Welcome back. Please enter your corporate credentials.</p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Company Email</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label>Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember my session for 30 days</label>
            </div>

            <button type="submit" className="login-btn">
              Log in to Dashboard <span>&gt;</span>
            </button>
          </form>

          <div className="divider">
            <span>NEW TO PLACEMENT?</span>
          </div>

          <div className="register-section">
            <a href="#" className="register-link">Register your company profile &gt;</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;