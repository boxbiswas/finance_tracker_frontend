import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../redux/slices/authSlice.js';
import { User, Mail, Lock, Coins, ChevronDown, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currencyCode: 'INR',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const universalNameRegex = /^[a-zA-Z\u00C0-\u017F]+(?:\s[a-zA-Z\u00C0-\u017F]+)*$/;
  const numericDomainRegex = /@[0-9]+\.[a-zA-Z]{2,}$/;
  const pureNumericUserRegex = /^[0-9]+@/;
  const sequentialSpamRegex = /abcde|bcdef|cdefg|12345|23456|34567/i;

  const validate = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    // Full name validation
    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    } else if (trimmedName.length > 70) {
      errors.name = 'Full name is too long';
    } else if (!universalNameRegex.test(trimmedName)) {
      errors.name = 'Name must contain only letters and a single space between names. No numbers or symbols allowed.';
    } else if (/(.)\1{3,}/.test(trimmedName.replace(/\s/g, ''))) {
      errors.name = 'Name contains too many repeating characters.';
    }

    // Email address anti-spam validation
    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (trimmedEmail.length < 5) {
      errors.email = 'Email is too short';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (numericDomainRegex.test(trimmedEmail)) {
      errors.email = 'Purely numeric domains (like 123.com) are not authorised.';
    } else if (pureNumericUserRegex.test(trimmedEmail)) {
      errors.email = 'Usernames consisting entirely of numbers are not authorised.';
    } else if (sequentialSpamRegex.test(trimmedEmail.split('@')[0])) {
      errors.email = 'Sequential or automated email patterns are not allowed.';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(registerUser({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      currencyCode: formData.currencyCode
    }));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully! Please sign in to continue.');
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Global Error Banner */}
      {error && (
        <div className="rounded-xl border border-expense/30 bg-expense/10 px-4 py-3 text-xs text-expense flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="register-name">
          Full name
        </label>
        <div className="relative flex items-center">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Priya Sharma"
            className={`input input-with-icon ${validationErrors.name ? 'border-expense ring-1 ring-expense' : ''}`}
            disabled={loading}
          />
        </div>
        {validationErrors.name && (
          <p className="mt-1 text-xs text-expense">{validationErrors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="register-email">
          Email address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`input input-with-icon ${validationErrors.email ? 'border-expense ring-1 ring-expense' : ''}`}
            disabled={loading}
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-xs text-expense">{validationErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="register-password">
          Password (min. 6 characters)
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`input input-with-icon ${validationErrors.password ? 'border-expense ring-1 ring-expense' : ''}`}
            disabled={loading}
          />
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs text-expense">{validationErrors.password}</p>
        )}
      </div>

      {/* Currency Code Selection */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="register-currency">
          Base currency
        </label>
        <div className="relative flex items-center">
          <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <select
            id="register-currency"
            name="currencyCode"
            value={formData.currencyCode}
            onChange={handleChange}
            className="input input-with-icon pr-10 cursor-pointer appearance-none"
            disabled={loading}
          >
            <option value="INR">INR — Indian Rupee (₹)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
            <option value="GBP">GBP — British Pound (£)</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
        </div>
        <p className="mt-1 text-[11px] text-ink-muted">
          All financial totals and budgets will be tracked in this currency.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full mt-2 cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <span>Create account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-ink-soft pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
