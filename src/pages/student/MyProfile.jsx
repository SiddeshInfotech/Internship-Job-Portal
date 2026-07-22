import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiLinkedin, 
  FiEdit3, 
  FiAward, 
  FiBookOpen, 
  FiUser, 
  FiExternalLink,
  FiCheckCircle,
  FiCamera
} from 'react-icons/fi';

function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAxios.get('/student/profile');
        setProfile(res.data.profile || res.data);
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* INJECTED ANIMATIONS & CUSTOM STYLES */}
      <style>{`
        @keyframes profileFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes spinFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-card {
          animation: profileFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.2s; }
        .pf-spinner {
          border: 3px solid rgba(245, 158, 11, 0.2);
          border-top-color: #F59E0B;
          border-radius: 50%;
          animation: spinFast 0.8s linear infinite;
        }
        .glass-panel {
          background: #ffffff;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
        }
      `}</style>

      <StudentSubTabs />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {error}
          </div>
        )}

        {loading && (
          <div className="py-28 flex flex-col items-center justify-center space-y-4">
            <div className="pf-spinner w-10 h-10"></div>
            <p className="text-slate-400 font-medium text-sm animate-pulse">Fetching profile details...</p>
          </div>
        )}

        {!loading && profile && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* LEFT SIDEBAR: Student Snapshot Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 h-fit sticky top-6 glass-panel anim-card">
              
              {/* Header Avatar & Name */}
              <div className="text-center mb-6">
                <ProfilePhotoUpload
                  profile={profile}
                  onUploaded={(url) => setProfile((prev) => ({ ...prev, profile_photo: url, photo_url: url }))}
                />
                <h2 className="font-extrabold text-xl text-[#0F172A] tracking-tight mt-1">{profile.name}</h2>
                <p className="text-xs font-semibold text-[#F59E0B] bg-amber-50 inline-block px-3 py-1 rounded-full mt-1.5 border border-amber-200/60">
                  {profile.branch || profile.department || 'Student'} {profile.current_year ? `• ${profile.current_year}` : ''}
                </p>
              </div>

              {/* Quick Contact Info */}
              <div className="space-y-3.5 border-t border-slate-100 pt-5">
                <InfoRow icon={<FiMail className="text-amber-500" />} value={profile.email} />
                <InfoRow icon={<FiPhone className="text-emerald-500" />} value={profile.mobile_no} />
                <InfoRow icon={<FiMapPin className="text-rose-500" />} value={[profile.city, profile.state].filter(Boolean).join(', ')} />
                <InfoRow 
                  icon={<FiLinkedin className="text-blue-600" />} 
                  value={profile.linkedin_url} 
                  isLink 
                />
              </div>

              {/* Academic Highlights */}
              {(profile.gpa_cgpa || profile.gpa || profile.cgpa || profile.college || profile.enrollment_no) && (
                <div className="mt-6 border-t border-slate-100 pt-5 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                    <FiBookOpen className="text-slate-400" /> Academic Snapshot
                  </p>
                  <SnapshotRow label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} highlight />
                  <SnapshotRow label="College" value={profile.college} />
                  <SnapshotRow label="Enrollment No" value={profile.enrollment_no} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Detailed View Cards */}
            <div className="md:col-span-2 space-y-6">
              
              {/* SECTION 1: Personal Details */}
              <SectionCard 
                title="Personal Information" 
                icon={<FiUser className="text-[#F59E0B]" />}
                onEdit={() => navigate('/student/profile-wizard/1')}
                animationClass="anim-card anim-delay-1"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReadField label="Full Name" value={profile.name} />
                  <ReadField label="Email Address" value={profile.email} />
                  <ReadField label="Department" value={profile.department} />
                  <ReadField label="College / University" value={profile.college} />
                  <ReadField label="Current Year" value={profile.current_year} />
                  <ReadField label="Mobile Number" value={profile.mobile_no} />
                </div>
                {profile.profile_summary && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <ReadField label="Profile Summary" value={profile.profile_summary} full />
                  </div>
                )}
              </SectionCard>

              {/* SECTION 2: Academic Details */}
              <SectionCard 
                title="Academic Background" 
                icon={<FiBookOpen className="text-[#F59E0B]" />}
                onEdit={() => navigate('/student/profile-wizard/2')}
                animationClass="anim-card anim-delay-2"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReadField label="Enrollment Number" value={profile.enrollment_no} />
                  <ReadField label="Degree / Course" value={profile.course} />
                  <ReadField label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} />
                  <ReadField label="Campus Address" value={profile.college_address} />
                </div>
              </SectionCard>

              {/* SECTION 3: Skills & Certifications */}
              <SectionCard 
                title="Skills & Certifications" 
                icon={<FiAward className="text-[#F59E0B]" />}
                onEdit={() => navigate('/student/profile-wizard/3')}
                animationClass="anim-card anim-delay-2"
              >
                {(!profile.skills || profile.skills.length === 0) && (!profile.certifications || profile.certifications.length === 0) ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">No skills or certifications added yet.</p>
                    <button 
                      onClick={() => navigate('/student/profile-wizard/3')} 
                      className="mt-3 px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      + Add Skills & Certifications
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Skills list */}
                    {profile.skills?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills & Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((s, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-amber-50 border border-slate-200/60 hover:border-amber-200 text-xs font-semibold text-slate-700 hover:text-amber-800 transition-all flex items-center gap-1.5"
                            >
                              <FiCheckCircle className="text-amber-500 text-xs" />
                              {s.skill_name || s.name} 
                              {s.level && <span className="text-[10px] font-normal text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">{s.level}</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications list */}
                    {profile.certifications?.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Certifications</p>
                        <div className="grid gap-2.5">
                          {profile.certifications.map((c, i) => (
                            <div key={i} className="flex justify-between items-center gap-3 text-sm p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-100/60 text-[#F59E0B]">
                                  <FiAward size={18} />
                                </div>
                                <div>
                                  <p className="font-bold text-[#0F172A] text-sm">{c.certificate_name}</p>
                                  <p className="text-xs text-slate-400">{c.issued_by || 'Independent Provider'}</p>
                                </div>
                              </div>
                              {c.file_url ? (
                                <a 
                                  href={c.file_url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs font-bold text-[#F59E0B] hover:text-amber-600 bg-white hover:bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
                                >
                                  View PDF <FiExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-slate-300 text-xs italic">No document attached</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SectionCard>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoRow({ icon, value, isLink }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium overflow-hidden">
      <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-base shrink-0">{icon}</span>
      {isLink ? (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noreferrer" 
          className="text-blue-600 hover:underline truncate"
        >
          {value.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      ) : (
        <span className="truncate">{value}</span>
      )}
    </div>
  );
}

function SnapshotRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm mb-2.5">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-bold ${highlight ? 'text-[#F59E0B] text-base bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100' : 'text-[#0F172A]'}`}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, onEdit, children, animationClass = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 glass-panel ${animationClass}`}>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-100/80 text-lg">
            {icon}
          </div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A]">{title}</h3>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#F59E0B] bg-slate-50 hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-amber-200 transition-all"
          >
            <FiEdit3 size={13} /> Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ReadField({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm font-semibold text-slate-700 bg-slate-50/70 rounded-xl px-3.5 py-2.5 border border-slate-100/80 break-words">
        {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
      </div>
    </div>
  );
}

/* Profile photo upload component with Cloudinary logic preserved */
function ProfilePhotoUpload({ profile, onUploaded }) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const inputRef = React.useRef(null);
  const photo = profile.profile_photo || profile.profile_photo_url || profile.photo_url;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      await studentAxios.post('/student/profile/photo', { photo_url: cloudinaryUrl });
      onUploaded(cloudinaryUrl);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong uploading your photo.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-3">
      <div className="relative w-28 h-28 mx-auto group">
        
        {/* Ring highlight container */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-1 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-extrabold text-slate-600 overflow-hidden relative">
            {photo ? (
              <img src={photo} alt={profile.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              (profile.name || '?').charAt(0).toUpperCase()
            )}
          </div>
        </div>

        {/* Hover overlay button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute inset-1 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[2px]"
        >
          <FiCamera className="text-lg" />
          <span>{photo ? 'Change' : 'Upload'}</span>
        </button>

        {/* Loading overlay spinner */}
        {uploading && (
          <div className="absolute inset-1 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="pf-spinner w-7 h-7" role="status" aria-label="Uploading photo" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="text-[11px] font-medium text-slate-400 mt-2">JPG, PNG or WEBP · Max 5MB</p>
      {error && <p className="text-xs text-red-600 font-semibold mt-1" role="alert">{error}</p>}
    </div>
  );
}

export default MyProfile;