import React from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
  return (
    <div className="login-container">
      {/* Left Blue Panel (Same Brand Identity) */}
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

          {/* Hero Heading for Forgot Password */}
          <div className="hero-content">
            <h2>Secure account recovery.</h2>
            <p>
              Don't worry! Enter your corporate email address, and we will send you 
              instructions to reset your corporate access link immediately.
            </p>
          </div>

          {/* Brand Benefits / Trust Factors with Golden Icons */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="feature-text-box">
                <h3>Encrypted Reset Links</h3>
                <p>Multi-layered security protocols protect recovery requests.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="feature-text-box">
                <h3>Institutional Trust</h3>
                <p>Secured by corporate firewalls and authentication standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Text */}
        <p className="footer-text">
          © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
        </p>
      </div>

      {/* Right Recovery Panel (Wide Layout) */}
      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Reset Password</h2>
          <p className="sub-title">Enter your verified email to receive a recovery link.</p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Corporate Email Address</label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <button type="submit" className="login-btn">
              Send Recovery Instructions <span>&gt;</span>
            </button>
          </form>

          <div className="divider">
            <span>OR GO BACK</span>
          </div>

          <div className="register-section">
            <a href="/login" className="register-link">&lt; Return to Company Portal</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;