import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import StudentSubTabs from '../../components/student/StudentSubTabs';

// Field groupings, matching the 3-step student wizard exactly.
const SECTION_1 = ['name', 'department', 'college', 'current_year', 'mobile_no', 'city', 'pincode', 'state', 'linkedin_url', 'profile_summary'];
const SECTION_2 = ['enrollment_no', 'college_address', 'course', 'gpa_cgpa'];

const LABELS = {
  name: 'Full Name', department: 'Department', college: 'College', current_year: 'Current Year',
  mobile_no: 'Mobile No', city: 'City', pincode: 'Pin Code', state: 'State',
  linkedin_url: 'LinkedIn URL', profile_summary: 'Profile Summary',
  enrollment_no: 'Enrollment No', college_address: 'College Address', course: 'Course', gpa_cgpa: 'GPA / CGPA',
};

function filled(v) {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && String(v).trim() !== '';
}

function StudentProfileOverview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAxios.get('/student/profile');
        const p = res.data.profile || res.data;
        // canonicalize CGPA so the checklist reads the real column
        p.gpa_cgpa = p.gpa_cgpa || p.gpa || p.cgpa || '';
        setProfile(p);
      } catch (err) {
        setError('Could not load your profile. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const section1 = SECTION_1.map((f) => ({ field: f, done: filled(profile?.[f]) }));
  const section2 = SECTION_2.map((f) => ({ field: f, done: filled(profile?.[f]) }));
  const hasSkills = (profile?.skills?.length || 0) > 0;
  const hasCerts = (profile?.certifications?.length || profile?.certificates?.length || 0) > 0;
  const section3 = [
    { field: 'skills', label: 'Skills', done: hasSkills },
    { field: 'certifications', label: 'Certificates', done: hasCerts },
  ];

  const doneCount = (sec) => sec.filter((f) => f.done).length;
  const complete = (sec) => doneCount(sec) === sec.length;
  const totalFields = SECTION_1.length + SECTION_2.length + 2;
  const totalDone = doneCount(section1) + doneCount(section2) + doneCount(section3);
  const pct = Math.round((totalDone / totalFields) * 100);

  return (
    <div className="student-scope min-h-screen bg-[#F8FAFC]">
      <StudentSubTabs />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Complete Your Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">Fill in each section so recruiters see your best self.</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${pct === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {pct}% complete
          </span>
        </div>

        {/* progress = the ember line */}
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-8" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? '#159957' : 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)' }}
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="pf-skeleton" style={{ width: 40, height: 40, borderRadius: 11, marginBottom: 14 }} />
                <div className="pf-skeleton" style={{ width: '55%', height: 15, marginBottom: 12 }} />
                <div className="pf-skeleton" style={{ width: '100%', height: 11, marginBottom: 7 }} />
                <div className="pf-skeleton" style={{ width: '80%', height: 11 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            <SectionCard
              n={1} icon="👤" title="Personal Details"
              desc="Your name, contact info, location and summary."
              items={section1} complete={complete(section1)}
              onOpen={() => navigate('/student/profile-wizard/1')}
            />
            <SectionCard
              n={2} icon="🎓" title="Academic Information"
              desc="Enrollment, course, CGPA and college details."
              items={section2} complete={complete(section2)}
              onOpen={() => navigate('/student/profile-wizard/2')}
            />
            <SectionCard
              n={3} icon="🏅" title="Skills & Certificates"
              desc="Showcase your skills and verified certificates."
              items={section3} complete={complete(section3)}
              onOpen={() => navigate('/student/profile-wizard/3')}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function SectionCard({ n, icon, title, desc, items, complete, onOpen }) {
  return (
    <div className="lp-tile bg-white rounded-2xl border border-slate-100 p-6 flex flex-col shadow-soft">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#cdddfb] flex items-center justify-center text-lg" aria-hidden="true">{icon}</span>
        <div>
          <p className="text-[10.5px] font-bold text-slate-400 tracking-[0.08em] uppercase">Section {n}</p>
          <h3 className="font-bold text-[#0F172A]" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{desc}</p>

      <div className="flex-1 mb-4 space-y-2">
        {items.map(({ field, label, done }) => (
          <p key={field} className={`text-sm flex items-center gap-2 ${done ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className={`font-bold ${done ? 'text-emerald-500' : 'text-slate-300'}`} aria-hidden="true">{done ? '✔' : '○'}</span>
            {label || LABELS[field] || field}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {complete ? '● Completed' : '● In Progress'}
        </span>
        <button onClick={onOpen} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 transition-colors">
          {complete ? 'Edit' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default StudentProfileOverview;
