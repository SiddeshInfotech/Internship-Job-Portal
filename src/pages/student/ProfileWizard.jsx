import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import SkillPicker from '../../components/SkillPicker';
import { useToast } from '../../context/ToastContext';
import { SKILL_LEVELS } from '../../utils/skillsData';
import { FiTrash2 } from 'react-icons/fi';

function ProfileWizard() {
  const { step: stepParam } = useParams();
  const step = Number(stepParam) || 1;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({});
  const [email, setEmail] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFileUrl, setCertFileUrl] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [experiences, setExperiences] = useState([]);
  const updateExp = (i, key, val) => setExperiences((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await studentAxios.get('/student/profile');
        const p = res.data.profile || res.data;
        setForm({
          name: p.name || '', department: p.department || '', college: p.college || '',
          current_year: p.current_year || '', mobile_no: p.mobile_no || '', city: p.city || '',
          pincode: p.pincode || '', state: p.state || '', linkedin_url: p.linkedin_url || '',
          profile_summary: p.profile_summary || '', enrollment_no: p.enrollment_no || '',
          college_address: p.college_address || '', course: p.course || '', gpa: p.gpa_cgpa || p.gpa || p.cgpa || '',
          experience_level: p.experience_level || 'Fresher',
          years_of_experience: p.years_of_experience || '',
          job_designation: p.job_designation || '',
          experience_company: p.experience_company || '',
          experience_duration: p.experience_duration || '',
        });
        // Multiple experiences: accept an array, or fall back to the legacy
        // single-experience fields if that's all the backend has.
        if (Array.isArray(p.experiences) && p.experiences.length) {
          setExperiences(p.experiences.map((e) => ({
            job_designation: e.job_designation || e.designation || e.title || '',
            company: e.company || e.experience_company || '',
            duration: e.duration || e.experience_duration || '',
            years: e.years || e.years_of_experience || '',
          })));
        } else if (p.job_designation || p.experience_company) {
          setExperiences([{ job_designation: p.job_designation || '', company: p.experience_company || '', duration: p.experience_duration || '', years: p.years_of_experience || '' }]);
        }
        setEmail(p.email || '');
        setCertifications(p.certifications || []);
        setSkills(p.skills || []);
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [step]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const clearStep = () => {
    if (step === 1) setForm((f) => ({ ...f, name: '', department: '', college: '', current_year: '', mobile_no: '', city: '', pincode: '', state: '', linkedin_url: '', profile_summary: '' }));
    if (step === 2) setForm((f) => ({ ...f, enrollment_no: '', college_address: '', course: '', gpa: '' }));
  };

  const fieldsForStep = () => {
    if (step === 1) return ['name', 'department', 'college', 'current_year', 'mobile_no', 'city', 'pincode', 'state', 'linkedin_url', 'profile_summary'];
    return ['enrollment_no', 'college_address', 'course', 'gpa', 'experience_level', 'years_of_experience', 'job_designation', 'experience_company', 'experience_duration'];
  };

  const handleSaveNext = async (isFinal) => {
    setError('');
    setSaving(true);
    try {
      const payload = {};
      fieldsForStep().forEach((f) => { payload[f] = form[f]; });
      // The DB column is `gpa_cgpa`; send that (plus a legacy `gpa` alias)
      // so the value survives the save→reload round-trip on any backend.
      if ('gpa' in payload) payload.gpa_cgpa = payload.gpa;
      // Send the full experiences list (plus keep the first one in the legacy
      // flat fields for any backend that hasn't adopted the array yet).
      if (step === 2 && form.experience_level === 'Experienced') {
        payload.experiences = experiences;
        payload.years_of_experience = experiences.reduce((sum, e) => sum + (parseFloat(e.years) || 0), 0);
        if (experiences[0]) {
          payload.job_designation = experiences[0].job_designation;
          payload.experience_company = experiences[0].company;
          payload.experience_duration = experiences[0].duration;
        }
      }
      if (isFinal) payload.mark_completed = true;
      await studentAxios.put('/student/profile', payload);

      if (step < 3) {
        showToast('Section saved.', 'success');
        navigate(`/student/profile-wizard/${step + 1}`);
      } else {
        showToast('Profile updated successfully! 🎉', 'success');
        setTimeout(() => navigate('/student/profile'), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this section.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCert = async () => {
    if (!certName.trim()) return;
    try {
      const res = await studentAxios.post('/student/profile/certifications', {
        certificate_name: certName, issued_by: certIssuer, file_url: certFileUrl || undefined,
      });
      setCertifications((c) => [...c, res.data.certification || { certificate_name: certName, issued_by: certIssuer, file_url: certFileUrl, id: Date.now() }]);
      setCertName(''); setCertIssuer(''); setCertFileUrl('');
    } catch (err) {
      setError('Could not add certification. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await studentAxios.delete(`/student/profile/certifications/${id}`);
      setCertifications((c) => c.filter((x) => x.id !== id));
    } catch (err) {
      setError('Could not delete certification. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddSkill = async () => {
    if (!skillName.trim()) return;
    try {
      const res = await studentAxios.post('/student/profile/skills', { skill_name: skillName, level: skillLevel });
      setSkills((s) => [...s, res.data.skill || { skill_name: skillName, level: skillLevel, id: Date.now() }]);
      setSkillName(''); setSkillLevel('');
    } catch (err) {
      setError('Could not add skill. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await studentAxios.delete(`/student/profile/skills/${id}`);
      setSkills((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      setError('Could not delete skill. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-lg text-[#0F172A]">Placify</span>
          </div>
          <Link to="/student/browse-jobs" className="text-sm text-slate-500">Browse Job</Link>
          <Link to="/student/applications" className="text-sm text-slate-500">My Applications</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/student/browse-jobs" className="text-sm font-semibold text-slate-600">« Skip for Now</Link>
          <h2 className="text-lg font-bold text-[#0F172A]">Complete your Profile</h2>
        </div>

        <p className="text-center text-sm font-bold text-slate-500 mb-5">Section {step} of 3</p>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading...</div>
        ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {step === 1 && (
            <>
              <h3 className="font-bold text-[#0F172A] mb-5">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} /></Field>
                <Field label="Email (Cannot Change) / Just Show"><input value={email} disabled className={`${inputCls} bg-slate-50 text-slate-400`} /></Field>
                <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} /></Field>
                <Field label="College"><input value={form.college} onChange={update('college')} className={inputCls} /></Field>
                <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} /></Field>
                <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Field label="City"><input value={form.city} onChange={update('city')} className={inputCls} /></Field>
                <Field label="Pin Code"><input value={form.pincode} onChange={update('pincode')} className={inputCls} /></Field>
                <Field label="State"><input value={form.state} onChange={update('state')} className={inputCls} /></Field>
              </div>
              <Field label="LinkedIn URL"><input value={form.linkedin_url} onChange={update('linkedin_url')} className={`${inputCls} mb-4`} /></Field>
              <Field label="Profile Summary"><textarea rows={3} value={form.profile_summary} onChange={update('profile_summary')} className={inputCls} /></Field>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-bold text-[#0F172A] mb-5">Academic Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} /></Field>
                <Field label="College Name"><input value={form.college} onChange={update('college')} className={inputCls} /></Field>
                <Field label="College Address"><input value={form.college_address} onChange={update('college_address')} className={inputCls} /></Field>
                <Field label="Course"><input value={form.course} onChange={update('course')} className={inputCls} /></Field>
                <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} /></Field>
                <Field label="GPA / CGPA"><input value={form.gpa} onChange={update('gpa')} className={inputCls} /></Field>
                <Field label="Experience Level">
                  <select value={form.experience_level || 'Fresher'} onChange={update('experience_level')} className={inputCls}>
                    <option value="Fresher">Fresher</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </Field>
              </div>

              {form.experience_level === 'Experienced' && (
                <div className="mt-2 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Work Experience</p>
                    <button
                      type="button"
                      onClick={() => setExperiences((prev) => [...prev, { job_designation: '', company: '', duration: '', years: '' }])}
                      className="text-xs font-bold text-[#1D4ED8] hover:text-[#0F172A] transition-colors"
                    >
                      ＋ Add experience
                    </button>
                  </div>

                  {experiences.length === 0 && (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-400 mb-2">
                      No experience added yet. Click "Add experience" to add one or more roles.
                    </div>
                  )}

                  <div className="space-y-3">
                    {experiences.map((exp, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Experience {i + 1}</span>
                          <button
                            type="button"
                            onClick={() => setExperiences((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Remove experience ${i + 1}`}
                          >
                            ✕ Remove
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field label="Job Designation">
                            <input value={exp.job_designation} onChange={(e) => updateExp(i, 'job_designation', e.target.value)} className={inputCls} placeholder="e.g. Software Engineer Intern" />
                          </Field>
                          <Field label="Company">
                            <input value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)} className={inputCls} placeholder="e.g. Infosys" />
                          </Field>
                          <Field label="Duration">
                            <input value={exp.duration} onChange={(e) => updateExp(i, 'duration', e.target.value)} className={inputCls} placeholder="e.g. Jun 2024 – Dec 2024" />
                          </Field>
                          <Field label="Years">
                            <input type="number" min="0" step="0.5" value={exp.years} onChange={(e) => updateExp(i, 'years', e.target.value)} className={inputCls} placeholder="e.g. 1.5" />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="font-bold text-[#0F172A] mb-4">Certification</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Certificate Name"><input value={certName} onChange={(e) => setCertName(e.target.value)} className={inputCls} /></Field>
                <Field label="Issued By"><input value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className={inputCls} /></Field>
              </div>
              <div className="flex gap-3 items-end mb-4">
                <Field label="Certificate PDF — Google Drive Link" className="flex-1">
                  <input
                    value={certFileUrl} onChange={(e) => setCertFileUrl(e.target.value)} type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    className={inputCls}
                  />
                </Field>
                <button type="button" onClick={handleAddCert} className="px-6 py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm whitespace-nowrap">Add</button>
              </div>
              <p className="text-xs text-slate-400 -mt-2 mb-4">Placify doesn't host files directly — upload your PDF to Google Drive, set sharing to "Anyone with the link," and paste it here. Optional, but recruiters can't verify a certificate without it.</p>
              <div className="space-y-2 mb-6">
                {certifications.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 text-sm">
                    <span className="font-semibold text-[#0F172A]">{c.certificate_name}</span>
                    <span className="text-slate-500">{c.issued_by}</span>
                    {c.file_url ? (
                      <a href={c.file_url} target="_blank" rel="noreferrer" className="text-[#F59E0B] font-semibold">View PDF</a>
                    ) : (
                      <span className="text-slate-300 text-xs">No file linked</span>
                    )}
                    <button onClick={() => handleDeleteCert(c.id)} className="text-red-500"><FiTrash2 size={15} /></button>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-[#0F172A] mb-4">Skill</h3>
              <div className="flex gap-3 items-end mb-4">
                <Field label="Skill Name" className="flex-1">
                  <SkillPicker
                    value={skillName}
                    onChange={setSkillName}
                    onAdd={setSkillName}
                    fillMode
                    inputClassName={inputCls}
                    exclude={skills.map((s) => s.skill_name || s.name)}
                    placeholder="Start typing, e.g. React"
                  />
                </Field>
                <Field label="Proficiency Level" className="flex-1">
                  <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={inputCls}>
                    <option value="">Select level</option>
                    {SKILL_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                  </select>
                </Field>
                <button type="button" onClick={handleAddSkill} className="px-6 py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm whitespace-nowrap">Add</button>
              </div>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 text-sm">
                    <span className="font-semibold text-[#0F172A]">{s.skill_name}</span>
                    <span className="text-slate-500">{s.level}</span>
                    <button onClick={() => handleDeleteSkill(s.id)} className="text-red-500"><FiTrash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button type="button" onClick={() => navigate(`/student/profile-wizard/${step - 1}`)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">Previous</button>
            ) : (
              <button type="button" onClick={clearStep} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">Clear</button>
            )}
            <button type="button" disabled={saving} onClick={() => handleSaveNext(step === 3)} className="px-8 py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm disabled:opacity-60">
              {saving ? 'Saving...' : step < 3 ? 'Save & Next' : 'Save Changes'}
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]";

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default ProfileWizard;
