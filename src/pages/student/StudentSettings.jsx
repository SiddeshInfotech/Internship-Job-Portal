import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import StudentSubTabs from '../../components/student/StudentSubTabs';

function StudentSettings() {
  const [form, setForm] = useState({});
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [photoError, setPhotoError] = useState('');
  const photoInputRef = React.useRef(null);
  const [photoSaving, setPhotoSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAxios.get('/student/profile');
        const p = res.data.profile || res.data;
        setForm({
          name: p.name || '', department: p.department || '', college: p.college || '',
          current_year: p.current_year || '', mobile_no: p.mobile_no || '', profile_summary: p.profile_summary || '',
          enrollment_no: p.enrollment_no || '', course: p.course || '', college_address: p.college_address || '',
          gpa_cgpa: p.gpa_cgpa || p.gpa || p.cgpa || '',
        });
        setEmail(p.email || '');
        setPhotoUrl(p.photo_url || '');
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhotoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    setPhotoSaving(true);
    try {
      // Direct browser → Cloudinary (unsigned preset), then persist the URL
      const cloudinaryUrl = await uploadToCloudinary(file);
      await studentAxios.post('/student/profile/photo', { photo_url: cloudinaryUrl });
      setPhotoUrl(cloudinaryUrl);
    } catch (err) {
      setPhotoError(err.response?.data?.message || err.message || 'Photo upload failed. Please try again.');
    } finally {
      setPhotoSaving(false);
      e.target.value = '';
    }
  };

  const savePartial = async (fields, okMsg) => {
    setError(''); setSuccess('');
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => { payload[f] = form[f]; });
      // DB column is gpa_cgpa; send a gpa alias too for safety
      if ('gpa_cgpa' in payload) payload.gpa = payload.gpa_cgpa;
      await studentAxios.put('/student/profile', payload);
      setSuccess(okMsg);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await savePartial(['name', 'department', 'college', 'current_year', 'mobile_no', 'profile_summary'], 'Personal information updated.');
  };

  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    await savePartial(['enrollment_no', 'course', 'gpa_cgpa', 'college_address'], 'Academic information updated.');
  };

  const _unusedSaveProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await studentAxios.put('/student/profile', form);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwError('New password and confirmation do not match.'); return; }
    setPwSaving(true);
    try {
      await studentAxios.post('/student/change-password', {
        current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword,
      });
      setPwSuccess('Password updated successfully.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Could not update password. Please check your current password.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <>
      <StudentSubTabs />
      <main className="max-w-4xl mx-auto px-6 py-6">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading settings...</div>
        ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-100 to-green-100 mx-auto mb-4 overflow-hidden flex items-center justify-center text-slate-400 text-2xl font-bold">
                {photoSaving ? <div className="pf-spinner" style={{ width: 26, height: 26 }} /> : photoUrl ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" /> : (form.name || '?').charAt(0)}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoFile}
                className="hidden"
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={photoSaving}
                className="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 font-semibold text-sm hover:bg-sky-200 transition-colors disabled:opacity-60"
              >
                {photoSaving ? 'Uploading…' : photoUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              <p className="text-[11px] text-slate-400 mt-2">JPG, PNG or WEBP · max 5MB</p>
              {photoError && <p className="text-[11.5px] text-red-600 font-medium mt-1" role="alert">{photoError}</p>}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="font-bold text-[#0F172A] mb-3">Quick Links</p>
              <Link to="/student/profile-wizard/1" className="block w-full text-center px-4 py-2.5 rounded-xl bg-sky-100 text-sky-700 font-semibold text-sm mb-2">Update your Profile</Link>
              <Link to="/student/profile-wizard/3" className="block w-full text-center px-4 py-2.5 rounded-xl bg-sky-100 text-sky-700 font-semibold text-sm mb-2">Update Certificates & Skills</Link>
              <Link to="/student/applications" className="block w-full text-center px-4 py-2.5 rounded-xl bg-sky-100 text-sky-700 font-semibold text-sm">My Applications</Link>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <form id="personal-info" onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-[#0F172A] mb-4">Personal Information</h3>
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} /></Field>
                <Field label="Email (Cannot Change)"><input value={email} disabled className={`${inputCls} bg-slate-50 text-slate-400`} /></Field>
                <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} /></Field>
                <Field label="College"><input value={form.college} onChange={update('college')} className={inputCls} /></Field>
                <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} /></Field>
                <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} /></Field>
              </div>
              <Field label="Profile Summary"><textarea rows={3} value={form.profile_summary} onChange={update('profile_summary')} className={inputCls} /></Field>
              <button type="submit" disabled={saving} className="mt-5 px-6 py-2.5 rounded-xl bg-[#0F172A] text-white font-bold text-sm disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>

            <form id="academic-info" onSubmit={handleSaveAcademic} className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-[#0F172A] mb-4">Academic Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-2">
                <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} /></Field>
                <Field label="Course"><input value={form.course} onChange={update('course')} className={inputCls} placeholder="e.g. B.Tech Computer Science" /></Field>
                <Field label="GPA / CGPA"><input value={form.gpa_cgpa} onChange={update('gpa_cgpa')} className={inputCls} placeholder="e.g. 8.5" /></Field>
                <Field label="College Address"><input value={form.college_address} onChange={update('college_address')} className={inputCls} /></Field>
              </div>
              <button type="submit" disabled={saving} className="mt-5 px-6 py-2.5 rounded-xl bg-[#0F172A] text-white font-bold text-sm disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Academic Info'}
              </button>
            </form>

            <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-[#0F172A] mb-4">Change Password</h3>
              {pwError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{pwError}</div>}
              {pwSuccess && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">{pwSuccess}</div>}
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Current Password"><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} required /></Field>
                <Field label="New Password"><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} required /></Field>
                <Field label="Confirm Password"><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} required /></Field>
              </div>
              <button type="submit" disabled={pwSaving} className="mt-5 px-6 py-2.5 rounded-xl bg-[#F59E0B] text-white font-bold text-sm disabled:opacity-60">
                {pwSaving ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
        )}
      </main>
    </>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default StudentSettings;
