import React from 'react';
import { RefreshCw, Receipt, PiggyBank } from 'lucide-react';
import ExportMenu from '../transactions/ExportMenu.jsx';

// Dashboard greeting header and primary action controls per Clarivo DESIGN.md (Section 8)
export default function DashboardHeader({
  userName = 'Tracker',
  isRefreshing = false,
  onRefresh,
  onOpenTransactionModal,
  onOpenBudgetModal,
  filters = {}
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Greeting and Overview Subtitle */}
      <div>
        <h1 className="text-2xl font-medium text-ink">
          Welcome, {userName}
        </h1>
        <p className="text-sm text-ink-soft">
          Here is your recorded financial overview, category budgets, and spending trends.
        </p>
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh dashboard data"
          className="btn-secondary text-xs h-9 px-3 gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* CSV/PDF Export Menu */}
        <ExportMenu filters={filters} />

        {/* Quick Add Transaction Modal Trigger */}
        <button
          type="button"
          onClick={onOpenTransactionModal}
          className="btn-secondary text-xs h-9 px-3.5 gap-1.5 cursor-pointer"
        >
          <Receipt className="h-3.5 w-3.5 text-accent" />
          <span>Add transaction</span>
        </button>

        {/* Quick Set Budget Modal Trigger */}
        <button
          type="button"
          onClick={onOpenBudgetModal}
          className="btn-primary text-xs h-9 px-3.5 gap-1.5 cursor-pointer"
        >
          <PiggyBank className="h-3.5 w-3.5" />
          <span>Set budget</span>
        </button>
      </div>
    </div>
  );
}

