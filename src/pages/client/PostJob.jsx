import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import SkillPicker from '../../components/SkillPicker';
import { useToast } from '../../context/ToastContext';
import { 
  FiAlertCircle, 
  FiInfo, 
  FiCheckCircle, 
  FiX, 
  FiSave, 
  FiSend, 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar, 
  FiFileText,
  FiAward,
  FiTarget
} from 'react-icons/fi';

function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
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
  
  // Premium Animated Popup State
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

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
          last_date_to_apply: (() => {
            // <input type="date"> needs YYYY-MM-DD; API may send a full timestamp
            const raw = job.last_date_to_apply;
            if (!raw) return '';
            const d = new Date(raw);
            return Number.isNaN(d.getTime()) ? String(raw).slice(0, 10) : d.toISOString().slice(0, 10);
          })(),
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

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup(prev => ({ ...prev, show: false })), 4000);
  };

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
      
      const successMsg = isEdit ? 'Job updated successfully!' : 'Job posted successfully! 🎉';
      showToast(successMsg, 'success');
      showPopup('success', successMsg);
      
      setTimeout(() => navigate('/jobs'), 1200);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not save this job. Please check the form and try again.';
      setError(errMsg);
      showPopup('error', errMsg);
    } finally {
      setSaving(false);
    }
  };

  const isValid = form.title && form.description && form.location && form.salary_stipend && form.last_date_to_apply;

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      {/* Root Container updated with min-h-screen w-full to prevent layout width jumping */}
      <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden font-sans text-slate-900 flex flex-col">
        
        <ClientTopNavbar title={isEdit ? "Edit Job" : "Post a job"} />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12 z-10">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-slide-up">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {isEdit ? 'Edit Listing' : 'Create New Listing'}
              </h1>
              <p className="text-slate-500 mt-2 font-medium text-base">
                Reach top-tier talent by filling out the specifics of your role below.
              </p>
            </div>
            <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <FiSave size={14} className="text-blue-600" /> Drafts autosave
            </div>
          </div>

          {/* Inline Error Alert */}
          {error && (
            <div className="mb-8 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-start gap-3 animate-slide-up shadow-sm">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="bg-white rounded-[2rem] p-10 border border-slate-200/60 shadow-sm animate-pulse space-y-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
                  <div className="h-14 bg-slate-100 rounded-2xl w-full" />
                  <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Main Form Container */}
          {!loading && (
            <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden animate-slide-up delay-100">
              
              <div className="p-8 sm:p-12 space-y-12">
                
                {/* SECTION 1 */}
                <section>
                  <SectionHeader n={1} title="Basic Information" />
                  <div className="grid grid-cols-1 gap-6">
                    <Field label="Job Title" htmlFor="pj-title" icon={FiBriefcase}>
                      <input 
                        id="pj-title" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium text-slate-900" 
                        value={form.title} 
                        onChange={update('title')} 
                        placeholder="e.g. Senior Frontend Engineer" 
                      />
                    </Field>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <Field label="Department" htmlFor="pj-dept" icon={FiTarget}>
                        <input 
                          id="pj-dept" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium text-slate-900" 
                          value={form.department} 
                          onChange={update('department')} 
                          placeholder="e.g. Engineering" 
                        />
                      </Field>

                      <div className="space-y-2.5">
                        <label className="block text-sm font-extrabold text-slate-700">Job Type</label>
                        <div className="flex p-1.5 bg-slate-100 border border-slate-200/80 rounded-2xl shadow-inner relative h-[58px]">
                          {['Internship', 'Full-Time'].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, job_type: t }))}
                              className={`flex-1 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-300 z-10 ${
                                form.job_type === t 
                                  ? 'text-blue-700 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                          {/* FIX: added `left-1.5` so it establishes an exact boundary origin within the relative container */}
                          <div 
                            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white border border-slate-200/50 rounded-xl transition-transform duration-300 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            style={{ transform: form.job_type === 'Internship' ? 'translateX(0)' : 'translateX(100%)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 2 */}
                <section>
                  <SectionHeader n={2} title="Role & Requirements" />
                  <div className="space-y-8">
                    <Field label="Job Description" htmlFor="pj-desc" icon={FiFileText} alignTop>
                      <textarea 
                        id="pj-desc" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 text-slate-900 resize-y min-h-[160px]" 
                        value={form.description} 
                        onChange={update('description')} 
                        placeholder="Describe the responsibilities, day-to-day tasks, and expectations..." 
                      />
                    </Field>

                    <Field label="Required Skills" icon={FiAward} alignTop>
                      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-3 py-3 min-h-[58px] flex flex-wrap gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/30 focus-within:border-blue-600 transition-all">
                        {skills.map((s) => (
                          <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 group transition-all hover:bg-blue-100">
                            {s}
                            <button
                              type="button"
                              onClick={() => removeSkill(s)}
                              className="text-blue-500 hover:text-rose-500 transition-colors focus:outline-none p-0.5 rounded-md hover:bg-white/50"
                              aria-label={`Remove ${s}`}
                            >
                              <FiX size={14} />
                            </button>
                          </span>
                        ))}
                        <div className="flex-1 min-w-[180px] flex items-center py-1">
                          <SkillPicker
                            value={skillInput}
                            onChange={setSkillInput}
                            onKeyDown={addSkill}
                            onAdd={(picked) => setSkills((prev) => [...new Set([...prev, picked])])}
                            exclude={skills}
                            placeholder={skills.length === 0 ? "Type or pick a skill..." : "Add another skill..."}
                            inputClassName="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold placeholder:text-slate-400 text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-slate-400 mt-2.5 ml-1 flex items-center gap-1.5">
                        <FiInfo size={12} /> Press enter or comma to quickly add a skill.
                      </p>
                    </Field>

                    <Field label="Eligibility Criteria" htmlFor="pj-elig" icon={FiCheckCircle} alignTop>
                      <textarea 
                        id="pj-elig" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 text-slate-900 resize-y min-h-[120px]" 
                        value={form.eligibility_criteria} 
                        onChange={update('eligibility_criteria')} 
                        placeholder="e.g. B.Tech in CSE/IT, Min 7.5 CGPA, Batch of 2024" 
                      />
                    </Field>
                  </div>
                </section>

                {/* SECTION 3 */}
                <section>
                  <SectionHeader n={3} title="Logistics & Timeline" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field label="Location" htmlFor="pj-loc" icon={FiMapPin}>
                      <input 
                        id="pj-loc" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold placeholder:text-slate-400 text-slate-900 placeholder:font-medium" 
                        value={form.location} 
                        onChange={update('location')} 
                        placeholder="Bengaluru (Remote)" 
                      />
                    </Field>
                    <Field label="Salary / Stipend" htmlFor="pj-sal">
                      <input 
                        id="pj-sal" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold placeholder:text-slate-400 text-slate-900 placeholder:font-medium" 
                        value={form.salary_stipend} 
                        onChange={update('salary_stipend')} 
                        placeholder="₹15 - 18 LPA" 
                      />
                    </Field>
                    <Field label="Last Date to Apply" htmlFor="pj-date" icon={FiCalendar}>
                      <input 
                        id="pj-date" 
                        type="date" 
                        className="w-full px-4 pl-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold text-slate-900" 
                        value={form.last_date_to_apply} 
                        onChange={update('last_date_to_apply')} 
                      />
                    </Field>
                  </div>
                </section>

              </div>
            </div>
          )}

          {/* Pro Tip Box */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-slide-up delay-200">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-50">
              <FiBriefcase size={26} />
            </div>
            <p className="text-sm sm:text-base text-indigo-950 leading-relaxed font-medium">
              <strong className="font-extrabold text-blue-700 tracking-tight block mb-1">Pro Tip for Maximum Reach:</strong> 
              Listings with transparent salary ranges and clear eligibility criteria see a <span className="bg-white text-blue-700 px-2 py-0.5 rounded-md font-bold shadow-sm inline-block mx-1">40% higher</span> conversion rate of top-tier applicants.
            </p>
          </div>
        </main>

        <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] w-full py-4 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 w-full sm:w-auto justify-center sm:justify-start ${isValid ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isValid ? (
                <><FiCheckCircle size={20} /> Ready to post</>
              ) : (
                <><FiInfo size={20} /> Fill all required fields</>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={() => navigate('/jobs')} 
                className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => save(false)}
                className="flex-1 sm:flex-none px-6 py-3.5 text-sm font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-indigo-200/50 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiSave size={18} /> Draft
              </button>
              <button 
                type="button" 
                disabled={saving || !isValid} 
                onClick={() => save(true)} 
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
              >
                {saving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <FiSend size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                    Post Job
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* FIX: Changed translate-x-[120%] to translate-x-8. 
        Pushing a fixed element out beyond the viewport visually expands the document layout bounds, triggering horizontal page jumping. */}
        <div 
          className={`fixed top-8 right-8 z-50 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            popup.show ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
          }`}
          style={{ animation: popup.show ? 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards' : 'none' }}
        >
          <div className="bg-white/95 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-3.5 min-w-[320px] max-w-sm">
            {popup.type === 'success' ? (
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle size={22} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                <FiAlertCircle size={22} />
              </div>
            )}
            <div className="flex-1 pr-2">
              <p className={`text-sm font-bold ${popup.type === 'success' ? 'text-slate-900' : 'text-rose-700'}`}>
                {popup.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-snug">
                {popup.message}
              </p>
            </div>
            <button 
              onClick={() => setPopup(p => ({ ...p, show: false }))}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors absolute top-3 right-3"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

// Helper Components
function SectionHeader({ n, title }) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-100/60">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black shadow-sm ring-1 ring-inset ring-blue-100">
        0{n}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
    </div>
  );
}

function Field({ label, htmlFor, icon: Icon, alignTop = false, children }) {
  return (
    <div className="space-y-2.5 relative">
      <label className="block text-sm font-extrabold text-slate-700" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 ${alignTop ? 'top-4' : 'top-1/2 -translate-y-1/2'} text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10`}>
            <Icon size={20} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default PostJob;
