import React from 'react';
import { Receipt, Plus, FilterX } from 'lucide-react';

// Empty state placeholder per Clarivo DESIGN.md (Section 9.9)
export default function TransactionEmptyState({
  isFiltered,
  onOpenAddModal,
  onResetFilters
}) {
  return (
    <div className="glass-strong p-12 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-glass-border">
      {/* Icon tile */}
      <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3.5">
        {isFiltered ? <FilterX className="h-6 w-6" /> : <Receipt className="h-6 w-6" />}
      </div>

      {/* Headline */}
      <h3 className="text-base font-medium text-ink">
        {isFiltered ? 'No matching transactions' : 'Add your first transaction'}
      </h3>

      {/* Plain language explanation */}
      <p className="text-xs text-ink-soft max-w-sm mt-1 mb-5">
        {isFiltered
          ? 'No transactions found for the selected date range or category filters. Try widening your search.'
          : 'Record your earnings and expenses to see your net cash flow and unlock smart analytics.'}
      </p>

      {/* Action button */}
      {isFiltered ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="btn-secondary text-xs gap-1.5"
        >
          <FilterX className="h-3.5 w-3.5" />
          <span>Clear all filters</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenAddModal}
          className="btn-primary text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add transaction</span>
        </button>
      )}
    </div>
  );
}
