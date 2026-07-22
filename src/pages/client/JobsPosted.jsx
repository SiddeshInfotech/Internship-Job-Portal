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
  const [counts, setCounts] = useState({}); // verified per-job applicant totals
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
      // Verify true applicant totals per job (list endpoint may omit counts)
      Promise.all(
        list.map((job) =>
          clientAxios
            .get(`/client/jobs/${job.id}/applicants`, { params: { page: 1, per_page: 1 } })
            .then((r) => [job.id, r.data.total ?? 0])
            .catch(() => [job.id, null])
        )
      ).then((pairs) => {
        const map = {};
        pairs.forEach(([id, n]) => { if (n !== null) map[id] = n; });
        setCounts((prev) => ({ ...prev, ...map }));
      });
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
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Jobs Posted" />

      <div className="cp-page-head" style={{ alignItems: 'center' }}>
        <div>
          <h1>Listing Management</h1>
          <p>Track, manage, and monitor your active recruitment drives.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            className="filter-dropdown-box"
            aria-label="Filter jobs by status"
          >
            <option value="">Filter by Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved / Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Filled">Filled</option>
            <option value="Closed">Closed</option>
          </select>
          <button onClick={() => navigate('/jobs/new')} className="pf-btn pf-btn-ember">＋ Post a New Job</button>
        </div>
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <section className="cp-metrics-row" style={{ marginBottom: '22px' }}>
        <StatCard label="Total listings" value={stats?.total_listings} />
        <StatCard label="Active now" value={stats?.active_now} color="var(--pf-green)" />
        <StatCard label="Positions filled" value={stats?.positions_filled} color="var(--pf-blue)" />
        <StatCard label="Closed / drafts" value={stats?.closed_or_drafts} color="var(--pf-text-3)" />
      </section>

      <div className="table-data-card">
        {loading ? (
          <div style={{ padding: '20px 22px' }} aria-label="Loading job posts">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cp-skel-row">
                <div style={{ flex: 2 }}>
                  <div className="pf-skeleton" style={{ width: '55%', height: 14, marginBottom: 7 }} />
                  <div className="pf-skeleton" style={{ width: '30%', height: 10 }} />
                </div>
                <div className="pf-skeleton" style={{ flex: 1, height: 12, maxWidth: 110 }} />
                <div className="pf-skeleton" style={{ width: 84, height: 22, borderRadius: 99 }} />
                <div className="pf-skeleton" style={{ width: 140, height: 30, borderRadius: 8 }} />
              </div>
            ))}
          </div>
        ) : (
        <>
        <table className="visily-data-table">
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
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="cp-empty">
                    <div className="cp-empty-icon" aria-hidden="true">💼</div>
                    No job posts yet — create your first listing.
                  </div>
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <p
                    className="job-role-title"
                    style={{ cursor: 'pointer', color: 'var(--pf-primary-deep)' }}
                    onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                  >
                    {job.title}
                  </p>
                  <p className="sub-caption">{(job.department || '').toUpperCase()}</p>
                </td>
                <td className="date-cell">{job.posted_date || job.created_at}</td>
                <td><StatusPill status={job.status} /></td>
                <td className="apps-count-cell">
                  {counts[job.id] ?? job.applicants_count ?? job.applications_count ?? 0}{' '}
                  <span className="sub-caption" style={{ display: 'inline' }}>applicants</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                    {job.status === 'Draft' && (
                      <button onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'submit' })} className="pf-btn pf-btn-ember pf-btn-sm">Submit</button>
                    )}
                    {canEdit(job.status) && (
                      <button onClick={() => navigate(`/jobs/${job.id}/edit`)} className="pf-btn pf-btn-ghost pf-btn-sm">Edit</button>
                    )}
                    {job.status === 'Approved' && (
                      <button
                        onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'mark-filled' })}
                        className="pf-btn pf-btn-ghost pf-btn-sm"
                        style={{ color: 'var(--pf-green)', borderColor: 'var(--pf-green-ln)' }}
                      >
                        Mark Filled
                      </button>
                    )}
                    {['Approved', 'Pending'].includes(job.status) && (
                      <button
                        onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'close' })}
                        className="pf-btn pf-btn-ghost pf-btn-sm"
                        style={{ color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}
                        aria-label={`Close ${job.title}`}
                        title="Close job"
                      >
                        ⊘
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ma-table-footer">
          <span className="entries-count">
            Showing {jobs.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{(page - 1) * PER_PAGE + jobs.length} of {total}
          </span>
          <div className="ma-pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="arrow-btn" aria-label="Previous page">‹</button>
            <span className="entries-count" style={{ padding: '0 6px' }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="arrow-btn" aria-label="Next page">›</button>
          </div>
        </div>
        </>
        )}
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

function StatCard({ label, value, color = 'var(--pf-text)' }) {
  return (
    <div className="cp-metric-card">
      <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
      <h2 style={{ color }}>{value ?? '—'}</h2>
    </div>
  );
}

export default JobsPosted;
