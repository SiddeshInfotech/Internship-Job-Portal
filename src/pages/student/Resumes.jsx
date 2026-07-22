import React, { useEffect, useState } from 'react';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import ConfirmModal from '../../components/ConfirmModal';
import { 
  FiUploadCloud, 
  FiFileText, 
  FiDownload, 
  FiRefreshCw, 
  FiTrash2, 
  FiPlus, 
  FiStar, 
  FiInfo 
} from 'react-icons/fi';

const MAX_RESUMES = 5;

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
      setError(err.response?.status === 400
        ? "You've reached the 5-resume limit — delete one before adding another."
        : 'Could not add this resume. ' + (err.response?.data?.message || err.message));
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
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <StudentSubTabs />
      
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management</h1>
          <p className="text-sm text-slate-500 mt-1">Upload and manage your CVs for seamless applications.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Add Resume Area */}
        <div className={`relative bg-white rounded-3xl border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] mb-10 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showAddForm ? 'p-8' : 'p-10 text-center hover:border-blue-300/50 hover:shadow-blue-500/5'}`}>
          {!showAddForm ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 mb-5 flex items-center justify-center text-blue-500 shadow-inner">
                <FiUploadCloud size={28} className="drop-shadow-sm" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Add a new resume</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
                We use secure URL linking. Upload your PDF to Google Drive or Dropbox, ensure it's viewable, and paste the shareable link.
              </p>
              <button 
                onClick={() => setShowAddForm(true)} 
                disabled={resumes.length >= MAX_RESUMES} 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <FiPlus className={`transition-transform duration-300 ${resumes.length >= MAX_RESUMES ? '' : 'group-hover:rotate-90'}`} />
                {resumes.length >= MAX_RESUMES ? 'Slot limit reached (5/5)' : 'Add Resume Link'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdd} className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FiFileText size={16} />
                </div>
                Resume Details
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Document Name</label>
                  <input 
                    value={filename} 
                    onChange={(e) => setFilename(e.target.value)} 
                    required 
                    placeholder="e.g. Frontend_Engineer_Resume.pdf" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Shareable URL Link</label>
                  <input 
                    value={fileUrl} 
                    onChange={(e) => setFileUrl(e.target.value)} 
                    required 
                    type="url" 
                    placeholder="https://drive.google.com/file/d/..." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60 disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : 'Save Document'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* List Header & Slots */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Documents</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(MAX_RESUMES)].map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i < resumes.length ? 'bg-blue-500' : 'bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 ml-2">{resumes.length} / {MAX_RESUMES} Slots</span>
          </div>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl border border-slate-200/50 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.length === 0 && (
              <div className="bg-white/50 border border-slate-200 border-dashed rounded-2xl py-12 flex flex-col items-center justify-center text-slate-400">
                <FiFileText size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">No resumes added yet.</p>
              </div>
            )}
            
            {resumes.map((r) => (
              <div 
                key={r.id} 
                className="group relative bg-white border border-slate-200 rounded-2xl p-4 pr-5 flex items-center justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors duration-300">
                    <FiFileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <p className="font-bold text-slate-900 text-[15px]">{r.filename}</p>
                      {r.is_primary && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-[10px] font-bold tracking-wide">
                          <FiStar size={10} className="fill-indigo-600" /> PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400">Added on {r.uploaded_date || r.created_at}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={r.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    title="Download/View" 
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <FiDownload size={18} />
                  </a>
                  {!r.is_primary && (
                    <button 
                      onClick={() => handleSetPrimary(r.id)} 
                      title="Set as primary" 
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                    >
                      <FiRefreshCw size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => setConfirmDelete(r)} 
                    title="Delete" 
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information Banner */}
        <div className="mt-8 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:bg-amber-50">
          <div className="mt-0.5 text-amber-500 bg-white rounded-full p-1 shadow-sm">
            <FiInfo size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Privacy Notice</h4>
            <p className="text-xs text-amber-700/80 leading-relaxed max-w-2xl">
              Companies see your "Primary" resume by default when you apply. Make sure your documents don't contain sensitive personal data like national IDs or exact home addresses.
            </p>
          </div>
        </div>

      </main>

      {/* Styled Confirm Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete "${confirmDelete?.filename}"? This action cannot be undone.`}
        confirmLabel="Delete Document"
        confirmColor="#ef4444"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        loading={actionLoading}
      />
    </div>
  );
}

export default Resumes;