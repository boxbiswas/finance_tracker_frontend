import React from 'react';
import { Sparkles, Trash2, X } from 'lucide-react';

// Copilot header with branding and action controls per Clarivo DESIGN.md (Section 9.10)
export default function CopilotHeader({
  onClear,
  onClose,
  hasMessages = false,
  showCloseButton = true
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-medium text-ink leading-tight">Clarivo Copilot</h2>
          <p className="text-[11px] text-ink-muted leading-tight">Verified financial context</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {hasMessages && (
          <button
            type="button"
            onClick={onClear}
            className="btn-ghost h-8 w-8 p-0 text-ink-soft hover:text-expense cursor-pointer"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost h-8 w-8 p-0 text-ink-soft hover:text-ink cursor-pointer"
            title="Close Copilot"
            aria-label="Close Copilot"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

