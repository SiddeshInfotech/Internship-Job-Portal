import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { 
  FiMail, FiPhone, FiMapPin, FiLinkedin, 
  FiUser, FiBookOpen, FiBriefcase, FiAward, 
  FiExternalLink, FiCamera, FiAlertCircle 
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
    <>
      <StudentSubTabs />
      
      {/* Custom Animations injected safely */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-entrance {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAFAFA] min-h-screen">
        
        {/* Error State */}
        {error && (
          <div className="animate-entrance flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 shadow-sm">
            <FiAlertCircle className="w-5 h-5 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading your premium profile...</p>
          </div>
        )}

        {!loading && profile && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Snapshot card (Sticky) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 animate-entrance">
              <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                
                {/* Gradient Banner */}
                <div className="h-32 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-600 relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                </div>

                <div className="px-8 pb-8 relative -mt-16 text-center">
                  <ProfilePhotoUpload
                    profile={profile}
                    onUploaded={(url) => setProfile((prev) => ({ ...prev, profile_photo: url, photo_url: url }))}
                  />
                  
                  <div className="mt-4 mb-6">
                    <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">{profile.name}</h2>
                    <p className="text-sm font-medium text-blue-600 mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">
                      {profile.branch} {profile.current_year ? `· ${profile.current_year}` : ''}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 pt-6 text-left">
                    <InfoRow icon={<FiMail />} value={profile.email} />
                    <InfoRow icon={<FiPhone />} value={profile.mobile_no} />
                    <InfoRow icon={<FiMapPin />} value={[profile.city, profile.state].filter(Boolean).join(', ')} />
                    <InfoRow icon={<FiLinkedin />} value={profile.linkedin_url} isLink />
                  </div>

                  {(profile.gpa_cgpa || profile.gpa || profile.cgpa) && (
                    <div className="mt-6 border-t border-slate-100 pt-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-left">Academic Snapshot</p>
                      <div className="space-y-3">
                        <SnapshotRow label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} highlight />
                        <SnapshotRow label="College" value={profile.college} />
                        <SnapshotRow label="Enrollment No" value={profile.enrollment_no} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Read-only detail sections */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="animate-entrance delay-100">
                <SectionCard title="Personal Information" icon={<FiUser className="text-blue-600" />}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ReadField label="Full Name" value={profile.name} />
                    <ReadField label="Email" value={profile.email} />
                    <ReadField label="Department" value={profile.department} />
                    <ReadField label="College" value={profile.college} />
                    <ReadField label="Current Year" value={profile.current_year} />
                    <ReadField label="Mobile No" value={profile.mobile_no} />
                  </div>
                  {profile.profile_summary && (
                    <div className="mt-4">
                      <ReadField label="Profile Summary" value={profile.profile_summary} full />
                    </div>
                  )}
                </SectionCard>
              </div>

              <div className="animate-entrance delay-200">
                <SectionCard title="Academic Information" icon={<FiBookOpen className="text-blue-500" />}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ReadField label="Enrollment No" value={profile.enrollment_no} />
                    <ReadField label="Course" value={profile.course} />
                    <ReadField label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} />
                    <ReadField label="College Address" value={profile.college_address} />
                  </div>
                </SectionCard>
              </div>

              {(profile.experiences?.length > 0 || profile.job_designation || profile.experience_level === 'Experienced') && (
                <div className="animate-entrance delay-300">
                  <SectionCard title="Work Experience" icon={<FiBriefcase className="text-blue-600" />}>
                    {(profile.experiences?.length > 0 || profile.job_designation) ? (
                      <div className="space-y-4">
                        {(profile.experiences?.length > 0
                          ? profile.experiences
                          : [{ job_designation: profile.job_designation, company: profile.experience_company, duration: profile.experience_duration, years: profile.years_of_experience }]
                        ).map((exp, i) => (
                          <div key={i} className="group relative pl-6 py-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-all duration-300">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="font-bold text-slate-800 text-base">{exp.job_designation || 'Role'}</h4>
                            {exp.company && <p className="text-sm font-medium text-blue-600 mt-1">{exp.company}</p>}
                            {exp.duration && (
                              <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-2">
                                <span className="bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">{exp.duration}</span>
                                {exp.years && <span className="text-slate-400">• {exp.years} yrs</span>}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <p className="text-sm font-medium text-slate-500">Marked as experienced.</p>
                        <p className="text-xs text-slate-400 mt-1">Add role details in the profile wizard to showcase your work.</p>
                      </div>
                    )}
                  </SectionCard>
                </div>
              )}

              <div className="animate-entrance delay-300">
                <SectionCard title="Skills & Certificates" icon={<FiAward className="text-amber-500" />}>
                  {(!profile.skills || profile.skills.length === 0) && (!profile.certifications || profile.certifications.length === 0) ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 transition-colors hover:border-blue-400">
                      <FiAward className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 font-medium mb-2">Stand out to recruiters by adding your expertise.</p>
                      <button onClick={() => navigate('/student/profile-wizard/3')} className="text-blue-600 font-bold text-sm hover:text-blue-700 hover:underline transition-all">
                        + Add Skills & Certifications
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {profile.skills?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Skills</h4>
                          <div className="flex flex-wrap gap-2.5">
                            {profile.skills.map((s, i) => (
                              <span key={i} className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                                {s.skill_name || s.name} {s.level ? <span className="text-blue-600 ml-1 opacity-75">· {s.level}</span> : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {profile.certifications?.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Certifications</h4>
                          <div className="grid gap-3">
                            {profile.certifications.map((c, i) => (
                              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
                                <div>
                                  <span className="block font-bold text-slate-800">{c.certificate_name}</span>
                                  <span className="text-xs font-medium text-slate-500 mt-1 block">{c.issued_by}</span>
                                </div>
                                {c.file_url && (
                                  <a href={c.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-colors">
                                    View PDF <FiExternalLink />
                                  </a>
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
          </div>
        )}
      </main>
    </>
  );
}

// Sub-components re-styled for premium SaaS look

function InfoRow({ icon, value, isLink }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      {isLink ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-blue-600 truncate transition-colors">
          {value.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-600 truncate">{value}</span>
      )}
    </div>
  );
}

function SnapshotRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-bold ${highlight ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md' : 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
          {icon}
        </div>
        <h3 className="font-extrabold text-xl text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ReadField({ label, value, full }) {
  return (
    <div className={`p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-colors ${full ? 'sm:col-span-2' : ''}`}>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">{value || '—'}</p>
    </div>
  );
}

/* Profile photo with direct-to-Cloudinary upload (unsigned preset).
   On success the Cloudinary URL is saved to our backend, which then
   serves it to companies and admin automatically as `profile_photo`. */
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
    <div className="mb-2 relative inline-block">
      <div className="relative w-32 h-32 mx-auto group">
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-slate-300 overflow-hidden ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
          {photo
            ? <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
            : (profile.name || '?').charAt(0)}
        </div>

        {/* Hover overlay + camera button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-1 z-10 ring-4 ring-transparent group-hover:ring-white/20"
        >
          <FiCamera className="w-6 h-6 mb-0.5 shadow-sm" />
          <span className="text-xs font-bold tracking-wide shadow-sm">{photo ? 'Update' : 'Upload'}</span>
        </button>

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-1"></div>
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
      
      {error && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-sm z-30">
          {error}
        </div>
      )}
    </div>
  );
}

export default MyProfile;
