import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2, Loader2 } from 'lucide-react';
import { formatMinorUnits, formatTableDate } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Mobile transaction card view per Clarivo DESIGN.md (Section 9.4)
export default function TransactionCard({
  transaction,
  onDeleteRequest,
  isDeleting
}) {
  const isIncome = transaction.type === 'income';
  const categoryInfo = getCategoryDetails(transaction.category);
  const formattedAmount = formatMinorUnits(transaction.amountMinor, transaction.currencyCode);
  const formattedDate = formatTableDate(transaction.transactionDate);

  return (
    <div className="glass-strong p-4 rounded-xl border border-glass-border space-y-2.5 transition hover:border-accent/30">
      {/* Top Row: Category dot & title on left, Signed amount on right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* Category color dot */}
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: categoryInfo.light }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-ink truncate">
            {categoryInfo.label}
          </span>
        </div>

        {/* Amount with directional companion indicator */}
        <div
          className={`flex items-center gap-1 text-sm font-medium tabular-nums shrink-0 ${
            isIncome ? 'text-income' : 'text-expense'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>
            {isIncome ? '+' : '−'}
            {formattedAmount}
          </span>
        </div>
      </div>

      {/* Bottom Row: Date, Notes truncate, and Delete action button */}
      <div className="flex items-center justify-between text-xs text-ink-soft pt-1 border-t border-glass-border/50">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="text-ink-muted shrink-0">{formattedDate}</span>
          {transaction.notes && (
            <>
              <span className="text-ink-muted">·</span>
              <span className="truncate italic text-ink-soft" title={transaction.notes}>
                {transaction.notes}
              </span>
            </>
          )}
        </div>

        {/* Delete action button with 44px min touch target */}
        <button
          type="button"
          onClick={() => onDeleteRequest(transaction)}
          disabled={isDeleting}
          aria-label={`Delete ${categoryInfo.label} transaction`}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-expense hover:bg-expense/10 transition active:scale-95 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-expense" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
