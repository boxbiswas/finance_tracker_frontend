import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../redux/slices/authSlice.js';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
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

    const result = await dispatch(loginUser({
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    }));

    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`);
      navigate('/dashboard');
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

      {/* Email Field */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="login-email">
          Email address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            id="login-email"
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
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-ink-soft" htmlFor="login-password">
            Password
          </label>
        </div>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full mt-2 cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-ink-soft pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
