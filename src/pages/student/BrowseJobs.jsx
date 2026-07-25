import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import { FiSearch, FiMapPin, FiClock } from 'react-icons/fi';
import ProfileCompletionBanner from '../../components/ProfileCompletionBanner';

const PER_PAGE = 9;

function BrowseJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [profilePct, setProfilePct] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentAxios.get('/student/jobs', {
        params: { search: search || undefined, job_type: jobType || undefined, location: location || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.jobs, data.results, data);
      setJobs(list);
      setTotal(data.total ?? list.length);
    } catch (err) {
      setError('Could not load jobs. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAxios.get('/student/profile');
        const p = res.data.profile || res.data;
        if (typeof p.profile_completion === 'number') {
          setProfilePct(p.profile_completion);
        } else {
          const fields = ['name', 'department', 'college', 'current_year', 'mobile_no', 'city', 'pincode', 'state',
            'linkedin_url', 'profile_summary', 'enrollment_no', 'college_address', 'course'];
          let done = fields.filter((f) => p[f] !== undefined && p[f] !== null && String(p[f]).trim() !== '').length;
          if (p.gpa_cgpa || p.gpa || p.cgpa) done += 1;
          if ((p.skills?.length || 0) > 0) done += 1;
          if ((p.certifications?.length || 0) > 0) done += 1;
          setProfilePct(Math.round((done / (fields.length + 3)) * 100));
        }
      } catch { /* banner simply won't show */ }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadJobs, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, jobType, location, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <ProfileCompletionBanner percent={profilePct} to="/student/profile-overview" />
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by role, company, or keywords..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
          />
        </div>
        <select value={jobType} onChange={(e) => { setPage(1); setJobType(e.target.value); }} className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm">
          <option value="">All Types</option>
          <option value="Internship">Internship</option>
          <option value="Full-Time">Full-Time</option>
        </select>
        <input
          value={location} onChange={(e) => { setPage(1); setLocation(e.target.value); }}
          placeholder="Location"
          className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm w-full sm:w-48"
        />
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

      <p className="text-sm text-slate-500 mb-4">
        Showing <b className="text-[#0F172A]">{total}</b> opportunities
      </p>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading jobs...</div>
      ) : (
      <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">No jobs match your search.</div>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lift transition-shadow flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[#0F172A] flex-shrink-0">
                {(job.company_name || job.company || '?').charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] leading-tight cursor-pointer hover:text-[#F59E0B]" onClick={() => navigate(`/student/jobs/${job.id}`)}>{job.title}</h3>
                <p className="text-sm text-slate-500">{job.company_name || job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><FiMapPin size={12} />{job.location}</span>
              <span className="flex items-center gap-1"><FiClock size={12} />{job.job_type}</span>
            </div>
            <p className="text-sm font-bold text-[#F59E0B] mb-4">{job.salary_stipend}</p>
            <div className="mt-auto flex gap-2">
              <button onClick={() => navigate(`/student/jobs/${job.id}`)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold">View Details</button>
              <button onClick={() => navigate(`/student/jobs/${job.id}/apply`)} className="flex-1 py-2 rounded-xl bg-[#0F172A] text-white text-sm font-semibold">Quick Apply</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === page ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{p}</button>
          ))}
        </div>
      )}
      </>
      )}
    </main>
  );
}

export default BrowseJobs;
