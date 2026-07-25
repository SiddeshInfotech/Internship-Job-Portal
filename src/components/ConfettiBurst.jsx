import React, { useEffect, useRef, useState } from 'react';

/* Premium success celebration:
   1. A soft dark scrim fades in for ~0.4s
   2. A brand-gradient ring expands with an animated checkmark that draws itself
   3. Ribbon confetti streams from behind the badge and rains down
   4. Everything fades out and calls onDone (~1.9s total)
   Canvas confetti + CSS/SVG badge. Respects prefers-reduced-motion. */

const COLORS = ['#2563eb', '#f59e0b', '#159957', '#7c8cf8', '#fbbf24', '#ffffff', '#ff8a3d'];

function ConfettiBurst({ fire, onDone, duration = 1900 }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | show | out

  useEffect(() => {
    if (!fire) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('show');
      const t = setTimeout(() => { setPhase('idle'); onDone?.(); }, 650);
      return () => clearTimeout(t);
    }

    setPhase('show');
    const canvas = canvasRef.current;
    let raf = 0;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth, H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = W / 2, cy = H / 2;
      // Ribbon-style confetti that erupts from behind the centered badge
      const pieces = [];
      for (let i = 0; i < 140; i++) {
        const ang = (Math.PI * 2 * i) / 140 + Math.random() * 0.3;
        const speed = 6 + Math.random() * 11;
        pieces.push({
          x: cx, y: cy,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 4,
          w: 7 + Math.random() * 7,
          h: 10 + Math.random() * 12,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          wobble: Math.random() * Math.PI,
        });
      }
      const start = performance.now();
      const frame = (now) => {
        const t = now - start;
        ctx.clearRect(0, 0, W, H);
        for (const p of pieces) {
          p.vy += 0.34;             // gravity
          p.vx *= 0.99;             // drag
          p.wobble += 0.1;
          p.x += p.vx + Math.sin(p.wobble) * 1.2;
          p.y += p.vy;
          p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - t / duration);
          ctx.fillStyle = p.color;
          // ribbon: draw a curved rectangle for a fluttering feel
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, -p.h / 2);
          ctx.quadraticCurveTo(0, -p.h / 2 + Math.sin(p.wobble) * 3, p.w / 2, -p.h / 2);
          ctx.lineTo(p.w / 2, p.h / 2);
          ctx.quadraticCurveTo(0, p.h / 2 + Math.sin(p.wobble) * 3, -p.w / 2, p.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        if (t < duration) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    const outT = setTimeout(() => setPhase('out'), duration - 450);
    const endT = setTimeout(() => { setPhase('idle'); onDone?.(); }, duration);
    return () => { cancelAnimationFrame(raf); clearTimeout(outT); clearTimeout(endT); };
  }, [fire, duration, onDone]);

  if (!fire || phase === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 3000, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: phase === 'out' ? 'rgba(6,12,22,0)' : 'rgba(6,12,22,0.28)',
        backdropFilter: phase === 'out' ? 'blur(0px)' : 'blur(2px)',
        transition: 'background 420ms ease, backdrop-filter 420ms ease',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0 }} />

      {/* the success badge */}
      <div
        style={{
          position: 'relative',
          transform: phase === 'out' ? 'scale(0.85)' : 'scale(1)',
          opacity: phase === 'out' ? 0 : 1,
          transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease',
        }}
      >
        {/* expanding halo rings */}
        <span className="cb-ring" />
        <span className="cb-ring cb-ring-2" />

        <svg width="112" height="112" viewBox="0 0 112 112" style={{ position: 'relative', filter: 'drop-shadow(0 12px 30px rgba(37,99,235,0.45))' }}>
          <defs>
            <linearGradient id="cb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="56" cy="56" r="52" fill="url(#cb-grad)" />
          <circle cx="56" cy="56" r="52" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
          <path
            className="cb-check"
            d="M34 57 L50 72 L79 41"
            fill="none" stroke="#fff" strokeWidth="8"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default ConfettiBurst;
