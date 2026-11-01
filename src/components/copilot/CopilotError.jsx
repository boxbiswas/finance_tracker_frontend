import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

// Copilot error indicator with retry capability per Clarivo DESIGN.md (Section 9.8)
export default function CopilotError({
  message = "Couldn't retrieve your financial context. Try again.",
  onRetry
}) {
  return (
    <div className="flex justify-start w-full animate-in fade-in duration-200">
      <div className="w-full max-w-[90%] p-3.5 rounded-2xl bg-expense/10 border border-expense/20 text-xs text-expense space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink bg-glass hover:bg-glass-strong border border-glass-border px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retry query</span>
          </button>
        )}
      </div>
    </div>
  );
}

