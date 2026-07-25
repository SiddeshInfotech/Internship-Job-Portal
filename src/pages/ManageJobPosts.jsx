import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import { pick, fmtDate } from '../utils/fields';
import { useToast } from '../context/ToastContext';
import TopNavbar from '../components/TopNavbar';
import ConfirmModal from '../components/ConfirmModal';
import './ManageJobPosts.css';

const PER_PAGE = 10;

function ManageJobPosts() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadStats = async () => {
    let base = null;
    try {
      const res = await axiosClient.get('/admin/jobs/stats');
      base = res.data.stats || res.data;
    } catch {
      // stats endpoint missing — derive below
    }
    const resolved = {
      total_posts: pick(base || {}, 'total_posts', 'total', 'total_jobs'),
      pending_review: pick(base || {}, 'pending_review', 'pending'),
      active_jobs: pick(base || {}, 'active_jobs', 'active', 'approved'),
      total_applications: pick(base || {}, 'total_applications', 'applications', 'total_applied'),
    };
    // Derive missing counts from the jobs list endpoint's `total` field.
    const statusFor = { total_posts: undefined, pending_review: 'Pending', active_jobs: 'Approved' };
    const needs = Object.entries(resolved).filter(([k, v]) => v === undefined && k in statusFor);
    if (needs.length) {
      try {
        const results = await Promise.all(needs.map(([key]) =>
          axiosClient.get('/admin/jobs', { params: { status: statusFor[key], page: 1, per_page: 1 } })
        ));
        needs.forEach(([key], i) => { resolved[key] = results[i].data.total ?? 0; });
      } catch { /* cards show an em dash */ }
    }
    setStats(resolved);
  };

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/admin/jobs', {
        params: { search: search || undefined, status: statusFilter || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.jobs, data.results, data);
      setJobs(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load job posts. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    const timer = setTimeout(loadJobs, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { jobId, type } = confirmAction;
      if (type === 'approve') await axiosClient.patch(`/admin/jobs/${jobId}/approve`);
      if (type === 'reject') await axiosClient.patch(`/admin/jobs/${jobId}/reject`);
      if (type === 'close') await axiosClient.patch(`/admin/jobs/${jobId}/close`);
      const msg = { approve: 'Job post approved! 🎉', reject: 'Job post rejected.', close: 'Job post closed.' }[type];
      showToast(msg, type === 'approve' ? 'success' : 'info');
      setConfirmAction(null);
      loadJobs();
      loadStats();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    approve: { title: 'Approve Job Post', message: `Approve "${confirmAction?.title}"? It will become visible to students immediately.`, confirmLabel: 'Approve Job', color: '#16a34a' },
    reject: { title: 'Reject Job Post', message: `Reject "${confirmAction?.title}"? The company will be notified via email.`, confirmLabel: 'Reject Job', color: '#dc2626' },
    close: { title: 'Close Job Post', message: `Close "${confirmAction?.title}"? It will stop accepting new applications.`, confirmLabel: 'Close Job', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main className="mjp-main-body">
      <TopNavbar title="Manage Job Posts" />

      <div className="page-intro-header">
        <h3>Job Moderation Queue</h3>
        <p>Review and manage job opportunities submitted by partner companies. Ensure all postings meet institutional standards before approving them for student visibility.</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
      )}

      {/* 📊 METRICS ROW */}
      <section className="mjp-metrics-row">
        <div className="mjp-metric-card">
          <p className="mjp-label">TOTAL POSTS</p>
          <h2 className="mjp-value-num">{stats?.total_posts ?? '—'}</h2>
        </div>
        <div className="mjp-metric-card">
          <p className="mjp-label orange-txt">PENDING REVIEW</p>
          <h2 className="mjp-value-num orange-txt">{stats?.pending_review ?? '—'}</h2>
        </div>
        <div className="mjp-metric-card">
          <p className="mjp-label green-txt">ACTIVE JOBS</p>
          <h2 className="mjp-value-num green-txt">{stats?.active_jobs ?? '—'}</h2>
        </div>
        <div className="mjp-metric-card">
          <p className="mjp-label blue-txt">TOTAL APPLICATIONS</p>
          <h2 className="mjp-value-num blue-txt">{stats?.total_applications ?? '—'}</h2>
        </div>
      </section>

      {/* 🔍 FILTERS SYSTEM BAR */}
      <section className="mjp-action-bar">
        <div className="search-input-box">
          <input
            type="text"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="🔍 Search job titles or companies..."
          />
        </div>
        <div className="filter-dropdown-box">
          <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </section>

      {/* 📑 JOBS CENTRAL TABLE */}
      <section className="mjp-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading job posts...</div>
        ) : (
        <>
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
            {jobs.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No job posts found</td></tr>
            )}
            {jobs.map((job) => {
              const st = (job.status || '').toLowerCase();
              return (
              <tr key={job.id}>
                <td className="job-title-cell" style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/jobs/${job.id}`)}>{job.title}</td>
                <td className="company-cell">🏢 {job.company_name || job.company}</td>
                <td className="date-cell">📅 {fmtDate(pick(job, 'posted_date', 'date', 'created_at', 'posted_on', 'posted_at'))}</td>
                <td className="apps-count-cell">{pick(job, 'applications_count', 'applicants_count', 'total_applications', 'app_count', 'apps') ?? (Array.isArray(job.applications) ? job.applications.length : 0)}</td>
                <td>
                  <span className={`mjp-status-pill ${st}`}>
                    {job.status}
                  </span>
                </td>
                <td>
                  <div className="mjp-action-group">
                    {st !== 'approved' && (
                      <button className="mjp-icon-btn check-icon" title="Approve" onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'approve' })}>✔️</button>
                    )}
                    {st !== 'rejected' && st !== 'closed' && (
                      <button className="mjp-icon-btn cross-icon" title="Reject" onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'reject' })}>🚫</button>
                    )}
                    <button className="mjp-view-btn" onClick={() => navigate(`/admin/jobs/${job.id}`)}>View</button>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>

        {/* TABLE FOOTER WITH PAGINATION */}
        <div className="table-footer-pagination">
          <span className="results-count-txt">
            Showing <b>{jobs.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {(page - 1) * PER_PAGE + jobs.length}</b> of <b>{total}</b> job posts
          </span>
          <div className="pagination-pills">
            <button className="arrow-pill" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
            <span style={{ fontSize: '13px', color: '#334155', padding: '0 8px' }}>Page {page} of {totalPages}</span>
            <button className="arrow-pill" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
          </div>
        </div>
        </>
        )}
      </section>

      {/* 📘 BOTTOM INFORMATIONAL GRID */}
      <section className="mjp-bottom-grid">
        <div className="guidelines-card">
          <h4>📋 Moderation Guidelines</h4>
          <ul>
            <li>Verify company contact email domain matches official records.</li>
            <li>Ensure salary ranges are compliant with institutional policies.</li>
            <li>Check for inclusive language and diversity requirements.</li>
            <li>Reject postings with suspicious external links or payment requests.</li>
          </ul>
        </div>

        <div className="admin-actions-card">
          <h4>⚡ Administrator Actions</h4>
          <p>Approved jobs are instantly pushed to the Student Job Board. Rejected jobs notify the company via their registered email.</p>
          <button className="view-analytics-btn" onClick={() => navigate('/admin/reports')}>View Analytics Reports</button>
        </div>
      </section>

      {modalCopy && (
        <ConfirmModal
          open={!!confirmAction}
          title={modalCopy.title}
          message={modalCopy.message}
          confirmLabel={modalCopy.confirmLabel}
          confirmColor={modalCopy.color}
          onConfirm={runAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </main>
  );
}

export default ManageJobPosts;
