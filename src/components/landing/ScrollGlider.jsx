import React from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

/* ============================================================
   SCROLL GLIDER — the About page's travel companion.
   A paper plane rides a dashed vertical rail on the right edge
   of the screen. Its position tracks scroll progress through
   the page (down when you scroll down, back up when you scroll
   up), and it continuously rotates with the scroll — spinning
   forward on the way down and unwinding on the way up, with
   spring physics so every stop feels buttery. It also banks
   (tilts) with scroll velocity, like a real glider catching
   the wind. Pure framer-motion (already a dependency).
   ============================================================ */

function ScrollGlider() {
  const { scrollY, scrollYProgress } = useScroll();

  // Position along the rail: page progress → 12vh..82vh, spring-smoothed
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.6 });
  const top = useTransform(progress, [0, 1], ['12vh', '82vh']);

  // Continuous rotation tied to absolute scroll: down = clockwise,
  // up = counter-clockwise (it literally unwinds as you scroll back).
  const spin = useSpring(useTransform(scrollY, (y) => y * 0.35), {
    stiffness: 55, damping: 16, mass: 0.5,
  });

  // Banking: lean into the direction of travel based on scroll velocity
  const velocity = useVelocity(scrollY);
  const bank = useSpring(useTransform(velocity, [-1600, 0, 1600], [-24, 0, 24]), {
    stiffness: 250, damping: 30,
  });

  // Rail glow fills with progress
  const railFill = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed right-7 top-0 bottom-0 z-30 pointer-events-none"
      style={{ width: '44px' }}
    >
      {/* dashed rail */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '10vh', bottom: '12vh', width: '2px',
          backgroundImage: 'linear-gradient(180deg, rgba(148,163,184,0.45) 45%, transparent 45%)',
          backgroundSize: '2px 10px',
        }}
      />
      {/* rail progress fill — the ember line, vertically */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: '10vh', width: '2.5px', height: railFill, maxHeight: '78vh',
          background: 'linear-gradient(180deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)',
          boxShadow: '0 0 12px rgba(245,158,11,0.35)',
        }}
      />

      {/* the glider */}
      <motion.div className="absolute left-1/2" style={{ top, x: '-50%', y: '-50%' }}>
        <motion.div style={{ rotate: bank }}>
          <motion.div
            style={{ rotate: spin }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
          >
            <svg width="34" height="34" viewBox="0 0 34 34">
              <defs>
                <linearGradient id="glider-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              {/* paper plane */}
              <g filter="drop-shadow(0 4px 10px rgba(11,21,38,0.35))">
                <path d="M4 17 L30 6 L21 29 L16.5 20 Z" fill="url(#glider-grad)" />
                <path d="M16.5 20 L30 6 L18.5 24.5 Z" fill="rgba(255,255,255,0.35)" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
        {/* soft glow under the plane */}
        <div
          className="absolute inset-0 -z-10 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.28), transparent 65%)', transform: 'scale(1.9)' }}
        />
      </motion.div>
    </div>
  );
}

export default ScrollGlider;
