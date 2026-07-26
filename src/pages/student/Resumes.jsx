import React, { useEffect, useState } from 'react';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import ConfirmModal from '../../components/ConfirmModal';
import { 
  FiUploadCloud, 
  FiFileText, 
  FiDownload, 
  FiStar, 
  FiTrash2,
  FiAlertCircle,
  FiInfo,
  FiLink,
  FiCheckCircle
} from 'react-icons/fi';

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filename, setFilename] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentAxios.get('/student/resumes');
      setResumes(asArray(res.data.resumes, res.data));
    } catch (err) {
      setError('Could not load your resumes. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await studentAxios.post('/student/resumes', { filename, file_url: fileUrl });
      setFilename(''); setFileUrl(''); setShowAddForm(false);
      load();
    } catch (err) {
      // Limit error removed; now directly displays the backend error message if one occurs
      setError(err.response?.data?.message || err.message || 'Could not add this resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await studentAxios.patch(`/student/resumes/${id}/set-primary`);
      load();
    } catch (err) {
      setError('Could not update primary resume. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await studentAxios.delete(`/student/resumes/${confirmDelete.id}`);
      setConfirmDelete(null);
      load();
    } catch (err) {
      setError('Could not delete this resume. ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <StudentSubTabs />

      {/* Premium Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <main className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-entrance">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Career Documents</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your resumes and portfolios for applications.</p>
            </div>
            
            {/* Total Count Badge */}
            <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Documents</span>
              <span className="text-lg font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                {resumes.length}
              </span>
            </div>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-sm px-5 py-4 rounded-2xl flex items-start gap-3 shadow-sm animate-entrance delay-100">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Informational Banner */}
          <div className="bg-blue-50/50 border border-blue-100/50 text-blue-800 text-sm px-5 py-4 rounded-2xl flex items-start gap-3 shadow-[0_2px_10px_rgb(59,130,246,0.05)] animate-entrance delay-100">
            <FiInfo className="mt-0.5 flex-shrink-0 text-blue-500" size={18} />
            <p className="font-medium leading-relaxed">
              Companies see your <span className="font-bold bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">Primary</span> resume by default when you apply. Avoid uploading documents with highly sensitive personal data.
            </p>
          </div>

          {/* Upload / Add Area */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-entrance delay-200 transition-all">
            {!showAddForm ? (
              <div className="p-10 text-center transition-colors duration-300 hover:bg-slate-50/50">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-500 border border-indigo-100">
                  <FiUploadCloud size={28} />
                </div>
                
                <h3 className="font-extrabold text-xl text-slate-900 mb-2">
                  Add a New Resume
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
                  Placify uses external hosting. Upload your PDF to Google Drive or Dropbox, ensure it's set to "Anyone with the link", and paste it below.
                </p>
                
                <button 
                  onClick={() => setShowAddForm(true)} 
                  className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm transition-all duration-300 shadow-md hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                >
                  + Add Resume Link
                </button>
              </div>
            ) : (
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FiLink size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900">Link External Resume</h3>
                    <p className="text-sm font-medium text-slate-500">Provide the shareable link to your document.</p>
                  </div>
                </div>

                <form onSubmit={handleAdd} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Document Name</label>
                      <input 
                        value={filename} 
                        onChange={(e) => setFilename(e.target.value)} 
                        required 
                        placeholder="e.g. Frontend_Dev_Resume.pdf" 
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Shareable URL</label>
                      <input 
                        value={fileUrl} 
                        onChange={(e) => setFileUrl(e.target.value)} 
                        required 
                        type="url" 
                        placeholder="https://drive.google.com/..." 
                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving} 
                      className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-indigo-500/25 disabled:opacity-70 flex items-center justify-center gap-2 sm:ml-auto"
                    >
                      {saving ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      ) : 'Save Document'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* List Section */}
          <div className="animate-entrance delay-300">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 font-semibold tracking-wide animate-pulse">Loading documents...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                
                {resumes.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 ring-8 ring-slate-50/50">
                      <FiFileText className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">No resumes yet</h3>
                    <p className="text-slate-500 text-sm">Upload your first resume to start applying to opportunities.</p>
                  </div>
                )}

                <div className="divide-y divide-slate-100">
                  {resumes.map((r) => (
                    <div key={r.id} className="group p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors duration-300">
                      
                      {/* Document Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${r.is_primary ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'}`}>
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 mb-1">
                            <p className="font-extrabold text-slate-900 text-base">{r.filename}</p>
                            {r.is_primary && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold tracking-wider uppercase">
                                <FiCheckCircle size={10} /> Primary
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-400">
                            Added on {r.uploaded_date || r.created_at}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:gap-3 pl-16 sm:pl-0">
                        <a 
                          href={r.file_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          title="Open/Download" 
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 font-bold text-xs transition-all shadow-sm"
                        >
                          <FiDownload size={14} /> <span className="hidden sm:inline">View</span>
                        </a>
                        
                        {!r.is_primary && (
                          <button 
                            onClick={() => handleSetPrimary(r.id)} 
                            title="Set as Primary" 
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 font-bold text-xs transition-all shadow-sm"
                          >
                            <FiStar size={14} /> <span className="hidden sm:inline">Make Primary</span>
                          </button>
                        )}
                        
                        <button 
                          onClick={() => setConfirmDelete(r)} 
                          title="Delete Resume" 
                          className="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 font-bold text-xs transition-all shadow-sm"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete "${confirmDelete?.filename}"? This action cannot be undone.`}
        confirmLabel="Delete Document"
        confirmColor="#e11d48" // Rose 600
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        loading={actionLoading}
      />
    </>
  );
}

export default Resumes;