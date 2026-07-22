import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiBriefcase, 
  FiAlertCircle, 
  FiChevronLeft, 
  FiChevronRight,
  FiArrowRight,
  FiInbox
} from 'react-icons/fi';

const PER_PAGE = 9;

export default function BrowseJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
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
        params: { 
          search: search || undefined, 
          job_type: jobType || undefined, 
          location: location || undefined, 
          page, 
          per_page: PER_PAGE 
        },
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
    const timer = setTimeout(loadJobs, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, jobType, location, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Utility to generate consistent avatar gradients based on company name
  const getGradient = (name) => {
    const char = (name || '?').charAt(0).toUpperCase();
    const gradients = [
      'from-blue-500 to-indigo-500',
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-500',
      'from-rose-400 to-red-500',
      'from-purple-500 to-fuchsia-500'
    ];
    const index = char.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200/80 pt-10 pb-8 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Explore Opportunities</h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl">
                Discover your next career move. Browse through hand-picked internships and full-time roles from top companies.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100/80 text-slate-600 px-4 py-2 rounded-full text-sm font-medium border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {total} Active Roles
            </div>
          </div>

          {/* Premium Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col lg:flex-row gap-2 transition-all hover:shadow-md">
            
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                <FiSearch size={18} />
              </div>
              <input
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search by role, company, or keywords..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-amber-200 focus:ring-4 focus:ring-amber-50 outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="w-px bg-slate-200 hidden lg:block my-2"></div>

            {/* Job Type Select */}
            <div className="relative w-full lg:w-48 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                <FiBriefcase size={18} />
              </div>
             <div className="relative group">
  <select
    value={jobType}
    onChange={(e) => {
      setPage(1);
      setJobType(e.target.value);
    }}
    className="w-full pl-12 pr-12 py-3.5 rounded-2xl
               bg-white/80 backdrop-blur-lg
               border border-slate-200
               shadow-sm hover:shadow-lg
               hover:border-amber-300
               focus:border-amber-400
               focus:ring-4 focus:ring-amber-100
               transition-all duration-300
               text-sm font-semibold text-slate-700
               appearance-none cursor-pointer"
  >
    <option value="">🌐 All Types</option>
    <option value="Internship">🎓 Internship</option>
    <option value="Full-Time">💼 Full-Time</option>
  </select>

  {/* Left Icon */}
  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-110">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-amber-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M7 12h10M10 18h4"
      />
    </svg>
  </div>

  {/* Custom Dropdown Arrow */}
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="w-px bg-slate-200 hidden lg:block my-2"></div>

            {/* Location Input */}
            <div className="relative w-full lg:w-56 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                <FiMapPin size={18} />
              </div>
              <input
                value={location} 
                onChange={(e) => { setPage(1); setLocation(e.target.value); }}
                placeholder="City or remote..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-amber-200 focus:ring-4 focus:ring-amber-50 outline-none transition-all text-sm font-medium text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Error State */}
        {error && (
          <div className="mb-8 flex items-center gap-3 bg-red-50/50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-[280px]">
                <div className="flex gap-4 items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-100 rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-50 rounded-md w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <div className="h-7 bg-slate-50 rounded-full w-24 animate-pulse"></div>
                  <div className="h-7 bg-slate-50 rounded-full w-20 animate-pulse"></div>
                </div>
                <div className="mt-auto flex gap-3">
                  <div className="h-11 bg-slate-50 rounded-xl w-full animate-pulse"></div>
                  <div className="h-11 bg-slate-100 rounded-xl w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {jobs.length === 0 && !error && (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                  <FiInbox size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No opportunities found</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">
                  We couldn't find any roles matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={() => { setSearch(''); setJobType(''); setLocation(''); }}
                  className="text-amber-600 font-semibold hover:text-amber-700 text-sm bg-amber-50 px-5 py-2.5 rounded-full transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-inner bg-gradient-to-br ${getGradient(job.company_name || job.company)} flex-shrink-0`}>
                      {(job.company_name || job.company || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 
                        onClick={() => navigate(`/student/jobs/${job.id}`)}
                        className="font-bold text-slate-900 text-base leading-tight truncate cursor-pointer hover:text-amber-600 transition-colors"
                        title={job.title}
                      >
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mt-1 truncate">
                        {job.company_name || job.company}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                      <FiMapPin size={12} className="text-slate-400" />
                      <span className="truncate max-w-[120px]">{job.location || 'Remote'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                      <FiClock size={12} className="text-blue-400" />
                      {job.job_type}
                    </span>
                  </div>

                  {/* Compensation */}
                  <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Compensation</p>
                    <p className="text-sm font-bold text-slate-800">
                      {job.salary_stipend || 'Competitive'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate(`/student/jobs/${job.id}`)} 
                      className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => navigate(`/student/jobs/${job.id}/apply`)} 
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-md hover:shadow-slate-900/20 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                    >
                      Apply <FiArrowRight size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-slate-200/60">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={18} />
                </button>
                
                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setPage(p)} 
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                        p === page 
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}