import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiChevronDown, 
  FiAlertCircle, 
  FiMapPin, 
  FiCalendar, 
  FiCheck, 
  FiX, 
  FiBriefcase,
  FiExternalLink
} from 'react-icons/fi';

// Per request: only 3 stages shown in the journey tracker (Interview and
// Offer removed). A Rejected application is shown with a red badge instead
// of a truncated journey.
const STAGES = ['Applied', 'In Review', 'Shortlisted'];

// Premium Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center animate-pulse shadow-sm">
    <div className="h-8 bg-gray-200 rounded-lg w-16 mb-3"></div>
    <div className="h-4 bg-gray-100 rounded-md w-24"></div>
  </div>
);

const AppCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between animate-pulse shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0"></div>
      <div className="space-y-2.5">
        <div className="h-5 bg-gray-200 rounded-md w-48"></div>
        <div className="h-4 bg-gray-100 rounded-md w-64"></div>
      </div>
    </div>
    <div className="hidden sm:flex gap-3 items-center">
      <div className="h-7 w-24 bg-gray-100 rounded-full"></div>
      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

function AppliedStatus() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [appsRes, statsRes] = await Promise.all([
          studentAxios.get('/student/applications'),
          studentAxios.get('/student/applications/stats'),
        ]);
        const list = asArray(appsRes.data.applications, appsRes.data.results, appsRes.data);
        setApplications(list);
        setStats(statsRes.data.stats || statsRes.data);
      } catch (err) {
        setError('Could not load your applications. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stageIndex = (status) => {
    const idx = STAGES.indexOf(status);
    // Interview/Offered map to "past Shortlisted" (all 3 stages complete)
    if (status === 'Interview' || status === 'Offered') return STAGES.length - 1;
    return idx;
  };

  return (
    <div className="student-scope min-h-screen bg-[#FAFAFA] pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">
      <StudentSubTabs />
      
      {/* Decorative Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Application Tracker</h1>
          <p className="text-base text-gray-500 max-w-2xl">Manage and track your active internship applications and their progress seamlessly.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-5 py-4 rounded-xl mb-8 flex items-start gap-3 shadow-sm animate-in fade-in zoom-in-95">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5 mb-10">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats ? (
            <>
              <StatCard label="Total Applied" value={stats.total_applied} type="default" />
              <StatCard label="Active Progress" value={stats.active_progress} type="warning" />
              <StatCard label="Offers Received" value={stats.offers_received} type="success" />
              <StatCard label="Rejected" value={stats.rejected} type="danger" />
            </>
          ) : null}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            {!loading && applications.length > 0 && (
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {applications.length} {applications.length === 1 ? 'Role' : 'Roles'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-gray-100 border-dashed animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-sm">
                <FiBriefcase className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                You haven't applied to any roles yet. Discover open positions and kickstart your career.
              </p>
              <button 
                onClick={() => navigate('/student/browse-jobs')} 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all text-sm active:scale-95"
              >
                Browse open roles
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => {
                const isOpen = expandedId === app.id;
                const isRejected = app.status === 'Rejected';
                const currentStage = stageIndex(app.status);

                return (
                  <div 
                    key={app.id} 
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 ${
                      isOpen ? 'border-blue-400 shadow-md ring-1 ring-blue-50' : 'border-gray-200 shadow-sm hover:shadow hover:border-gray-300'
                    }`}
                    style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
                  >
                    {/* Card Header (Clickable) */}
                    <div 
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none group" 
                      onClick={() => setExpandedId(isOpen ? null : app.id)}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                          isRejected 
                            ? 'bg-gray-50 text-gray-400 border border-gray-100' 
                            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 border border-blue-100'
                        }`}>
                          {(app.company_name || app.company || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                            {app.job_title || app.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                            <span className="font-medium text-gray-700 truncate max-w-[150px]">{app.company_name || app.company}</span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="flex items-center gap-1"><FiMapPin size={12} className="text-gray-400"/> {app.location || 'Remote'}</span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="flex items-center gap-1"><FiCalendar size={12} className="text-gray-400"/> Applied {app.applied_date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 sm:mt-0 sm:ml-4 gap-4">
                        <StatusBadge status={app.status} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                          <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content (Timeline) */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="p-5 md:px-8 border-t border-gray-100 bg-gray-50/50">
                          
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-bold text-gray-900">Application Journey</h4>
                            {!isRejected && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 shadow-sm">
                                Stage <span className="text-blue-600">{Math.max(currentStage + 1, 1)}</span> of {STAGES.length}
                              </span>
                            )}
                          </div>

                          {isRejected ? (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                              <div className="p-1 bg-white rounded-full shadow-sm mt-0.5">
                                <FiX className="text-red-500" size={14} />
                              </div>
                              <div>
                                <p className="text-sm text-red-700 font-bold">Application Not Selected</p>
                                <p className="text-sm text-red-600/90 mt-1 leading-relaxed">
                                  Unfortunately, the employer has decided not to move forward with your application at this time. Don't be discouraged, keep applying!
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative pt-2 pb-6 px-4 md:px-10">
                              {/* Background Line */}
                              <div className="absolute top-6 left-10 right-10 h-[2px] bg-gray-200 rounded-full z-0 hidden sm:block"></div>
                              
                              {/* Active Line */}
                              <div 
                                className="absolute top-6 left-10 h-[2px] bg-blue-600 rounded-full z-0 transition-all duration-700 hidden sm:block" 
                                style={{ width: `${(Math.max(0, currentStage) / (STAGES.length - 1)) * 100}%` }}
                              ></div>

                              <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                                {STAGES.map((stage, i) => {
                                  const isCompleted = i < currentStage;
                                  const isCurrent = i === currentStage;
                                  const isPending = i > currentStage;

                                  return (
                                    <div key={stage} className="flex sm:flex-col items-center sm:w-24 gap-3 sm:gap-2 relative">
                                      
                                      {/* Mobile Vertical Line Connecting Dots */}
                                      {i < STAGES.length - 1 && (
                                        <div className={`absolute top-8 left-[15px] w-[2px] h-full -z-10 sm:hidden ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                      )}

                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shrink-0 shadow-sm ${
                                        isCompleted 
                                          ? 'bg-blue-600 border-blue-600 text-white' 
                                          : isCurrent 
                                            ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' 
                                            : 'bg-white border-gray-200 text-gray-300'
                                      }`}>
                                        {isCompleted ? <FiCheck size={14} /> : (i + 1)}
                                      </div>
                                      
                                      <div className="sm:text-center">
                                        <span className={`text-[13px] font-bold ${
                                          isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                          {stage}
                                        </span>
                                        {isCurrent && (
                                          <p className="text-[11px] text-blue-600 font-semibold mt-0.5 sm:hidden">Current Stage</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex justify-end">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/jobs/${app.job_id}`);
                              }} 
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm active:scale-95"
                            >
                              View job details <FiExternalLink size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Premium Stat Card Component
function StatCard({ label, value, type }) {
  const styles = {
    default: { text: 'text-gray-900', bg: 'bg-white', border: 'border-gray-200', highlight: 'bg-gray-100 text-gray-600' },
    warning: { text: 'text-amber-600', bg: 'bg-amber-50/30', border: 'border-amber-100', highlight: 'bg-amber-100 text-amber-700' },
    success: { text: 'text-emerald-600', bg: 'bg-emerald-50/30', border: 'border-emerald-100', highlight: 'bg-emerald-100 text-emerald-700' },
    danger:  { text: 'text-red-600', bg: 'bg-red-50/30', border: 'border-red-100', highlight: 'bg-red-100 text-red-700' },
  };
  
  const current = styles[type] || styles.default;

  return (
    <div className={`rounded-2xl border ${current.border} ${current.bg} p-5 flex flex-col justify-center transition-transform hover:-translate-y-1 hover:shadow-md duration-300`}>
      <h3 className={`text-3xl font-extrabold tracking-tight ${current.text}`}>
        {value ?? '—'}
      </h3>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1.5 flex items-center gap-2">
        {label}
      </p>
    </div>
  );
}

// Premium Status Badge Component
function StatusBadge({ status }) {
  const map = {
    'Applied':     { bg: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    'In Review':   { bg: 'bg-blue-50 text-blue-700 border-indigo-200/60' },
    'Shortlisted': { bg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    'Interview':   { bg: 'bg-amber-50 text-amber-700 border-amber-200/60' },
    'Offered':     { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    'Rejected':    { bg: 'bg-red-50 text-red-700 border-red-200/60' },
  };
  
  const current = map[status] || { bg: 'bg-gray-50 text-gray-600 border-gray-200' };
  
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${current.bg}`}>
      {status}
    </span>
  );
}

export default AppliedStatus;