import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Custom chart tooltip adhering to Clarivo DESIGN.md (Section 3.3)
export default function ChartTooltip({ active, payload, label, currencyCode = 'INR' }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="glass-strong rounded-xl p-3 border border-glass-border shadow-glass text-xs space-y-1.5 min-w-[150px]">
      {/* Tooltip Header / Date Label */}
      {label && (
        <div className="font-medium text-ink border-b border-glass-border/60 pb-1 mb-1">
          {label}
        </div>
      )}

      {/* Series Items */}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const isNegative = entry.value < 0;
          return (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || entry.fill }}
                  aria-hidden="true"
                />
                <span className="text-ink-soft truncate capitalize">
                  {entry.name}
                </span>
              </div>
              <span className="font-medium text-ink tabular-nums">
                {isNegative ? '−' : ''}
                {formatCurrency(Math.abs(entry.value), currencyCode)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
