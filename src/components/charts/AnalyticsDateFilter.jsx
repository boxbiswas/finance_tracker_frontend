import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

// Date filter controls for dashboard charts and summary per Clarivo DESIGN.md (Section 9.3)
export default function AnalyticsDateFilter({
  filters,
  onFilterChange,
  onReset
}) {
  // Helper to format date in local timezone YYYY-MM-DD avoiding UTC day-shift
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const applyPreset = (preset) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (preset === 'this_month') {
      const from = formatDateLocal(new Date(year, month, 1));
      const to = formatDateLocal(new Date(year, month + 1, 0));
      onFilterChange({ from, to, months: 1 });
    } else if (preset === 'last_3_months') {
      const from = formatDateLocal(new Date(year, month - 2, 1));
      const to = formatDateLocal(new Date(year, month + 1, 0));
      onFilterChange({ from, to, months: 3 });
    } else if (preset === 'last_6_months') {
      onFilterChange({ from: '', to: '', months: 6 });
    } else if (preset === 'all') {
      onFilterChange({ from: '', to: '', months: 24 });
    }
  };

  const hasCustomRange = Boolean(filters.from || filters.to);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => applyPreset('last_6_months')}
          className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
            !hasCustomRange && filters.months === 6
              ? 'bg-brand text-on-brand border-transparent shadow-sm'
              : 'border-glass-border hover:bg-glass text-ink-soft hover:text-ink'
          }`}
        >
          Last 6 months
        </button>
        <button
          type="button"
          onClick={() => applyPreset('this_month')}
          className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
            filters.months === 1
              ? 'bg-brand text-on-brand border-transparent shadow-sm'
              : 'border-glass-border hover:bg-glass text-ink-soft hover:text-ink'
          }`}
        >
          This month
        </button>
        <button
          type="button"
          onClick={() => applyPreset('last_3_months')}
          className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
            filters.months === 3
              ? 'bg-brand text-on-brand border-transparent shadow-sm'
              : 'border-glass-border hover:bg-glass text-ink-soft hover:text-ink'
          }`}
        >
          Last 3 months
        </button>
        <button
          type="button"
          onClick={() => applyPreset('all')}
          className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
            filters.months === 24
              ? 'bg-brand text-on-brand border-transparent shadow-sm'
              : 'border-glass-border hover:bg-glass text-ink-soft hover:text-ink'
          }`}
        >
          All time
        </button>
      </div>

      {/* Date Pickers for Custom Range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label="From date"
          value={filters.from || ''}
          onChange={(e) => onFilterChange({ from: e.target.value })}
          className="input h-8 text-xs px-2.5 py-1 w-32"
        />
        <span className="text-ink-muted">to</span>
        <input
          type="date"
          aria-label="To date"
          value={filters.to || ''}
          onChange={(e) => onFilterChange({ to: e.target.value })}
          className="input h-8 text-xs px-2.5 py-1 w-32"
        />
        {hasCustomRange && (
          <button
            type="button"
            onClick={onReset}
            title="Reset to default period"
            className="h-8 w-8 rounded-lg flex items-center justify-center border border-glass-border text-ink-muted hover:text-ink hover:bg-glass transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
