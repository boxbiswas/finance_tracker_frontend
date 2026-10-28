import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { Sun, Moon } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Top-right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggle}
          className="btn-icon"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-warning" />
          ) : (
            <Moon className="h-4 w-4 text-accent" />
          )}
        </button>
      </div>

      {/* Brand Lockup & Tagline */}
      <div className="mb-6 text-center">
        <Logo size="large" />
        <p className="mt-2 text-sm text-ink-soft">Your money, made clear.</p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-strong w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-medium text-ink">Get started with Clarivo</h1>
          <p className="mt-1 text-xs text-ink-muted">Set up your account and base currency</p>
        </div>

        <RegisterForm />
      </div>

      {/* Footer Notice */}
      <p className="mt-8 text-center text-xs text-ink-muted">
        Clarivo Personal Finance Tracker &bull; Privacy-first financial analytics
      </p>
    </div>
  );
}
