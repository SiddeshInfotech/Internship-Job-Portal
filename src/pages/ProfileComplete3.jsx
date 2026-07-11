import React, { useState } from 'react';

const ProfileComplete3 = () => {
  // Form states for inputs
  const [certForm, setCertForm] = useState({ name: '', issuedBy: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: '' });

  // Lists to store added items
  const [certifications, setCertifications] = useState([
    { id: 1, name: 'Demo 1', issuedBy: 'MHSC', fileName: null }
  ]);
  const [skills, setSkills] = useState([
    { id: 1, name: 'Demo 1', level: 'Master' }
  ]);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Handlers for Certifications ---
  const handleCertInputChange = (e) => {
    const { name, value } = e.target;
    setCertForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (!certForm.name.trim() || !certForm.issuedBy.trim()) return;
    
    setCertifications(prev => [
      ...prev, 
      { id: Date.now(), name: certForm.name, issuedBy: certForm.issuedBy, fileName: null }
    ]);
    setCertForm({ name: '', issuedBy: '' }); // Reset
  };

  const handleDeleteCert = (id) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const handleFileUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setCertifications(prev => prev.map(cert => 
        cert.id === id ? { ...cert, fileName: file.name } : cert
      ));
    }
  };

  // --- Handlers for Skills ---
  const handleSkillInputChange = (e) => {
    const { name, value } = e.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name.trim() || !skillForm.level.trim()) return;
    
    setSkills(prev => [
      ...prev, 
      { id: Date.now(), name: skillForm.name, level: skillForm.level }
    ]);
    setSkillForm({ name: '', level: '' }); // Reset
  };

  const handleDeleteSkill = (id) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  // --- General Actions ---
  const handleSave = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const handleSkip = (e) => {
    e.preventDefault();
    // Skip logic here
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-indigo-900 overflow-hidden">
      {/* Background Image & Purple Tint (Same as ProfileComplete2) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-zoomSlow"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")',
          filter: 'brightness(0.5) sepia(1) hue-rotate(220deg) saturate(2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/60 to-indigo-900/40" />

      {/* Navbar */}
      <nav className="relative z-30 bg-transparent px-10 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer">
          <span className="font-extrabold text-2xl text-white tracking-widest flex items-center gap-2">
             Placify
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-white/80 hover:text-white transition-all">
          <a href="#" className="hover:underline">Browse Jobs</a>
          <a href="#" className="hover:underline">My Applications</a>
          <div className="flex items-center gap-3 ml-4 border-l border-white/20 pl-6">
             <span className="text-white">Student Full Name</span>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 border-2 border-white"></div>
          </div>
        </div>
      </nav>

      {/* Sub-header Navigation (From screenshot) */}
      <div className="relative z-30 w-full px-10 flex justify-between items-center text-white/90 font-bold mb-2">
          <button onClick={handleSkip} className="flex items-center gap-2 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
              Skip for Now
          </button>
          <span>Complete your Profile</span>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative z-30 flex justify-center items-center px-4 sm:px-6 py-6 pb-12">
        <div className="max-w-5xl w-full bg-[#f8f9fc] rounded-[1.5rem] shadow-2xl p-8 md:p-10 animate-slideUp">
          
          {/* Progress Indicator */}
          <div className="text-center mb-8">
             <h2 className="text-xl font-extrabold text-[#2d2a6a]">Section 3 of 3</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-10">
            
            {/* ================= CERTIFICATION SECTION ================= */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Certification</h3>
              
              {/* Add Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end mb-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1.5">Certificate Name</label>
                  <input
                    type="text"
                    name="name"
                    value={certForm.name}
                    onChange={handleCertInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1.5">Issued By</label>
                  <input
                    type="text"
                    name="issuedBy"
                    value={certForm.issuedBy}
                    onChange={handleCertInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="bg-[#f58c14] hover:bg-[#e07b0e] text-white font-bold py-2.5 px-8 rounded-lg shadow transition h-[42px]"
                >
                  Add
                </button>
              </div>

              {/* Added Certifications List */}
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex flex-wrap md:flex-nowrap items-center justify-between bg-indigo-50 border-2 border-indigo-400/50 rounded-lg p-4 animate-fadeIn">
                    <div className="grid grid-cols-2 flex-grow gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-800 mb-1">Certificate Name</div>
                        <div className="text-sm font-medium text-gray-600">{cert.name}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800 mb-1">Issued By</div>
                        <div className="text-sm font-medium text-gray-600">{cert.issuedBy}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-600 mb-1">PDF upto 2 MB</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-500 cursor-pointer hover:text-indigo-600 underline">View</span>
                            <label className="flex items-center gap-2 bg-[#b6daf2] hover:bg-[#a1ccf0] text-gray-800 text-xs font-bold px-3 py-1.5 rounded border border-gray-400 cursor-pointer transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            {cert.fileName ? "Uploaded" : "Upload"}
                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(cert.id, e)} />
                            </label>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCert(cert.id)} type="button" className="text-gray-900 hover:text-red-500 transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zM7 6h10v13H7V6zm2 2v9h2V8H9zm4 0v9h2V8h-2z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= SKILL SECTION ================= */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Skill</h3>
              
              {/* Add Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end mb-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1.5">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    value={skillForm.name}
                    onChange={handleSkillInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1.5">Level (Master, Pro, Medium, Beginner)</label>
                  <input
                    type="text"
                    name="level"
                    value={skillForm.level}
                    onChange={handleSkillInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg shadow transition h-[42px]"
                >
                  Add
                </button>
              </div>

              {/* Added Skills List */}
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex flex-wrap md:flex-nowrap items-center justify-between bg-[#d9effe] rounded-lg p-4 px-6 animate-fadeIn">
                    <div className="grid grid-cols-2 flex-grow gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-800 mb-1">Skill Name</div>
                        <div className="text-sm font-medium text-gray-600">{skill.name}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800 mb-1">Level</div>
                        <div className="text-sm font-medium text-gray-600">{skill.level}</div>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteSkill(skill.id)} type="button" className="text-gray-900 hover:text-red-500 transition mt-4 md:mt-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zM7 6h10v13H7V6zm2 2v9h2V8H9zm4 0v9h2V8h-2z"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={saveLoading}
                className="px-8 py-2.5 bg-white border-2 border-gray-200 shadow-sm rounded-lg text-gray-800 text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-8 py-2.5 bg-[#f58c14] hover:bg-[#e07b0e] text-white text-sm font-bold rounded-lg shadow-md transition flex items-center justify-center min-w-[140px] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {saveLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Saving
                  </>
                ) : saveSuccess ? (
                  <span className="animate-scaleIn flex items-center gap-2">✓ Saved!</span>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.6s ease forwards; }
        .animate-zoomSlow { animation: zoomSlow 30s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease forwards; }
      `}</style>
    </div>
  );
};

export default ProfileComplete3;