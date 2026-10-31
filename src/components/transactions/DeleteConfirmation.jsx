import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatMinorUnits, formatDate } from '../../utils/formatCurrency.js';
import { getCategoryDetails } from '../../utils/categoryColors.js';

// Modal dialog for confirming permanent deletion of a transaction per Clarivo DESIGN.md (Section 9.7)
export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  transaction
}) {
  // Handle Escape key to close dialog
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

  if (!isOpen) return null;

  const categoryInfo = transaction ? getCategoryDetails(transaction.category) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="glass-strong w-full max-w-[440px] rounded-2xl p-6 border border-glass-border shadow-glass space-y-5">
        {/* Warning Icon and Header */}
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-base font-medium text-ink">
              Delete transaction
            </h3>
            <p className="text-xs text-ink-soft mt-1">
              Delete this transaction? This can't be undone.
            </p>
          </div>
        </div>

        {/* Transaction Detail Card */}
        {transaction && (
          <div className="p-3 rounded-xl bg-field border border-glass-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: categoryInfo?.light }}
              />
              <span className="font-medium text-ink">{categoryInfo?.label}</span>
              <span className="text-ink-muted">· {formatDate(transaction.transactionDate)}</span>
            </div>
            <span
              className={`font-medium tabular-nums ${
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              }`}
            >
              {transaction.type === 'income' ? '+' : '−'}
              {formatMinorUnits(transaction.amountMinor, transaction.currencyCode)}
            </span>
          </div>
        )}

        {/* Action Buttons: Cancel on left, Destructive action on right */}
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
              <span>Delete transaction</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
