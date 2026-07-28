import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardOverview() {
  const navigate = useNavigate();
  const applications = [
    { name: "Arjun Sharma", college: "IIT Delhi", role: "Senior Product Designer", company: "Google India", date: "Oct 24, 2023", status: "PENDING" },
    { name: "Priya Patel", college: "BITS Pilani", role: "Software Engineer Intern", company: "Microsoft", date: "Oct 23, 2023", status: "APPROVED" },
    { name: "Rohan Das", college: "NIT Trichy", role: "Data Analyst", company: "Zomato", date: "Oct 22, 2023", status: "REJECTED" },
    { name: "Ananya Iyer", college: "SRM University", role: "Marketing Associate", company: "Reliance", date: "Oct 22, 2023", status: "PENDING" },
    { name: "Vikram Seth", college: "VIT Vellore", role: "Full Stack Developer", company: "CRED", date: "Oct 21, 2023", status: "APPROVED" }
  ];

  return (
    <main className="db-main-body">
      <header className="db-top-navbar">
        <div className="nav-left-title">
          <h2>Dashboard Overview</h2>
        </div>
        <div className="nav-right-controls">
          <div className="search-bar-wrapper">
            <input type="text" placeholder="🔍 Search dashboard..." />
          </div>
          <div className="admin-profile-identity">
            <div className="profile-text-node">
              <h4>Super Admin</h4>
              <p>INSTITUTIONAL ROLE</p>
            </div>
            <div className="avatar-circle">SA</div>
          </div>
        </div>
      </header>

      {/* 📊 METRICS PANEL ROW */}
      <section className="metrics-cards-row">
        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL STUDENTS</p>
              <h2 className="card-value-num">12,482</h2>
            </div>
            <div className="card-icon-slot student-bg">👥</div>
          </div>
          <span className="card-trend-pill up-green">+12% vs. previous month</span>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL COMPANIES</p>
              <h2 className="card-value-num">845</h2>
            </div>
            <div className="card-icon-slot company-bg">🏢</div>
          </div>
          <span className="card-trend-pill up-green">+4.5% vs. previous month</span>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL JOB POSTS</p>
              <h2 className="card-value-num">3,120</h2>
            </div>
            <div className="card-icon-slot job-bg">💼</div>
          </div>
          <span className="card-trend-pill up-green">+8.2% vs. previous month</span>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL APPLICATIONS</p>
              <h2 className="card-value-num">45,902</h2>
            </div>
            <div className="card-icon-slot app-bg">📄</div>
          </div>
          <span className="card-trend-pill down-red">-2.1% vs. previous month</span>
        </div>
      </section>

      <div className="dashboard-double-columns">
        {/* RECENT APPLICATIONS */}
        <div className="table-data-card">
          <div className="card-header-flex">
            <div>
              <h3>Recent Applications</h3>
              <p className="sub-caption">Monitor the latest student job requests</p>
            </div>
            <button className="view-all-btn-action">View All Applications</button>
          </div>

          <table className="visily-data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job & Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-fake-avatar">{item.name.charAt(0)}</div>
                      <div>
                        <p className="student-name-txt">{item.name}</p>
                        <p className="student-clg-txt">{item.college}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="job-role-title">{item.role}</p>
                    <p className="job-company-title">🏢 {item.company}</p>
                  </td>
                  <td className="date-cell-txt">{item.date}</td>
                  <td>
                    <span className={`status-badge-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="table-action-link-btn">↗ View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* QUICK ACTIONS */}
        <div className="actions-sidebar-card">
          <div className="action-card-header">
            <h3>Institutional Quick Actions</h3>
            <p className="sub-caption">Common administrative tasks and workflows.</p>
          </div>
          <div className="quick-buttons-stack">
           <button className="primary-orange-action-btn" onClick={() => navigate("/admin/jobs")}>
  ➕ Create New Job Post
</button>
            <button className="secondary-outline-action-btn" onClick={() => navigate("/admin/reports")}>
  📥 Export Performance Reports
</button>
           <button className="secondary-outline-action-btn" onClick={() => navigate("/admin/notifications")}>
  🔔 Manage System Alerts
</button>
            <button className="secondary-outline-action-btn" onClick={() => navigate("/admin/companies")}>
  🔍 Verify Company Profiles
</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardOverview;