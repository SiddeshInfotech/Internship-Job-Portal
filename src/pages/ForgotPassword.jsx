import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clientAxios from '../api/clientAxios';
import './ForgotPassword.css';
import BackToWebsite from '../components/BackToWebsite';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await clientAxios.post('/client/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send recovery email. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <BackToWebsite />
      
      {/* 🏢 LEFT BLUE PANEL - Same Branding & Identity */}
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

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>
            )}
            {sent && (
              <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                If an account exists for that email, recovery instructions have been sent.
              </div>
            )}
            <div className="input-group">
              <label>Corporate Email Address <span className="star-req">*</span></label>
              <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <button type="submit" className="login-btn reset-send-btn" disabled={loading}>
              {loading ? 'Sending...' : <>Send Recovery Instructions &gt;</>}
            </button>

            <div className="divider-line">
              <span>OR GO BACK</span>
            </div>

            <div className="return-signin-section">
              <Link to="/company/login" className="return-portal-link">
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