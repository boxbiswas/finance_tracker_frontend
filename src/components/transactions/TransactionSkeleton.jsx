import React from 'react';

// Skeleton loading placeholder matching table and cards layout per Clarivo DESIGN.md (Section 9.9)
export default function TransactionSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {/* Table header skeleton */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-field border border-glass-border">
        <div className="col-span-3 h-4 bg-track rounded animate-pulse" />
        <div className="col-span-3 h-4 bg-track rounded animate-pulse" />
        <div className="col-span-3 h-4 bg-track rounded animate-pulse" />
        <div className="col-span-2 h-4 bg-track rounded animate-pulse" />
        <div className="col-span-1 h-4 bg-track rounded animate-pulse" />
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="glass-strong p-4 rounded-xl flex items-center justify-between sm:grid sm:grid-cols-12 sm:gap-4 sm:px-4 sm:py-3.5"
        >
          {/* Mobile view skeleton */}
          <div className="flex sm:hidden items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-track animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-24 bg-track rounded animate-pulse" />
                <div className="h-3 w-16 bg-track rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-20 bg-track rounded animate-pulse" />
          </div>

          {/* Desktop view skeleton columns */}
          <div className="hidden sm:block col-span-3 h-4 w-24 bg-track rounded animate-pulse" />
          <div className="hidden sm:flex col-span-3 items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-track animate-pulse" />
            <div className="h-4 w-28 bg-track rounded animate-pulse" />
          </div>
          <div className="hidden sm:block col-span-3 h-4 w-36 bg-track rounded animate-pulse" />
          <div className="hidden sm:block col-span-2 h-4 w-20 bg-track rounded animate-pulse justify-self-end" />
          <div className="hidden sm:block col-span-1 h-6 w-6 bg-track rounded animate-pulse justify-self-end" />
        </div>
      ))}
    </div>
  );
}
