import React from 'react';
import { Link } from 'react-router-dom';
import { PiggyBank, Plus, ChevronRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatMonthLabel } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Compact budget progress widget for the dashboard per Clarivo DESIGN.md (Sections 8, 9.6)
export default function DashboardBudgetProgress({
  budgets = [],
  summary,
  selectedMonth,
  onOpenSetBudget,
  currencyCode = 'INR'
}) {
  const hasBudgets = budgets.length > 0;
  const totalBudgeted = summary?.totalBudgeted || 0;
  const totalSpent = summary?.totalSpent || 0;
  const totalRemaining = summary?.totalRemaining || 0;
  const overallPercentage = summary?.overallPercentage || 0;
  const isOverallOver = totalRemaining < 0;

  return (
    <div className="glass-strong p-5 rounded-2xl border border-glass-border flex flex-col justify-between h-full">
      <div>
        {/* Widget Header with Month and Link */}
        <div className="flex items-center justify-between border-b border-glass-border pb-3 mb-3.5">
          <div>
            <h2 className="text-[15px] font-medium text-ink">Budget progress</h2>
            <p className="text-xs text-ink-soft">
              {formatMonthLabel(selectedMonth)} limits vs actual spending
            </p>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
          >
            <span>Manage</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {hasBudgets ? (
          <div className="space-y-4">
            {/* Overall Month Budget Pill */}
            <div className="p-3 rounded-xl bg-field border border-glass-border space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-soft">Monthly spending</span>
                <span className="font-medium text-ink tabular-nums">
                  {formatCurrency(totalSpent, currencyCode)} / {formatCurrency(totalBudgeted, currencyCode)}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-track overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverallOver ? 'bg-expense' : overallPercentage >= 75 ? 'bg-warning' : 'bg-income'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>{overallPercentage}% consumed</span>
                <span className={isOverallOver ? 'text-expense font-medium' : 'text-income font-medium'}>
                  {isOverallOver
                    ? `Over by ${formatCurrency(Math.abs(totalRemaining), currencyCode)}`
                    : `${formatCurrency(totalRemaining, currencyCode)} remaining`}
                </span>
              </div>
            </div>

            {/* Top Category Budgets List (up to 4 items) */}
            <div className="space-y-3">
              {budgets.slice(0, 4).map((b) => {
                const cat = getCategoryDetails(b.category);
                const isOver = b.isOverBudget;
                const isNear = b.isNearLimit;
                const barColor = isOver ? 'bg-expense' : isNear ? 'bg-warning' : 'bg-income';
                const width = Math.min(100, Math.max(0, b.percentage || 0));

                return (
                  <div key={b.id} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.light }}
                        />
                        <span className="font-medium text-ink truncate">{cat.label}</span>
                      </div>
                      <div className="text-right text-[11px] tabular-nums text-ink-soft">
                        <span>{formatCurrency(b.spent, currencyCode)}</span>
                        <span className="text-ink-muted mx-1">/</span>
                        <span className="text-ink-muted">{formatCurrency(b.limit, currencyCode)}</span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-track overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted">{b.percentage}% limit</span>
                      <span
                        className={`font-medium ${
                          isOver ? 'text-expense' : isNear ? 'text-warning' : 'text-ink-soft'
                        }`}
                      >
                        {isOver
                          ? `Over by ${formatCurrency(b.overBy, currencyCode)}`
                          : `${formatCurrency(b.remaining, currencyCode)} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State for Budget Widget */
          <div className="p-6 rounded-xl border border-dashed border-glass-border text-center flex flex-col items-center justify-center my-3">
            <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2">
              <PiggyBank className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-ink">No category budgets for this month</p>
            <p className="text-[11px] text-ink-muted max-w-xs mt-0.5 mb-3">
              Set monthly spending targets to visualize progress and track remaining balance.
            </p>
            <button
              type="button"
              onClick={onOpenSetBudget}
              className="btn-secondary text-xs gap-1.5 py-1.5 h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Set budget</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation Link */}
      {hasBudgets && (
        <div className="pt-3 border-t border-glass-border mt-3">
          <Link
            to="/budgets"
            className="btn-secondary text-xs w-full justify-center gap-1.5 h-8"
          >
            <PiggyBank className="h-3.5 w-3.5" />
            <span>View all category budgets ({budgets.length})</span>
          </Link>
        </div>
      )}
    </div>
  );
}

