import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Delete budget confirmation modal dialog adhering to Clarivo DESIGN.md (Section 9.7)
export default function DeleteBudgetModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  budget,
  currencyCode = 'INR'
}) {
  // Listen for Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !budget) return null;

  const cat = getCategoryDetails(budget.category);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-budget-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="glass-strong w-full max-w-[440px] rounded-2xl p-6 border border-glass-border shadow-glass space-y-5">
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 id="delete-budget-title" className="text-base font-medium text-ink">
              Delete category budget
            </h3>
            <p className="text-xs text-ink-soft mt-1">
              Delete this budget? Your recorded transactions will not be affected.
            </p>
          </div>
        </div>

        {/* Budget Details Preview Card */}
        <div className="p-3.5 rounded-xl bg-field border border-glass-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.light }}
            />
            <span className="font-medium text-ink">{cat.label}</span>
          </div>
          <div className="text-right">
            <span className="text-ink-muted">Limit: </span>
            <span className="font-medium text-ink tabular-nums">
              {formatCurrency(budget.limit, currencyCode)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Cancel on left, Destructive Delete on right */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn-secondary text-xs px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-danger text-xs px-4 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete budget</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

