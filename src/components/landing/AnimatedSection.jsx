import React from 'react';
import { motion } from 'framer-motion';

// Generic "fade + slide up while scrolling into view" wrapper used across
// every section of the marketing site.
function AnimatedSection({ children, className = '', delay = 0, y = 30 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;
