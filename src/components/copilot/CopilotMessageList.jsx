import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bot, Sparkles } from 'lucide-react';
import CopilotMessage from './CopilotMessage.jsx';
import CopilotLoading from './CopilotLoading.jsx';
import CopilotError from './CopilotError.jsx';
import CopilotSuggestions from './CopilotSuggestions.jsx';

// Conversation message list and empty state container per Clarivo DESIGN.md (Section 9.10)
export default function CopilotMessageList({
  messages = [],
  loading = false,
  error = null,
  onSelectPrompt,
  onRetry
}) {
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth?.user);
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  // Auto-scroll smoothly to bottom on message list updates or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, error]);

  return (
    <div
      data-copilot-messages
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar p-4 space-y-3.5"
    >
      {messages.length === 0 ? (
        <div className="space-y-4 py-1">
          {/* Hero Greeting inspired by MongoDB Atlas widget in Image 2 */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-ink tracking-tight">
                Hello {userName}!
              </h3>
              <p className="text-sm font-medium text-ink-soft">
                How can I help with your finances today?
              </p>
            </div>

            {/* Operational Status Pill */}
            <div className="p-3 rounded-2xl bg-card border border-glass-border flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-ink font-medium">MongoDB Context Live</span>
              </div>
              <span className="text-[11px] text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10">
                Connected
              </span>
            </div>
          </div>

          {/* Quick Suggested Inquiries */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              Suggested questions
            </p>
            <CopilotSuggestions onSelectPrompt={onSelectPrompt} />
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <CopilotMessage key={msg.id} message={msg} />
        ))
      )}

      {/* Typing Loading Indicator */}
      {loading && <CopilotLoading />}

      {/* Error Alert with Retry Action */}
      {error && !loading && (
        <CopilotError message={error} onRetry={onRetry} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

