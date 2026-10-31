import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2, Loader2 } from 'lucide-react';
import { formatMinorUnits, formatTableDate } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Desktop transaction table per Clarivo DESIGN.md (Section 9.4)
export default function TransactionTable({
  transactions,
  onDeleteRequest,
  deletingId
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-glass-border glass-strong shadow-glass">
      <table className="w-full text-left border-collapse">
        {/* Sticky Header */}
        <thead>
          <tr className="border-b border-glass-border bg-field/50 text-xs font-medium text-ink-soft">
            <th scope="col" className="py-3 px-4 w-32">Date</th>
            <th scope="col" className="py-3 px-4 w-48">Category</th>
            <th scope="col" className="py-3 px-4">Notes</th>
            <th scope="col" className="py-3 px-4 text-right w-40">Amount</th>
            <th scope="col" className="py-3 px-4 text-right w-20">Actions</th>
          </tr>
        </thead>

        {/* 52px Rows */}
        <tbody className="divide-y divide-glass-border">
          {transactions.map((txn) => {
            const isIncome = txn.type === 'income';
            const categoryInfo = getCategoryDetails(txn.category);
            const isRowDeleting = deletingId === (txn.id || txn._id);

            return (
              <tr
                key={txn.id || txn._id}
                className="h-[52px] transition hover:bg-accent/5 group"
              >
                {/* Date Column */}
                <td className="py-3 px-4 text-xs text-ink-soft whitespace-nowrap">
                  {formatTableDate(txn.transactionDate)}
                </td>

                {/* Category Badge with dot */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs bg-track">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: categoryInfo.light }}
                      aria-hidden="true"
                    />
                    <span className="text-ink-soft font-medium">
                      {categoryInfo.label}
                    </span>
                  </div>
                </td>

                {/* Notes Column with hover tooltip */}
                <td className="py-3 px-4 text-xs text-ink max-w-xs truncate" title={txn.notes || ''}>
                  {txn.notes ? (
                    <span className="truncate block">{txn.notes}</span>
                  ) : (
                    <span className="text-ink-muted italic">—</span>
                  )}
                </td>

                {/* Signed, colored amount column with tabular numerals */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium tabular-nums ${
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
                      {formatMinorUnits(txn.amountMinor, txn.currencyCode)}
                    </span>
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(txn)}
                    disabled={isRowDeleting}
                    aria-label={`Delete ${categoryInfo.label} transaction`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:text-expense hover:bg-expense/10 transition active:scale-95 disabled:opacity-50"
                  >
                    {isRowDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-expense" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
