import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Suggested starter prompts representing verified server-side context queries
export default function CopilotSuggestions({ onSelectPrompt }) {
  const suggestions = [
    { label: 'How much did I spend this month?', category: 'Spending' },
    { label: 'Which category accounted for the highest expense?', category: 'Breakdown' },
    { label: 'Compare this month with last month.', category: 'Trends' },
    { label: 'Am I exceeding any budgets?', category: 'Budgets' },
    { label: 'What is the difference between my income and expenses?', category: 'Cash Flow' },
    { label: 'What does the spending chart tell me?', category: 'Charts' },
    { label: 'Show my largest expenses in the selected date range.', category: 'Expenses' }
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {suggestions.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectPrompt(item.label)}
          className="text-left text-xs text-ink-soft rounded-xl border border-glass-border bg-glass px-3.5 py-2.5 hover:bg-glass-strong hover:text-ink transition cursor-pointer flex items-center justify-between group"
        >
          <span className="truncate pr-2">{item.label}</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:text-accent transition" />
        </button>
      ))}
    </div>
  );
}

