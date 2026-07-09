import React from 'react';
import './LoginPage.css'; // We will import the CSS file here
import { Link } from 'react-router-dom';


function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="left-panel">
          <div className="brand">
            <div className="brand-icon">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="placifyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M 20 85 Q 28 65 30 50 L 30 20 L 60 20 C 85 20 95 40 85 60 C 75 75 60 75 45 75 L 35 75 Q 25 80 15 95 Z" fill="url(#placifyGrad)" />
                <circle cx="45" cy="38" r="8" fill="#163362" />
                <path d="M 38 60 L 40 48 C 40 48 45 46 50 48 L 52 60 Z" fill="#163362" />
                <path d="M 38 63 L 65 48 L 60 43 L 75 45 L 70 58 L 65 53 Z" fill="#163362" />
              </svg>
            </div>
            Placify
          </div>

          <div className="hero-section">
            <h1>Your next<br />internship starts<br />with one login.</h1>
            <p>Connect with top-tier employers, manage your applications, and launch your career—all from your campus hub.</p>
            
            <div className="social-proof">
              <div className="avatars">
                <div className="avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=11')" }}></div>
                <div className="avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=32')" }}></div>
                <div className="avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=12')" }}></div>
              </div>
              Join 5,000+ students today
            </div>
          </div>

          <div className="footer-left">
            © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
          </div>
        </div>

        <div className="right-panel">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to continue your journey</p>

            <form action="#">
              <div className="form-group">
                <label> Email Address</label>
                <div className="input-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" placeholder="e.g. abc@gmail.com" required />
                </div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <div className="input-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" placeholder="••••••••" required />
               
                </div>
              </div>

              <div className="form-actions">
                <label className="checkbox-container">
                  <input type="checkbox" /> Remember me
                </label>
               <div className="remember-forgot">
   <Link to="/forgotpassword">Forgot password?</Link>
</div>
              </div>

              <button type="submit" className="btn-submit">
                Log In 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </form>

            <div className="divider"></div>
<div className="register-text">
  New here? <Link to="/register">Register now</Link>
</div>
          </div>

          <div className="footer-right">
            <a href="#">HELP CENTER</a>
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;