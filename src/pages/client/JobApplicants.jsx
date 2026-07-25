import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import StatusPill from '../../components/StatusPill';
import { pick, fmtDate } from '../../utils/fields';
import { normalizeApplicant } from '../../utils/drive';

const PER_PAGE = 10;

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgResult, setMsgResult] = useState('');
  const [msgError, setMsgError] = useState('');

  const loadStats = async () => {
    try {
      const res = await clientAxios.get(`/client/jobs/${jobId}/applicants/stats`);
      setStats(res.data.stats || res.data);
    } catch { /* non-fatal */ }
  };

  const loadApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clientAxios.get(`/client/jobs/${jobId}/applicants`, {
        params: { search: search || undefined, status: statusFilter || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.applicants, data.results, data).map((a) => {
        const n = normalizeApplicant(a, pick);
        n.applied_date = fmtDate(pick(a, 'applied_date', 'applied_at', 'created_at', 'date'));
        return n;
      });
      setApplicants(list);
      setTotal(data.total ?? list.length);
      if (data.job_title) setJobTitle(data.job_title);
    } catch (err) {
      setError('Could not load applicants. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [jobId]);
  useEffect(() => {
    const timer = setTimeout(loadApplicants, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, search, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handleSendMessageAll = async (e) => {
    e.preventDefault();
    setMsgError('');
    setMsgResult('');
    setMsgSending(true);
    try {
      const res = await clientAxios.post(`/client/jobs/${jobId}/message-applicants`, {
        subject: msgSubject, message: msgBody,
      });
      setMsgResult(res.data.message || 'Message sent.');
      setMsgSubject(''); setMsgBody('');
    } catch (err) {
      setMsgError(err.response?.data?.message || 'Could not send message. Please try again.');
    } finally {
      setMsgSending(false);
    }
  };

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { appId, type } = confirmAction;
      if (type === 'shortlist') await clientAxios.patch(`/client/applicants/${appId}/shortlist`);
      if (type === 'reject') await clientAxios.patch(`/client/applicants/${appId}/reject`);
      setConfirmAction(null);
      loadApplicants();
      loadStats();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    shortlist: { title: 'Shortlist Candidate', message: `Shortlist ${confirmAction?.name}?`, confirmLabel: 'Shortlist', color: '#16a34a' },
    reject: { title: 'Reject Application', message: `Reject ${confirmAction?.name}'s application?`, confirmLabel: 'Reject', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title={jobTitle ? `${jobTitle} Applicants` : 'Applicants'} />

      <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: 'var(--pf-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontWeight: 600 }}>
        <Link to="/jobs" style={{ color: 'var(--pf-text-3)', textDecoration: 'none' }}>Jobs</Link>
        {' › '}
        <span style={{ color: 'var(--pf-text)', fontWeight: 700 }}>{jobTitle || `Job #${jobId}`}</span>
      </nav>
      <div className="cp-page-head" style={{ marginBottom: '18px' }}>
        <div>
          <h1>Applicant Management</h1>
          <p>Reviewing {total} total applications for this position.</p>
        </div>
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <section className="cp-metrics-row" style={{ marginBottom: '20px' }}>
        <StatCard label="Total received" value={stats?.total_received} />
        <StatCard label="New / unseen" value={stats?.new_unseen} color="var(--pf-ember-deep)" />
        <StatCard label="Shortlisted" value={stats?.shortlisted} color="var(--pf-green)" />
        <StatCard label="Rejected" value={stats?.rejected} color="var(--pf-red)" />
      </section>

      <div className="ma-action-bar">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div className="search-bar-wrapper">
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Search applicants..."
              aria-label="Search applicants"
            />
            <span aria-hidden="true">🔍</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            className="filter-dropdown-box"
            aria-label="Filter applicants by status"
          >
            <option value="">All Applicants</option>
            <option value="Applied">Applied</option>
            <option value="In Review">In Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={() => { setShowMessageModal(true); setMsgResult(''); setMsgError(''); }}
          disabled={total === 0}
          className="pf-btn pf-btn-ghost pf-btn-sm"
        >
          ✉️ Message All Applicants
        </button>
        {/* Export CSV intentionally omitted — still no backend endpoint for this one */}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} aria-label="Loading applicants">
          {[0, 1, 2].map((i) => (
            <div key={i} className="cp-panel" style={{ display: 'flex', gap: 14 }}>
              <div className="pf-skeleton" style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="pf-skeleton" style={{ width: '30%', height: 14, marginBottom: 8 }} />
                <div className="pf-skeleton" style={{ width: '45%', height: 11, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <div className="pf-skeleton" style={{ width: 56, height: 20, borderRadius: 99 }} />
                  <div className="pf-skeleton" style={{ width: 56, height: 20, borderRadius: 99 }} />
                  <div className="pf-skeleton" style={{ width: 56, height: 20, borderRadius: 99 }} />
                </div>
              </div>
              <div className="pf-skeleton" style={{ width: 130, height: 34, borderRadius: 10 }} />
            </div>
          ))}
        </div>
      ) : (
      <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {applicants.length === 0 && (
          <div className="cp-panel cp-empty">
            <div className="cp-empty-icon" aria-hidden="true">🔎</div>
            No applicants found{search || statusFilter ? ' for these filters.' : ' yet.'}
          </div>
        )}
        {applicants.map((a) => (
          <div key={a.id} className="pf-card pf-card-hover" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '14px', flex: 1, minWidth: '280px' }}>
              {a.profile_photo ? (
                <img src={a.profile_photo} alt={a.name} style={{ width: 44, height: 44, borderRadius: '13px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }} />
              ) : null}
              <div className="cp-list-avatar" style={{ width: 44, height: 44, borderRadius: '13px', fontSize: '15px', display: a.profile_photo ? 'none' : 'flex' }}>
                {(a.name || '?').charAt(0)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <p
                    className="cp-list-name"
                    style={{ fontSize: '14.5px', color: 'var(--pf-primary-deep)', cursor: 'pointer' }}
                    onClick={() => navigate(`/applicants/${a.id}`)}
                  >
                    {a.name}
                  </p>
                  {!a.viewed_by_company && !a.is_seen && !a.seen && <span className="pf-pill pf-pill-amber">New</span>}
                  {a.status && <StatusPill status={a.status} />}
                </div>
                <p className="cp-list-sub" style={{ margin: '3px 0 8px', whiteSpace: 'normal' }}>
                  {a.institution || a.college}{a.current_year ? `, ${a.current_year}` : ''}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: a.profile_summary ? '8px' : 0 }}>
                  {(a.skills || []).slice(0, 5).map((sk, i) => (
                    <span key={i} className="pf-pill pf-pill-grey">{typeof sk === 'string' ? sk : (sk?.skill_name || sk?.name || 'Skill')}</span>
                  ))}
                </div>
                {a.profile_summary && (
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--pf-text-3)', maxWidth: '480px', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{a.profile_summary}"
                  </p>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '170px' }}>
              <div>
                <p className="cp-detail-label">Applied on</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--pf-text-2)', fontVariantNumeric: 'tabular-nums' }}>{a.applied_date}</p>
              </div>
              <button onClick={() => navigate(`/applicants/${a.id}`)} className="pf-btn pf-btn-primary pf-btn-sm">
                View Profile
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                {a.status !== 'Shortlisted' && (
                  <button
                    onClick={() => setConfirmAction({ appId: a.id, name: a.name, type: 'shortlist' })}
                    className="pf-btn pf-btn-ghost pf-btn-sm"
                    style={{ color: 'var(--pf-green)', borderColor: 'var(--pf-green-ln)' }}
                  >
                    Shortlist
                  </button>
                )}
                {a.status !== 'Rejected' && (
                  <button
                    onClick={() => setConfirmAction({ appId: a.id, name: a.name, type: 'reject' })}
                    className="pf-btn pf-btn-ghost pf-btn-sm"
                    style={{ color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <span className="entries-count">
          Showing {applicants.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}-{(page - 1) * PER_PAGE + applicants.length} of {total} results
        </span>
        <div className="ma-pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="arrow-btn" aria-label="Previous page">‹</button>
          <span className="entries-count" style={{ padding: '0 6px' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="arrow-btn" aria-label="Next page">›</button>
        </div>
      </div>
      </>
      )}

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

      {showMessageModal && (
        <div className="pf-modal-backdrop" onClick={() => !msgSending && setShowMessageModal(false)} role="dialog" aria-modal="true" aria-label="Message all applicants">
          <div className="pf-modal" style={{ maxWidth: '440px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ textAlign: 'left' }}>Message All Applicants</h3>
            <p style={{ textAlign: 'left', marginBottom: '18px' }}>
              Sends a real email to every student who applied to this job ({total} recipient{total === 1 ? '' : 's'}).
            </p>

            {msgError && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{msgError}</div>}
            {msgResult && <div className="pf-alert-success" role="status"><span aria-hidden="true">✓</span>{msgResult}</div>}

            <form onSubmit={handleSendMessageAll}>
              <label className="pf-label" htmlFor="msg-subject">Subject</label>
              <input
                id="msg-subject"
                className="pf-input"
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                required
                placeholder="Update on your application"
                style={{ marginBottom: '14px' }}
              />
              <label className="pf-label" htmlFor="msg-body">Message</label>
              <textarea
                id="msg-body"
                className="pf-textarea"
                value={msgBody}
                onChange={(e) => setMsgBody(e.target.value)}
                required
                rows={5}
                placeholder="Thanks for applying! We'll be in touch soon."
                style={{ marginBottom: '18px', resize: 'vertical' }}
              />
              <div className="pf-modal-actions">
                <button type="button" onClick={() => setShowMessageModal(false)} disabled={msgSending} className="pf-btn pf-btn-ghost">
                  {msgResult ? 'Close' : 'Cancel'}
                </button>
                <button type="submit" disabled={msgSending} className="pf-btn pf-btn-ember">
                  {msgSending ? 'Sending...' : 'Send to All'}
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default JobApplicants;
