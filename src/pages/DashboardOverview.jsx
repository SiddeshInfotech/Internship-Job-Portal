import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import TopNavbar from '../components/TopNavbar';
import { pick, fmtDate } from '../utils/fields';

function DashboardOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentRes] = await Promise.all([
          axiosClient.get('/admin/dashboard/stats'),
          axiosClient.get('/admin/dashboard/recent-applications'),
        ]);
        if (cancelled) return;
        setStats(statsRes.data.stats || statsRes.data);
        // Backend may wrap the list under a key or return it directly
        setApplications(asArray(recentRes.data.applications, recentRes.data));
      } catch (err) {
        if (!cancelled) setError('Could not load dashboard data. ' + (err.response?.data?.message || err.message));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="db-main-body">
      <TopNavbar title="Dashboard Overview" />

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading dashboard...</div>
      )}

      {!loading && stats && (
      <>
      {/* 📊 METRICS PANEL ROW */}
      <section className="metrics-cards-row">
        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL STUDENTS</p>
              <h2 className="card-value-num">{(stats.total_students ?? 0).toLocaleString()}</h2>
            </div>
            <div className="card-icon-slot student-bg">👥</div>
          </div>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL COMPANIES</p>
              <h2 className="card-value-num">{(stats.total_companies ?? 0).toLocaleString()}</h2>
            </div>
            <div className="card-icon-slot company-bg">🏢</div>
          </div>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL JOB POSTS</p>
              <h2 className="card-value-num">{(stats.total_job_posts ?? 0).toLocaleString()}</h2>
            </div>
            <div className="card-icon-slot job-bg">💼</div>
          </div>
        </div>

        <div className="metric-panel-card">
          <div className="card-top-flex">
            <div>
              <p className="card-label">TOTAL APPLICATIONS</p>
              <h2 className="card-value-num">{(stats.total_applications ?? 0).toLocaleString()}</h2>
            </div>
            <div className="card-icon-slot app-bg">📄</div>
          </div>
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
            <button className="view-all-btn-action" onClick={() => navigate('/admin/applications')}>View All Applications</button>
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
              {applications.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No recent applications</td></tr>
              )}
              {applications.map((item, idx) => {
                const name = item.student_name || item.name || '—';
                const college = item.college || item.institution || '';
                const role = item.job_title || item.role || '—';
                const company = item.company_name || item.company || '';
                const date = fmtDate(pick(item, 'applied_date', 'date', 'created_at'));
                const status = item.status || 'PENDING';
                return (
                <tr key={item.id || idx}>
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-fake-avatar">{name.charAt(0)}</div>
                      <div>
                        <p className="student-name-txt">{name}</p>
                        <p className="student-clg-txt">{college}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="job-role-title">{role}</p>
                    <p className="job-company-title">🏢 {company}</p>
                  </td>
                  <td className="date-cell-txt">{date}</td>
                  <td>
                    <span className={`status-badge-pill ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button className="table-action-link-btn" onClick={() => navigate(`/admin/applications/${item.id}`)}>↗ View</button>
                  </td>
                </tr>
              );})}
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
            <button className="primary-orange-action-btn" onClick={() => navigate('/admin/jobs')}>➕ Create New Job Post</button>
            <button className="secondary-outline-action-btn" onClick={() => navigate('/admin/reports')}>📥 Export Performance Reports</button>
            <button className="secondary-outline-action-btn" onClick={() => navigate('/admin/notifications')}>🔔 Manage System Alerts</button>
            <button className="secondary-outline-action-btn" onClick={() => navigate('/admin/companies')}>🔍 Verify Company Profiles</button>
          </div>
        </div>
      </div>
      </>
      )}
    </main>
  );
}

export default DashboardOverview;