import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';
import {
  addUserMessage,
  queryFinancialContext,
  clearCopilotChat
} from '../redux/slices/copilotSlice.js';
import { fetchAnalyticsSummary } from '../redux/slices/analyticsSlice.js';
import CopilotHeader from '../components/copilot/CopilotHeader.jsx';
import CopilotMessageList from '../components/copilot/CopilotMessageList.jsx';
import CopilotInput from '../components/copilot/CopilotInput.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

// Dedicated Copilot and Verified Financial Context page per Clarivo DESIGN.md (Section 9.10)
export default function CopilotPage() {
  const dispatch = useDispatch();
  const { messages, loading, error, lastContext } = useSelector((state) => state.copilot);
  const { summary } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  const currency = user?.currencyCode || 'INR';

  // Load authoritative financial summary on page mount so context numbers are always live
  useEffect(() => {
    dispatch(fetchAnalyticsSummary());
  }, [dispatch]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    dispatch(addUserMessage(query));
    setInputValue('');
    dispatch(queryFinancialContext({ question: query }));
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Financial Context Service Active</span>
          </div>
          <h1 className="text-2xl font-medium text-ink">Clarivo Copilot</h1>
          <p className="text-sm text-ink-soft">
            Explore verified financial insights and ask questions powered by authoritative database context.
          </p>
        </div>
      </div>

      {/* Main Grid: Chat Stream (8 cols) + Financial Context Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-8 glass-strong rounded-2xl border border-glass-border flex flex-col h-[650px] overflow-hidden shadow-glass">
          <CopilotHeader
            hasMessages={messages.length > 0}
            onClear={() => dispatch(clearCopilotChat())}
            showCloseButton={false}
          />

          <CopilotMessageList
            messages={messages}
            loading={loading}
            error={error}
            onSelectPrompt={handleSend}
            onRetry={() => {
              const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
              if (lastUserMsg) handleSend(lastUserMsg.text);
            }}
          />

          <CopilotInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSend()}
            loading={loading}
          />
        </div>

        {/* Right Column: Verified Financial Context Inspector */}
        <div className="lg:col-span-4 space-y-5">
          {/* Context Overview Card */}
          <div className="glass p-5 rounded-2xl border border-glass-border space-y-4">
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <h2 className="text-[15px] font-medium text-ink">Authoritative Context</h2>
              <span className="text-[11px] text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-lg">
                MongoDB Aggregation
              </span>
            </div>

            {/* Live Metrics Preview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-field border border-glass-border">
                <span className="text-ink-soft block text-[11px]">Recorded Income</span>
                <span className="text-base font-medium text-income tabular-nums mt-0.5 block">
                  +{formatCurrency(summary?.totalIncome || 0, currency)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-field border border-glass-border">
                <span className="text-ink-soft block text-[11px]">Recorded Spending</span>
                <span className="text-base font-medium text-expense tabular-nums mt-0.5 block">
                  −{formatCurrency(summary?.totalExpense || 0, currency)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-field border border-glass-border text-xs">
              <span className="text-ink-soft block text-[11px]">Net Cash Flow (Recorded Balance)</span>
              <span
                className={`text-lg font-medium tabular-nums mt-0.5 block ${
                  (summary?.netCashFlow || 0) >= 0 ? 'text-accent' : 'text-expense'
                }`}
              >
                {formatCurrency(summary?.netCashFlow || 0, currency)}
              </span>
            </div>

            <p className="text-[11px] text-ink-muted">
              Live totals queried directly from MongoDB. The AI Copilot uses this verified context to ensure accurate, non-hallucinated answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

