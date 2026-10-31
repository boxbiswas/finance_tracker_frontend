import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Wallet, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatMinorUnits, formatTableDate } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Renders chat message bubble with rich verified financial context cards
export default function CopilotMessage({ message }) {
  const isUser = message.sender === 'user';
  const context = message.context;
  const intent = message.intent;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] text-xs leading-relaxed p-3.5 bg-brand text-on-brand rounded-[16px_16px_4px_16px] shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] text-xs leading-relaxed p-4 bg-field border border-glass-border text-ink rounded-[16px_16px_16px_4px] space-y-3">
        {/* Main Answer Summary */}
        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>

        {/* Structured Context: Financial Summary & Cash Flow */}
        {intent === 'financial_summary' && context && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-glass-border/60">
            <div className="p-2 rounded-xl bg-glass border border-glass-border/60">
              <span className="text-[10px] text-ink-muted block">Income</span>
              <span className="font-medium text-income tabular-nums">
                +{formatCurrency(context.totalIncome, context.currency)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-glass border border-glass-border/60">
              <span className="text-[10px] text-ink-muted block">Expenses</span>
              <span className="font-medium text-expense tabular-nums">
                −{formatCurrency(context.totalExpense, context.currency)}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-glass border border-glass-border/60">
              <span className="text-[10px] text-ink-muted block">Net Flow</span>
              <span className={`font-medium tabular-nums ${context.netCashFlow >= 0 ? 'text-accent' : 'text-expense'}`}>
                {formatCurrency(context.netCashFlow, context.currency)}
              </span>
            </div>
          </div>
        )}

        {/* Structured Context: Budget Status */}
        {intent === 'budget_status' && context && (
          <div className="space-y-2 pt-2 border-t border-glass-border/60">
            {context.hasExceededBudgets ? (
              <div className="p-2.5 rounded-xl bg-expense/10 text-expense text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Exceeded Budgets ({context.exceededCount})</span>
                </div>
                {context.exceededBudgets.map((b) => (
                  <div key={b.category} className="flex justify-between text-[10px]">
                    <span className="capitalize">{b.category.replace(/_/g, ' ')}</span>
                    <span className="font-medium">Over by ₹{b.overBy} ({b.percentage}%)</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-income/10 text-income text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>All {context.budgets.length} budgets are healthy and within limits</span>
              </div>
            )}
          </div>
        )}

        {/* Structured Context: Largest Expenses Mini Table */}
        {intent === 'largest_expenses' && context?.transactions && (
          <div className="pt-2 border-t border-glass-border/60 space-y-1.5">
            <span className="text-[11px] font-medium text-ink-soft block">Top Recorded Transactions:</span>
            <div className="divide-y divide-glass-border/50 rounded-xl bg-glass border border-glass-border/60 px-2.5">
              {context.transactions.map((t) => {
                const cat = getCategoryDetails(t.category);
                return (
                  <div key={t.id} className="py-1.5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color || cat.light }}
                      />
                      <span className="font-medium text-ink truncate">{cat.label}</span>
                    </div>
                    <span className="font-medium text-expense tabular-nums">
                      −{formatCurrency(t.amount, t.currencyCode)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verified Data Badge */}
        {context && (
          <div className="pt-2 border-t border-glass-border/40 flex items-center justify-between text-[10px] text-ink-muted">
            <span className="inline-flex items-center gap-1 text-accent">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified server-side context</span>
            </span>
            <span>Scoped to your data</span>
          </div>
        )}
      </div>
    </div>
  );
}

