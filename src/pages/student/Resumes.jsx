import React, { useEffect, useState } from 'react';
import studentAxios from '../../api/studentAxios';
import { asArray } from '../../api/asArray';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import ConfirmModal from '../../components/ConfirmModal';
import { FiUploadCloud, FiFileText, FiDownload, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

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
    <>
      <StudentSubTabs />
      <main className="max-w-4xl mx-auto px-6 py-6">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center text-slate-400">
            <FiUploadCloud size={22} />
          </div>
          {!showAddForm ? (
            <>
              <p className="font-semibold text-[#0F172A] mb-1">Add a resume</p>
              <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
                Placify doesn't host files directly — upload your PDF to Google Drive, Dropbox, or similar, then paste the shareable link here.
              </p>
              <button onClick={() => setShowAddForm(true)} disabled={resumes.length >= MAX_RESUMES} className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-sm disabled:opacity-50">
                {resumes.length >= MAX_RESUMES ? 'Slot limit reached (5/5)' : 'Add Resume Link'}
              </button>
            </>
          ) : (
            <form onSubmit={handleAdd} className="max-w-md mx-auto text-left space-y-3">
              <input value={filename} onChange={(e) => setFilename(e.target.value)} required placeholder="Filename, e.g. John_Doe_Resume.pdf" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]" />
              <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required type="url" placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]" />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] text-white font-semibold text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save Resume'}</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm">Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Career Documents</p>
          <p className="text-xs text-slate-400">{resumes.length} of {MAX_RESUMES} slots used</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading resumes...</div>
        ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {resumes.length === 0 && <p className="text-center text-slate-400 py-10">No resumes added yet.</p>}
          {resumes.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><FiFileText size={16} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#0F172A] text-sm">{r.filename}</p>
                    {r.is_primary && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">PRIMARY</span>}
                  </div>
                  <p className="text-xs text-slate-400">{r.uploaded_date || r.created_at}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <a href={r.file_url} target="_blank" rel="noreferrer" title="Download" className="hover:text-[#0F172A]"><FiDownload size={15} /></a>
                {!r.is_primary && <button onClick={() => handleSetPrimary(r.id)} title="Set as primary" className="hover:text-[#0F172A]"><FiRefreshCw size={15} /></button>}
                <button onClick={() => setConfirmDelete(r)} title="Delete" className="hover:text-red-600"><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-xs text-amber-700">
          Companies see your "Primary" resume by default when you apply. Make sure your documents don't contain sensitive personal data like national IDs.
        </div>
      </main>

      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Resume"
        message={`Delete "${confirmDelete?.filename}"? This can't be undone.`}
        confirmLabel="Delete"
        confirmColor="#dc2626"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        loading={actionLoading}
      />
    </>
  );
}

export default Resumes;
