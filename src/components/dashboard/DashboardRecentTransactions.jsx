import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Receipt } from 'lucide-react';
import { formatMinorUnits, formatTableDate } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Recent transaction ledger widget for the dashboard per Clarivo DESIGN.md (Section 8)
export default function DashboardRecentTransactions({
  transactions = [],
  currency = 'INR'
}) {
  const displayList = (transactions || []).slice(0, 5);

  return (
    <div className="glass-strong p-5 rounded-2xl border border-glass-border flex flex-col justify-between">
      <div>
        {/* Header with Direct Link to Ledger */}
        <div className="flex items-center justify-between border-b border-glass-border pb-3 mb-3.5">
          <div>
            <h2 className="text-[15px] font-medium text-ink">Recent transactions</h2>
            <p className="text-xs text-ink-soft">Latest entries recorded to your account</p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Recent Transactions List */}
        <div className="divide-y divide-glass-border">
          {displayList.map((txn) => {
            const isIncome = txn.type === 'income';
            const cat = getCategoryDetails(txn.category);

            return (
              <div
                key={txn.id || txn._id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Category Color Dot adapting to active light/dark theme */}
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || cat.light }}
                  />
                  <div className="truncate">
                    <span className="font-medium text-ink block">{cat.label}</span>
                    {txn.notes ? (
                      <span className="text-ink-muted truncate block text-[11px]">
                        {txn.notes}
                      </span>
                    ) : (
                      <span className="text-ink-muted text-[11px]">
                        {formatTableDate(txn.transactionDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount with Directional Sign & Tabular Numbers */}
                <span
                  className={`font-medium tabular-nums shrink-0 ${
                    isIncome ? 'text-income' : 'text-expense'
                  }`}
                >
                  {isIncome ? '+' : '−'}
                  {formatMinorUnits(txn.amountMinor, txn.currencyCode || currency)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button: View Full Ledger */}
      <div className="pt-3 border-t border-glass-border mt-3">
        <Link
          to="/transactions"
          className="btn-secondary text-xs w-full justify-center gap-1.5 h-8 cursor-pointer"
        >
          <Receipt className="h-3.5 w-3.5" />
          <span>Open transaction ledger</span>
        </Link>
      </div>
    </div>
  );
}

