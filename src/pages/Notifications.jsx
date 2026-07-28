import React from 'react';
import './Notifications.css';

function Notifications() {
  const notificationsData = [
    { id: 1, type: 'student', title: 'New Student Registration', text: 'Sarah Jenkins has completed her profile and is pending verification.', time: '2 mins ago', isNew: true, icon: '👤+' },
    { id: 2, type: 'application', title: 'Priority Application', text: 'James Wilson applied for Senior Frontend Developer at TechCorp.', time: '15 mins ago', isNew: true, icon: '📄' },
    { id: 3, type: 'company', title: 'Company Update', text: 'Global Solutions Ltd. has updated their contact information.', time: '1 hour ago', isNew: true, icon: '🏢' },
    { id: 4, type: 'job', title: 'Job Post Approved', text: 'The "Marketing Specialist" role for Creative Minds is now live.', time: '3 hours ago', isNew: true, icon: '💼' },
    { id: 5, type: 'security', title: 'Security Alert', text: 'Multiple failed login attempts detected from IP 192.168.1.45.', time: '5 hours ago', isNew: false, icon: '⚠️' },
    { id: 6, type: 'application-old', title: 'New Application', text: '4 new students applied for the Graduate Engineering Program.', time: 'Yesterday', isNew: false, icon: '📄' },
    { id: 7, type: 'flagged', title: 'Profile Flagged', text: 'Student account "Robert Fox" has been flagged for missing documents.', time: 'Yesterday', isNew: false, icon: '⚠️' }
  ];

  return (
    <div className="notif-layout-wrapper">
      
      {/* 🔔 MAIN HEADER AREA */}
      <div className="notif-header-title-bar">
        <div>
          <h2>Notifications</h2>
        </div>
      </div>

      {/* 📦 NOTIFICATIONS WRAPPER CARD */}
      <div className="notif-card-container">
        
        <div className="notif-system-update-header">
          <div className="notif-title-badge-flex">
            <span className="notif-bell-icon">🔔</span>
            <div className="notif-text-headline">
              <h3>System Updates</h3>
              <p>Manage your recent activity and administrative alerts.</p>
            </div>
          </div>
          <div className="notif-header-actions">
            <span className="notif-count-pill">4 NEW</span>
            <button className="notif-mark-read-btn">Mark all as read</button>
          </div>
        </div>

        {/* LIST ITEM TRACKER */}
        <div className="notif-items-list-stack">
          {notificationsData.map((notif) => (
            <div key={notif.id} className={`notif-item-row ${notif.isNew ? 'unread' : ''}`}>
              <div className="notif-item-left-block">
                <div className={`notif-icon-avatar-badge ${notif.type}`}>
                  {notif.icon}
                </div>
                <div className="notif-details-content">
                  <h4 className="notif-item-title">
                    {notif.title}
                    {notif.isNew && <span className="orange-dot-indicator">●</span>}
                  </h4>
                  <p className="notif-item-desc">{notif.text}</p>
                </div>
              </div>
              <div className="notif-item-right-block">
                <span className="notif-timestamp-clock">🕒 {notif.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="notif-footer-history-bar">
          <button className="notif-history-trigger-btn">View Notification History</button>
        </div>
      </div>

      {/* 📊 BOTTOM METRIC CARDS TRACKER */}
      <div className="notif-metrics-triple-grid">
        <div className="notif-metric-mini-card verified">
          <span className="mini-badge-check">✓</span>
          <div>
            <p className="mini-card-label">VERIFIED</p>
            <h3 className="mini-card-num">124</h3>
          </div>
        </div>

        <div className="notif-metric-mini-card pending">
          <span className="mini-badge-clock">⌛</span>
          <div>
            <p className="mini-card-label">PENDING</p>
            <h3 className="mini-card-num">4</h3>
          </div>
        </div>

        <div className="notif-metric-mini-card flagged">
          <span className="mini-badge-alert">⚠️</span>
          <div>
            <p className="mini-card-label">FLAGGED</p>
            <h3 className="mini-card-num">3</h3>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Notifications;