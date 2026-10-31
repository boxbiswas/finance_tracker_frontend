import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice.js';
import { useTheme } from '../hooks/useTheme.js';
import Logo from './ui/Logo.jsx';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PiggyBank },
    { name: 'Copilot', path: '/copilot', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-glass-strong backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo Lockup */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent font-medium shadow-xs'
                        : 'text-ink-soft hover:bg-glass hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Pill */}
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

          {/* User Info Badge */}
          {user && (
            <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-3 py-1.5 text-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium text-ink leading-tight">{user.name}</span>
                <span className="text-[10px] text-ink-muted leading-tight">{user.currencyCode || 'INR'}</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="btn-ghost h-9 px-3 text-xs gap-1.5 text-expense hover:bg-expense/10 cursor-pointer"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn-secondary h-9 w-9 rounded-full p-0 flex items-center justify-center text-ink-soft"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-accent" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost h-9 w-9 p-0 flex items-center justify-center text-ink"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-glass-border bg-glass-strong px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-ink-soft hover:bg-glass hover:text-ink'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </NavLink>
            );
          })}
          {user && (
            <div className="pt-2 border-t border-glass-border flex items-center justify-between">
              <span className="text-xs text-ink-soft">
                Signed in as <strong className="text-ink">{user.name}</strong> ({user.currencyCode || 'INR'})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-ghost text-xs text-expense gap-1 py-1 px-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
