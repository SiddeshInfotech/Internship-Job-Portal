import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ============================================================
   BUTTER SECTION — interactive band below the hero.
   A dense ink dot-grid rendered on canvas. Wherever the cursor
   moves, the surface "presses in" like a finger through butter:
   dots near the cursor sink (shrink + darken + get pulled
   slightly toward the press point) and smoothly spring back.
   A pill label — "Find your dream job now →" — follows the
   cursor with buttery lag; clicking anywhere goes to /find-jobs.
   Canvas + rAF keeps it 60fps; touch devices get taps, and
   prefers-reduced-motion gets a static grid.
   ============================================================ */

const DOT_GAP = 26;        // px between dots
const PRESS_RADIUS = 130;  // influence radius of the "press"
const EASE = 0.14;         // cursor smoothing (lower = more butter)

function ButterSection() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const labelRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dots = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999 };   // actual pointer
    const soft = { x: -9999, y: -9999 };    // eased pointer (the butter)
    let press = 0;                          // 0..1, extra sink while mouse is down
    let pressTarget = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = DOT_GAP / 2; y < height; y += DOT_GAP) {
        for (let x = DOT_GAP / 2; x < width; x += DOT_GAP) {
          dots.push({ x, y });
        }
      }
      if (reduced) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(157, 178, 201, 0.28)';
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = () => {
      // buttery lag: the soft cursor chases the real one
      soft.x += (mouse.x - soft.x) * EASE;
      soft.y += (mouse.y - soft.y) * EASE;
      press += (pressTarget - press) * 0.18;

      // label follows the soft cursor (transform only — no re-render)
      const label = labelRef.current;
      if (label) label.style.transform = `translate(${soft.x}px, ${soft.y}px) translate(-50%, -140%) scale(${1 - press * 0.06})`;

      ctx.clearRect(0, 0, width, height);
      const R = PRESS_RADIUS * (1 + press * 0.25);
      for (const d of dots) {
        const dx = d.x - soft.x;
        const dy = d.y - soft.y;
        const dist = Math.hypot(dx, dy);
        let r = 1.6;
        let alpha = 0.28;
        let ox = 0;
        let oy = 0;
        if (dist < R) {
          const t = 1 - dist / R;              // 0 at edge → 1 at center
          const sink = t * t * (1 + press);    // squared falloff = soft butter dent
          r = Math.max(0.3, 1.6 - sink * 1.5); // dots sink (shrink)
          alpha = 0.28 + t * 0.55;             // and glow warmer near the press
          const pull = sink * 7;               // pulled slightly INTO the dent
          if (dist > 0.001) { ox = (-dx / dist) * pull; oy = (-dy / dist) * pull; }
          ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(157, 178, 201, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(d.x + ox, d.y + oy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onTouch = (e) => {
      if (!e.touches[0]) return;
      const rect = wrap.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onDown = () => { pressTarget = 1; };
    const onUp = () => { pressTarget = 0; };

    build();
    window.addEventListener('resize', build);
    if (!reduced) {
      wrap.addEventListener('mousemove', onMove);
      wrap.addEventListener('mouseleave', onLeave);
      wrap.addEventListener('mousedown', onDown);
      window.addEventListener('mouseup', onUp);
      wrap.addEventListener('touchmove', onTouch, { passive: true });
      wrap.addEventListener('touchstart', onTouch, { passive: true });
      wrap.addEventListener('touchend', onLeave);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      window.removeEventListener('mouseup', onUp);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('mousedown', onDown);
      wrap.removeEventListener('touchmove', onTouch);
      wrap.removeEventListener('touchstart', onTouch);
      wrap.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      onClick={() => navigate('/find-jobs')}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="link"
      tabIndex={0}
      aria-label="Find your dream job now — browse all openings"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/find-jobs'); } }}
      className="relative overflow-hidden cursor-none select-none"
      style={{
        height: 'clamp(380px, 58vh, 620px)',
        background: 'linear-gradient(180deg, #0a1322 0%, #0b1526 100%)',
        borderTop: '1px solid rgba(157,178,201,0.1)',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Center hint — fades out once the visitor starts playing */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovering ? 0 : 1 }}
      >
        <p
          className="text-slate-500 text-sm font-semibold tracking-[0.25em] uppercase"
          style={{ fontFamily: 'Sora, Inter, sans-serif' }}
        >
          ✦ &nbsp;Move your cursor&nbsp; ✦
        </p>
      </div>

      {/* The cursor-following pill */}
      <div
        ref={labelRef}
        aria-hidden="true"
        className="absolute top-0 left-0 pointer-events-none whitespace-nowrap transition-opacity duration-200"
        style={{ opacity: hovering ? 1 : 0, willChange: 'transform' }}
      >
        <span
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-[#0B1526] shadow-lg"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f2e8d5 100%)',
            boxShadow: '0 10px 30px rgba(245,158,11,0.35), 0 2px 6px rgba(0,0,0,0.3)',
            fontFamily: 'Sora, Inter, sans-serif',
          }}
        >
          Find your dream job now
          <span className="text-[#d97706]">→</span>
        </span>
      </div>
    </section>
  );
}

export default ButterSection;
