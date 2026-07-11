import React, { useState } from 'react';

const MyApplications = () => {
  // We set the first application (ID: 1) to be expanded by default to match your screenshot
  const [expandedId, setExpandedId] = useState(1);

  const applications = [
    {
      id: 1,
      role: 'UX Design Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      date: 'Sept 12, 2023',
      status: 'Shortlisted',
      step: 3,
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&q=80',
    },
    {
      id: 2,
      role: 'Software Engineering Fellow',
      company: 'Microsoft',
      location: 'Redmond, WA',
      date: 'Aug 28, 2023',
      status: 'In Review',
      step: 2,
      logo: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=100&h=100&fit=crop&q=80',
    },
    {
      id: 3,
      role: 'Product Management Trainee',
      company: 'Adobe',
      location: 'San Jose, CA',
      date: 'Sept 05, 2023',
      status: 'Offered',
      step: 5,
      logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop&q=80',
    },
    {
      id: 4,
      role: 'Frontend Developer (Remote)',
      company: 'Vercel',
      location: 'New York, NY',
      date: 'Sept 01, 2023',
      status: 'Rejected',
      step: 0,
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&q=80',
    },
    {
      id: 5,
      role: 'Data Analyst Intern',
      company: 'Tesla',
      location: 'Austin, TX',
      date: 'Sept 15, 2023',
      status: 'In Review',
      step: 2,
      logo: 'https://images.unsplash.com/photo-1617783920364-77e8a937a775?w=100&h=100&fit=crop&q=80',
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper functions for dynamic styling based on application status
  const getCardStyles = (status) => {
    switch (status) {
      case 'Shortlisted': return 'border-amber-500 shadow-amber-500/10';
      case 'In Review': return 'border-blue-600 shadow-blue-600/10';
      case 'Rejected': return 'border-red-600 shadow-red-600/10';
      case 'Offered': return 'border-gray-200 shadow-gray-200/50';
      default: return 'border-gray-200';
    }
  };

  const getBadgeStyles = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-amber-500 text-white';
      case 'In Review': return 'bg-blue-600 text-white';
      case 'Rejected': return 'bg-red-600 text-white';
      case 'Offered': return 'bg-transparent text-gray-800 font-bold';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800 font-sans antialiased overflow-x-hidden">
      
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
          .stagger-4 { animation: staggerUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.3s; opacity: 0; }
          
          /* Smooth accordion expansion */
          .expand-grid {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .expand-grid.expanded {
            grid-template-rows: 1fr;
          }
          .expand-content {
            overflow: hidden;
          }
        `}
      </style>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm animate-fade-in-down">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            {/* Placify Logo */}
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

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold">
              <a href="/browsejobs" className="text-gray-500 hover:text-gray-800 transition-colors">Browse Jobs</a>
              <a href="/myapplications" className="text-[#1155cc]">My Applications</a>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.03 6.03 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
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

      {/* Sub Navigation Bar */}
      <div className="bg-white border-b border-gray-200 animate-fade-in-down">
        <div className="max-w-[1000px] mx-auto px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {[
            { name: 'Profile Details', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
            { name: 'Resumes', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
            { name: 'Applied Status', active: true, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
            { name: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> }
          ].map((tab, idx) => (
            <button key={idx} className={`flex items-center gap-2 py-4 border-b-2 font-semibold text-[13px] whitespace-nowrap transition-colors ${tab.active ? 'border-[#1155cc] text-[#1155cc]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {tab.icon}
                {tab.name === 'Settings' && <circle cx="12" cy="12" r="3" />}
              </svg>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1000px] mx-auto px-6 py-10 pb-20">
        
        {/* Header section */}
        <div className="mb-10 stagger-1">
          <h1 className="text-[28px] font-bold text-gray-900 font-serif mb-2">Application Tracker</h1>
          <p className="text-gray-500 text-[15px]">Manage and track your active internship applications and their progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 stagger-2">
          {[
            { count: '12', label: 'TOTAL APPLIED', color: 'text-blue-600' },
            { count: '8', label: 'ACTIVE PROGRESS', color: 'text-amber-500' },
            { count: '1', label: 'OFFERS RECEIVED', color: 'text-gray-900' },
            { count: '2', label: 'WAITLISTED', color: 'text-gray-900' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <span className={`text-[24px] font-bold font-serif mb-1 ${stat.color}`}>{stat.count}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters Header */}
        <div className="flex items-center justify-between mb-6 stagger-3">
          <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">MOST RECENT UPDATES</h2>
          <div className="flex gap-4 text-[13px] font-semibold text-gray-600">
            <button className="hover:text-black transition-colors">Sort by Date</button>
            <button className="hover:text-black transition-colors">Filter: All</button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4 stagger-4">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            
            return (
              <div 
                key={app.id} 
                className={`bg-white rounded-xl border-[2.5px] transition-all duration-300 overflow-hidden ${getCardStyles(app.status)} ${isExpanded ? 'shadow-md' : 'hover:shadow-md cursor-pointer'}`}
                onClick={() => !isExpanded && toggleExpand(app.id)}
              >
                {/* Card Header */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex flex-1 items-center gap-5">
                    {/* Logo */}
                    <div className="w-[52px] h-[52px] bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={app.logo} alt={app.company} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Details */}
                    <div>
                      <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1">{app.role}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium text-gray-500">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {app.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {app.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Applied {app.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Caret */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span className={`px-4 py-1 rounded-full text-[12px] font-bold tracking-wide ${getBadgeStyles(app.status)}`}>
                      {app.status}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleExpand(app.id); }}
                      className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanding Timeline Content */}
                <div className={`expand-grid ${isExpanded ? 'expanded' : ''}`}>
                  <div className="expand-content">
                    <div className="px-6 pb-6 pt-2">
                      <div className="border-t border-gray-100 border-dashed pt-5">
                        
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="text-[12px] font-bold text-gray-500 tracking-widest uppercase">Application Journey</h4>
                          <span className="text-[13px] font-medium text-gray-500 italic">
                            Current Stage: <span className="text-[#1155cc] font-semibold not-italic">Stage {app.step} of 5</span>
                          </span>
                        </div>

                        {/* Progress Timeline */}
                        <div className="relative flex items-center justify-between px-2 sm:px-8 mb-8">
                          {/* Background connecting lines */}
                          <div className="absolute left-[40px] right-[40px] top-4 h-[2px] bg-gray-200 -z-10"></div>
                          
                          {/* Active connecting line (dynamically sized) */}
                          <div 
                            className="absolute left-[40px] top-4 h-[2px] bg-blue-600 transition-all duration-700 ease-out -z-10"
                            style={{ width: `${app.step > 0 ? ((app.step - 1) / 4) * 100 : 0}%`, maxWidth: 'calc(100% - 80px)' }}
                          ></div>

                          {/* Steps */}
                          {['APPLIED', 'IN REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER'].map((stepName, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < app.step;
                            const isCurrent = stepNumber === app.step;
                            
                            return (
                              <div key={index} className="flex flex-col items-center gap-3 bg-white z-10 px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500
                                  ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                                    isCurrent ? (app.status === 'Shortlisted' ? 'bg-white border-amber-500 text-amber-500' : 'bg-white border-blue-600 text-blue-600') : 
                                    'bg-white border-gray-200 text-gray-300'}
                                `}>
                                  {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                  ) : isCurrent ? (
                                    <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'Shortlisted' ? 'bg-amber-500' : 'bg-blue-600'}`}></div>
                                  ) : null}
                                </div>
                                <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-center
                                  ${isCompleted ? 'text-blue-600' : isCurrent ? (app.status === 'Shortlisted' ? 'text-amber-500' : 'text-blue-600') : 'text-gray-400'}
                                `}>
                                  {stepName}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="border-t border-gray-100 border-dashed pt-4 text-right">
                          <button className="text-[13.5px] font-bold text-[#1155cc] hover:underline transition-all">
                            View full application history &rarr;
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Box */}
        <div className="mt-16 bg-[#faf9f6] border border-gray-200/60 rounded-[20px] p-10 flex flex-col items-center justify-center text-center stagger-4 shadow-sm">
          <div className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center mb-5 text-[#1155cc]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-[22px] font-bold font-serif text-gray-900 mb-3">Ready for more opportunities?</h2>
          <p className="text-[14.5px] text-gray-500 max-w-lg mb-8 leading-relaxed">
            Explore hundreds of tailored internships from top companies. Your next career milestone is just one click away.
          </p>
          <button className="px-8 py-3.5 bg-amber-500 text-white font-bold rounded-xl text-[14px] hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95">
            Browse New Jobs
          </button>
        </div>

      </main>

      {/* Global Footer */}
      <footer className="mt-8 bg-[#f9fafb] border-t border-gray-200 py-8 text-sm text-gray-400">
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

export default MyApplications;