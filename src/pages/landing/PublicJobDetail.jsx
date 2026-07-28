import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import publicAxios from '../../api/publicAxios';
import { FiArrowLeft, FiMapPin, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { fmtJobDate } from '../../utils/fields';
import JobBody from '../../components/JobSections';
import { fmtMoney } from '../../utils/fields';

function PublicJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isStudentLoggedIn = !!sessionStorage.getItem('student_token');

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await publicAxios.get(`/jobs/${id}`);
        setJob(res.data.job || res.data);
      } catch (err) {
        setError(err.response?.status === 404
          ? "This job couldn't be found — it may have closed or been removed."
          : 'Could not load this job right now.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApplyClick = () => {
    navigate(isStudentLoggedIn ? `/student/jobs/${id}/apply` : '/student/login');
  };

  return (
    <>
      <Helmet><title>{job ? `${job.title} — Placify` : 'Job Details — Placify'}</title></Helmet>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <Link to="/find-jobs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F172A] mb-6"><FiArrowLeft size={14} /> Back to Jobs</Link>

        {error && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">{error}</div>
        )}
        {loading && (
          <div className="lp-tile p-8" aria-label="Loading job">
            <div className="flex items-center gap-4 mb-6">
              <div className="pf-skeleton" style={{ width: 64, height: 64, borderRadius: 16 }} />
              <div style={{ flex: 1 }}>
                <div className="pf-skeleton" style={{ width: '45%', height: 20, marginBottom: 9 }} />
                <div className="pf-skeleton" style={{ width: '30%', height: 13 }} />
              </div>
            </div>
            <div className="pf-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
            <div className="pf-skeleton" style={{ width: '92%', height: 14, marginBottom: 8 }} />
            <div className="pf-skeleton" style={{ width: '75%', height: 14 }} />
          </div>
        )}

        {!loading && job && (
          <>
            <div className="relative overflow-hidden rounded-2xl p-8 text-white mb-6 lp-sky shadow-lift">
              <div className="absolute top-0 inset-x-0 h-[2.5px]" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)' }} />
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-2xl flex-shrink-0" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                    {(job.company_name || '?').charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{job.title}</h1>
                    <p className="text-white/70">{job.company_name}{job.location ? ` · ${job.location}` : ''}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.job_type && <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">{job.job_type}</span>}
                      {job.salary_stipend && <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">{fmtMoney(job.salary_stipend)}</span>}
                      {job.last_date_to_apply && <span className="px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold">Apply by {fmtJobDate(job.last_date_to_apply)}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={handleApplyClick} className="px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold whitespace-nowrap shadow-lift hover:brightness-110 active:scale-95 transition-all">
                  {isStudentLoggedIn ? 'Apply now' : 'Log in to apply'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 lp-tile p-8">
                <JobBody job={job} />
              </div>

              <div className="lp-tile p-6 h-fit">
                <h4 className="font-bold text-[#0F172A] mb-4">Job Summary</h4>
                <div className="space-y-4">
                  {job.location && <SummaryRow icon={<FiMapPin />} label="Location" value={job.location} />}
                  {job.job_type && <SummaryRow icon={<FiBriefcase />} label="Job Type" value={job.job_type} />}
                  {job.last_date_to_apply && <SummaryRow icon={<FiCalendar />} label="Deadline" value={fmtJobDate(job.last_date_to_apply)} />}
                </div>
                <button onClick={handleApplyClick} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-b from-[#f6a41c] to-[#d97706] text-white font-bold hover:brightness-110 active:scale-95 transition-all">
                  {isStudentLoggedIn ? 'Apply Now' : 'Login to Apply'}
                </button>
                {!isStudentLoggedIn && (
                  <p className="text-xs text-slate-400 text-center mt-3">
                    New here? <Link to="/student/register" className="text-[#F59E0B] font-semibold">Create a student account</Link>
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

function SummaryRow({ icon, label, value }) {
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

export default PublicJobDetail;
