import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiClock, FiArrowUpRight } from 'react-icons/fi';
import { fmtJobDate } from '../../utils/fields';

function CompanyLogo({ company }) {
  const [failed, setFailed] = useState(false);
  const slug = (company || '?').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (failed) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EEF4FF] to-[#F8FAFC] border border-[#cdddfb] flex items-center justify-center font-bold text-[#1D4ED8] text-lg" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
        {(company || '?').charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={`/images/companies/${slug}.png`}
      alt={`${company} logo`}
      onError={() => setFailed(true)}
      className="w-12 h-12 rounded-xl object-contain bg-[#F8FAFC] border border-slate-100 p-1.5"
    />
  );
}

// Note: "isLoggedIn" here always means a logged-in STUDENT — applying to a
// job is a student action, not a company one. A company being logged in is
// unrelated to whether this button should be gated.
function JobCard({ job }) {
  const navigate = useNavigate();
  const isStudentLoggedIn = !!sessionStorage.getItem('student_token');

  const company = job.company_name || job.company;
  const jobType = job.job_type || job.type;
  const stipend = job.salary_stipend || job.package;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="lp-tile group p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <CompanyLogo company={company} />
          <div>
            <h3
              className="font-bold text-[#0F172A] leading-tight cursor-pointer group-hover:text-[#1D4ED8] transition-colors"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              {job.title}
            </h3>
            <p className="text-sm text-slate-500">{company}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/jobs/${job.id}`)}
          aria-label={`Open ${job.title}`}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:text-[#1D4ED8] hover:border-[#cdddfb] transition-all flex-shrink-0"
        >
          <FiArrowUpRight size={15} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.location && (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 bg-[#F8FAFC] border border-slate-100 rounded-full px-2.5 py-1">
            <FiMapPin size={12} /> {job.location}
          </span>
        )}
        {jobType && (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#1D4ED8] bg-[#EEF4FF] border border-[#cdddfb] rounded-full px-2.5 py-1">
            <FiBriefcase size={12} /> {jobType}
          </span>
        )}
        {job.last_date_to_apply && (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            <FiClock size={12} /> Apply by {fmtJobDate(job.last_date_to_apply)}
          </span>
        )}
      </div>

      {stipend && (
        <p className="text-[15px] font-extrabold text-[#0F172A] mb-5 tabular-nums" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
          {stipend}
        </p>
      )}

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          View details
        </button>
        <div className="flex-1 relative">
          {isStudentLoggedIn ? (
            <button
              onClick={() => navigate(`/student/jobs/${job.id}/apply`)}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-sm hover:bg-[#1E293B] active:scale-95 transition-all"
            >
              Apply now
            </button>
          ) : (
            <>
              <button disabled className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-sm blur-[2px] select-none">
                Apply now
              </button>
              <button
                onClick={() => navigate('/student/login')}
                className="absolute inset-0 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-[#0F172A] border border-slate-200 text-center px-2 hover:bg-white/85 transition-colors"
              >
                Log in to apply
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default JobCard;
