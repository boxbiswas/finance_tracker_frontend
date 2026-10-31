import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table, Loader2, Check, AlertCircle } from 'lucide-react';
import api from '../../https/axios.js';
import { getTodayDateString } from '../../utils/formatCurrency.js';

// Export controls dropdown menu adhering to Clarivo DESIGN.md (Section 9.11)
export default function ExportMenu({ filters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Execute export download for CSV or PDF
  const handleExport = async (format) => {
    try {
      setDownloadingFormat(format);
      setExportError(null);
      setExportSuccess(null);

      // Clean query parameters omitting blanks
      const params = { format };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;

      // Fetch file as blob through authenticated Axios instance
      const response = await api.get('/exports/transactions', {
        params,
        responseType: 'blob'
      });

      // Extract filename from response header or default per DESIGN.md
      let filename = `clarivo-transactions-${getTodayDateString()}.${format}`;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create blob URL and initiate native browser download
      const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv;charset=utf-8;';
      const blob = new Blob([response.data], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setExportSuccess(`${format.toUpperCase()} downloaded`);
      setTimeout(() => {
        setExportSuccess(null);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      // Human error message adhering to DESIGN.md Section 9.8
      setExportError("Couldn't export your transactions. Try again.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Human description of active filter criteria
  const filterSummary = [];
  if (filters.from && filters.to) {
    filterSummary.push(`${filters.from} to ${filters.to}`);
  } else if (filters.from) {
    filterSummary.push(`From ${filters.from}`);
  } else if (filters.to) {
    filterSummary.push(`Up to ${filters.to}`);
  } else {
    filterSummary.push('All dates');
  }

  if (filters.type) {
    filterSummary.push(filters.type === 'income' ? 'Income only' : 'Expenses only');
  }
  if (filters.category) {
    filterSummary.push(filters.category.replace(/_/g, ' '));
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Secondary button with download icon per Section 9.11 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Export transactions"
        className="btn-secondary text-xs gap-1.5 h-9 cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 text-ink-soft" />
        <span>Export</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-glass-border glass-strong shadow-glass p-2 z-50 animate-in fade-in duration-150">
          {/* Active Filters Scope Notice per Section 9.11 */}
          <div className="px-3 py-2 border-b border-glass-border/60 mb-1">
            <span className="text-[11px] font-medium text-ink block">Export scope</span>
            <span className="text-[11px] text-ink-muted truncate block" title={filterSummary.join(' · ')}>
              {filterSummary.join(' · ')}
            </span>
          </div>

          {/* Feedback Alerts */}
          {exportError && (
            <div className="p-2 mb-1 rounded-xl bg-expense/10 text-expense text-[11px] flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {exportSuccess && (
            <div className="p-2 mb-1 rounded-xl bg-income/10 text-income text-[11px] flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Download CSV Option */}
          <button
            type="button"
            onClick={() => handleExport('csv')}
            disabled={Boolean(downloadingFormat)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-glass text-ink transition cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Table className="h-4 w-4 text-accent" />
              <div className="text-left">
                <span className="font-medium block">Download CSV</span>
                <span className="text-[10px] text-ink-muted block">Spreadsheet data with raw amounts</span>
              </div>
            </div>
            {downloadingFormat === 'csv' && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
          </button>

          {/* Download PDF Option */}
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={Boolean(downloadingFormat)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-glass text-ink transition cursor-pointer disabled:opacity-50 mt-0.5"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-expense" />
              <div className="text-left">
                <span className="font-medium block">Download PDF</span>
                <span className="text-[10px] text-ink-muted block">Formatted financial report & summary</span>
              </div>
            </div>
            {downloadingFormat === 'pdf' && <Loader2 className="h-3.5 w-3.5 animate-spin text-expense" />}
          </button>
        </div>
      )}
    </div>
  );
}

