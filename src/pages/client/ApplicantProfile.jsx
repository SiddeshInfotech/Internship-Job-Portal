import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import StatusPill from '../../components/StatusPill';
import { pick, fmtDate } from '../../utils/fields';
import { normalizeApplicant } from '../../utils/drive';
import { useToast } from '../../context/ToastContext';

function ApplicantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // Per the docs: this call automatically marks the application as viewed
      const res = await clientAxios.get(`/client/applicants/${id}`);
      const data = normalizeApplicant(res.data.applicant || res.data, pick);
      data.applied_date = fmtDate(pick(data, 'applied_date', 'created_at', 'applied_at'));
      setApp(data);
    } catch (err) {
      setError('Could not load applicant. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'shortlist') await clientAxios.patch(`/client/applicants/${id}/shortlist`);
      if (type === 'reject') await clientAxios.patch(`/client/applicants/${id}/reject`);
      if (type === 'interview') await clientAxios.patch(`/client/applicants/${id}/schedule-interview`);
      if (type === 'offer') await clientAxios.patch(`/client/applicants/${id}/extend-offer`);
      setConfirmAction(null);
      const done = { shortlist: 'Candidate shortlisted! 🎉', reject: 'Application rejected.', interview: 'Interview scheduled! 🎉', offer: 'Offer extended! 🎉' }[type];
      showToast(done, type === 'reject' ? 'info' : 'success');
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    shortlist: { title: 'Shortlist Candidate', message: `Shortlist ${app?.name} for this role?`, confirmLabel: 'Shortlist Candidate', color: '#16a34a' },
    reject: { title: 'Reject Application', message: `Reject ${app?.name}'s application? This cannot be undone.`, confirmLabel: 'Reject Application', color: '#dc2626' },
    interview: { title: 'Schedule Interview', message: `Move ${app?.name} to the interview stage?`, confirmLabel: 'Schedule Interview', color: '#2563eb' },
    offer: { title: 'Extend Offer', message: `Extend a job offer to ${app?.name}?`, confirmLabel: 'Extend Offer', color: '#16a34a' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Applicant Profile" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '22px', alignItems: 'start' }} aria-label="Loading applicant">
          <div className="cp-form-card">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div className="pf-skeleton" style={{ width: 70, height: 70, borderRadius: 20 }} />
              <div style={{ flex: 1 }}>
                <div className="pf-skeleton" style={{ width: '40%', height: 18, marginBottom: 9 }} />
                <div className="pf-skeleton" style={{ width: '55%', height: 12, marginBottom: 7 }} />
                <div className="pf-skeleton" style={{ width: '45%', height: 12 }} />
              </div>
            </div>
            <div className="pf-skeleton" style={{ width: '100%', height: 120 }} />
          </div>
          <div className="pf-skeleton" style={{ width: '100%', height: 130, borderRadius: 16 }} />
        </div>
      )}

      {!loading && app && (
        <div className="cp-dash-grid" style={{ gridTemplateColumns: undefined }}>
          {/* LEFT: MAIN DOSSIER */}
          <div className="cp-form-card">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {app.profile_photo ? (
                <img
                  src={app.profile_photo}
                  alt={app.name}
                  style={{ width: 70, height: 70, borderRadius: '20px', objectFit: 'cover', border: '1px solid var(--pf-line)', boxShadow: 'var(--pf-shadow-sm)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="cp-list-avatar"
                style={{ width: 70, height: 70, borderRadius: '20px', fontSize: '26px', fontFamily: 'var(--pf-display)', display: app.profile_photo ? 'none' : 'flex' }}
              >
                {(app.name || '?').charAt(0)}
              </div>
              <div>
                <h2 className="pf-display" style={{ margin: '0 0 4px', fontSize: '21px', fontWeight: 700, color: 'var(--pf-text)' }}>{app.name}</h2>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--pf-text-2)' }}>{app.institution || app.college}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--pf-text-3)' }}>
                  📍 {app.location || '—'} {app.department ? `· ${app.department}` : ''} {app.class_of ? `· Class of ${app.class_of}` : ''}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--pf-text-2)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {app.email && <a href={`mailto:${app.email}`} style={{ color: 'var(--pf-primary)', textDecoration: 'none', fontWeight: 600 }}>✉ {app.email}</a>}
                  {app.phone && <span>📞 {app.phone}</span>}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px', borderTop: '1px solid var(--pf-line)', paddingTop: '18px' }}>
              <MiniStat label="CGPA" value={app.gpa_cgpa ?? '—'} />
              <MiniStat label="Branch" value={app.department || app.branch || '—'} />
              <MiniStat label="Current Year" value={app.current_year || '—'} />
            </div>

            {(app.experiences?.length > 0 || app.job_designation) && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px' }}>
                  Work Experience
                  {app.experience_level && (
                    <span style={{ marginLeft: 8, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--pf-primary-soft)', color: 'var(--pf-primary-deep)', verticalAlign: 'middle' }}>
                      {app.experience_level}{app.years_of_experience ? ` · ${app.years_of_experience} yr` : ''}
                    </span>
                  )}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(app.experiences?.length > 0
                    ? app.experiences
                    : [{ job_designation: app.job_designation, company: app.experience_company, duration: app.experience_duration }]
                  ).map((exp, i) => (
                    <div key={i} style={{ padding: '11px 14px', background: 'var(--pf-page)', border: '1px solid var(--pf-line)', borderRadius: '11px' }}>
                      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--pf-text)' }}>
                        {exp.job_designation || 'Role'}{exp.company ? ` · ${exp.company}` : ''}
                      </p>
                      {exp.duration && <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--pf-text-3)' }}>{exp.duration}{exp.years ? ` · ${exp.years} yr` : ''}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {app.skills && app.skills.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px' }}>Technical Proficiency</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {app.skills.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 13px', borderRadius: '99px',
                        background: 'var(--pf-ink)', color: '#fff',
                        fontSize: '12px', fontWeight: 600,
                        boxShadow: '0 4px 10px -5px rgba(11,21,38,0.5)',
                      }}
                    >
                      {typeof s === 'string' ? s : `${s.name}${s.level ? ` · ${s.level}` : ''}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {app.cover_letter && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px' }}>Cover Letter</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--pf-text-2)', lineHeight: 1.7, background: 'var(--pf-ember-soft)', padding: '15px 17px', borderRadius: '12px', border: '1px solid var(--pf-amber-ln)', whiteSpace: 'pre-wrap' }}>
                  {app.cover_letter}
                </p>
              </div>
            )}

            {app.certificates && app.certificates.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px' }}>Certificates</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {app.certificates.map((c, i) => {
                    const certName = typeof c === 'string' ? c : (c.name || c.title || 'Certificate');
                    const certUrl = typeof c === 'object' ? (c.url || c.link || c.certificate_url) : null;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--pf-page)', border: '1px solid var(--pf-line)', borderRadius: '11px', padding: '10px 14px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--pf-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span aria-hidden="true">🏅</span>{certName}
                        </span>
                        {certUrl && <a href={certUrl} target="_blank" rel="noreferrer" className="cp-link-btn" style={{ textDecoration: 'none' }}>View ↗</a>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {app.profile_summary && (
              <div style={{ marginBottom: '22px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px' }}>Professional Summary</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--pf-text-2)', lineHeight: 1.65, background: 'var(--pf-page)', padding: '15px 17px', borderRadius: '12px', border: '1px solid var(--pf-line)' }}>
                  {app.profile_summary}
                </p>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <h4 className="cp-form-section-title" style={{ fontSize: '14px', flex: 1 }}>Resume Preview</h4>
                
              </div>
              {app.resume_url ? (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '14px', flexWrap: 'wrap',
                    border: '1px solid var(--pf-line)', borderRadius: '12px',
                    padding: '16px 18px', background: 'var(--pf-page)',
                    boxShadow: 'var(--pf-shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '13px', minWidth: 0 }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '19px', background: 'var(--pf-red-bg)',
                        border: '1px solid var(--pf-red-ln)',
                      }}
                    >
                      📄
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--pf-text)' }}>
                        {app.name}'s Resume
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--pf-text-3)' }}>
                        Submitted with this application · opens in a new tab
                      </p>
                    </div>
                  </div>
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="pf-btn pf-btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    View Resume ↗
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    border: '1.5px dashed var(--pf-line-strong)', borderRadius: '12px',
                    padding: '24px', background: 'var(--pf-page)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', color: 'var(--pf-text-3)', fontSize: '13px', textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '22px' }} aria-hidden="true">📄</span>
                  No resume link received from the server for this application
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: STATUS + ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                position: 'relative', overflow: 'hidden',
                background: 'radial-gradient(300px 160px at 110% -20%, rgba(245,158,11,0.18), transparent 60%), linear-gradient(165deg, var(--pf-ink-2) 0%, var(--pf-ink) 100%)',
                borderRadius: 'var(--pf-r-lg)', padding: '18px', color: '#fff',
                boxShadow: 'var(--pf-shadow-md)',
              }}
            >
              <div className="pf-ember-line" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pf-ink-text)' }}>APPLICATION STATUS</span>
                <StatusPill status={app.status} />
              </div>
              <p style={{ margin: '0 0 3px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pf-ink-text)' }}>APPLYING FOR</p>
              <p className="pf-display" style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '15.5px' }}>{app.job_title || app.role}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--pf-ink-text)', borderTop: '1px solid var(--pf-ink-line)', paddingTop: '10px' }}>
                <span>Applied: {app.applied_date}</span>
                <span>ID: {app.application_id || app.id}</span>
              </div>
            </div>

            {(app.portfolio_url || app.credentials_url) && (
              <div className="cp-panel" style={{ padding: '16px 18px' }}>
                <h4 className="pf-display" style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--pf-text)' }}>Quick Links</h4>
                {app.portfolio_url && (
                  <a href={app.portfolio_url} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '13px', color: 'var(--pf-primary)', textDecoration: 'none', marginBottom: '8px', fontWeight: 600 }}>
                    🔗 Personal Portfolio
                  </a>
                )}
                {app.credentials_url && (
                  <a href={app.credentials_url} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '13px', color: 'var(--pf-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    🏅 Digital Credentials
                  </a>
                )}
              </div>
            )}

            <div className="cp-panel" style={{ padding: '16px 18px' }}>
              <h4 className="pf-display" style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--pf-text)' }}>Recruiter Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {app.status !== 'Interview' && app.status !== 'Offered' && (
                  <button onClick={() => setConfirmAction({ type: 'interview' })} className="pf-btn pf-btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    🕐 Schedule Interview
                  </button>
                )}
                {app.status !== 'Offered' && (
                  <button onClick={() => setConfirmAction({ type: 'offer' })} className="pf-btn pf-btn-ghost" style={{ justifyContent: 'flex-start' }}>
                    💼 Extend Offer
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {app.status !== 'Shortlisted' && (
                <button onClick={() => setConfirmAction({ type: 'shortlist' })} className="pf-btn pf-btn-primary pf-btn-lg">
                  Shortlist Candidate
                </button>
              )}
              {app.status !== 'Rejected' && (
                <button
                  onClick={() => setConfirmAction({ type: 'reject' })}
                  className="pf-btn pf-btn-ghost pf-btn-lg"
                  style={{ color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}
                >
                  Reject Application
                </button>
              )}
              <p style={{ margin: 0, textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.08em' }}>
                FINAL DECISION CANNOT BE UNDONE
              </p>
            </div>
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

function MiniStat({ label, value }) {
  return (
    <div style={{ background: 'var(--pf-page)', borderRadius: '11px', border: '1px solid var(--pf-line)', padding: '10px 12px', textAlign: 'center' }}>
      <p className="cp-detail-label" style={{ marginBottom: '3px' }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 700, color: 'var(--pf-text)', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
    </div>
  );
}

export default ApplicantProfile;
