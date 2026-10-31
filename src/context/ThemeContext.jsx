import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create Theme Context for app-wide reactive light/dark theme management
export const ThemeContext = createContext();

// Theme Provider component maintaining active theme and localStorage synchronization per Clarivo DESIGN.md (Section 7)
export function ThemeProvider({ children }) {
  // Initialize theme from document element class (set by index.html pre-paint script) or localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (e) {
      // Fall back to DOM class or light default
    }
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  });

  // Keep DOM class and localStorage in sync whenever theme changes
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore storage write errors (e.g. private browsing quota)
    }
  }, [theme]);

  // Synchronize across multiple browser tabs via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle between light and dark modes
  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
    toggle,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to consume the active theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Safe fallback if used outside ThemeProvider
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      theme: isDark ? 'dark' : 'light',
      isDark,
      toggle: () => {},
      setTheme: () => {}
    };
  }
  return context;
}

export default useTheme;

