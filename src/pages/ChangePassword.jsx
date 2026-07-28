import React, { useState } from 'react';
import './ChangePassword.css';

function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="sec-layout-wrapper">
      
      {/* 🧭 BACK HEADER SECTION */}
      <div className="sec-header-navigation">
        <h2 className="sec-view-title">Security Settings</h2>
        <button className="sec-back-nav-trigger">← Back to Dashboard Overview</button>
      </div>

      {/* 🛡️ SECURITY MANAGEMENT CARD */}
      <div className="sec-form-central-card">
        <div className="sec-card-header-caption">
          <span className="sec-shield-glyph">🛡️</span>
          <div className="sec-caption-text-block">
            <h3>Update Password</h3>
            <p>Manage your institutional account security</p>
          </div>
        </div>

        <form className="sec-password-inputs-form" onSubmit={(e) => e.preventDefault()}>
          
          {/* 1. CURRENT PASSWORD ENTRY */}
          <div className="sec-input-wrapper-field">
            <label className="sec-field-label">Current Password</label>
            <div className="sec-interactive-input-box">
              <span className="sec-input-leading-icon">🔒</span>
              <input 
                type={showCurrent ? "text" : "password"} 
                placeholder="Enter existing password" 
              />
              <span 
                className="sec-input-trailing-toggle" 
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {/* 2. NEW PASSWORD ENTRY */}
          <div className="sec-input-wrapper-field">
            <div className="sec-label-flex-spacer">
              <label className="sec-field-label">New Password</label>
              <span className="sec-field-requirement-hint">MIN 10 CHARACTERS</span>
            </div>
            <div className="sec-interactive-input-box">
              <span className="sec-input-leading-icon">🔒</span>
              <input 
                type={showNew ? "text" : "password"} 
                placeholder="Create complex password" 
              />
              <span 
                className="sec-input-trailing-toggle" 
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {/* 📊 COMPLEXITY METER FRAMEWORK */}
          <div className="sec-strength-meter-container">
            <div className="sec-strength-labels-row">
              <span className="sec-meter-caption">Security Strength</span>
              <span className="sec-meter-status-flag threat-level-weak">TOO WEAK</span>
            </div>
            <div className="sec-meter-segmented-bars">
              <div className="sec-bar-segment status-active-weak"></div>
              <div className="sec-bar-segment"></div>
              <div className="sec-bar-segment"></div>
              <div className="sec-bar-segment"></div>
            </div>
          </div>

          {/* 3. CONFIRM NEW PASSWORD */}
          <div className="sec-input-wrapper-field">
            <label className="sec-field-label">Confirm New Password</label>
            <div className="sec-interactive-input-box">
              <span className="sec-input-leading-icon">🔒</span>
              <input 
                type={showConfirm ? "text" : "password"} 
                placeholder="Verify new password" 
              />
              <span 
                className="sec-input-trailing-toggle" 
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {/* 💡 POLICY INFO BANNER */}
          <div className="sec-policy-info-alert-card">
            <span className="sec-info-alert-icon">ℹ️</span>
            <p className="sec-info-alert-text">
              For better security, use a combination of letters, numbers, and symbols. Avoid using common words or birthdays associated with your profile.
            </p>
          </div>

          {/* ⚙️ SUBMIT ACTION CLUSTERS */}
          <div className="sec-form-actions-stack">
            <button type="submit" className="sec-orange-submit-cta-btn">Update Password</button>
            <button type="button" className="sec-cancel-secondary-btn">Cancel Changes</button>
          </div>

        </form>

        <div className="sec-card-footer-help-zone">
          <p>Forgotten your current password? <span className="sec-hyperlink-trigger">Contact System Administrator</span></p>
        </div>

      </div>

    </div>
  );
}

export default ChangePassword;