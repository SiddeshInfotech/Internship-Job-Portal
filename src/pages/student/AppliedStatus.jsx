import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Per request: only 3 stages shown in the journey tracker (Interview and
// Offer removed). A Rejected application is shown with a red badge instead
// of a truncated journey.
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
    // Interview/Offered map to "past Shortlisted" (all 3 stages complete)
    if (status === 'Interview' || status === 'Offered') return STAGES.length - 1;
    return idx;
  };

  return (
    <>
      <StudentSubTabs />
      <main className="max-w-5xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Application Tracker</h1>
        <p className="text-sm text-slate-500 mb-6">Manage and track your active internship applications and their progress.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Applied" value={stats.total_applied} color="#0F172A" />
            <StatCard label="Active Progress" value={stats.active_progress} color="#F59E0B" />
            <StatCard label="Offers Received" value={stats.offers_received} color="#16a34a" />
            {/* Note: backend has no "Waitlisted" status yet — this is real "Rejected" data, labeled honestly */}
            <StatCard label="Rejected" value={stats.rejected} color="#dc2626" />
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading applications...</div>
        ) : (
        <>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Most Recent Updates</p>
        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
              No applications yet — <button onClick={() => navigate('/student/browse-jobs')} className="text-[#F59E0B] font-semibold">browse open roles</button> to get started.
            </div>
          )}
          {applications.map((app) => {
            const isOpen = expandedId === app.id;
            const isRejected = app.status === 'Rejected';
            const currentStage = stageIndex(app.status);
            return (
              <div key={app.id} className={`bg-white rounded-2xl border-2 p-5 ${isOpen ? 'border-[#F59E0B]' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isOpen ? null : app.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[#0F172A]">
                      {(app.company_name || app.company || '?').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{app.job_title || app.role}</p>
                      <p className="text-sm text-slate-500">{app.company_name || app.company} · {app.location} · Applied {app.applied_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {isOpen ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Application Journey</p>
                      {!isRejected && <p className="text-xs text-slate-400">Current Stage: <span className="text-[#F59E0B] font-semibold">Stage {Math.max(currentStage + 1, 1)} of {STAGES.length}</span></p>}
                    </div>

                    {isRejected ? (
                      <p className="text-sm text-red-600 font-medium">This application was not moved forward.</p>
                    ) : (
                      <div className="flex items-center">
                        {STAGES.map((stage, i) => (
                          <React.Fragment key={stage}>
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                i < currentStage ? 'bg-[#0F172A] text-white' : i === currentStage ? 'border-2 border-[#F59E0B] text-[#F59E0B]' : 'border-2 border-slate-200 text-slate-300'
                              }`}>
                                {i < currentStage ? '✓' : '●'}
                              </div>
                              <span className={`text-[11px] font-semibold uppercase ${i <= currentStage ? 'text-[#0F172A]' : 'text-slate-300'}`}>{stage}</span>
                            </div>
                            {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < currentStage ? 'bg-[#0F172A]' : 'bg-slate-200'}`} />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    <button onClick={() => navigate(`/student/jobs/${app.job_id}`)} className="text-sm text-[#F59E0B] font-semibold mt-6">View job posting →</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>
        )}
      </main>
    </>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
      <h3 className="text-2xl font-extrabold" style={{ color }}>{value ?? '—'}</h3>
      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Applied: { bg: '#eff6ff', fg: '#1e40af' }, 'In Review': { bg: '#eff6ff', fg: '#1e40af' },
    Shortlisted: { bg: '#fffbeb', fg: '#d97706' }, Interview: { bg: '#fffbeb', fg: '#d97706' },
    Offered: { bg: '#f0fdf4', fg: '#16a34a' }, Rejected: { bg: '#fef2f2', fg: '#dc2626' },
  };
  const c = map[status] || { bg: '#f1f5f9', fg: '#64748b' };
  return <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: c.bg, color: c.fg }}>{status}</span>;
}

export default AppliedStatus;
