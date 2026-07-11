import React from 'react';

const ProfileComplete1 = () => {
  return (
    <>
      <style>
        {`
          :root {
              /* Upgraded Professional Color Palette */
              --primary: #2563eb; /* Modern Royal Blue */
              --primary-hover: #1d4ed8;
              --secondary: #10b981; /* Emerald Green for progress */
              --bg-main: #f1f5f9; /* Slate 50 background */
              --surface: #ffffff; /* Pure white for cards */
              --text-main: #0f172a; /* Deep slate for high contrast */
              --text-muted: #475569;
              --border: #cbd5e1;
              --footer-bg: #1e293b; /* Sleek dark slate for footer */
          }

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Inter', sans-serif;
          }

          body {
              /* Professional Background Image with Light Frosted Overlay for Readability */
              background-color: var(--bg-main);
              background-image: linear-gradient(rgba(241, 245, 249, 0.85), rgba(241, 245, 249, 0.95)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80');
              background-size: cover;
              background-position: center;
              background-attachment: fixed;
              
              color: var(--text-main);
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              overflow-x: hidden;
          }

          /* ================= NAVBAR ================= */
          .navbar {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              padding: 1rem 5%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
              position: sticky;
              top: 0;
              z-index: 100;
          }

          .logo {
              font-size: 1.5rem;
              font-weight: 800;
              color: var(--primary);
              display: flex;
              align-items: center;
              gap: 10px;
          }

          .logo span {
              background: var(--primary);
              color: white;
              padding: 4px 10px;
              border-radius: 6px;
          }

          .nav-links a {
              text-decoration: none;
              color: var(--text-muted);
              font-weight: 600;
              margin-right: 2rem;
              transition: color 0.3s;
          }

          .nav-links a:hover { color: var(--primary); }

          /* ================= MAIN CONTAINER ================= */
          .container {
              flex: 1;
              width: 100%;
              max-width: 900px;
              margin: 2rem auto 4rem auto;
              padding: 0 1.5rem;
          }

          /* ================= ANIMATED HEADER & STEPPER ================= */
          .onboarding-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2rem;
              opacity: 0;
              animation: slideInLeft 0.6s ease-out 0.2s forwards;
          }

          .title-area h1 {
              font-size: 2.2rem;
              font-weight: 800;
              color: var(--text-main);
              margin-bottom: 0.5rem;
              letter-spacing: -0.5px;
          }

          .title-area p {
              color: var(--text-muted);
              font-size: 1.05rem;
          }

          /* Upgraded "Skip for Now" Button Animation */
          .btn-skip {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 0.7rem 1.4rem;
              border-radius: 8px;
              background: transparent;
              color: var(--primary);
              border: 2px solid var(--primary);
              text-decoration: none;
              font-weight: 700;
              opacity: 0;
              animation: slideInRight 0.6s ease-out 0.4s forwards, floatBounce 3s ease-in-out infinite 1s;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-skip:hover {
              background: var(--primary);
              color: var(--surface);
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
              transform: scale(1.05);
          }

          /* Progress Bar Wrapper */
          .progress-wrapper {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              padding: 1.5rem;
              border-radius: 12px;
              box-shadow: 0 8px 20px rgba(0,0,0,0.04);
              margin-bottom: 2rem;
              border: 1px solid var(--border);
              opacity: 0;
              animation: slideUpFade 0.6s ease-out 0.6s forwards;
          }

          .progress-text {
              display: flex;
              justify-content: space-between;
              font-weight: 800;
              color: var(--primary);
              margin-bottom: 1rem;
              font-size: 0.95rem;
              text-transform: uppercase;
              letter-spacing: 1px;
          }

          .progress-bar-bg {
              width: 100%;
              height: 10px;
              background: #e2e8f0;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
          }

          .progress-bar-fill {
              height: 100%;
              width: 0%;
              background: linear-gradient(90deg, var(--primary), var(--secondary));
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
              animation: fillProgress 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards;
          }

          /* ================= FORM CARD ================= */
          .form-card {
              background: rgba(255, 255, 255, 0.98);
              padding: 3rem;
              border-radius: 16px;
              box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--border);
              opacity: 0;
              animation: slideUpFade 0.6s ease-out 0.8s forwards;
          }

          .form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.5rem;
          }

          .full-width { grid-column: 1 / -1; }

          .input-group {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
          }

          .input-group label {
              font-size: 0.85rem;
              font-weight: 700;
              color: var(--text-main);
          }

          .input-group input, .input-group textarea {
              padding: 0.9rem 1.2rem;
              border: 2px solid var(--border);
              border-radius: 8px;
              font-size: 0.95rem;
              background: #f8fafc;
              transition: all 0.3s ease;
              outline: none;
          }

          .input-group input:focus, .input-group textarea:focus {
              background: var(--surface);
              border-color: var(--primary);
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
          }

          .input-group input:disabled {
              opacity: 0.7;
              cursor: not-allowed;
              background: #e2e8f0;
          }

          textarea {
              resize: vertical;
              min-height: 100px;
          }

          /* ================= ACTION BUTTONS ================= */
          .form-actions {
              display: flex;
              justify-content: flex-end;
              gap: 1rem;
              margin-top: 2.5rem;
              padding-top: 2rem;
              border-top: 1px solid var(--border);
          }

          .btn {
              padding: 0.8rem 2.5rem;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 700;
              cursor: pointer;
              border: none;
              transition: all 0.3s ease;
          }

          .btn-clear {
              background: transparent;
              color: var(--text-muted);
              border: 2px solid var(--border);
          }

          .btn-clear:hover {
              background: var(--border);
              color: var(--text-main);
          }

          .btn-save {
              background: var(--primary);
              color: white;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }

          .btn-save:hover {
              background: var(--primary-hover);
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
          }

          /* ================= HIGH VISIBILITY FOOTER ================= */
          .footer {
              background: var(--footer-bg);
              color: white;
              padding: 2rem 5%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: auto;
              border-top: 4px solid var(--primary);
          }

          .footer-logo {
              font-weight: 800;
              font-size: 1.2rem;
              color: white;
          }

          .footer-links {
              display: flex;
              gap: 2rem;
          }

          .footer-links a {
              color: #ffffff; 
              text-decoration: none;
              font-size: 0.9rem;
              font-weight: 700;
              letter-spacing: 1px;
              transition: color 0.3s, transform 0.3s;
          }

          .footer-links a:hover {
              color: var(--secondary);
              text-decoration: underline;
          }

          /* ================= KEYFRAME ANIMATIONS ================= */
          @keyframes slideInLeft {
              0% { transform: translateX(-30px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
          }

          @keyframes slideInRight {
              0% { transform: translateX(30px); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
          }

          @keyframes slideUpFade {
              0% { transform: translateY(30px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes fillProgress {
              0% { width: 0%; }
              100% { width: 33.33%; }
          }

          @keyframes floatBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
          }

          /* Responsive */
          @media (max-width: 768px) {
              .form-grid { grid-template-columns: 1fr; }
              .onboarding-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
              .btn-skip { align-self: flex-start; }
              .footer { flex-direction: column; gap: 1.5rem; text-align: center; }
              .nav-links { display: none; }
          }
        `}
      </style>

      <nav className="navbar">
        <div className="logo">
          <span>P</span> Placify
        </div>
        <div className="nav-links">
          <a href="#">Browse Jobs</a>
          <a href="#">My Applications</a>
          <a href="#" style={{ color: 'var(--primary)' }}>Profile</a>
        </div>
      </nav>

      <div className="container">
        
        <div className="onboarding-header">
          <div className="title-area">
            <h1>Complete your Profile</h1>
            <p>Provide your details to unlock internship opportunities.</p>
          </div>
          <a href="#" className="btn-skip">
            Skip for Now 
            <span>&rarr;</span>
          </a>
        </div>

        <div className="progress-wrapper">
          <div className="progress-text">
            <span>Personal Information</span>
            <span>Section 1 of 3</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill"></div>
          </div>
        </div>

        <form className="form-card" action="#" method="POST">
          <div className="form-grid">
            
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. John Doe" required />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value="student@university.edu" disabled />
            </div>

            <div className="input-group">
              <label>Department / Stream</label>
              <input type="text" placeholder="e.g. Computer Science" required />
            </div>

            <div className="input-group">
              <label>College Name</label>
              <input type="text" placeholder="Enter full college name" required />
            </div>

            <div className="input-group">
              <label>Current Year of Study</label>
              <input type="text" placeholder="e.g. 3rd Year" required />
            </div>

            <div className="input-group">
              <label>Mobile Number</label>
              <input type="tel" placeholder="+91 00000 00000" required />
            </div>

            <div className="input-group">
              <label>City & State</label>
              <input type="text" placeholder="e.g. Pune, Maharashtra" required />
            </div>

            <div className="input-group">
              <label>LinkedIn Profile URL</label>
              <input type="url" placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="input-group full-width">
              <label>Professional Summary</label>
              <textarea placeholder="Write 2-3 lines about your skills, projects, and what kind of internship you are looking for..."></textarea>
            </div>

          </div>

          <div className="form-actions">
            <button type="reset" className="btn btn-clear">Clear Data</button>
            <button type="submit" className="btn btn-save">Save & Next</button>
          </div>
        </form>

      </div>

      <footer className="footer">
        <div className="footer-logo">
          &copy; 2026 Placify Portal
        </div>
        <div className="footer-links">
          <a href="#">PRIVACY POLICY</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">HELP CENTER</a>
        </div>
      </footer>
    </>
  );
};

export default ProfileComplete1;