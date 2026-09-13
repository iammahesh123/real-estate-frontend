/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf8f2',
          100: '#f5efe0',
          200: '#ebdcbF',
          300: '#dec297',
          400: '#d0a26d',
          500: '#c28549',
          600: '#b46f3d',
          700: '#965534',
          800: '#7a452f',
          900: '#643a29',
          950: '#361d15',
        },
        navy: {
          800: '#111827',
          900: '#0b0f19',
          950: '#070a11',
        },
        emerald: {
          DEFAULT: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 25px rgba(194, 133, 73, 0.25)',
      }
    },
  },
  plugins: [],
}
