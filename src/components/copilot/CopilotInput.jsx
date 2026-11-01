import React from 'react';
import { Send, Loader2 } from 'lucide-react';

// Copilot input row with privacy notice per Clarivo DESIGN.md (Section 9.10)
export default function CopilotInput({
  value,
  onChange,
  onSend,
  loading = false,
  placeholder = 'Ask a question about your finances...'
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = Boolean(value.trim()) && !loading;

  return (
    <div className="shrink-0 p-3.5 border-t border-glass-border bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className="input text-xs h-10 px-3.5 rounded-xl bg-field border border-glass-border focus:border-brand"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`h-10 w-10 p-0 shrink-0 rounded-xl flex items-center justify-center transition cursor-pointer ${
            canSend
              ? 'bg-brand text-on-brand shadow-sm hover:brightness-110 active:scale-95'
              : 'bg-field text-ink-muted border border-glass-border opacity-50 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Privacy Notice per Section 9.10 */}
      <p className="mt-2 text-[10px] text-ink-muted text-center leading-tight">
        Private verified analysis. Minimum financial context shared with AI provider.
      </p>
    </div>
  );
}

