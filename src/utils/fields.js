// Small helpers for tolerating backend field-name differences.
// The Flask API evolved across the project, so the same concept can arrive
// under different keys (e.g. applied_date vs created_at). `pick` returns
// the first present, non-empty value.
export function pick(obj, ...keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

// Formats anything date-like into "18 Jul 2026". Falls back to the raw
// string if it isn't parseable, and an em dash if it's missing entirely.
export function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
