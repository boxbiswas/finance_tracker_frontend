import React from 'react';
import { PlusCircle, Plus } from 'lucide-react';

// Dashboard empty state banner per Clarivo DESIGN.md (Sections 8, 9.8)
export default function DashboardEmptyState({ onOpenTransactionModal }) {
  return (
    <div className="glass-strong p-10 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-glass-border">
      <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
        <PlusCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-medium text-ink">Ready to start tracking?</h2>
      <p className="text-sm text-ink-soft max-w-md mt-1 mb-4">
        Record your first income or expense to generate live Recharts visualizations, monthly trends, and spending breakdown.
      </p>
      <button
        type="button"
        onClick={onOpenTransactionModal}
        className="btn-primary text-xs gap-1.5 cursor-pointer shadow-sm"
      >
        <Plus className="h-4 w-4" />
        <span>Add your first transaction</span>
      </button>
    </div>
  );
}

