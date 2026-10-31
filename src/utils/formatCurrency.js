// Currency and date formatting utilities adhering to Clarivo DESIGN.md (Section 4)

// Format currency using Indian English locale with standard symbol
export const formatCurrency = (value, currencyCode = 'INR') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0.00';
  }

  // Ensure value is a decimal number
  const numericValue = typeof value === 'number' ? value : Number(value);

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  } catch (err) {
    // Fallback if currency code is unrecognized
    return `₹${numericValue.toFixed(2)}`;
  }
};

// Convert stored integer minor units (paise) to decimal currency for display
export const formatMinorUnits = (amountMinor, currencyCode = 'INR') => {
  const decimal = (amountMinor || 0) / 100;
  return formatCurrency(decimal, currencyCode);
};

// Format ISO date string to readable format e.g. "24 Oct 2026"
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Format ISO date string to concise format for tables e.g. "Oct 24, 2026"
export const formatTableDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Get current date string in YYYY-MM-DD format for date inputs
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current month in YYYY-MM format for budget selection
export const getCurrentMonthString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Format YYYY-MM to readable month label e.g. "October 2026"
export const formatMonthLabel = (monthString) => {
  if (!monthString) return 'Current month';
  const [year, month] = monthString.split('-');
  const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, 1));
  if (isNaN(date.getTime())) return monthString;
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Calculate adjacent month string (offset = -1 for prev, +1 for next)
export const getAdjacentMonth = (monthString, offset = 1) => {
  const current = monthString ? monthString : getCurrentMonthString();
  const [year, month] = current.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  const newYear = date.getUTCFullYear();
  const newMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
};
