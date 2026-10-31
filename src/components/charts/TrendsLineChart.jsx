import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useChartColors } from '../../hooks/useChartColors.js';
import ChartTooltip from './ChartTooltip.jsx';

// Format short monetary amounts on Y-axis
const formatYAxisTick = (val) => {
  if (val === 0) return '0';
  if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (Math.abs(val) >= 1000) return `₹${Math.round(val / 1000)}k`;
  return `₹${val}`;
};

// Net Cash Flow Financial Trends Line Chart per Clarivo DESIGN.md (Section 3.1)
export default function TrendsLineChart({
  trends = [],
  loading,
  currencyCode = 'INR'
}) {
  const colors = useChartColors();
  const hasData = trends.length > 0 && trends.some((t) => t.netCashFlow !== 0 || t.income > 0);

  return (
    <div className="glass p-5 rounded-2xl border border-glass-border flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[15px] font-medium text-ink">Net cash flow trend</h2>
          <p className="text-xs text-ink-soft">Monthly savings trajectory (income minus expenses)</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: colors.netCashFlow }}
            aria-hidden="true"
          />
          <span className="text-ink-soft">Net flow</span>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div className="h-64 rounded-xl border border-dashed border-glass-border flex flex-col items-center justify-center text-center p-6">
          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2.5">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-ink">No trend data available</p>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Record income and expenses to visualize your cash flow trend over time.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trends}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="netCashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.netCashFlow} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={colors.netCashFlow} stopOpacity={0.0} />
                </linearGradient>
              </defs>

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
                content={<ChartTooltip currencyCode={currencyCode} />}
              />

              {/* Net Cash Flow Area Line */}
              <Area
                type="monotone"
                dataKey="netCashFlow"
                name="Net Cash Flow"
                stroke={colors.netCashFlow}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#netCashFlowGradient)"
                dot={{ fill: colors.netCashFlow, r: 3.5, strokeWidth: 1.5, stroke: '#FFFFFF' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: colors.netCashFlow }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
