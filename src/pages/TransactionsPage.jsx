import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, CheckCircle2 } from 'lucide-react';
import TransactionHistory from '../components/transactions/TransactionHistory.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import ExportMenu from '../components/transactions/ExportMenu.jsx';
import {
  fetchTransactions,
  clearTransactionStatus
} from '../redux/slices/transactionSlice.js';

// Transactions management page adhering to Clarivo DESIGN.md
export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { successMessage, filters } = useSelector((state) => state.transactions);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Initial load of transactions on page mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Auto-dismiss success notification banner after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearTransactionStatus());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">Transactions</h1>
          <p className="text-sm text-ink-soft">
            Record, filter, and audit your personal finance flow.
          </p>
        </div>

        {/* Action Controls: Secondary Export Menu + Primary Add Transaction */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <ExportMenu filters={filters} />
          <button
            type="button"
            onClick={() => setIsFormModalOpen(true)}
            className="btn-primary text-xs gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add transaction</span>
          </button>
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
            onClick={() => dispatch(clearTransactionStatus())}
            className="text-xs font-medium hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Transaction History Container */}
      <TransactionHistory onOpenAddModal={() => setIsFormModalOpen(true)} />

      {/* Create Transaction Modal Form */}
      <TransactionForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => dispatch(fetchTransactions())}
      />
    </div>
  );
}
