import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import StatusPill from '../../components/StatusPill';
import ProfileCompletionBanner from '../../components/ProfileCompletionBanner';
import { 
  FiBriefcase, 
  FiUsers, 
  FiCheckCircle, 
  FiAward, 
  FiPlus, 
  FiChevronRight,
  FiInbox,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';

function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePct, setProfilePct] = useState(100); // assume complete until known

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentRes, activeRes] = await Promise.all([
          clientAxios.get('/client/dashboard/stats'),
          clientAxios.get('/client/dashboard/recent-applications'),
          clientAxios.get('/client/dashboard/active-jobs'),
        ]);
        if (cancelled) return;
        setStats(statsRes.data.stats || statsRes.data);
        setApplications(asArray(recentRes.data.applications, recentRes.data));
        setActiveJobs(asArray(activeRes.data.jobs, activeRes.data));

        // Profile completeness for the reminder banner
        try {
          const profRes = await clientAxios.get('/client/profile');
          const p = profRes.data.profile || profRes.data;
          if (typeof p.profile_completion === 'number') {
            if (!cancelled) setProfilePct(p.profile_completion);
          } else {
            const fields = ['company_name', 'industry', 'contact', 'address', 'company_size', 'year_established',
              'city', 'pincode', 'state', 'hr_name', 'hr_contact_email', 'about_company', 'company_summary',
              'hiring_locations', 'preferred_job_types', 'company_registration_number', 'terms_accepted'];
            const done = fields.filter((f) => {
              const v = p[f];
              return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '';
            }).length;
            if (!cancelled) setProfilePct(Math.round((done / fields.length) * 100));
          }
        } catch { /* banner simply won't show */ }
      } catch (err) {
        if (!cancelled) setError('Could not load dashboard data. ' + (err.response?.data?.message || err.message));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const isClosingSoon = (job) => {
    if (!job.last_date_to_apply) return false;
    const days = (new Date(job.last_date_to_apply) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  };

  let clientName = 'Company';
  try {
    const stored = sessionStorage.getItem('client_info');
    if (stored) clientName = JSON.parse(stored).company_name || 'Company';
  } catch { /* ignore */ }

  return (
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50/50 pt-4 pb-16 font-sans">
        <ClientTopNavbar title="Dashboard" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-slide-up">
              <FiAlertCircle className="flex-shrink-0" size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Profile Completion Banner (Wrapper ensures proper spacing if it renders) */}
          <div className="mb-6 animate-slide-up">
            <ProfileCompletionBanner percent={profilePct} to="/company-profile" />
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-slide-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {clientName}
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium">
                Here is what's happening with your recruitment funnel today.
              </p>
            </div>
            <button 
              onClick={() => navigate('/jobs/new')} 
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] transition-all duration-300 active:scale-95"
            >
              <FiPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Post a new job
            </button>
          </div>

          {loading ? (
            /* Modern Loading Skeleton */
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-32 flex flex-col justify-between">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-6 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-80">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-6" />
                    <div className="space-y-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                            <div className="h-3 bg-slate-100 rounded w-1/3" />
                          </div>
                          <div className="w-16 h-6 bg-slate-200 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Metrics Row */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-slide-up delay-100">
                <MetricCard 
                  icon={<FiBriefcase size={22} />} 
                  label="Active Job Posts" 
                  value={stats?.active_job_posts} 
                  color="indigo" 
                />
                <MetricCard 
                  icon={<FiUsers size={22} />} 
                  label="Total Applicants" 
                  value={stats?.total_applicants} 
                  color="blue" 
                />
                <MetricCard 
                  icon={<FiCheckCircle size={22} />} 
                  label="Shortlisted" 
                  value={stats?.shortlisted} 
                  color="emerald" 
                />
                <MetricCard 
                  icon={<FiAward size={22} />} 
                  label="Offers Made" 
                  value={stats?.offers_made} 
                  color="violet" 
                />
              </section>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Recent Applications Panel */}
                <div className="bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up delay-200 flex flex-col h-full">
                  <div className="p-5 sm:p-6 pb-4 flex justify-between items-center border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                    <button 
                      onClick={() => navigate('/applicants')} 
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      View all <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="flex-1 p-2">
                    {applications.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 m-2">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-3">
                          <FiInbox size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-600">No recent applications yet.</p>
                        <p className="text-xs text-slate-400 mt-1">New candidates will show up here.</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {applications.map((app, idx) => (
                          <div 
                            key={app.id || idx} 
                            onClick={() => navigate(`/applicants/${app.id}`)}
                            className="group flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
                                {(app.student_name || app.name || '?').charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                  {app.student_name || app.name}
                                </p>
                                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                                  {app.job_title || app.role}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                              <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase mb-1">
                                  {app.applied_date || app.time_ago}
                                </span>
                                <StatusPill status={app.status} />
                              </div>
                              {/* Mobile Status Only */}
                              <div className="sm:hidden scale-90 origin-right">
                                <StatusPill status={app.status} />
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                <FiChevronRight size={16} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Jobs Panel */}
                <div className="bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up delay-300 flex flex-col h-full">
                  <div className="p-5 sm:p-6 pb-4 flex justify-between items-center border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Active Jobs</h3>
                    <button 
                      onClick={() => navigate('/jobs')} 
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      Manage <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="flex-1 p-2 flex flex-col">
                    {activeJobs.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 m-2">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-3">
                          <FiBriefcase size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-600">No active jobs right now.</p>
                        <p className="text-xs text-slate-400 mt-1">Post one to start hiring.</p>
                      </div>
                    ) : (
                      <div className="space-y-1 flex-1">
                        {activeJobs.map((job, idx) => (
                          <div 
                            key={job.id || idx} 
                            onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                            className="group p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 pr-4">
                                {job.title}
                              </p>
                              <div className="flex-shrink-0">
                                {isClosingSoon(job) ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold tracking-wide uppercase ring-1 ring-inset ring-amber-500/20">
                                    Closing Soon
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wide uppercase ring-1 ring-inset ring-emerald-500/20">
                                    Active
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                <FiUsers size={12} className="text-slate-400" />
                                {job.applicants_count ?? job.applications_count ?? 0} Applicants
                              </p>
                              <FiChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors translate-x-0 group-hover:translate-x-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tip Box */}
                    <div className="mt-4 m-2 bg-blue-50/50 rounded-2xl p-4 flex items-start gap-3 border border-blue-100/50">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiInfo size={16} />
                      </div>
                      <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
                        <strong className="font-bold text-blue-700">Recruitment tip:</strong> Jobs with detailed eligibility criteria and clear salary ranges get <span className="text-blue-600 font-bold bg-blue-100/50 px-1 rounded">40% more</span> qualified applicants.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

// Sub-component for the top metrics cards
function MetricCard({ icon, label, value, color }) {
  // Map colors for the dynamic icon background based on the 'color' prop
  const colorMap = {
    indigo: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    violet: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
  };

  const iconClasses = colorMap[color] || colorMap.indigo;

  return (
    <div className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 mb-4 ${iconClasses}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value ?? '—'}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

export default ClientDashboard;