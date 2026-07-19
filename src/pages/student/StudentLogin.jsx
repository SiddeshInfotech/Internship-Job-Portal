import React, { useState } from "react";
import "../CompanyLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import studentAxios from "../../api/studentAxios";
import BackToWebsite from "../../components/BackToWebsite";

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const routeAfterLogin = (student) => {
    // New Google sign-ups arrive with college/branch left blank — send them
    // to the profile wizard instead of straight to Browse Jobs.
    if (!student?.college || !student?.branch) {
      navigate('/student/profile-wizard/1');
    } else {
      navigate('/student/browse-jobs');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await studentAxios.post('/student/google-login', { id_token: credentialResponse.credential });
      sessionStorage.setItem('student_token', res.data.token);
      sessionStorage.setItem('student_info', JSON.stringify(res.data.student));
      routeAfterLogin(res.data.student);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await studentAxios.post('/student/login', { email, password });
      const { token, student } = response.data;

      sessionStorage.setItem('student_token', token);
      sessionStorage.setItem('student_info', JSON.stringify(student));

      routeAfterLogin(student);
    } catch (err) {
      const data = err.response?.data;
      if (data?.requires_verification) {
        navigate('/student/verify-otp', { state: { email } });
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
      <div className="left-panel">
        <div className="left-top-content">
          <div className="placify-brand-logo">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="brand-icon-svg" width="42" height="42" />
            <div className="brand-text-block">
              <h1 className="brand-main-title">Placify<span className="purple-dot">.</span></h1>
              <p className="brand-slogan">CONNECT <span>•</span> PREPARE <span>•</span> SUCCEED</p>
            </div>
          </div>

          <div className="hero-content">
            <h2>Your next internship starts with one login.</h2>
            <p>Connect with top-tier employers, manage your applications, and launch your career — all from your campus hub.</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Join 5,000+ students today</h3>
                <p>Trusted by students across the country to launch their careers.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="footer-text">© 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.</p>
      </div>

      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Welcome Back</h2>
          <p className="sub-title">Enter your college credentials to continue your journey.</p>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            <div className="input-group">
              <label>College Email Address</label>
              <input type="email" placeholder="e.g. j.doe@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label>Password</label>
                <Link to="/student/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : <>Log In <span>&gt;</span></>}
            </button>
          </form>

          <div className="divider"><span>OR</span></div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed. Please try again.')}
              text="signin_with"
              shape="pill"
              width="280"
            />
          </div>
          {googleLoading && <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Signing you in...</p>}

          <div className="divider"><span>NEW HERE?</span></div>

          <div className="register-section">
            <Link to="/student/register" className="register-link">Register now &gt;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
