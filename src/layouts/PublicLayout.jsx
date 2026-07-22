import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BackToTop from '../components/BackToTop';
import ErrorBoundary from '../components/ErrorBoundary';

/* Reading-progress bar: the signature ember line, stretched across the
   very top of every public page, filling as you scroll. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[70] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #2563eb 0%, #7c8cf8 55%, #f59e0b 100%)',
        boxShadow: '0 0 10px rgba(245,158,11,0.4)',
      }}
    />
  );
}

function PublicLayout() {
  // Cursor spotlight for every .lp-tile across the public site: expose the
  // pointer position as CSS vars that the tile's gradient overlay follows.
  const handleSpot = (e) => {
    const tile = e.target.closest?.('.lp-tile');
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    tile.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="public-site lp-spot-scope font-sans text-[#0F172A] bg-[#F8FAFC]" onPointerMove={handleSpot}>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default PublicLayout;
