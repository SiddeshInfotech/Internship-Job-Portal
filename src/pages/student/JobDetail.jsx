import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await studentAxios.get(`/student/jobs/${id}`);
        setJob(res.data.job || res.data);
      } catch (err) {
        setError(err.response?.status === 404
          ? 'This job could not be found — it may no longer be accepting applications.'
          : 'Could not load this job. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-6">
      <Link to="/student/browse-jobs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F172A] mb-4"><FiArrowLeft size={14} /> Back to Jobs</Link>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
      {loading && <div className="py-20 text-center text-slate-400">Loading job...</div>}

      {!loading && job && (
        <>
        <div className="bg-[#0F172A] rounded-2xl p-8 text-white mb-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center font-bold text-2xl flex-shrink-0">
                {(job.company_name || job.company || '?').charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold mb-1">{job.title}</h1>
                <p className="text-white/70">{job.company_name || job.company} · {job.location}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">{job.job_type}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">{job.salary_stipend}</span>
                  {job.last_date_to_apply && <span className="px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold">Ends: {job.last_date_to_apply}</span>}
                </div>
              </div>
            </div>
            <button onClick={() => navigate(`/student/jobs/${id}/apply`)} className="px-8 py-3 rounded-xl bg-[#F59E0B] text-white font-bold whitespace-nowrap">Apply Now</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="font-bold text-[#0F172A] mb-3 border-l-4 border-[#F59E0B] pl-3">The Opportunity</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">{job.description}</p>

            {job.eligibility_criteria && (
              <>
                <h3 className="font-bold text-[#0F172A] mb-3 border-l-4 border-[#F59E0B] pl-3">Eligibility</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{job.eligibility_criteria}</p>
              </>
            )}

            {job.required_skills && (
              <>
                <h3 className="font-bold text-[#0F172A] mb-3 border-l-4 border-[#F59E0B] pl-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(job.required_skills) ? job.required_skills : job.required_skills.split(',')).map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700">{s.trim()}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
            <h4 className="font-bold text-[#0F172A] mb-4">Application Summary</h4>
            <div className="space-y-4">
              <SummaryRow icon={<FiCalendar />} label="Deadline" value={job.last_date_to_apply} />
              <SummaryRow icon={<FiClock />} label="Job Type" value={job.job_type} />
            </div>
            <button onClick={() => navigate(`/student/jobs/${id}/apply`)} className="w-full mt-6 py-3 rounded-xl bg-[#F59E0B] text-white font-bold">Apply Now</button>
          </div>
        </div>
        </>
      )}
    </main>
  );
}

function SummaryRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

export default JobDetail;
