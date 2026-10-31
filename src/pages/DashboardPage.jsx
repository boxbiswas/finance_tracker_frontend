import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Receipt,
  PiggyBank,
  ChevronRight
} from 'lucide-react';
import { fetchDashboardSummary } from '../redux/slices/transactionSlice.js';
import {
  fetchAllAnalytics,
  setAnalyticsFilters,
  resetAnalyticsFilters
} from '../redux/slices/analyticsSlice.js';
import { formatCurrency, formatMinorUnits, formatTableDate } from '../utils/formatCurrency.js';
import { getCategoryDetails } from '../utils/categoryColors.js';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import TrendsLineChart from '../components/charts/TrendsLineChart.jsx';
import AnalyticsDateFilter from '../components/charts/AnalyticsDateFilter.jsx';

// Financial overview dashboard with charts and aggregations per Clarivo DESIGN.md
export default function DashboardPage() {
  const dispatch = useDispatch();
  // Read authenticated user state
  const { user } = useSelector((state) => state.auth);
  // Read analytics metrics and chart datasets computed via MongoDB aggregation
  const { summary, categoryData, trends, filters, loading } = useSelector((state) => state.analytics);
  // Read recent transactions from transaction slice
  const { summary: txnSummary } = useSelector((state) => state.transactions);
  const currency = user?.currencyCode || 'INR';

  // Fetch all analytics and recent transaction records on initial load
  useEffect(() => {
    dispatch(fetchAllAnalytics());
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  // Handle date filter changes and refresh aggregation pipelines
  const handleFilterChange = (newFilters) => {
    dispatch(setAnalyticsFilters(newFilters));
    dispatch(fetchAllAnalytics(newFilters));
  };

  // Handle filter reset to default 6-month view
  const handleResetFilters = () => {
    dispatch(resetAnalyticsFilters());
    dispatch(fetchAllAnalytics({ from: '', to: '', months: 6 }));
  };

  // Check if any transactions have been recorded in the system
  const hasTransactions = (summary?.transactionCount || txnSummary?.totalCount || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header Greeting and Quick Action Links */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">
            Welcome, {user?.name || 'Tracker'}
          </h1>
          <p className="text-sm text-ink-soft">
            Here is your recorded financial overview and analytics for this period.
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

      {/* Date Filter Bar for Analytics Period Selection */}
      <div className="glass p-3 rounded-2xl border border-glass-border">
        <AnalyticsDateFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Row 1: 3 Summary Cards (Income, Expenses, Net Cash Flow / Balance) */}
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
            +{formatCurrency(summary?.totalIncome || 0, currency)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
            <ArrowUpRight className="h-3.5 w-3.5 text-income" />
            <span>{summary?.incomeCount || 0} recorded receipts ({currency})</span>
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
            −{formatCurrency(summary?.totalExpense || 0, currency)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
            <ArrowDownRight className="h-3.5 w-3.5 text-expense" />
            <span>{summary?.expenseCount || 0} recorded spending entries ({currency})</span>
          </div>
        </div>

        {/* Net Cash Flow / Balance Card */}
        <div className="glass p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Net cash flow</span>
            <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`text-[28px] font-medium tabular-nums ${(summary?.netCashFlow || 0) >= 0 ? 'text-accent' : 'text-expense'
              }`}
          >
            {formatCurrency(summary?.netCashFlow || 0, currency)}
          </div>
          <div className="mt-2 text-xs text-ink-muted">
            <span>Recorded balance (income minus expenses)</span>
          </div>
        </div>
      </div>

      {/* Visualizations and Activity Grid */}
      {hasTransactions ? (
        <div className="space-y-6">
          {/* Row 2: Monthly Trends Bar Chart (8 cols) and Category Breakdown Pie Chart (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-8">
              <MonthlyBarChart
                trends={trends}
                loading={loading}
                currencyCode={currency}
              />
            </div>
            <div className="lg:col-span-4">
              <CategoryPieChart
                categoryData={categoryData}
                loading={loading}
                currencyCode={currency}
              />
            </div>
          </div>

          {/* Row 3: Net Cash Flow Trend Line Chart (7 cols) and Recent Transactions (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-7">
              <TrendsLineChart
                trends={trends}
                loading={loading}
                currencyCode={currency}
              />
            </div>

            {/* Recent Transactions List */}
            <div className="lg:col-span-5 glass-strong p-5 rounded-2xl border border-glass-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-glass-border pb-3 mb-3">
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

                <div className="divide-y divide-glass-border">
                  {(txnSummary?.recentTransactions || []).slice(0, 5).map((txn) => {
                    const isIncome = txn.type === 'income';
                    const cat = getCategoryDetails(txn.category);

                    return (
                      <div
                        key={txn.id || txn._id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.light }}
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

                        <span
                          className={`font-medium tabular-nums shrink-0 ${isIncome ? 'text-income' : 'text-expense'
                            }`}
                        >
                          {isIncome ? '+' : '−'}
                          {formatMinorUnits(txn.amountMinor, txn.currencyCode)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View all transactions action button */}
              <div className="pt-3 border-t border-glass-border mt-3">
                <Link
                  to="/transactions"
                  className="btn-secondary text-xs w-full justify-center gap-1.5"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Open transaction ledger</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Banner when no transactions exist yet */
        <div className="glass-strong p-10 text-center rounded-2xl flex flex-col items-center justify-center border border-dashed border-glass-border">
          <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
            <PlusCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-medium text-ink">Ready to start tracking?</h2>
          <p className="text-sm text-ink-soft max-w-md mt-1 mb-4">
            Record your first income or expense to generate live Recharts visualizations, monthly trends, and spending breakdown.
          </p>
          <Link to="/transactions" className="btn-primary text-xs gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>Add your first transaction</span>
          </Link>
        </div>
      )}
    </div>
  );
}
