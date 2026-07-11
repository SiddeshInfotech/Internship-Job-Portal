import React, { useState } from 'react';

const BrowseJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated Job Data based on the screenshots
  const jobs = [
    {
      id: 1,
      title: 'Senior Product Design Intern',
      company: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&q=80',
      stipend: '$4,500/mo',
      tags: ['UI/UX', 'Summer 2024', 'FinTech'],
      location: 'San Francisco, CA (Remote)',
      deadline: 'Apply by Oct 24'
    },
    {
      id: 2,
      title: 'Frontend Engineering Fellow',
      company: 'Vercel',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&q=80',
      stipend: '$5,200/mo',
      tags: ['React', 'Next.js', 'Full-time'],
      location: 'New York, NY',
      deadline: 'Apply by Oct 24'
    },
    {
      id: 3,
      title: 'Data Science Research Associate',
      company: 'DeepMind',
      logo: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=100&h=100&fit=crop&q=80',
      stipend: '£3,800/mo',
      tags: ['Python', 'Machine Learning', 'Research'],
      location: 'London, UK',
      deadline: 'Apply by Oct 24'
    },
    {
      id: 4,
      title: 'Growth Marketing Specialist',
      company: 'Airbnb',
      logo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop&q=80',
      stipend: '$3,200/mo',
      tags: ['Marketing', 'Analytics', 'Immediate'],
      location: 'Remote (Global)',
      deadline: 'Apply by Oct 24'
    },
    {
      id: 5,
      title: 'Backend Systems Architect',
      company: 'Palantir',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop&q=80',
      stipend: '$6,000/mo',
      tags: ['Go', 'Kubernetes', 'Security'],
      location: 'Washington, D.C.',
      deadline: 'Apply by Oct 24'
    },
    {
      id: 6,
      title: 'User Research Intern',
      company: 'Figma',
      logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&q=80',
      stipend: '$4,000/mo',
      tags: ['UX Research', 'Design', 'Part-time'],
      location: 'San Francisco, CA',
      deadline: 'Apply by Oct 24'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800 font-sans antialiased">
      
      {/* Global Animation Styles */}
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes staggerUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
          .stagger-1 { animation: staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .stagger-2 { animation: staggerUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.1s; opacity: 0; }
          .stagger-3 { animation: staggerUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.2s; opacity: 0; }
          
          /* Custom Checkbox Styling */
          .custom-checkbox {
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #e5e7eb;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            position: relative;
          }
          .custom-checkbox:checked {
            background-color: #1155cc;
            border-color: #1155cc;
          }
          .custom-checkbox:checked::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}
      </style>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Main Links */}
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-8 h-8 bg-[#1155cc] rounded-lg flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 shadow-md shadow-blue-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1155cc]">
                Placify
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-gray-500">
              <a href="/browsejobs" className="text-[#1155cc]">Browse Jobs</a>
              <a href="/myapplications" className="hover:text-gray-800 transition-colors">My Applications</a>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.03 6.03 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer group">
              <span className="text-[14px] font-semibold text-gray-700 group-hover:text-black transition-colors">Alex Rivera</span>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Sort Bar */}
      <div className="bg-white border-b border-gray-200 animate-fade-in-down">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1155cc] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by role, company, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#1155cc] focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-gray-500">Sort by:</span>
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[14px] font-medium text-gray-700 outline-none focus:border-[#1155cc] cursor-pointer min-w-[160px]">
              <option>Relevance</option>
              <option>Most Recent</option>
              <option>Highest Stipend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar - Filters */}
        <aside className="lg:col-span-3 space-y-8 stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              <h2 className="text-xl font-bold font-serif tracking-tight">Filters</h2>
            </div>
            <button className="text-[13px] font-bold text-[#1155cc] hover:underline">Clear All</button>
          </div>

          {/* Filter Categories */}
          {[
            { 
              title: "WORK ARRANGEMENT", 
              options: [{ label: "Remote", count: 124, checked: true }, { label: "On-site", count: 86 }, { label: "Hybrid", count: 42 }]
            },
            { 
              title: "STIPEND RANGE (MONTHLY)", 
              options: [{ label: "$0 - $1,000" }, { label: "$1,000 - $3,000" }, { label: "$3,000 - $5,000" }, { label: "$5,000+" }]
            },
            { 
              title: "INTERNSHIP DURATION", 
              options: [{ label: "1-3 Months" }, { label: "3-6 Months" }, { label: "6+ Months" }]
            },
            { 
              title: "EXPERIENCE LEVEL", 
              options: [{ label: "Undergraduate" }, { label: "Post-Graduate" }, { label: "Doctorate" }]
            }
          ].map((category, idx) => (
            <div key={idx}>
              <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">{category.title}</h3>
              <div className="space-y-3.5">
                {category.options.map((opt, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked={opt.checked} className="custom-checkbox" />
                      <span className="text-[14.5px] font-medium text-gray-700 group-hover:text-black transition-colors">{opt.label}</span>
                    </div>
                    {opt.count && <span className="text-[12px] font-medium text-gray-400">{opt.count}</span>}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Blue Promo Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mt-6 transition-transform hover:-translate-y-1 hover:shadow-sm duration-300">
            <p className="text-[13px] font-medium text-[#1155cc] mb-3 leading-relaxed">
              Want better matches? Complete your profile to get personalized recommendations.
            </p>
            <button className="text-[13px] font-bold text-[#1155cc] hover:underline flex items-center gap-1">
              Go to Profile <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </aside>

        {/* Right Content - Job Listings */}
        <section className="lg:col-span-9">
          
          {/* Results Header & Active Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 stagger-2 gap-4">
            <h1 className="text-[22px] font-bold text-gray-800 font-serif">
              Showing <span className="text-[#1155cc]">2,482</span> Internship Opportunities
            </h1>
            
            <div className="flex items-center gap-2">
              {['Product Design', 'Remote'].map((chip, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[12px] font-semibold text-gray-600 border border-gray-200">
                  {chip}
                  <button className="hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                
                {/* Card Top: Logo & Title */}
                <div className="flex gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
                    <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-[17px] text-gray-800 leading-tight">{job.title}</h3>
                      <div className="text-right flex-shrink-0">
                        <span className="block font-bold text-[#1155cc] text-[15px]">{job.stipend}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <span className="text-[14px] font-medium">{job.company}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-[12px] font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Location & Time */}
                <div className="flex items-center gap-4 text-[13px] font-medium text-gray-500 mb-6 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {job.deadline}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-xl border-2 border-gray-100 text-[14px] font-bold text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-colors active:scale-95">
                    View Details
                  </button>
                  <button className="py-2.5 rounded-xl bg-[#1155cc] text-white text-[14px] font-bold hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all active:scale-95">
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm stagger-3">
            <span className="text-[14px] font-medium text-gray-500 mb-4 sm:mb-0">
              Showing <span className="font-bold text-gray-800">1-6</span> of 2,482 results
            </span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1155cc] text-white font-bold text-[13px] shadow-sm shadow-blue-500/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">24</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200 py-8 text-sm text-gray-400">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#1155cc] rounded flex items-center justify-center text-white text-[10px] font-bold">P</div>
            <span>© 2026 Placify. All academic rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-[13px] text-gray-400">
            <a href="#privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#help" className="hover:text-gray-700 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrowseJobs;