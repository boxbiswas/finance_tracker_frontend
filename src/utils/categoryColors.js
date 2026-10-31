// Category color definitions and labels adhering to Clarivo DESIGN.md (Section 3.2)
export const CATEGORY_METADATA = {
  // Income Categories
  salary: {
    label: 'Salary',
    type: 'income',
    light: '#059669',
    dark: '#34D399'
  },
  freelance: {
    label: 'Freelance',
    type: 'income',
    light: '#0D9488',
    dark: '#2DD4BF'
  },
  business: {
    label: 'Business',
    type: 'income',
    light: '#10B981',
    dark: '#34D399'
  },
  investment: {
    label: 'Investment',
    type: 'income',
    light: '#14B8A6',
    dark: '#2DD4BF'
  },
  gift: {
    label: 'Gift',
    type: 'income',
    light: '#34D399',
    dark: '#6EE7B7'
  },
  refund: {
    label: 'Refund',
    type: 'income',
    light: '#2DD4BF',
    dark: '#5EEAD4'
  },
  other_income: {
    label: 'Other Income',
    type: 'income',
    light: '#6EE7B7',
    dark: '#A7F3D0'
  },

  // Expense Categories
  food_dining: {
    label: 'Food & Dining',
    type: 'expense',
    light: '#D97706',
    dark: '#FBBF24'
  },
  housing: {
    label: 'Housing',
    type: 'expense',
    light: '#4F46E5',
    dark: '#818CF8'
  },
  transportation: {
    label: 'Transportation',
    type: 'expense',
    light: '#0284C7',
    dark: '#38BDF8'
  },
  utilities: {
    label: 'Utilities',
    type: 'expense',
    light: '#0891B2',
    dark: '#22D3EE'
  },
  healthcare: {
    label: 'Healthcare',
    type: 'expense',
    light: '#E11D48',
    dark: '#FB7185'
  },
  shopping: {
    label: 'Shopping',
    type: 'expense',
    light: '#7C3AED',
    dark: '#A78BFA'
  },
  entertainment: {
    label: 'Entertainment',
    type: 'expense',
    light: '#DB2777',
    dark: '#F472B6'
  },
  education: {
    label: 'Education',
    type: 'expense',
    light: '#0D9488',
    dark: '#2DD4BF'
  },
  travel: {
    label: 'Travel',
    type: 'expense',
    light: '#EA580C',
    dark: '#FB923C'
  },
  subscriptions: {
    label: 'Subscriptions',
    type: 'expense',
    light: '#C026D3',
    dark: '#E879F9'
  },
  personal_care: {
    label: 'Personal Care',
    type: 'expense',
    light: '#65A30D',
    dark: '#A3E635'
  },
  debt_payment: {
    label: 'Debt Payment',
    type: 'expense',
    light: '#78716C',
    dark: '#A8A29E'
  },
  other_expense: {
    label: 'Other Expense',
    type: 'expense',
    light: '#64748B',
    dark: '#94A3B8'
  }
};

// Retrieve category metadata with safe fallback and theme-reactive color
export const getCategoryDetails = (categoryKey, isDark) => {
  const isDarkMode = isDark !== undefined
    ? isDark
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const meta = CATEGORY_METADATA[categoryKey] || {
    label: categoryKey?.replace(/_/g, ' ') || 'Uncategorized',
    type: 'expense',
    light: '#64748B',
    dark: '#94A3B8'
  };
  return {
    ...meta,
    color: isDarkMode ? meta.dark : meta.light
  };
};

// Income category options list for dropdowns
export const INCOME_CATEGORIES = Object.keys(CATEGORY_METADATA)
  .filter((k) => CATEGORY_METADATA[k].type === 'income')
  .map((k) => ({ value: k, label: CATEGORY_METADATA[k].label }));

// Expense category options list for dropdowns
export const EXPENSE_CATEGORIES = Object.keys(CATEGORY_METADATA)
  .filter((k) => CATEGORY_METADATA[k].type === 'expense')
  .map((k) => ({ value: k, label: CATEGORY_METADATA[k].label }));

// All categories list for generic filters
export const ALL_CATEGORY_OPTIONS = Object.keys(CATEGORY_METADATA).map((k) => ({
  value: k,
  label: CATEGORY_METADATA[k].label,
  type: CATEGORY_METADATA[k].type
}));
