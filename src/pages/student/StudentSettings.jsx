import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { useToast } from '../../context/ToastContext';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiCamera, FiAlertCircle, FiCheckCircle, FiUser, 
  FiAward, FiBriefcase, FiLock, FiBookOpen, FiShield 
} from 'react-icons/fi';

function StudentSettings() {
  const { showToast } = useToast();
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
        setPhotoUrl(p.profile_photo || p.profile_photo_url || p.photo_url || '');
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
      if ('gpa_cgpa' in payload) payload.gpa = payload.gpa_cgpa;
      await studentAxios.put('/student/profile', payload);
      setSuccess(okMsg);
      showToast(okMsg, 'success');
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

      {/* Global Animation Styles */}
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAFAFA] min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading settings...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 animate-entrance">
              
              {/* Profile Photo Card */}
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="px-6 pb-6 text-center relative -mt-12">
                  <div className="relative w-28 h-28 mx-auto group">
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-slate-300 overflow-hidden ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                      {photoSaving ? (
                        <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      ) : photoUrl ? (
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        (form.name || '?').charAt(0)
                      )}
                    </div>
                    
                    {/* Hover Overlay */}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoSaving}
                      className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-1 ring-4 ring-transparent group-hover:ring-white/20 z-10"
                    >
                      <FiCamera className="w-6 h-6" />
                      <span className="text-xs font-bold">{photoUrl ? 'Update' : 'Upload'}</span>
                    </button>

                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoFile} className="hidden" />
                  </div>
                  
                  <h2 className="mt-4 font-bold text-lg text-slate-900">{form.name || 'Student'}</h2>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">JPG, PNG, WEBP · Max 5MB</p>
                  
                  {photoError && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg">
                      <FiAlertCircle className="w-4 h-4" /> {photoError}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-indigo-500" /> Quick Links
                </h3>
                <div className="space-y-2">
                  <QuickLink to="/student/profile-overview" icon={<FiUser />} text="Update your Profile" />
                  <QuickLink to="/student/profile-wizard/3" icon={<FiAward />} text="Update Certificates & Skills" />
                  <QuickLink to="/student/applications" icon={<FiBookOpen />} text="My Applications" />
                </div>
              </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Personal Info Form */}
              <form id="personal-info" onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-entrance delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Personal Information</h3>
                </div>

                <StatusAlert error={error} success={success} />

                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} placeholder="John Doe" /></Field>
                  <Field label="Email Address"><input value={email} disabled className={`${inputCls} bg-slate-100 text-slate-500 border-slate-200/60 cursor-not-allowed hover:border-slate-200/60`} /></Field>
                  <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} placeholder="Engineering" /></Field>
                  <Field label="College"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="University Name" /></Field>
                  <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} placeholder="e.g. 3rd Year" /></Field>
                  <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} placeholder="+1 234 567 890" /></Field>
                </div>
                <Field label="Profile Summary">
                  <textarea rows={4} value={form.profile_summary} onChange={update('profile_summary')} className={`${inputCls} resize-none`} placeholder="Write a brief overview about yourself, your goals, and achievements..." />
                </Field>
                
                <div className="mt-6 flex justify-end">
                  <SaveButton loading={saving} text="Save Profile Info" />
                </div>
              </form>

              {/* Academic Info Form */}
              <form id="academic-info" onSubmit={handleSaveAcademic} className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-entrance delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                    <FiBookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Academic Information</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-2">
                  <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} placeholder="e.g. ENR2021001" /></Field>
                  <Field label="Course"><input value={form.course} onChange={update('course')} className={inputCls} placeholder="e.g. B.Tech Computer Science" /></Field>
                  <Field label="GPA / CGPA"><input value={form.gpa_cgpa} onChange={update('gpa_cgpa')} className={inputCls} placeholder="e.g. 8.5" /></Field>
                  <Field label="College Address"><input value={form.college_address} onChange={update('college_address')} className={inputCls} placeholder="City, State" /></Field>
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton loading={saving} text="Save Academic Info" />
                </div>
              </form>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-entrance delay-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900">Change Password</h3>
                </div>

                <StatusAlert error={pwError} success={pwSuccess} />

                <div className="grid sm:grid-cols-3 gap-5">
                  <Field label="Current Password">
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputCls} pl-10`} required placeholder="••••••••" />
                    </div>
                  </Field>
                  <Field label="New Password">
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputCls} pl-10`} required placeholder="••••••••" />
                    </div>
                  </Field>
                  <Field label="Confirm Password">
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputCls} pl-10`} required placeholder="••••••••" />
                    </div>
                  </Field>
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton loading={pwSaving} text="Update Password" colorClass="bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/20" />
                </div>
              </form>

            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* --- Reusable Premium UI Components --- */

const inputCls = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:border-slate-300";

function Field({ label, children }) {
  return (
    <div className="group flex flex-col">
      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveButton({ loading, text, colorClass = "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20" }) {
  return (
    <button 
      type="submit" 
      disabled={loading} 
      className={`px-8 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 ${colorClass}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Saving...
        </>
      ) : text}
    </button>
  );
}

function StatusAlert({ error, success }) {
  if (!error && !success) return null;
  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold mb-6 animate-entrance shadow-sm border ${
      error ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }`}>
      {error ? <FiAlertCircle className="w-5 h-5 flex-shrink-0" /> : <FiCheckCircle className="w-5 h-5 flex-shrink-0" />}
      <span>{error || success}</span>
    </div>
  );
}

function QuickLink({ to, icon, text }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-semibold text-sm transition-all duration-300 group border border-transparent hover:border-indigo-100"
    >
      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      {text}
    </Link>
  );
}

export default StudentSettings;