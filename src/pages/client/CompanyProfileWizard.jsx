import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
const STEP_TITLES = { 1: 'Basic Details', 2: 'Company Information', 3: 'Hiring & Verification' };

function CompanyProfileWizard() {
  const { step: stepParam } = useParams();
  const step = Number(stepParam) || 1;
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await clientAxios.get('/client/profile');
        const profile = res.data.profile || res.data;
        setForm({
          company_name: profile.company_name || '', industry: profile.industry || '', contact: profile.contact || '',
          address: profile.address || '', company_size: profile.company_size || '', year_established: profile.year_established || '',
          city: profile.city || '', pincode: profile.pincode || '', state: profile.state || '',
          hr_name: profile.hr_name || '', hr_contact_email: profile.hr_contact_email || '', facebook_url: profile.facebook_url || '',
          hr_phone_number: profile.hr_phone_number || '', linkedin_url: profile.linkedin_url || '', website: profile.website || '',
          about_company: profile.about_company || '', company_summary: profile.company_summary || '',
          hiring_locations: profile.hiring_locations || '',
          preferred_job_types: Array.isArray(profile.preferred_job_types)
            ? profile.preferred_job_types
            : (profile.preferred_job_types || '').split(',').map((t) => t.trim()).filter(Boolean),
          company_registration_number: profile.company_registration_number || '', cin_number: profile.cin_number || '',
          gst_number: profile.gst_number || '', pan_number: profile.pan_number || '', terms_accepted: profile.terms_accepted || false,
        });
        setEmail(profile.email || '');
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [step]);

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const toggleJobType = (type) => {
    setForm((f) => {
      const list = f.preferred_job_types || [];
      return { ...f, preferred_job_types: list.includes(type) ? list.filter((t) => t !== type) : [...list, type] };
    });
  };

  const clearStep = () => {
    if (step === 1) setForm((f) => ({ ...f, company_name: '', industry: '', contact: '', address: '', company_size: '', year_established: '', city: '', pincode: '', state: '' }));
    if (step === 2) setForm((f) => ({ ...f, hr_name: '', hr_contact_email: '', facebook_url: '', hr_phone_number: '', linkedin_url: '', website: '', about_company: '', company_summary: '' }));
    if (step === 3) setForm((f) => ({ ...f, hiring_locations: '', preferred_job_types: [], company_registration_number: '', cin_number: '', gst_number: '', pan_number: '', terms_accepted: false }));
  };

  const fieldsForStep = () => {
    if (step === 1) return ['company_name', 'industry', 'contact', 'address', 'company_size', 'year_established', 'city', 'pincode', 'state'];
    if (step === 2) return ['hr_name', 'hr_contact_email', 'facebook_url', 'hr_phone_number', 'linkedin_url', 'website', 'about_company', 'company_summary'];
    return ['hiring_locations', 'preferred_job_types', 'company_registration_number', 'cin_number', 'gst_number', 'pan_number', 'terms_accepted'];
  };

  const handleSaveNext = async () => {
    setError('');
    setSaving(true);
    try {
      const payload = {};
      fieldsForStep().forEach((f) => { payload[f] = form[f]; });
      // DB-friendly serialization: the profile table stores these as plain
      // columns, so send strings/ints rather than arrays/booleans.
      if ('preferred_job_types' in payload) {
        payload.preferred_job_types = (payload.preferred_job_types || []).join(', ');
      }
      if ('terms_accepted' in payload) {
        payload.terms_accepted = payload.terms_accepted ? 1 : 0;
      }

      await clientAxios.put('/client/profile', payload);

      if (step < 3) navigate(`/company-profile/wizard/${step + 1}`);
      else navigate('/company-profile');
    } catch (err) {
      console.error('Profile save failed:', err.response?.status, err.response?.data);
      setError(
        err.response?.data?.message
        || err.response?.data?.error
        || (err.response?.status
          ? `Save failed (server responded ${err.response.status}). Please share this with the team: ${JSON.stringify(err.response.data || {}).slice(0, 140)}`
          : 'Could not reach the server. Check your connection (Render may be waking up) and try again.')
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
        <ClientTopNavbar title="Complete your Profile" />
        <div className="cp-form-card" style={{ maxWidth: '900px', margin: '0 auto' }} aria-label="Loading profile">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div className="pf-skeleton" style={{ width: 120, height: 11, marginBottom: 8 }} />
              <div className="pf-skeleton" style={{ width: '100%', height: 40 }} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Complete your Profile" />

      {/* Step indicator */}
      <div className="cp-steps" style={{ maxWidth: '900px', margin: '0 auto 22px' }}>
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <div className={`cp-step${n === step ? ' active' : ''}${n < step ? ' done' : ''}`}>
              <span className="cp-step-dot">{n < step ? '✓' : n}</span>
              <span>{STEP_TITLES[n]}</span>
            </div>
            {n < 3 && <div className="cp-step-bar" />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="pf-alert-error" role="alert" style={{ maxWidth: '900px', margin: '0 auto 18px' }}>
          <span aria-hidden="true">⚠</span>{error}
        </div>
      )}

      <div className="cp-form-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {step === 1 && (
          <>
            <h3 className="cp-form-section-title">Basic Company Information</h3>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="Company Name"><input className="pf-input" value={form.company_name} onChange={update('company_name')} /></Field>
              <Field label="Registered Email">
                <input className="pf-input" value={email} disabled style={{ background: 'var(--pf-page)', color: 'var(--pf-text-3)', cursor: 'not-allowed' }} />
              </Field>
              <Field label="Industry Type"><input className="pf-input" value={form.industry} onChange={update('industry')} /></Field>
              <Field label="Contact"><input className="pf-input" value={form.contact} onChange={update('contact')} /></Field>
            </div>
            <Field label="Address"><input className="pf-input" value={form.address} onChange={update('address')} style={{ marginBottom: '16px' }} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px 18px' }}>
              <Field label="Company Size"><input className="pf-input" value={form.company_size} onChange={update('company_size')} /></Field>
              <Field label="Year Est."><input className="pf-input" value={form.year_established} onChange={update('year_established')} /></Field>
              <Field label="City"><input className="pf-input" value={form.city} onChange={update('city')} /></Field>
              <Field label="Pin Code"><input className="pf-input" value={form.pincode} onChange={update('pincode')} /></Field>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Field label="State"><input className="pf-input" value={form.state} onChange={update('state')} /></Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="cp-form-section-title">Company Information</h3>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="HR Name"><input className="pf-input" value={form.hr_name} onChange={update('hr_name')} /></Field>
              <Field label="HR Contact Email"><input className="pf-input" value={form.hr_contact_email} onChange={update('hr_contact_email')} /></Field>
              <Field label="Facebook URL"><input className="pf-input" value={form.facebook_url} onChange={update('facebook_url')} /></Field>
              <Field label="HR Phone Number"><input className="pf-input" value={form.hr_phone_number} onChange={update('hr_phone_number')} /></Field>
              <Field label="LinkedIn"><input className="pf-input" value={form.linkedin_url} onChange={update('linkedin_url')} /></Field>
              <Field label="Website"><input className="pf-input" value={form.website} onChange={update('website')} /></Field>
            </div>
            <Field label="About Company"><input className="pf-input" value={form.about_company} onChange={update('about_company')} style={{ marginBottom: '16px' }} /></Field>
            <Field label="Company Summary"><input className="pf-input" value={form.company_summary} onChange={update('company_summary')} /></Field>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="cp-form-section-title">Company Hiring & Verification</h3>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="Hiring Locations">
                <input className="pf-input" value={form.hiring_locations} onChange={update('hiring_locations')} placeholder="e.g. Mumbai, Pune, Bangalore" />
              </Field>
              <Field label="GST Number (Optional)"><input className="pf-input" value={form.gst_number} onChange={update('gst_number')} /></Field>

              <Field label="Preferred Job Types">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                  {JOB_TYPES.map((t) => {
                    const selected = (form.preferred_job_types || []).includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleJobType(t)}
                        aria-pressed={selected}
                        className="filter-pill-btn"
                        style={selected ? {
                          background: 'var(--pf-ink)', color: '#fff', borderColor: 'var(--pf-ink)',
                          boxShadow: '0 4px 12px -4px rgba(11,21,38,0.5)',
                        } : undefined}
                      >
                        {selected ? '✓ ' : ''}{t}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="PAN Number (Optional)"><input className="pf-input" value={form.pan_number} onChange={update('pan_number')} /></Field>
            </div>
            <div className="cp-two-col" style={{ marginBottom: '18px' }}>
              <Field label="Company Registration Number"><input className="pf-input" value={form.company_registration_number} onChange={update('company_registration_number')} /></Field>
              <Field label="CIN Number (Optional)"><input className="pf-input" value={form.cin_number} onChange={update('cin_number')} /></Field>
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13px', lineHeight: 1.55, color: 'var(--pf-text-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!form.terms_accepted}
                onChange={update('terms_accepted')}
                style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: 'var(--pf-primary)', flexShrink: 0 }}
              />
              I certify that the information provided is accurate and I agree to the Placify Terms & Conditions.
            </label>
          </>
        )}

        <div className="cp-form-actions">
          <button type="button" onClick={clearStep} className="pf-btn pf-btn-ghost">Clear</button>
          <button type="button" onClick={handleSaveNext} disabled={saving} className="pf-btn pf-btn-ember">
            {saving ? 'Saving...' : step < 3 ? 'Save & Next →' : 'Save Profile'}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <label className="pf-label">{label}</label>
      {children}
    </div>
  );
}

export default CompanyProfileWizard;
