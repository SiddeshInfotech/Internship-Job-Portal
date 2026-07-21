import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { FiTrash2 } from 'react-icons/fi';

function ProfileWizard() {
  const { step: stepParam } = useParams();
  const step = Number(stepParam) || 1;
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [email, setEmail] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFileUrl, setCertFileUrl] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
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
        });
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
    return ['enrollment_no', 'college_address', 'course', 'gpa'];
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
      if (isFinal) payload.mark_completed = true;
      await studentAxios.put('/student/profile', payload);

      if (step < 3) navigate(`/student/profile-wizard/${step + 1}`);
      else navigate('/student/profile');
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
              </div>
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
                <Field label="Skill Name" className="flex-1"><input value={skillName} onChange={(e) => setSkillName(e.target.value)} className={inputCls} /></Field>
                <Field label="Level (Master, Pro, Medium, Beginner)" className="flex-1"><input value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={inputCls} /></Field>
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
