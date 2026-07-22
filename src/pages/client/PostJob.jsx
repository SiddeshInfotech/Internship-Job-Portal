import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import StatusPill from '../../components/StatusPill';

const PER_PAGE = 10;

function JobsPosted() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadStats = async () => {
    try {
      const res = await clientAxios.get('/client/jobs/stats');
      setStats(res.data.stats || res.data);
    } catch { /* non-fatal */ }
  };

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clientAxios.get('/client/jobs', { params: { status: statusFilter || undefined, page, per_page: PER_PAGE } });
      const data = res.data;
      const list = asArray(data.jobs, data.results, data);
      setJobs(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load your job posts. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadJobs(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const canEdit = (status) => ['Draft', 'Pending', 'Rejected'].includes(status);

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { jobId, type } = confirmAction;
      if (type === 'close') await clientAxios.patch(`/client/jobs/${jobId}/close`);
      if (type === 'mark-filled') await clientAxios.patch(`/client/jobs/${jobId}/mark-filled`);
      if (type === 'submit') await clientAxios.patch(`/client/jobs/${jobId}/submit`);
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
    close: { title: 'Close Job Post', message: `Close "${confirmAction?.title}"? It will stop accepting new applications.`, confirmLabel: 'Close Job', color: '#dc2626' },
    'mark-filled': { title: 'Mark as Filled', message: `Mark "${confirmAction?.title}" as filled? This closes it to new applicants.`, confirmLabel: 'Mark Filled', color: '#16a34a' },
    submit: { title: 'Submit for Approval', message: `Submit "${confirmAction?.title}" to Admin for approval?`, confirmLabel: 'Submit', color: '#ea580c' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main 
      style={{ 
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        zIndex: 1,
        overflow: 'visible',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        paddingBottom: '40px'
      }}
    >
      <style>{`
        @keyframes jpSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes jpShimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .jp-anim { animation: jpSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .jp-anim-1 { animation-delay: 0.1s; }
        .jp-anim-2 { animation-delay: 0.2s; }
        .jp-anim-3 { animation-delay: 0.3s; }

        .jp-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .jp-hover-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08); }

        .jp-input { padding: 10px 36px 10px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; background: #fff; cursor: pointer; transition: all 0.2s; min-width: 180px; appearance: auto; }
        .jp-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15); }

        .jp-btn-main { background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2); }
        .jp-btn-main:hover { background: #c2410c; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(234, 88, 12, 0.3); }

        .jp-table { width: 100%; border-collapse: collapse; text-align: left; }
        .jp-table th { padding: 16px 20px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #fafafa; }
        .jp-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }
        .jp-table tbody tr { transition: background-color 0.15s; }
        .jp-table tbody tr:hover { background-color: #f8fafc; }

        .jp-action-btn { padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; background: white; white-space: nowrap; }
        .jp-action-btn:hover { transform: scale(1.03); }
        .jp-btn-submit { color: #ea580c; border-color: #ffedd5; background: #fff7ed; }
        .jp-btn-submit:hover { background: #ea580c; color: white; border-color: #ea580c; }
        .jp-btn-edit { color: #3b82f6; border-color: #dbeafe; background: #eff6ff; }
        .jp-btn-edit:hover { background: #3b82f6; color: white; border-color: #3b82f6; }
        .jp-btn-filled { color: #16a34a; border-color: #dcfce7; background: #f0fdf4; }
        .jp-btn-filled:hover { background: #16a34a; color: white; border-color: #16a34a; }
        .jp-btn-close { color: #dc2626; border-color: #fee2e2; background: #fef2f2; }
        .jp-btn-close:hover { background: #dc2626; color: white; border-color: #dc2626; }
        
        .jp-page-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid #cbd5e1; background: #fff; color: #334155; cursor: pointer; transition: all 0.2s; }
        .jp-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .jp-page-btn:not(:disabled):hover { background: #f1f5f9; border-color: #94a3b8; color: #0f172a; }

        .jp-skeleton { background: #f1f5f9; background-image: linear-gradient(90deg, #f1f5f9 0px, #e2e8f0 40px, #f1f5f9 80px); background-size: 1000px 100%; animation: jpShimmer 2s infinite linear; border-radius: 6px; }
      `}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <ClientTopNavbar title="Jobs Posted"/>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        
        <div className="jp-anim jp-anim-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Listing Management</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Track, manage, and monitor your active recruitment drives.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              className="jp-input"
              aria-label="Filter jobs by status"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved / Active</option>
              <option value="Rejected">Rejected</option>
              <option value="Filled">Filled</option>
              <option value="Closed">Closed</option>
            </select>
            <button onClick={() => navigate('/jobs/new')} className="jp-btn-main">
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Post a New Job
            </button>
          </div>
        </div>

        {error && (
          <div className="jp-anim" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
            <span style={{ fontSize: '16px' }} aria-hidden="true">⚠️</span> {error}
          </div>
        )}

        <section className="jp-anim jp-anim-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatCard icon="📋" label="Total listings" value={stats?.total_listings} />
          <StatCard color="#16a34a" icon="🚀" label="Active now" value={stats?.active_now} />
          <StatCard color="#3b82f6" icon="✅" label="Positions filled" value={stats?.positions_filled} />
          <StatCard color="#64748b" icon="📁" label="Closed / drafts" value={stats?.closed_or_drafts} />
        </section>

        <div className="jp-card jp-anim jp-anim-3" style={{ position: 'relative', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="jp-table">
              <thead>
                <tr>
                  <th>Role & Department</th>
                  <th>Posted On</th>
                  <th>Current Status</th>
                  <th>Engagement</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="jp-skeleton" style={{ height: '16px', width: '60%', marginBottom: '8px' }}></div>
                        <div className="jp-skeleton" style={{ height: '12px', width: '30%', borderRadius: '12px' }}></div>
                      </td>
                      <td><div className="jp-skeleton" style={{ height: '14px', width: '80px' }}></div></td>
                      <td><div className="jp-skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }}></div></td>
                      <td>
                        <div className="jp-skeleton" style={{ height: '14px', width: '50px', display: 'inline-block' }}></div>
                        <span style={{ marginLeft: '6px', color: '#cbd5e1' }}>applicants</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <div className="jp-skeleton" style={{ height: '30px', width: '60px', borderRadius: '8px' }}></div>
                          <div className="jp-skeleton" style={{ height: '30px', width: '60px', borderRadius: '8px' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '64px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', fontSize: '32px', marginBottom: '16px' }} aria-hidden="true">
                        💼
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>No Job Posts Found</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Create your first listing to start hiring talent.</p>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <p
                          style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#0f172a', fontSize: '15px', cursor: 'pointer', transition: 'color 0.2s' }}
                          onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                          onMouseOver={(e) => e.target.style.color = '#ea580c'}
                          onMouseOut={(e) => e.target.style.color = '#0f172a'}
                        >
                          {job.title}
                        </p>
                        {job.department && (
                          <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                            {job.department.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontWeight: 500 }}>{job.posted_date || job.created_at}</td>
                      <td><StatusPill status={job.status} /></td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{job.applicants_count ?? job.applications_count ?? 0}</span>
                        <span style={{ color: '#64748b', marginLeft: '6px', fontSize: '13px' }}>applicants</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                          {job.status === 'Draft' && (
                            <button onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'submit' })} className="jp-action-btn jp-btn-submit">
                              Submit
                            </button>
                          )}
                          {canEdit(job.status) && (
                            <button onClick={() => navigate(`/jobs/${job.id}/edit`)} className="jp-action-btn jp-btn-edit">
                              Edit
                            </button>
                          )}
                          {job.status === 'Approved' && (
                            <button onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'mark-filled' })} className="jp-action-btn jp-btn-filled">
                              Mark Filled
                            </button>
                          )}
                          {['Approved', 'Pending'].includes(job.status) && (
                            <button onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'close' })} className="jp-action-btn jp-btn-close" aria-label={`Close ${job.title}`} title="Close job">
                              ⊘ Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderTop: '1px solid #e2e8f0', background: '#fff', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Showing <b style={{ color: '#0f172a' }}>{jobs.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to {(page - 1) * PER_PAGE + jobs.length}</b> of <b style={{ color: '#0f172a' }}>{total}</b> results
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="jp-page-btn">Previous</button>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500, padding: '0 8px' }}>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="jp-page-btn">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalCopy && (
        <ConfirmModal 
          confirmColor={modalCopy.color} 
          confirmLabel={modalCopy.confirmLabel} 
          message={modalCopy.message} 
          onCancel={() => setConfirmAction(null)} 
          onConfirm={runAction} 
          open={!!confirmAction} 
          title={modalCopy.title}
          loading={actionLoading}
        />
      )}
    </main>
  );
}

function StatCard({ label, value, color = '#0f172a', icon }) {
  return (
    <div className="jp-card jp-hover-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </p>
        <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color }}>
          {value ?? '—'}
        </h2>
      </div>
      {icon && (
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          {icon}
        </div>
      )}
    </div>
  );
}

export default JobsPosted;