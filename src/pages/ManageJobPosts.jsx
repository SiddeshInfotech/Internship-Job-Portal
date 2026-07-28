import React from 'react';
import './ManageJobPosts.css';

function ManageJobPosts() {
  const jobsData = [
    { title: "Senior Software Engineer", company: "TechNova Solutions", date: "Oct 12, 2023", apps: 49, status: "ACTIVE" },
    { title: "Product Marketing Manager", company: "Global Brands Inc.", date: "Oct 14, 2023", apps: 12, status: "PENDING" },
    { title: "Data Scientist Intern", company: "Insight Analytics", date: "Oct 15, 2023", apps: 89, status: "ACTIVE" },
    { title: "UX/UI Designer", company: "Creative Pulse", date: "Oct 16, 2023", apps: 0, status: "REJECTED" },
    { title: "Financial Analyst", company: "Wealth Path Capital", date: "Oct 17, 2023", apps: 5, status: "PENDING" },
    { title: "Sales Operations Lead", company: "NextGen Systems", date: "Oct 18, 2023", apps: 23, status: "ACTIVE" },
    { title: "Content Strategist", company: "Media Flow", date: "Oct 19, 2023", apps: 8, status: "PENDING" }
  ];

  return (
    <main className="mjp-main-body">
        <header className="mjp-top-navbar">
          <div className="nav-left-title">
            <h2>Manage Job Posts</h2>
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

        {/* TITLE & DESCRIPTION */}
        <div className="page-intro-header">
          <h3>Job Moderation Queue</h3>
          <p>Review and manage job opportunities submitted by partner companies. Ensure all postings meet institutional standards before approving them for student visibility.</p>
        </div>

        {/* 📊 METRICS ROW */}
        <section className="mjp-metrics-row">
          <div className="mjp-metric-card">
            <p className="mjp-label">TOTAL POSTS</p>
            <h2 className="mjp-value-num">128</h2>
            <span className="mjp-trend-sub">+10 this week</span>
          </div>
          <div className="mjp-metric-card">
            <p className="mjp-label orange-txt">PENDING REVIEW</p>
            <h2 className="mjp-value-num orange-txt">14</h2>
            <span className="mjp-trend-sub">Avg response: 4h</span>
          </div>
          <div className="mjp-metric-card">
            <p className="mjp-label green-txt">ACTIVE JOBS</p>
            <h2 className="mjp-value-num green-txt">92</h2>
            <span className="mjp-trend-sub">Across 44 companies</span>
          </div>
          <div className="mjp-metric-card">
            <p className="mjp-label blue-txt">TOTAL APPLICATIONS</p>
            <h2 className="mjp-value-num blue-txt">1,452</h2>
            <span className="mjp-trend-sub">High engagement rate</span>
          </div>
        </section>

        {/* 🔍 FILTERS SYSTEM BAR */}
        <section className="mjp-action-bar">
          <div className="search-input-box">
            <input type="text" placeholder="🔍 Search job titles or companies..." />
          </div>
          <div className="filter-dropdown-box">
            <select defaultValue="all">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="export-btn">📥 Export</button>
          <button className="add-job-btn">➕ Add Job Post</button>
        </section>

        {/* 📑 JOBS CENTRAL TABLE */}
        <section className="mjp-table-container">
          <table className="mjp-data-table">
            <thead>
              <tr>
                <th>JOB TITLE</th>
                <th>COMPANY</th>
                <th>POSTED DATE</th>
                <th style={{ textAlign: 'center' }}>APPLICATIONS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {jobsData.map((job, idx) => (
                <tr key={idx}>
                  <td className="job-title-cell">{job.title}</td>
                  <td className="company-cell">🏢 {job.company}</td>
                  <td className="date-cell">📅 {job.date}</td>
                  <td className="apps-count-cell">{job.apps}</td>
                  <td>
                    <span className={`mjp-status-pill ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="mjp-action-group">
                      <button className="mjp-icon-btn check-icon" title="Approve">✔️</button>
                      <button className="mjp-icon-btn cross-icon" title="Reject">🚫</button>
                      <button className="mjp-view-btn">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TABLE FOOTER WITH PAGINATION */}
          <div className="table-footer-pagination">
            <span className="results-count-txt">Showing <b>1 to 7</b> of <b>128</b> job posts</span>
            <div className="pagination-pills">
              <button className="arrow-pill">‹</button>
              <button className="num-pill active">1</button>
              <button className="num-pill">2</button>
              <button className="num-pill">3</button>
              <span className="dots-pill">...</span>
              <button className="num-pill">18</button>
              <button className="arrow-pill">›</button>
            </div>
          </div>
        </section>

        {/* 📘 BOTTOM INFORMATIONAL GRID */}
        <section className="mjp-bottom-grid">
          {/* Moderation Guidelines */}
          <div className="guidelines-card">
            <h4>📋 Moderation Guidelines</h4>
            <ul>
              <li>Verify company contact email domain matches official records.</li>
              <li>Ensure salary ranges are compliant with institutional policies.</li>
              <li>Check for inclusive language and diversity requirements.</li>
              <li>Reject postings with suspicious external links or payment requests.</li>
            </ul>
          </div>

          {/* Administrator Actions */}
          <div className="admin-actions-card">
            <h4>⚡ Administrator Actions</h4>
            <p>Approved jobs are instantly pushed to the Student Job Board. Rejected jobs notify the company via their registered email.</p>
            <button className="view-analytics-btn">View Analytics Reports</button>
          </div>
        </section>

      </main>
  );
}

export default ManageJobPosts;