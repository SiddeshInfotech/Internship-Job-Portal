import React from 'react';

export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function SkeletonJobCard() {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-2/3" />
      <SkeletonBlock className="h-9 w-full rounded-xl mt-2" />
    </div>
  );
}

export default SkeletonBlock;
