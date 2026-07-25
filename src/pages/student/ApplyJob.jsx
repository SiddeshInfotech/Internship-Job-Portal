import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { useToast } from '../../context/ToastContext';
import { asArray } from '../../api/asArray';
import { FiArrowLeft, FiFileText, FiCheckCircle } from 'react-icons/fi';

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
    <main className="max-w-3xl mx-auto px-6 py-6">
      <Link to={`/student/jobs/${jobId}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F172A] mb-4"><FiArrowLeft size={14} /> Back to Job Details</Link>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading application form...</div>
      ) : (
      <>
      {job && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center font-bold text-[#0F172A]">{(job.company_name || job.company || '?').charAt(0)}</div>
            <div>
              <p className="font-bold text-[#0F172A]">{job.title}</p>
              <p className="text-sm text-slate-500">{job.company_name || job.company} · {job.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-bold">Stipend</p>
            <p className="font-bold text-[#F59E0B]">{job.salary_stipend}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-[#0F172A] mb-1">Complete Your Application</h2>
        <p className="text-sm text-slate-500 mb-6">Review your profile info and provide final details.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center justify-between">
              {profile?.name || '—'} <FiCheckCircle className="text-green-500" size={14} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">College Email</label>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center justify-between">
              {profile?.email || '—'} <FiCheckCircle className="text-green-500" size={14} />
            </div>
          </div>
        </div>

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resume</label>
        {resumes.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-5">
            You haven't uploaded a resume yet. <Link to="/student/resumes" className="font-semibold underline">Upload one first</Link> — companies need it to review your application.
          </div>
        ) : (
          <select value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-5 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]">
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.filename}{r.is_primary ? ' (Primary)' : ''}</option>
            ))}
          </select>
        )}

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Letter (Optional)</label>
        <textarea
          value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={6} maxLength={2000}
          placeholder="Tell the hiring team why you're a great fit for this role..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-1 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm resize-none"
        />
        <p className="text-xs text-slate-400 text-right mb-5">{coverLetter.length} / 2000 characters</p>

        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Portfolio or LinkedIn URL</label>
        <input
          value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://linkedin.com/in/yourname"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-6 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
        />

        <div className="flex gap-3">
          <button type="submit" disabled={submitting || resumes.length === 0} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-white font-bold text-sm disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Application →'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">Cancel</button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-4">
          By clicking "Submit Application", you agree to share your profile data and uploaded documents with the recruiting team at {job?.company_name || job?.company}.
        </p>
      </form>
      </>
      )}
    </main>
  );
}

export default ApplyJob;
