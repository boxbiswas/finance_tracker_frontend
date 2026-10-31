import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Check, AlertCircle, Loader2 } from 'lucide-react';
import { createBudget, updateBudget } from '../../redux/slices/budgetSlice.js';
import { EXPENSE_CATEGORIES, getCategoryDetails } from '../../utils/categoryColors.js';
import { getCurrentMonthString, formatMonthLabel } from '../../utils/formatCurrency.js';

// Modal dialog for setting or updating a category budget per Clarivo DESIGN.md
export default function BudgetForm({
  isOpen,
  onClose,
  editingBudget = null,
  selectedMonth
}) {
  const dispatch = useDispatch();
  const { submitting, error, items } = useSelector((state) => state.budgets);
  const { user } = useSelector((state) => state.auth);
  const currencyCode = user?.currencyCode || 'INR';

  // Existing budgeted categories for this month (to prevent duplicates in dropdown)
  const budgetedCategories = new Set(items.map((b) => b.category));

  // Available expense categories for new budget creation
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !budgetedCategories.has(cat.value) || editingBudget?.category === cat.value
  );

  // Form state
  const [category, setCategory] = useState(
    editingBudget ? editingBudget.category : availableCategories[0]?.value || EXPENSE_CATEGORIES[0]?.value
  );
  const [limit, setLimit] = useState(
    editingBudget ? String(editingBudget.limit) : ''
  );
  const [month, setMonth] = useState(
    editingBudget
      ? editingBudget.monthStart?.substring(0, 7) || selectedMonth || getCurrentMonthString()
      : selectedMonth || getCurrentMonthString()
  );
  const [clientErrors, setClientErrors] = useState({});

  // Sync state whenever editingBudget changes or modal opens
  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setLimit(String(editingBudget.limit));
      if (editingBudget.monthStart) {
        setMonth(editingBudget.monthStart.substring(0, 7));
      }
    } else {
      const defaultCategory = availableCategories[0]?.value || EXPENSE_CATEGORIES[0]?.value;
      setCategory(defaultCategory);
      setLimit('');
      setMonth(selectedMonth || getCurrentMonthString());
    }
    setClientErrors({});
  }, [editingBudget, isOpen, selectedMonth]);

  // Handle Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  // Validate form fields prior to submission
  const validate = () => {
    const errors = {};
    const parsedLimit = parseFloat(limit);

    if (!limit || isNaN(parsedLimit) || parsedLimit <= 0) {
      errors.limit = 'Please enter a valid positive budget limit';
    }

    if (!category) {
      errors.category = 'Please choose an expense category';
    }

    if (!month) {
      errors.month = 'Please select a budget month';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    if (editingBudget) {
      // Dispatch update action
      const result = await dispatch(
        updateBudget({
          id: editingBudget.id,
          limit: parseFloat(limit)
        })
      );
      if (updateBudget.fulfilled.match(result)) {
        onClose();
      }
    } else {
      // Dispatch create action
      const result = await dispatch(
        createBudget({
          category,
          limit: parseFloat(limit),
          month,
          currencyCode
        })
      );
      if (createBudget.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  const isEditing = Boolean(editingBudget);
  const editingCategoryMeta = isEditing ? getCategoryDetails(editingBudget.category) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="glass-strong w-full max-w-[460px] rounded-2xl p-6 border border-glass-border shadow-glass space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <div>
            <h2 id="budget-form-title" className="text-lg font-medium text-ink">
              {isEditing ? 'Edit budget limit' : 'Set category budget'}
            </h2>
            <p className="text-xs text-ink-soft">
              {isEditing
                ? `Adjust monthly spending ceiling for ${editingCategoryMeta?.label}.`
                : 'Define a monthly spending target to monitor expenses and prevent overspending.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close dialog"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-glass transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-xs text-expense flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label htmlFor="budget-category" className="block text-xs font-medium text-ink-soft mb-1">
              Category
            </label>
            {isEditing ? (
              <div className="p-3 rounded-xl bg-field border border-glass-border flex items-center gap-2.5 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: editingCategoryMeta?.light }}
                />
                <span className="font-medium text-ink">{editingCategoryMeta?.label}</span>
                <span className="text-ink-muted text-[11px] ml-auto">Fixed category</span>
              </div>
            ) : (
              <select
                id="budget-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (clientErrors.category) setClientErrors({ ...clientErrors, category: undefined });
                }}
                className={`input text-xs py-2 h-11 w-full ${
                  clientErrors.category ? 'border-expense text-expense' : ''
                }`}
              >
                {availableCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            )}
            {clientErrors.category && (
              <p className="text-xs text-expense mt-1">{clientErrors.category}</p>
            )}
          </div>

          {/* Monthly Spending Limit Field with Currency Symbol & Right-aligned Tabular-nums */}
          <div>
            <label htmlFor="budget-limit" className="block text-xs font-medium text-ink-soft mb-1">
              Monthly budget limit ({currencyCode})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium">
                {currencyCode === 'INR' ? '₹' : '$'}
              </span>
              <input
                id="budget-limit"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={limit}
                onChange={(e) => {
                  setLimit(e.target.value);
                  if (clientErrors.limit) setClientErrors({ ...clientErrors, limit: undefined });
                }}
                className={`input pl-8 text-right font-medium tabular-nums text-sm ${
                  clientErrors.limit ? 'border-expense text-expense' : ''
                }`}
                aria-invalid={Boolean(clientErrors.limit)}
              />
            </div>
            {clientErrors.limit && (
              <p className="text-xs text-expense mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{clientErrors.limit}</span>
              </p>
            )}
          </div>

          {/* Month Selection */}
          {!isEditing && (
            <div>
              <label htmlFor="budget-month" className="block text-xs font-medium text-ink-soft mb-1">
                Budget period (month)
              </label>
              <input
                id="budget-month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input text-xs py-2 h-11 w-full"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Targeting: {formatMonthLabel(month)}
              </p>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-glass-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary text-xs px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs px-4 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save changes</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Set budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

