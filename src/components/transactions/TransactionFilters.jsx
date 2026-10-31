import React from 'react';
import { Filter, Calendar, RotateCcw, ArrowUpDown } from 'lucide-react';
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  ALL_CATEGORY_OPTIONS
} from '../../utils/categoryColors.js';

// Query filtering controls per Clarivo DESIGN.md (Section 9.3)
export default function TransactionFilters({
  filters,
  onFilterChange,
  onResetFilters
}) {
  // Preset date ranges calculations
  const applyPresetDate = (preset) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (preset === 'this_month') {
      const from = new Date(year, month, 1).toISOString().split('T')[0];
      const to = new Date(year, month + 1, 0).toISOString().split('T')[0];
      onFilterChange({ from, to });
    } else if (preset === 'last_month') {
      const from = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const to = new Date(year, month, 0).toISOString().split('T')[0];
      onFilterChange({ from, to });
    } else if (preset === 'last_3_months') {
      const from = new Date(year, month - 2, 1).toISOString().split('T')[0];
      const to = new Date(year, month + 1, 0).toISOString().split('T')[0];
      onFilterChange({ from, to });
    } else if (preset === 'all') {
      onFilterChange({ from: '', to: '' });
    }
  };

  // Determine which categories to show based on selected type filter
  let categoryOptions = ALL_CATEGORY_OPTIONS;
  if (filters.type === 'income') {
    categoryOptions = INCOME_CATEGORIES;
  } else if (filters.type === 'expense') {
    categoryOptions = EXPENSE_CATEGORIES;
  }

  // Check if any non-default filter is currently applied
  const hasActiveFilters = Boolean(
    filters.from ||
    filters.to ||
    filters.type ||
    filters.category ||
    filters.sort !== 'date_desc'
  );

  return (
    <div className="glass p-4 rounded-2xl border border-glass-border space-y-4">
      {/* Top Filter Controls: Type Selector Pills & Quick Date Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type Selector (Pill segmented control) */}
        <div className="inline-flex p-1 rounded-full bg-track border border-glass-border">
          <button
            type="button"
            onClick={() => onFilterChange({ type: '', category: '' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              !filters.type ? 'bg-brand text-on-brand shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            All types
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'income', category: '' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filters.type === 'income' ? 'bg-brand text-on-brand shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'expense', category: '' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              filters.type === 'expense' ? 'bg-brand text-on-brand shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Quick Date Range Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-ink-muted hidden md:inline mr-1">Period:</span>
          <button
            type="button"
            onClick={() => applyPresetDate('this_month')}
            className="px-2.5 py-1 rounded-full border border-glass-border hover:bg-glass text-ink-soft hover:text-ink transition cursor-pointer"
          >
            This month
          </button>
          <button
            type="button"
            onClick={() => applyPresetDate('last_month')}
            className="px-2.5 py-1 rounded-full border border-glass-border hover:bg-glass text-ink-soft hover:text-ink transition cursor-pointer"
          >
            Last month
          </button>
          <button
            type="button"
            onClick={() => applyPresetDate('last_3_months')}
            className="px-2.5 py-1 rounded-full border border-glass-border hover:bg-glass text-ink-soft hover:text-ink transition cursor-pointer"
          >
            Last 3 months
          </button>
          <button
            type="button"
            onClick={() => applyPresetDate('all')}
            className="px-2.5 py-1 rounded-full border border-glass-border hover:bg-glass text-ink-soft hover:text-ink transition cursor-pointer"
          >
            All time
          </button>
        </div>
      </div>

      {/* Bottom Filter Controls: Category select, Date inputs, Sort, Reset */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-glass-border/60">
        {/* Category Filter Dropdown */}
        <div>
          <label htmlFor="filter-category" className="block text-xs text-ink-soft mb-1 font-medium">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="input text-xs py-2 h-10 w-full"
          >
            <option value="">All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date Input */}
        <div>
          <label htmlFor="filter-from" className="block text-xs text-ink-soft mb-1 font-medium">
            From date
          </label>
          <div className="relative">
            <input
              id="filter-from"
              type="date"
              value={filters.from || ''}
              onChange={(e) => onFilterChange({ from: e.target.value })}
              className="input text-xs py-2 h-10 w-full"
            />
          </div>
        </div>

        {/* To Date Input */}
        <div>
          <label htmlFor="filter-to" className="block text-xs text-ink-soft mb-1 font-medium">
            To date
          </label>
          <div className="relative">
            <input
              id="filter-to"
              type="date"
              value={filters.to || ''}
              onChange={(e) => onFilterChange({ to: e.target.value })}
              className="input text-xs py-2 h-10 w-full"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label htmlFor="filter-sort" className="block text-xs text-ink-soft mb-1 font-medium">
            Sort by
          </label>
          <div className="flex items-center gap-2">
            <select
              id="filter-sort"
              value={filters.sort || 'date_desc'}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="input text-xs py-2 h-10 flex-1"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="amount_desc">Highest amount</option>
              <option value="amount_asc">Lowest amount</option>
            </select>

            {/* Reset Filters Icon Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                title="Reset all filters"
                aria-label="Reset filters"
                className="h-10 w-10 shrink-0 rounded-xl border border-glass-border bg-field flex items-center justify-center text-ink-soft hover:text-ink hover:bg-glass transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
