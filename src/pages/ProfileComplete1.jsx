import React, { useState } from "react";

const ProfileCompleteAnimated = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "student@university.edu",
    department: "",
    collegeName: "",
    yearOfStudy: "",
    mobileNumber: "",
    cityState: "",
    linkedin: "",
    summary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "student@university.edu",
      department: "",
      collegeName: "",
      yearOfStudy: "",
      mobileNumber: "",
      cityState: "",
      linkedin: "",
      summary: "",
    });
  };

  return (
    <div className="min-h-screen relative font-sans bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Background Image with subtle animation */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 animate-zoomSlow"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80")',
          filter: "brightness(0.6)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Navbar */}
      <nav className="relative z-30 bg-transparent px-10 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
            P
          </div>
          <span className="font-extrabold text-2xl text-white tracking-widest">Placify</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-white/70 hover:text-white transition-all">
          <a href="#" className="hover:underline">Browse Jobs</a>
          <a href="#" className="hover:underline">My Applications</a>
          <a href="#" className="underline decoration-indigo-400 decoration-2 font-bold">Profile</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-30 flex justify-center items-start pt-16 px-4 sm:px-6 pb-20">
        <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-slideUp">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">Complete your Profile</h1>
              <p className="text-indigo-700 font-medium max-w-lg">Provide your details to unlock internship opportunities.</p>
            </div>
            <button className="text-indigo-700 font-semibold px-5 py-2 border border-indigo-300 rounded-lg hover:bg-indigo-100 transition">
              Skip for Now →
            </button>
          </header>

          {/* Progress Bar */}
          <section className="mb-6">
            <div className="flex justify-between text-xs font-bold text-indigo-600 tracking-wide mb-2">
              <span>PERSONAL INFORMATION</span>
              <span>SECTION 1 OF 3</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-width duration-500" style={{ width: "33.33%" }}></div>
            </div>
          </section>

          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Full Name", name: "fullName", placeholder: "e.g. John Doe", type: "text" },
              { label: "Email Address", name: "email", placeholder: "", type: "email", readOnly: true, disabled: true },
              { label: "Department / Stream", name: "department", placeholder: "e.g. Computer Science", type: "text" },
              { label: "College Name", name: "collegeName", placeholder: "Enter full college name", type: "text" },
              { label: "Current Year of Study", name: "yearOfStudy", placeholder: "e.g. 3rd Year", type: "text" },
              { label: "Mobile Number", name: "mobileNumber", placeholder: "+91 00000 00000", type: "tel" },
              { label: "City & State", name: "cityState", placeholder: "e.g. Pune, Maharashtra", type: "text" },
              { label: "LinkedIn Profile URL", name: "linkedin", placeholder: "https://linkedin.com/in/username", type: "url" },
            ].map(({ label, name, placeholder, type, readOnly, disabled }) => (
              <div key={name}>
                <label className="block text-gray-700 font-semibold text-sm mb-2">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  disabled={disabled}
                  className={`w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    readOnly || disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold text-sm mb-2">Professional Summary</label>
              <textarea
                name="summary"
                rows="4"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write 2-3 lines about your skills, projects, and what kind of internship you are looking for..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none bg-white"
              ></textarea>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="mt-10 flex justify-end space-x-6">
            <button
              onClick={handleClear}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Clear Data
            </button>
            <button
              className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition"
            >
              Save & Next
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-30 bg-indigo-900 text-indigo-300 py-6 px-10 flex flex-col md:flex-row justify-between items-center text-xs font-semibold tracking-wide">
        <div>© 2026 Placify Portal</div>
        <div className="flex gap-8 uppercase">
          <a href="#" className="hover:text-indigo-100 transition">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-100 transition">Terms of Service</a>
          <a href="#" className="hover:text-indigo-100 transition">Help Center</a>
        </div>
      </footer>

      {/* Animations via Tailwind CSS - add keyframes in tailwind config */}
      <style>{`
        @keyframes slideUp {
          0% {opacity:0; transform: translateY(30px);}
          100% {opacity:1; transform: translateY(0);}
        }
        @keyframes zoomSlow {
          0%, 100% {transform: scale(1);}
          50% {transform: scale(1.05);}
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease forwards;
        }
        .animate-zoomSlow {
          animation: zoomSlow 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfileCompleteAnimated;
