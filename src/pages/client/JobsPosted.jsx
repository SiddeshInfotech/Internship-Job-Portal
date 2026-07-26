import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import StatusPill from '../../components/StatusPill';
import { 
  FiPlus, 
  FiFilter, 
  FiBriefcase, 
  FiAlertCircle, 
  FiUsers, 
  FiCalendar, 
  FiEdit2,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiActivity,
  FiArchive,
  FiX
} from 'react-icons/fi';

const PER_PAGE = 10;

function JobsPosted() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({}); 
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // NEW: State for the premium success toast notification
  const [toast, setToast] = useState({ show: false, message: '' });

  // Function to trigger the animated toast
  const showToast = (message) => {
    setToast({ show: true, message });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const loadStats = async () => {
    try {
      const res = await clientAxios.get('/client/jobs/stats');
      setStats(res.data.stats || res.data);
    } catch { /* non-fatal */ }
  };

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clientAxios.get('/client/jobs', { params: { status: statusFilter || undefined, page, per_page: PER_PAGE } });
      const data = res.data;
      const list = asArray(data.jobs, data.results, data);
      setJobs(list);
      setTotal(data.total ?? list.length);
      
      Promise.all(
        list.map((job) =>
          clientAxios
            .get(`/client/jobs/${job.id}/applicants`, { params: { page: 1, per_page: 1 } })
            .then((r) => [job.id, r.data.total ?? 0])
            .catch(() => [job.id, null])
        )
      ).then((pairs) => {
        const map = {};
        pairs.forEach(([id, n]) => { if (n !== null) map[id] = n; });
        setCounts((prev) => ({ ...prev, ...map }));
      });
    } catch (err) {
      setError('Could not load your job posts. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadJobs(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const canEdit = (status) => ['Draft', 'Pending', 'Rejected'].includes(status);

  // UPGRADED: Added success messaging for each operation
  const runAction = async () => {
    setActionLoading(true);
    try {
      const { jobId, type } = confirmAction;
      let successMsg = '';

      if (type === 'close') {
        await clientAxios.patch(`/client/jobs/${jobId}/close`);
        successMsg = 'Job listing has been closed successfully.';
      }
      if (type === 'mark-filled') {
        await clientAxios.patch(`/client/jobs/${jobId}/mark-filled`);
        successMsg = 'Job successfully marked as filled.';
      }
      if (type === 'submit') {
        await clientAxios.patch(`/client/jobs/${jobId}/submit`);
        successMsg = 'Job successfully submitted for approval.';
      }

      setConfirmAction(null);
      loadJobs();
      loadStats();
      
      // Trigger the success animation popup
      showToast(successMsg);

    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    close: { title: 'Close Job Post', message: `Close "${confirmAction?.title}"? It will stop accepting new applications.`, confirmLabel: 'Close Job', color: '#ef4444' },
    'mark-filled': { title: 'Mark as Filled', message: `Mark "${confirmAction?.title}" as filled? This closes it to new applicants.`, confirmLabel: 'Mark Filled', color: '#10b981' },
    submit: { title: 'Submit for Approval', message: `Submit "${confirmAction?.title}" to Admin for approval?`, confirmLabel: 'Submit', color: '#f97316' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <>
      {/* Custom SaaS Animations */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50/80 pb-16 font-sans text-slate-900 relative overflow-hidden">
        <ClientTopNavbar title="Jobs Posted" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Page Header Area */}
          <div className="mb-8 animate-slide-up flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Listing Management</h1>
              <p className="text-slate-500 mt-1.5 font-medium">Track, manage, and monitor your active recruitment drives.</p>
            </div>
            
            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative w-full md:w-56 group">
                <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved / Active</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Filled">Filled</option>
                  <option value="Closed">Closed</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/jobs/new')} 
                className="flex items-center justify-center gap-2 whitespace-nowrap bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] active:scale-[0.98] group"
              >
                <FiPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Post New Job</span>
                <span className="sm:hidden">Post</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-slide-up">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Premium Stats Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
            <StatCard label="Total listings" value={stats?.total_listings} icon={FiLayers} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
            <StatCard label="Active now" value={stats?.active_now} icon={FiActivity} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
            <StatCard label="Positions filled" value={stats?.positions_filled} icon={FiCheckCircle} colorClass="text-blue-600" bgClass="bg-blue-50" />
            <StatCard label="Closed / drafts" value={stats?.closed_or_drafts} icon={FiArchive} colorClass="text-slate-500" bgClass="bg-slate-100" />
          </section>

          {/* Main Data Table Area */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-slide-up delay-200">
            
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center gap-4 py-4 animate-pulse">
                    <div className="flex-1 space-y-2 w-full">
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/4" />
                    </div>
                    <div className="hidden md:block w-32 h-4 bg-slate-100 rounded" />
                    <div className="w-20 h-6 bg-slate-200 rounded-full" />
                    <div className="hidden md:block w-24 h-4 bg-slate-100 rounded" />
                    <div className="flex gap-2 w-full md:w-48 justify-end">
                      <div className="h-8 bg-slate-200 rounded-lg w-16" />
                      <div className="h-8 bg-slate-200 rounded-lg w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-widest font-bold text-slate-500">
                      <th className="px-6 py-4 rounded-tl-3xl">Role & Department</th>
                      <th className="px-6 py-4">Posted On</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4">Engagement</th>
                      <th className="px-6 py-4 text-right rounded-tr-3xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-slate-100">
                              <FiBriefcase size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No job posts yet</h3>
                            <p className="text-slate-500 mt-1 font-medium">Create your first listing to start hiring.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => (
                        <tr key={job.id} className="group hover:bg-slate-50/80 transition-colors duration-200">
                          <td className="px-6 py-5">
                            <p 
                              onClick={() => navigate(`/jobs/${job.id}/applicants`)}
                              className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer mb-1 line-clamp-1"
                            >
                              {job.title}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {(job.department || 'General').toUpperCase()}
                            </p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-600">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-slate-400" size={16} />
                              {job.posted_date || job.created_at}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="scale-90 origin-left inline-block">
                              <StatusPill status={job.status} />
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-700">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-max border border-slate-200/60">
                              <FiUsers className="text-slate-500" size={16} />
                              <span className="text-base text-slate-900">{counts[job.id] ?? job.applicants_count ?? job.applications_count ?? 0}</span>
                              <span className="text-slate-500 text-xs font-medium">Applicants</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right whitespace-nowrap">
                            <div className="flex justify-end items-center gap-2">
                              {job.status === 'Draft' && (
                                <button 
                                  onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'submit' })} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all border border-orange-200/50 hover:border-transparent active:scale-[0.98]"
                                >
                                  <FiSend size={14} /> Submit
                                </button>
                              )}
                              {canEdit(job.status) && (
                                <button 
                                  onClick={() => navigate(`/jobs/${job.id}/edit`)} 
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-700 hover:text-white transition-all border border-transparent active:scale-[0.98]"
                                >
                                  <FiEdit2 size={14} /> Edit
                                </button>
                              )}
                              {job.status === 'Approved' && (
                                <button
                                  onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'mark-filled' })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-200/50 hover:border-transparent active:scale-[0.98]"
                                >
                                  <FiCheckCircle size={14} /> Mark Filled
                                </button>
                              )}
                              {['Approved', 'Pending'].includes(job.status) && (
                                <button
                                  onClick={() => setConfirmAction({ jobId: job.id, title: job.title, type: 'close' })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all border border-rose-200/50 hover:border-transparent active:scale-[0.98]"
                                  aria-label={`Close ${job.title}`}
                                  title="Close job"
                                >
                                  <FiXCircle size={14} /> Close
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Beautiful Pagination Footer Container */}
            {jobs.length > 0 && !loading && (
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 rounded-b-3xl">
                <p className="text-sm font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-900">{(page - 1) * PER_PAGE + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * PER_PAGE, total)}</span> of <span className="font-bold text-slate-900">{total}</span> results
                </p>
                <div className="flex items-center gap-2 bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
                  <button 
                    disabled={page <= 1} 
                    onClick={() => setPage((p) => p - 1)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-bold text-slate-700 px-3 min-w-[90px] text-center">
                    Page {page} of {totalPages}
                  </span>
                  <button 
                    disabled={page >= totalPages} 
                    onClick={() => setPage((p) => p + 1)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    aria-label="Next page"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>

        {/* Action Confirmation Modal */}
        {modalCopy && (
          <ConfirmModal
            open={!!confirmAction}
            title={modalCopy.title}
            message={modalCopy.message}
            confirmLabel={modalCopy.confirmLabel}
            confirmColor={modalCopy.color}
            onConfirm={runAction}
            onCancel={() => setConfirmAction(null)}
            loading={actionLoading}
          />
        )}

        {/* Animated Success Toast Popup (Vercel Style) */}
        <div 
          className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            toast.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
          }`}
        >
          <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50 min-w-[300px]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FiCheckCircle size={18} />
            </div>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

// Premium StatCard component with proper React Icons
function StatCard({ label, value, icon: Icon, colorClass = 'text-slate-900', bgClass = 'bg-slate-50' }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-extrabold ${colorClass}`}>{value ?? '—'}</h2>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
           {Icon && <Icon size={20} />}
        </div>
      </div>
    </div>
  );
}

export default JobsPosted;