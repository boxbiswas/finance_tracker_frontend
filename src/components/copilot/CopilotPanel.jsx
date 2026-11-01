import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles } from 'lucide-react';
import {
  addUserMessage,
  queryFinancialContext,
  clearCopilotChat
} from '../../redux/slices/copilotSlice.js';
import CopilotHeader from './CopilotHeader.jsx';
import CopilotMessageList from './CopilotMessageList.jsx';
import CopilotInput from './CopilotInput.jsx';

// Collapsible Copilot panel drawer allowing questions while viewing the dashboard per Day 15 specification
export default function CopilotPanel() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.copilot);
  const analyticsFilters = useSelector((state) => state.analytics?.filters);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedChart, setSelectedChart] = useState('monthly_comparison');
  const panelRef = useRef(null);

  // Isolate wheel scrolling to Copilot widget so background page never scrolls
  useEffect(() => {
    const panel = panelRef.current;
    if (!isOpen || !panel) return;

    const handleWheel = (e) => {
      const scrollable = panel.querySelector('[data-copilot-messages]');
      if (!scrollable) {
        e.preventDefault();
        return;
      }

      const isInsideScrollable = scrollable.contains(e.target);
      const isAtTop = scrollable.scrollTop <= 0;
      const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

      if (isInsideScrollable) {
        // Prevent scroll chaining to the background dashboard when hitting boundaries
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
          e.preventDefault();
        }
      } else {
        // When cursor is over header or input row, redirect scroll into message list
        if (e.deltaY < 0 && !isAtTop) {
          scrollable.scrollTop += e.deltaY;
          e.preventDefault();
        } else if (e.deltaY > 0 && !isAtBottom) {
          scrollable.scrollTop += e.deltaY;
          e.preventDefault();
        } else {
          e.preventDefault();
        }
      }
    };

    panel.addEventListener('wheel', handleWheel, { passive: false });
    return () => panel.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  // Submit query incorporating active dashboard scope and conversation history
  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    // 1. Add user question to Redux message thread
    dispatch(addUserMessage(query));
    setInputValue('');

    // 2. Dispatch query with active dashboard context
    dispatch(
      queryFinancialContext({
        question: query,
        dashboardContext: {
          dateRange: {
            from: analyticsFilters?.from || '',
            to: analyticsFilters?.to || '',
            months: analyticsFilters?.months || 6
          },
          selectedChart,
          activeFilters: analyticsFilters || {}
        }
      })
    );
  };

  // Retry the last user question if a network or backend error occurred
  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button (Visible when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Clarivo Copilot"
            aria-expanded={false}
            className="btn-primary shadow-2xl h-12 px-5 rounded-full flex items-center gap-2.5 cursor-pointer transition transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Copilot</span>
          </button>
        </div>
      )}

      {/* Floating Assistant Card Widget (MongoDB Atlas inspired, floating card layout) */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Clarivo Copilot"
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] md:w-[430px] h-[620px] max-h-[85vh] glass-strong border border-glass-border rounded-3xl shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          {/* Drawer Header */}
          <CopilotHeader
            hasMessages={messages.length > 0}
            onClear={() => dispatch(clearCopilotChat())}
            onClose={() => setIsOpen(false)}
          />

          {/* Conversation Message List, Loading, Error, and Suggested Questions */}
          <CopilotMessageList
            messages={messages}
            loading={loading}
            error={error}
            onSelectPrompt={handleSend}
            onRetry={handleRetry}
          />

          {/* Input Bar with Privacy Notice */}
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
