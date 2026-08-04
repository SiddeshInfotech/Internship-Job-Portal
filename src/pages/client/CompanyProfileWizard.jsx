import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote', 'Hybrid'];
const STEP_TITLES = { 1: 'Basic Details', 2: 'Company Information', 3: 'Hiring & Verification' };

// Injected CSS for smooth animations and transitions
const wizardStyles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-step-content {
    animation: fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .cp-wizard-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02);
    border: 1px solid var(--pf-border);
    transition: all 0.3s ease;
  }
  .cp-step {
    transition: all 0.3s ease;
  }
  .cp-step.active .cp-step-dot {
    transform: scale(1.15);
    box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.15); /* Ember glow */
  }
`;

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
          hiring_locations: profile.hiring_locations || '', preferred_job_types: profile.preferred_job_types || [],
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

  const handlePrevious = () => {
    if (step > 1) {
      navigate(`/company-profile/wizard/${step - 1}`);
    }
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
      if (step === 3) payload.mark_completed = true;

      await clientAxios.put('/client/profile', payload);

      if (step < 3) navigate(`/company-profile/wizard/${step + 1}`);
      else navigate('/company-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this section. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
        <div style={{ position: 'relative', zIndex: 50 }}>
          <ClientTopNavbar title="Complete your Profile" />
        </div>
        <div className="cp-wizard-card" style={{ maxWidth: '900px', margin: '0 auto' }} aria-label="Loading profile">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div className="pf-skeleton" style={{ width: 120, height: 11, marginBottom: 8 }} />
              <div className="pf-skeleton" style={{ width: '100%', height: 40, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <style>{wizardStyles}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <ClientTopNavbar title="Complete your Profile" />
      </div>

      {/* Step indicator */}
      <div className="cp-steps" style={{ maxWidth: '900px', margin: '0 auto 32px' }}>
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <div className={`cp-step${n === step ? ' active' : ''}${n < step ? ' done' : ''}`}>
              <span className="cp-step-dot" style={{ transition: 'all 0.3s ease' }}>{n < step ? '✓' : n}</span>
              <span style={{ fontWeight: n === step ? 600 : 400 }}>{STEP_TITLES[n]}</span>
            </div>
            {n < 3 && <div className="cp-step-bar" style={{ transition: 'background 0.3s ease' }} />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="pf-alert-error animate-step-content" role="alert" style={{ maxWidth: '900px', margin: '0 auto 18px', borderRadius: '8px' }}>
          <span aria-hidden="true">⚠</span>{error}
        </div>
      )}

      {/* 
        Using key={step} forces React to unmount and remount this div when the step changes, 
        which retriggers the fadeSlideUp CSS animation for a clean transition. 
      */}
      <div key={step} className="cp-wizard-card animate-step-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--pf-text)', marginBottom: '4px' }}>
            {STEP_TITLES[step]}
          </h2>
          <p style={{ color: 'var(--pf-text-2)', fontSize: '14px' }}>
            Fill in the details below to complete this section of your profile.
          </p>
        </div>

        {step === 1 && (
          <>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="Company Name"><input className="pf-input" value={form.company_name} onChange={update('company_name')} placeholder="e.g. Placify Technologies" /></Field>
              <Field label="Registered Email">
                <input className="pf-input" value={email} disabled style={{ background: 'var(--pf-page)', color: 'var(--pf-text-3)', cursor: 'not-allowed' }} />
              </Field>
              <Field label="Industry Type"><input className="pf-input" value={form.industry} onChange={update('industry')} placeholder="e.g. Software, Manufacturing" /></Field>
              <Field label="Contact Number"><input className="pf-input" value={form.contact} onChange={update('contact')} placeholder="+91 xxxxx xxxxx" /></Field>
            </div>
            <Field label="Complete Address"><input className="pf-input" value={form.address} onChange={update('address')} style={{ marginBottom: '16px' }} placeholder="Office Street Address" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px 18px' }}>
              <Field label="Company Size"><input className="pf-input" value={form.company_size} onChange={update('company_size')} placeholder="e.g. 50-200" /></Field>
              <Field label="Year Established"><input className="pf-input" value={form.year_established} onChange={update('year_established')} placeholder="YYYY" /></Field>
              <Field label="City"><input className="pf-input" value={form.city} onChange={update('city')} placeholder="City Name" /></Field>
              <Field label="Pin Code"><input className="pf-input" value={form.pincode} onChange={update('pincode')} placeholder="000 000" /></Field>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Field label="State"><input className="pf-input" value={form.state} onChange={update('state')} placeholder="State" /></Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="HR Name"><input className="pf-input" value={form.hr_name} onChange={update('hr_name')} placeholder="Full Name" /></Field>
              <Field label="HR Contact Email"><input className="pf-input" value={form.hr_contact_email} onChange={update('hr_contact_email')} placeholder="name@company.com" /></Field>
              <Field label="Facebook URL"><input className="pf-input" value={form.facebook_url} onChange={update('facebook_url')} placeholder="https://facebook.com/..." /></Field>
              <Field label="HR Phone Number"><input className="pf-input" value={form.hr_phone_number} onChange={update('hr_phone_number')} placeholder="+91 xxxxx xxxxx" /></Field>
              <Field label="LinkedIn Page"><input className="pf-input" value={form.linkedin_url} onChange={update('linkedin_url')} placeholder="https://linkedin.com/company/..." /></Field>
              <Field label="Company Website"><input className="pf-input" value={form.website} onChange={update('website')} placeholder="https://www.yourdomain.com" /></Field>
            </div>
            <Field label="About Company (Short Pitch)">
              <input className="pf-input" value={form.about_company} onChange={update('about_company')} style={{ marginBottom: '16px' }} placeholder="A brief one-liner about what you do." />
            </Field>
            <Field label="Company Summary (Detailed)">
              <textarea 
                className="pf-input" 
                value={form.company_summary} 
                onChange={update('company_summary')} 
                rows="4"
                style={{ resize: 'vertical' }}
                placeholder="Share your company's mission, vision, and core values..." 
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <div className="cp-two-col" style={{ marginBottom: '16px' }}>
              <Field label="Hiring Locations">
                <input className="pf-input" value={form.hiring_locations} onChange={update('hiring_locations')} placeholder="e.g. Mumbai, Pune, Bangalore" />
              </Field>
              <Field label="GST Number (Optional)"><input className="pf-input" value={form.gst_number} onChange={update('gst_number')} placeholder="GSTIN" /></Field>

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
                        style={{
                          transition: 'all 0.2s ease',
                          ...(selected ? {
                            background: 'var(--pf-ink)', color: '#fff', borderColor: 'var(--pf-ink)',
                            boxShadow: '0 4px 12px -4px rgba(11,21,38,0.5)',
                            transform: 'translateY(-1px)'
                          } : {})
                        }}
                      >
                        {selected ? '✓ ' : ''}{t}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="PAN Number (Optional)"><input className="pf-input" value={form.pan_number} onChange={update('pan_number')} placeholder="Company PAN" /></Field>
            </div>
            <div className="cp-two-col" style={{ marginBottom: '24px' }}>
              <Field label="Company Registration Number"><input className="pf-input" value={form.company_registration_number} onChange={update('company_registration_number')} placeholder="Reg. Number" /></Field>
              <Field label="CIN Number (Optional)"><input className="pf-input" value={form.cin_number} onChange={update('cin_number')} placeholder="Corporate Identification Number" /></Field>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--pf-page)', borderRadius: '8px', border: '1px solid var(--pf-border)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13.5px', lineHeight: 1.55, color: 'var(--pf-text-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!form.terms_accepted}
                  onChange={update('terms_accepted')}
                  style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: 'var(--pf-primary)', flexShrink: 0, cursor: 'pointer' }}
                />
                <span>
                  <strong style={{ color: 'var(--pf-text)', display: 'block', marginBottom: '2px' }}>Terms & Verification</strong>
                  I certify that the information provided is accurate, up to date, and I agree to the Placify Terms & Conditions.
                </span>
              </label>
            </div>
          </>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--pf-border)', margin: '32px 0 24px' }} />

        <div className="cp-form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button type="button" onClick={clearStep} className="pf-btn pf-btn-ghost" style={{ color: 'var(--pf-text-3)' }}>
              Clear Fields
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 1 && (
              <button 
                type="button" 
                onClick={handlePrevious} 
                className="pf-btn pf-btn-ghost"
                disabled={saving}
              >
                ← Previous
              </button>
            )}
            
            <button 
              type="button" 
              onClick={handleSaveNext} 
              disabled={saving} 
              className="pf-btn pf-btn-ember"
              style={{ minWidth: '140px' }}
            >
              {saving ? 'Saving...' : step < 3 ? 'Save & Next →' : 'Complete Profile ✓'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label className="pf-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pf-text-2)' }}>{label}</label>
      {children}
    </div>
  );
}

export default CompanyProfileWizard;