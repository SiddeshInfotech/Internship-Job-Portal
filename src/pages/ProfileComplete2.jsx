import React, { useState } from 'react';

const ProfileComplete2 = () => {
  const [formData, setFormData] = useState({
    enrollmentNo: '',
    collegeName: '',
    collegeAddress: '',
    course: '',
    currentYear: '',
    gpa: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being typed in
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.enrollmentNo.trim()) errors.enrollmentNo = true;
    if (!formData.collegeName.trim()) errors.collegeName = true;
    if (!formData.collegeAddress.trim()) errors.collegeAddress = true;
    if (!formData.course.trim()) errors.course = true;
    if (!formData.currentYear.trim()) errors.currentYear = true;
    if (!formData.gpa.trim()) errors.gpa = true;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const handleSkip = (e) => {
    e.preventDefault();
    // Navigate to next section or skip logic
  };

  const fields = [
    { name: 'enrollmentNo', label: 'Enrollment No', placeholder: 'e.g. 120XXXXXXXXX', type: 'text' },
    { name: 'collegeName', label: 'College Name', placeholder: 'Enter full college name', type: 'text' },
    { name: 'collegeAddress', label: 'College Address', placeholder: 'e.g. City, State', type: 'text' },
    { name: 'course', label: 'Course', placeholder: 'e.g. B.Tech Computer Science', type: 'text' },
    { name: 'currentYear', label: 'Current Year', placeholder: 'e.g. 3rd Year', type: 'text' },
    { name: 'gpa', label: 'GPA / CGPA', placeholder: 'e.g. 8.5', type: 'text' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative font-sans bg-indigo-900 overflow-hidden">
      {/* Background Image with subtle animation & Purple Tint */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 animate-zoomSlow"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")',
          filter: 'brightness(0.5) sepia(1) hue-rotate(220deg) saturate(2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/60 to-indigo-900/40" />

      {/* Navbar */}
      <nav className="relative z-30 bg-transparent px-10 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer">
          <span className="font-extrabold text-2xl text-white tracking-widest">Placify</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-white/80 hover:text-white transition-all">
          <a href="#" className="hover:underline">Browse Jobs</a>
          <a href="#" className="hover:underline">My Applications</a>
        </div>
      </nav>

      {/* Main Content (flex-grow pushes footer down, items-center centers vertically) */}
      <main className="flex-grow relative z-30 flex justify-center items-center px-4 sm:px-6 py-10">
        {/* Increased max-w to 5xl for a wider form */}
        <div className="max-w-5xl w-full bg-[#f8f9fc] rounded-[1.5rem] shadow-2xl p-10 md:p-12 animate-slideUp">
          
          {/* Header */}
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-[2.1rem] font-extrabold text-[#2d2a6a] mb-2 font-sans tracking-tight">
                Academic Information
              </h1>
              <p className="text-indigo-700/80 font-semibold text-sm max-w-lg">
                Fill in your academic details to unlock tailored opportunities.
              </p>
            </div>
            <button 
              onClick={handleSkip}
              className="text-indigo-600 font-bold text-sm px-5 py-2 border-2 border-indigo-200/60 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
            >
              Skip for Now →
            </button>
          </header>

          {/* Progress Bar */}
          <section className="mb-8">
            <div className="flex justify-between text-[0.7rem] font-extrabold text-indigo-600 uppercase tracking-wider mb-2">
              <span>ACADEMIC SECTION</span>
              <span>SECTION 2 OF 3</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#00c853] h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: '66.66%' }}
              ></div>
            </div>
          </section>

          {/* Form */}
          <form onSubmit={handleSave}>
            {/* Added larger gap-x-12 for wider horizontal spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
              {fields.map(({ label, name, placeholder, type }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="block text-gray-800 font-bold text-xs mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border px-4 py-3 text-gray-800 text-sm focus:outline-none transition bg-white placeholder-gray-400 ${
                      fieldErrors[name] 
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400'
                    }`}
                  />
                  {fieldErrors[name] && (
                    <span className="text-red-500 text-[0.7rem] font-bold mt-1.5 flex items-center gap-1 animate-fadeIn">
                      ⚠ This field is required
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={saveLoading}
                className="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 text-sm font-bold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-8 py-2.5 bg-[#4438ca] text-white text-sm font-bold rounded-lg shadow-lg hover:bg-indigo-800 transition flex items-center justify-center min-w-[140px] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {saveLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Saving
                  </>
                ) : saveSuccess ? (
                  <span className="animate-scaleIn flex items-center gap-2">✓ Saved!</span>
                ) : (
                  <span>Save & Next →</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Pinned to Bottom */}
      <footer className="relative z-30 bg-[#2d2a6a]/95 text-indigo-200 py-4 px-10 flex flex-col md:flex-row justify-between items-center text-[0.65rem] font-bold tracking-widest border-t border-indigo-800/50">
        <div className="mb-2 md:mb-0">© 2026 Placify Portal</div>
        <div className="flex gap-8 uppercase">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </footer>

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

export default ProfileComplete2;