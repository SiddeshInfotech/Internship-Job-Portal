import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentAxios from '../../api/studentAxios';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiBriefcase,
  FiAlertCircle
} from 'react-icons/fi';
import { fmtJobDate } from '../../utils/fields';
import JobBody from '../../components/JobSections';
import { fmtMoney } from '../../utils/fields';

// --- Premium Skeleton Components ---
const JobHeaderSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse mb-8 relative overflow-hidden">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-5 w-full">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 shrink-0"></div>
        <div className="space-y-3 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-5 bg-gray-100 rounded-md w-1/2"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-7 w-20 bg-gray-100 rounded-full"></div>
            <div className="h-7 w-24 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto">
        <div className="h-12 w-full md:w-36 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const JobContentSkeleton = () => (
  <div className="grid lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded-md mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded-md mt-10 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded-md w-full"></div>
          <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-fit animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded-md mb-6"></div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-100 rounded-md"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-100 rounded-md"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await studentAxios.get(`/student/jobs/${id}`);
        setJob(res.data.job || res.data);
      } catch (err) {
        setError(err.response?.status === 404
          ? 'This position could not be found — it may no longer be accepting applications.'
          : 'Could not load this job. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Subtle Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none"></div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Navigation */}
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Link 
            to="/student/browse-jobs" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 bg-white/50 hover:bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
          >
            <FiArrowLeft size={16} /> 
            Back to Opportunities
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-6 py-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm animate-in fade-in zoom-in-95">
            <FiAlertCircle className="mt-0.5 flex-shrink-0 text-red-500" size={20} />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-4">
            <JobHeaderSkeleton />
            <JobContentSkeleton />
          </div>
        )}

        {/* Success State */}
        {!loading && job && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Hero Header Card */}
            <div className="relative bg-[#0F172A] rounded-[2rem] p-8 md:p-10 mb-8 overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Company Logo/Initial */}
                  <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center font-extrabold text-3xl text-slate-900 flex-shrink-0 shadow-lg ring-4 ring-white/10">
                    {(job.company_name || job.company || '?').charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Title and Meta */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-slate-300 font-medium mb-4">
                      <span className="text-white bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/5">
                        {job.company_name || job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiMapPin className="text-slate-400" /> {job.location || 'Remote'}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2.5">
                      <Badge icon={<FiBriefcase />} text={job.job_type} />
                      <Badge icon={<span style={{fontWeight:800}}>₹</span>} text={fmtMoney(job.salary_stipend)} />
                      {job.last_date_to_apply && (
                        <Badge 
                          icon={<FiCalendar />} 
                          text={`Ends ${fmtJobDate(job.last_date_to_apply)}`} 
                          variant="warning" 
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="w-full lg:w-auto shrink-0">
                  <button 
                    onClick={() => navigate(`/student/jobs/${id}/apply`)} 
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-bold whitespace-nowrap shadow-lg hover:shadow-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    Apply for this role
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Job Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 md:p-10 shadow-sm leading-relaxed text-slate-600 prose prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 max-w-none">
                  {/* JobBody typically contains HTML injected content or specialized sections */}
                  <JobBody job={job} />
                </div>
              </div>

              {/* Right Column: Sticky Sidebar */}
              <div className="sticky top-8 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm">
                  <h4 className="font-extrabold text-slate-900 text-lg mb-6 pb-4 border-b border-slate-100">
                    Overview
                  </h4>
                  <div className="space-y-6">
                    <SummaryRow 
                      icon={<FiCalendar className="text-blue-600" size={20} />} 
                      label="Application Deadline" 
                      value={job.last_date_to_apply ? fmtJobDate(job.last_date_to_apply) : 'Ongoing'} 
                    />
                    <SummaryRow 
                      icon={<FiClock className="text-emerald-500" size={20} />} 
                      label="Employment Type" 
                      value={job.job_type || 'Not specified'} 
                    />
                    <SummaryRow 
                      icon={<FiMapPin className="text-amber-500" size={20} />} 
                      label="Location" 
                      value={job.location || 'Remote'} 
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => navigate(`/student/jobs/${id}/apply`)} 
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:shadow-blue-600/25 transition-all active:scale-95"
                    >
                      Apply Now
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                      Takes ~3 minutes to apply
                    </p>
                  </div>
                </div>

                {/* Additional Info Card (Optional Visual Polish) */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem] border border-slate-200 p-8 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                    <FiAlertCircle size={24} />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2">Need Help?</h5>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Ensure your profile is complete before applying to increase your chances of getting shortlisted.
                  </p>
                  <Link 
                    to="/student/profile" 
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Update Profile →
                  </Link>
                </div>

              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}

// --- Helper Components ---

function Badge({ icon, text, variant = 'default' }) {
  if (!text) return null;
  
  const styles = {
    default: 'bg-white/10 text-slate-200 border border-white/10',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/20'
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${styles[variant]}`}>
      {icon}
      {text}
    </span>
  );
}

function SummaryRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export default JobDetail;
