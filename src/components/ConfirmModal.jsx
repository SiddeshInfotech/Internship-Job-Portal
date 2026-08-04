import React from 'react';
import { createPortal } from 'react-dom';

// Generic confirmation dialog used for Block/Delete/Approve/Reject/
// Shortlist actions across all admin pages. Rendered via a portal to
// document.body so it always centers on the viewport, never trapped
// inside a scrolled/overflow container or a transformed ancestor.
function ConfirmModal({ open, title, message, confirmLabel, confirmColor = '#dc2626', onConfirm, onCancel, loading, children }) {
  if (!open) return null;

  // Map the legacy confirmColor prop onto design-system button styles so
  // existing call sites keep their semantic color without any changes.
  const isDanger = ['#dc2626', '#d92d20', '#ef4444', 'red'].includes((confirmColor || '').toLowerCase());
  const iconTone = isDanger
    ? { bg: 'var(--pf-red-bg)', fg: 'var(--pf-red)', glyph: '⚠' }
    : { bg: 'var(--pf-blue-bg)', fg: 'var(--pf-blue)', glyph: '✓' };

  return createPortal(
    <div className="pf-modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-label={title}>
      <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-modal-icon" style={{ background: iconTone.bg, color: iconTone.fg }} aria-hidden="true">
          {iconTone.glyph}
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
        <div className="pf-modal-actions">
          <button onClick={onCancel} disabled={loading} className="pf-btn pf-btn-ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`pf-btn ${isDanger ? 'pf-btn-danger' : 'pf-btn-primary'}`}
            style={!isDanger && confirmColor && confirmColor !== '#dc2626' ? { background: confirmColor } : undefined}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmModal;
