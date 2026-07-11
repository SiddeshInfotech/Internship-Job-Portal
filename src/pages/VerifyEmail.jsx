import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from "./api/axiosClient"; 

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check router state first, then local storage, then default to empty string
  const email = location.state?.email || localStorage.getItem('registeredEmail') || ''; 

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert("Email not found. Please register again.");
      return;
    }

    setLoading(true);

    try {
      // Fixed Typo: student (not stundent)
      const response = await axiosClient.post('/student/verify-otp', {
        email,
        otp,
      });

      console.log(response.data);
      alert('Email Verified Successfully!');
      
      // Clean up local storage
      localStorage.removeItem('registeredEmail'); 
      
      // Redirect to login page
      navigate('/login'); 

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      alert("Email not found. Cannot resend OTP.");
      return;
    }

    setResendLoading(true);

    try {
      // Fixed Typo: student (not stundent)
    // Change this back to stundent
const response = await axiosClient.post('/stundent/resend-password', {
        email,
      });

      console.log(response.data);
      alert('A new OTP has been sent to your email!');

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="hidden md:flex md:w-1/2 bg-[#0c2357] text-white relative overflow-hidden flex-col justify-center px-16 lg:px-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-[#143275] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border-[30px] border-[#1a3d8a] rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[20px] border-[#224b9e] rounded-full opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="placifyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <path d="M 20 85 Q 28 65 30 50 L 30 20 L 60 20 C 85 20 95 40 85 60 C 75 75 60 75 45 75 L 35 75 Q 25 80 15 95 Z" fill="url(#placifyGrad)" />
                  <circle cx="45" cy="38" r="8" fill="#163362" />
                  <path d="M 38 60 L 40 48 C 40 48 45 46 50 48 L 52 60 Z" fill="#163362" />
                  <path d="M 38 63 L 65 48 L 60 43 L 75 45 L 70 58 L 65 53 Z" fill="#163362" />
                </svg>
              </div>
              Placify
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6">Student<br />Registration</h1>
          <p className="text-[#8ba3d9] text-lg max-w-md mb-12">
            Verify your identity to access the placement platform and take the next step in your career journey.
          </p>

          <div className="inline-flex items-center gap-4 bg-[#143275] px-4 py-2 rounded-full shadow-lg border border-[#224b9e]">
            <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#143275] bg-gray-300" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=11')", backgroundSize: 'cover' }}></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#143275] bg-gray-300" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=32')", backgroundSize: 'cover' }}></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#143275] bg-gray-300" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=12')", backgroundSize: 'cover' }}></div>
            </div>
            <span className="text-sm font-medium">Join 5,000+ students today</span>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-16 text-xs text-[#8ba3d9]">
          © 2026 PLACIFY. ALL ACADEMIC RIGHTS RESERVED
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-10 w-full max-w-md animate-fade-in-up">
          
          <div className="text-center mb-8">
            <h3 className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3">
              Student Register
            </h3>
            <h2 className="text-3xl font-bold text-[#0c2357] mb-4">
              Verify your Email
            </h2>
            <p className="text-gray-500 text-sm px-4">
              A Verification Code has been sent to <br /><strong>{email || 'your Registered Email'}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0c2357]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2357]/20 focus:border-[#0c2357] transition-all bg-gray-50/50"
              />
            </div>

            <div className="flex justify-end mb-8">
              <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#0c2357] hover:text-blue-700 hover:underline transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c2357] text-white rounded-lg py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-[#08183d] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span className="font-medium tracking-wide">
                {loading ? 'Verifying...' : 'Verify'}
              </span>
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              )}
            </button>
          </form>
        </div>

        <div className="absolute bottom-8 flex gap-6 text-xs text-gray-400 font-medium tracking-wide">
          <a href="#" className="hover:text-gray-600 transition-colors">HELP CENTER</a>
          <a href="#" className="hover:text-gray-600 transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-gray-600 transition-colors">TERMS</a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;