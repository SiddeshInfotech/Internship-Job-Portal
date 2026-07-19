import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import { useScrolled } from '../hooks/useScrolled';

function BackToTop() {
  const visible = useScrolled(500);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-[#0F172A] text-white shadow-lift flex items-center justify-center"
          aria-label="Back to top"
        >
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
