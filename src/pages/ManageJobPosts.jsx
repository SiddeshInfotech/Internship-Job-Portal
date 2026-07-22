import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { asArray } from '../api/asArray';
import { pick, fmtDate } from '../utils/fields';
import TopNavbar from '../components/TopNavbar';
import ConfirmModal from '../components/ConfirmModal';
import './ManageJobPosts.css'; // Kept original import in case of global resets

const PER_PAGE = 10;

function ManageJobPosts() {
  const navigate = useNavigate();
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

  // Helper for dynamic status colors
  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved' || s === 'active') return { bg: '#dcfce7', text: '#166534' };
    if (s === 'pending') return { bg: '#fef3c7', text: '#92400e' };
    if (s === 'rejected') return { bg: '#fee2e2', text: '#991b1b' };
    if (s === 'closed') return { bg: '#f1f5f9', text: '#475569' };
    return { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* INLINE STYLES FOR ANIMATIONS & MODERN UI */}
      <style>{`
        @keyframes mjpFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mjpPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        .mjp-animate {
          animation: mjpFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .mjp-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .mjp-hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
        }

        .mjp-input-field {
          padding: 10px 16px 10px 40px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #fff;
          font-size: 14px;
          outline: none;
          width: 320px;
          transition: all 0.2s;
        }
        .mjp-input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

        .mjp-select-field {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          outline: none;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mjp-select-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

        .mjp-table { width: 100%; border-collapse: collapse; text-align: left; }
        .mjp-table th { padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .mjp-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .mjp-table tbody tr { transition: background-color 0.15s; }
        .mjp-table tbody tr:hover { background-color: #f8fafc; }

        .mjp-action-btn {
          width: 32px; height: 32px; border-radius: 8px; border: none; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: #f1f5f9; color: #475569;
        }
        .mjp-action-btn:hover { background: #e2e8f0; transform: scale(1.05); }
        .mjp-action-btn.approve:hover { background: #dcfce7; color: #166534; }
        .mjp-action-btn.reject:hover { background: #fee2e2; color: #991b1b; }

        .mjp-pill-btn {
          padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; border: 1px solid #e2e8f0; background: #fff; color: #0f172a; cursor: pointer; transition: all 0.2s;
        }
        .mjp-pill-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }

        .mjp-skeleton { animation: mjpPulse 1.5s infinite ease-in-out; background: #e2e8f0; border-radius: 6px; }
      `}</style>

      <TopNavbar title="Manage Job Posts" />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header Intro */}
        <div className="mjp-animate" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Job Moderation Queue</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px', maxWidth: '700px', lineHeight: '1.5' }}>
            Review and manage job opportunities submitted by partner companies. Ensure all postings meet institutional standards before approving them for student visibility.
          </p>
        </div>

        {error && (
          <div className="mjp-animate" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>⚠️</span> {error}
          </div>
        )}

        {/* 📊 METRICS ROW */}
        <section className="mjp-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px', animationDelay: '0.1s' }}>
          
          <div className="mjp-card mjp-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>TOTAL POSTS</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats?.total_posts ?? '—'}</h2>
            </div>
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '12px', fontSize: '20px' }}>💼</div>
          </div>

          <div className="mjp-card mjp-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#d97706', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>PENDING REVIEW</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#b45309', margin: 0 }}>{stats?.pending_review ?? '—'}</h2>
            </div>
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '12px', fontSize: '20px' }}>⏳</div>
          </div>

          <div className="mjp-card mjp-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#059669', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>ACTIVE JOBS</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#047857', margin: 0 }}>{stats?.active_jobs ?? '—'}</h2>
            </div>
            <div style={{ padding: '12px', background: '#dcfce7', borderRadius: '12px', fontSize: '20px' }}>🟢</div>
          </div>

          <div className="mjp-card mjp-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#4f46e5', fontSize: '12px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '0.05em' }}>TOTAL APPLICATIONS</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#4338ca', margin: 0 }}>{stats?.total_applications ?? '—'}</h2>
            </div>
            <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '12px', fontSize: '20px' }}>📄</div>
          </div>

        </section>

        {/* 📑 JOBS CENTRAL TABLE CARD */}
        <section className="mjp-card mjp-animate" style={{ padding: '24px', animationDelay: '0.2s', marginBottom: '32px' }}>
          
          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                className="mjp-input-field"
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search job titles or companies..."
              />
            </div>
            <div>
              <select className="mjp-select-field" value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table className="mjp-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Posted Date</th>
                  <th style={{ textAlign: 'center' }}>Applications</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="mjp-skeleton" style={{ height: '16px', width: '70%' }}></div></td>
                      <td><div className="mjp-skeleton" style={{ height: '16px', width: '50%' }}></div></td>
                      <td><div className="mjp-skeleton" style={{ height: '16px', width: '60%' }}></div></td>
                      <td><div className="mjp-skeleton" style={{ height: '24px', width: '32px', margin: '0 auto', borderRadius: '12px' }}></div></td>
                      <td><div className="mjp-skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div></td>
                      <td><div className="mjp-skeleton" style={{ height: '32px', width: '100px', margin: '0 auto' }}></div></td>
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
                      <p style={{ margin: 0 }}>No job posts found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => {
                    const st = (job.status || '').toLowerCase();
                    const statusColors = getStatusStyle(st);
                    
                    return (
                      <tr key={job.id}>
                        <td 
                          style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer' }} 
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        >
                          {job.title}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#94a3b8' }}>🏢</span> 
                            {job.company_name || job.company}
                          </div>
                        </td>
                        <td style={{ color: '#64748b' }}>
                          {fmtDate(pick(job, 'posted_date', 'date', 'created_at', 'posted_on', 'posted_at'))}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                            {pick(job, 'applications_count', 'applicants_count', 'total_applications', 'app_count', 'apps') ?? (Array.isArray(job.applications) ? job.applications.length : 0)}
                          </span>
                        </td>
                        <td>
                          <span style={{ background: statusColors.bg, color: statusColors.text, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {job.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {st !== 'approved' && (
                              <button className="mjp-action-btn approve" title="Approve" onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'approve' })}>
                                ✔️
                              </button>
                            )}
                            {st !== 'rejected' && st !== 'closed' && (
                              <button className="mjp-action-btn reject" title="Reject" onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'reject' })}>
                                🚫
                              </button>
                            )}
                            <button className="mjp-pill-btn" onClick={() => navigate(`/admin/jobs/${job.id}`)}>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER WITH PAGINATION */}
          {!loading && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Showing <b style={{ color: '#0f172a' }}>{jobs.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {(page - 1) * PER_PAGE + jobs.length}</b> of <b style={{ color: '#0f172a' }}>{total}</b> job posts
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className="mjp-pill-btn" 
                  disabled={page <= 1} 
                  onClick={() => setPage((p) => p - 1)}
                  style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>Page {page} of {totalPages}</span>
                <button 
                  className="mjp-pill-btn" 
                  disabled={page >= totalPages} 
                  onClick={() => setPage((p) => p + 1)}
                  style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 📘 BOTTOM INFORMATIONAL GRID */}
        <section className="mjp-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', animationDelay: '0.3s' }}>
          
          <div className="mjp-card" style={{ padding: '24px', background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> Moderation Guidelines
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Verify company contact email domain matches official records.</li>
              <li>Ensure salary ranges are compliant with institutional policies.</li>
              <li>Check for inclusive language and diversity requirements.</li>
              <li>Reject postings with suspicious external links or payment requests.</li>
            </ul>
          </div>

          <div className="mjp-card" style={{ padding: '24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span> Administrator Actions
              </h4>
              <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                Approved jobs are instantly pushed to the Student Job Board. Rejected jobs automatically notify the company via their registered email address.
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/reports')}
              style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              View Analytics Reports
            </button>
          </div>

        </section>

      </div>

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