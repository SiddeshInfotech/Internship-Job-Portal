import React, { useState } from "react";
import "./CompanyLogin.css";
import { Link, useNavigate } from "react-router-dom";
import clientAxios from "../api/clientAxios";
import BackToWebsite from "../components/BackToWebsite";

function CompanyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await clientAxios.post('/client/login', { email, password });
      const { token, client } = response.data;

      sessionStorage.setItem('client_token', token);
      sessionStorage.setItem('client_info', JSON.stringify(client));

      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.requires_verification) {
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <BackToWebsite />
      {/* Left Blue Panel (Fixed Side - 35% Width) */}
      <div className="left-panel">
        <div className="left-top-content">
          
          {/* Brand Logo */}
          <div className="placify-brand-logo">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="brand-icon-svg" width="42" height="42" />

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

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            <div className="input-group">
              <label>Company Email</label>
              <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label>Password</label>
               <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label htmlFor="remember">Remember my session for 30 days</label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : <>Log in to Dashboard <span>&gt;</span></>}
            </button>
          </form>

          <div className="divider">
            <span>NEW TO PLACEMENT?</span>
          </div>

          <div className="register-section">
            <Link to="/register" classname="register-link">Register your company profile &gt;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;