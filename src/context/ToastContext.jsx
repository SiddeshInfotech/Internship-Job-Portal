import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fail soft: a toast is a nice-to-have. If something upstream went
    // wrong with provider wiring, that should never be able to crash an
    // entire page just because a button wants to show a notification.
    if (import.meta.env?.DEV) {
      console.warn('useToast() called outside <ToastProvider> — toasts will be silently ignored.');
    }
    return { showToast: () => {} };
  }
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-[#0F172A]',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`${colors[t.type] || colors.info} text-white px-5 py-3 rounded-xl shadow-lift text-sm font-medium max-w-xs`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
