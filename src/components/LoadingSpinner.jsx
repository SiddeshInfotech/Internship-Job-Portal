import React from 'react';

function LoadingSpinner({ size = 32, className = '' }) {
  return (
    <div 
      className={`flex items-center justify-center relative ${className}`} 
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* 
        Inner subtle glowing pulse 
        Adds a modern, premium SaaS feel behind the spinner
      */}
      <div className="absolute inset-1 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>

      {/* Main SVG Spinner */}
      <svg
        className="animate-spin w-full h-full relative z-10"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Custom Brand Gradient: Blue-600 to Amber-500 */}
          <linearGradient id="placify-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" /> 
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        
        {/* Faded Background Track */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#f1f5f9" /* slate-100 */
          strokeWidth="4"
        />
        
        {/* 
          Animated Gradient Arc 
          strokeDasharray creates the "cutout" effect in the circle
        */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="url(#placify-spinner-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 150"
          className="opacity-90"
        />
      </svg>
    </div>
  );
}

export default LoadingSpinner;