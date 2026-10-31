import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionTable from './TransactionTable.jsx';
import TransactionCard from './TransactionCard.jsx';
import TransactionFilters from './TransactionFilters.jsx';
import TransactionSkeleton from './TransactionSkeleton.jsx';
import TransactionEmptyState from './TransactionEmptyState.jsx';
import TransactionErrorState from './TransactionErrorState.jsx';
import DeleteConfirmation from './DeleteConfirmation.jsx';
import {
  fetchTransactions,
  setFilters,
  resetFilters,
  setPage,
  deleteTransaction
} from '../../redux/slices/transactionSlice.js';

// TransactionHistory orchestrator component per Clarivo DESIGN.md (Section 9.4)
export default function TransactionHistory({ onOpenAddModal }) {
  const dispatch = useDispatch();
  const {
    items: transactions,
    pagination,
    filters,
    loading,
    error,
    deletingId
  } = useSelector((state) => state.transactions);

  // Local state for delete confirmation dialog
  const [targetTxn, setTargetTxn] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle filter changes and trigger new fetch
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchTransactions(newFilters));
  };

  // Handle filter resets
  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(
      fetchTransactions({
        from: '',
        to: '',
        type: '',
        category: '',
        sort: 'date_desc',
        page: 1,
        limit: 10
      })
    );
  };

  // Handle page pagination transitions
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination?.totalPages || 1)) return;
    dispatch(setPage(newPage));
    dispatch(fetchTransactions({ page: newPage }));
  };

  // Open delete confirmation modal
  const handleRequestDelete = (txn) => {
    setTargetTxn(txn);
    setIsDeleteModalOpen(true);
  };

  // Execute deletion after modal confirmation
  const handleConfirmDelete = async () => {
    if (!targetTxn) return;
    const txnId = targetTxn.id || targetTxn._id;
    await dispatch(deleteTransaction(txnId));
    setIsDeleteModalOpen(false);
    setTargetTxn(null);
  };

  const isFiltered = Boolean(
    filters.from ||
    filters.to ||
    filters.type ||
    filters.category ||
    filters.sort !== 'date_desc'
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Panel */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      {loading ? (
        <TransactionSkeleton rows={5} />
      ) : error ? (
        <TransactionErrorState
          message={error}
          onRetry={() => dispatch(fetchTransactions())}
        />
      ) : transactions.length === 0 ? (
        <TransactionEmptyState
          isFiltered={isFiltered}
          onOpenAddModal={onOpenAddModal}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View (sm breakpoint and above) */}
          <div className="hidden sm:block">
            <TransactionTable
              transactions={transactions}
              onDeleteRequest={handleRequestDelete}
              deletingId={deletingId}
            />
          </div>

          {/* Mobile Card List View (under sm breakpoint) */}
          <div className="sm:hidden space-y-3">
            {transactions.map((txn) => (
              <TransactionCard
                key={txn.id || txn._id}
                transaction={txn}
                onDeleteRequest={handleRequestDelete}
                isDeleting={deletingId === (txn.id || txn._id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="glass p-3 rounded-xl border border-glass-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
              <div>
                Showing{' '}
                <span className="font-medium text-ink">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-ink">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium text-ink">{pagination.total}</span>{' '}
                records
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn-secondary text-xs px-3 py-1.5 h-8 gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-2 font-medium text-ink">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary text-xs px-3 py-1.5 h-8 gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deletingId)}
        transaction={targetTxn}
      />
    </div>
  );
}
