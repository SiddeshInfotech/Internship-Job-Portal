import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import SkillPicker from '../../components/SkillPicker';
import { useToast } from '../../context/ToastContext';
import { SKILL_LEVELS } from '../../utils/skillsData';
import { 
  FiTrash2, 
  FiUser, 
  FiBookOpen, 
  FiAward, 
  FiBriefcase, 
  FiPlus, 
  FiCheck,
  FiChevronRight,
  FiAlertCircle
} from 'react-icons/fi';

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
      if ('gpa' in payload) payload.gpa_cgpa = payload.gpa;
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

  // Stepper UI helper
  const steps = [
    { id: 1, title: 'Personal Info', icon: <FiUser /> },
    { id: 2, title: 'Academics & Exp', icon: <FiBookOpen /> },
    { id: 3, title: 'Skills & Certs', icon: <FiAward /> }
  ];

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .loader-circle {
          position: absolute;
          border-radius: 50%;
          border: 2px solid #4f46e5;
          animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .glass-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl pointer-events-none -z-10" />

        <header className="glass-header border-b border-slate-200/60 sticky top-0 z-50 transition-all">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
                  P
                </div>
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">Placify</span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <Link to="/student/browse-jobs" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Browse Jobs</Link>
                <Link to="/student/applications" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">My Applications</Link>
              </div>
            </div>
            <Link to="/student/browse-jobs" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
              Skip for Now
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          
          {/* Progress Stepper */}
          <div className="mb-10 animate-entrance">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-8">
              Complete Your Profile
            </h2>
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center relative z-10 w-24">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-sm ${
                      step === s.id 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-blue-600/30' 
                        : step > s.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white text-slate-400 border border-slate-200'
                    }`}>
                      {step > s.id ? <FiCheck size={20} /> : s.icon}
                    </div>
                    <span className={`text-xs font-bold mt-3 absolute -bottom-6 w-32 text-center transition-colors ${step === s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-[2px] mx-2 sm:mx-4 bg-slate-200 relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-700 ease-out"
                        style={{ width: step > s.id ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-16">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-entrance">
                <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {loading ? (
              // Premium Circular Loading State
              <div className="py-32 flex flex-col items-center justify-center animate-entrance delay-100">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="loader-circle w-full h-full" style={{ animationDelay: '0s' }}></div>
                  <div className="loader-circle w-3/4 h-3/4" style={{ animationDelay: '0.4s' }}></div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 flex items-center justify-center text-white relative z-10">
                    <FiUser size={20} className="animate-pulse" />
                  </div>
                </div>
                <p className="mt-6 text-sm font-bold text-blue-600 tracking-wider uppercase animate-pulse">
                  Loading Profile...
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 animate-entrance delay-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-600"></div>
                
                {step === 1 && (
                  <div className="animate-entrance">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Information</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} placeholder="John Doe" /></Field>
                      <Field label="Email Address"><input value={email} disabled className={`${inputCls} bg-slate-100 text-slate-500 border-slate-200/60 cursor-not-allowed`} /></Field>
                      <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} placeholder="e.g. Engineering" /></Field>
                      <Field label="College"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="University Name" /></Field>
                      <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} placeholder="e.g. 3rd Year" /></Field>
                      <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} placeholder="+1 234 567 890" /></Field>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                      <Field label="City"><input value={form.city} onChange={update('city')} className={inputCls} placeholder="New York" /></Field>
                      <Field label="Pin Code"><input value={form.pincode} onChange={update('pincode')} className={inputCls} placeholder="10001" /></Field>
                      <Field label="State"><input value={form.state} onChange={update('state')} className={inputCls} placeholder="NY" /></Field>
                    </div>
                    
                    <Field label="LinkedIn URL" className="mb-5">
                      <input value={form.linkedin_url} onChange={update('linkedin_url')} className={inputCls} placeholder="https://linkedin.com/in/username" />
                    </Field>
                    
                    <Field label="Profile Summary">
                      <textarea rows={4} value={form.profile_summary} onChange={update('profile_summary')} className={`${inputCls} resize-none`} placeholder="Write a brief overview about yourself, your goals, and achievements..." />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-entrance">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <FiBookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Information</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 mb-8">
                      <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} placeholder="ENR2021001" /></Field>
                      <Field label="College Name"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="University Name" /></Field>
                      <Field label="College Address"><input value={form.college_address} onChange={update('college_address')} className={inputCls} placeholder="City, State" /></Field>
                      <Field label="Course"><input value={form.course} onChange={update('course')} className={inputCls} placeholder="B.Tech Computer Science" /></Field>
                      <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} placeholder="e.g. Final Year" /></Field>
                      <Field label="GPA / CGPA"><input value={form.gpa} onChange={update('gpa')} className={inputCls} placeholder="e.g. 8.5" /></Field>
                      
                      <Field label="Experience Level">
                        <div className="relative">
                          <select value={form.experience_level || 'Fresher'} onChange={update('experience_level')} className={`${inputCls} appearance-none cursor-pointer`}>
                            <option value="Fresher">Fresher (No Experience)</option>
                            <option value="Experienced">Experienced (Internships/Jobs)</option>
                          </select>
                          <FiChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                        </div>
                      </Field>
                    </div>

                    {form.experience_level === 'Experienced' && (
                      <div className="pt-6 border-t border-slate-100 animate-entrance">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2 text-slate-900">
                            <FiBriefcase className="text-blue-600" />
                            <h4 className="font-extrabold text-lg">Work Experience</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExperiences((prev) => [...prev, { job_designation: '', company: '', duration: '', years: '' }])}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors"
                          >
                            <FiPlus /> Add Role
                          </button>
                        </div>

                        {experiences.length === 0 ? (
                          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-3 group-hover:text-blue-600 transition-colors">
                              <FiBriefcase size={20} />
                            </div>
                            <p className="text-sm font-semibold text-slate-600 mb-1">No experience added yet.</p>
                            <p className="text-xs text-slate-400">Click "Add Role" above to list your internships or jobs.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {experiences.map((exp, i) => (
                              <div key={i} className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden">
                                <div className="absolute left-0 top-0 w-1 h-full bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                                
                                <div className="flex items-center justify-between mb-5 pl-2">
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                    Experience {i + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setExperiences((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                    title="Remove"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 pl-2">
                                  <Field label="Job Title">
                                    <input value={exp.job_designation} onChange={(e) => updateExp(i, 'job_designation', e.target.value)} className={inputCls} placeholder="e.g. Software Engineer Intern" />
                                  </Field>
                                  <Field label="Company">
                                    <input value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)} className={inputCls} placeholder="e.g. Infosys" />
                                  </Field>
                                  <Field label="Duration">
                                    <input value={exp.duration} onChange={(e) => updateExp(i, 'duration', e.target.value)} className={inputCls} placeholder="e.g. Jun 2024 – Dec 2024" />
                                  </Field>
                                  <Field label="Total Years">
                                    <input type="number" min="0" step="0.5" value={exp.years} onChange={(e) => updateExp(i, 'years', e.target.value)} className={inputCls} placeholder="e.g. 1.5" />
                                  </Field>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-entrance">
                    
                    {/* Certifications Section */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                          <FiAward className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Certifications</h3>
                      </div>

                      <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/60 mb-6">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <Field label="Certificate Name"><input value={certName} onChange={(e) => setCertName(e.target.value)} className={inputCls} placeholder="e.g. AWS Certified Developer" /></Field>
                          <Field label="Issued By"><input value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className={inputCls} placeholder="e.g. Amazon Web Services" /></Field>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                          <Field label="Certificate URL (Google Drive/Link)" className="flex-1 w-full">
                            <input value={certFileUrl} onChange={(e) => setCertFileUrl(e.target.value)} type="url" placeholder="https://drive.google.com/..." className={inputCls} />
                          </Field>
                          <button type="button" onClick={handleAddCert} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <FiPlus /> Add 
                          </button>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 mt-3 flex items-center gap-1.5">
                          <FiAlertCircle size={12} /> Please ensure external links (like Drive) are set to "Anyone with the link can view".
                        </p>
                      </div>

                      <div className="space-y-3">
                        {certifications.length === 0 && (
                          <p className="text-sm font-semibold text-slate-400 text-center py-4">No certifications added yet.</p>
                        )}
                        {certifications.map((c) => (
                          <div key={c.id} className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-amber-200 hover:shadow-sm transition-all">
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm">{c.certificate_name}</p>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">{c.issued_by}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {c.file_url ? (
                                <a href={c.file_url} target="_blank" rel="noreferrer" className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">View Link</a>
                              ) : (
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">No Link</span>
                              )}
                              <button onClick={() => handleDeleteCert(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                          <FiBookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technical Skills</h3>
                      </div>

                      <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/60 mb-6 flex flex-col sm:flex-row gap-4 items-end">
                        <Field label="Skill Name" className="flex-1 w-full">
                          <SkillPicker
                            value={skillName}
                            onChange={setSkillName}
                            onAdd={setSkillName}
                            fillMode
                            inputClassName={inputCls}
                            exclude={skills.map((s) => s.skill_name || s.name)}
                            placeholder="e.g. React, Python, Figma"
                          />
                        </Field>
                        <Field label="Proficiency Level" className="flex-1 w-full relative">
                          <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`}>
                            <option value="">Select level...</option>
                            {SKILL_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                          </select>
                          <FiChevronRight className="absolute right-4 top-[65%] -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                        </Field>
                        <button type="button" onClick={handleAddSkill} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <FiPlus /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {skills.length === 0 && (
                          <p className="text-sm font-semibold text-slate-400 text-center w-full py-4">No skills added yet.</p>
                        )}
                        {skills.map((s) => (
                          <div key={s.id} className="group flex items-center gap-3 bg-white border border-slate-200 rounded-xl pl-4 pr-2 py-2 hover:border-purple-200 hover:shadow-sm transition-all cursor-default">
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm block leading-tight">{s.skill_name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.level}</span>
                            </div>
                            <button onClick={() => handleDeleteSkill(s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  {step > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => navigate(`/student/profile-wizard/${step - 1}`)} 
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
                    >
                      ← Previous Step
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={clearStep} 
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
                    >
                      Clear Fields
                    </button>
                  )}
                  
                  <button 
                    type="button" 
                    disabled={saving} 
                    onClick={() => handleSaveNext(step === 3)} 
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    ) : step < 3 ? (
                      <>Save & Continue <FiChevronRight /></>
                    ) : (
                      <>Complete Profile <FiCheck /></>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const inputCls = "w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300";

function Field({ label, children, className = '' }) {
  return (
    <div className={`group flex flex-col ${className}`}>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      {children}
    </div>
  );
}

export default ProfileWizard;