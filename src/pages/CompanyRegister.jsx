import React, { useState } from 'react';
import './CompanyRegister.css';
import { Link, useNavigate } from "react-router-dom";
import clientAxios from "../api/clientAxios";
import BackToWebsite from "../components/BackToWebsite";

function CompanyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '', email: '', password: '', confirmPassword: '',
    industry: '', website: '',
    address: '', city: '', state: '', pincode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await clientAxios.post('/client/register', {
        company_name: form.company_name,
        email: form.email,
        password: form.password,
        industry: form.industry,
        website: form.website || undefined,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode || undefined,
      });
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <BackToWebsite />
      
      {/* LEFT BLUE PANEL - Same Identity as Login */}
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

          {/* Contextual Texts changed for Registration */}
          <div className="hero-content">
            <h2>Expand your campus hiring network.</h2>
            <p>
              Create a corporate account to tap into top-tier university talent pools, schedule drives, and automate your entire recruitment workflow seamlessly.
            </p>
          </div>

          {/* Custom Feature Items for registration */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="feature-text-box">
                <h3>Direct Talent Access</h3>
                <p>Filter and connect with verified, placement-ready profiles instantly.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><line x1="12" y1="12" x2="12" y2="21"></line></svg>
              </div>
              <div className="feature-text-box">
                <h3>Drive Management</h3>
                <p>Post job tracks, coordinate interviews, and track offers on one unified dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="footer-text">
          © 2026 PLACIFY PORTAL. OPTIMIZED FOR ENTERPRISE RECRUITMENT.
        </p>
      </div>

      {/* RIGHT PANEL - Clean Registration Layout */}
      <div className="right-panel">
        <div className="login-box-wide">
          <h2>Register your company</h2>
          <p className="sub-title">Join our hiring network to discover premium student talent.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Two Column Fields */}
            <div className="form-grid-row">
              <div className="input-group">
                <label>Company Name <span className="star-req">*</span></label>
                <input type="text" placeholder="e.g. Acme Tech Solutions" value={form.company_name} onChange={update('company_name')} required />
              </div>
              <div className="input-group">
                <label>Official Email <span className="star-req">*</span></label>
                <input type="email" placeholder="hiring@company.com" value={form.email} onChange={update('email')} required />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Password <span className="star-req">*</span></label>
                <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} minLength={8} required />
              </div>
              <div className="input-group">
                <label>Confirm Password <span className="star-req">*</span></label>
                <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>Industry <span className="star-req">*</span></label>
                <select required value={form.industry} onChange={update('industry')}>
                  <option value="" disabled>Select industry</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Finance / Fintech">Finance / Fintech</option>
                  <option value="Consulting / Management">Consulting / Management</option>
                </select>
              </div>
              <div className="input-group">
                <label>Website URL</label>
                <input type="url" placeholder="https://www.yourcompany.com" value={form.website} onChange={update('website')} />
              </div>
            </div>

            <div className="input-group full-width-field">
              <label>Company Address <span className="star-req">*</span></label>
              <input
                required
                placeholder="Street, area, landmark"
                value={form.address}
                onChange={update('address')}
              />
            </div>

            <div className="form-grid-row">
              <div className="input-group">
                <label>City <span className="star-req">*</span></label>
                <input required placeholder="e.g. Dhule" value={form.city} onChange={update('city')} />
              </div>
              <div className="input-group">
                <label>State <span className="star-req">*</span></label>
                <input required placeholder="e.g. Maharashtra" value={form.state} onChange={update('state')} />
              </div>
              <div className="input-group">
                <label>Pin Code</label>
                <input placeholder="e.g. 424001" value={form.pincode} onChange={update('pincode')} />
              </div>
            </div>

            <div className="checkbox-group align-top">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the Terms of Service <br />
                <span className="checkbox-subtext">By checking this box, you agree to our processing of data for recruitment purposes.</span>
              </label>
            </div>

            <div className="action-flex-row">
              <button type="submit" className="login-btn register-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
             <Link to="/company/login"> 
              <button type="button" className="back-btn">
                ← Back to sign in
              </button>
             </Link> 
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default CompanyRegister;