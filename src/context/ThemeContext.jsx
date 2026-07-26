import React, { createContext, useContext, useEffect, useState } from 'react';

/* Light/Dark theme for the three portals (admin, company, student).
   Default: light. Choice persists in localStorage and is applied as
   data-theme on <html>, which the CSS token overrides key off.
   The public marketing site intentionally stays light — its dark ink
   hero/CTA sections are part of the brand design, not a theme. */
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('placify-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('placify-theme', theme); } catch { /* private mode */ }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
