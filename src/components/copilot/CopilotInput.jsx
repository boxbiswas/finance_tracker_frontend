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

  return (
    <div className="p-4 border-t border-glass-border bg-glass-strong">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className="input text-xs"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || loading}
          aria-label="Send message"
          className="btn-primary h-11 w-11 p-0 shrink-0 rounded-xl cursor-pointer disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Privacy Notice per Section 9.10 */}
      <p className="mt-2 text-[11px] text-ink-muted text-center">
        Your question and the minimum required financial context may be sent to the configured AI provider.
      </p>
    </div>
  );
}

