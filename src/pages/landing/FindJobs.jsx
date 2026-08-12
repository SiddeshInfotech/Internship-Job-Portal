import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiMapPin, FiBriefcase } from 'react-icons/fi';
import publicAxios from '../../api/publicAxios';
import { asArray } from '../../api/asArray';
import JobCard from '../../components/landing/JobCard';
import { fmtMoney } from '../../utils/fields';

import { getStudentToken } from '../../utils/authStorage';

const PER_PAGE = 9;

function FindJobs() {
  const navigate = useNavigate();
  const isStudentLoggedIn = !!getStudentToken();

  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicAxios.get('/jobs', {
        params: { search: search || undefined, job_type: jobType || undefined, location: location || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      let list = asArray(data.jobs, data.results, data);
      if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      setJobs(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load jobs right now. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadJobs, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, jobType, location, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <Helmet><title>Find Jobs — Placify</title></Helmet>

      <section className="pt-36 pb-16 lp-sky relative overflow-hidden">
        <div className="absolute inset-0 lp-dotgrid" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#F59E0B] tracking-[0.25em] uppercase mb-4">Live openings</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
            Find your next <span className="font-serif-accent font-normal text-[#F59E0B]">opportunity.</span>
          </h1>
          <p className="text-slate-300/90">Search verified internships and full-time roles, updated by our partner companies.</p>
        </div>
      </section>

      {/* Search deck stitched across the fold */}
      <section className="max-w-6xl mx-auto px-6 -mt-9 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lift border border-slate-100 p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search job title or company..."
              aria-label="Search jobs"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm transition-shadow"
            />
          </div>
          <select value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }} aria-label="Job type" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-semibold text-slate-600 cursor-pointer">
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
            placeholder="Location"
            aria-label="Location"
            className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full md:w-44 transition-shadow"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort jobs" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] bg-white font-semibold text-slate-600 cursor-pointer">
            <option value="recent">Sort: Most Recent</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
          <div className="flex gap-1 bg-[#F8FAFC] rounded-xl p-1 border border-slate-100">
            <button onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'} className={`px-3 py-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-soft text-[#0F172A]' : 'text-slate-400 hover:text-slate-600'}`}><FiGrid /></button>
            <button onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'} className={`px-3 py-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-soft text-[#0F172A]' : 'text-slate-400 hover:text-slate-600'}`}><FiList /></button>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#F8FAFC] mt-[-1px]">
        <div className="max-w-6xl mx-auto px-6">
          {error && <div className="pf-alert-error" role="alert">⚠ {error}</div>}
          <p className="text-sm font-semibold text-slate-500 mb-6" aria-live="polite">
            {loading ? 'Searching...' : <>{total} {total === 1 ? 'job' : 'jobs'} found</>}
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading jobs">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6">
                  <div className="pf-skeleton" style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 16 }} />
                  <div className="pf-skeleton" style={{ width: '65%', height: 15, marginBottom: 9 }} />
                  <div className="pf-skeleton" style={{ width: '40%', height: 12, marginBottom: 18 }} />
                  <div className="pf-skeleton" style={{ width: '100%', height: 38, borderRadius: 12 }} />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
              <p className="text-slate-500 font-semibold mb-1">No jobs match these filters.</p>
              <p className="text-sm text-slate-400 mb-5">Try a broader search term or clear the location.</p>
              <button
                onClick={() => { setSearch(''); setJobType(''); setLocation(''); setPage(1); }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="lp-tile p-5 flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EEF4FF] to-[#F8FAFC] border border-[#cdddfb] flex items-center justify-center font-bold text-[#1D4ED8]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                      {(job.company_name || '?').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F172A] cursor-pointer hover:text-[#1D4ED8] transition-colors" onClick={() => navigate(`/jobs/${job.id}`)}>{job.title}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                        {job.location && <span className="flex items-center gap-1"><FiMapPin size={12} />{job.location}</span>}
                        {job.job_type && <span className="flex items-center gap-1"><FiBriefcase size={12} />{job.job_type}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {job.salary_stipend && (
                      <span className="font-extrabold text-[#0F172A] text-sm tabular-nums" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{fmtMoney(job.salary_stipend)}</span>
                    )}
                    <button
                      onClick={() => navigate(isStudentLoggedIn ? `/student/jobs/${job.id}/apply` : '/student/login')}
                      className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] active:scale-95 transition-all"
                    >
                      {isStudentLoggedIn ? 'Apply' : 'Log in to apply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p} onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-[#0F172A] text-white shadow-lift' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2563EB] hover:text-[#2563EB]'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default FindJobs;
