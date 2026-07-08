import React from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  return (
    <div className="login-container">
      
      {/* 🏢 LEFT BLUE PANEL - Same Branding & Identity */}
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
              <h1 className="brand-main-title">
                Placify<span className="purple-dot">.</span>
              </h1>
              <p className="brand-slogan">
                CONNECT <span>•</span> PREPARE <span>•</span> SUCCEED
              </p>
            </div>
          </div>

          {/* Forgot Password Text according to company portal */}
          <div className="hero-content">
            <h2>Secure account recovery.</h2>
            <p>
              Don't worry! Enter your corporate email address, and we will send you instructions to reset your password and secure your portal access immediately.
            </p>
          </div>

          {/* Premium Goldenish Orange Icons list (Kal jaisa match) */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="feature-text-box">
                <h3>Encrypted Reset Links</h3>
                <p>Multi-layered security protocols protect recovery requests.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div className="feature-text-box">
                <h3>Institutional Security</h3>
                <p>Secured by corporate firewalls and professional authentication standards.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="footer-text">
          © 2026 PLACIFY PORTAL. OPTIMIZED FOR ENTERPRISE RECRUITMENT.
        </p>
      </div>

      {/* 🔐 RIGHT PANEL - Clean Password Recovery Card */}
      <div className="right-panel">
        <div className="login-box-wide forgot-card-box">
          <h2>Reset Password</h2>
          <p className="sub-title">Enter your verified email to receive a recovery link.</p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Corporate Email Address <span className="star-req">*</span></label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <button type="submit" className="login-btn reset-send-btn">
              Send Recovery Instructions &gt;
            </button>

            <div className="divider-line">
              <span>OR GO BACK</span>
            </div>

            <div className="return-signin-section">
              <Link to="/" className="return-portal-link">
                ← Return to Company Portal
              </Link>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default ForgotPassword;