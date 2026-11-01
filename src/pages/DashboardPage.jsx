import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardSummary } from '../redux/slices/transactionSlice.js';
import {
  fetchAllAnalytics,
  setAnalyticsFilters,
  resetAnalyticsFilters
} from '../redux/slices/analyticsSlice.js';
import { fetchBudgets } from '../redux/slices/budgetSlice.js';
import { getCurrentMonthString } from '../utils/formatCurrency.js';

// Modular Dashboard Subcomponents per Clarivo DESIGN.md (Section 8)
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardSummaryCards from '../components/dashboard/DashboardSummaryCards.jsx';
import DashboardRecentTransactions from '../components/dashboard/DashboardRecentTransactions.jsx';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState.jsx';
import AnalyticsDateFilter from '../components/charts/AnalyticsDateFilter.jsx';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import TrendsLineChart from '../components/charts/TrendsLineChart.jsx';
import DashboardBudgetProgress from '../components/budgets/DashboardBudgetProgress.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import BudgetForm from '../components/budgets/BudgetForm.jsx';

// Fully integrated personal finance dashboard combining transactions, analytics, and budgets
export default function DashboardPage() {
  const dispatch = useDispatch();
  // Read authenticated user state
  const { user } = useSelector((state) => state.auth);
  // Read analytics metrics and chart datasets computed via MongoDB aggregation
  const { summary, categoryData, trends, filters, loading: analyticsLoading } = useSelector((state) => state.analytics);
  // Read recent transactions from transaction slice
  const { summary: txnSummary } = useSelector((state) => state.transactions);
  // Read active category budgets for current month from budget slice
  const { items: budgets, summary: budgetSummary, selectedMonth } = useSelector((state) => state.budgets);

  const currency = user?.currencyCode || 'INR';

  // Modal dialog states for quick creation directly from the dashboard
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Synchronously fetch transactions, analytics, and budgets on dashboard load
  const loadDashboardData = async (activeFilters) => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(fetchAllAnalytics(activeFilters)),
      dispatch(fetchDashboardSummary()),
      dispatch(fetchBudgets(getCurrentMonthString()))
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  // Handle date-range filter changes across charts and summary cards
  const handleFilterChange = (newFilters) => {
    dispatch(setAnalyticsFilters(newFilters));
    dispatch(fetchAllAnalytics(newFilters));
  };

  // Handle filter reset back to default 6-month view
  const handleResetFilters = () => {
    dispatch(resetAnalyticsFilters());
    dispatch(fetchAllAnalytics({ from: '', to: '', months: 6 }));
  };

  // Callback when a new transaction is successfully added from the dashboard
  const handleTransactionSuccess = () => {
    loadDashboardData(filters);
  };

  // Check if any transactions have been recorded in the database
  const hasTransactions = (summary?.transactionCount || txnSummary?.totalCount || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header Greeting and Quick Action Controls */}
      <DashboardHeader
        userName={user?.name || 'Tracker'}
        isRefreshing={isRefreshing}
        onRefresh={() => loadDashboardData(filters)}
        onOpenTransactionModal={() => setIsTxnModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        filters={{ from: filters.from, to: filters.to }}
      />

      {/* Date Filter Bar for Analytics Period Selection */}
      <div className="glass p-3 rounded-2xl border border-glass-border">
        <AnalyticsDateFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Row 1: 3 Summary Cards (Income, Expenses, Net Cash Flow / Recorded Balance) */}
      <DashboardSummaryCards
        summary={summary}
        currency={currency}
      />

      {/* Main Visualizations, Budgets, and Activity Grid */}
      {hasTransactions ? (
        <div className="space-y-6">
          {/* Row 2: Monthly Comparison Bar Chart (8 cols) and Category Breakdown Pie Chart (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-8">
              <MonthlyBarChart
                trends={trends}
                loading={analyticsLoading}
                currencyCode={currency}
              />
            </div>
            <div className="lg:col-span-4">
              <CategoryPieChart
                categoryData={categoryData}
                loading={analyticsLoading}
                currencyCode={currency}
              />
            </div>
          </div>

          {/* Row 3: Budget Progress Widget (5 cols) and Recent Transactions Ledger (7 cols) per Section 8 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-5">
              <DashboardBudgetProgress
                budgets={budgets}
                summary={budgetSummary}
                selectedMonth={selectedMonth || getCurrentMonthString()}
                onOpenSetBudget={() => setIsBudgetModalOpen(true)}
                currencyCode={currency}
              />
            </div>
            <div className="lg:col-span-7">
              <DashboardRecentTransactions
                transactions={txnSummary?.recentTransactions}
                currency={currency}
              />
            </div>
          </div>

          {/* Row 4: Net Cash Flow Financial Trajectory Area Chart (Full Width) */}
          <div className="w-full">
            <TrendsLineChart
              trends={trends}
              loading={analyticsLoading}
              currencyCode={currency}
            />
          </div>
        </div>
      ) : (
        /* Empty State Banner when no transactions exist yet */
        <DashboardEmptyState
          onOpenTransactionModal={() => setIsTxnModalOpen(true)}
        />
      )}

      {/* Quick Add Transaction Modal Form */}
      <TransactionForm
        isOpen={isTxnModalOpen}
        onClose={() => setIsTxnModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      {/* Quick Set Budget Modal Form */}
      <BudgetForm
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        selectedMonth={selectedMonth || getCurrentMonthString()}
      />
    </div>
  );
}
