import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import StudentSubTabs from '../../components/student/StudentSubTabs';
import { FiMail, FiPhone, FiMapPin, FiLinkedin } from 'react-icons/fi';

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
      <main className="max-w-6xl mx-auto px-6 py-6">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {loading && <div className="py-20 text-center text-slate-400">Loading profile...</div>}

        {!loading && profile && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* LEFT: Snapshot card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
              <div className="text-center mb-5">
                <ProfilePhotoUpload
                  profile={profile}
                  onUploaded={(url) => setProfile((prev) => ({ ...prev, profile_photo: url, photo_url: url }))}
                />
                <h2 className="font-extrabold text-lg text-[#0F172A]">{profile.name}</h2>
                <p className="text-sm text-slate-500">{profile.branch} {profile.current_year ? `· ${profile.current_year}` : ''}</p>
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <InfoRow icon={<FiMail />} value={profile.email} />
                <InfoRow icon={<FiPhone />} value={profile.mobile_no} />
                <InfoRow icon={<FiMapPin />} value={[profile.city, profile.state].filter(Boolean).join(', ')} />
                <InfoRow icon={<FiLinkedin />} value={profile.linkedin_url} />
              </div>

              {(profile.gpa_cgpa || profile.gpa || profile.cgpa) && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Academic Snapshot</p>
                  <SnapshotRow label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} />
                  <SnapshotRow label="College" value={profile.college} />
                  <SnapshotRow label="Enrollment No" value={profile.enrollment_no} />
                </div>
              )}
            </div>

            {/* RIGHT: Read-only detail sections */}
            <div className="md:col-span-2 space-y-6">
              <SectionCard title="Personal Information — View Only">
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReadField label="Full Name" value={profile.name} />
                  <ReadField label="Email" value={profile.email} />
                  <ReadField label="Department" value={profile.department} />
                  <ReadField label="College" value={profile.college} />
                  <ReadField label="Current Year" value={profile.current_year} />
                  <ReadField label="Mobile No" value={profile.mobile_no} />
                </div>
                {profile.profile_summary && <ReadField label="Profile Summary" value={profile.profile_summary} full />}
              </SectionCard>

              <SectionCard title="Academic Information — View Only">
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReadField label="Enrollment No" value={profile.enrollment_no} />
                  <ReadField label="Course" value={profile.course} />
                  <ReadField label="GPA / CGPA" value={profile.gpa_cgpa || profile.gpa || profile.cgpa} />
                  <ReadField label="College Address" value={profile.college_address} />
                </div>
              </SectionCard>

              <SectionCard title="Skills & Certificates — View Only">
                {(!profile.skills || profile.skills.length === 0) && (!profile.certifications || profile.certifications.length === 0) ? (
                  <p className="text-sm text-slate-400">
                    Nothing added yet. <button onClick={() => navigate('/student/profile-wizard/3')} className="text-[#F59E0B] font-semibold">Add skills & certifications</button>
                  </p>
                ) : (
                  <>
                    {profile.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700">{s.skill_name || s.name} {s.level ? `· ${s.level}` : ''}</span>
                        ))}
                      </div>
                    )}
                    {profile.certifications?.length > 0 && (
                      <div className="space-y-2">
                        {profile.certifications.map((c, i) => (
                          <div key={i} className="flex justify-between items-center gap-3 text-sm border-b border-slate-50 pb-2">
                            <span className="font-medium text-[#0F172A]">{c.certificate_name}</span>
                            <span className="text-slate-500">{c.issued_by}</span>
                            {c.file_url && <a href={c.file_url} target="_blank" rel="noreferrer" className="text-[#F59E0B] font-semibold text-xs flex-shrink-0">View PDF</a>}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </SectionCard>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function InfoRow({ icon, value }) {
  if (!value) return null;
  return <p className="flex items-center gap-2 text-sm text-slate-600"><span className="text-slate-400">{icon}</span>{value}</p>;
}
function SnapshotRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}
function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-bold text-[#0F172A] mb-4">{title}</h3>
      {children}
    </div>
  );
}
function ReadField({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2 mt-2' : ''}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{value || '—'}</p>
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
    <div className="mb-4">
      <div className="relative w-24 h-24 mx-auto group">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 overflow-hidden ring-2 ring-white shadow-md">
          {photo
            ? <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
            : (profile.name || '?').charAt(0)}
        </div>

        {/* hover overlay + camera button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-0.5"
        >
          <span aria-hidden="true" className="text-base">📷</span>
          {photo ? 'Change' : 'Upload'}
        </button>

        {uploading && (
          <div className="absolute inset-0 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="pf-spinner" style={{ width: 26, height: 26 }} role="status" aria-label="Uploading photo" />
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
      <p className="text-[11px] text-slate-400 mt-2">JPG, PNG or WEBP · max 5MB</p>
      {error && <p className="text-[11.5px] text-red-600 font-medium mt-1" role="alert">{error}</p>}
    </div>
  );
}

export default MyProfile;
