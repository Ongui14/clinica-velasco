/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          dark: '#046A28',
          darkHover: '#03521F',
          emerald: '#00AC46',
          emeraldHover: '#00923B',
          light: '#EBF9F0',
          pearl: '#F8FAFC',
          red: '#DC2626',
          redHover: '#B91C1C',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(4, 106, 40, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(4, 106, 40, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'soft-xl': '0 20px 40px -8px rgba(4, 106, 40, 0.12), 0 8px 20px -4px rgba(0, 0, 0, 0.04)',
        'emerald-glow': '0 8px 25px -4px rgba(0, 172, 70, 0.35)',
        'emergency-glow': '0 8px 25px -4px rgba(220, 38, 38, 0.45)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
