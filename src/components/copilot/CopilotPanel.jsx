import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles, Bot } from 'lucide-react';
import {
  addUserMessage,
  queryFinancialContext,
  clearCopilotChat
} from '../../redux/slices/copilotSlice.js';
import CopilotHeader from './CopilotHeader.jsx';
import CopilotSuggestions from './CopilotSuggestions.jsx';
import CopilotMessage from './CopilotMessage.jsx';
import CopilotInput from './CopilotInput.jsx';

// Clarivo AI Copilot floating drawer panel per DESIGN.md (Section 9.10)
export default function CopilotPanel() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.copilot);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat thread on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Execute financial context query through Redux async thunk
  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    dispatch(addUserMessage(query));
    setInputValue('');
    dispatch(queryFinancialContext({ question: query }));
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button per Section 9.10 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close Clarivo Copilot' : 'Open Clarivo Copilot'}
          aria-expanded={isOpen}
          className="btn-primary shadow-glass h-12 px-4 rounded-full flex items-center gap-2 cursor-pointer transition transform active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Copilot</span>
        </button>
      </div>

      {/* Right-Hand Drawer Container per Section 9.10 (420px desktop, full screen mobile) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Clarivo Copilot"
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] glass-strong border-l border-glass-border shadow-2xl flex flex-col justify-between transition-all duration-200 animate-in slide-in-from-right"
        >
          {/* Modular Drawer Header */}
          <CopilotHeader
            hasMessages={messages.length > 0}
            onClear={() => dispatch(clearCopilotChat())}
            onClose={() => setIsOpen(false)}
          />

          {/* Chat Stream & Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-[15px] font-medium text-ink mb-1">
                  Ask Clarivo about your spending
                </h3>
                <p className="text-xs text-ink-muted max-w-xs mb-5">
                  Get instant insights, category breakdowns, and verified financial answers.
                </p>

                {/* Modular Suggestions Chips */}
                <CopilotSuggestions onSelectPrompt={handleSend} />
              </div>
            ) : (
              messages.map((msg) => (
                <CopilotMessage key={msg.id} message={msg} />
              ))
            )}

            {/* Three-dot Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-field border border-glass-border rounded-[16px_16px_16px_4px] px-4 py-3 flex items-center gap-1.5 text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse delay-150" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse delay-300" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Modular Input Bar */}
          <CopilotInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSend()}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}
