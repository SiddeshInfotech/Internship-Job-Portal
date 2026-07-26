import React from 'react';

function LoadingSpinner({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="pf-spinner"
        style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 10)) }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default LoadingSpinner;
