import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Receipt,
  PiggyBank
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const currency = user?.currencyCode || 'INR';

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">
            Welcome, {user?.name || 'Tracker'}
          </h1>
          <p className="text-sm text-ink-soft">
            Here is your recorded financial overview for this period.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/transactions" className="btn-secondary text-xs gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            <span>Transactions</span>
          </Link>
          <Link to="/budgets" className="btn-primary text-xs gap-1.5">
            <PiggyBank className="h-3.5 w-3.5" />
            <span>Budgets</span>
          </Link>
        </div>
      </div>

      {/* Row 1: 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Income Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Total income</span>
            <div className="h-8 w-8 rounded-xl bg-income/10 text-income flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[28px] font-medium tabular-nums text-income">
            +₹0.00
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
            <ArrowUpRight className="h-3.5 w-3.5 text-income" />
            <span>Recorded receipts ({currency})</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Total expenses</span>
            <div className="h-8 w-8 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[28px] font-medium tabular-nums text-expense">
            −₹0.00
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
            <ArrowDownRight className="h-3.5 w-3.5 text-expense" />
            <span>Recorded spending ({currency})</span>
          </div>
        </div>

        {/* Net Cash Flow Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Net cash flow</span>
            <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-[28px] font-medium tabular-nums text-accent">
            ₹0.00
          </div>
          <div className="mt-2 text-xs text-ink-muted">
            <span>Income minus expenses</span>
          </div>
        </div>
      </div>

      {/* Empty State Banner inviting first transaction */}
      <div className="glass-strong p-8 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-glass-border">
        <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
          <PlusCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-medium text-ink">Ready to start tracking?</h2>
        <p className="text-sm text-ink-soft max-w-md mt-1 mb-4">
          Authentication is verified! Transaction APIs and charts will be integrated on Day 6 and Day 8.
        </p>
        <Link to="/transactions" className="btn-primary text-xs gap-1.5">
          <PlusCircle className="h-4 w-4" />
          <span>Go to Transactions</span>
        </Link>
      </div>
    </div>
  );
}
