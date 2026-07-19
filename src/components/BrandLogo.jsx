import React, { useState } from 'react';

/* The single source of truth for the Placify logo mark.
   Renders the official brand asset (/images/brand/placify-icon.png).
   - `plate`: wraps the mark in a white rounded tile so it stays visible
     on dark surfaces (sidebars, auth panels).
   - Falls back to a "P" tile if the image ever fails to load, so no
     surface is ever left without a mark. */
function BrandLogo({ size = 40, plate = false, className = '', style = {} }) {
  const [imgOk, setImgOk] = useState(true);

  const mark = imgOk ? (
    <img
      src="/images/brand/placify-icon.png"
      alt="Placify"
      onError={() => setImgOk(false)}
      style={{
        width: plate ? size * 0.72 : size,
        height: plate ? size * 0.72 : size,
        objectFit: 'contain',
        display: 'block',
      }}
    />
  ) : (
    <span
      style={{
        fontFamily: 'var(--pf-display)', fontWeight: 700,
        fontSize: size * 0.5, color: plate ? '#0b1526' : '#fff', lineHeight: 1,
      }}
    >
      P
    </span>
  );

  if (!plate) {
    return (
      <div className={className} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, filter: 'drop-shadow(0 6px 14px rgba(11,21,38,0.28))', ...style }}>
        {mark}
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #ffffff 0%, #dbe7ff 100%)',
        boxShadow: '0 6px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
        ...style,
      }}
    >
      {mark}
    </div>
  );
}

export default BrandLogo;
