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
      title={dark ? 'Light theme' : 'Dark theme'}
      className="pf-focusable"
      style={{
        ...(floating
          ? { position: 'fixed', top: '20px', right: '20px', zIndex: 100 }
          : {}),
        width: 36, height: 36, borderRadius: '99px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, cursor: 'pointer',
        background: 'var(--pf-card)',
        border: '1px solid var(--pf-line-strong)',
        boxShadow: 'var(--pf-shadow-xs)',
        color: 'var(--pf-text-2)',
        transition: 'background 150ms ease, border-color 150ms ease, transform 150ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span aria-hidden="true">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}

export default ThemeToggle;
