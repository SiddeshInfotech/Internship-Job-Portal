import React, { useState } from 'react';

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Student Full Name',
    email: 'student@example.com',
    department: 'Computer Science',
    college: 'XYZ College of Engineering',
    currentYear: '3rd Year',
    mobileNo: '+91 98765 43210',
    summary: 'Aspiring software developer with a passion for web technologies...'
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <span className="font-extrabold text-2xl text-indigo-900">Placify</span>
          <div className="flex space-x-8 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-indigo-600">Browse Job</a>
            <a href="#" className="hover:text-indigo-600">My Applications</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700">Student Full Name</span>
          <div className="w-8 h-8 rounded-full bg-green-500"></div>
        </div>
      </nav>

      {/* Sub-Tabs */}
      <div className="px-10 py-4 border-b border-gray-200 bg-white flex space-x-10 text-sm font-bold text-gray-500">
        <a href="#" className="hover:text-indigo-600">My Profile</a>
        <a href="#" className="hover:text-indigo-600">Resumes</a>
        <a href="#" className="hover:text-indigo-600">Applied Status</a>
        <a href="#" className="text-indigo-600 border-b-2 border-orange-500 pb-3">Settings</a>
      </div>

      {/* Main Content - Increased height/width container */}
      <main className="p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-10 min-h-[600px] flex gap-10">
          
          {/* Left Sidebar */}
          <div className="w-1/4 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-blue-100 border-4 border-white shadow-md mb-6 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=S+F&size=160" alt="Profile" />
            </div>
            <button className="bg-[#8ccff5] hover:bg-[#7bc0e4] text-white font-bold py-2 px-6 rounded-lg shadow w-full mb-8 transition">
              Upload New Photo
            </button>
            
            <div className="w-full border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Update your Profile</h3>
              <button className="bg-[#8ccff5] text-white font-bold py-2 px-4 rounded-lg w-full mb-4">Update your Profile</button>
              <h3 className="font-bold text-gray-800 mb-4">View Applications</h3>
              <button className="bg-[#8ccff5] text-white font-bold py-2 px-4 rounded-lg w-full">My Applications</button>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="flex-grow">
            <div className="border-2 border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Personal Information Only View</h2>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(profileData).map(([key, value]) => (
                  <div key={key} className={key === 'summary' ? 'col-span-2' : ''}>
                    <label className="text-xs font-bold text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <div className="w-full border-b border-gray-300 py-2 text-gray-700 font-medium">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password Section */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">Change Password</h3>
              <div className="grid grid-cols-3 gap-6 items-end">
                <div>
                   <label className="text-xs font-bold text-gray-500 block mb-1">New Password</label>
                   <input type="password" className="w-full border rounded-lg p-2" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 block mb-1">Confirm Password</label>
                   <input type="password" className="w-full border rounded-lg p-2" />
                </div>
                <button className="bg-[#f58c14] hover:bg-[#e07b0e] text-white font-bold py-2 rounded-lg shadow-lg">
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;