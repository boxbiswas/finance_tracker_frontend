import React from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import { formatMonthLabel } from '../../utils/formatCurrency.js';

// Empty state placeholder for months with no configured category budgets per DESIGN.md (Section 9.9)
export default function BudgetEmptyState({ month, onOpenAddModal }) {
  return (
    <div className="glass-strong p-12 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-glass-border">
      {/* Icon tile */}
      <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3.5">
        <PiggyBank className="h-6 w-6" />
      </div>

      {/* Headline */}
      <h3 className="text-base font-medium text-ink">
        No budgets set for {formatMonthLabel(month)}
      </h3>

      {/* Explanation */}
      <p className="text-xs text-ink-soft max-w-sm mt-1 mb-5">
        Define monthly spending targets for categories like Food & Dining, Shopping, or Travel to monitor your pace and avoid unexpected overspending.
      </p>

      {/* Action button */}
      <button
        type="button"
        onClick={onOpenAddModal}
        className="btn-primary text-xs gap-1.5 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Set category budget</span>
      </button>
    </div>
  );
}

