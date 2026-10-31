import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bot, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  addUserMessage,
  queryFinancialContext,
  clearCopilotChat
} from '../redux/slices/copilotSlice.js';
import CopilotHeader from '../components/copilot/CopilotHeader.jsx';
import CopilotSuggestions from '../components/copilot/CopilotSuggestions.jsx';
import CopilotMessage from '../components/copilot/CopilotMessage.jsx';
import CopilotInput from '../components/copilot/CopilotInput.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

// Dedicated Copilot and Verified Financial Context page per Clarivo DESIGN.md (Section 9.10)
export default function CopilotPage() {
  const dispatch = useDispatch();
  const { messages, loading, lastContext } = useSelector((state) => state.copilot);
  const { summary } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  const currency = user?.currencyCode || 'INR';

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

      {/* Main Grid: Chat Stream (7 cols) + Financial Context Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-7 glass-strong rounded-2xl border border-glass-border flex flex-col h-[650px] justify-between overflow-hidden shadow-glass">
          <CopilotHeader
            hasMessages={messages.length > 0}
            onClear={() => dispatch(clearCopilotChat())}
            showCloseButton={false}
          />

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Bot className="h-6 w-6" />
                </div>
                <h2 className="text-[15px] font-medium text-ink mb-1">
                  Ask Clarivo about your spending
                </h2>
                <p className="text-xs text-ink-muted max-w-sm mb-5">
                  Select a prompt below or type any question to retrieve verified, user-scoped data.
                </p>

                <div className="w-full max-w-md">
                  <CopilotSuggestions onSelectPrompt={handleSend} />
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <CopilotMessage key={msg.id} message={msg} />
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-field border border-glass-border rounded-[16px_16px_16px_4px] px-4 py-3 flex items-center gap-1.5 text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse delay-150" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse delay-300" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <CopilotInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSend()}
            loading={loading}
          />
        </div>

        {/* Right Column: Verified Financial Context Inspector */}
        <div className="lg:col-span-5 space-y-5">
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
          </div>

          {/* Controlled Server Capabilities List */}
          <div className="glass-strong p-5 rounded-2xl border border-glass-border space-y-3">
            <h3 className="text-sm font-medium text-ink">Controlled Context Capabilities</h3>
            <p className="text-xs text-ink-muted">
              The service exposes 6 strict server functions preventing arbitrary database queries:
            </p>
            <ul className="text-xs text-ink-soft space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">getFinancialSummary()</strong> — Income, expense & cash flow</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">getCategoryBreakdown()</strong> — Top spending categories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">getMonthlyTrends()</strong> — Trajectory & month-over-month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">getBudgetStatus()</strong> — Limit checks & overspending alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">searchTransactions()</strong> — Capped largest expense lookup</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span><strong className="text-ink">getChartData()</strong> — Verified chart statistics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

