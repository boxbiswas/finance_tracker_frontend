import { useMemo } from 'react';
import { useTheme } from './useTheme.js';

// Helper to read RGB CSS variable values from document root
const readVar = (name) => {
  if (typeof window === 'undefined') return '#000000';
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return '#000000';
  return val.startsWith('#') || val.startsWith('rgb') ? val : `rgb(${val})`;
};

// Custom hook to provide dynamic theme color strings for Recharts per Clarivo DESIGN.md (Section 12)
export function useChartColors() {
  const { theme } = useTheme();

  return useMemo(() => {
    // Read computed color tokens from current active theme (light or dark)
    const isDark = theme === 'dark';

    return {
      // Core financial series colors
      income: isDark ? '#34D399' : '#059669',
      expense: isDark ? '#FB7185' : '#E11D48',
      netCashFlow: isDark ? '#2DD4BF' : '#0F766E',
      accent: isDark ? '#34D399' : '#047857',

      // Text and chrome colors
      ink: isDark ? '#E5E9F5' : '#0F172A',
      inkSoft: isDark ? '#97A0B8' : '#475569',
      inkMuted: isDark ? '#7C88A5' : '#586A82',

      // Chart grid lines and surfaces
      grid: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 23, 42, 0.08)',
      glassBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.90)',
      glassBg: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.85)',
      canvas: isDark ? '#06130F' : '#ECFDF5'
    };
  }, [theme]);
}

export default useChartColors;
