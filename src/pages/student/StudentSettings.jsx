import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiUser, 
  FiAward, 
  FiBriefcase, 
  FiCamera, 
  FiSave,
  FiLock,
  FiEye,
  FiEyeOff,
  FiChevronRight,
  FiSettings
} from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* INJECTED ANIMATIONS & STYLES */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes iconPop {
          0% { transform: scale(0.5); opacity: 0.5; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
       
        .anim-fade-right {
          animation: fadeSlideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        .anim-icon-pop {
          animation: iconPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
       
        .card-shadow {
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
        }
        .hover-float {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-float:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.08);
        }
      `}</style>

      <StudentSubTabs />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Page Header */}
        <div className="mb-8 anim-fade-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] flex items-center gap-3">
            <FiSettings className="text-[#F59E0B]" /> Account Settings
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm sm:text-base">Manage your profile details, academic records, and account security.</p>
        </div>

        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center space-y-4">
            <div className="pf-spinner !border-[rgba(245,158,11,0.2)] !border-t-[#F59E0B] w-12 h-12"></div>
            <p className="text-slate-500 font-semibold text-sm animate-pulse tracking-wide">Fetching your preferences...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN: Avatar & Links */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Photo Upload Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center card-shadow hover-float anim-fade-up">
                <div className="relative w-32 h-32 mx-auto mb-6 group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#F59E0B] to-amber-200 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden relative text-4xl font-extrabold text-slate-400">
                      {photoSaving ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                          <div className="pf-spinner" style={{ width: 34, height: 34 }} />
                        </div>
                      ) : photoUrl ? (
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        (form.name || '?').charAt(0).toUpperCase()
                      )}
                      
                      {/* Hover Overlay */}
                      {!photoSaving && (
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer backdrop-blur-sm"
                        >
                          <FiCamera className="text-2xl mb-1" />
                          <span>Change Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
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
                  className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-white hover:border-amber-300 hover:text-amber-600 transition-all disabled:opacity-50 w-full flex items-center justify-center gap-2 shadow-sm"
                >
                  <FiCamera /> {photoSaving ? 'Uploading…' : photoUrl ? 'Update Avatar' : 'Upload Avatar'}
                </button>
                <p className="text-xs text-slate-400 mt-3 font-medium">JPG, PNG or WEBP · Max 5MB</p>
                {photoError && (
                  <p className="text-xs text-red-600 font-bold mt-3 flex items-center justify-center gap-1.5 bg-red-50 py-2 rounded-lg">
                    <FiAlertCircle size={14}/> {photoError}
                  </p>
                )}
              </div>

              {/* Quick Links Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 card-shadow hover-float anim-fade-up delay-100">
                <p className="font-extrabold text-[11px] text-slate-400 uppercase tracking-widest mb-4 pl-1">Navigation</p>
                <div className="space-y-2.5">
                  <Link to="/student/profile-overview" className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-slate-50/50 hover:bg-amber-50 border border-transparent hover:border-amber-100 text-slate-600 hover:text-amber-700 font-bold text-sm transition-all group">
                    <span className="flex items-center gap-3"><FiUser className="text-slate-400 group-hover:text-amber-500 text-lg transition-colors" /> update Profile</span>
                    <FiChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                  <Link to="/student/profile-wizard/3" className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-slate-50/50 hover:bg-amber-50 border border-transparent hover:border-amber-100 text-slate-600 hover:text-amber-700 font-bold text-sm transition-all group">
                    <span className="flex items-center gap-3"><FiAward className="text-slate-400 group-hover:text-amber-500 text-lg transition-colors" /> Manage Certificates</span>
                    <FiChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                  <Link to="/student/applications" className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-slate-50/50 hover:bg-amber-50 border border-transparent hover:border-amber-100 text-slate-600 hover:text-amber-700 font-bold text-sm transition-all group">
                    <span className="flex items-center gap-3"><FiBriefcase className="text-slate-400 group-hover:text-amber-500 text-lg transition-colors" /> My Applications</span>
                    <FiChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Forms */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Personal Info Form */}
              <form id="personal-info" onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 card-shadow hover-float anim-fade-up delay-100">
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-5">
                  <div className="p-3 rounded-2xl bg-amber-50 text-[#F59E0B] shadow-inner"><FiUser size={20} /></div>
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-lg">Personal Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Update your basic details and contact information.</p>
                  </div>
                </div>
                
                <Alert type="error" message={error} />
                <Alert type="success" message={success} />
                
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Full Name"><input value={form.name} onChange={update('name')} className={inputCls} placeholder="e.g. John Doe" /></Field>
                  <Field label="Email Address"><input value={email} disabled className={`${inputCls} bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70`} /></Field>
                  <Field label="Department"><input value={form.department} onChange={update('department')} className={inputCls} placeholder="e.g. Computer Science" /></Field>
                  <Field label="College / University"><input value={form.college} onChange={update('college')} className={inputCls} placeholder="e.g. MIT" /></Field>
                  <Field label="Current Year"><input value={form.current_year} onChange={update('current_year')} className={inputCls} placeholder="e.g. 3rd Year" /></Field>
                  <Field label="Mobile No."><input value={form.mobile_no} onChange={update('mobile_no')} className={inputCls} placeholder="e.g. +91 9876543210" /></Field>
                </div>
                <Field label="Profile Summary">
                  <textarea rows={3} value={form.profile_summary} onChange={update('profile_summary')} className={`${inputCls} resize-none`} placeholder="Briefly describe your goals, skills, and aspirations..." />
                </Field>
                
                <div className="mt-7 flex justify-end pt-5 border-t border-slate-100">
                  <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm disabled:opacity-60 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    {saving ? <div className="pf-spinner !border-t-white w-4 h-4"></div> : <FiSave size={16} />} 
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>

              {/* Academic Info Form */}
              <form id="academic-info" onSubmit={handleSaveAcademic} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 card-shadow hover-float anim-fade-up delay-200">
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-5">
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-500 shadow-inner"><FiAward size={20} /></div>
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-lg">Academic Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Ensure your enrollment and grade details are accurate.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Enrollment No"><input value={form.enrollment_no} onChange={update('enrollment_no')} className={inputCls} placeholder="e.g. 123456789" /></Field>
                  <Field label="Course / Degree"><input value={form.course} onChange={update('course')} className={inputCls} placeholder="e.g. B.Tech IT" /></Field>
                  <Field label="GPA / CGPA"><input value={form.gpa_cgpa} onChange={update('gpa_cgpa')} className={inputCls} placeholder="e.g. 8.5" /></Field>
                  <Field label="Campus Address"><input value={form.college_address} onChange={update('college_address')} className={inputCls} placeholder="Full address of institution" /></Field>
                </div>
                
                <div className="mt-7 flex justify-end pt-5 border-t border-slate-100">
                  <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm disabled:opacity-60 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    {saving ? <div className="pf-spinner !border-t-white w-4 h-4"></div> : <FiSave size={16} />} 
                    {saving ? 'Saving...' : 'Save Academic Info'}
                  </button>
                </div>
              </form>

              {/* Password Form */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 card-shadow hover-float anim-fade-up delay-300">
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-5">
                  <div className="p-3 rounded-2xl bg-red-50 text-red-500 shadow-inner"><FiLock size={20} /></div>
                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-lg">Security & Password</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Protect your account with a strong password.</p>
                  </div>
                </div>

                <Alert type="error" message={pwError} />
                <Alert type="success" message={pwSuccess} />
                
                <div className="grid sm:grid-cols-3 gap-5">
                  <PasswordField label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  <PasswordField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <PasswordField label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className="mt-7 flex justify-end pt-5 border-t border-slate-100">
                  <button type="submit" disabled={pwSaving} className="px-8 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-sm disabled:opacity-60 transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 flex items-center gap-2">
                    {pwSaving ? <div className="pf-spinner !border-t-white w-4 h-4"></div> : <FiLock size={15} />} 
                    {pwSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS --- //

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#F59E0B] focus:ring-4 focus:ring-amber-50 focus:shadow-sm text-slate-700 placeholder:text-slate-400";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">{label}</label>
      {children}
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">{label}</label>
      <div className="relative group/input">
        <input 
          type={show ? "text" : "password"}
          value={value} 
          onChange={onChange}
          placeholder="••••••••" 
          required 
          className={`${inputCls} pr-12`} 
        />
        
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          title={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#F59E0B] hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors duration-200"
          tabIndex="-1"
        >
          <div key={show ? 'visible' : 'hidden'} className="anim-icon-pop flex items-center justify-center w-full h-full">
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </div>
        </button>
      </div>
    </div>
  );
}

function Alert({ type, message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className={`mb-6 text-sm px-4 py-3.5 rounded-xl border-l-4 flex items-center gap-3 font-semibold shadow-sm
      ${isError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-emerald-50 border-emerald-500 text-emerald-700'}`}
    >
      {isError ? <FiAlertCircle size={18} className="text-red-500 shrink-0" /> : <FiCheckCircle size={18} className="text-emerald-500 shrink-0" />}
      {message}
    </div>
  );
}

export default StudentSettings;