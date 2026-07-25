import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import StatusPill from '../../components/StatusPill';
import ProfileCompletionBanner from '../../components/ProfileCompletionBanner';

function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePct, setProfilePct] = useState(100); // assume complete until known

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentRes, activeRes] = await Promise.all([
          clientAxios.get('/client/dashboard/stats'),
          clientAxios.get('/client/dashboard/recent-applications'),
          clientAxios.get('/client/dashboard/active-jobs'),
        ]);
        if (cancelled) return;
        setStats(statsRes.data.stats || statsRes.data);
        setApplications(asArray(recentRes.data.applications, recentRes.data));
        setActiveJobs(asArray(activeRes.data.jobs, activeRes.data));

        // Profile completeness for the reminder banner (same fields the
        // Company Profile overview checks).
        try {
          const profRes = await clientAxios.get('/client/profile');
          const p = profRes.data.profile || profRes.data;
          // Prefer the backend's own completion number if it sends one.
          if (typeof p.profile_completion === 'number') {
            if (!cancelled) setProfilePct(p.profile_completion);
          } else {
            const fields = ['company_name', 'industry', 'contact', 'address', 'company_size', 'year_established',
              'city', 'pincode', 'state', 'hr_name', 'hr_contact_email', 'about_company', 'company_summary',
              'hiring_locations', 'preferred_job_types', 'company_registration_number', 'terms_accepted'];
            const done = fields.filter((f) => {
              const v = p[f];
              return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '';
            }).length;
            if (!cancelled) setProfilePct(Math.round((done / fields.length) * 100));
          }
        } catch { /* banner simply won't show */ }
      } catch (err) {
        if (!cancelled) setError('Could not load dashboard data. ' + (err.response?.data?.message || err.message));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // "Closing Soon" = deadline within 7 days, computed client-side per the doc
  const isClosingSoon = (job) => {
    if (!job.last_date_to_apply) return false;
    const days = (new Date(job.last_date_to_apply) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  };

  let clientName = 'Company';
  try {
    const stored = sessionStorage.getItem('client_info');
    if (stored) clientName = JSON.parse(stored).company_name || 'Company';
  } catch { /* ignore */ }

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Dashboard" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <ProfileCompletionBanner percent={profilePct} to="/company-profile" />

      <div className="cp-page-head">
        <div>
          <h1>Welcome back, {clientName}</h1>
          <p>Here is what's happening with your recruitment funnel today.</p>
        </div>
        <button onClick={() => navigate('/jobs/new')} className="pf-btn pf-btn-ember">
          ＋ Post a new job
        </button>
      </div>

      {loading ? (
        <>
          <section className="cp-metrics-row" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cp-metric-card">
                <div className="pf-skeleton" style={{ width: 38, height: 38, borderRadius: 11, marginBottom: 12 }} />
                <div className="pf-skeleton" style={{ width: '45%', height: 24, marginBottom: 8 }} />
                <div className="pf-skeleton" style={{ width: '70%', height: 12 }} />
              </div>
            ))}
          </section>
          <div className="cp-panel" aria-label="Loading dashboard">
            {[0, 1, 2].map((i) => (
              <div key={i} className="cp-skel-row">
                <div className="pf-skeleton" style={{ width: 36, height: 36, borderRadius: 11 }} />
                <div style={{ flex: 1 }}>
                  <div className="pf-skeleton" style={{ width: '35%', height: 13, marginBottom: 7 }} />
                  <div className="pf-skeleton" style={{ width: '22%', height: 11 }} />
                </div>
                <div className="pf-skeleton" style={{ width: 74, height: 22, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        </>
      ) : (
      <>
      <section className="cp-metrics-row">
        <MetricCard icon="💼" label="Active Job Posts" value={stats?.active_job_posts} />
        <MetricCard icon="👥" label="Total Applicants" value={stats?.total_applicants} />
        <MetricCard icon="✅" label="Shortlisted" value={stats?.shortlisted} />
        <MetricCard icon="📄" label="Offers Made" value={stats?.offers_made} />
      </section>

      <div className="cp-dash-grid">
        <div className="cp-panel">
          <div className="cp-panel-head">
            <h3>Recent Applications</h3>
            <button onClick={() => navigate('/applicants')} className="cp-link-btn">View all applicants ›</button>
          </div>

          {applications.length === 0 && (
            <div className="cp-empty">
              <div className="cp-empty-icon" aria-hidden="true">📭</div>
              No recent applications yet. New candidates will show up here.
            </div>
          )}
          {applications.map((app, idx) => (
            <div key={app.id || idx} className="cp-list-row">
              <div className="cp-list-ident">
                <div className="cp-list-avatar">{(app.student_name || app.name || '?').charAt(0)}</div>
                <div style={{ minWidth: 0 }}>
                  <p className="cp-list-name">{app.student_name || app.name}</p>
                  <p className="cp-list-sub">{app.job_title || app.role}</p>
                </div>
              </div>
              <div className="cp-list-meta">
                <span className="cp-list-date">{app.applied_date || app.time_ago}</span>
                <StatusPill status={app.status} />
                <button
                  className="cp-chevron"
                  aria-label={`Open ${app.student_name || app.name || 'applicant'}'s profile`}
                  onClick={() => navigate(`/applicants/${app.id}`)}
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cp-panel">
          <div className="cp-panel-head">
            <h3>Active Jobs</h3>
            <button onClick={() => navigate('/jobs')} className="cp-link-btn">Manage ›</button>
          </div>
          {activeJobs.length === 0 && (
            <div className="cp-empty">
              <div className="cp-empty-icon" aria-hidden="true">💼</div>
              No active jobs right now. Post one to start hiring.
            </div>
          )}
          {activeJobs.map((job, idx) => (
            <div key={job.id || idx} className="cp-job-row" onClick={() => navigate(`/jobs/${job.id}/applicants`)}>
              <div className="cp-job-row-top">
                <p className="cp-job-title">{job.title}</p>
                {isClosingSoon(job)
                  ? <span className="pf-pill pf-pill-amber">Closing Soon</span>
                  : <span className="pf-pill pf-pill-green">Active</span>}
              </div>
              <p className="cp-job-sub">{job.applicants_count ?? job.applications_count ?? 0} applicants</p>
            </div>
          ))}

          <div className="cp-tip-box">
            <span aria-hidden="true">💡</span>
            <span><b>Recruitment tip:</b> jobs with detailed eligibility criteria and clear salary ranges get 40% more qualified applicants.</span>
          </div>
        </div>
      </div>
      </>
      )}
    </main>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="cp-metric-card">
      <div className="cp-metric-icon" aria-hidden="true">{icon}</div>
      <h2>{value ?? '—'}</h2>
      <p>{label}</p>
    </div>
  );
}

export default ClientDashboard;
