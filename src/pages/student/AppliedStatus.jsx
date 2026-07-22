import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiBriefcase, 
  FiTrendingUp, 
  FiAward, 
  FiXCircle,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

const STAGES = ['Applied', 'In Review', 'Shortlisted'];

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
    if (status === 'Interview' || status === 'Offered') return STAGES.length - 1;
    return idx;
  };

  const getGradient = (name) => {
    const char = (name || '?').charAt(0).toUpperCase();
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-600',
      'from-rose-400 to-red-600',
      'from-purple-500 to-fuchsia-600'
    ];
    return gradients[char.charCodeAt(0) % gradients.length];
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <StudentSubTabs />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Application Tracker</h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Monitor the status of your active applications, track journey milestones, and manage your career progress all in one place.
          </p>
        </div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 shadow-sm backdrop-blur-sm flex items-center gap-3">
            <FiXCircle size={20} className="text-red-500" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Premium Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <StatCard 
              label="Total Applied" 
              value={stats.total_applied} 
              icon={<FiBriefcase />} 
              theme="blue" 
            />
            <StatCard 
              label="In Progress" 
              value={stats.active_progress} 
              icon={<FiTrendingUp />} 
              theme="amber" 
            />
            <StatCard 
              label="Offers Received" 
              value={stats.offers_received} 
              icon={<FiAward />} 
              theme="emerald" 
            />
            <StatCard 
              label="Not Moved Forward" 
              value={stats.rejected} 
              icon={<FiXCircle />} 
              theme="rose" 
            />
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {applications.length === 0 && (
                <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                    <FiBriefcase size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No applications yet</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                    You haven't applied to any roles yet. Discover open positions and start your journey.
                  </p>
                  <button 
                    onClick={() => navigate('/student/browse-jobs')} 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    Browse Open Roles <FiArrowRight />
                  </button>
                </div>
              )}

              {applications.map((app) => {
                const isOpen = expandedId === app.id;
                const isRejected = app.status === 'Rejected';
                const currentStage = stageIndex(app.status);
                
                return (
                  <div 
                    key={app.id} 
                    className={`group bg-white rounded-2xl transition-all duration-300 border-2 ${
                      isOpen 
                        ? 'border-slate-900 shadow-lg shadow-slate-200/50 ring-4 ring-slate-900/5' 
                        : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Accordion Header */}
                    <div 
                      className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4" 
                      onClick={() => setExpandedId(isOpen ? null : app.id)}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-inner bg-gradient-to-br ${getGradient(app.company_name || app.company)} flex-shrink-0`}>
                          {(app.company_name || app.company || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                            {app.job_title || app.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5"><FiBriefcase className="text-slate-400" /> {app.company_name || app.company}</span>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {app.location}</span>
                            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1.5"><FiCalendar className="text-slate-400" /> {app.applied_date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-5 ml-19 md:ml-0">
                        <StatusBadge status={app.status} />
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'}`}>
                          {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Accordion Body */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 pt-0 mt-2 border-t border-slate-100">
                        
                        <div className="bg-slate-50 rounded-2xl p-6 mt-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-8">
                            <h4 className="text-sm font-bold text-slate-900">Application Journey</h4>
                            {!isRejected && (
                              <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
                                Stage {Math.max(currentStage + 1, 1)} of {STAGES.length}
                              </span>
                            )}
                          </div>

                          {isRejected ? (
                            <div className="flex items-center gap-3 p-4 bg-white border border-red-100 rounded-xl">
                              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <FiXCircle size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">Application Closed</p>
                                <p className="text-sm text-slate-500 mt-0.5">The team has decided not to move forward with your application at this time.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              {/* Background Line */}
                              <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 rounded-full hidden sm:block"></div>
                              
                              <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                                {STAGES.map((stage, i) => {
                                  const isCompleted = i < currentStage;
                                  const isCurrent = i === currentStage;
                                  const isPending = i > currentStage;
                                  
                                  return (
                                    <div key={stage} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 flex-1 relative">
                                      
                                      {/* Mobile connecting line */}
                                      {i < STAGES.length - 1 && (
                                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-200 sm:hidden"></div>
                                      )}
                                      
                                      {/* Node */}
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-sm transition-all z-10 ${
                                        isCompleted 
                                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                                          : isCurrent 
                                            ? 'bg-amber-500 text-white shadow-amber-500/30 ring-4 ring-amber-50' 
                                            : 'bg-white border-2 border-slate-200 text-slate-300'
                                      }`}>
                                        {isCompleted ? <FiCheckCircle size={18} /> : isCurrent ? <FiClock size={18} /> : <span className="w-2 h-2 rounded-full bg-slate-200"></span>}
                                      </div>
                                      
                                      {/* Label */}
                                      <div className="text-left sm:text-center">
                                        <p className={`text-sm font-bold ${
                                          isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                                        }`}>
                                          {stage}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                          {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                                        </p>
                                      </div>

                                      {/* Desktop Active Progress Bar Fill */}
                                      {isCompleted && i < STAGES.length - 1 && (
                                        <div className="absolute top-5 left-[50%] right-[-50%] h-1 bg-emerald-500 hidden sm:block"></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 flex justify-end">
                          <button 
                            onClick={() => navigate(`/student/jobs/${app.job_id}`)} 
                            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-5 py-2.5 rounded-full transition-colors"
                          >
                            Review Original Listing <FiArrowRight />
                          </button>
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

function StatCard({ label, value, icon, theme }) {
  const themes = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
      value: 'text-slate-900'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
      value: 'text-slate-900'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
      value: 'text-slate-900'
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      border: 'border-rose-100',
      value: 'text-slate-900'
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`rounded-3xl border p-6 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${currentTheme.border}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${currentTheme.bg} ${currentTheme.icon}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <h3 className={`text-3xl font-extrabold mb-1 ${currentTheme.value}`}>{value ?? '0'}</h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    'Applied': { bg: 'bg-slate-100', fg: 'text-slate-700', border: 'border-slate-200' }, 
    'In Review': { bg: 'bg-blue-50', fg: 'text-blue-700', border: 'border-blue-200' },
    'Shortlisted': { bg: 'bg-amber-50', fg: 'text-amber-700', border: 'border-amber-200' }, 
    'Interview': { bg: 'bg-purple-50', fg: 'text-purple-700', border: 'border-purple-200' },
    'Offered': { bg: 'bg-emerald-50', fg: 'text-emerald-700', border: 'border-emerald-200' }, 
    'Rejected': { bg: 'bg-rose-50', fg: 'text-rose-700', border: 'border-rose-200' },
  };
  
  const c = map[status] || map['Applied'];
  
  return (
    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${c.bg} ${c.fg} ${c.border} whitespace-nowrap`}>
      {status}
    </span>
  );
}

export default AppliedStatus;