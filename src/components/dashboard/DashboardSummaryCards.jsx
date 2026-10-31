import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Summary metrics cards for Income, Expenses, and Net Cash Flow per Clarivo DESIGN.md (Sections 1, 8)
export default function DashboardSummaryCards({
  summary = {},
  currency = 'INR'
}) {
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const netCashFlow = summary?.netCashFlow || 0;
  const incomeCount = summary?.incomeCount || 0;
  const expenseCount = summary?.expenseCount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {/* Total Income Card */}
      <div className="glass p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
          <span>Total income</span>
          <div className="h-8 w-8 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="text-[28px] font-medium tabular-nums text-income">
          +{formatCurrency(totalIncome, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
          <ArrowUpRight className="h-3.5 w-3.5 text-income" />
          <span>{incomeCount} recorded receipts ({currency})</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="glass p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
          <span>Total expenses</span>
          <div className="h-8 w-8 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
        <div className="text-[28px] font-medium tabular-nums text-expense">
          −{formatCurrency(totalExpense, currency)}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
          <ArrowDownRight className="h-3.5 w-3.5 text-expense" />
          <span>{expenseCount} recorded expenditures ({currency})</span>
        </div>
      </div>

      {/* Net Cash Flow / Recorded Balance Card (Honest Wording per Section 1) */}
      <div className="glass p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
          <span>Net cash flow</span>
          <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div
          className={`text-[28px] font-medium tabular-nums ${
            netCashFlow >= 0 ? 'text-accent' : 'text-expense'
          }`}
        >
          {formatCurrency(netCashFlow, currency)}
        </div>
        <div className="mt-2 text-xs text-ink-muted">
          <span>Recorded balance: income minus expenses</span>
        </div>
      </div>
    </div>
  );
}

