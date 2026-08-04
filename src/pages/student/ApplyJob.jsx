import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { useToast } from '../../context/ToastContext';
import { asArray } from '../../api/asArray';
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiSend, 
  FiLink,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [jobRes, profileRes, resumesRes] = await Promise.all([
          studentAxios.get(`/student/jobs/${jobId}`),
          studentAxios.get('/student/profile'),
          studentAxios.get('/student/resumes'),
        ]);
        setJob(jobRes.data.job || jobRes.data);
        setProfile(profileRes.data.profile || profileRes.data);
        const list = asArray(resumesRes.data.resumes, resumesRes.data);
        setResumes(list);
        const primary = list.find((r) => r.is_primary) || list[0];
        if (primary) setSelectedResumeId(primary.id);
      } catch (err) {
        setError('Could not load application form. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await studentAxios.post(`/student/jobs/${jobId}/apply`, {
        cover_letter: coverLetter || undefined,
        portfolio_link: portfolioLink || undefined,
        resume_id: selectedResumeId || undefined,
      });
      showToast('Application submitted successfully! 🎉', 'success');
      setTimeout(() => navigate('/student/applications'), 1400);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You've already applied to this job.");
      } else {
        setError(err.response?.data?.message || 'Could not submit your application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Premium Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto">
          <Link 
            to={`/student/jobs/${jobId}`} 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-slate-200/50 group-hover:bg-blue-100 transition-colors">
              <FiArrowLeft size={16} />
            </div>
            Back to Job Details
          </Link>

          {loading ? (
            /* New Premium Loading Feature */
            <div className="py-24 flex flex-col items-center justify-center space-y-6 animate-entrance">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 shadow-inner"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin drop-shadow-md"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <FiSend size={24} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Preparing Application...</h3>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading job details and your profile data securely.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Job Header Card */}
              {job && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-entrance relative overflow-hidden group hover:border-blue-200 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700 text-2xl">
                        {(job.company_name || job.company || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><FiBriefcase className="text-slate-400" /> {job.company_name || job.company}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {job.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 text-center sm:text-right flex-shrink-0">
                    <p className="text-[10px] text-emerald-600 uppercase font-extrabold tracking-widest mb-0.5">Compensation</p>
                    <p className="font-extrabold text-emerald-700 flex items-center justify-center sm:justify-end gap-1">
                      <FiDollarSign size={16} /> {job.salary_stipend}
                    </p>
                  </div>
                </div>
              )}

              {/* Main Application Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-entrance delay-100">
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Complete Your Application</h2>
                  <p className="text-sm font-medium text-slate-500">Review your verified profile info and provide final details for the recruiting team.</p>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-entrance">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Verified Profile Info */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      Full Name
                    </label>
                    <div className="px-5 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-sm font-semibold text-slate-700 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] cursor-not-allowed">
                      {profile?.name || '—'} 
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                        <FiCheckCircle size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      Verified Email
                    </label>
                    <div className="px-5 py-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-sm font-semibold text-slate-700 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] cursor-not-allowed">
                      <span className="truncate pr-2">{profile?.email || '—'}</span>
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                        <FiCheckCircle size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Resume Selection */}
                  <div className="space-y-2 relative group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FiFileText size={14} /> Resume Document <span className="text-rose-500">*</span>
                    </label>
                    {resumes.length === 0 ? (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-5 py-4 rounded-xl flex items-start gap-3">
                        <FiAlertCircle className="mt-0.5 text-amber-600 flex-shrink-0" size={18} />
                        <div>
                          <p className="font-semibold mb-1">No resume found</p>
                          <p className="font-medium text-amber-700/80">
                            You haven't uploaded a resume yet. <Link to="/student/resumes" className="font-bold underline hover:text-amber-900 transition-colors">Upload one first</Link> to apply.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <select 
                          value={selectedResumeId} 
                          onChange={(e) => setSelectedResumeId(e.target.value)} 
                          className="w-full pl-5 pr-12 py-3.5 rounded-xl bg-white border border-slate-200/80 text-sm font-semibold text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300 appearance-none cursor-pointer"
                        >
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>{r.filename} {r.is_primary ? '(Primary)' : ''}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-2 group">
                    <div className="flex justify-between items-end">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                        Cover Letter <span className="text-slate-400 normal-case font-medium tracking-normal">(Optional)</span>
                      </label>
                      <span className={`text-[10px] font-bold ${coverLetter.length > 1900 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {coverLetter.length} / 2000
                      </span>
                    </div>
                    <textarea
                      value={coverLetter} 
                      onChange={(e) => setCoverLetter(e.target.value)} 
                      rows={6} 
                      maxLength={2000}
                      placeholder="Why are you a great fit for this role? Share your motivation and highlight relevant experience..."
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300 resize-none"
                    />
                  </div>

                  {/* Portfolio Link */}
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FiLink size={14} /> Portfolio / LinkedIn <span className="text-slate-400 normal-case font-medium tracking-normal">(Optional)</span>
                    </label>
                    <input
                      value={portfolioLink} 
                      onChange={(e) => setPortfolioLink(e.target.value)} 
                      placeholder="https://linkedin.com/in/yourprofile or your personal site"
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row-reverse gap-4">
                  <button 
                    type="submit" 
                    disabled={submitting || resumes.length === 0} 
                    className="flex-1 sm:flex-none sm:w-2/3 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group/btn"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <FiSend className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="flex-1 sm:flex-none sm:w-1/3 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-[11px] font-medium text-slate-400 text-center mt-6 max-w-md mx-auto leading-relaxed">
                  By clicking <span className="font-bold text-slate-500">Submit Application</span>, you agree to share your profile data, email, and uploaded documents directly with the recruiting team at <span className="font-bold text-slate-500">{job?.company_name || job?.company}</span>.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default ApplyJob;
