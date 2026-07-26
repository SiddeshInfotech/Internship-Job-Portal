/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    // Disabled: the existing Admin/Client dashboards rely on browser
    // default element styling + inline styles. Tailwind's reset would
    // silently change heading/button/input defaults across those pages.
    // Utility classes (bg-*, flex, text-*, etc.) all still work fine
    // without preflight — only the global CSS reset is skipped.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E3A5F',
        accent: '#F59E0B',
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(15, 23, 42, 0.08)',
        lift: '0 12px 40px rgba(15, 23, 42, 0.16)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)',
      },
    },
  },
  plugins: [],
}

