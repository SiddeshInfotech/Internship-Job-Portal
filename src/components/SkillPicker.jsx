import React, { useMemo, useRef, useState } from 'react';
import { SKILL_SUGGESTIONS } from '../utils/skillsData';

/* Type-ahead skill input: filters a shared suggestion list as you type,
   but always lets you add your own value (Enter / comma / "Add" button).
   Used by both the student profile wizard and the company job-post form. */
function SkillPicker({ value, onChange, onAdd, placeholder = 'Type a skill...', inputClassName = '', exclude = [], fillMode = false }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);

  const matches = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    const taken = new Set(exclude.map((s) => String(s).toLowerCase()));
    return SKILL_SUGGESTIONS
      .filter((s) => !taken.has(s.toLowerCase()))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [value, exclude]);

  const commit = (skill) => {
    if (fillMode) {
      // Fill the input with the picked value (caller adds it explicitly).
      onChange(skill);
    } else {
      // Chip mode: hand the value to the caller and clear for the next entry.
      onAdd(skill);
      onChange('');
    }
    setOpen(false);
    setHighlight(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHighlight((h) => Math.min(h + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (open && matches[highlight] && value.trim()) commit(matches[highlight]);
      else if (value.trim()) commit(value.trim());
    } else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName}
        aria-label="Add a skill"
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
            listStyle: 'none', margin: 0, padding: '5px',
            background: 'var(--pf-card)', border: '1px solid var(--pf-line-strong)',
            borderRadius: '11px', boxShadow: 'var(--pf-shadow-md)',
            maxHeight: '210px', overflowY: 'auto',
          }}
        >
          {matches.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => { e.preventDefault(); commit(s); }}
              onMouseEnter={() => setHighlight(i)}
              style={{
                padding: '8px 11px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '13.5px', fontWeight: 500,
                background: i === highlight ? 'var(--pf-primary-soft)' : 'transparent',
                color: i === highlight ? 'var(--pf-primary-deep)' : 'var(--pf-text-2)',
              }}
            >
              {s}
            </li>
          ))}
          {value.trim() && !matches.some((m) => m.toLowerCase() === value.trim().toLowerCase()) && (
            <li
              role="option"
              aria-selected={false}
              onMouseDown={(e) => { e.preventDefault(); commit(value.trim()); }}
              style={{ padding: '8px 11px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--pf-text-3)', borderTop: '1px solid var(--pf-line)', marginTop: '3px' }}
            >
              ＋ Add "{value.trim()}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SkillPicker;
