import React from 'react';
import { Sparkles } from 'lucide-react';

// Copilot typing / thinking indicator per Clarivo DESIGN.md (Section 9.10)
export default function CopilotLoading({ text = 'Analyzing your recorded financial context...' }) {
  return (
    <div className="flex justify-start animate-in fade-in duration-200">
      <div className="bg-field border border-glass-border rounded-[16px_16px_16px_4px] px-4 py-3 flex items-center gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse delay-150" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse delay-300" />
        </div>
        <span className="text-[11px] font-medium text-ink-soft">{text}</span>
      </div>
    </div>
  );
}

