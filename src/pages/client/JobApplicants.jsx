import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import clientAxios from '../../api/clientAxios';
import { asArray } from '../../api/asArray';
import ClientTopNavbar from '../../components/ClientTopNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import StatusPill from '../../components/StatusPill';
import { pick, fmtDate } from '../../utils/fields';
import { normalizeApplicant } from '../../utils/drive';
import { 
  FiSearch, 
  FiFilter, 
  FiMail, 
  FiChevronLeft, 
  FiChevronRight, 
  FiAlertCircle, 
  FiBookOpen,
  FiCheck,
  FiX,
  FiClock,
  FiSend,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiBriefcase
} from 'react-icons/fi';

const PER_PAGE = 10;

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgResult, setMsgResult] = useState('');
  const [msgError, setMsgError] = useState('');

  const loadStats = async () => {
    try {
      const res = await clientAxios.get(`/client/jobs/${jobId}/applicants/stats`);
      setStats(res.data.stats || res.data);
    } catch { /* non-fatal */ }
  };

  const loadApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clientAxios.get(`/client/jobs/${jobId}/applicants`, {
        params: { search: search || undefined, status: statusFilter || undefined, page, per_page: PER_PAGE },
      });
      const data = res.data;
      const list = asArray(data.applicants, data.results, data).map((a) => {
        const n = normalizeApplicant(a, pick);
        n.applied_date = fmtDate(pick(a, 'applied_date', 'applied_at', 'created_at', 'date'));
        return n;
      });
      setApplicants(list);
      setTotal(data.total ?? list.length);
      if (data.job_title) setJobTitle(data.job_title);
    } catch (err) {
      setError('Could not load applicants. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [jobId]);
  useEffect(() => {
    const timer = setTimeout(loadApplicants, search ? 350 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, search, statusFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handleSendMessageAll = async (e) => {
    e.preventDefault();
    setMsgError('');
    setMsgResult('');
    setMsgSending(true);
    try {
      const res = await clientAxios.post(`/client/jobs/${jobId}/message-applicants`, {
        subject: msgSubject, message: msgBody,
      });
      setMsgResult(res.data.message || 'Message sent.');
      setMsgSubject(''); setMsgBody('');
    } catch (err) {
      setMsgError(err.response?.data?.message || 'Could not send message. Please try again.');
    } finally {
      setMsgSending(false);
    }
  };

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { appId, type } = confirmAction;
      if (type === 'shortlist') await clientAxios.patch(`/client/applicants/${appId}/shortlist`);
      if (type === 'reject') await clientAxios.patch(`/client/applicants/${appId}/reject`);
      setConfirmAction(null);
      loadApplicants();
      loadStats();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    shortlist: { title: 'Shortlist Candidate', message: `Shortlist ${confirmAction?.name}?`, confirmLabel: 'Shortlist', color: '#10b981' }, 
    reject: { title: 'Reject Application', message: `Reject ${confirmAction?.name}'s application?`, confirmLabel: 'Reject', color: '#ef4444' }, 
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50/80 pb-16 font-sans text-slate-900">
        <ClientTopNavbar title={jobTitle ? `${jobTitle} Applicants` : 'Applicants'} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* Sleek Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl mb-6 shadow-sm animate-slide-up">
            <Link to="/jobs" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <FiBriefcase size={14} /> Jobs
            </Link>
            <FiChevronRight size={14} className="text-slate-400" />
            
          </nav>

          {/* Page Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Applicant Management</h1>
            <p className="text-slate-500 mt-1.5 font-medium">Reviewing <span className="font-bold text-slate-700">{total}</span> total applications for this position.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-slide-up">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Dynamic Stats Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
            <StatCard label="Total received" value={stats?.total_received} icon={FiUsers} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
            <StatCard label="New / unseen" value={stats?.new_unseen} icon={FiStar} colorClass="text-amber-600" bgClass="bg-amber-50" />
            <StatCard label="Shortlisted" value={stats?.shortlisted} icon={FiCheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
            <StatCard label="Rejected" value={stats?.rejected} icon={FiXCircle} colorClass="text-rose-600" bgClass="bg-rose-50" />
          </section>

          {/* Action Bar (Search, Filter, Message) */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6 animate-slide-up delay-200">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md group">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                  placeholder="Search applicants by name or skill..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
              {/* Filter */}
              <div className="relative w-full sm:w-48 group">
                <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="In Review">In Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => { setShowMessageModal(true); setMsgResult(''); setMsgError(''); }}
              disabled={total === 0}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              <FiMail className="group-hover:scale-110 transition-transform" />
              Message All Applicants
            </button>
          </div>

          {/* Applicants List Area */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-5 animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-slate-100 rounded-full w-16" />
                      <div className="h-6 bg-slate-100 rounded-full w-20" />
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col justify-between items-end w-40 border-l border-slate-100 pl-5">
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-slate-200 rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4 animate-slide-up delay-200">
                {applicants.length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                      <FiSearch size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No applicants found</h3>
                    <p className="text-slate-500 mt-1 font-medium">{search || statusFilter ? 'Try adjusting your search or filters.' : 'New applications will appear here.'}</p>
                  </div>
                )}
                
                {applicants.map((a) => (
                  <div key={a.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row gap-6">
                    
                    {/* Left: Avatar & Info */}
                    <div className="flex gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {a.profile_photo ? (
                          <img 
                            src={a.profile_photo} 
                            alt={a.name} 
                            className="w-14 h-14 rounded-xl object-cover shadow-sm ring-1 ring-slate-100" 
                            onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }} 
                          />
                        ) : null}
                        <div 
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-inner ring-1 ring-inset ring-indigo-100/50"
                          style={{ display: a.profile_photo ? 'none' : 'flex' }}
                        >
                          {(a.name || '?').charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <h3 
                            className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
                            onClick={() => navigate(`/applicants/${a.id}`)}
                          >
                            {a.name}
                          </h3>
                          {!a.viewed_by_company && !a.is_seen && !a.seen && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">New</span>
                          )}
                          {a.status && (
                            <div className="scale-90 origin-left"><StatusPill status={a.status} /></div>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-3">
                          <FiBookOpen size={14} className="text-slate-400" />
                          <span className="truncate">{a.institution || a.college}{a.current_year ? `, ${a.current_year}` : ''}</span>
                        </p>
                        
                        {/* Skills */}
                        {a.skills && a.skills.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-3">
                            {a.skills.slice(0, 5).map((sk, i) => (
                              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                                {typeof sk === 'string' ? sk : (sk?.skill_name || sk?.name || 'Skill')}
                              </span>
                            ))}
                            {a.skills.length > 5 && (
                              <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-xs font-semibold rounded-lg">+{a.skills.length - 5}</span>
                            )}
                          </div>
                        )}
                        
                        {/* Summary */}
                        {a.profile_summary && (
                          <p className="text-sm text-slate-600 italic line-clamp-2 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            "{a.profile_summary}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions & Meta */}
                    <div className="flex flex-col items-start md:items-end justify-between md:min-w-[180px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right w-full mb-4 md:mb-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center md:justify-end gap-1 mb-1">
                          <FiClock size={10} /> Applied On
                        </p>
                        <p className="text-sm font-bold text-slate-700">{a.applied_date}</p>
                      </div>
                      
                      <div className="w-full space-y-2">
                        <button 
                          onClick={() => navigate(`/applicants/${a.id}`)} 
                          className="w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98]"
                        >
                          View Profile
                        </button>
                        
                        <div className="flex gap-2">
                          {a.status !== 'Shortlisted' && (
                            <button
                              onClick={() => setConfirmAction({ appId: a.id, name: a.name, type: 'shortlist' })}
                              className="flex-1 py-2 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-emerald-200/50 hover:border-transparent active:scale-[0.98]"
                            >
                              Shortlist
                            </button>
                          )}
                          {a.status !== 'Rejected' && (
                            <button
                              onClick={() => setConfirmAction({ appId: a.id, name: a.name, type: 'reject' })}
                              className="flex-1 py-2 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-200/50 hover:border-transparent active:scale-[0.98]"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>

              {/* Upgraded Pagination Box */}
              {total > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm gap-4 animate-slide-up delay-200">
                  <p className="text-sm font-medium text-slate-500">
                    Showing <span className="font-bold text-slate-900">{(page - 1) * PER_PAGE + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * PER_PAGE, total)}</span> of <span className="font-bold text-slate-900">{total}</span> results
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={page <= 1} 
                      onClick={() => setPage((p) => p - 1)} 
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors border border-slate-200 disabled:border-transparent"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-bold text-slate-700 px-3 min-w-[90px] text-center">
                      Page {page} / {totalPages}
                    </span>
                    <button 
                      disabled={page >= totalPages} 
                      onClick={() => setPage((p) => p + 1)} 
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors border border-slate-200 disabled:border-transparent"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Confirm Action Modal */}
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

          {/* Message All Applicants Modal */}
          {showMessageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
              <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-pop-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FiMail className="text-indigo-500" /> Message Applicants
                  </h3>
                  <button 
                    onClick={() => !msgSending && setShowMessageModal(false)}
                    className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 p-2 rounded-xl transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <p className="text-sm font-medium text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Sends a real email to every student who applied to this job (<strong className="text-slate-900">{total} recipient{total === 1 ? '' : 's'}</strong>).
                  </p>

                  {msgError && (
                    <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3">
                      <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm font-medium">{msgError}</span>
                    </div>
                  )}
                  {msgResult && (
                    <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-start gap-3">
                      <FiCheck className="flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm font-medium">{msgResult}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendMessageAll} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="msg-subject">Subject Line</label>
                      <input
                        id="msg-subject"
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                        required
                        placeholder="Update on your application"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="msg-body">Message Content</label>
                      <textarea
                        id="msg-body"
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                        required
                        rows={5}
                        placeholder="Thanks for applying! We'll be in touch soon."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal resize-y min-h-[120px]"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                      <button 
                        type="button" 
                        onClick={() => setShowMessageModal(false)} 
                        disabled={msgSending} 
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                      >
                        {msgResult ? 'Close' : 'Cancel'}
                      </button>
                      <button 
                        type="submit" 
                        disabled={msgSending} 
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.35)] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {msgSending ? (
                          <span className="animate-pulse">Sending...</span>
                        ) : (
                          <><FiSend /> Send to All</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

// Upgraded StatCard with Dynamic Icons
function StatCard({ label, value, icon: Icon, colorClass = 'text-slate-900', bgClass = 'bg-slate-50' }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-extrabold ${colorClass}`}>{value ?? '—'}</h2>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass} ${colorClass}`}>
           {Icon && <Icon size={20} />}
        </div>
      </div>
    </div>
  );
}

export default JobApplicants;