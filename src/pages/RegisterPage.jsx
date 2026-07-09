import React from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';
function RegisterPage() {
  return (
    <div className="register-wrapper">
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
                <circle cx="45" cy="38" r="8" fill="#ffffff" />
                <path d="M 38 60 L 40 48 C 40 48 45 46 50 48 L 52 60 Z" fill="#ffffff" />
                <path d="M 38 63 L 65 48 L 60 43 L 75 45 L 70 58 L 65 53 Z" fill="#ffffff" />
              </svg>
            </div>
            Placify
          </div>

          <div className="hero-section">
            <h1>Your next<br />internship starts<br />with a single step.</h1>
            <p>Join thousands of students across the nation connecting with top-tier companies and exclusive career opportunities.</p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div className="feature-text">
                  <h3>Premium Placements</h3>
                  <p>Access to internships not listed on public job boards.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                </div>
                <div className="feature-text">
                  <h3>Verified Credentials</h3>
                  <p>Stand out with an institutional-backed digital portfolio.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <div className="feature-text">
                  <h3>Career Mentorship</h3>
                  <p>Built-in guides for resumes and technical interviews.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-left">
            © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
          </div>
        </div>

        <div className="right-panel">
          <div className="register-card">
            <h2>Create Student Account</h2>
            <p>Please provide your institutional details to get started.</p>

            <form action="#">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input type="text" placeholder="John Doe" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>College Email</label>
                  <div className="input-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input type="email" placeholder="john@university.edu" required />
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-icon-wrapper">
                   
                    <input type="password" placeholder="••••••••" required />
                   
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-icon-wrapper">
                
                    <input type="password" placeholder="••••••••" required />
                   
                  </div>
                </div>
              </div>

              <hr className="divider-dotted" />

              <div className="form-grid full-width">
                <div className="form-group">
                  <label>College / Institution</label>
                  <div className="select-wrapper">
                    <select required defaultValue="">
                      <option value="" disabled>Select your university</option>
                      <option value="1">Stanford University</option>
                      <option value="2">MIT</option>
                      <option value="3">ssvps</option>
                      <option value="4">coep</option>
                      <option value="5">rcpit</option>
                      <option value="6">svkm</option>
                      <option value="7"></option>
                    </select>
                    <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Branch / Discipline</label>
                  <div className="select-wrapper">
                    <select required defaultValue="">
                      <option value="" disabled>Select branch</option>
                      <option value="cs">Computer Science</option>
                      <option value="mech">Mechanical Engineering</option>
                    </select>
                    <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className="form-group">
                  <label>Year of Study</label>
                  <div className="select-wrapper">
                    <select required defaultValue="">
                      <option value="" disabled>Select year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Final Year</option>
                    </select>
                    <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="checkbox-section">
                <input type="checkbox" required />
                <div className="checkbox-text">
                  <h4>Accept terms and conditions</h4>
                  <p>By clicking, you agree to our Student User Agreement and Privacy Policy.</p>
                </div>
              </div>

              <button type="submit" className="btn-submit">
                Create Account
              </button>

             <div className="login-link">
  Already have an account? <Link to="/login">Log in</Link>
</div>
            </form>
          </div>

          <div className="footer-right">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              VERIFIED PARTNERS
            </span>
            <span className="dot">■</span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              SECURE SSL
            </span>
            <span className="dot">■</span>
            <a href="#">CONTACT SUPPORT ›</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;