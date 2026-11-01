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
    <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-glass-border bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center shadow-xs">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink leading-tight">Clarivo Copilot</h2>
          <p className="text-[11px] text-ink-muted leading-tight">Verified financial context</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {hasMessages && (
          <button
            type="button"
            onClick={onClear}
            className="h-8 w-8 rounded-full bg-field hover:bg-glass border border-glass-border flex items-center justify-center text-ink-soft hover:text-expense transition cursor-pointer"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-field hover:bg-glass-strong border border-glass-border flex items-center justify-center text-ink hover:text-accent hover:scale-105 transition cursor-pointer shrink-0"
            title="Close Copilot"
            aria-label="Close Copilot"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}

