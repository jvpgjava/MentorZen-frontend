/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        zen: {
          orange: '#f97316',
          'orange-light': '#fdba74',
          'orange-dark': '#ea580c',
          black: '#1a1a1a',
          'gray-dark': '#2d2d2d',
          white: '#ffffff',
          'gray-light': '#f5f5f5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'zen': '0 4px 20px rgba(249, 115, 22, 0.1)',
        'zen-lg': '0 8px 40px rgba(249, 115, 22, 0.15)'
      }
    },
  },
  plugins: [],
}

