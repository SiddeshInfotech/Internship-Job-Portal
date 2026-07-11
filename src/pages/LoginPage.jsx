import React, { useState } from 'react';
import axiosClient from "./api/axiosClient";
import './LoginPage.css'; 
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // --- STANDARD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Your axiosClient already adds '/api', so this will hit '/api/student/login'
      const response = await axiosClient.post('/student/login', {
        email,
        password,
      });
      
      console.log(response.data);
      
      // Save token and redirect to StudentDashboard
      localStorage.setItem("token", response.data.token);
      navigate('/ProfileComplete1'); 

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Invalid Email or Password');
    }
  };

  // --- GOOGLE LOGIN (Native Redirect) ---
  const handleGoogleLogin = () => {
    // We use the absolute URL here because window.location.href does not use axiosClient
    window.location.href = 'https://placify-backend-nvvw.onrender.com/api/student/google-login';
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        
        {/* LEFT PANEL */}
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

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to continue your journey</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label> Email Address</label>
                <div className="input-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input 
                    type="email" 
                    placeholder="e.g. abc@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
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

            {/* CUSTOM GOOGLE LOGIN BUTTON */}
            <div className="divider" style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
              <span style={{ 
                background: '#fff', 
                padding: '0 10px', 
                color: '#6b7280', 
                fontSize: '0.875rem',
                position: 'relative',
                zIndex: 1
              }}>
                OR
              </span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                borderTop: '1px solid #e5e7eb',
                zIndex: 0
              }}></div>
            </div>
            
            <button 
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#374151',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <div className="divider" style={{ marginTop: '20px' }}></div>
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