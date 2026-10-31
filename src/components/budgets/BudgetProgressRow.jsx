import React from 'react';
import { Pencil, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Budget progress bar and category status per Clarivo DESIGN.md (Section 2.4, 9.6)
export default function BudgetProgressRow({
  budget,
  onEdit,
  onDelete,
  currencyCode = 'INR'
}) {
  const cat = getCategoryDetails(budget.category);
  const percentage = budget.percentage || 0;
  const isOver = budget.isOverBudget;
  const isNear = budget.isNearLimit;

  // Determine fill color and semantic status per Section 2.4
  // Fill is bg-viz under 75%, bg-warning for 75-99%, and bg-expense at 100% or more
  let barColorClass = 'bg-income';
  let badgeColorClass = 'bg-income/10 text-income';
  let statusText = `${formatCurrency(budget.remaining, currencyCode)} left`;

  if (isOver) {
    barColorClass = 'bg-expense';
    badgeColorClass = 'bg-expense/10 text-expense';
    statusText = `Over by ${formatCurrency(budget.overBy, currencyCode)}`;
  } else if (isNear) {
    barColorClass = 'bg-warning';
    badgeColorClass = 'bg-warning/10 text-warning';
    statusText = `${formatCurrency(budget.remaining, currencyCode)} left (Near limit)`;
  }

  // Visual bar width capped at 100%
  const clampedWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className="glass-strong p-4 sm:p-5 rounded-2xl border border-glass-border space-y-3 transition hover:border-accent/30 group">
      {/* Top Line: Category information, spending/limit figures, and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Category Badge & Dot */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: cat.light }}
            aria-hidden="true"
          />
          <h3 className="text-sm font-medium text-ink truncate">
            {cat.label}
          </h3>

          {/* Semantic Status Badge */}
          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium shrink-0 ${badgeColorClass}`}>
            {percentage}%
            {isOver ? ' · Over limit' : isNear ? ' · Near limit' : ''}
          </span>
        </div>

        {/* Limit and Spending Figures (tabular-nums) */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-xs text-ink-soft">
            <span className="font-medium text-ink tabular-nums">
              {formatCurrency(budget.spent, currencyCode)}
            </span>
            <span className="text-ink-muted mx-1">/</span>
            <span className="text-ink-muted tabular-nums">
              {formatCurrency(budget.limit, currencyCode)}
            </span>
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => onEdit(budget)}
              aria-label={`Edit ${cat.label} budget`}
              title="Edit limit"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-glass transition active:scale-95 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(budget)}
              aria-label={`Delete ${cat.label} budget`}
              title="Delete budget"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-expense hover:bg-expense/10 transition active:scale-95 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8px Rounded-full Progress Track with Dynamic Fill */}
      <div className="h-2 w-full rounded-full bg-track overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
          style={{ width: `${clampedWidth}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Bottom Status Text: Remaining or Over by Amount */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <span className={`font-medium flex items-center gap-1.5 ${isOver ? 'text-expense' : isNear ? 'text-warning' : 'text-ink-soft'}`}>
          {isOver ? (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          ) : isNear ? (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-income shrink-0" />
          )}
          <span>{statusText}</span>
        </span>

        <span className="text-ink-muted text-[11px]">
          Monthly target
        </span>
      </div>
    </div>
  );
}

