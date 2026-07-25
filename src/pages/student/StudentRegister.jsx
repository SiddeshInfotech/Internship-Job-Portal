import React, { useState } from 'react';
import '../CompanyRegister.css';
import { Link, useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import BackToWebsite from "../../components/BackToWebsite";

function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', college: '', branch: '', year: '',
    experience_level: 'Fresher', years_of_experience: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.experience_level === 'Experienced' && !String(form.years_of_experience).trim()) {
      setError('Please enter your years of experience.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await studentAxios.post('/student/register', {
        name: form.name, email: form.email, password: form.password, college: form.college, branch: form.branch,
        experience_level: form.experience_level,
        years_of_experience: form.experience_level === 'Experienced' ? form.years_of_experience : 0,
      });
      navigate('/student/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register. Please check your details and try again.');
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
            <h2>Your next internship starts with a single step.</h2>
            <p>Join thousands of students across the nation connecting with top-tier companies and exclusive career opportunities.</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Premium Placements</h3>
                <p>Access to internships not listed on public job boards.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Verified Credentials</h3>
                <p>Stand out with an institutional-backed digital portfolio.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div className="feature-text-box">
                <h3>Career Mentorship</h3>
                <p>Built-in guides for resumes and technical interviews.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="footer-text">© 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED.</p>
      </div>

      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Create Student Account</h2>
          <p className="sub-title">Please provide your institutional details to get started.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div className="form-grid-row">
              <div className="input-group">
                <label>Full Name <span className="star-req">*</span></label>
                <input value={form.name} onChange={update('name')} placeholder="John Doe" required />
              </div>
              <div className="input-group">
                <label>College Email <span className="star-req">*</span></label>
                <input type="email" value={form.email} onChange={update('email')} placeholder="john@university.edu" required />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Password <span className="star-req">*</span></label>
                <input type="password" value={form.password} onChange={update('password')} placeholder="Min. 8 characters" minLength={8} required />
              </div>
              <div className="input-group">
                <label>Confirm Password <span className="star-req">*</span></label>
                <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Repeat password" required />
              </div>
            </div>

            <div className="input-group full-width-field">
              <label>College / Institution <span className="star-req">*</span></label>
              <input value={form.college} onChange={update('college')} placeholder="Select your university" required />
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Branch / Discipline <span className="star-req">*</span></label>
                <input value={form.branch} onChange={update('branch')} placeholder="e.g. Computer Science" required />
              </div>
              <div className="input-group">
                <label>Year of Study</label>
                <select value={form.year} onChange={update('year')}>
                  <option value="">Select year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year (Senior)</option>
                </select>
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Experience Level <span className="star-req">*</span></label>
                <select value={form.experience_level} onChange={update('experience_level')} required>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
              {form.experience_level === 'Experienced' && (
                <div className="input-group">
                  <label>Years of Experience <span className="star-req">*</span></label>
                  <input
                    type="number" min="0" max="50" step="0.5"
                    value={form.years_of_experience}
                    onChange={update('years_of_experience')}
                    placeholder="e.g. 2"
                    required
                  />
                </div>
              )}
            </div>

            <div className="checkbox-group align-top">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Accept terms and conditions <br />
                <span className="checkbox-subtext">By clicking, you agree to our Student User Agreement and Privacy Policy.</span>
              </label>
            </div>

            <div className="action-flex-row">
              <button type="submit" className="login-btn register-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
              Already have an account? <Link to="/student/login" style={{ color: '#ee5902', fontWeight: 600 }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentRegister;
