import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import { pick, fmtDate } from '../utils/fields';
import { normalizeApplicant } from '../utils/drive';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [app, setApp] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin/applications/${id}`);
      // Normalize all backend field-name variants (incl. nested `student`,
      // the raw gpa_cgpa DB column, Cloudinary photo, certificates, etc.)
      const data = normalizeApplicant(res.data.application || res.data, pick);
      data.applied_date = fmtDate(pick(data, 'applied_date', 'created_at', 'applied_at', 'application_date'));
      setApp(data);
      setNotes(data.admin_notes || '');
    } catch (err) {
      setError('Could not load application. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'shortlist') await axiosClient.patch(`/admin/applications/${id}/shortlist`, { admin_notes: notes || undefined });
      if (type === 'reject') await axiosClient.patch(`/admin/applications/${id}/reject`, { admin_notes: notes || undefined });
      showToast(type === 'shortlist' ? 'Candidate shortlisted! 🎉' : 'Application rejected.', type === 'shortlist' ? 'success' : 'info');
      setConfirmAction(null);
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    shortlist: { title: 'Shortlist Candidate', message: `Shortlist ${app?.name} for ${app?.job_title || app?.role}?`, confirmLabel: 'Shortlist Candidate', color: '#16a34a' },
    reject: { title: 'Reject Application', message: `Reject ${app?.name}'s application? They will be notified.`, confirmLabel: 'Reject Application', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main className="admin-page-body" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Application Detail" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          <Link to="/admin/applications" style={{ color: '#64748b', textDecoration: 'none' }}>Manage Applications</Link> {' > '}
          <span style={{ color: '#1e293b', fontWeight: 600 }}>{app ? `${app.name} — ${app.job_title || app.role}` : '...'}</span>
        </p>
        {app && (
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
            {app.applied_date && <span>📅 Applied: {app.applied_date}</span>}
            <span>ID: {app.id}</span>
          </div>
        )}
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div className="cp-dash-grid" aria-label="Loading application">
          <div className="pf-card" style={{ padding: 24 }}>
            <div className="pf-skeleton" style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px' }} />
            <div className="pf-skeleton" style={{ width: '55%', height: 15, margin: '0 auto 8px' }} />
            <div className="pf-skeleton" style={{ width: '35%', height: 12, margin: '0 auto' }} />
          </div>
          <div className="pf-card" style={{ padding: 26 }}>
            <div className="pf-skeleton" style={{ width: '35%', height: 17, marginBottom: 14 }} />
            <div className="pf-skeleton" style={{ width: '100%', height: 90, marginBottom: 12 }} />
            <div className="pf-skeleton" style={{ width: '80%', height: 14 }} />
          </div>
        </div>
      )}

      {!loading && app && (
        <div className="cp-dash-grid">
          {/* LEFT: APPLICANT DOSSIER */}
          <div className="pf-card" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.08em' }}>APPLICANT DOSSIER</h4>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {app.profile_photo ? (
                <img
                  src={app.profile_photo}
                  alt={app.name}
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', boxShadow: 'var(--pf-shadow-md)', border: '2px solid var(--pf-card)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(140deg, #2563eb, #0b1526)', margin: '0 auto 10px', display: app.profile_photo ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 700, color: '#fff', fontFamily: 'var(--pf-display)', boxShadow: 'var(--pf-shadow-md)' }}>
                {(app.name || '?').charAt(0)}
              </div>
              <h3 className="pf-display" style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: 'var(--pf-text)' }}>{app.name}</h3>
              <StatusPill status={app.status} />
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
              {(app.institution || app.college) && <p style={{ margin: 0 }}>🎓 {app.institution || app.college}</p>}
              {app.email && <p style={{ margin: 0 }}>✉️ {app.email}</p>}
              {app.phone && <p style={{ margin: 0 }}>📞 {app.phone}</p>}
              {app.location && <p style={{ margin: 0 }}>📍 {app.location}</p>}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {app.status !== 'Shortlisted' && (
                <button onClick={() => setConfirmAction({ type: 'shortlist' })} className="pf-btn pf-btn-primary" style={{ width: '100%' }}>
                  Shortlist Candidate
                </button>
              )}
              {app.status !== 'Rejected' && (
                <button onClick={() => setConfirmAction({ type: 'reject' })} className="pf-btn pf-btn-ghost" style={{ width: '100%', color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}>
                  Reject Application
                </button>
              )}
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>ADMIN REVIEW NOTES (PRIVATE)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this candidate..."
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* RIGHT: RESUME / COVER LETTER */}
          <div className="pf-card" style={{ padding: '26px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 className="pf-display" style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--pf-text)' }}>Resume / CV</h4>
              
            </div>

            {/* Resume card — opens the submitted Drive link in a new tab */}
            {app.resume_url ? (
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '14px', flexWrap: 'wrap', marginBottom: '20px',
                  border: '1px solid var(--pf-line)', borderRadius: '12px',
                  padding: '15px 17px', background: 'var(--pf-page)',
                  boxShadow: 'var(--pf-shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div aria-hidden="true" style={{ width: 40, height: 40, borderRadius: '11px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', background: 'var(--pf-red-bg)', border: '1px solid var(--pf-red-ln)' }}>📄</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--pf-text)' }}>{app.name}'s Resume</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--pf-text-3)' }}>Opens in a new tab</p>
                  </div>
                </div>
                <a href={app.resume_url} target="_blank" rel="noreferrer" className="pf-btn pf-btn-primary pf-btn-sm" style={{ textDecoration: 'none' }}>View Resume ↗</a>
              </div>
            ) : (
              <div
                style={{
                  border: '1.5px dashed var(--pf-line-strong)', borderRadius: '12px',
                  padding: '20px', background: 'var(--pf-page)', marginBottom: '20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  color: 'var(--pf-text-3)', fontSize: '13px', textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '20px' }} aria-hidden="true">📄</span>
                No resume link received from the server for this application
              </div>
            )}

            <h3 className="pf-display" style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--pf-text)' }}>{app.name}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>{app.education_summary || app.institution}</p>

            {app.skills && app.skills.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>SKILLS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {app.skills.map((skill, i) => (
                    <span key={i} style={{ padding: '5px 12px', borderRadius: '99px', background: 'var(--pf-primary-soft)', border: '1px solid var(--pf-blue-ln)', fontSize: '12px', fontWeight: 600, color: 'var(--pf-primary-deep)' }}>
                      {typeof skill === 'string' ? skill : `${skill?.name || 'Skill'}${skill?.level ? ` · ${skill.level}` : ''}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(app.experience) && app.experience.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>EXPERIENCE</p>
                {app.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    {typeof exp === 'string' ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>{exp}</p>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>{exp?.title || 'Role'}{exp?.company ? ` — ${exp.company}` : ''}</p>
                        {exp?.duration && <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{exp.duration}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {app.cover_letter && (
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                  COVER LETTER{app.email ? ` · ${app.email}` : ''}
                </p>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{app.cover_letter}</p>
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
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </main>
  );
}

export default ApplicationDetail;
