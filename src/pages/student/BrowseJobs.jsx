import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import { FiSearch, FiMapPin, FiClock, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { fmtMoney } from '../../utils/fields';
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-entrance">
          <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Results Count Header */}
      <div className="flex items-center justify-between mb-6 animate-entrance stagger-3">
        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
          Showing <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">{total}</span> opportunities
        </p>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-5 animate-entrance stagger-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Curating opportunities...</p>
        </div>
      ) : (
        <div className="animate-entrance stagger-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Empty State */}
            {jobs.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 ring-8 ring-slate-50/50">
                  <FiSearch className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed">
                  We couldn't find any opportunities matching your current filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={() => { setSearch(''); setJobType(''); setLocation(''); setPage(1); }}
                  className="mt-8 px-6 py-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Job Cards */}
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="group relative bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] hover:border-blue-400 transition-all duration-500 ease-out flex flex-col h-full hover:-translate-y-1.5 overflow-hidden z-10"
              >
                {/* Top Glow Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-md group-hover:border-blue-100 transition-all duration-300">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-700 text-xl">
                      {(job.company_name || job.company || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 
                      className="font-extrabold text-slate-900 text-lg leading-tight cursor-pointer group-hover:text-blue-600 transition-colors line-clamp-1" 
                      onClick={() => navigate(`/student/jobs/${job.id}`)}
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1.5 line-clamp-1" title={job.company_name || job.company}>
                      {job.company_name || job.company}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-600 group-hover:bg-blue-50/50 transition-colors">
                    <FiMapPin size={14} className="text-slate-400" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-600 group-hover:bg-blue-50/50 transition-colors">
                    <FiClock size={14} className="text-slate-400" />
                    {job.job_type || 'Full-Time'}
                  </span>
                </div>

                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    {job.salary_stipend ? fmtMoney(job.salary_stipend) : 'Unspecified Pay'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => navigate(`/student/jobs/${job.id}`)} 
                    className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold transition-all duration-300 shadow-sm"
                  >
                    Details
                  </button>
                  {profilePct < 90 ? (
                    <button 
                      onClick={() => {
                        showToast('Complete your profile to apply for Jobs (at least 90% required).', 'warning');
                        navigate('/student/settings');
                      }} 
                      className="flex-1 py-3 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all duration-300 flex items-center justify-center text-center leading-tight"
                    >
                      Complete Profile to Apply
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/student/jobs/${job.id}/apply`)} 
                      className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold shadow-md hover:shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-1.5 group/btn"
                    >
                      Apply 
                      <FiChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16 mb-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p} 
                  onClick={() => setPage(p)} 
                  className={`w-11 h-11 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center ${
                    p === page 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-sm'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default BrowseJobs;