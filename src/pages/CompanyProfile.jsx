import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import { pick, fmtDate } from '../utils/fields';

function CompanyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin/companies/${id}`);
      const data = res.data.company || res.data;
      data.name = pick(data, 'company_name', 'name') || 'Company';
      data.status = pick(data, 'admin_status', 'status', 'account_status') || 'Pending';
      setCompany(data);
    } catch (err) {
      setError('Could not load company. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const status = (company?.status || '').toLowerCase().trim();
  const isApproved = ['approved', 'verified', 'active'].includes(status);

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'approve') await axiosClient.patch(`/admin/companies/${id}/approve`);
      if (type === 'reject') await axiosClient.patch(`/admin/companies/${id}/reject`);
      if (type === 'block') await axiosClient.patch(`/admin/companies/${id}/block`);
      setConfirmAction(null);
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    approve: { title: 'Approve Company', message: `Approve ${company?.name} as a verified institutional partner?`, confirmLabel: 'Approve Account', color: '#16a34a' },
    reject: { title: 'Reject Company', message: `Reject ${company?.name}'s partnership application?`, confirmLabel: 'Reject Company', color: '#dc2626' },
    block: { title: 'Block Company', message: `Block ${company?.name}? They will no longer be able to post jobs or access the portal.`, confirmLabel: 'Block Company', color: '#dc2626' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <main className="admin-page-body pt-20" style={{ fontFamily: 'var(--pf-font)' }}>
      <TopNavbar title="Company Profile" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: 'var(--pf-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, fontWeight: 600 }}>
          <Link to="/admin/companies" style={{ color: 'var(--pf-text-3)', textDecoration: 'none' }}>Manage Companies</Link>
          {' › '}
          <span style={{ color: 'var(--pf-text)', fontWeight: 700 }}>{company?.name || '...'}</span>
        </nav>
        {company && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {status !== 'blocked' && (
              <button onClick={() => setConfirmAction({ type: 'block' })} className="pf-btn pf-btn-ghost pf-btn-sm" style={{ color: 'var(--pf-red)', borderColor: 'var(--pf-red-ln)' }}>Block</button>
            )}
            {!isApproved && (
              <button onClick={() => setConfirmAction({ type: 'approve' })} className="pf-btn pf-btn-ember pf-btn-sm">Approve Account</button>
            )}
          </div>
        )}
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div className="pf-card" style={{ padding: 24 }} aria-label="Loading company">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
            <div className="pf-skeleton" style={{ width: 64, height: 64, borderRadius: 14 }} />
            <div style={{ flex: 1 }}>
              <div className="pf-skeleton" style={{ width: '32%', height: 17, marginBottom: 9 }} />
              <div className="pf-skeleton" style={{ width: '22%', height: 12 }} />
            </div>
          </div>
          <div className="pf-skeleton" style={{ width: '100%', height: 60 }} />
        </div>
      )}

      {!loading && company && (
        <>
        <div className="pf-card" style={{ padding: '22px 24px', display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px' }}>
            {company.logo || company.profile_photo_url || company.logo_url ? (
              <img
                src={company.logo || company.profile_photo_url || company.logo_url}
                alt={company.name}
                style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'contain', background: '#f8fafc', border: '1px solid var(--pf-blue-ln)', padding: '4px' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--pf-primary-soft)', border: '1px solid var(--pf-blue-ln)', display: (company.logo || company.profile_photo_url || company.logo_url) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '24px', color: 'var(--pf-primary-deep)', fontFamily: 'var(--pf-display)' }}>
              {(company.name || '?').charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="pf-display" style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: 'var(--pf-text)' }}>{company.name}</h3>
                <StatusPill status={company.status} />
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--pf-text-3)' }}>{company.industry}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', flex: 1, minWidth: '320px' }}>
            <StatBlock label="Total Job Posts" value={company.total_job_posts ?? 0} />
            <StatBlock label="Total Applications" value={company.total_applications ?? 0} />
            <StatBlock label="Hired Students" value={company.hired_students ?? 0} />
            <StatBlock label="Pending Reviews" value={company.pending_reviews ?? 0} />
          </div>
        </div>

        <div className="cp-dash-grid">
          <div className="pf-card" style={{ padding: '20px' }}>
            <h4 className="pf-display" style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>Contact Details</h4>
            <ContactRow icon="✉️" value={company.email} />
            <ContactRow icon="📞" value={company.phone} />
            <ContactRow icon="📍" value={company.location || company.address} />
            {company.website && <ContactRow icon="🌐" value={company.website} />}
            {(company.city || company.state) && <ContactRow icon="🏙️" value={[company.city, company.state, company.pincode].filter(Boolean).join(', ')} />}
          </div>

          <div className="pf-card" style={{ padding: '20px' }}>
            <h4 className="pf-display" style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>Company Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <DetailField label="Industry" value={company.industry} />
              <DetailField label="Company Size" value={company.company_size} />
              <DetailField label="Year Established" value={company.year_established} />
              <DetailField label="HR Contact" value={company.hr_name} />
              <DetailField label="HR Email" value={company.hr_contact_email} />
              <DetailField label="Reg. Number" value={company.company_registration_number} />
              <DetailField label="Hiring Locations" value={company.hiring_locations} />
              <DetailField label="Job Types" value={Array.isArray(company.preferred_job_types) ? company.preferred_job_types.join(', ') : company.preferred_job_types} />
            </div>
            {company.about_company && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--pf-line)' }}>
                <p className="ap-sec-label">About Company</p>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--pf-text-2)', lineHeight: 1.6 }}>{company.about_company}</p>
              </div>
            )}
            {company.company_summary && (
              <div style={{ marginTop: '14px' }}>
                <p className="ap-sec-label">Company Summary</p>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--pf-text-2)', lineHeight: 1.6 }}>{company.company_summary}</p>
              </div>
            )}
          </div>

          <div className="pf-card" style={{ padding: '20px' }}>
            <h4 className="pf-display" style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700, color: 'var(--pf-text)' }}>Recent Job Posts</h4>
            {(!company.job_posts || company.job_posts.length === 0) && (
              <div className="cp-empty"><div className="cp-empty-icon" aria-hidden="true">💼</div>No job posts from this company yet.</div>
            )}
            {(company.job_posts || []).map((job, idx) => (
              <div key={job.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx === company.job_posts.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--pf-text)', fontSize: '13.5px' }}>{job.title}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--pf-text-3)' }}>
                    {fmtDate(pick(job, 'posted_date', 'created_at'))} • {job.location || 'Remote'} • {pick(job, 'applications', 'applications_count', 'applicants_count') ?? 0} applications
                  </p>
                </div>
                <StatusPill status={job.status} />
              </div>
            ))}
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
    </main>
  );
}

function StatBlock({ label, value }) {
  return (
    <div>
      <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, color: 'var(--pf-text-3)', letterSpacing: '0.06em' }}>{label.toUpperCase()}</p>
      <h3 className="pf-display" style={{ margin: 0, fontSize: '23px', fontWeight: 700, color: 'var(--pf-text)', fontVariantNumeric: 'tabular-nums' }}>{value}</h3>
    </div>
  );
}

function ContactRow({ icon, value }) {
  if (!value) return null;
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--pf-text-2)', margin: '0 0 12px 0' }}>
      <span>{icon}</span> {value}
    </p>
  );
}

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p style={{ margin: 0, fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--pf-text-3)' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '13.5px', fontWeight: 500, color: 'var(--pf-text)' }}>{value}</p>
    </div>
  );
}

export default CompanyProfile;
