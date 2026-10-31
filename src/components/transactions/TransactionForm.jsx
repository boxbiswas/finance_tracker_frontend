import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { createTransaction } from '../../redux/slices/transactionSlice.js';
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from '../../utils/categoryColors.js';
import { getTodayDateString } from '../../utils/formatCurrency.js';

// Add Transaction Modal Form per Clarivo DESIGN.md (Sections 9.2, 9.3, 9.7)
export default function TransactionForm({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { submitting, error } = useSelector((state) => state.transactions);
  const { user } = useSelector((state) => state.auth);
  const userCurrency = user?.currencyCode || 'INR';

  // Local form state
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]?.value || '');
  const [transactionDate, setTransactionDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [clientErrors, setClientErrors] = useState({});

  // Reset category default whenever transaction type toggles
  useEffect(() => {
    if (type === 'income') {
      setCategory(INCOME_CATEGORIES[0]?.value || '');
    } else {
      setCategory(EXPENSE_CATEGORIES[0]?.value || '');
    }
    setClientErrors((prev) => ({ ...prev, category: undefined }));
  }, [type]);

  // Handle Escape key to close modal
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

  // Validate form before dispatching API request
  const validate = () => {
    const errors = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = 'Please enter a valid positive amount';
    }

    if (!category) {
      errors.category = 'Please choose a category';
    }

    if (!transactionDate) {
      errors.transactionDate = 'Please select a date';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    const payload = {
      type,
      amount: parseFloat(amount),
      category,
      transactionDate: new Date(transactionDate).toISOString(),
      notes: notes.trim(),
      currencyCode: userCurrency
    };

    const result = await dispatch(createTransaction(payload));
    if (createTransaction.fulfilled.match(result)) {
      // Clear form
      setAmount('');
      setNotes('');
      setTransactionDate(getTodayDateString());
      setClientErrors({});
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const categoryList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="glass-strong w-full max-w-[480px] rounded-2xl p-6 border border-glass-border shadow-glass space-y-5">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <div>
            <h2 id="transaction-form-title" className="text-lg font-medium text-ink">
              Add transaction
            </h2>
            <p className="text-xs text-ink-soft">
              Record a new income receipt or expense payment.
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

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-xs text-expense flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector (Pill segmented control per Section 9.3) */}
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1.5">
              Transaction type
            </label>
            <div className="grid grid-cols-2 p-1 rounded-full bg-track border border-glass-border">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-1.5 rounded-full text-xs font-medium transition cursor-pointer text-center ${
                  type === 'expense'
                    ? 'bg-brand text-on-brand shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-1.5 rounded-full text-xs font-medium transition cursor-pointer text-center ${
                  type === 'income'
                    ? 'bg-brand text-on-brand shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount Field with Currency Prefix (tabular-nums) */}
          <div>
            <label htmlFor="txn-amount" className="block text-xs font-medium text-ink-soft mb-1">
              Amount ({userCurrency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium">
                {userCurrency === 'INR' ? '₹' : '$'}
              </span>
              <input
                id="txn-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (clientErrors.amount) setClientErrors({ ...clientErrors, amount: undefined });
                }}
                className={`input pl-8 text-right font-medium tabular-nums text-sm ${
                  clientErrors.amount ? 'border-expense text-expense' : ''
                }`}
                aria-invalid={Boolean(clientErrors.amount)}
              />
            </div>
            {clientErrors.amount && (
              <p className="text-xs text-expense mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{clientErrors.amount}</span>
              </p>
            )}
          </div>

          {/* Category Dropdown (Filtered by selected type) */}
          <div>
            <label htmlFor="txn-category" className="block text-xs font-medium text-ink-soft mb-1">
              Category
            </label>
            <select
              id="txn-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (clientErrors.category) setClientErrors({ ...clientErrors, category: undefined });
              }}
              className={`input text-xs py-2 h-11 w-full ${
                clientErrors.category ? 'border-expense text-expense' : ''
              }`}
            >
              {categoryList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {clientErrors.category && (
              <p className="text-xs text-expense mt-1">{clientErrors.category}</p>
            )}
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="txn-date" className="block text-xs font-medium text-ink-soft mb-1">
              Date
            </label>
            <input
              id="txn-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="input text-xs py-2 h-11 w-full"
            />
          </div>

          {/* Notes Input (Max 500 characters) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="txn-notes" className="text-xs font-medium text-ink-soft">
                Notes (optional)
              </label>
              <span className="text-[11px] text-ink-muted">
                {notes.length}/500
              </span>
            </div>
            <input
              id="txn-notes"
              type="text"
              maxLength={500}
              placeholder="e.g. Weekly grocery trip or freelance milestone"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input text-xs py-2 h-11 w-full"
            />
          </div>

          {/* Footer Controls: Cancel and Submit button */}
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
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
