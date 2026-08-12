import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import { pick, fmtDate } from '../utils/fields';
import { useToast } from '../context/ToastContext';

function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin/jobs/${id}`);
      setJob(res.data.job || res.data);
    } catch (err) {
      setError('Could not load job post. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const status = (job?.status || '').toLowerCase();
  const [rejectReason, setRejectReason] = React.useState('');

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'approve') await axiosClient.patch(`/admin/jobs/${id}/approve`);
      if (type === 'reject') await axiosClient.patch(`/admin/jobs/${id}/reject`, { rejection_reason: rejectReason || undefined });
      if (type === 'close') await axiosClient.patch(`/admin/jobs/${id}/close`);
      const msg = { approve: 'Job post approved! 🎉', reject: 'Job post rejected.', close: 'Job post closed.' }[type];
      showToast(msg, type === 'approve' ? 'success' : 'info');
      setConfirmAction(null);
      setRejectReason('');
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    approve: { title: 'Approve Job Post', message: 'This job will become visible to students immediately.', confirmLabel: 'Approve Job', color: '#16a34a' },
    reject: { title: 'Reject Job Post', message: 'The company will be notified via email.', confirmLabel: 'Reject Job', color: '#dc2626' },
    close: { title: 'Close Job Post', message: 'This job will stop accepting new applications.', confirmLabel: 'Close Job', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Job Post Detail" />

      <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: 'var(--pf-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '18px', fontWeight: 600 }}>
        <Link to="/admin/jobs" style={{ color: 'var(--pf-text-3)', textDecoration: 'none' }}>Manage Job Posts</Link>
        {' › '}
        <span style={{ color: 'var(--pf-text)', fontWeight: 700 }}>{job?.title || '...'}</span>
      </nav>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div className="pf-card" style={{ padding: 26 }} aria-label="Loading job post">
          <div className="pf-skeleton" style={{ width: '42%', height: 20, marginBottom: 10 }} />
          <div className="pf-skeleton" style={{ width: '25%', height: 13, marginBottom: 20 }} />
          <div className="pf-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
          <div className="pf-skeleton" style={{ width: '90%', height: 14, marginBottom: 8 }} />
          <div className="pf-skeleton" style={{ width: '70%', height: 14 }} />
        </div>
      )}

      {!loading && job && (
        <div className="cp-dash-grid">
          <div className="pf-card" style={{ padding: '26px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <h2 className="pf-display" style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--pf-text)' }}>{job.title}</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--pf-primary-deep)', fontWeight: 700 }}>{job.company_name || job.company}</p>
              </div>
              <StatusPill status={job.status} />
            </div>

            {status === 'rejected' && job.rejection_reason && (
              <div style={{ marginTop: '14px', padding: '12px 15px', borderRadius: '11px', background: 'var(--pf-red-bg)', border: '1px solid var(--pf-red-ln)' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--pf-red)' }}>Rejection Reason</p>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--pf-text)' }}>{job.rejection_reason}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', margin: '16px 0', flexWrap: 'wrap' }}>
              <span>📅 Posted {fmtDate(pick(job, 'posted_date', 'created_at', 'posted_on'))}</span>
              {job.location && <span>📍 {job.location}</span>}
              {job.job_type && <span>💼 {job.job_type}</span>}
              {(job.salary_min || job.salary_max) && <span>💰 {job.salary_min ? `₹${job.salary_min}` : ''}{job.salary_max ? ` - ₹${job.salary_max}` : ''}</span>}
            </div>

            {job.description && (
              <div style={{ marginTop: '20px' }}>
                <h4 className="pf-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)', margin: '0 0 8px 0' }}>About the Job</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{job.description}</p>
              </div>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 className="pf-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)', margin: '0 0 8px 0' }}>Key Responsibilities</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {job.responsibilities.map((r, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#475569', marginBottom: '6px' }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.eligibility_criteria && (
              <div style={{ marginTop: '20px' }}>
                <h4 className="pf-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)', margin: '0 0 8px 0' }}>Eligibility Criteria</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{job.eligibility_criteria}</p>
              </div>
            )}

            {(() => {
              const skills = job.required_skills || job.skills;
              const list = !skills ? [] : (Array.isArray(skills) ? skills : String(skills).split(',')).map((x) => (typeof x === 'string' ? x : x?.name || x?.skill_name || '')).map((x) => String(x).trim()).filter(Boolean);
              if (!list.length) return null;
              return (
                <div style={{ marginTop: '20px' }}>
                  <h4 className="pf-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)', margin: '0 0 10px 0' }}>Required Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {list.map((sk, i) => (
                      <span key={i} style={{ padding: '5px 12px', borderRadius: '99px', background: 'var(--pf-primary-soft)', border: '1px solid var(--pf-blue-ln)', fontSize: '13px', fontWeight: 600, color: 'var(--pf-primary-deep)' }}>{sk}</span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              {status !== 'approved' && (
                <button onClick={() => setConfirmAction({ type: 'approve' })} className="pf-btn pf-btn-primary">Approve</button>
              )}
              {status !== 'rejected' && (
                <button onClick={() => setConfirmAction({ type: 'reject' })} className="pf-btn pf-btn-ghost" style={{ color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}>Reject</button>
              )}
              {status !== 'closed' && (
                <button onClick={() => setConfirmAction({ type: 'close' })} className="pf-btn pf-btn-ghost">Close Job</button>
              )}
            </div>
          </div>

          {/* SIDEBAR: STATS + COMPANY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="pf-card" style={{ padding: '20px' }}>
              <h4 className="pf-display" style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>Application Statistics</h4>
              <StatRow label="Shortlisted" value={job.shortlisted_count} color="#16a34a" />
              <StatRow label="Pending" value={job.pending_count} color="#d97706" />
              <StatRow label="Rejected" value={job.rejected_count} color="#dc2626" />
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '10px', paddingTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>TOTAL APPLIED</p>
                <h3 className="pf-display" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--pf-text)', fontVariantNumeric: 'tabular-nums' }}>{pick(job, 'total_applications', 'applications_count', 'applicants_count') ?? 0}</h3>
              </div>
            </div>

            {(job.company_email || job.company_location) && (
              <div className="pf-card" style={{ padding: '20px' }}>
                <h4 className="pf-display" style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>Company Details</h4>
                {job.company_email && <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155' }}>✉️ {job.company_email}</p>}
                {job.company_location && <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>📍 {job.company_location}</p>}
                {job.company_id && (
                  <button onClick={() => navigate(`/admin/companies/${job.company_id}`)} style={{ marginTop: '14px', width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                    View Company Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {modalCopy && (
        <ConfirmModal
          open={!!confirmAction}
          title={modalCopy.title}
          message={modalCopy.message}
          confirmLabel={modalCopy.confirmLabel}
          confirmColor={modalCopy.color}
          onConfirm={runAction}
          onCancel={() => { setConfirmAction(null); setRejectReason(''); }}
          loading={actionLoading}
        >
          {confirmAction?.type === 'reject' && (
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (optional — shared with the company)"
              className="pf-input"
              style={{ marginTop: 12, resize: 'vertical', width: '100%' }}
            />
          )}
        </ConfirmModal>
      )}
    </main>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}><span style={{ color, marginRight: '6px' }}>●</span>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{value ?? 0}</span>
    </div>
  );
}

export default JobPostDetail;
