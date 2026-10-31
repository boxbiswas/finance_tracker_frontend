import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

// Error state card per Clarivo DESIGN.md (Section 9.9)
export default function TransactionErrorState({ message, onRetry }) {
  return (
    <div className="glass-strong p-8 text-center rounded-2xl flex flex-col items-center justify-center border border-expense/20">
      {/* Expense icon tile */}
      <div className="h-12 w-12 rounded-2xl bg-expense/10 text-expense flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>

      {/* Human error headline */}
      <h3 className="text-base font-medium text-ink">Couldn't load transactions</h3>

      {/* Plain language message */}
      <p className="text-xs text-ink-soft max-w-sm mt-1 mb-4">
        {message || 'A network error occurred while connecting to the server. Please check your connection and retry.'}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-secondary text-xs gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try again</span>
        </button>
      )}
    </div>
  );
}
