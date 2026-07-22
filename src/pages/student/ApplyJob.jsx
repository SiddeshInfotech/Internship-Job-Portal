import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiMapPin, 
  FiDollarSign, 
  FiFileText, 
  FiLink, 
  FiAlertCircle,
  FiLoader,
  FiBriefcase
} from 'react-icons/fi';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

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
      navigate('/student/applications');
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You've already applied to this position.");
      } else {
        setError(err.response?.data?.message || 'Could not submit your application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Inline styles for native CSS animations without modifying tailwind.config.js */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <main className="max-w-2xl mx-auto">
        
        {/* Back Navigation */}
        <Link 
          to={`/student/jobs/${jobId}`} 
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <span className="p-1.5 rounded-full bg-slate-200/50 group-hover:bg-slate-200 transition-colors">
            <FiArrowLeft size={14} />
          </span>
          Back to Job Details
        </Link>

        {loading ? (
          /* Premium Skeleton Loader */
          <div className="animate-pulse space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
                </div>
              </div>
              <div className="h-px w-full bg-slate-100 my-6"></div>
              <div className="space-y-6">
                <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
                <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
                <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
                <div className="h-32 w-full bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-fade-up opacity-0">
            
            {/* Job Summary Header */}
            {job && (
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-sm shadow-inner shrink-0">
                      {(job.company_name || job.company || '?').charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight mb-1">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 font-medium mt-2">
                        <span className="flex items-center gap-1.5 text-white">
                          <FiBriefcase size={14} className="text-slate-400" />
                          {job.company_name || job.company}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1.5">
                          <FiMapPin size={14} className="text-slate-400" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {job.salary_stipend && (
                    <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-sm shrink-0">
                      <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold mb-0.5">Compensation</p>
                      <p className="flex items-center gap-1.5 font-bold text-white text-sm">
                       
                        {job.salary_stipend}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Submit Application</h2>
                <p className="text-sm text-slate-500 mt-1">Review your details and attach any supporting documents.</p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-8 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-3 transition-all duration-300 ease-in-out">
                  <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* Verified Profile Data Section */}
              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Legal Name</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center justify-between">
                    <span className="font-medium">{profile?.name || '—'}</span>
                    <FiCheckCircle className="text-emerald-500" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center justify-between">
                    <span className="font-medium truncate">{profile?.email || '—'}</span>
                    <FiCheckCircle className="text-emerald-500" size={16} />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 mb-8"></div>

              {/* Resume Selection */}
              <div className="mb-6">
                <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-2">
                  <span>Resume <span className="text-red-500">*</span></span>
                  <Link to="/student/resumes" className="text-indigo-600 hover:text-indigo-700 font-medium text-xs transition-colors">Manage Resumes</Link>
                </label>
                
                {resumes.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 flex gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg h-fit">
                      <FiFileText className="text-amber-600" size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 mb-1">No resume found</h4>
                      <p className="text-sm text-amber-700 mb-3">You must upload a resume before applying to this position.</p>
                      <Link to="/student/resumes" className="text-sm font-semibold bg-white px-4 py-2 rounded-lg border border-amber-200 shadow-sm text-amber-900 hover:bg-amber-50 transition-colors inline-block">
                        Upload Resume
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiFileText className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    </div>
                    <select 
                      value={selectedResumeId} 
                      onChange={(e) => setSelectedResumeId(e.target.value)} 
                      className="block w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer hover:bg-slate-50"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.filename} {r.is_primary ? ' (Primary)' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Cover Letter <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <span className={`text-xs font-medium transition-colors ${coverLetter.length > 1900 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {coverLetter.length} / 2000
                  </span>
                </div>
                <textarea
                  value={coverLetter} 
                  onChange={(e) => setCoverLetter(e.target.value)} 
                  rows={5} 
                  maxLength={2000}
                  placeholder="Introduce yourself and explain why you're a great fit for this specific role..."
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              {/* Portfolio Link */}
              <div className="mb-10 group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio / LinkedIn <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLink className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                  </div>
                  <input
                    type="url"
                    value={portfolioLink} 
                    onChange={(e) => setPortfolioLink(e.target.value)} 
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 focus:ring-4 focus:ring-slate-100 outline-none transition-all sm:w-auto w-full text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || resumes.length === 0} 
                  className="relative flex-1 py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-slate-900/10"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>

              <p className="text-xs font-medium text-slate-400 text-center mt-6">
                By submitting, you agree to share your profile data with {job?.company_name || job?.company || 'the employer'}.
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplyJob;