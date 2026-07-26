import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import TopNavbar from '../components/TopNavbar';
import StatusPill from '../components/StatusPill';
import { pick, fmtDate } from '../utils/fields';
import { normalizeApplicant } from '../utils/drive';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBook, 
  FiFileText, 
  FiExternalLink, 
  FiBriefcase, 
  FiCalendar,
  FiCheck,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [app, setApp] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin/applications/${id}`);
      // Normalize all backend field-name variants (incl. nested `student`,
      // the raw gpa_cgpa DB column, Cloudinary photo, certificates, etc.)
      const data = normalizeApplicant(res.data.application || res.data, pick);
      data.applied_date = fmtDate(pick(data, 'applied_date', 'created_at', 'applied_at', 'application_date'));
      setApp(data);
      setNotes(data.admin_notes || '');
    } catch (err) {
      setError('Could not load application. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const runAction = async () => {
    setActionLoading(true);
    try {
      const { type } = confirmAction;
      if (type === 'shortlist') await axiosClient.patch(`/admin/applications/${id}/shortlist`, { admin_notes: notes || undefined });
      if (type === 'reject') await axiosClient.patch(`/admin/applications/${id}/reject`, { admin_notes: notes || undefined });
      
      // Toast notification provides the attractive popup message on success
      showToast(type === 'shortlist' ? 'Candidate shortlisted! 🎉' : 'Application rejected.', type === 'shortlist' ? 'success' : 'info');
      
      setConfirmAction(null);
      load();
    } catch (err) {
      setError('Action failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const actionLabels = {
    shortlist: { title: 'Shortlist Candidate', message: `Shortlist ${app?.name} for ${app?.job_title || app?.role}?`, confirmLabel: 'Shortlist Candidate', color: '#10b981' },
    reject: { title: 'Reject Application', message: `Reject ${app?.name}'s application? They will be notified.`, confirmLabel: 'Reject Application', color: '#f43f5e' },
  };
  const modalCopy = confirmAction ? actionLabels[confirmAction.type] : null;

  return (
    <>
      {/* Premium Animations & Loader Styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        
        /* Concentric Circular Loader */
        .premium-loader {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .premium-loader-ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid transparent;
        }
        .premium-loader-ring:nth-child(1) {
          inset: 0;
          border-top-color: #4f46e5;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .premium-loader-ring:nth-child(2) {
          inset: 12px;
          border-right-color: #8b5cf6;
          animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
        }
        .premium-loader-ring:nth-child(3) {
          inset: 24px;
          border-bottom-color: #0ea5e9;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <main className="min-h-screen bg-[#F8FAFC] font-sans">
        <TopNavbar title="Application Detail" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumbs & Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-entrance">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link 
                to="/admin/applications" 
                className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                <FiArrowLeft size={14} /> Back to Applications
              </Link>
            </div>
            
            {app && (
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <FiCalendar size={14} className="text-indigo-500" /> 
                  Applied: <span className="text-slate-800">{app.applied_date || 'N/A'}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                <span className="uppercase tracking-wider">
                  APP ID: <span className="text-slate-800">#{app.id}</span>
                </span>
              </div>
            )}
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-entrance">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 animate-entrance">
              <div className="premium-loader mb-6">
                <div className="premium-loader-ring"></div>
                <div className="premium-loader-ring"></div>
                <div className="premium-loader-ring"></div>
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Loading Dossier</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Retrieving applicant records securely...</p>
            </div>
          )}

          {/* Main Content Grid */}
          {!loading && app && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: APPLICANT DOSSIER (Sticky) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 animate-entrance delay-100">
                <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
                  {/* Decorative Background for Avatar */}
                  <div className="h-28 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  </div>
                  
                  <div className="px-6 sm:px-8 pb-8 relative text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto -mt-12 rounded-full border-4 border-white shadow-md bg-white overflow-hidden relative z-10">
                      {app.profile_photo ? (
                        <img
                          src={app.profile_photo}
                          alt={app.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white ${app.profile_photo ? 'hidden' : 'flex'}`}>
                        {(app.name || '?').charAt(0)}
                      </div>
                    </div>

                    <div className="mt-4 mb-5">
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{app.name}</h3>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">{app.job_title || app.role}</p>
                    </div>

                    <div className="flex justify-center mb-6">
                      <StatusPill status={app.status} />
                    </div>

                    {/* Contact Info Details */}
                    <div className="space-y-3.5 text-left border-t border-slate-100 pt-6">
                      {(app.institution || app.college) && (
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                            <FiBook size={16} />
                          </div>
                          <p className="text-sm font-semibold text-slate-700 leading-snug pt-1.5">{app.institution || app.college}</p>
                        </div>
                      )}
                      {app.email && (
                        <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                            <FiMail size={16} />
                          </div>
                          <a href={`mailto:${app.email}`} className="text-sm font-semibold text-slate-700 hover:text-indigo-600 truncate pt-0.5">{app.email}</a>
                        </div>
                      )}
                      {app.phone && (
                        <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                            <FiPhone size={16} />
                          </div>
                          <p className="text-sm font-semibold text-slate-700 pt-0.5">{app.phone}</p>
                        </div>
                      )}
                      {app.location && (
                        <div className="flex items-center gap-3 group">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
                            <FiMapPin size={16} />
                          </div>
                          <p className="text-sm font-semibold text-slate-700 pt-0.5">{app.location}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 space-y-3">
                      {app.status !== 'Shortlisted' && (
                        <button 
                          onClick={() => setConfirmAction({ type: 'shortlist' })} 
                          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                          <FiCheck size={18} /> Shortlist Candidate
                        </button>
                      )}
                      {app.status !== 'Rejected' && (
                        <button 
                          onClick={() => setConfirmAction({ type: 'reject' })} 
                          className="w-full py-3.5 rounded-xl bg-white border-2 border-rose-100 hover:border-rose-200 text-rose-600 hover:bg-rose-50 font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FiX size={18} /> Reject Application
                        </button>
                      )}
                    </div>

                    {/* Admin Notes Section */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-left">
                      <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                        Private Admin Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add internal notes about this candidate..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: APPLICATION DETAILS */}
              <div className="lg:col-span-8 space-y-6 animate-entrance delay-200">
                <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10">
                  
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FiFileText size={20} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Application Documents</h2>
                  </div>

                  {/* Resume Card */}
                  <div className="mb-10">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Attached Resume / CV</h3>
                    {app.resume_url ? (
                      <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                            <FiFileText size={24} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm">{app.name}'s Resume Document</p>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                              External Link <FiExternalLink size={10} />
                            </p>
                          </div>
                        </div>
                        <a 
                          href={app.resume_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center flex items-center justify-center gap-2"
                        >
                          View Document <FiExternalLink size={14} />
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                        <FiFileText size={32} className="text-slate-300 mb-3" />
                        <p className="text-sm font-bold text-slate-600">No Resume Attached</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">This applicant did not provide a resume link.</p>
                      </div>
                    )}
                  </div>

                  {/* Academic Profile */}
                  <div className="mb-10">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Academic Background</h3>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800 text-sm leading-relaxed">
                        {app.education_summary || app.institution || 'No academic summary provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {app.skills && app.skills.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {app.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className="px-4 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-700 text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform cursor-default"
                          >
                            {typeof skill === 'string' ? skill : `${skill?.name || 'Skill'}${skill?.level ? ` · ${skill.level}` : ''}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Section */}
                  {Array.isArray(app.experience) && app.experience.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Professional Experience</h3>
                      <div className="space-y-4">
                        {app.experience.map((exp, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FiBriefcase size={18} />
                            </div>
                            <div>
                              {typeof exp === 'string' ? (
                                <p className="text-sm font-semibold text-slate-700 leading-relaxed">{exp}</p>
                              ) : (
                                <>
                                  <h4 className="font-extrabold text-slate-900 text-base">{exp?.title || 'Role'}</h4>
                                  {exp?.company && <p className="text-sm font-bold text-indigo-600 mt-0.5">{exp.company}</p>}
                                  {exp?.duration && <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1.5"><FiCalendar size={12} /> {exp.duration}</p>}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter Section */}
                  {app.cover_letter && (
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Applicant Cover Letter</h3>
                      <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                        <p className="text-sm font-medium text-slate-700 leading-loose whitespace-pre-wrap">
                          {app.cover_letter}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
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
      </main>
    </>
  );
}

export default ApplicationDetail;