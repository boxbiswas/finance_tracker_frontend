import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useChartColors } from '../../hooks/useChartColors.js';
import ChartTooltip from './ChartTooltip.jsx';

// Format short monetary amounts on Y-axis (e.g. ₹50k, ₹1.2L)
const formatYAxisTick = (val) => {
  if (val === 0) return '0';
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${Math.round(val / 1000)}k`;
  return `₹${val}`;
};

// Monthly Income vs Expense Bar Chart per Clarivo DESIGN.md (Section 3.1)
export default function MonthlyBarChart({
  trends = [],
  loading,
  currencyCode = 'INR'
}) {
  const colors = useChartColors();
  const hasData = trends.length > 0 && trends.some((t) => t.income > 0 || t.expense > 0);

  return (
    <div className="glass p-5 rounded-2xl border border-glass-border flex flex-col justify-between">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[15px] font-medium text-ink">Monthly comparison</h2>
          <p className="text-xs text-ink-soft">Recorded income vs expenses over time</p>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors.income }}
              aria-hidden="true"
            />
            <span className="text-ink-soft">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors.expense }}
              aria-hidden="true"
            />
            <span className="text-ink-soft">Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div className="h-64 rounded-xl border border-dashed border-glass-border flex flex-col items-center justify-center text-center p-6">
          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2.5">
            <BarChart3 className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-ink">No monthly trends recorded</p>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Data will appear once transactions are logged across calendar months.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trends}
              barGap={4}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              {/* Horizontal Gridlines Only */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colors.grid}
              />

              {/* X Axis */}
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: colors.grid }}
                tick={{ fill: colors.inkMuted, fontSize: 11 }}
              />

              {/* Y Axis with tabular numbers */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
                tick={{ fill: colors.inkMuted, fontSize: 11 }}
              />

              {/* Interactive Tooltip */}
              <Tooltip
                cursor={{ fill: colors.grid, opacity: 0.5 }}
                content={<ChartTooltip currencyCode={currencyCode} />}
              />

              {/* Income Bars with rounded top */}
              <Bar
                name="Income"
                dataKey="income"
                fill={colors.income}
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />

              {/* Expense Bars with rounded top */}
              <Bar
                name="Expense"
                dataKey="expense"
                fill={colors.expense}
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
