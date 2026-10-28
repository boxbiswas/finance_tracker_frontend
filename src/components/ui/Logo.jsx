import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'default', showWordmark = true }) {
  const isLarge = size === 'large';

  return (
    <Link to="/dashboard" className="inline-flex items-center gap-2.5 group select-none">
      {/* Brand Icon: 32px/40px rounded-xl gradient tile with open 'C' glyph and upward growth tick */}
      <div
        className={`flex items-center justify-center rounded-xl bg-brand text-on-brand shadow-sm transition-transform group-hover:scale-105 ${
          isLarge ? 'h-10 w-10' : 'h-8 w-8'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isLarge ? 'h-6 w-6' : 'h-5 w-5'}
        >
          {/* Open 'C' arc with an upward tick */}
          <path d="M18 7.5A8 8 0 1 0 18 16.5" />
          <path d="M15 4.5L19.5 4.5L19.5 9" />
          <path d="M12 12L19.5 4.5" />
        </svg>
      </div>

      {showWordmark && (
        <span
          className={`font-medium tracking-tight text-ink ${
            isLarge ? 'text-2xl' : 'text-lg'
          }`}
          style={{ letterSpacing: '-0.01em' }}
        >
          Clarivo
        </span>
      )}
    </Link>
  );
}
