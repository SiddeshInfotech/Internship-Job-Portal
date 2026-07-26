import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

// Section field groupings, matching the 3-step wizard exactly.
const SECTION_1_FIELDS = ['company_name', 'industry', 'contact', 'address', 'company_size', 'year_established', 'city', 'pincode', 'state'];
const SECTION_2_FIELDS = ['hr_name', 'hr_contact_email', 'about_company', 'company_summary'];
const SECTION_3_FIELDS = ['hiring_locations', 'preferred_job_types', 'company_registration_number', 'terms_accepted'];

function isFilled(v) {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && v !== '';
}

function sectionCompletion(profile, fields) {
  return fields.map((f) => ({ field: f, done: isFilled(profile?.[f]) }));
}

function CompanyProfileOverview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await clientAxios.get('/client/profile');
        setProfile(res.data.profile || res.data);
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
        <ClientTopNavbar title="Company Profile" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }} aria-label="Loading profile">
          {[0, 1, 2].map((i) => (
            <div key={i} className="cp-panel">
              <div className="pf-skeleton" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 12 }} />
              <div className="pf-skeleton" style={{ width: '55%', height: 15, marginBottom: 10 }} />
              <div className="pf-skeleton" style={{ width: '100%', height: 11, marginBottom: 6 }} />
              <div className="pf-skeleton" style={{ width: '80%', height: 11 }} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  const sec1 = sectionCompletion(profile, SECTION_1_FIELDS);
  const sec2 = sectionCompletion(profile, SECTION_2_FIELDS);
  const sec3 = sectionCompletion(profile, SECTION_3_FIELDS);
  const doneCount = (sec) => sec.filter((f) => f.done).length;
  const isSectionComplete = (sec) => doneCount(sec) === sec.length;

  const overallPct = Math.round(
    ((doneCount(sec1) + doneCount(sec2) + doneCount(sec3)) /
      (SECTION_1_FIELDS.length + SECTION_2_FIELDS.length + SECTION_3_FIELDS.length)) * 100
  );

  const labelMap = {
    company_name: 'Company Name', industry: 'Industry Type', contact: 'Email & Contact', address: 'Address',
    company_size: 'Company Size', year_established: 'Year Established', city: 'City', pincode: 'Pin Code', state: 'State',
    hr_name: 'HR Contact Details', hr_contact_email: 'HR Contact Email', about_company: 'About Company', company_summary: 'Company Summary',
    hiring_locations: 'Hiring Locations', preferred_job_types: 'Preferred Job Types', company_registration_number: 'Company Documents', terms_accepted: 'Terms & Conditions',
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Company Profile" />

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}

      <div className="cp-page-head" style={{ marginBottom: '12px' }}>
        <div>
          <h1>Complete Your Profile</h1>
          <p>Please complete all the sections to create your company profile.</p>
        </div>
        <span className={`pf-pill ${overallPct === 100 ? 'pf-pill-green' : 'pf-pill-amber'}`}>{overallPct}% complete</span>
      </div>

      {/* Overall progress — the ember line doubles as the progress fill */}
      <div
        role="progressbar"
        aria-valuenow={overallPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile completion"
        style={{ height: '6px', borderRadius: '99px', background: 'var(--pf-line)', marginBottom: '26px', overflow: 'hidden' }}
      >
        <div
          style={{
            height: '100%', width: `${overallPct}%`, borderRadius: '99px',
            background: overallPct === 100 ? 'var(--pf-green)' : 'var(--pf-ember-line)',
            transition: 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        <SectionCard
          number={1} icon="🏢" title="Basic Details"
          description="Add your company's basic details and contact information."
          items={sec1} labelMap={labelMap} complete={isSectionComplete(sec1)}
          onEdit={() => navigate('/company-profile/wizard/1')}
        />
        <SectionCard
          number={2} icon="ℹ️" title="Company Information"
          description="Provide more information about your company and online presence."
          items={sec2} labelMap={labelMap} complete={isSectionComplete(sec2)}
          onEdit={() => navigate('/company-profile/wizard/2')}
        />
        <SectionCard
          number={3} icon="🛡️" title="Hiring & Verification"
          description="Add hiring preferences and verify your company details."
          items={sec3} labelMap={labelMap} complete={isSectionComplete(sec3)}
          onEdit={() => navigate('/company-profile/wizard/3')}
        />
      </div>
    </main>
  );
}

function SectionCard({ number, icon, title, description, items, labelMap, complete, onEdit }) {
  return (
    <div className="pf-card pf-card-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '10px' }}>
        <span className="cp-metric-icon" style={{ marginBottom: 0 }} aria-hidden="true">{icon}</span>
        <div>
          <p style={{ margin: 0, fontSize: '10.5px', color: 'var(--pf-text-3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Section {number}</p>
          <h3 className="pf-display" style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--pf-text)' }}>{title}</h3>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--pf-text-3)', margin: '0 0 14px', lineHeight: 1.5 }}>{description}</p>
      <div style={{ flex: 1, marginBottom: '14px' }}>
        {items.map(({ field, done }) => (
          <p key={field} style={{ margin: '0 0 8px', fontSize: '13px', color: done ? 'var(--pf-text-2)' : 'var(--pf-text-3)', display: 'flex', alignItems: 'center', gap: '7px', opacity: done ? 1 : 0.65 }}>
            <span aria-hidden="true" style={{ color: done ? 'var(--pf-green)' : 'var(--pf-line-strong)', fontWeight: 700 }}>{done ? '✔' : '○'}</span>
            {labelMap[field] || field}
          </p>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pf-line)', paddingTop: '14px' }}>
        <span className={`pf-pill ${complete ? 'pf-pill-green' : 'pf-pill-amber'}`}>
          {complete ? 'Completed' : 'In Progress'}
        </span>
        <button onClick={onEdit} className="pf-btn pf-btn-ghost pf-btn-sm">
          {complete ? 'Edit' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default CompanyProfileOverview;
