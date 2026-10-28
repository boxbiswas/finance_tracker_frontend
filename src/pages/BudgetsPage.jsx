import React from 'react';
import { PiggyBank, Plus } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">Budgets</h1>
          <p className="text-sm text-ink-soft">Set monthly limits for expense categories and track progress.</p>
        </div>
        <button type="button" className="btn-primary text-xs gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>New budget</span>
        </button>
      </div>

      <div className="glass-strong p-12 text-center rounded-2xl flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
          <PiggyBank className="h-6 w-6" />
        </div>
        <h2 className="text-base font-medium text-ink">No monthly budgets set</h2>
        <p className="text-xs text-ink-muted max-w-sm mt-1">
          Monthly category limits and spending progress calculations will be integrated in Phase 4.
        </p>
      </div>
    </div>
  );
}
