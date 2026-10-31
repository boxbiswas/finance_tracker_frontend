import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import {
  fetchBudgets,
  setSelectedMonth,
  deleteBudget,
  clearBudgetStatus
} from '../redux/slices/budgetSlice.js';
import {
  getCurrentMonthString,
  formatMonthLabel,
  getAdjacentMonth
} from '../utils/formatCurrency.js';
import BudgetProgressRow from '../components/budgets/BudgetProgressRow.jsx';
import BudgetSummaryCards from '../components/budgets/BudgetSummaryCards.jsx';
import BudgetForm from '../components/budgets/BudgetForm.jsx';
import DeleteBudgetModal from '../components/budgets/DeleteBudgetModal.jsx';
import BudgetEmptyState from '../components/budgets/BudgetEmptyState.jsx';

// Budget management and progress tracking view per Clarivo DESIGN.md
export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    items: budgets,
    summary,
    selectedMonth,
    loading,
    error,
    successMessage,
    deletingId
  } = useSelector((state) => state.budgets);

  const currencyCode = user?.currencyCode || 'INR';

  // Modal dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetBudget, setTargetBudget] = useState(null);

  // Fetch budgets whenever selectedMonth changes
  useEffect(() => {
    dispatch(fetchBudgets(selectedMonth));
  }, [dispatch, selectedMonth]);

  // Auto-dismiss success notification banners after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearBudgetStatus());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    const prev = getAdjacentMonth(selectedMonth, -1);
    dispatch(setSelectedMonth(prev));
  };

  const handleNextMonth = () => {
    const next = getAdjacentMonth(selectedMonth, 1);
    dispatch(setSelectedMonth(next));
  };

  const handleThisMonth = () => {
    dispatch(setSelectedMonth(getCurrentMonthString()));
  };

  // Open add budget modal
  const handleOpenAdd = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  // Open edit budget modal
  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  // Open delete budget confirmation modal
  const handleOpenDelete = (budget) => {
    setTargetBudget(budget);
    setIsDeleteOpen(true);
  };

  // Confirm and execute budget deletion
  const handleConfirmDelete = async () => {
    if (!targetBudget) return;
    await dispatch(deleteBudget(targetBudget.id));
    setIsDeleteOpen(false);
    setTargetBudget(null);
  };

  const isCurrentMonth = selectedMonth === getCurrentMonthString();

  return (
    <div className="space-y-6">
      {/* Header Greeting and Month Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">Category budgets</h1>
          <p className="text-sm text-ink-soft">
            Set monthly spending limits for expense categories and monitor actual spending.
          </p>
        </div>

        {/* Primary Action Button (One per view per Section 9.2) */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary text-xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Set budget</span>
        </button>
      </div>

      {/* Month Navigation and Period Bar */}
      <div className="glass p-3 rounded-2xl border border-glass-border flex flex-wrap items-center justify-between gap-3">
        {/* Month Arrows and Display Label */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="h-9 w-9 rounded-xl border border-glass-border hover:bg-glass flex items-center justify-center text-ink-soft hover:text-ink transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-field border border-glass-border flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-ink">
              {formatMonthLabel(selectedMonth)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="h-9 w-9 rounded-xl border border-glass-border hover:bg-glass flex items-center justify-center text-ink-soft hover:text-ink transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {!isCurrentMonth && (
            <button
              type="button"
              onClick={handleThisMonth}
              className="px-2.5 py-1 rounded-full text-xs font-medium border border-glass-border hover:bg-glass text-accent transition cursor-pointer ml-1"
            >
              Current month
            </button>
          )}
        </div>

        {/* Direct Month Picker Input */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="jump-month" className="text-ink-muted hidden sm:inline">
            Jump to:
          </label>
          <input
            id="jump-month"
            type="month"
            value={selectedMonth}
            onChange={(e) => dispatch(setSelectedMonth(e.target.value))}
            className="input h-9 text-xs px-2.5 py-1 w-36"
          />
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="glass p-3 rounded-xl border border-income/30 bg-income/5 text-xs text-income flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearBudgetStatus())}
            className="text-xs font-medium hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error State Banner */}
      {error && (
        <div className="glass p-3 rounded-xl border border-expense/30 bg-expense/5 text-xs text-expense flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(fetchBudgets(selectedMonth))}
            className="text-xs font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Month Summary Cards */}
      {budgets.length > 0 && (
        <BudgetSummaryCards summary={summary} currencyCode={currencyCode} />
      )}

      {/* Category Budgets List or Empty State */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-strong p-5 rounded-2xl animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-track rounded" />
                <div className="h-4 w-24 bg-track rounded" />
              </div>
              <div className="h-2 w-full bg-track rounded-full" />
              <div className="h-3 w-28 bg-track rounded" />
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <BudgetEmptyState
          month={selectedMonth}
          onOpenAddModal={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-ink">
              Category spending limits ({budgets.length})
            </h2>
            <span className="text-xs text-ink-muted">
              Live spending computed from recorded transactions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {budgets.map((b) => (
              <BudgetProgressRow
                key={b.id}
                budget={b}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Budget Modal Form */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingBudget={editingBudget}
        selectedMonth={selectedMonth}
      />

      {/* Delete Budget Confirmation Dialog */}
      <DeleteBudgetModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deletingId)}
        budget={targetBudget}
        currencyCode={currencyCode}
      />
    </div>
  );
}
