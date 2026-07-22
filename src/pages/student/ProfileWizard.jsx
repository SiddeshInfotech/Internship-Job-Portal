import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { FiTrash2, FiCheck, FiChevronRight } from 'react-icons/fi';

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

  // Helper for Stepper UI
  const stepTitles = ["Personal Details", "Academic Info", "Skills & Certs"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* INJECTED STYLES FOR ANIMATIONS */}
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-step {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-card {
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }
      `}</style>

      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/images/brand/placify-icon.png" alt="Placify" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-lg text-[#0F172A]">Placify</span>
          </div>
          <Link to="/student/browse-jobs" className="text-sm text-slate-500 hover:text-[#F59E0B] transition-colors">Browse Job</Link>
          <Link to="/student/applications" className="text-sm text-slate-500 hover:text-[#F59E0B] transition-colors">My Applications</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">Complete your Profile</h2>
          <Link to="/student/browse-jobs" className="text-sm font-semibold text-slate-500 hover:text-[#0F172A] transition-colors flex items-center gap-1">
            Skip for Now <FiChevronRight />
          </Link>
        </div>

        {/* BEAUTIFUL VISUAL STEPPER */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;
            return (
              <div key={stepNumber} className="flex items-center">
                <div className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 
                    ${isActive ? 'bg-[#F59E0B] text-white shadow-lg ring-4 ring-amber-100' : 
                      isCompleted ? 'bg-green-500 text-white shadow-md' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                    {isCompleted ? <FiCheck size={18} /> : stepNumber}
                  </div>
                  <span className={`absolute top-12 text-xs font-bold w-24 text-center ${isActive ? 'text-[#0F172A]' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                    {title}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 sm:w-32 h-1 mx-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-400' : 'bg-slate-200'}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-5 py-4 rounded-xl mb-6 shadow-sm border border-red-100 flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div>{error}</div>}
        
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#F59E0B] rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Loading your profile...</p>
          </div>
        ) : (
          /* KEY={step} forces React to remount the div, triggering the CSS animation on step change */
          <div key={`step-${step}`} className="bg-white rounded-2xl border border-slate-200 p-8 glass-card animate-step">
            
            {step === 1 && (
              <>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-xl text-[#0F172A]">Personal Information</h3>
                  <p className="text-slate-500 text-sm mt-1">Let recruiters know who you are and where you're from.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} placeholder="e.g. John Doe" /></Field>
                  <Field label="Email (Cannot Change)"><input value={email} disabled className={`${inputCls} bg-slate-50 text-slate-400 border-slate-100`} /></Field>
                  <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} placeholder="e.g. Computer Science" /></Field>
                  <Field label="College"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="e.g. MIT" /></Field>
                  <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} placeholder="e.g. 3rd Year" /></Field>
                  <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} placeholder="e.g. +91 9876543210" /></Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                  <Field label="City"><input value={form.city} onChange={update('city')} className={inputCls} placeholder="e.g. Mumbai" /></Field>
                  <Field label="Pin Code"><input value={form.pincode} onChange={update('pincode')} className={inputCls} placeholder="e.g. 400001" /></Field>
                  <Field label="State"><input value={form.state} onChange={update('state')} className={inputCls} placeholder="e.g. Maharashtra" /></Field>
                </div>
                <Field label="LinkedIn URL"><input value={form.linkedin_url} onChange={update('linkedin_url')} className={`${inputCls} mb-5`} placeholder="https://linkedin.com/in/username" /></Field>
                <Field label="Profile Summary">
                  <textarea rows={4} value={form.profile_summary} onChange={update('profile_summary')} className={`${inputCls} resize-none`} placeholder="Briefly describe your goals, passions, and what makes you a great candidate..." />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-xl text-[#0F172A]">Academic Information</h3>
                  <p className="text-slate-500 text-sm mt-1">Detail your educational background and current standing.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} placeholder="e.g. 123456789" /></Field>
                  <Field label="College Name"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="e.g. University Name" /></Field>
                  <Field label="College Address" className="sm:col-span-2"><input value={form.college_address} onChange={update('college_address')} className={inputCls} placeholder="Full address of your institution" /></Field>
                  <Field label="Course"><input value={form.course} onChange={update('course')} className={inputCls} placeholder="e.g. B.Tech in IT" /></Field>
                  <Field label="GPA / CGPA"><input value={form.gpa} onChange={update('gpa')} className={inputCls} placeholder="e.g. 8.5" /></Field>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-xl text-[#0F172A]">Skills & Certifications</h3>
                  <p className="text-slate-500 text-sm mt-1">Stand out by highlighting your technical abilities and verified achievements.</p>
                </div>
                
                {/* Certifications Section */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
                  <h4 className="font-bold text-md text-[#0F172A] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#F59E0B] rounded-full"></div> Add Certification
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <Field label="Certificate Name"><input value={certName} onChange={(e) => setCertName(e.target.value)} className={inputCls} placeholder="e.g. AWS Cloud Practitioner" /></Field>
                    <Field label="Issued By"><input value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className={inputCls} placeholder="e.g. Amazon Web Services" /></Field>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-3">
                    <Field label="Certificate PDF (Google Drive Link)" className="flex-1 w-full">
                      <input
                        value={certFileUrl} onChange={(e) => setCertFileUrl(e.target.value)} type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        className={inputCls}
                      />
                    </Field>
                    <button type="button" onClick={handleAddCert} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] hover:shadow-lg transition-all duration-300 text-white font-bold text-sm whitespace-nowrap">
                      + Add Cert
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-5 pl-1">Note: Upload your PDF to Google Drive, set sharing to "Anyone with the link," and paste it here.</p>
                  
                  {certifications.length > 0 ? (
                    <div className="space-y-3">
                      {certifications.map((c) => (
                        <div key={c.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <span className="font-bold text-[#0F172A]">{c.certificate_name}</span>
                            <span className="text-slate-500 text-xs sm:text-sm bg-slate-100 px-2 py-0.5 rounded-md">{c.issued_by}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {c.file_url ? (
                              <a href={c.file_url} target="_blank" rel="noreferrer" className="text-[#F59E0B] font-bold hover:underline">View PDF</a>
                            ) : (
                              <span className="text-slate-300 text-xs italic">No link</span>
                            )}
                            <button onClick={() => handleDeleteCert(c.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><FiTrash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                      No certifications added yet.
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-md text-[#0F172A] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#F59E0B] rounded-full"></div> Add Skill
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-5">
                    <Field label="Skill Name" className="flex-1 w-full"><input value={skillName} onChange={(e) => setSkillName(e.target.value)} className={inputCls} placeholder="e.g. React.js" /></Field>
                    <Field label="Proficiency Level" className="flex-1 w-full"><input value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={inputCls} placeholder="e.g. Intermediate, Expert" /></Field>
                    <button type="button" onClick={handleAddSkill} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] hover:shadow-lg transition-all duration-300 text-white font-bold text-sm whitespace-nowrap">
                      + Add Skill
                    </button>
                  </div>
                  
                  {skills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {skills.map((s) => (
                        <div key={s.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-sm">
                          <div>
                            <span className="font-bold text-[#0F172A] block">{s.skill_name}</span>
                            <span className="text-slate-500 text-xs">{s.level}</span>
                          </div>
                          <button onClick={() => handleDeleteSkill(s.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-lg"><FiTrash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                      No skills added yet.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => navigate(`/student/profile-wizard/${step - 1}`)} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  ← Previous
                </button>
              ) : (
                <button type="button" onClick={clearStep} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                  Clear Fields
                </button>
              )}
              <button 
                type="button" 
                disabled={saving} 
                onClick={() => handleSaveNext(step === 3)} 
                className="px-8 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 text-white font-bold text-sm disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
              >
                {saving ? (
                  <>Saving <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div></>
                ) : step < 3 ? (
                  <>Save & Next <FiChevronRight /></>
                ) : (
                  <>Complete Profile <FiCheck /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Upgraded input class with smooth focus transitions and shadows
const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none transition-all duration-300 focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-50 focus:shadow-sm text-slate-700 placeholder-slate-300";

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default ProfileWizard;