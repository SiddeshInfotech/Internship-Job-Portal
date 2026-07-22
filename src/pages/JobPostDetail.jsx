import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import { pick, fmtDate } from '../utils/fields';

function JobPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'approve') await axiosClient.patch(`/admin/jobs/${id}/approve`);
      if (type === 'reject') await axiosClient.patch(`/admin/jobs/${id}/reject`);
      if (type === 'close') await axiosClient.patch(`/admin/jobs/${id}/close`);
      setConfirmAction(null);
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

  // Calculate percentages for application stats bar
  const totalApps = pick(job, 'total_applications', 'applications_count', 'applicants_count') || 0;
  const shortlistedPct = totalApps ? ((job?.shortlisted_count || 0) / totalApps) * 100 : 0;
  const pendingPct = totalApps ? ((job?.pending_count || 0) / totalApps) * 100 : 0;
  const rejectedPct = totalApps ? ((job?.rejected_count || 0) / totalApps) * 100 : 0;

  return (
    <main className="admin-page-body" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes jpdFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes jpdPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        .jpd-animate-entry {
          animation: jpdFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .jpd-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .jpd-card:hover {
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.06);
        }

        .jpd-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          background: #f8fafc;
          color: #334155;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .jpd-meta-chip:hover {
          background: #f1f5f9;
          transform: translateY(-1px);
        }

        .jpd-btn {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .jpd-btn-approve {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
        }
        .jpd-btn-approve:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 6px 16px rgba(22, 163, 74, 0.35);
        }

        .jpd-btn-reject {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .jpd-btn-reject:hover {
          background: #fee2e2;
          transform: translateY(-1.5px);
        }

        .jpd-btn-close {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        .jpd-btn-close:hover {
          background: #f1f5f9;
          color: #0f172a;
          transform: translateY(-1.5px);
        }

        .jpd-skeleton-box {
          animation: jpdPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          background: #e2e8f0;
          border-radius: 8px;
        }
      `}</style>

      <TopNavbar title="Job Post Detail" />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Link to="/admin/jobs" style={{ color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s' }}>Manage Job Posts</Link>
        <span style={{ color: '#cbd5e1' }}>›</span>
        <span style={{ color: '#0f172a', fontWeight: 700 }}>{job?.title || '...'}</span>
      </nav>

      {error && (
        <div className="jpd-animate-entry" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
          <span style={{ fontSize: '16px' }}>⚠️</span> {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="jpd-card" style={{ padding: '28px' }} aria-label="Loading job post">
          <div className="jpd-skeleton-box" style={{ width: '40%', height: '26px', marginBottom: '12px' }} />
          <div className="jpd-skeleton-box" style={{ width: '25%', height: '16px', marginBottom: '24px' }} />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <div className="jpd-skeleton-box" style={{ width: '100px', height: '30px' }} />
            <div className="jpd-skeleton-box" style={{ width: '120px', height: '30px' }} />
            <div className="jpd-skeleton-box" style={{ width: '110px', height: '30px' }} />
          </div>
          <div className="jpd-skeleton-box" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
          <div className="jpd-skeleton-box" style={{ width: '92%', height: '14px', marginBottom: '8px' }} />
          <div className="jpd-skeleton-box" style={{ width: '75%', height: '14px' }} />
        </div>
      )}

      {!loading && job && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          
          {/* MAIN COLUMN: JOB DETAILS */}
          <div className="jpd-card jpd-animate-entry" style={{ padding: '32px' }}>
            
            {/* Header: Title & Company */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>{job.title}</h2>
                <p style={{ margin: 0, fontSize: '16px', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🏢</span> {job.company_name || job.company}
                </p>
              </div>
              <StatusPill status={job.status} />
            </div>

            {/* Meta Info Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '20px 0 28px' }}>
              <span className="jpd-meta-chip">
                <span>📅</span> Posted {fmtDate(pick(job, 'posted_date', 'created_at', 'posted_on'))}
              </span>
              {job.location && (
                <span className="jpd-meta-chip">
                  <span>📍</span> {job.location}
                </span>
              )}
              {job.job_type && (
                <span className="jpd-meta-chip" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                  <span>💼</span> {job.job_type}
                </span>
              )}
              {(job.salary_min || job.salary_max) && (
                <span className="jpd-meta-chip" style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}>
                  <span>💰</span> {job.salary_min ? `$${job.salary_min.toLocaleString()}` : ''}{job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : ''}
                </span>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

            {/* Job Description */}
            {job.description && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>About the Job</h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.01em' }}>Key Responsibilities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {job.responsibilities.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                      <span style={{ color: '#2563eb', fontSize: '12px', background: '#eff6ff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontWeight: 'bold' }}>✓</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '24px', flexWrap: 'wrap' }}>
              {status !== 'approved' && (
                <button onClick={() => setConfirmAction({ type: 'approve' })} className="jpd-btn jpd-btn-approve">
                  <span>✓</span> Approve Job
                </button>
              )}
              {status !== 'rejected' && (
                <button onClick={() => setConfirmAction({ type: 'reject' })} className="jpd-btn jpd-btn-reject">
                  <span>✕</span> Reject Job
                </button>
              )}
              {status !== 'closed' && (
                <button onClick={() => setConfirmAction({ type: 'close' })} className="jpd-btn jpd-btn-close">
                  <span>🔒</span> Close Job
                </button>
              )}
            </div>
          </div>

          {/* SIDEBAR: STATS & COMPANY DETAILS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Card 1: Application Statistics */}
            <div className="jpd-card jpd-animate-entry" style={{ padding: '24px', animationDelay: '0.1s' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Application Statistics</h4>
              
              {/* Visual Breakdown Bar */}
              {totalApps > 0 && (
                <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '20px' }}>
                  <div style={{ width: `${shortlistedPct}%`, background: '#16a34a', transition: 'width 0.6s ease' }} title="Shortlisted" />
                  <div style={{ width: `${pendingPct}%`, background: '#d97706', transition: 'width 0.6s ease' }} title="Pending" />
                  <div style={{ width: `${rejectedPct}%`, background: '#dc2626', transition: 'width 0.6s ease' }} title="Rejected" />
                </div>
              )}

              <StatRow label="Shortlisted" value={job.shortlisted_count} color="#16a34a" />
              <StatRow label="Pending" value={job.pending_count} color="#d97706" />
              <StatRow label="Rejected" value={job.rejected_count} color="#dc2626" />
              
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>TOTAL APPLIED</p>
                  <h3 style={{ margin: '2px 0 0', fontSize: '26px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {totalApps.toLocaleString()}
                  </h3>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  👥
                </div>
              </div>
            </div>

            {/* Card 2: Company Details */}
            {(job.company_email || job.company_location) && (
              <div className="jpd-card jpd-animate-entry" style={{ padding: '24px', animationDelay: '0.2s' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Company Details</h4>
                {job.company_email && (
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✉️</span> <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{job.company_email}</span>
                  </p>
                )}
                {job.company_location && (
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📍</span> {job.company_location}
                  </p>
                )}
                {job.company_id && (
                  <button 
                    onClick={() => navigate(`/admin/companies/${job.company_id}`)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '10px', 
                      border: '1px solid #cbd5e1', 
                      background: '#ffffff', 
                      color: '#0f172a', 
                      fontWeight: 600, 
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    View Company Profile
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
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

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>
        {label}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{(value ?? 0).toLocaleString()}</span>
    </div>
  );
}

export default JobPostDetail;