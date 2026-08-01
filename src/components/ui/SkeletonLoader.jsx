import React from "react";

export default function SkeletonLoader({ type = "card", count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case "page":
        return (
          <div className="space-y-6 animate-pulse max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header Skeleton */}
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/5" />
            
            {/* Banner Skeleton */}
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
            
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
              ))}
            </div>
          </div>
        );

      case "table":
        return (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            ))}
          </div>
        );

      case "card":
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-200 dark:bg-slate-800/60 rounded-3xl animate-pulse backdrop-blur-md"
              />
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
}
