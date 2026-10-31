import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { getCategoryDetails } from '../../utils/categoryColors.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useTheme } from '../../hooks/useTheme.js';
import ChartTooltip from './ChartTooltip.jsx';

// Category-wise expense distribution pie chart per Clarivo DESIGN.md (Section 3.2)
export default function CategoryPieChart({
  categoryData,
  loading,
  currencyCode = 'INR'
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Process and group slices under 3% into "Other" if more than 8 categories exist
  const chartData = useMemo(() => {
    const rawCategories = categoryData?.categories || [];
    if (!rawCategories.length) return [];

    if (rawCategories.length <= 8) {
      return rawCategories.map((item) => {
        const meta = getCategoryDetails(item.category);
        return {
          name: meta.label,
          categoryKey: item.category,
          value: item.amount,
          percentage: item.percentage,
          color: isDark ? meta.dark : meta.light
        };
      });
    }

    // Split major slices and small slices under 3%
    const major = [];
    let otherSum = 0;
    let otherPercentage = 0;

    rawCategories.forEach((item) => {
      if (item.percentage < 3) {
        otherSum += item.amount;
        otherPercentage += item.percentage;
      } else {
        const meta = getCategoryDetails(item.category);
        major.push({
          name: meta.label,
          categoryKey: item.category,
          value: item.amount,
          percentage: item.percentage,
          color: isDark ? meta.dark : meta.light
        });
      }
    });

    if (otherSum > 0) {
      major.push({
        name: 'Other',
        categoryKey: 'other_expense',
        value: otherSum,
        percentage: Number(otherPercentage.toFixed(1)),
        color: isDark ? '#94A3B8' : '#64748B'
      });
    }

    return major;
  }, [categoryData, isDark]);

  const hasData = chartData.length > 0 && (categoryData?.total || 0) > 0;

  return (
    <div className="glass p-5 rounded-2xl border border-glass-border flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-medium text-ink">Expenses by category</h2>
          <p className="text-xs text-ink-soft">Breakdown of recorded spending</p>
        </div>
        <span className="text-xs font-medium text-ink tabular-nums px-2.5 py-1 rounded-lg bg-track">
          {formatCurrency(categoryData?.total || 0, currencyCode)}
        </span>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div className="h-64 rounded-xl border border-dashed border-glass-border flex flex-col items-center justify-center text-center p-6">
          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2.5">
            <PieIcon className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-ink">No expense data for this period</p>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Expenses added in this timeframe will generate distribution slices.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recharts Pie Graphic */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke={isDark ? '#06130F' : '#ECFDF5'}
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltip currencyCode={currencyCode} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Slices Legend Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-glass-border/60 text-xs">
            {chartData.slice(0, 6).map((item, idx) => (
              <div key={`legend-${idx}`} className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="text-ink-soft truncate text-[11px] font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="text-ink-muted tabular-nums text-[11px] shrink-0">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
