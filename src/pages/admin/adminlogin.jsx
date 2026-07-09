import React, { useState } from 'react';

// NOTE: Make sure your image filename matches this exactly or change this path 
// to match where you saved your logo (e.g., "./assets/placify_icon.png")

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    adminUsername: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate backend admin authentication
    console.log('Authenticating Admin:', credentials);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // window.location.href = '/admin/dashboard';
    setIsLoading(false);
  };

  return (
    <div className="placify-login-container">
      {/* Injected CSS Styles & Animations directly inside the component */}
      <style>{`
        @keyframes cardBounceIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes buttonPulse {
          0% { box-shadow: 0 0 0 0 rgba(15, 41, 99, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(15, 41, 99, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 41, 99, 0); }
        }

        .placify-login-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: #f9fafb;
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .placify-login-container * {
          box-sizing: border-box;
        }

        /* Left Branding Panel */
        .login-left-panel {
          flex: 0 0 45%;
          background-color: #0f2963; 
          color: #ffffff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .placify-logo-lockup {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
        }

        .placify-logo-img {
          height: 45px;
          object-fit: contain;
        }

        .placify-tagline {
          font-size: 11px;
          font-weight: 600;
          color: #93c5fd;
          letter-spacing: 2px;
          margin-top: 6px;
          padding-left: 4px;
        }

        .hero-text {
          font-size: 46px;
          font-weight: 700;
          line-height: 1.2;
          margin-top: auto;
          margin-bottom: 20px;
          max-width: 440px;
          color: #ffffff;
        }

        .hero-subtext {
          font-size: 16px;
          font-weight: 400;
          color: #93a3b8;
          max-width: 460px;
          line-height: 1.6;
          margin-bottom: auto;
        }

        .social-proof {
          background-color: rgba(255, 255, 255, 0.08);
          padding: 12px 20px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          align-self: flex-start;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .avatar-group {
          display: flex;
        }

        .avatar-img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #0f2963;
          margin-left: -8px;
        }

        .avatar-img:first-child {
          margin-left: 0;
        }

        .copyright {
          font-size: 11px;
          color: #64748b;
          letter-spacing: 0.5px;
          border-top: 1px solid rgba(163, 47, 47, 0.1);
          padding-top: 20px;
          margin-top: 40px;
        }

        /* Right Form Panel */
        .login-right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          background: #ffffff;
        }

        .form-card {
          width: 100%;
          max-width: 600px;
          background: #ffffff;
          border-radius: 16px;
             box-shadow: 0 15px 35px rgba(1, 1, 0.5, 0.7);
          padding: 40px;
          animation: cardBounceIn 0.75s cubic-bezier(0.19, 1, 0.22, 1) both;
        }

        .card-title {
          font-size: 35px;
          font-weight: 1000;
          color: #0f2963;
          text-align: center;
          margin: 0 0 8px;
        }

        .card-subtitle {
          font-size: 25px;
          color: #64748b;
          text-align: center;
          margin-bottom: 32px;
        }

        .input-group {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 20px;
          font-weight: 600;
          color: #334155;
        }

        .input-field-wrapper {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 20px;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 19px;
          color: #0f172a;
          outline: none;
          background-color: #f8fafc;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          border-color: #0f2963;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(15, 41, 99, 0.1);
        }

        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          font-size: 20px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }

        .remember-label input {
          accent-color: #0f2963;
          width: 16px;
          height: 16px;
        }

        .forgot-password-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          background-color: #0f2963;
          color: #ffffff;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s ease, transform 0.1s ease;
          animation: buttonPulse 3s infinite;
        }

        .login-button:hover {
          background-color: #1d4ed8;
        }

        .login-button:active {
          transform: scale(0.98);
        }

        .login-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
          animation: none;
        }

        .restriction-text {
          font-size: 16px;
          color: #94a3b8;
          text-align: center;
          margin-top: 24px;
          font-weight: 500;
        }

        .right-panel-footer {
          position: absolute;
          bottom: 30px;
          display: flex;
          gap: 24px;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.5px;
        }

        .footer-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.15s;
        }

        .footer-link:hover {
          color: #64748b;
        }

        @media (max-width: 900px) {
          .login-left-panel {
            display: none;
          }
        }
      `}</style>

      {/* Left Column: Branding Assets & Info */}
      <div className="login-left-panel">
        <div>
         <div className="placify-logo-lockup">
   <img
    src="/placify-icon.png"
    alt="Placify Logo"
    className="h-50 w-80 fill: white object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg brightness-0 invert"
  />
  <span></span>
</div>
          <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('https://tse2.mm.bing.net/th/id/OIP.nV7Q5ahTRDm08qMZmGA0KQHaEK?r=0&pid=Api&h=220&P=0')` }} 
        /> 
        </div>

        <div>
          <h1 className="hero-text">Welcome back</h1>
          <p className="hero-subtext">
            Sign in to supervise platform operations and ensure a seamless recruitment experience.
          </p>
        </div>

        
        <div className="copyright">
          © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Column: Interactive Login Container */}
      <div className="login-right-panel">
        <div className="form-card">
          <h2 className="card-title">          Admin Login</h2>
          <p className="card-subtitle">Enter your credentials to access the admin console</p>

          <form onSubmit={handleSubmit}>
            {/* Field: Admin Username */}
            <div className="input-group">
              <label htmlFor="adminUsername" className="input-label">Admin Username</label>
              <div className="input-field-wrapper">
                <span className="field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input
                  type="text"
                  id="adminUsername"
                  name="adminUsername"
                  value={credentials.adminUsername}
                  onChange={handleChange}
                  placeholder="Username"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Field: Password */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-field-wrapper">
                <span className="field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Action Meta Rows */}
            <div className="action-row">
              <label className="remember-label">
                <input type="checkbox" id="rememberMe" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password-link"></a>
            </div>

            {/* Submission Interactive Button */}
            <button type="submit" className="login-button" disabled={isLoading}>
              <span>{isLoading ? 'Verifying Session...' : 'Log In'}</span>
              {!isLoading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              )}
            </button>
          </form>

          <div className="restriction-text">
            Access restricted to authorized personnel only.
          </div>
        </div>

        {/* Global Footer Elements */}
        <div className="right-panel-footer">
          <a href="#help" className="footer-link">HELP CENTER</a>
          <a href="#privacy" className="footer-link">PRIVACY</a>
          <a href="#terms" className="footer-link">TERMS</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;