import React from 'react';
import { PiggyBank, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Aggregate month budget summary cards per Clarivo DESIGN.md (Section 9.1, 9.6)
export default function BudgetSummaryCards({ summary, currencyCode = 'INR' }) {
  const totalBudgeted = summary?.totalBudgeted || 0;
  const totalSpent = summary?.totalSpent || 0;
  const totalRemaining = summary?.totalRemaining || 0;
  const overallPercentage = summary?.overallPercentage || 0;
  const overBudgetCount = summary?.overBudgetCount || 0;
  const isOverallOver = totalRemaining < 0;

  // Capped progress bar width for overall card
  const progressWidth = Math.min(100, Math.max(0, overallPercentage));
  const progressColor = isOverallOver
    ? 'bg-expense'
    : overallPercentage >= 75
    ? 'bg-warning'
    : 'bg-income';

  return (
    <div className="space-y-4">
      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Total Budgeted Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Total budgeted</span>
            <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[28px] font-medium tabular-nums text-accent">
            {formatCurrency(totalBudgeted, currencyCode)}
          </div>
          <div className="mt-2 text-xs text-ink-muted">
            <span>Across {summary?.totalBudgets || 0} configured categories</span>
          </div>
        </div>

        {/* Total Spent in Budgeted Categories Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Total spent</span>
            <div className="h-8 w-8 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[28px] font-medium tabular-nums text-expense">
            {formatCurrency(totalSpent, currencyCode)}
          </div>
          <div className="mt-2 text-xs text-ink-muted">
            <span>{overallPercentage}% of monthly limit consumed</span>
          </div>
        </div>

        {/* Remaining or Overspent Balance Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>{isOverallOver ? 'Over budget by' : 'Remaining budget'}</span>
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                isOverallOver ? 'bg-expense/10 text-expense' : 'bg-income/10 text-income'
              }`}
            >
              {isOverallOver ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>
          </div>
          <div
            className={`text-[28px] font-medium tabular-nums ${
              isOverallOver ? 'text-expense' : 'text-income'
            }`}
          >
            {isOverallOver
              ? `−${formatCurrency(Math.abs(totalRemaining), currencyCode)}`
              : formatCurrency(totalRemaining, currencyCode)}
          </div>
          <div className="mt-2 text-xs text-ink-muted">
            <span>
              {overBudgetCount > 0
                ? `${overBudgetCount} category exceeding limit`
                : 'All categories on track'}
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Budget Utilization Bar */}
      {totalBudgeted > 0 && (
        <div className="glass p-4 rounded-xl border border-glass-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink">Overall budget consumption</span>
            <span className="font-medium tabular-nums text-ink">{overallPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-track overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

