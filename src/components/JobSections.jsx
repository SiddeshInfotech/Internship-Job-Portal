import React from 'react';

/* Consistent rendering of a job's long-form content (description,
   eligibility, skills) so the landing site, student portal, admin and
   company views all present them identically and aligned. */

export function JobSection({ title, children, last = false }) {
  return (
    <section className={last ? '' : 'mb-7 pb-7 border-b border-slate-100'}>
      <h3
        className="font-bold text-[#0F172A] mb-3 pl-3 border-l-[3px] border-[#F59E0B] leading-tight"
        style={{ fontFamily: 'Sora, Inter, sans-serif' }}
      >
        {title}
      </h3>
      <div className="pl-3">{children}</div>
    </section>
  );
}

export function toSkillList(skills) {
  if (!skills) return [];
  const arr = Array.isArray(skills) ? skills : String(skills).split(',');
  return arr
    .map((s) => (typeof s === 'string' ? s : s?.name || s?.skill_name || ''))
    .map((s) => String(s).trim())
    .filter(Boolean);
}

export function SkillChips({ skills }) {
  const list = toSkillList(skills);
  if (!list.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((s, i) => (
        <span key={i} className="px-3 py-1.5 rounded-full bg-[#EEF4FF] border border-[#cdddfb] text-sm font-semibold text-[#1D4ED8]">
          {s}
        </span>
      ))}
    </div>
  );
}

/* The full body: same order + spacing everywhere. */
export function JobBody({ job }) {
  const skills = toSkillList(job.required_skills || job.skills);
  return (
    <>
      {job.description && (
        <JobSection title="About the Role">
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </JobSection>
      )}
      {job.eligibility_criteria && (
        <JobSection title="Eligibility Criteria">
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.eligibility_criteria}</p>
        </JobSection>
      )}
      {skills.length > 0 && (
        <JobSection title="Required Skills" last>
          <SkillChips skills={skills} />
        </JobSection>
      )}
    </>
  );
}

export default JobBody;
