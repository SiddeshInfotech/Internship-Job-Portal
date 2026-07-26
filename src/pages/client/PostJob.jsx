import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';

function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing an existing job
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', department: '', job_type: 'Full-Time', description: '',
    eligibility_criteria: '', location: '', salary_stipend: '', last_date_to_apply: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await clientAxios.get(`/client/jobs/${id}`);
        const job = res.data.job || res.data;
        setForm({
          title: job.title || '', department: job.department || '', job_type: job.job_type || 'Full-Time',
          description: job.description || '', eligibility_criteria: job.eligibility_criteria || '',
          location: job.location || '', salary_stipend: job.salary_stipend || '',
          last_date_to_apply: job.last_date_to_apply ? job.last_date_to_apply.slice(0, 10) : '',
        });
        setSkills(Array.isArray(job.required_skills) ? job.required_skills : (job.required_skills || '').split(',').map((s) => s.trim()).filter(Boolean));
      } catch (err) {
        setError('Could not load job for editing. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      setSkills((s) => [...new Set([...s, skillInput.trim()])]);
      setSkillInput('');
    }
  };
  const removeSkill = (skill) => setSkills((s) => s.filter((x) => x !== skill));

  const buildPayload = () => ({
    title: form.title,
    department: form.department,
    job_type: form.job_type,
    description: form.description,
    required_skills: skills,
    eligibility_criteria: form.eligibility_criteria,
    location: form.location,
    salary_stipend: form.salary_stipend,
    last_date_to_apply: form.last_date_to_apply,
  });

  const save = async (submitNow) => {
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await clientAxios.put(`/client/jobs/${id}`, buildPayload());
        if (submitNow) await clientAxios.patch(`/client/jobs/${id}/submit`);
      } else {
        await clientAxios.post('/client/jobs', { ...buildPayload(), submit_now: submitNow || undefined });
      }
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this job. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.title && form.description && form.location && form.salary_stipend && form.last_date_to_apply;

  return (
    <main style={{ padding: '24px', fontFamily: 'var(--pf-font)' }}>
      <ClientTopNavbar title="Post a job" />

      <div className="cp-page-head" style={{ alignItems: 'center' }}>
        <div>
          <h1>{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>
          <p>Fill in the details below to reach the best talent in our network.</p>
        </div>
        <span className="pf-pill pf-pill-blue">Drafts are saved to your listings</span>
      </div>

      {error && <div className="pf-alert-error" role="alert"><span aria-hidden="true">⚠</span>{error}</div>}
      {loading && (
        <div className="cp-form-card" aria-label="Loading job">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div className="pf-skeleton" style={{ width: 110, height: 11, marginBottom: 8 }} />
              <div className="pf-skeleton" style={{ width: '100%', height: 40 }} />
            </div>
          ))}
        </div>
      )}

      {!loading && (
      <div className="cp-form-card">

        <SectionHeader n={1} title="Basic Information" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '22px' }}>
          <Field label="Job Title" htmlFor="pj-title">
            <input id="pj-title" className="pf-input" value={form.title} onChange={update('title')} placeholder="e.g. Senior Frontend Engineer" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'end' }}>
            <Field label="Department" htmlFor="pj-dept">
              <input id="pj-dept" className="pf-input" value={form.department} onChange={update('department')} placeholder="e.g. Engineering" />
            </Field>
            <Field label="Job Type">
              <div
                role="group"
                aria-label="Job type"
                style={{
                  display: 'flex', border: '1px solid var(--pf-line-strong)', borderRadius: '10px',
                  overflow: 'hidden', boxShadow: 'var(--pf-shadow-xs)',
                }}
              >
                {['Internship', 'Full-Time'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm((f) => ({ ...f, job_type: t }))}
                    aria-pressed={form.job_type === t}
                    style={{
                      padding: '11px 18px', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--pf-font)', fontSize: '13px', fontWeight: 600,
                      background: form.job_type === t ? 'var(--pf-ink)' : 'var(--pf-card)',
                      color: form.job_type === t ? '#fff' : 'var(--pf-text-2)',
                      transition: 'background 150ms ease, color 150ms ease',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        <SectionHeader n={2} title="Role & Requirements" />
        <div style={{ marginBottom: '20px' }}>
          <Field label="Job Description" htmlFor="pj-desc">
            <textarea id="pj-desc" className="pf-textarea" value={form.description} onChange={update('description')} rows={5} placeholder="Describe the responsibilities, day-to-day tasks, and expectations..." style={{ resize: 'vertical' }} />
          </Field>
        </div>
        <div className="cp-form-grid" style={{ marginBottom: '22px' }}>
          <Field label="Required Skills">
            <div
              style={{
                border: '1px solid var(--pf-line-strong)', borderRadius: '10px',
                padding: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
                background: 'var(--pf-card)', boxShadow: 'var(--pf-shadow-xs)',
              }}
            >
              {skills.map((s) => (
                <span key={s} className="pf-pill pf-pill-blue" style={{ paddingRight: '6px' }}>
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    aria-label={`Remove ${s}`}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit', fontSize: '13px', padding: '0 2px', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Add a skill..."
                aria-label="Add a skill"
                style={{ border: 'none', outline: 'none', flex: 1, minWidth: '100px', fontSize: '13px', fontFamily: 'var(--pf-font)', background: 'transparent', color: 'var(--pf-text)' }}
              />
            </div>
            <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: 'var(--pf-text-3)' }}>Press enter or comma to add a new skill.</p>
          </Field>
          <Field label="Eligibility Criteria" htmlFor="pj-elig">
            <textarea id="pj-elig" className="pf-textarea" value={form.eligibility_criteria} onChange={update('eligibility_criteria')} rows={3} placeholder="e.g. B.Tech in CSE/IT, Min 7.5 CGPA, Batch of 2024" style={{ resize: 'vertical' }} />
          </Field>
        </div>

        <SectionHeader n={3} title="Logistics & Timeline" />
        <div className="cp-form-grid" style={{ marginBottom: '4px' }}>
          <Field label="Location" htmlFor="pj-loc">
            <input id="pj-loc" className="pf-input" value={form.location} onChange={update('location')} placeholder="Bengaluru, KA (Remote)" />
          </Field>
          <Field label="Salary / Stipend" htmlFor="pj-sal">
            <input id="pj-sal" className="pf-input" value={form.salary_stipend} onChange={update('salary_stipend')} placeholder="₹15,00,000 - 18,00,000 LPA" />
          </Field>
          <Field label="Last Date to Apply" htmlFor="pj-date">
            <input id="pj-date" className="pf-input" type="date" value={form.last_date_to_apply} onChange={update('last_date_to_apply')} />
          </Field>
        </div>

        <div className="cp-form-actions" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: isValid ? 'var(--pf-green)' : 'var(--pf-text-3)' }}>
            {isValid ? '✓ Form is valid and ready to post' : 'Fill in all required fields to post'}
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => navigate('/jobs')} className="pf-btn pf-btn-ghost">Cancel</button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(false)}
              className="pf-btn pf-btn-ghost"
              style={{ color: 'var(--pf-primary)', borderColor: 'var(--pf-blue-ln)' }}
            >
              Save draft
            </button>
            <button type="button" disabled={saving || !isValid} onClick={() => save(true)} className="pf-btn pf-btn-ember">
              {saving ? 'Saving...' : 'Post Job'}
            </button>
          </div>
        </div>
      </div>
      )}

      <div className="cp-tip-box" style={{ marginTop: '20px' }}>
        <span aria-hidden="true">💼</span>
        <span>
          <b>Pro tip — better listings, better applicants:</b> including specific salary ranges and clearly
          defined eligibility criteria typically results in a 40% higher conversion rate of qualified
          applicants. Make sure your location says whether the role is Remote, Hybrid, or On-site.
        </span>
      </div>
    </main>
  );
}

function SectionHeader({ n, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--pf-line)' }}>
      <span className="cp-step-dot" style={{ background: 'var(--pf-ink)', color: '#fff', borderColor: 'var(--pf-ink)' }}>{n}</span>
      <h4 className="pf-display" style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--pf-text)' }}>{title}</h4>
    </div>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="cp-field" style={{ marginBottom: 0 }}>
      <label className="pf-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

export default PostJob;
