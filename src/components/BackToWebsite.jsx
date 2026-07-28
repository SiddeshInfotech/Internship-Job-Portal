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
      style={{
        position: 'fixed', top: '20px', left: '20px', zIndex: 100,
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '9px 15px', borderRadius: '999px',
        whiteSpace: 'nowrap', width: 'auto', maxWidth: 'none',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--pf-line)', boxShadow: 'var(--pf-shadow-sm)',
        fontSize: '13px', fontWeight: 600, color: 'var(--pf-text-2)',
        textDecoration: 'none',
        fontFamily: 'var(--pf-font)',
      }}
    >
      ← Back to website
    </Link>
  );
}

export default BackToWebsite;
