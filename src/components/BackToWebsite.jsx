import React from 'react';
import { Link } from 'react-router-dom';

// Fixed-position so it works identically across every auth page regardless
// of that page's own layout (split-panel, centered card, inline styles,
// Tailwind, etc.) — one consistent way back to the public site from
// anywhere in the auth flow.
function BackToWebsite() {
  return (
    <Link
      to="/"
      className="pf-focusable"
      style={{
        position: 'fixed', top: '20px', left: '20px', zIndex: 100,
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '9px 15px', borderRadius: '999px',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--pf-line)', boxShadow: 'var(--pf-shadow-sm)',
        fontSize: '13px', fontWeight: 600, color: 'var(--pf-text-2)',
        textDecoration: 'none', transition: 'box-shadow 150ms ease, color 150ms ease',
        fontFamily: 'var(--pf-font)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--pf-shadow-md)'; e.currentTarget.style.color = 'var(--pf-text)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--pf-shadow-sm)'; e.currentTarget.style.color = 'var(--pf-text-2)'; }}
    >
      ← Back to website
    </Link>
  );
}

export default BackToWebsite;
