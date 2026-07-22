import React from 'react';

// Maps every status the backend can return onto one of five semantic tones.
const TONE_MAP = {
  ACTIVE: 'green', APPROVED: 'green', VERIFIED: 'green', SHORTLISTED: 'green',
  PENDING: 'amber', 'IN REVIEW': 'amber',
  INTERVIEW: 'blue', OFFERED: 'blue', APPLIED: 'blue',
  BLOCKED: 'red', REJECTED: 'red',
  CLOSED: 'grey',
};

// Renders a colored status pill (design-system .pf-pill). Normalizes
// casing/spacing so "In Review", "in_review", "IN REVIEW" all match.
function StatusPill({ status }) {
  const key = (status || '').toString().toUpperCase().replace(/_/g, ' ');
  const tone = TONE_MAP[key] || 'grey';
  return <span className={`pf-pill pf-pill-${tone}`}>{status}</span>;
}

export default StatusPill;
