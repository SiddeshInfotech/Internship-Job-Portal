import React from 'react';
import { useTheme } from '../context/ThemeContext';

/* Sun/moon switch. `floating` pins it to the top-right corner
   (used on auth pages); otherwise it sits inline in a header. */
function ThemeToggle({ floating = false }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="pf-focusable"
      style={{
        ...(floating
          ? { position: 'fixed', top: '24px', right: '24px', zIndex: 100 }
          : {}),
        width: 40,
        height: 40,
        borderRadius: '12px', // Modern rounded-square look (change to '99px' for full circle)
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'var(--pf-card)',
        border: '1px solid var(--pf-line-strong)',
        boxShadow: 'var(--pf-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06))',
        color: 'var(--pf-text-2)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.borderColor = 'var(--pf-primary, #6366f1)';
        e.currentTarget.style.color = 'var(--pf-primary, #6366f1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'var(--pf-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06))';
        e.currentTarget.style.borderColor = 'var(--pf-line-strong)';
        e.currentTarget.style.color = 'var(--pf-text-2)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      }}
    >
      {/* Animated SVG Icons */}
      <span
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: dark ? 'rotate(360deg) scale(1)' : 'rotate(0deg) scale(1)',
        }}
      >
        {dark ? (
          /* Sun Icon */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M6.34 17.66l-1.41 1.41" />
            <path d="M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          /* Moon Icon */
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
